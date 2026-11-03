import { NextResponse } from 'next/server';
import { services, serviceIds } from '../../../catalog';
import { generateInstantConciergeReply, isRetryableGeminiStatus, parseAssistantReply, sanitizeMessages } from '../logic';

export const dynamic = 'force-dynamic';

const requestTimes: number[] = [];
const responseSchema = {
  type: 'OBJECT',
  properties: {
    kind: { type: 'STRING', enum: ['chat', 'clarify', 'itinerary', 'service_search'] },
    message: { type: 'STRING' },
    choices: { type: 'ARRAY', minItems: 2, maxItems: 4, items: { type: 'STRING' } },
    preferences: {
      type: 'OBJECT',
      properties: {
        days: { type: ['INTEGER', 'NULL'] },
        guests: { type: ['INTEGER', 'NULL'] },
        budgetVnd: { type: ['INTEGER', 'NULL'] },
        interest: { type: 'STRING' },
      },
      required: ['days', 'guests', 'budgetVnd', 'interest'],
    },
    plan: {
      type: ['OBJECT', 'NULL'],
      properties: {
        title: { type: 'STRING' },
        days: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              day: { type: 'INTEGER' },
              activities: {
                type: 'ARRAY',
                minItems: 3,
                maxItems: 5,
                items: {
                  type: 'OBJECT',
                  properties: {
                    serviceId: { type: 'STRING', enum: [...serviceIds] },
                    time: { type: 'STRING', description: 'Local time in 24-hour HH:mm format, for example 09:00.' },
                    endTime: { type: 'STRING', description: 'Expected end time in local 24-hour HH:mm format.' },
                    durationMinutes: { type: 'INTEGER' },
                    note: { type: 'STRING' },
                    logistics: { type: 'STRING' },
                    tips: { type: 'STRING' },
                  },
                  required: ['serviceId', 'time', 'endTime', 'durationMinutes', 'note', 'logistics', 'tips'],
                },
              },
            },
            required: ['day', 'activities'],
          },
        },
      },
      required: ['title', 'days'],
    },
    title: { type: ['STRING', 'NULL'] },
    recommendations: {
      type: ['ARRAY', 'NULL'],
      items: {
        type: 'OBJECT',
        properties: {
          serviceId: { type: 'STRING', enum: [...serviceIds] },
          reason: { type: 'STRING' },
        },
        required: ['serviceId', 'reason'],
      },
    },
  },
  required: ['kind', 'message', 'preferences'],
} as const;

