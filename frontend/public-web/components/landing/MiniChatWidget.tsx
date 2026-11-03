'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowsOut, ArrowClockwise, X, Sparkle, Lightbulb, MapTrifold, ArrowRight } from '@phosphor-icons/react';
import { assistantErrorText, assistantCopy } from '../../lib/i18n';
import { AssistantRequestError, requestAssistantReply } from '../../lib/assistant-client';
import type { AssistantReply, ChatMessage } from '../../app/api/assistant/logic';
import type { Lang } from '../../app/catalog';

type Props = {
  lang: Lang;
  onOpenAssistant: (messages: ChatMessage[], choices: string[]) => void;
  onPlanCreated: (reply: Extract<AssistantReply, { kind: 'itinerary' }>, messages: ChatMessage[]) => void;
};

type Bubble = ChatMessage & {
  id: string;
  hasPlanLink?: boolean;
  planTitle?: string;
  planDays?: number;
  planGuests?: number;
  planBudget?: number;
};

/**
 * Floating chat popover on the landing page.
 *
 * Kept separate from the full planner chat so the landing file stays about the
 * landing page, and so both surfaces share one request path and one copy file.
 */
export default function MiniChatWidget({ lang, onOpenAssistant, onPlanCreated }: Props) {
  const copy = assistantCopy[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openAssistant = () => {
    setIsOpen(false);
    onOpenAssistant(messages.map(({ role, text }) => ({ role, text })), choices);
  };

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, submitting, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    const next: Bubble[] = [...messages, { id: crypto.randomUUID(), role: 'user', text: trimmed }];
    setMessages(next);
    setChoices([]);
    setPrompt('');
    setError(null);
    setSubmitting(true);

    try {
      const reply = await requestAssistantReply({
        lang,
        messages: next.map(({ role, text: body }) => ({ role, text: body })),
      });
      const isItinerary = reply.kind === 'itinerary';
      const assistant: Bubble = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: reply.message,
        hasPlanLink: isItinerary,
        planTitle: isItinerary ? reply.plan.title : undefined,
        planDays: isItinerary ? reply.plan.days.length : undefined,
        planGuests: isItinerary ? reply.preferences.guests ?? undefined : undefined,
        planBudget: isItinerary ? reply.preferences.budgetVnd ?? undefined : undefined,
      };
      setMessages([...next, assistant]);
      setChoices(reply.kind === 'clarify' ? reply.choices : []);
      if (reply.kind === 'itinerary') {
        onPlanCreated(reply, [...next, assistant].map(({ role, text: body }) => ({ role, text: body })));
      }
    } catch (requestError) {
      setError(requestError instanceof AssistantRequestError ? requestError.code : 'CHAT_API_UNREACHABLE');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gopu-chat-widget fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <section
          aria-label={copy.widgetTitle}
          className="mb-3 w-[calc(100vw-2rem)] max-w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn flex flex-col max-h-[500px]"
        >
          <header className="bg-gradient-to-r from-[#087f78] to-[#064e43] text-white p-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white" aria-hidden="true"><Sparkle size={18} weight="fill" /></span>
              <div>
                <h2 className="text-xs font-extrabold text-white leading-tight">{copy.widgetTitle}</h2>
                <p className="text-xs text-emerald-100/90">{copy.widgetSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setChoices([]);
                  setError(null);
                  setPrompt('');
                }}
                title={copy.widgetReset}
                aria-label={copy.widgetReset}
                className="min-h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white px-2 flex items-center justify-center text-xs transition-colors"
              >
                <ArrowClockwise size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={openAssistant}
                disabled={submitting}
                title={copy.widgetExpand}
                aria-label={copy.widgetExpand}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                <ArrowsOut size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={copy.widgetClose}
                aria-label={copy.widgetClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            ref={transcriptRef}
            className="p-3.5 bg-[#fcfdfd] text-xs overflow-y-auto flex-1 flex flex-col gap-3 min-h-[220px]"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <BubbleRow role="assistant" text={copy.widgetWelcome} label={copy.assistant} />

            {messages.map((message) => (
              <BubbleRow
                key={message.id}
                role={message.role}
                text={message.text}
                label={message.role === 'user' ? copy.you : copy.assistant}
                planLink={
                  message.hasPlanLink
                    ? {
                        title: message.planTitle || copy.planReadyTitle,
                        body: copy.planReadyBody,
                        cta: copy.planReadyCta,
                        days: message.planDays,
                        guests: message.planGuests,
                        budget: message.planBudget,
                        lang,
                        onOpen: openAssistant,
                      }
                    : undefined
                }
              />
            ))}

            {submitting && (
              <div className="flex flex-col items-start animate-fadeIn">
                <div className="bg-white text-gray-600 border border-gray-100 rounded-2xl rounded-bl-xs p-3 text-xs flex items-center gap-2 shadow-xs" role="status">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce" />
                  <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs font-medium text-gray-500">{copy.widgetLoading}</span>
                </div>
              </div>
            )}

            {messages.length === 0 && !submitting && (
              <div className="mt-1 pt-1">
                <div className="text-xs font-bold text-gray-500 mb-1.5">{copy.widgetQuickLabel}</div>
                <div className="flex flex-col gap-1.5">
                  {copy.widgetQuick.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="text-left px-3 py-2 min-h-11 rounded-xl bg-white hover:bg-teal-50 border border-gray-200/80 hover:border-teal-300 text-gray-700 hover:text-[#087f78] transition-colors text-xs"
                    >
                      <Lightbulb size={16} className="inline mr-1 text-[#087f78]" aria-hidden="true" />{suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {choices.length > 0 && !submitting && (
              <div className="flex flex-col gap-1.5" aria-label={copy.chooseAnswer}>
                <span className="font-bold text-gray-600">{copy.chooseAnswer}</span>
                {choices.map((choice) => <button key={choice} type="button" onClick={() => void send(choice)} className="text-left px-3 py-2 min-h-11 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-gray-800 hover:text-[#087f78] transition-colors text-xs">{choice}</button>)}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900" role="alert">
                <p>{assistantErrorText(error, copy)}</p>
                <button
                  type="button"
                  onClick={() => void send(messages.filter((message) => message.role === 'user').at(-1)?.text ?? '')}
                  className="mt-2 min-h-11 px-3 rounded-lg bg-white border border-emerald-300 font-bold text-emerald-900"
                >
                  {copy.retry}
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(prompt);
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
          >
            <label className="sr-only" htmlFor="gopu-mini-chat-input">
              {copy.widgetPlaceholder}
            </label>
            <input
              ref={inputRef}
              id="gopu-mini-chat-input"
              type="text"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={choices.length ? copy.otherAnswerPlaceholder : copy.widgetPlaceholder}
              disabled={submitting}
              maxLength={1200}
              className="flex-1 px-3 py-2 min-h-11 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:border-[#087f78] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || submitting}
              className="px-3.5 py-2 min-h-11 rounded-xl bg-[#087f78] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#066862] transition-colors shadow-xs"
            >
              {copy.send}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? copy.widgetClose : copy.widgetOpen}
        aria-expanded={isOpen}
        className="rounded-full bg-[#087f78] hover:bg-[#066862] active:scale-95 text-white p-3 sm:px-5 sm:py-2.5 shadow-2xl shadow-teal-950/30 flex items-center gap-3 border border-white/20 transition-all hover:scale-105 group"
      >

        <Sparkle size={20} weight="fill" className="text-white shrink-0" aria-hidden="true" />
        <span className="text-left">
          <span className="block font-extrabold text-sm text-white leading-tight tracking-tight">{copy.widgetOpen}</span>
          <span className="block text-xs text-emerald-100/90 font-medium leading-tight mt-0.5">{copy.widgetSubtitle}</span>
        </span>
      </button>
    </div>
  );
}

function BubbleRow({
  role,
  text,
  label,
  planLink,
}: {
  role: ChatMessage['role'];
  text: string;
  label: string;
  planLink?: {
    title: string;
    body: string;
    cta: string;
    days?: number;
    guests?: number;
    budget?: number;
    lang: Lang;
    onOpen: () => void;
  };
}) {
  const isUser = role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-[#087f78] text-white rounded-br-xs shadow-xs'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs shadow-xs'
        }`}
      >
        <div className="whitespace-pre-wrap">{text}</div>

        {planLink && (
          <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40 border border-emerald-300/80 text-left shadow-xs">
            <div className="flex items-center gap-1.5 font-extrabold text-xs text-gray-900 mb-1.5">
              <MapTrifold size={18} className="text-[#087f78] shrink-0" weight="fill" aria-hidden="true" />
              <span className="text-emerald-950 font-bold leading-tight">{planLink.title}</span>
            </div>

            {(planLink.days || planLink.guests || planLink.budget) && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {planLink.days && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[#087f78] font-bold text-[11px]">
                    {planLink.days} {planLink.lang === 'vi' ? 'ngày' : 'days'}
                  </span>
                )}
                {planLink.guests && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-gray-700 font-medium text-[11px]">
                    {planLink.guests} {planLink.lang === 'vi' ? 'khách' : 'guests'}
                  </span>
                )}
                {planLink.budget && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-gray-700 font-medium text-[11px]">
                    ~{new Intl.NumberFormat(planLink.lang === 'vi' ? 'vi-VN' : 'en-US').format(planLink.budget)} ₫
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600 mb-2.5 leading-relaxed">{planLink.body}</p>
            <button
              type="button"
              onClick={planLink.onOpen}
              className="w-full py-2.5 px-3 min-h-11 rounded-xl bg-[#087f78] hover:bg-[#066862] active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-950/15 transition-all"
            >
              <span>{planLink.cta}</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">{label}</span>
    </div>
  );
}
