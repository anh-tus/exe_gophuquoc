import { createHash, timingSafeEqual } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';

export function requireKey(provided: string | undefined, configured: string | undefined): void {
  if (!provided || !configured) throw new UnauthorizedException();
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(configured).digest();
  if (!timingSafeEqual(a, b)) throw new UnauthorizedException();
}
