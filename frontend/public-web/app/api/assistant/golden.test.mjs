/**
 * Golden scenarios for the assistant contract.
 *
 * These are the shapes we expect real Gemini replies to take, in both
 * languages, plus the shapes that must be rejected before anything reaches the
 * UI. `logic.test.mjs` covers individual helpers; this file covers end-to-end
 * reply acceptance so a schema change cannot silently loosen validation.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAssistantReply, sanitizeMessages } from './logic.ts';
import { assistantCopy, assistantErrorText } from '../../../lib/i18n.ts';

const catalog = ['cano-an-thoi', 'com-nha-phu-quoc', 'khach-san-duong-dong', 'xe-san-bay', 'spa-duong-dong', 'giat-la-trung-tam', 'hai-san-bai-truong'];

const day = (number, activities) => ({ day: number, activities });

const reply = (overrides = {}) => JSON.stringify({
  kind: 'itinerary',
  message: 'Lịch trình tham khảo cho chuyến đi của bạn.',
  preferences: { days: 1, guests: 4, budgetVnd: 8000000, interest: 'biển' },
  plan: {
    title: 'Một ngày ở Phú Quốc',
    days: [day(1, [
      { serviceId: 'cano-an-thoi', time: '09:00', note: 'Ra đảo buổi sáng.' },
      { serviceId: 'com-nha-phu-quoc', time: '12:00', note: 'Ăn trưa.' },
      { serviceId: 'hai-san-bai-truong', time: '19:00', note: 'Ăn tối hải sản.' },
    ])],
  },
  ...overrides,
});

test('golden VI: one-day family plan keeps all three day periods', () => {
  const parsed = parseAssistantReply(reply(), catalog);

  assert.equal(parsed?.kind, 'itinerary');
  assert.equal(parsed?.preferences.guests, 4);
  assert.equal(parsed?.plan.days[0].activities.length, 3);
  assert.deepEqual(parsed?.plan.days[0].activities.map((activity) => activity.time), ['09:00', '12:00', '19:00']);
});

test('golden VI: "7 giờ tối" and "6h chiều" are normalised, not rejected', () => {
  const parsed = parseAssistantReply(reply({
    plan: {
      title: 'Một ngày nhẹ nhàng',
      days: [day(1, [
        { serviceId: 'cano-an-thoi', time: '8 giờ sáng', note: 'Ra đảo.' },
        { serviceId: 'com-nha-phu-quoc', time: '12 giờ trưa', note: 'Ăn trưa.' },
        { serviceId: 'hai-san-bai-truong', time: '7 giờ tối', note: 'Ăn tối.' },
      ])],
    },
  }), catalog);

  assert.deepEqual(parsed?.plan.days[0].activities.map((activity) => activity.time), ['08:00', '12:00', '19:00']);
});

test('golden EN: two-day couple plan with 12-hour clock is accepted and sorted', () => {
  const parsed = parseAssistantReply(JSON.stringify({
    kind: 'itinerary',
    message: 'Here is a relaxed two-day plan for two people.',
    preferences: { days: 2, guests: 2, budgetVnd: 6000000, interest: 'beach and food' },
    plan: {
      title: 'Two days in Phu Quoc',
      days: [
        day(1, [
          { serviceId: 'com-nha-phu-quoc', time: '07:00 PM', note: 'Dinner.' },
          { serviceId: 'cano-an-thoi', time: '9:00 AM', note: 'Island hopping.' },
          { serviceId: 'com-nha-phu-quoc', time: '12:30 PM', note: 'Lunch.' },
        ]),
        day(2, [
          { serviceId: 'xe-san-bay', time: '08:00', note: 'Airport transfer.' },
          { serviceId: 'com-nha-phu-quoc', time: '12:00', note: 'Lunch.' },
          { serviceId: 'spa-duong-dong', time: '06:00 PM', note: 'Spa.' },
        ]),
      ],
    },
  }), catalog);

  assert.equal(parsed?.kind, 'itinerary');
  assert.deepEqual(parsed?.plan.days[0].activities.map((activity) => activity.time), ['09:00', '12:30', '19:00']);
  assert.deepEqual(parsed?.plan.days[1].activities.map((activity) => activity.time), ['08:00', '12:00', '18:00']);
});

test('golden VI: a chat reply about rain is accepted without any plan', () => {
  const parsed = parseAssistantReply(JSON.stringify({
    kind: 'chat',
    message: 'Chiều nay mưa lớn ở Bãi Trường, bạn nên dời hoạt động biển sang sáng mai.',
    preferences: { days: null, guests: null, budgetVnd: null, interest: '' },
  }), catalog);

  assert.equal(parsed?.kind, 'chat');
  assert.equal('plan' in (parsed ?? {}), false);
});

test('golden VI: itinerary is rejected when the day count disagrees with preferences', () => {
  const parsed = parseAssistantReply(reply({
    preferences: { days: 3, guests: 4, budgetVnd: 8000000, interest: 'biển' },
  }), catalog);

  assert.equal(parsed, null);
});

test('golden VI: itinerary is rejected when the day has fewer than three activities', () => {
  const parsed = parseAssistantReply(reply({
    plan: {
      title: 'Một ngày quá ngắn',
      days: [day(1, [
        { serviceId: 'cano-an-thoi', time: '09:00', note: 'Ra đảo.' },
        { serviceId: 'com-nha-phu-quoc', time: '19:00', note: 'Ăn tối.' },
      ])],
    },
  }), catalog);

  assert.equal(parsed, null);
});

test('golden: out-of-range preferences are rejected instead of being clamped', () => {
  for (const preferences of [
    { days: 7, guests: 4, budgetVnd: 8000000, interest: 'biển' },
    { days: 1, guests: 0, budgetVnd: 8000000, interest: 'biển' },
    { days: 1, guests: 4, budgetVnd: 50000, interest: 'biển' },
    { days: 1, guests: 4, budgetVnd: 8000000, interest: 'x'.repeat(81) },
  ]) {
    assert.equal(parseAssistantReply(reply({ preferences }), catalog), null);
  }
});

test('golden: malformed JSON and unknown kinds never reach the UI', () => {
  assert.equal(parseAssistantReply('not json', catalog), null);
  assert.equal(parseAssistantReply(JSON.stringify({ kind: 'booking', message: 'Đã đặt.', preferences: { days: null, guests: null, budgetVnd: null, interest: '' } }), catalog), null);
});

test('golden privacy: emails and phone numbers in both formats are redacted before the model sees them', () => {
  const [message] = sanitizeMessages([
    { role: 'user', text: 'Gọi tôi 0912 345 678 hoặc +84 912 345 678, email khach@example.com nhé.' },
  ]);

  assert.doesNotMatch(message.text, /khach@example\.com/);
  assert.doesNotMatch(message.text, /0912|912 345/);
  // Local number, international number and email are three separate hits.
  assert.equal((message.text.match(/\[đã ẩn thông tin liên hệ\]/g) ?? []).length, 3);
});

test('copy: every assistant error code maps to a sentence in both languages', () => {
  const codes = ['GEMINI_OVERLOADED', 'GEMINI_TIMEOUT', 'GEMINI_INVALID_REPLY', 'GEMINI_NOT_CONFIGURED', 'GEMINI_AUTH_ERROR', 'GEMINI_PROVIDER_ERROR', 'LOCAL_RATE_LIMIT', 'CHAT_API_NOT_FOUND', 'CHAT_API_UNREACHABLE', 'SOMETHING_NEW'];

  for (const lang of ['vi', 'en']) {
    for (const code of codes) {
      const text = assistantErrorText(code, assistantCopy[lang]);
      assert.equal(typeof text, 'string', `${lang}/${code} should be a string`);
      assert.ok(text.length > 10, `${lang}/${code} should be actionable`);
    }
  }
});

test('copy: VI and EN dictionaries expose the same keys so the UI cannot render undefined', () => {
  assert.deepEqual(Object.keys(assistantCopy.vi).sort(), Object.keys(assistantCopy.en).sort());
  assert.equal(assistantCopy.vi.widgetQuick.length, assistantCopy.en.widgetQuick.length);
});
