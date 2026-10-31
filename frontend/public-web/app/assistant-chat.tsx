'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { buildVisibleMessages } from './api/assistant/logic';
import type { AssistantPlan, AssistantReply, ChatMessage, TripPreferences } from './api/assistant/logic';
import type { Lang } from './catalog';

type Props = {
  lang: Lang;
  initialPrompt?: string;
  onInitialPromptConsumed: () => void;
  onConversationStarted: () => void;
  onPlan: (reply: Extract<AssistantReply, { kind: 'itinerary' }>) => void;
  onSearch: (reply: Extract<AssistantReply, { kind: 'service_search' }>) => void;
  onUseTemplate: (text: string, preferences: TripPreferences) => void;
  initialMessages?: ChatMessage[];
  onMessagesChange?: (messages: ChatMessage[]) => void;
  currentPlan?: AssistantPlan | null;
};

const words = {
  vi: {
    heading: 'GOPU AI · Phú Quốc',
    intro: 'Chia sẻ số ngày, số người, ngân sách tổng và điều bạn thích. Mình sẽ hỏi thêm nếu cần.',
    placeholder: 'Ví dụ: 3 ngày, 5 người, ngân sách 20 triệu…',
    send: 'Gửi',
    loading: 'Đang lên gợi ý…',
    privacy: 'Khi bắt đầu, nội dung chat sẽ được gửi tới Gemini để tạo gợi ý. Không gửi thông tin tài khoản hoặc thanh toán; tránh nhập thông tin cá nhân.',
    failureNetwork: 'Chưa kết nối được Gemini. Tin nhắn của bạn vẫn được giữ lại; bạn có thể thử lại hoặc tiếp tục với lịch trình mẫu.',
    failureRoute: 'Không tìm thấy API chat trên máy chủ web đang mở. Hãy khởi động lại ứng dụng Next.js rồi thử lại.',
    failureServer: 'Không kết nối được tới máy chủ web. Hãy kiểm tra ứng dụng Next.js đang chạy rồi thử lại.',
    failureBusy: 'Gemini đang bận hoặc đã chạm giới hạn tạm thời. Tin nhắn vẫn được giữ lại; hãy thử lại sau ít phút.',
    failureTimeout: 'Gemini phản hồi quá lâu. Tin nhắn vẫn được giữ lại; hãy thử lại hoặc chỉnh câu hỏi ngắn hơn.',
    failureFormat: 'GOPU AI chưa tạo được kế hoạch phù hợp. Tin nhắn vẫn được giữ lại; hãy thử diễn đạt lại hoặc dùng lịch trình mẫu.',
    failureKey: 'Chưa cấu hình được Gemini API key trên máy chủ local.',
    failureAuth: 'Gemini API key không hợp lệ hoặc chưa có quyền truy cập. Hãy tạo khóa Gemini trong Google AI Studio và cập nhật GEMINI_API_KEY trên máy chủ.',
    failureProvider: 'Gemini từ chối yêu cầu. Hãy kiểm tra tên model và quyền sử dụng API key trong cấu hình local.',
    failureRate: 'Bạn đang gửi hơi nhanh. Hãy chờ một chút rồi thử lại.',
    fallback: 'Tạo lịch trình mẫu',
    retry: 'Thử lại',
    demo: 'Gợi ý từ dữ liệu minh họa; giá chưa xác minh và không thể hiện tình trạng còn chỗ.',
  },
  en: {
    heading: 'GOPU AI · Phu Quoc',
    intro: 'Share your trip length, group size, total budget, and interests. I’ll ask follow-up questions if needed.',
    placeholder: 'For example: 3 days, 5 people, 20 million VND…',
    send: 'Send',
    loading: 'Preparing suggestions…',
    privacy: 'When you start, your chat will be sent to Gemini to create suggestions. Do not include account, payment, or personal information.',
    failureNetwork: 'Gemini could not be reached. Your message is still here; retry or continue with a sample itinerary.',
    failureRoute: 'The chat API was not found on this web server. Restart the Next.js app and try again.',
    failureServer: 'The web server could not be reached. Check that the Next.js app is running and try again.',
    failureBusy: 'Gemini is busy or temporarily rate limited. Your message is still here; try again in a moment.',
    failureTimeout: 'Gemini took too long to respond. Your message is still here; retry or shorten the request.',
    failureFormat: 'GOPU AI could not shape that into a plan. Your message is still here; rephrase or use the sample planner.',
    failureKey: 'The Gemini API key is not configured on the local server.',
    failureAuth: 'The Gemini API key is invalid or lacks access. Create a Gemini key in Google AI Studio and update GEMINI_API_KEY on the server.',
    failureProvider: 'Gemini rejected the request. Check the configured model and API key access on the local server.',
    failureRate: 'You are sending requests too quickly. Wait a moment and retry.',
    fallback: 'Create sample itinerary',
    retry: 'Try again',
    demo: 'Suggestions use illustrative data; prices are unverified and availability is not shown.',
  },
};

