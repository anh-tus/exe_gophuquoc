import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HoldStatus, ListingStatus, Prisma, ServiceCategory } from '../generated/client';
import { createHash } from 'node:crypto';
import { PrismaService } from './prisma.service';

export interface HoldInput {
  offeringId: string;
  dateTime: string;
  quantity: number;
  idempotencyKey: string;
  bookingId?: string;
}

export function validateHoldInput(value: HoldInput): Date {
  if (!value || typeof value.offeringId !== 'string' || !value.offeringId ||
      typeof value.idempotencyKey !== 'string' || value.idempotencyKey.length < 8 || value.idempotencyKey.length > 128 ||
      !Number.isSafeInteger(value.quantity) || value.quantity < 1 || value.quantity > 100 ||
      typeof value.dateTime !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(value.dateTime)) {
    throw new BadRequestException('Invalid hold request');
  }
  const date = new Date(value.dateTime);
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
    throw new BadRequestException('Choose a future date and time');
  }
  if (value.bookingId !== undefined && (typeof value.bookingId !== 'string' || !value.bookingId)) {
    throw new BadRequestException('Invalid booking ID');
  }
  return date;
}

@Injectable()
export class SupplyService {
  constructor(private readonly db: PrismaService) {}

  async listings(query: Record<string, string | undefined>) {
    const category = query.category?.toUpperCase();
    if (category && !Object.values(ServiceCategory).includes(category as ServiceCategory)) throw new BadRequestException('Unknown category');
    const minPrice = parseOptionalInt(query.minPriceVnd);
    const maxPrice = parseOptionalInt(query.maxPriceVnd);
    const guests = parseOptionalInt(query.guests);
    if (query.date && !/^\d{4}-\d{2}-\d{2}$/.test(query.date)) throw new BadRequestException('Invalid date');
    const date = query.date ? new Date(`${query.date}T00:00:00+07:00`) : undefined;
    if (date && !Number.isFinite(date.getTime())) throw new BadRequestException('Invalid date');
    const q = query.query?.trim().slice(0, 120);
    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.PUBLISHED,
      ...(category ? { category: category as ServiceCategory } : {}),
      ...(query.area ? { area: { contains: query.area.trim().slice(0, 80), mode: 'insensitive' } } : {}),
      ...(q ? { OR: [{ titleVi: { contains: q, mode: 'insensitive' } }, { titleEn: { contains: q, mode: 'insensitive' } }, { descriptionVi: { contains: q, mode: 'insensitive' } }, { descriptionEn: { contains: q, mode: 'insensitive' } }] } : {}),
      offerings: { some: {
        active: true,
        ...(minPrice !== undefined || maxPrice !== undefined ? { unitPriceVnd: { gte: minPrice, lte: maxPrice } } : {}),
        ...(guests !== undefined ? { minGuests: { lte: guests }, maxGuests: { gte: guests } } : {}),
        ...(date ? { slots: { some: { dateTime: { gte: new Date(date.getTime()), lt: new Date(date.getTime() + 86400000) }, blocked: false } } } : {}),
      } },
    };
    return this.db.listing.findMany({ where, take: 100, orderBy: { publishedAt: 'desc' }, include: { offerings: { where: { active: true }, select: { id: true, titleVi: true, titleEn: true, unitPriceVnd: true, minGuests: true, maxGuests: true, durationMinutes: true, cancellation: true } } } });
  }

  async listing(id: string) {
    const item = await this.db.listing.findFirst({ where: { id, status: 'PUBLISHED' }, include: { offerings: { where: { active: true }, include: { slots: { where: { dateTime: { gte: new Date() }, blocked: false }, take: 60, orderBy: { dateTime: 'asc' }, select: { id: true, dateTime: true, capacity: true } } } } } });
    if (!item) throw new NotFoundException('Listing not found');
    return item;
  }

  async createHold(input: HoldInput) {
    const date = validateHoldInput(input);
    const requestHash = createHash('sha256').update(JSON.stringify({ offeringId: input.offeringId, dateTime: date.toISOString(), quantity: input.quantity, bookingId: input.bookingId ?? null })).digest('hex');
    const existing = await this.db.inventoryHold.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return this.sameHold(existing, requestHash);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const hold = await this.db.$transaction(async tx => {
          const slot = await tx.inventorySlot.findUnique({ where: { offeringId_dateTime: { offeringId: input.offeringId, dateTime: date } }, include: { offering: { include: { listing: true } } } });
          if (!slot || slot.blocked || !slot.offering.active || slot.offering.listing.status !== 'PUBLISHED') throw new NotFoundException('Available slot not found');
          if (input.quantity < slot.offering.minGuests || input.quantity > slot.offering.maxGuests) throw new BadRequestException('Quantity outside offering limits');
          const used = await tx.inventoryHold.aggregate({ where: { slotId: slot.id, OR: [{ status: HoldStatus.CONFIRMED }, { status: HoldStatus.ACTIVE, expiresAt: { gt: new Date() } }] }, _sum: { quantity: true } });
          if ((used._sum.quantity ?? 0) + input.quantity > slot.capacity) throw new ConflictException('Not enough availability');
          return tx.inventoryHold.create({ data: { slotId: slot.id, bookingId: input.bookingId, idempotencyKey: input.idempotencyKey, requestHash, quantity: input.quantity, unitPriceVnd: slot.offering.unitPriceVnd, category: slot.offering.listing.category, cancellationPolicy: slot.offering.cancellation, partnerRef: slot.offering.listing.partnerRef, expiresAt: new Date(Date.now() + 15 * 60000) } });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
        return presentHold(hold);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const found = await this.db.inventoryHold.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
          if (found) return this.sameHold(found, requestHash);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt < 2) continue;
        throw error;
      }
    }
    throw new ConflictException('Hold could not be created');
  }

  private sameHold(hold: { requestHash: string; id: string; expiresAt: Date; unitPriceVnd: number; quantity: number; status: HoldStatus; category: ServiceCategory; cancellationPolicy: string; partnerRef: string | null }, hash: string) {
    if (hold.requestHash !== hash) throw new ConflictException('Idempotency key reused with different request');
    return presentHold(hold);
  }

  async transitionHold(id: string, action: 'confirm' | 'release') {
    const found = await this.db.inventoryHold.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Hold not found');
    if (action === 'release' && found.status === HoldStatus.RELEASED) return presentHold(found);
    if (action === 'confirm' && found.status === HoldStatus.CONFIRMED) return presentHold(found);
    if (found.status !== HoldStatus.ACTIVE || found.expiresAt <= new Date()) {
      if (found.status === HoldStatus.ACTIVE && found.expiresAt <= new Date()) await this.db.inventoryHold.updateMany({ where: { id, status: HoldStatus.ACTIVE }, data: { status: HoldStatus.EXPIRED } });
      throw new ConflictException('Hold no longer active');
    }
    const updated = await this.db.inventoryHold.updateMany({ where: { id, status: HoldStatus.ACTIVE, expiresAt: { gt: new Date() } }, data: { status: action === 'confirm' ? HoldStatus.CONFIRMED : HoldStatus.RELEASED } });
    if (updated.count === 0) throw new ConflictException('Hold changed');
    return presentHold((await this.db.inventoryHold.findUniqueOrThrow({ where: { id } })));
  }

  async extendHold(id: string) {
    const now = new Date();
    const updated = await this.db.inventoryHold.updateMany({
      where: { id, status: HoldStatus.ACTIVE, expiresAt: { gt: now }, extendedAt: null },
      data: { expiresAt: new Date(now.getTime() + 2 * 60 * 60000), extendedAt: now },
    });
    const found = await this.db.inventoryHold.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Hold not found');
    if (!updated.count && found.status !== HoldStatus.ACTIVE) throw new ConflictException('Hold no longer active');
    if (!updated.count && found.expiresAt <= now) throw new ConflictException('Hold expired');
    return presentHold(found);
  }

  async createListing(data: any) {
    if (!data || !Object.values(ServiceCategory).includes(data.category) || typeof data.titleVi !== 'string' || typeof data.titleEn !== 'string' || typeof data.area !== 'string') throw new BadRequestException('Invalid listing');
    return this.db.listing.create({ data: { category: data.category, titleVi: data.titleVi, titleEn: data.titleEn, descriptionVi: data.descriptionVi ?? '', descriptionEn: data.descriptionEn ?? '', area: data.area, latitude: finiteOptional(data.latitude), longitude: finiteOptional(data.longitude), imageUrl: data.imageUrl ?? null, partnerRef: data.partnerRef ?? null } });
  }

  async updateListing(id: string, data: any) {
    const found = await this.db.listing.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Listing not found');
    const allowed: Record<string, unknown> = {};
    for (const field of ['titleVi', 'titleEn', 'descriptionVi', 'descriptionEn', 'area', 'imageUrl', 'partnerRef']) if (typeof data?.[field] === 'string') allowed[field] = data[field];
    if (data?.latitude !== undefined) allowed.latitude = finiteOptional(data.latitude);
    if (data?.longitude !== undefined) allowed.longitude = finiteOptional(data.longitude);
    if (data?.status === 'PUBLISHED') { allowed.status = 'PUBLISHED'; allowed.publishedAt = new Date(); }
    if (data?.status === 'DRAFT' || data?.status === 'ARCHIVED') allowed.status = data.status;
    return this.db.listing.update({ where: { id }, data: allowed });
  }

  async createOffering(listingId: string, data: any) {
    if (!await this.db.listing.findUnique({ where: { id: listingId } })) throw new NotFoundException('Listing not found');
    const price = positiveInt(data?.unitPriceVnd, true);
    const capacity = positiveInt(data?.capacity);
    const minGuests = positiveInt(data?.minGuests ?? 1);
    const maxGuests = positiveInt(data?.maxGuests ?? capacity);
    if (minGuests > maxGuests || typeof data?.titleVi !== 'string' || typeof data?.titleEn !== 'string' || !['FLEXIBLE', 'NON_REFUNDABLE'].includes(data?.cancellation ?? 'FLEXIBLE')) throw new BadRequestException('Invalid offering');
    return this.db.offering.create({ data: { listingId, titleVi: data.titleVi, titleEn: data.titleEn, unitPriceVnd: price, capacity, minGuests, maxGuests, durationMinutes: data.durationMinutes === undefined ? null : positiveInt(data.durationMinutes), cancellation: data.cancellation ?? 'FLEXIBLE' } });
  }

  async upsertSlot(offeringId: string, data: any) {
    const dateTime = new Date(data?.dateTime);
    const capacity = positiveInt(data?.capacity, true);
    if (!Number.isFinite(dateTime.getTime()) || dateTime <= new Date() || typeof data?.blocked !== 'boolean' && data?.blocked !== undefined) throw new BadRequestException('Invalid slot');
    const offering = await this.db.offering.findUnique({ where: { id: offeringId } });
    if (!offering) throw new NotFoundException('Offering not found');
    if (capacity > offering.capacity) throw new BadRequestException('Slot capacity exceeds offering capacity');
    return this.db.$transaction(async tx => {
      const existing = await tx.inventorySlot.findUnique({ where: { offeringId_dateTime: { offeringId, dateTime } } });
      if (existing) {
        const used = await tx.inventoryHold.aggregate({ where: { slotId: existing.id, OR: [{ status: HoldStatus.CONFIRMED }, { status: HoldStatus.ACTIVE, expiresAt: { gt: new Date() } }] }, _sum: { quantity: true } });
        if ((used._sum.quantity ?? 0) > capacity || (data.blocked && (used._sum.quantity ?? 0) > 0)) throw new ConflictException('Existing reservations exceed new capacity');
      }
      return tx.inventorySlot.upsert({ where: { offeringId_dateTime: { offeringId, dateTime } }, create: { offeringId, dateTime, capacity, blocked: data.blocked ?? false }, update: { capacity, blocked: data.blocked ?? false } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}

function parseOptionalInt(value?: string): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 0) throw new BadRequestException('Invalid number');
  return n;
}
function positiveInt(value: unknown, allowZero = false): number {
  if (!Number.isSafeInteger(value) || (value as number) < (allowZero ? 0 : 1)) throw new BadRequestException('Invalid number');
  return value as number;
}
function finiteOptional(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new BadRequestException('Invalid coordinate');
  return value;
}
function presentHold(hold: { id: string; expiresAt: Date; unitPriceVnd: number; quantity: number; status: HoldStatus; category: ServiceCategory; cancellationPolicy: string; partnerRef: string | null }) {
  return { id: hold.id, expiresAt: hold.expiresAt.toISOString(), unitPriceVnd: hold.unitPriceVnd, totalPriceVnd: hold.unitPriceVnd * hold.quantity, category: hold.category, cancellationPolicy: hold.cancellationPolicy, partnerRef: hold.partnerRef, status: hold.status };
}
