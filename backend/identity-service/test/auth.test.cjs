const assert = require('node:assert/strict');
const { test } = require('node:test');
const { AuthService } = require('../dist/auth.service.js');

const previousSecret = process.env.IDENTITY_JWT_SECRET;
const secret = 'test-only-secret-that-is-long-enough-for-jwt';
const customer = { id: '53c13b95-0e80-4bc5-856b-047950a3d2d8', displayName: 'Lan', preferredLocale: 'vi' };
const prisma = {
  externalIdentity: { upsert: async () => ({ customer }) },
  customer: { findUnique: async ({ where }) => where.id === customer.id ? customer : null },
};
const firebase = { verify: async () => ({ uid: 'verified-firebase-uid', name: 'Lan' }) };
const auth = new AuthService(prisma, firebase);

test('session exchanges verified Firebase identity for bounded app JWT', async () => {
  process.env.IDENTITY_JWT_SECRET = secret;
  const session = await auth.createSession('firebase-id-token-long-enough');
  assert.equal(session.customer.customerId, customer.id);
  assert.equal(session.expiresIn, 3600);
  assert.equal(auth.customerIdFromBearer(`Bearer ${session.accessToken}`), customer.id);
  assert.deepEqual(await auth.getCustomer(customer.id), { customerId: customer.id, displayName: 'Lan', preferredLocale: 'vi' });
});

test('rejects missing signing config and arbitrary bearer tokens', async () => {
  delete process.env.IDENTITY_JWT_SECRET;
  await assert.rejects(auth.createSession('firebase-id-token-long-enough'));
  process.env.IDENTITY_JWT_SECRET = secret;
  assert.throws(() => auth.customerIdFromBearer('Bearer forged.token.value'));
  assert.throws(() => auth.customerIdFromBearer('Bearer firebase-id-token'));
});

process.on('exit', () => {
  if (previousSecret === undefined) delete process.env.IDENTITY_JWT_SECRET;
  else process.env.IDENTITY_JWT_SECRET = previousSecret;
});
