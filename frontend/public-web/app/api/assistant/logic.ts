export type ChatMessage = { role: 'user' | 'assistant'; text: string };

export type TripPreferences = {
  days: number | null;
  guests: number | null;
  budgetVnd: number | null;
  interest: string;
};

export type AssistantActivity = { serviceId: string; time: string; endTime: string; durationMinutes: number; note: string; logistics: string; tips: string };
export type AssistantPlan = { title: string; days: Array<{ day: number; activities: AssistantActivity[] }> };
export type ServiceRecommendation = { serviceId: string; reason: string };
export type AssistantReply =
  | { kind: 'clarify'; message: string; preferences: TripPreferences }
  | { kind: 'itinerary'; message: string; preferences: TripPreferences; plan: AssistantPlan }
  | { kind: 'service_search'; message: string; preferences: TripPreferences; title: string; recommendations: ServiceRecommendation[] };

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const validPreferenceNumber = (value: unknown, min: number, max: number) => value === null || (Number.isInteger(value) && Number(value) >= min && Number(value) <= max);
const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);

export function isRetryableGeminiStatus(status: number): boolean {
  return RETRYABLE_GEMINI_STATUSES.has(status);
}

export function buildVisibleMessages(messages: readonly ChatMessage[], pendingUserText: string | null): ChatMessage[] {
  const text = pendingUserText?.trim();
  return text ? [...messages, { role: 'user', text }] : [...messages];
}

export type DayPeriod = 'morning' | 'lunch' | 'afternoon' | 'evening';

export function getDayPeriod(time: string): DayPeriod {
  const hour = Number(time.slice(0, 2));
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 18) return 'afternoon';
  return 'evening';
}

function normalizeAssistantTime(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLocaleLowerCase();
  const clock = normalized.match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)?$/i);
  if (clock) {
    let hour = Number(clock[1]);
    const minute = Number(clock[2]);
    if (clock[3]) {
      if (hour < 1 || hour > 12) return null;
      if (clock[3].toLowerCase() === 'am') hour = hour === 12 ? 0 : hour;
      else hour = hour === 12 ? 12 : hour + 12;
    } else if (hour > 23) return null;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  const vietnameseClock = normalized.match(/^(\d{1,2})(?::([0-5]\d))?\s*(?:giờ|h)?\s*(sáng|trưa|chiều|tối)?$/i);
  if (!vietnameseClock) return null;
  let hour = Number(vietnameseClock[1]);
  const minute = Number(vietnameseClock[2] || '0');
  const period = vietnameseClock[3];
  if (period) {
    if (hour < 1 || hour > 12) return null;
    if (period === 'sáng') hour = hour === 12 ? 0 : hour;
    else if (period === 'trưa') hour = hour === 12 ? 12 : hour + 12;
    else hour = hour === 12 ? 12 : hour + 12;
  } else if (hour > 23) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const total = (hour * 60 + minute + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function sanitizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-16).flatMap((item) => {
    if (!isRecord(item) || !['user', 'assistant'].includes(String(item.role)) || typeof item.text !== 'string') return [];
    const text = item.text.trim().slice(0, 800)
      .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[đã ẩn thông tin liên hệ]')
      .replace(/(?:\+?\d[\s().-]*){9,}/g, '[đã ẩn thông tin liên hệ]');
    return text ? [{ role: item.role as ChatMessage['role'], text }] : [];
  });
}

export function parseAssistantReply(raw: string, allowedServiceIds: readonly string[]): AssistantReply | null {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!isRecord(value) || typeof value.message !== 'string' || value.message.length > 1600 || !isRecord(value.preferences)) return null;

  const preferences = value.preferences;
  if (!validPreferenceNumber(preferences.days, 1, 5) || !validPreferenceNumber(preferences.guests, 1, 20) || !validPreferenceNumber(preferences.budgetVnd, 100_000, 100_000_000) || typeof preferences.interest !== 'string' || preferences.interest.length > 80) return null;
  const normalizedPreferences = {
    days: preferences.days as number | null,
    guests: preferences.guests as number | null,
    budgetVnd: preferences.budgetVnd as number | null,
    interest: preferences.interest,
  };

  if (value.kind === 'clarify') return { kind: 'clarify', message: value.message, preferences: normalizedPreferences };
  if (value.kind === 'service_search') {
    if (typeof value.title !== 'string' || !value.title.trim() || value.title.length > 120 || !Array.isArray(value.recommendations) || value.recommendations.length > 8) return null;
    const recommendations = value.recommendations.map((item) => {
      if (!isRecord(item) || typeof item.serviceId !== 'string' || !allowedServiceIds.includes(item.serviceId) || typeof item.reason !== 'string' || !item.reason.trim() || item.reason.length > 240) return null;
      return { serviceId: item.serviceId, reason: item.reason.trim() };
    });
    if (recommendations.some((item) => item === null)) return null;
    return { kind: 'service_search', message: value.message, preferences: normalizedPreferences, title: value.title.trim(), recommendations: recommendations as ServiceRecommendation[] };
  }
  if (value.kind !== 'itinerary' || !isRecord(value.plan) || typeof value.plan.title !== 'string' || value.plan.title.length > 120 || !Array.isArray(value.plan.days)) return null;
  if (value.plan.days.length < 1 || value.plan.days.length > 5 || (normalizedPreferences.days && value.plan.days.length !== normalizedPreferences.days)) return null;

  const days = value.plan.days.map((day, index) => {
    if (!isRecord(day) || day.day !== index + 1 || !Array.isArray(day.activities) || day.activities.length < 3 || day.activities.length > 5) return null;
    const activities = day.activities.map((activity) => {
      if (!isRecord(activity) || typeof activity.serviceId !== 'string' || !allowedServiceIds.includes(activity.serviceId) || typeof activity.note !== 'string' || activity.note.length > 240) return null;
      const time = normalizeAssistantTime(activity.time);
      if (!time) return null;
      const endTime = normalizeAssistantTime(activity.endTime) || addMinutesToTime(time, 60);
      const startMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
      const endMinutes = Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3));
      const derivedDuration = (endMinutes - startMinutes + 24 * 60) % (24 * 60) || 60;
      const durationMinutes = Number.isInteger(activity.durationMinutes) && Number(activity.durationMinutes) >= 15 && Number(activity.durationMinutes) <= 720
        ? Number(activity.durationMinutes)
        : derivedDuration;
      const logistics = typeof activity.logistics === 'string' ? activity.logistics.slice(0, 200) : '';
      const tips = typeof activity.tips === 'string' ? activity.tips.slice(0, 200) : '';
      return { serviceId: activity.serviceId, time, endTime, durationMinutes, note: activity.note, logistics, tips };
    });
    if (activities.some((activity) => activity === null)) return null;
    const scheduledActivities = (activities as AssistantActivity[]).sort((first, second) => first.time.localeCompare(second.time));
    const periods = new Set(scheduledActivities.map((activity) => getDayPeriod(activity.time)));
    if (!periods.has('morning') || !periods.has('lunch') || !periods.has('evening')) return null;
    return { day: day.day as number, activities: scheduledActivities };
  });
  if (days.some((day) => day === null)) return null;
  return { kind: 'itinerary', message: value.message, preferences: normalizedPreferences, plan: { title: value.plan.title, days: days as AssistantPlan['days'] } };
}
