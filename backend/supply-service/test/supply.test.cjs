const test = require('node:test');
const assert = require('node:assert/strict');
const { validateHoldInput } = require('../dist/supply.service');
const { requireKey } = require('../dist/access');

test('hold validates date, quantity and idempotency key before inventory access', () => {
  const valid = { offeringId: 'offer-1', dateTime: new Date(Date.now() + 86400000).toISOString(), quantity: 2, idempotencyKey: 'booking-123' };
  assert.equal(validateHoldInput(valid).toISOString(), valid.dateTime);
  assert.throws(() => validateHoldInput({ ...valid, quantity: 0 }));
  assert.throws(() => validateHoldInput({ ...valid, quantity: 2.5 }));
  assert.throws(() => validateHoldInput({ ...valid, idempotencyKey: 'x' }));
  assert.throws(() => validateHoldInput({ ...valid, dateTime: new Date(Date.now() - 86400000).toISOString() }));
});

test('service key fails closed when configuration is absent or incorrect', () => {
  assert.throws(() => requireKey('provided', undefined));
  assert.throws(() => requireKey(undefined, 'configured'));
  assert.throws(() => requireKey('wrong', 'configured'));
  assert.doesNotThrow(() => requireKey('configured', 'configured'));
});
