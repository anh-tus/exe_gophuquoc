import assert from 'node:assert/strict';
import test from 'node:test';
import { buildVisibleMessages, getDayPeriod, isRetryableGeminiStatus, parseAssistantReply, sanitizeMessages } from './logic.ts';

const catalog = ['cano-an-thoi', 'com-nha-phu-quoc', 'khach-san-duong-dong', 'xe-san-bay', 'spa-duong-dong', 'giat-la-trung-tam', 'hai-san-bai-truong'];

test('rejects assistant itineraries that reference services outside the demo catalog', () => {
  const reply = JSON.stringify({
    kind: 'itinerary',
    message: 'Đây là lịch trình gợi ý.',
    preferences: { days: 3, guests: 5, budgetVnd: 20000000, interest: 'food' },
    plan: { title: 'Ba ngày ở đảo', days: [{ day: 1, activities: [{ serviceId: 'unknown-service', time: '09:00', note: 'Đi chơi' }, { serviceId: 'cano-an-thoi', time: '14:00', note: 'Ra đảo' }] }] },
  });

  assert.equal(parseAssistantReply(reply, catalog), null);
});

test('accepts a correctly referenced three-day itinerary with group preferences', () => {
  const reply = JSON.stringify({
    kind: 'itinerary',
    message: 'Lịch trình tham khảo cho cả nhóm.',
    preferences: { days: 3, guests: 5, budgetVnd: 20000000, interest: 'biển và ẩm thực' },
    plan: { title: 'Ba ngày ở Phú Quốc', days: [1, 2, 3].map((day) => ({ day, activities: [
      { serviceId: 'cano-an-thoi', time: '09:00', note: 'Khám phá biển đảo' },
      { serviceId: 'com-nha-phu-quoc', time: '12:00', note: 'Ăn trưa' },
      { serviceId: 'com-nha-phu-quoc', time: '18:00', note: 'Thưởng thức món địa phương' },
    ] })) },
  });

  const parsed = parseAssistantReply(reply, catalog);
  assert.equal(parsed?.kind, 'itinerary');
  assert.equal(parsed?.preferences.guests, 5);
  assert.equal(parsed?.preferences.budgetVnd, 20000000);
  assert.equal(parsed?.plan.days.length, 3);
});

test('redacts contact details and bounds chat history before sending it to Gemini', () => {
  const messages = sanitizeMessages([
    { role: 'user', text: 'Lên lịch cho tôi, email abc@example.com, số 0901234567' },
    { role: 'assistant', text: 'Bạn đi mấy ngày?' },
  ]);

  assert.equal(messages.length, 2);
  assert.match(messages[0].text, /\[đã ẩn thông tin liên hệ\]/);
  assert.doesNotMatch(messages[0].text, /abc@example.com|0901234567/);
});

test('normalizes common 12-hour times in itinerary replies instead of rejecting the whole plan', () => {
  const reply = JSON.stringify({
    kind: 'itinerary',
    message: 'Mình đã lên kế hoạch cho bạn.',
    preferences: { days: 1, guests: 2, budgetVnd: 5000000, interest: 'biển' },
    plan: { title: 'Một ngày ở đảo', days: [{ day: 1, activities: [
      { serviceId: 'cano-an-thoi', time: '9:00 AM', note: 'Ra đảo' },
      { serviceId: 'com-nha-phu-quoc', time: '12:30 PM', note: 'Ăn trưa' },
      { serviceId: 'com-nha-phu-quoc', time: '06:30 PM', note: 'Ăn tối' },
    ] }] },
  });

  const parsed = parseAssistantReply(reply, catalog);
  assert.equal(parsed?.kind, 'itinerary');
  assert.equal(parsed?.plan.days[0].activities[0].time, '09:00');
  assert.equal(parsed?.plan.days[0].activities[1].time, '12:30');
  assert.equal(parsed?.plan.days[0].activities[2].time, '18:30');
});

