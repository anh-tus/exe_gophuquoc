import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.frankfurter.dev/v2/rate/USD/VND', { next: { revalidate: 43_200 } });
    if (!response.ok) throw new Error('Rate unavailable');
    const value = await response.json() as { rate?: number; date?: string };
    if (!Number.isFinite(value.rate) || !value.rate || value.rate <= 0 || typeof value.date !== 'string') throw new Error('Invalid rate');
    return NextResponse.json({ vndPerUsd: value.rate, date: value.date, source: 'Frankfurter' });
  } catch {
    return NextResponse.json({ error: 'Exchange rate unavailable' }, { status: 503 });
  }
}
