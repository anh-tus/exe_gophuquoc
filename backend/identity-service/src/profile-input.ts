export type Locale = 'vi' | 'en';

export function parseProfileInput(value: unknown): { displayName?: string | null; preferredLocale?: Locale } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid profile');
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => !['displayName', 'preferredLocale'].includes(key))) throw new Error('Invalid profile');
  const result: { displayName?: string | null; preferredLocale?: Locale } = {};
  if ('displayName' in input) {
    if (input.displayName === null) result.displayName = null;
    else if (typeof input.displayName === 'string') {
      const trimmed = input.displayName.trim();
      if (trimmed.length < 1 || trimmed.length > 80) throw new Error('Invalid display name');
      result.displayName = trimmed;
    } else throw new Error('Invalid display name');
  }
  if ('preferredLocale' in input) {
    if (input.preferredLocale !== 'vi' && input.preferredLocale !== 'en') throw new Error('Invalid locale');
    result.preferredLocale = input.preferredLocale;
  }
  if (!Object.keys(result).length) throw new Error('Empty profile update');
  return result;
}
