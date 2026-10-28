const { test } = require('node:test');
const assert = require('node:assert/strict');
const { refundPercent } = require('../dist/cancellation');
const { signedSandboxForm, validSecret } = require('../dist/sepay');

const now = new Date('2026-10-29T00:00:00Z');
const start = hours => new Date(now.getTime() + hours * 3_600_000);
test('cancellation thresholds are exact', () => {
  assert.equal(refundPercent({category:'STAY',policy:'FLEXIBLE',startsAt:start(72),now}),100);
  assert.equal(refundPercent({category:'STAY',policy:'FLEXIBLE',startsAt:start(24),now}),50);
  assert.equal(refundPercent({category:'TOUR',policy:'FLEXIBLE',startsAt:start(6),now}),50);
  assert.equal(refundPercent({category:'TOUR',policy:'NON_REFUNDABLE',startsAt:start(99),now}),0);
  assert.equal(refundPercent({category:'SPA',policy:'NON_REFUNDABLE',startsAt:start(1),now,partnerFault:true}),100);
});
test('checkout can only target sandbox and callback secret fails closed', () => {
  const form=signedSandboxForm({bookingId:'12345678-1234-1234-1234-123456789abc',customerId:'c1',amountVnd:20000,merchantId:'test',secretKey:'secret',returnOrigin:'https://example.test'});
  assert.equal(form.action,'https://pay-sandbox.sepay.vn/v1/checkout/init');
  assert.ok(form.fields.signature);
  assert.equal(validSecret(undefined,'secret'),false);
  assert.equal(validSecret('secret','secret'),true);
});
