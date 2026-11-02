'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { buildVisibleMessages } from './api/assistant/logic';
import type { AssistantPlan, AssistantReply, ChatMessage, TripPreferences } from './api/assistant/logic';
import { assistantCopy, assistantErrorText } from '../lib/i18n';
import { AssistantRequestError, requestAssistantReply } from '../lib/assistant-client';
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

export default function AssistantChat({ lang, initialPrompt, initialMessages = [], onMessagesChange, currentPlan, onInitialPromptConsumed, onConversationStarted, onPlan, onSearch, onUseTemplate }: Props) {
  const t = assistantCopy[lang];
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
      const reply = await requestAssistantReply({ messages: nextMessages, lang, currentPlan });
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
      setError(requestError instanceof AssistantRequestError ? requestError.code : 'NETWORK_ERROR');
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
      {visibleMessages.map((message, index) => <div key={index} className={`assistant-message ${message.role}`}><span>{message.role === 'user' ? t.you : t.assistant}</span><p>{message.text}</p></div>)}
      {loading && <div className="assistant-message assistant-thinking" role="status"><span>{t.assistant}</span><p>{t.loading}</p></div>}
    </div>
    <form className="assistant-compose" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="assistant-message">{t.placeholder}</label>
      <textarea id="assistant-message" rows={2} maxLength={1200} value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} disabled={loading} autoFocus onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(input); } }} />
      <button className="button primary" type="submit" disabled={loading || !input.trim()}>{t.send} ↗</button>
    </form>
    <p className="assistant-privacy">{t.privacy}</p>
    {error && <div className="assistant-error" role="alert"><p>{assistantErrorText(error, t)}</p><div><button className="button subtle" onClick={() => submit(input)} disabled={loading || !input.trim()}>{t.retry}</button><button className="button outline" onClick={() => { const prompt = input.trim() || [...messages].reverse().find((message) => message.role === 'user')?.text || ''; onUseTemplate(prompt, { days: null, guests: null, budgetVnd: null, interest: '' }); }}>{t.fallback}</button></div></div>}
    <p className="assistant-demo-note">{t.demo}</p>
  </section>;
}
