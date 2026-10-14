/**
 * Observability integration point. Add structured logging and request correlation
 * once the shared logging policy and deployment target are selected.
 */
export type RequestContext = {
  correlationId: string;
};

export function createCorrelationId(): string {
  return globalThis.crypto.randomUUID();
}
