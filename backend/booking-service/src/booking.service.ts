import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { createHash } from 'node:crypto';
import { refundPercent, type CancellationCategory } from './cancellation';
import { signedSandboxForm, validSecret } from './sepay';

type Customer = { customerId: string; displayName?: string; preferredLocale?: string };
type Hold = { id: string; expiresAt: string; unitPriceVnd: number; totalPriceVnd: number; status: string; category: string; cancellationPolicy: string };
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

@Injectable()
export class BookingService {
  private readonly db = new PrismaClient();

  async customer(authorization?: string): Promise<Customer> {
    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException('Sign in required');
    const origin = process.env.IDENTITY_SERVICE_URL;
    if (!origin) throw new ServiceUnavailableException('Identity service is not configured');
    let response: Response;
    try {
      response = await fetch(new URL('/v1/auth/me', origin), { headers: { authorization }, signal: AbortSignal.timeout(5000) });
    } catch { throw new ServiceUnavailableException('Identity service unavailable'); }
    if (!response.ok) throw new UnauthorizedException('Invalid session');
    const value = await response.json() as Customer;
    if (!value.customerId) throw new UnauthorizedException('Invalid identity response');
    return value;
  }

  async list(customerId: string) {
    return this.db.booking.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, include: { review: true } });
  }

  async get(id: string, customerId: string) {
    const booking = await this.db.booking.findUnique({ where: { id }, include: { review: true } });
    if (!booking || booking.customerId !== customerId) throw new NotFoundException('Booking not found');
    return booking;
  }

  private async supply(path: string, body: unknown): Promise<any> {
    const origin = process.env.SUPPLY_SERVICE_URL;
    const key = process.env.INTERNAL_SERVICE_KEY;
    if (!origin || !key) throw new ServiceUnavailableException('Supply service is not configured');
    let response: Response;
    try {
      response = await fetch(new URL(path, origin), {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-service-key': key },
        body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
      });
    } catch { throw new BadGatewayException('Inventory service unavailable'); }
    if (!response.ok) throw new ConflictException('Inventory is unavailable');
    return response.json();
  }

  async createInstant(customerId: string, idempotencyKey: string | undefined, body: any) {
    if (!idempotencyKey || idempotencyKey.length > 120) throw new BadRequestException('Idempotency-Key required');
    const requestHash = hash(body);
    const prior = await this.db.booking.findUnique({ where: { customerId_idempotencyKey: { customerId, idempotencyKey } } });
    if (prior) { if (prior.requestHash !== requestHash) throw new ConflictException('Idempotency key reused for another request'); return prior; }
    if (typeof body?.offeringId !== 'string' || !Number.isInteger(body?.quantity) || body.quantity < 1 || body.quantity > 20 || !Number.isFinite(Date.parse(body?.startsAt))) {
      throw new BadRequestException('Invalid offering, date or quantity');
    }
    const startsAt = new Date(body.startsAt);
    if (startsAt <= new Date()) throw new BadRequestException('Date must be in the future');
    const hold = await this.supply('/v1/holds', { offeringId: body.offeringId, dateTime: startsAt.toISOString(), quantity: body.quantity, idempotencyKey: `${customerId}:${idempotencyKey}` }) as Hold;
    if (!hold?.id || !Number.isSafeInteger(hold.totalPriceVnd) || hold.totalPriceVnd < 0 || !hold.category || !hold.cancellationPolicy) throw new BadGatewayException('Invalid inventory quote');
    try {
      return await this.db.$transaction(async tx => {
        const booking = await tx.booking.create({ data: {
          customerId, idempotencyKey, requestHash, kind: 'INSTANT', status: 'AWAITING_DEPOSIT', offeringId: body.offeringId,
          holdId: hold.id, startsAt, quantity: body.quantity, totalPriceVnd: hold.totalPriceVnd,
          depositVnd: Math.ceil(hold.totalPriceVnd * 0.2), holdExpiresAt: new Date(hold.expiresAt),
          category: hold.category, cancellationPolicy: hold.cancellationPolicy,
        } });
        await tx.bookingAudit.create({ data: { bookingId: booking.id, actorId: customerId, action: 'CREATE_INSTANT', toStatus: booking.status } });
        await tx.outboxEvent.create({ data: { aggregateId: booking.id, type: 'booking.created', payload: { bookingId: booking.id, customerId } } });
        return booking;
      });
    } catch (error) {
      const existing = await this.db.booking.findUnique({ where: { customerId_idempotencyKey: { customerId, idempotencyKey } } });
      if (existing) { if (existing.requestHash !== requestHash) throw new ConflictException('Idempotency key reused for another request'); return existing; }
      await this.supply(`/v1/holds/${hold.id}/release`, {}).catch(() => undefined);
      throw error;
    }
  }

  async createRequest(customerId: string, idempotencyKey: string | undefined, body: any) {
    if (!idempotencyKey || idempotencyKey.length > 120) throw new BadRequestException('Idempotency-Key required');
    const requestHash = hash(body);
    const prior = await this.db.booking.findUnique({ where: { customerId_idempotencyKey: { customerId, idempotencyKey } } });
    if (prior) { if (prior.requestHash !== requestHash) throw new ConflictException('Idempotency key reused for another request'); return prior; }
    if (typeof body?.message !== 'string' || body.message.trim().length < 10 || body.message.length > 2000) throw new BadRequestException('Describe your request (10–2000 characters)');
    const now = Date.now();
    return this.db.$transaction(async tx => {
      const booking = await tx.booking.create({ data: {
        customerId, idempotencyKey, requestHash, kind: 'REQUEST', status: 'PENDING_PARTNER', offeringId: typeof body.offeringId === 'string' ? body.offeringId : null,
        partnerDeadline: new Date(now + 60 * 60_000), adminDeadline: new Date(now + 120 * 60_000),
      } });
      await tx.conciergeRequest.create({ data: { id: booking.id, customerId, message: body.message.trim() } });
      await tx.bookingAudit.create({ data: { bookingId: booking.id, actorId: customerId, action: 'CREATE_REQUEST', toStatus: booking.status } });
      await tx.outboxEvent.create({ data: { aggregateId: booking.id, type: 'booking.requested', payload: { bookingId: booking.id, customerId } } });
      return booking;
    });
  }

  async cancel(id: string, customerId: string) {
    const booking = await this.get(id, customerId);
    if (['CANCELLED', 'EXPIRED', 'COMPLETED'].includes(booking.status)) throw new ConflictException('Booking cannot be cancelled');
    const percent = booking.startsAt && booking.category && booking.cancellationPolicy
      ? refundPercent({ category: booking.category as CancellationCategory, policy: booking.cancellationPolicy as 'FLEXIBLE' | 'NON_REFUNDABLE', startsAt: booking.startsAt, now: new Date() })
      : 0;
    const updated = await this.db.$transaction(async tx => {
      const result = await tx.booking.update({ where: { id, status: booking.status }, data: { status: 'CANCELLED', cancelledAt: new Date() } });
      await tx.bookingAudit.create({ data: { bookingId: id, actorId: customerId, action: 'CANCEL', fromStatus: booking.status, toStatus: 'CANCELLED' } });
      await tx.outboxEvent.create({ data: { aggregateId: id, type: 'booking.cancelled', payload: { bookingId: id, refundPercent: percent } } });
      return result;
    });
    if (booking.holdId) await this.supply(`/v1/holds/${booking.holdId}/release`, {}).catch(() => undefined);
    return { booking: updated, estimatedRefundPercent: percent, refundStatus: 'NOT_INITIATED' };
  }

  async review(id: string, customerId: string, body: any) {
    const booking = await this.get(id, customerId);
    if (booking.status !== 'COMPLETED') throw new ConflictException('Review available after completion');
    if (!Number.isInteger(body?.rating) || body.rating < 1 || body.rating > 5 || typeof body?.comment !== 'string' || body.comment.length > 2000) throw new BadRequestException('Invalid review');
    return this.db.review.create({ data: { bookingId: id, customerId, rating: body.rating, comment: body.comment.trim() } }).catch(() => { throw new ConflictException('Review already exists'); });
  }

  async sandboxPayment(id: string, customerId: string) {
    const booking = await this.get(id, customerId);
    if (booking.status !== 'AWAITING_DEPOSIT') throw new ConflictException('Booking is not awaiting deposit');
    if (booking.holdExpiresAt && booking.holdExpiresAt <= new Date()) throw new ConflictException('Inventory hold expired');
    if (process.env.SEPAY_MODE !== 'sandbox' || !process.env.SEPAY_SANDBOX_MERCHANT_ID || !process.env.SEPAY_SANDBOX_SECRET_KEY || !process.env.PUBLIC_WEB_ORIGIN) throw new ServiceUnavailableException('Sandbox payment provider is not configured');
    return signedSandboxForm({ bookingId: id, customerId, amountVnd: booking.depositVnd ?? 0, merchantId: process.env.SEPAY_SANDBOX_MERCHANT_ID, secretKey: process.env.SEPAY_SANDBOX_SECRET_KEY, returnOrigin: process.env.PUBLIC_WEB_ORIGIN });
  }

  async sandboxIpn(secret: string | undefined, body: any) {
    if (process.env.SEPAY_MODE !== 'sandbox' || !validSecret(secret, process.env.SEPAY_SANDBOX_IPN_SECRET)) throw new UnauthorizedException('Invalid provider secret');
    if (!Number.isInteger(body?.timestamp) || Math.abs(Date.now() / 1000 - body.timestamp) > 300) throw new BadRequestException('Stale notification');
    if (body?.notification_type !== 'ORDER_PAID') return { success: true };
    const invoice = body?.order?.order_invoice_number;
    const transactionId = body?.transaction?.transaction_id;
    if (typeof invoice !== 'string' || !/^GOPU_[0-9a-f]{32}$/.test(invoice) || typeof transactionId !== 'string' || !transactionId) throw new BadRequestException('Invalid payment notification');
    const prior = await this.db.paymentEvent.findUnique({ where: { provider_providerEventId: { provider: 'SEPAY_SANDBOX', providerEventId: transactionId } } });
    if (prior) return { success: true };
    const id = invoice.slice(5).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
    const booking = await this.db.booking.findUnique({ where: { id } });
    if (!booking || booking.status !== 'AWAITING_DEPOSIT' || !booking.holdId || !booking.holdExpiresAt || booking.holdExpiresAt < new Date()) throw new ConflictException('Booking is not payable');
    const amount = Number(body?.transaction?.transaction_amount);
    if (body?.order?.order_currency !== 'VND' || body?.transaction?.transaction_currency !== 'VND' || body?.transaction?.transaction_status !== 'APPROVED' || body?.order?.order_status !== 'CAPTURED' || amount !== booking.depositVnd || Number(body?.order?.order_amount) !== booking.depositVnd) throw new ConflictException('Payment does not match booking');
    await this.supply(`/v1/holds/${booking.holdId}/confirm`, {});
    await this.db.$transaction(async tx => {
      await tx.paymentEvent.create({ data: { provider: 'SEPAY_SANDBOX', providerEventId: transactionId, bookingId: id, amountVnd: amount } });
      await tx.booking.update({ where: { id, status: 'AWAITING_DEPOSIT' }, data: { status: 'CONFIRMED' } });
      await tx.bookingAudit.create({ data: { bookingId: id, actorId: 'SEPAY_SANDBOX', action: 'PAYMENT_CONFIRMED', fromStatus: 'AWAITING_DEPOSIT', toStatus: 'CONFIRMED' } });
      await tx.outboxEvent.create({ data: { aggregateId: id, type: 'booking.confirmed', payload: { bookingId: id } } });
    });
    return { success: true };
  }

  async submitProof(id: string, customerId: string) {
    await this.get(id, customerId);
    if (!process.env.PAYMENT_PRIVATE_STORAGE_URL) throw new ServiceUnavailableException('Private evidence storage is not configured');
    throw new ServiceUnavailableException('Proof upload requires a signed private storage adapter');
  }
}
