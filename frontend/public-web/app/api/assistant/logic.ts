export type ChatMessage = { role: 'user' | 'assistant'; text: string };

export type TripPreferences = {
  days: number | null;
  guests: number | null;
  budgetVnd: number | null;
  interest: string;
};

export type AssistantActivity = { serviceId: string; time: string; endTime: string; durationMinutes: number; note: string; logistics: string; tips: string };
export type AssistantPlan = { title: string; days: Array<{ day: number; activities: AssistantActivity[] }> };
export type ServiceRecommendation = { serviceId: string; reason: string };
export type AssistantReply =
  | { kind: 'chat'; message: string; preferences: TripPreferences }
  | { kind: 'clarify'; message: string; preferences: TripPreferences; choices: string[] }
  | { kind: 'itinerary'; message: string; preferences: TripPreferences; plan: AssistantPlan }
  | { kind: 'service_search'; message: string; preferences: TripPreferences; title: string; recommendations: ServiceRecommendation[] };

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const validPreferenceNumber = (value: unknown, min: number, max: number) => value === null || (Number.isInteger(value) && Number(value) >= min && Number(value) <= max);
const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);

export function isRetryableGeminiStatus(status: number): boolean {
  return RETRYABLE_GEMINI_STATUSES.has(status);
}

export function buildVisibleMessages(messages: readonly ChatMessage[], pendingUserText: string | null): ChatMessage[] {
  const text = pendingUserText?.trim();
  return text ? [...messages, { role: 'user', text }] : [...messages];
}

export type DayPeriod = 'morning' | 'lunch' | 'afternoon' | 'evening';

export function getDayPeriod(time: string): DayPeriod {
  const hour = Number(time.slice(0, 2));
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 18) return 'afternoon';
  return 'evening';
}

function normalizeAssistantTime(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLocaleLowerCase();
  const clock = normalized.match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)?$/i);
  if (clock) {
    let hour = Number(clock[1]);
    const minute = Number(clock[2]);
    if (clock[3]) {
      if (hour < 1 || hour > 12) return null;
      if (clock[3].toLowerCase() === 'am') hour = hour === 12 ? 0 : hour;
      else hour = hour === 12 ? 12 : hour + 12;
    } else if (hour > 23) return null;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  const vietnameseClock = normalized.match(/^(\d{1,2})(?::([0-5]\d))?\s*(?:giờ|h)?\s*(sáng|trưa|chiều|tối)?$/i);
  if (!vietnameseClock) return null;
  let hour = Number(vietnameseClock[1]);
  const minute = Number(vietnameseClock[2] || '0');
  const period = vietnameseClock[3];
  if (period) {
    if (hour < 1 || hour > 12) return null;
    if (period === 'sáng') hour = hour === 12 ? 0 : hour;
    else if (period === 'trưa') hour = hour === 12 ? 12 : hour + 12;
    else hour = hour === 12 ? 12 : hour + 12;
  } else if (hour > 23) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const total = (hour * 60 + minute + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function sanitizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-16).flatMap((item) => {
    if (!isRecord(item) || !['user', 'assistant'].includes(String(item.role)) || typeof item.text !== 'string') return [];
    const text = item.text.trim().slice(0, 800)
      .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[đã ẩn thông tin liên hệ]')
      .replace(/(?:\+?\d[\s().-]*){9,}/g, '[đã ẩn thông tin liên hệ]');
    return text ? [{ role: item.role as ChatMessage['role'], text }] : [];
  });
}

