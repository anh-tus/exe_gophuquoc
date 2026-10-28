import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { signedSandboxForm, validSecret } from './sepay';

test('sandbox form uses only sandbox host and deterministic signed invoice', () => {
  const form = signedSandboxForm({ bookingId: 'abcd-1234', customerId: 'customer-1', amountVnd: 20000, merchantId: 'merchant', secretKey: 'test-secret', returnOrigin: 'https://example.test' });
  assert.equal(form.action, 'https://pay-sandbox.sepay.vn/v1/checkout/init');
  assert.equal(form.fields.order_invoice_number, 'GOPU_abcd1234');
  assert.ok(form.fields.signature);
});

test('callback secret fails closed', () => {
  assert.equal(validSecret('wrong', 'secret'), false);
  assert.equal(validSecret(undefined, 'secret'), false);
  assert.equal(validSecret('secret', 'secret'), true);
});