function tooManyRequests(): boolean {
  const now = Date.now();
  while (requestTimes.length && requestTimes[0] < now - 60_000) requestTimes.shift();
  if (requestTimes.length >= 12) return true;
  requestTimes.push(now);
  return false;
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'Gemini is not configured.', code: 'GEMINI_NOT_CONFIGURED' }, { status: 503 });
  if (tooManyRequests()) return NextResponse.json({ error: 'Too many local demo requests. Try again shortly.', code: 'LOCAL_RATE_LIMIT' }, { status: 429 });
  if (Number(request.headers.get('content-length') || 0) > 20_000) return NextResponse.json({ error: 'The chat request is too large.' }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const input = body as Record<string, unknown>;
  const messages = sanitizeMessages(input.messages);
  const lang = input.lang === 'en' ? 'en' : input.lang === 'vi' ? 'vi' : null;
  if (!lang || !messages.length || messages[messages.length - 1].role !== 'user') return NextResponse.json({ error: 'A user message is required.' }, { status: 400 });

  const rawPlan = input.currentPlan && typeof input.currentPlan === 'object' && !Array.isArray(input.currentPlan)
    ? input.currentPlan as Record<string, unknown> : null;
  const currentPlan = Array.isArray(rawPlan?.days) ? rawPlan.days.slice(0, 5).map((rawDay, dayIndex) => {
    const day = rawDay && typeof rawDay === 'object' && !Array.isArray(rawDay) ? rawDay as Record<string, unknown> : {};
    return {
      day: dayIndex + 1,
      activities: Array.isArray(day.activities) ? day.activities.slice(0, 5).flatMap((rawActivity) => {
        const activity = rawActivity && typeof rawActivity === 'object' && !Array.isArray(rawActivity) ? rawActivity as Record<string, unknown> : {};
        return typeof activity.serviceId === 'string' && serviceIds.includes(activity.serviceId)
          ? [{ serviceId: activity.serviceId, time: typeof activity.time === 'string' && /^\d{2}:\d{2}$/.test(activity.time) ? activity.time : '09:00' }]
          : [];
      }) : [],
    };
  }) : null;

  // Streamlined catalog to keep prompt small and fast
  const catalog = services.map(({ id, category, area, vi, en, price, priceUnit }) => ({ id, category, area, vi, en, price, priceUnit }));
  const systemInstruction = `Bạn là GOPU AI, một trợ lý du lịch Phú Quốc thân thiện, am hiểu và phản hồi cực kỳ nhanh nhẹn. Trả lời bằng ${lang === 'vi' ? 'tiếng Việt' : 'English'}.
QUY TẮC CỐT LÕI:
1. TRÒ CHUYỆN BÌNH THƯỜNG: Khi người dùng chào hỏi, hỏi thông tin chung, thời tiết, món ăn, điểm tham quan, lịch sử, kinh nghiệm: Trả lời tự nhiên, nhiệt tình và súc tích (khoảng 2-4 câu). Đặt kind="chat", plan=null, recommendations=null. TUYỆT ĐỐI KHÔNG TỰ Ý LÊN LỊCH TRÌNH VÀ KHÔNG ĐÒI HỎI SỐ NGÀY/NGÂN SÁCH KHI NGƯỜI DÙNG CHƯA YÊU CẦU LÊN PLAN.
2. CHỈ LÊN LỊCH TRÌNH KHI NGƯỜI DÙNG YÊU CẦU: Chỉ khi người dùng nói rõ ràng muốn lập lịch trình, lên plan, tạo kế hoạch chuyến đi (ví dụ: "lên lịch trình cho tôi", "lập plan 3 ngày 2 đêm", "xếp lịch trình đi Phú Quốc"):
   - Nếu còn thiếu thông tin quan trọng: Hỏi đúng 1 câu ngắn, đặt kind="clarify" kèm 2-4 choices ngắn gọn để người dùng bấm chọn nhanh.
   - Khi đã có thông tin: Tạo lịch trình chi tiết và đặt kind="itinerary" kèm trường plan.
   - QUY TẮC TỐI ƯU TỐC ĐỘ PHẢN HỒI:
     + Mỗi ngày (day) có 3-4 hoạt động (activities) với đủ 3 khung giờ: Sáng (morning, 08:00-10:00), Trưa (lunch, 11:30-13:00), Tối (evening, 18:00-20:00).
     + serviceId BẮT BUỘC chọn từ: ${serviceIds.join(', ')}.
     + ĐẶC BIỆT: Các trường note, logistics, tips phải viết thật ngắn gọn, mỗi trường đúng 1 câu súc tích (dưới 15 từ) để tạo kết quả nhanh nhất cho người dùng.
3. TÌM KIẾM DỊCH VỤ: Nếu người dùng hỏi tìm kiếm, gợi ý địa điểm cụ thể, trả kind="service_search" hoặc "chat" kèm recommendations phù hợp.
Catalog demo: ${JSON.stringify(catalog)}
${currentPlan ? `Lịch trình hiện tại: ${JSON.stringify(currentPlan)}` : ''}`;

  const contents = messages.map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.text }] }));

  // Attempt remote Gemini with a short 1500ms timeout for snappy responsiveness
  if (process.env.GEMINI_API_KEY) {
    const models = [...new Set([
      process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
    ])];

    for (let index = 0; index < models.length; index += 1) {
      const model = models[index];
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: { responseMimeType: 'application/json', responseJsonSchema: responseSchema, maxOutputTokens: 1400 },
          }),
          signal: AbortSignal.timeout(1500),
        });

        if (response.ok) {
          const result: unknown = await response.json();
          const candidate = (result as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates?.[0];
          const text = candidate?.content?.parts?.map((part) => part.text || '').join('');
          const reply = text ? parseAssistantReply(text, serviceIds) : null;
          if (reply) {
            return NextResponse.json(reply, { headers: { 'cache-control': 'no-store' } });
          }
        }
        // If 429, 503, or invalid response, break and use instant concierge
        break;
      } catch {
        // If timeout (>1.5s) or network error, break and use instant concierge
        break;
      }
    }
  }

  // Instant local concierge responds in < 1ms: ensures responses always return in ~1-2 seconds
  const instantReply = generateInstantConciergeReply(messages, lang, serviceIds);
  return NextResponse.json(instantReply, { headers: { 'cache-control': 'no-store' } });
}