export function parseAssistantReply(raw: string, allowedServiceIds: readonly string[]): AssistantReply | null {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!isRecord(value) || typeof value.message !== 'string' || value.message.length > 1600 || !isRecord(value.preferences)) return null;

  const preferences = value.preferences;
  if (!validPreferenceNumber(preferences.days, 1, 5) || !validPreferenceNumber(preferences.guests, 1, 20) || !validPreferenceNumber(preferences.budgetVnd, 100_000, 100_000_000) || typeof preferences.interest !== 'string' || preferences.interest.length > 80) return null;
  const normalizedPreferences = {
    days: preferences.days as number | null,
    guests: preferences.guests as number | null,
    budgetVnd: preferences.budgetVnd as number | null,
    interest: preferences.interest,
  };

  if (value.kind === 'chat') return { kind: 'chat', message: value.message, preferences: normalizedPreferences };
  if (value.kind === 'clarify') {
    if (!Array.isArray(value.choices) || value.choices.length < 2 || value.choices.length > 4) return null;
    const choices = value.choices.map((choice) => typeof choice === 'string' ? choice.trim() : '');
    if (choices.some((choice) => !choice || choice.length > 100) || new Set(choices).size !== choices.length) return null;
    return { kind: 'clarify', message: value.message, preferences: normalizedPreferences, choices };
  }
  if (value.kind === 'service_search') {
    if (typeof value.title !== 'string' || !value.title.trim() || value.title.length > 120 || !Array.isArray(value.recommendations) || value.recommendations.length > 8) return null;
    const recommendations = value.recommendations.map((item) => {
      if (!isRecord(item) || typeof item.serviceId !== 'string') return null;
      const normalizedServiceId = item.serviceId.trim().replace(/_/g, '-');
      if (!allowedServiceIds.includes(normalizedServiceId) || typeof item.reason !== 'string' || !item.reason.trim() || item.reason.length > 240) return null;
      return { serviceId: normalizedServiceId, reason: item.reason.trim() };
    });
    if (recommendations.some((item) => item === null)) return null;
    return { kind: 'service_search', message: value.message, preferences: normalizedPreferences, title: value.title.trim(), recommendations: recommendations as ServiceRecommendation[] };
  }
  if (value.kind !== 'itinerary' || !isRecord(value.plan) || typeof value.plan.title !== 'string' || value.plan.title.length > 120 || !Array.isArray(value.plan.days)) return null;
  if (value.plan.days.length < 1 || value.plan.days.length > 5 || (normalizedPreferences.days && value.plan.days.length !== normalizedPreferences.days)) return null;

  const days = value.plan.days.map((day, index) => {
    if (!isRecord(day) || day.day !== index + 1 || !Array.isArray(day.activities) || day.activities.length < 3 || day.activities.length > 5) return null;
    const activities = day.activities.map((activity) => {
      if (!isRecord(activity) || typeof activity.serviceId !== 'string') return null;
      const normalizedServiceId = activity.serviceId.trim().replace(/_/g, '-');
      if (!allowedServiceIds.includes(normalizedServiceId) || typeof activity.note !== 'string' || activity.note.length > 240) return null;
      const time = normalizeAssistantTime(activity.time);
      if (!time) return null;
      const endTime = normalizeAssistantTime(activity.endTime) || addMinutesToTime(time, 60);
      const startMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
      const endMinutes = Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3));
      const derivedDuration = (endMinutes - startMinutes + 24 * 60) % (24 * 60) || 60;
      const durationMinutes = Number.isInteger(activity.durationMinutes) && Number(activity.durationMinutes) >= 15 && Number(activity.durationMinutes) <= 720
        ? Number(activity.durationMinutes)
        : derivedDuration;
      const logistics = typeof activity.logistics === 'string' ? activity.logistics.slice(0, 200) : '';
      const tips = typeof activity.tips === 'string' ? activity.tips.slice(0, 200) : '';
      return { serviceId: normalizedServiceId, time, endTime, durationMinutes, note: activity.note, logistics, tips };
    });
    if (activities.some((activity) => activity === null)) return null;
    const scheduledActivities = (activities as AssistantActivity[]).sort((first, second) => first.time.localeCompare(second.time));
    const periods = new Set(scheduledActivities.map((activity) => getDayPeriod(activity.time)));
    if (!periods.has('morning') || !periods.has('lunch') || !periods.has('evening')) return null;
    return { day: day.day as number, activities: scheduledActivities };
  });
  if (days.some((day) => day === null)) return null;
  return { kind: 'itinerary', message: value.message, preferences: normalizedPreferences, plan: { title: value.plan.title, days: days as AssistantPlan['days'] } };
}

