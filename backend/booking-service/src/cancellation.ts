export type CancellationCategory = 'STAY' | 'TOUR' | 'TRANSPORT' | 'SPA' | 'LAUNDRY';

export function refundPercent(input: {
  category: CancellationCategory;
  policy: 'FLEXIBLE' | 'NON_REFUNDABLE';
  startsAt: Date;
  now: Date;
  partnerFault?: boolean;
  laundryPickedUp?: boolean;
}): 0 | 50 | 100 {
  if (input.partnerFault) return 100;
  if (input.policy === 'NON_REFUNDABLE') return 0;
  if (input.category === 'LAUNDRY') return input.laundryPickedUp ? 0 : 100;
  const hours = (input.startsAt.getTime() - input.now.getTime()) / 3_600_000;
  if (input.category === 'STAY') return hours >= 72 ? 100 : hours >= 24 ? 50 : 0;
  return hours >= 24 ? 100 : hours >= 6 ? 50 : 0;
}
