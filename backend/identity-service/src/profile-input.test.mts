import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseProfileInput } from './profile-input.ts';

test('accepts and trims a valid profile update', () => {
  assert.deepEqual(parseProfileInput({ displayName: '  Lan  ', preferredLocale: 'en' }), { displayName: 'Lan', preferredLocale: 'en' });
});
test('rejects unknown fields and invalid locale', () => {
  assert.throws(() => parseProfileInput({ role: 'admin' }));
  assert.throws(() => parseProfileInput({ preferredLocale: 'fr' }));
});
test('rejects empty or overlong display names', () => {
  assert.throws(() => parseProfileInput({ displayName: '  ' }));
  assert.throws(() => parseProfileInput({ displayName: 'a'.repeat(81) }));
});