test('groups activities into morning, lunch, afternoon and evening from their actual times', () => {
  assert.equal(getDayPeriod('08:30'), 'morning');
  assert.equal(getDayPeriod('12:00'), 'lunch');
  assert.equal(getDayPeriod('15:30'), 'afternoon');
  assert.equal(getDayPeriod('19:00'), 'evening');
});

test('rejects a detailed itinerary day that has no lunch activity', () => {
  const reply = JSON.stringify({
    kind: 'itinerary',
    message: 'Lịch trình tham khảo.',
    preferences: { days: 1, guests: 2, budgetVnd: 5000000, interest: 'biển' },
    plan: { title: 'Một ngày ở đảo', days: [{ day: 1, activities: [
      { serviceId: 'cano-an-thoi', time: '09:00', note: 'Ra đảo' },
      { serviceId: 'spa-duong-dong', time: '14:00', note: 'Nghỉ ngơi' },
      { serviceId: 'com-nha-phu-quoc', time: '18:30', note: 'Ăn tối' },
    ] }] },
  });

  assert.equal(parseAssistantReply(reply, catalog), null);
});

test('keeps more successful chat turns while bounding message size', () => {
  const messages = sanitizeMessages(Array.from({ length: 20 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant', text: `${index}: ${'x'.repeat(900)}`,
  })));

  assert.equal(messages.length, 16);
  assert.equal(messages[0].text.startsWith('4:'), true);
  assert.equal(messages[0].text.length, 800);
});

test('only retries Gemini overload and transient server responses', () => {
  assert.equal(isRetryableGeminiStatus(429), true);
  assert.equal(isRetryableGeminiStatus(503), true);
  assert.equal(isRetryableGeminiStatus(400), false);
});

test('accepts a detailed itinerary spanning every catalog service category', () => {
  const reply = JSON.stringify({
    kind: 'itinerary',
    message: 'Mình đã kết hợp lưu trú, ăn uống và trải nghiệm cho chuyến đi.',
    preferences: { days: 2, guests: 2, budgetVnd: 5000000, interest: 'khám phá' },
    plan: { title: 'Hai ngày nhiều trải nghiệm', days: [
      { day: 1, activities: [
        { serviceId: 'xe-san-bay', time: '08:00', endTime: '08:30', durationMinutes: 30, note: 'Di chuyển về trung tâm.', logistics: 'Xe riêng, chi phí tính theo xe.', tips: 'Chuẩn bị mã chuyến bay.' },
        { serviceId: 'com-nha-phu-quoc', time: '12:00', endTime: '13:00', durationMinutes: 60, note: 'Ăn trưa món địa phương.', logistics: 'Nhà hàng ở Dương Đông.', tips: 'Giá tính theo phần.' },
        { serviceId: 'khach-san-duong-dong', time: '14:00', endTime: '14:30', durationMinutes: 30, note: 'Nhận phòng nghỉ.', logistics: 'Một phòng theo giá demo.', tips: 'Giờ nhận phòng cần xác nhận.' },
      { serviceId: 'hai-san-bai-truong', time: '19:00', endTime: '20:00', durationMinutes: 60, note: 'Ăn tối hải sản.', logistics: 'Khu vực Bãi Trường.', tips: 'Xác nhận giờ phục vụ trước khi đi.' },
      ] },
      { day: 2, activities: [
        { serviceId: 'cano-an-thoi', time: '08:00', endTime: '11:00', durationMinutes: 180, note: 'Khám phá các đảo phía nam.', logistics: 'Di chuyển đến An Thới.', tips: 'Mang kem chống nắng.' },
        { serviceId: 'com-nha-phu-quoc', time: '12:00', endTime: '13:00', durationMinutes: 60, note: 'Ăn trưa.', logistics: 'Nhà hàng tại Dương Đông.', tips: 'Giờ phục vụ cần xác nhận.' },
        { serviceId: 'spa-duong-dong', time: '14:00', endTime: '15:00', durationMinutes: 60, note: 'Nghỉ ngơi sau chuyến đi.', logistics: 'Khu vực Dương Đông.', tips: 'Lịch cần xác nhận trực tiếp.' },
        { serviceId: 'giat-la-trung-tam', time: '16:00', endTime: '16:30', durationMinutes: 30, note: 'Gửi đồ giặt khi lưu trú.', logistics: 'Nhận và trả tại trung tâm.', tips: 'Giá tính theo món.' },
        { serviceId: 'hai-san-bai-truong', time: '19:00', endTime: '20:00', durationMinutes: 60, note: 'Ăn tối.', logistics: 'Khu vực Bãi Trường.', tips: 'Xác nhận giờ phục vụ trước khi đi.' },
      ] },
    ] },
  });

  const parsed = parseAssistantReply(reply, catalog);
  assert.equal(parsed?.kind, 'itinerary');
  assert.equal(parsed?.plan.days[0].activities.length, 4);
  assert.equal(parsed?.plan.days.flatMap((day) => day.activities).length, 9);
  assert.equal(parsed?.plan.days[0].activities[0].endTime, '08:30');
  assert.equal(parsed?.plan.days[0].activities[0].logistics, 'Xe riêng, chi phí tính theo xe.');
  assert.equal(parsed?.plan.days[0].activities[0].time, '08:00');
  assert.equal(parsed?.plan.days[0].activities.at(-1).time, '19:00');
});

