import type { Lang } from '../app/catalog';
import type { AssistantPlan, AssistantReply, ChatMessage } from '../app/api/assistant/logic';

/**
 * Single entry point for the assistant API.
 *
 * Both the full planner chat and the floating mini widget used to carry their
 * own copy of this fetch + validation logic. Keeping one implementation means
 * a server contract change cannot silently break only one surface.
 */

const REPLY_KINDS = new Set(['chat', 'clarify', 'itinerary', 'service_search']);

export class AssistantRequestError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'AssistantRequestError';
    this.code = code;
  }
}

export type AssistantRequest = {
  messages: ChatMessage[];
  lang: Lang;
  currentPlan?: AssistantPlan | null;
  signal?: AbortSignal;
};

export async function requestAssistantReply({ messages, lang, currentPlan, signal }: AssistantRequest): Promise<AssistantReply> {
  let response: Response;
  try {
    response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, lang, currentPlan: currentPlan ?? null }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new AssistantRequestError('CHAT_API_UNREACHABLE');
  }

  const payload = (await response.json().catch(() => null)) as (Partial<AssistantReply> & { code?: string }) | null;

  if (!response.ok) {
    throw new AssistantRequestError(payload?.code || (response.status === 404 ? 'CHAT_API_NOT_FOUND' : 'GEMINI_UNAVAILABLE'));
  }

  const kind = (payload as { kind?: string } | null)?.kind;
  if (!payload || !kind || !REPLY_KINDS.has(kind) || typeof payload.message !== 'string') {
    throw new AssistantRequestError('GEMINI_INVALID_REPLY');
  }

  return payload as AssistantReply;
}