export default function AssistantChat({ lang, initialPrompt, initialMessages = [], onMessagesChange, currentPlan, onInitialPromptConsumed, onConversationStarted, onPlan, onSearch, onUseTemplate }: Props) {
  const t = words[lang];
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUserText, setPendingUserText] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const submittedPrompt = useRef('');

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, pendingUserText, loading]);

  const send = async (nextMessages: ChatMessage[], failedText: string) => {
    setPendingUserText(failedText);
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, lang, currentPlan }),
      });
      const payload = await response.json().catch(() => null) as (AssistantReply & { code?: string }) | { code?: string } | null;
      if (!response.ok) throw new Error(payload?.code || (response.status === 404 ? 'CHAT_API_NOT_FOUND' : 'GEMINI_UNAVAILABLE'));
      const reply = payload as AssistantReply | null;
      if (!reply || !['chat', 'clarify', 'itinerary', 'service_search'].includes(reply.kind) || typeof reply.message !== 'string') throw new Error('GEMINI_INVALID_REPLY');
      const completedMessages = [...nextMessages, { role: 'assistant' as const, text: reply.message }];
      setMessages(completedMessages);
      onMessagesChange?.(completedMessages);
      setPendingUserText(null);
      if (reply.kind === 'itinerary') onPlan(reply);
      if (reply.kind === 'service_search') onSearch(reply);
    } catch (requestError) {
      setMessages(nextMessages.slice(0, -1));
      setPendingUserText(null);
      setInput(failedText);
      setError(requestError instanceof TypeError ? 'CHAT_API_UNREACHABLE' : requestError instanceof Error ? requestError.message : 'NETWORK_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onConversationStarted();
    setInput('');
    const next = [...messages, { role: 'user' as const, text: trimmed }];
    void send(next, trimmed);
  };

  useEffect(() => {
    const prompt = initialPrompt?.trim();
    if (prompt && submittedPrompt.current !== prompt) {
      submittedPrompt.current = prompt;
      submit(prompt);
      onInitialPromptConsumed();
    }
  }, [initialPrompt]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(input);
  };

  const visibleMessages = buildVisibleMessages(messages, pendingUserText);

  return <section className="assistant-chat" aria-labelledby="assistant-heading">
    <div className="assistant-heading"><span className="assistant-mark" aria-hidden="true">✦</span><div><h2 id="assistant-heading">{t.heading}</h2><p>{t.intro}</p></div></div>
    <div ref={transcriptRef} className="assistant-transcript" aria-live="polite" aria-relevant="additions text">
      {visibleMessages.map((message, index) => <div key={index} className={`assistant-message ${message.role}`}><span>{message.role === 'user' ? (lang === 'vi' ? 'Bạn' : 'You') : 'GOPU AI'}</span><p>{message.text}</p></div>)}
      {loading && <div className="assistant-message assistant-thinking" role="status"><span>GOPU AI</span><p>{t.loading}</p></div>}
    </div>
    <form className="assistant-compose" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="assistant-message">{t.placeholder}</label>
      <textarea id="assistant-message" rows={2} maxLength={1200} value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} disabled={loading} autoFocus onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(input); } }} />
      <button className="button primary" type="submit" disabled={loading || !input.trim()}>{t.send} ↗</button>
    </form>
    <p className="assistant-privacy">{t.privacy}</p>
    {error && <div className="assistant-error" role="alert"><p>{error === 'GEMINI_OVERLOADED' ? t.failureBusy : error === 'GEMINI_TIMEOUT' ? t.failureTimeout : error === 'GEMINI_INVALID_REPLY' ? t.failureFormat : error === 'GEMINI_NOT_CONFIGURED' ? t.failureKey : error === 'GEMINI_AUTH_ERROR' ? t.failureAuth : error === 'GEMINI_PROVIDER_ERROR' ? t.failureProvider : error === 'LOCAL_RATE_LIMIT' ? t.failureRate : error === 'CHAT_API_NOT_FOUND' ? t.failureRoute : error === 'CHAT_API_UNREACHABLE' ? t.failureServer : t.failureNetwork}</p><div><button className="button subtle" onClick={() => submit(input)} disabled={loading || !input.trim()}>{t.retry}</button><button className="button outline" onClick={() => { const prompt = input.trim() || [...messages].reverse().find((message) => message.role === 'user')?.text || ''; onUseTemplate(prompt, { days: null, guests: null, budgetVnd: null, interest: '' }); }}>{t.fallback}</button></div></div>}
    <p className="assistant-demo-note">{t.demo}</p>
  </section>;
}