export function generateInstantConciergeReply(
  messages: readonly ChatMessage[],
  lang: 'vi' | 'en' = 'vi',
  _allowedServiceIds: readonly string[] = []
): AssistantReply {
  const lastUserText = [...messages].reverse().find((m) => m.role === 'user')?.text || '';
  const lower = lastUserText.toLowerCase();

  const isPlanRequest = /plan|lịch trình|lich trinh|kế hoạch|ke hoach|chuyến đi|chuyen di|lên lịch|len lich|tour|ngày|ngay|đêm|dem|hành trình|hanh trinh/i.test(lower);

  // 1. Conversational questions
  if (!isPlanRequest) {
    if (/chào|hello|hi|bạn là ai|who are you/i.test(lower)) {
      return {
        kind: 'chat',
        message: lang === 'vi'
          ? 'Chào bạn! Mình là GOPU AI, trợ lý du lịch Phú Quốc. Mình có thể giúp bạn kiểm tra thời tiết biển, quán ăn ngon, bãi biển đẹp hoặc lên lịch trình chi tiết theo ngân sách và số người. Bạn cần mình hỗ trợ gì hôm nay?'
          : 'Hi! I am GOPU AI, your Phu Quoc travel concierge. I can share sea weather updates, dining recommendations, or build a personalized itinerary for you. How can I help today?',
        preferences: { days: null, guests: null, budgetVnd: null, interest: 'mixed' },
      };
    }
    if (/thời tiết|thoi tiet|mưa|nắng|sóng|biển động|weather|rain|sunny/i.test(lower)) {
      return {
        kind: 'chat',
        message: lang === 'vi'
          ? 'Thời tiết Phú Quốc hiện tại rất đẹp: trời nắng ráo nhiệt độ 28–31°C, biển êm, sóng nhẹ, nước biển trong xanh. Rất lý tưởng cho các hoạt động tắm biển Bãi Sao, cáp treo Hòn Thơm và đi cano lặn ngắm san hô cụm đảo An Thới!'
          : 'The weather in Phu Quoc is currently excellent: warm and sunny around 28–31°C with calm seas and clear waters. Ideal for visiting Bai Sao, the Hon Thom cable car, and speedboat snorkeling in An Thoi!',
        preferences: { days: null, guests: null, budgetVnd: null, interest: 'beach' },
      };
    }
    if (/ăn|món|hải sản|nhà hàng|quán|bún quậy|food|restaurant|eat|seafood/i.test(lower)) {
      return {
        kind: 'chat',
        message: lang === 'vi'
          ? 'Đặc sản Phú Quốc bạn nhất định phải thử: 1) Bún Quậy Kiến Xây (đường Bạch Đằng) với nước chấm tự pha độc đáo; 2) Hải sản tươi sống chọn tại hồ ở Nhà hàng Ra Khơi (đường 30/4); 3) View biển hoàng hôn lãng mạn tại Nhà hàng Xin Chào; 4) Gỏi cá trích cuốn rau rừng và cá bớp kho tộ tại Sông Xanh!'
          : 'Top food spots in Phu Quoc: 1) Bun Quay Kien Xay with custom dipping sauce; 2) Live seafood from the tank at Ra Khoi Restaurant; 3) Sunset sea-view dining at Xin Chao; 4) Herring salad and clay-pot cobia at Song Xanh Restaurant!',
        preferences: { days: null, guests: null, budgetVnd: null, interest: 'food' },
      };
    }
    return {
      kind: 'chat',
      message: lang === 'vi'
        ? 'Phú Quốc có rất nhiều điểm đến nổi bật như Cảng An Thới, tour cano 4 đảo, Bãi Sao cát trắng, Sunset Sanato ngắm hoàng hôn và chợ đêm Dương Đông. Bạn muốn khám phá khu vực nào hoặc cần mình lên lịch trình cho mấy ngày?'
        : 'Phu Quoc features amazing destinations: An Thoi archipelago, Bai Sao white sand beach, Sunset Sanato, and Duong Dong night market. How many days would you like me to plan for your trip?',
      preferences: { days: null, guests: null, budgetVnd: null, interest: 'mixed' },
    };
  }

  // 2. Extract preferences for trip plan
  let days = 2;
  const daysMatch = lower.match(/(?:trong\s*)?(\d+)\s*(?:ngày|ngay|day|n(?:\d+d)?)\b/i);
  if (daysMatch) {
    days = Math.min(5, Math.max(1, Number(daysMatch[1])));
  }

  let guests = 2;
  if (/1\s*(?:ng|người|nguoi|pax|khách|khach)\b/i.test(lower)) {
    guests = 1;
  } else {
    const guestsMatch = lower.match(/(\d+)\s*(?:người|nguoi|ng|khách|khach|pax|guest)\b/i);
    if (guestsMatch) {
      guests = Math.min(10, Math.max(1, Number(guestsMatch[1])));
    } else if (/gia đình|family/i.test(lower)) {
      guests = 4;
    } else if (/cặp đôi|couple/i.test(lower)) {
      guests = 2;
    }
  }

  let budgetVnd = days * guests * 1_500_000;
  const budgetMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:triệu|tr|m|trđ)\b/i);
  if (budgetMatch) {
    const val = parseFloat(budgetMatch[1].replace(',', '.'));
    if (!Number.isNaN(val) && val > 0) {
      budgetVnd = Math.round(val * 1_000_000);
    }
  } else if (/(\d{7,9})\b/.test(lower)) {
    const rawNum = lower.match(/(\d{7,9})\b/);
    if (rawNum) budgetVnd = Number(rawNum[1]);
  }
  budgetVnd = Math.min(50_000_000, Math.max(500_000, budgetVnd));

  let interest = 'mixed';
  if (/biển|đảo|lặn|cano|bãi sao|san hô|beach|island/i.test(lower)) {
    interest = 'beach';
  } else if (/nghỉ dưỡng|thư giãn|spa|resort|yên tĩnh|relax|calm/i.test(lower)) {
    interest = 'calm';
  }

  const allDays: AssistantPlan['days'] = [];

  for (let d = 1; d <= days; d += 1) {
    const activities: AssistantActivity[] = [];

    if (d === 1) {
      activities.push({
        serviceId: 'bun-quay-kien-xay',
        time: '08:30',
        endTime: '10:00',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Thưởng thức bún quậy trứ danh, tự tay pha nước chấm theo khẩu vị.' : 'Enjoy famous Bun Quay with custom dipping sauce.',
        logistics: lang === 'vi' ? 'Đường Bạch Đằng, Dương Đông.' : 'Bach Dang Street, Duong Dong.',
        tips: lang === 'vi' ? 'Nên ghé sớm để có chỗ ngồi thoáng và không phải chờ lâu.' : 'Visit before 9 AM to avoid peak queues.',
      });
      activities.push({
        serviceId: 'com-nha-phu-quoc',
        time: '11:30',
        endTime: '13:00',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Bữa trưa cơm nhà vị biển đảo với cá bớp kho tộ và canh chua nóng hổi.' : 'Lunch with homestyle clay-pot cobia and sour soup.',
        logistics: lang === 'vi' ? 'Khu vực Dương Đông, dễ di chuyển.' : 'Duong Dong area, easy access.',
        tips: lang === 'vi' ? 'Khẩu phần vừa vặn, chuẩn vị cơm gia đình địa phương.' : 'Generous portions, authentic local taste.',
      });
      activities.push({
        serviceId: budgetVnd >= 1_500_000 ? 'cano-an-thoi' : 'bien-bai-sao',
        time: '14:00',
        endTime: '17:00',
        durationMinutes: 180,
        note: budgetVnd >= 1_500_000
          ? (lang === 'vi' ? 'Đi cano khám phá các hòn đảo phía nam, lặn ngắm san hô tự nhiên.' : 'Speedboat tour exploring southern islets and coral reefs.')
          : (lang === 'vi' ? 'Dạo bước bãi cát trắng mịn Bãi Sao, tắm biển và thư giãn.' : 'Relax and swim at Bai Sao white sandy beach.'),
        logistics: lang === 'vi' ? 'Di chuyển về hướng Nam Đảo.' : 'Travel south towards An Thoi.',
        tips: lang === 'vi' ? 'Mang theo kem chống nắng, kính râm và túi chống nước.' : 'Bring sunscreen, sunglasses, and waterproof bag.',
      });
      activities.push({
        serviceId: 'nha-hang-ra-khoi',
        time: '18:30',
        endTime: '20:30',
        durationMinutes: 120,
        note: lang === 'vi' ? 'Thưởng thức hải sản tươi sống chọn tại hồ bên đường 30/4.' : 'Dinner with live seafood picked from the tank on 30/4 Street.',
        logistics: lang === 'vi' ? 'Mặt tiền đường 30/4, trung tâm Dương Đông.' : 'Main road 30/4, Duong Dong center.',
        tips: lang === 'vi' ? 'Nên thử cá mú hấp Hồng Kông và tôm hùm nướng.' : 'Recommended: Steamed grouper and grilled lobster.',
      });
    } else if (d === 2) {
      activities.push({
        serviceId: 'cap-treo-hon-thom',
        time: '08:30',
        endTime: '11:30',
        durationMinutes: 180,
        note: lang === 'vi' ? 'Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới ngắm biển An Thới.' : 'World longest 3-wire cable car with panoramic sea view.',
        logistics: lang === 'vi' ? 'Ga Ánh Dương, An Thới.' : 'Sun World Station, An Thoi.',
        tips: lang === 'vi' ? 'Ngồi sát cửa kính cáp treo chụp toàn cảnh làng chài tuyệt đẹp.' : 'Sit near window for scenic photo opportunities.',
      });
      activities.push({
        serviceId: 'nha-hang-xin-chao',
        time: '12:00',
        endTime: '13:30',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Dùng bữa trưa bên view biển lộng gió tại trung tâm thị trấn.' : 'Seaview lunch in the center of Duong Dong.',
        logistics: lang === 'vi' ? 'Đường Trần Hưng Đạo, Dương Đông.' : 'Tran Hung Dao Street, Duong Dong.',
        tips: lang === 'vi' ? 'Món cá nướng than và cocktail rất ngon miệng.' : 'Try the charcoal-grilled seafood and cocktails.',
      });
      activities.push({
        serviceId: 'sunset-sanato-phu-quoc',
        time: '15:30',
        endTime: '18:00',
        durationMinutes: 150,
        note: lang === 'vi' ? 'Check-in các tác phẩm nghệ thuật bờ biển và ngắm hoàng hôn rực rỡ.' : 'Beach art installations and iconic sunset view.',
        logistics: lang === 'vi' ? 'Khu Bãi Trường, Dương Tơ.' : 'Bai Truong, Duong To.',
        tips: lang === 'vi' ? 'Khung giờ hoàng hôn đẹp nhất từ 17:15 đến 18:00.' : 'Best sunset photography from 5:15 PM to 6:00 PM.',
      });
      activities.push({
        serviceId: 'nha-hang-song-xanh',
        time: '18:30',
        endTime: '20:30',
        durationMinutes: 120,
        note: lang === 'vi' ? 'Thưởng thức gỏi cá trích đặc sản và lẩu cá bớp ven sông Dương Đông.' : 'Herring salad and cobia hotpot by the riverside.',
        logistics: lang === 'vi' ? 'Đường 30/4, gần cầu Dương Đông.' : '30/4 Street, near Duong Dong bridge.',
        tips: lang === 'vi' ? 'Gỏi cá trích ăn kèm bánh tráng và nước chấm chua ngọt.' : 'Eat herring salad with rice paper and dipping sauce.',
      });
    } else if (d === 3) {
      activities.push({
        serviceId: 'thue-xe-may',
        time: '08:30',
        endTime: '10:30',
        durationMinutes: 120,
        note: lang === 'vi' ? 'Nhận xe máy khám phá các cung đường ven biển và rừng nguyên sinh.' : 'Pick up scooter to explore coastal roads and national park.',
        logistics: lang === 'vi' ? 'Giao xe tận nơi tại điểm lưu trú.' : 'Delivered directly to your stay.',
        tips: lang === 'vi' ? 'Kiểm tra thắng xe và đổ đầy bình xăng trước khi xuất phát.' : 'Check brakes and fuel up before departing.',
      });
      activities.push({
        serviceId: 'hai-san-bai-truong',
        time: '12:00',
        endTime: '13:30',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Bữa trưa ghẹ Hàm Ninh và tôm nướng muối ớt bên bãi biển.' : 'Lunch with Ham Ninh crab and grilled tiger prawns.',
        logistics: lang === 'vi' ? 'Ven đường Trần Hưng Đạo, Bãi Trường.' : 'Tran Hung Dao, Bai Truong.',
        tips: lang === 'vi' ? 'Ghẹ chắc thịt và hấp bia sả rất thơm.' : 'Fresh steamed crabs with lemongrass.',
      });
      activities.push({
        serviceId: 'spa-duong-dong',
        time: '15:00',
        endTime: '16:30',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Liệu trình massage tinh dầu thảo mộc phục hồi sức sống.' : 'Herbal oil massage therapy to restore energy.',
        logistics: lang === 'vi' ? 'Trung tâm Dương Đông.' : 'Duong Dong center.',
        tips: lang === 'vi' ? 'Uống trà thảo mộc ấm sau liệu trình giúp thư giãn sâu.' : 'Sip warm herbal tea post-treatment.',
      });
      activities.push({
        serviceId: 'cau-muc-dem-an-thoi',
        time: '17:30',
        endTime: '21:00',
        durationMinutes: 210,
        note: lang === 'vi' ? 'Lên tàu câu mực đêm ngắm biển đảo lung linh và ăn cháo mực nóng.' : 'Night squid fishing boat tour with hot squid porridge.',
        logistics: lang === 'vi' ? 'Tập trung tại Cảng An Thới lúc 17:30.' : 'Meet at An Thoi harbor at 5:30 PM.',
        tips: lang === 'vi' ? 'Mặc áo ấm nhẹ vì biển đêm có gió mát.' : 'Bring a light jacket as night breeze can be cool.',
      });
    } else {
      activities.push({
        serviceId: 'xe-san-bay',
        time: '09:00',
        endTime: '10:00',
        durationMinutes: 60,
        note: lang === 'vi' ? 'Xe đưa đón riêng tiện lợi, tài xế bản địa chu đáo.' : 'Private transfer, punctual local driver.',
        logistics: lang === 'vi' ? 'Đón tại điểm lưu trú.' : 'Pickup at your hotel.',
        tips: lang === 'vi' ? 'Có mặt trước giờ bay 90 phút.' : 'Be ready 90 mins before departure.',
      });
      activities.push({
        serviceId: 'com-nha-phu-quoc',
        time: '11:30',
        endTime: '13:00',
        durationMinutes: 90,
        note: lang === 'vi' ? 'Bữa trưa ấm cúng chia tay Đảo Ngọc.' : 'Farewell lunch with local flavors.',
        logistics: lang === 'vi' ? 'Dương Đông.' : 'Duong Dong.',
        tips: lang === 'vi' ? 'Mua nước mắm và tiêu Phú Quốc làm quà.' : 'Pick up fish sauce and pepper as souvenirs.',
      });
      activities.push({
        serviceId: 'bien-bai-sao',
        time: '14:30',
        endTime: '17:00',
        durationMinutes: 150,
        note: lang === 'vi' ? 'Thư thả ngắm cảnh biển trước khi về.' : 'Relaxing beach stroll before return.',
        logistics: lang === 'vi' ? 'Bãi Sao.' : 'Bai Sao.',
        tips: lang === 'vi' ? 'Chụp ảnh kỷ niệm bên hàng dừa nghiêng.' : 'Photo with leaning palm trees.',
      });
      activities.push({
        serviceId: 'nha-hang-ra-khoi',
        time: '18:30',
        endTime: '20:30',
        durationMinutes: 120,
        note: lang === 'vi' ? 'Bữa tối hải sản trọn vẹn kết thúc chuyến đi.' : 'Farewell seafood dinner.',
        logistics: lang === 'vi' ? 'Đường 30/4 Dương Đông.' : '30/4 Street.',
        tips: lang === 'vi' ? 'Thưởng thức mực nướng và cơm chiên ghẹ.' : 'Enjoy grilled squid and crab fried rice.',
      });
    }

    allDays.push({ day: d, activities });
  }

  const title = lang === 'vi'
    ? `Lịch trình Phú Quốc ${days} ngày cho ${guests} người`
    : `Phu Quoc ${days}-Day Itinerary for ${guests} ${guests > 1 ? 'guests' : 'guest'}`;

  const message = lang === 'vi'
    ? `Mình đã lên ngay lịch trình ${days} ngày tối ưu cho ${guests} người với ngân sách khoảng ${new Intl.NumberFormat('vi-VN').format(budgetVnd)} ₫! Lịch trình cân đối hợp lý giữa ẩm thực đặc sản (bún quậy, hải sản tươi sống) và các điểm vui chơi biển đảo đặc trưng. Bạn có thể xem chi tiết từng hoạt động hoặc bấm "Đặt trọn gói lịch trình này" ngay nhé.`
    : `I have planned an optimized ${days}-day trip for ${guests} ${guests > 1 ? 'guests' : 'guest'} with a budget around ${new Intl.NumberFormat('en-US').format(budgetVnd)} VND! Enjoy local seafood and top island activities. Tap the card below to see the full plan!`;

  return {
    kind: 'itinerary',
    message,
    preferences: { days, guests, budgetVnd, interest },
    plan: { title, days: allDays },
  };
}