test('accepts service discovery results with catalog ids and a reason for each match', () => {
  const reply = JSON.stringify({
    kind: 'service_search',
    message: 'Mình tìm được vài lựa chọn phù hợp.',
    preferences: { days: null, guests: null, budgetVnd: null, interest: 'hải sản gần Bãi Trường' },
    title: 'Gợi ý quán ăn và tour',
    recommendations: [
      { serviceId: 'hai-san-bai-truong', reason: 'Nhà hàng ở Bãi Trường, phù hợp nhu cầu hải sản.' },
      { serviceId: 'cano-an-thoi', reason: 'Tour khám phá biển đảo phía nam.' },
    ],
  });

  const parsed = parseAssistantReply(reply, catalog);
  assert.equal(parsed?.kind, 'service_search');
  assert.equal(parsed?.title, 'Gợi ý quán ăn và tour');
  assert.equal(parsed?.recommendations[0].serviceId, 'hai-san-bai-truong');
});

test('rejects service discovery results that invent services or omit match reasons', () => {
  const reply = JSON.stringify({
    kind: 'service_search',
    message: 'Đây là gợi ý.',
    preferences: { days: null, guests: null, budgetVnd: null, interest: '' },
    title: 'Gợi ý',
    recommendations: [{ serviceId: 'fake-place', reason: 'Trông phù hợp.' }],
  });

  assert.equal(parseAssistantReply(reply, catalog), null);
});

test('accepts an empty service search when the demo catalog has no suitable match', () => {
  const reply = JSON.stringify({
    kind: 'service_search',
    message: 'Danh mục demo chưa có lựa chọn phù hợp.',
    preferences: { days: null, guests: null, budgetVnd: null, interest: 'lặn bình khí' },
    title: 'Chưa tìm thấy kết quả phù hợp',
    recommendations: [],
  });

  assert.deepEqual(parseAssistantReply(reply, catalog)?.kind, 'service_search');
});

test('shows the pending user message after the successful conversation without committing it', () => {
  const history = [
    { role: 'user', text: 'Tôi muốn đi Phú Quốc.' },
    { role: 'assistant', text: 'Bạn dự kiến đi mấy ngày?' },
  ];

  const visible = buildVisibleMessages(history, '3 ngày, 5 người.');

  assert.equal(visible.length, 3);
  assert.equal(visible[2].role, 'user');
  assert.equal(visible[2].text, '3 ngày, 5 người.');
  assert.equal(history.length, 2);
});
