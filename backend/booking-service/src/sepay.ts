import { createHmac, timingSafeEqual } from 'node:crypto';

const signedFields = ['order_amount', 'merchant', 'currency', 'operation', 'order_description', 'order_invoice_number', 'customer_id', 'payment_method', 'success_url', 'error_url', 'cancel_url'] as const;

export function signedSandboxForm(input: { bookingId: string; customerId: string; amountVnd: number; merchantId: string; secretKey: string; returnOrigin: string }) {
  if (!Number.isSafeInteger(input.amountVnd) || input.amountVnd <= 0) throw new Error('Invalid deposit');
  const origin = new URL(input.returnOrigin);
  if (origin.protocol !== 'https:' && origin.hostname !== 'localhost') throw new Error('Invalid return origin');
  const fields: Record<string, string> = {
    order_amount: String(input.amountVnd), merchant: input.merchantId, currency: 'VND', operation: 'PURCHASE',
    order_description: `GOPU sandbox booking ${input.bookingId}`,
    order_invoice_number: `GOPU_${input.bookingId.replaceAll('-', '')}`,
    customer_id: input.customerId,
    success_url: new URL('/account?payment=success', origin).toString(),
    error_url: new URL('/account?payment=error', origin).toString(),
    cancel_url: new URL('/account?payment=cancel', origin).toString(),
  };
  const signed = signedFields.filter(key => fields[key] !== undefined).map(key => `${key}=${fields[key]}`).join(',');
  fields.signature = createHmac('sha256', input.secretKey).update(signed).digest('base64');
  return { action: 'https://pay-sandbox.sepay.vn/v1/checkout/init', method: 'POST' as const, fields };
}

export function validSecret(actual: string | undefined, expected: string | undefined): boolean {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
