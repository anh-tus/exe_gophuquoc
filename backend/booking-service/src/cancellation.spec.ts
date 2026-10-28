import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { refundPercent } from './cancellation';

const now = new Date('2026-10-29T00:00:00.000Z');
const later = (hours: number) => new Date(now.getTime() + hours * 3_600_000);

test('stay cancellation boundaries', () => {
  assert.equal(refundPercent({ category: 'STAY', policy: 'FLEXIBLE', startsAt: later(72), now }), 100);
  assert.equal(refundPercent({ category: 'STAY', policy: 'FLEXIBLE', startsAt: later(24), now }), 50);
  assert.equal(refundPercent({ category: 'STAY', policy: 'FLEXIBLE', startsAt: later(23), now }), 0);
});

test('tour and partner fault cancellation', () => {
  assert.equal(refundPercent({ category: 'TOUR', policy: 'FLEXIBLE', startsAt: later(24), now }), 100);
  assert.equal(refundPercent({ category: 'TOUR', policy: 'FLEXIBLE', startsAt: later(6), now }), 50);
  assert.equal(refundPercent({ category: 'SPA', policy: 'NON_REFUNDABLE', startsAt: later(1), now, partnerFault: true }), 100);
});

test('laundry pickup changes refundable amount', () => {
  assert.equal(refundPercent({ category: 'LAUNDRY', policy: 'FLEXIBLE', startsAt: later(1), now }), 100);
  assert.equal(refundPercent({ category: 'LAUNDRY', policy: 'FLEXIBLE', startsAt: later(1), now, laundryPickedUp: true }), 0);
});
