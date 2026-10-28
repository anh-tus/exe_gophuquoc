'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import './pilot.css';

type Locale = 'vi' | 'en';
type Offering = { id: string; titleVi: string; titleEn: string; unitPriceVnd: number; minGuests: number; maxGuests: number };
type Listing = { id: string; category: string; titleVi: string; titleEn: string; descriptionVi: string; descriptionEn: string; area: string; latitude: number | null; longitude: number | null; imageUrl: string | null; offerings: Offering[] };
type Booking = { id: string; status: string; startsAt: string | null; totalPriceVnd: number | null; depositVnd: number | null; createdAt: string; offeringId: string | null };
type Profile = { customerId: string; displayName: string | null; preferredLocale: Locale };

const supplyUrl = process.env.NEXT_PUBLIC_SUPPLY_API_URL || 'http://localhost:3102/v1';
const identityUrl = process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'http://localhost:3101/v1';
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_API_URL || 'http://localhost:3103/v1';
const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const firebaseReady = !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
const categories = ['ALL', 'STAY', 'TOUR', 'TRANSPORT', 'SPA', 'LAUNDRY'] as const;
const labels: Record<Locale, Record<string, string>> = {
  vi: { title: 'Khám phá dịch vụ Phú Quốc', subtitle: 'Listing và tình trạng dịch vụ từ hệ thống pilot.', search: 'Tìm dịch vụ', area: 'Khu vực', date: 'Ngày', guests: 'Số người', maxPrice: 'Giá tối đa (VND)', all: 'Tất cả', STAY: 'Lưu trú', TOUR: 'Tour', TRANSPORT: 'Di chuyển', SPA: 'Spa', LAUNDRY: 'Giặt là', reset: 'Xóa bộ lọc', empty: 'Chưa có dịch vụ phù hợp. Bạn có thể gửi yêu cầu concierge.', loading: 'Đang tải…', unavailable: 'Không tải được dữ liệu. Vui lòng thử lại.', account: 'Tài khoản', login: 'Đăng nhập', register: 'Tạo tài khoản', email: 'Email', password: 'Mật khẩu', logout: 'Đăng xuất', profile: 'Hồ sơ', save: 'Lưu hồ sơ', name: 'Tên hiển thị', bookings: 'Đặt chỗ của tôi', noBookings: 'Bạn chưa có booking.', select: 'Xem chi tiết', map: 'Bản đồ', mapUnavailable: 'Chưa cấu hình Google Maps hoặc listing không có tọa độ.', offering: 'Gói dịch vụ', quantity: 'Số lượng', time: 'Ngày và giờ', book: 'Giữ chỗ 15 phút', request: 'Gửi concierge request', message: 'Mô tả nhu cầu', direct: 'Thanh toán trực tiếp với đối tác; thanh toán cọc chỉ chạy sandbox.', needLogin: 'Đăng nhập để tạo booking hoặc gửi yêu cầu.', authUnavailable: 'Firebase Auth chưa được cấu hình.', price: 'Giá từ', cancel: 'Hủy booking', pay: 'Thanh toán cọc thử nghiệm', review: 'Đánh giá', status: 'Trạng thái', success: 'Đã gửi yêu cầu', consent: 'Thông tin pilot. Booking và giá chỉ có hiệu lực khi được xác nhận bởi hệ thống/đối tác.', back: 'Về trang demo', itinerary: 'Lịch trình mẫu' },
  en: { title: 'Explore Phu Quoc services', subtitle: 'Listings and availability from the pilot backend.', search: 'Search services', area: 'Area', date: 'Date', guests: 'Guests', maxPrice: 'Maximum price (VND)', all: 'All', STAY: 'Stays', TOUR: 'Tours', TRANSPORT: 'Transport', SPA: 'Spa', LAUNDRY: 'Laundry', reset: 'Reset filters', empty: 'No matching services yet. You can send a concierge request.', loading: 'Loading…', unavailable: 'Unable to load data. Please try again.', account: 'Account', login: 'Sign in', register: 'Create account', email: 'Email', password: 'Password', logout: 'Sign out', profile: 'Profile', save: 'Save profile', name: 'Display name', bookings: 'My bookings', noBookings: 'No bookings yet.', select: 'View details', map: 'Map', mapUnavailable: 'Google Maps is not configured or this listing has no coordinates.', offering: 'Offering', quantity: 'Quantity', time: 'Date and time', book: 'Hold for 15 minutes', request: 'Send concierge request', message: 'Describe your needs', direct: 'Pay the partner directly; deposit payments are sandbox only.', needLogin: 'Sign in to book or send a request.', authUnavailable: 'Firebase Auth is not configured.', price: 'From', cancel: 'Cancel booking', pay: 'Try sandbox deposit', review: 'Review', status: 'Status', success: 'Request sent', consent: 'Pilot information. Booking and price apply only after system/partner confirmation.', back: 'Back to demo', itinerary: 'Sample itinerary' },
};

function money(value: number, locale: Locale) { return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(value) + ' ₫'; }
function apiError(error: unknown) { return error instanceof Error ? error.message : 'Request failed'; }
async function jsonRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(typeof body.message === 'string' ? body.message : `HTTP ${response.status}`); }
  return response.json() as Promise<T>;
}

export default function CustomerPage() {
  const [locale, setLocale] = useState<Locale>('vi');
  const t = labels[locale];
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [displayName, setDisplayName] = useState('');
  const [listings, setListings] = useState<Listing[]>([]); const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [category, setCategory] = useState('ALL'); const [query, setQuery] = useState(''); const [area, setArea] = useState(''); const [date, setDate] = useState(''); const [guests, setGuests] = useState(1); const [maxPrice, setMaxPrice] = useState('');
  const [selected, setSelected] = useState<Listing | null>(null); const [offeringId, setOfferingId] = useState(''); const [startsAt, setStartsAt] = useState(''); const [quantity, setQuantity] = useState(1); const [message, setMessage] = useState('');
  const [fx, setFx] = useState<{ vndPerUsd: number; date: string; source: string } | null>(null);

  useEffect(() => { setToken(sessionStorage.getItem('gopu-pilot-token') || ''); setLocale(sessionStorage.getItem('gopu-pilot-locale') === 'en' ? 'en' : 'vi'); }, []);
  useEffect(() => { sessionStorage.setItem('gopu-pilot-locale', locale); }, [locale]);
  useEffect(() => { jsonRequest<{ vndPerUsd: number; date: string; source: string }>('/api/fx').then(setFx).catch(() => setFx(null)); }, []);
  useEffect(() => {
    const params = new URLSearchParams(); if (category !== 'ALL') params.set('category', category); if (query) params.set('query', query); if (area) params.set('area', area); if (date) params.set('date', date); if (guests > 1) params.set('guests', String(guests)); if (maxPrice) params.set('maxPriceVnd', maxPrice);
    let active = true; setLoading(true); setError('');
    const timer = setTimeout(() => { jsonRequest<Listing[]>(`${supplyUrl}/listings?${params}`).then(items => { if (active) setListings(items); }).catch(e => { if (active) setError(apiError(e)); }).finally(() => { if (active) setLoading(false); }); }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [category, query, area, date, guests, maxPrice]);
  useEffect(() => {
    if (!token) { setProfile(null); setBookings([]); return; }
    const headers = { Authorization: `Bearer ${token}` };
    jsonRequest<Profile>(`${identityUrl}/auth/me`, { headers }).then(p => { setProfile(p); setDisplayName(p.displayName || ''); }).catch(() => { sessionStorage.removeItem('gopu-pilot-token'); setToken(''); });
    jsonRequest<Booking[]>(`${bookingUrl}/bookings`, { headers }).then(setBookings).catch(e => setNotice(apiError(e)));
  }, [token]);
  const price = useMemo(() => selected?.offerings.find(o => o.id === offeringId)?.unitPriceVnd, [selected, offeringId]);
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  async function authenticate(create: boolean) {
    setNotice(''); if (!firebaseReady) { setNotice(t.authUnavailable); return; }
    try {
      const app = getApps()[0] || initializeApp({ apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
      const auth = getAuth(app); const credential = create ? await createUserWithEmailAndPassword(auth, email, password) : await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const session = await jsonRequest<{ accessToken: string }>(`${identityUrl}/auth/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
      sessionStorage.setItem('gopu-pilot-token', session.accessToken); setToken(session.accessToken); setPassword('');
    } catch (e) { setNotice(apiError(e)); }
  }
  async function saveProfile() { try { const p = await jsonRequest<Profile>(`${identityUrl}/auth/me`, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ displayName, preferredLocale: locale }) }); setProfile(p); setNotice(t.success); } catch (e) { setNotice(apiError(e)); } }
  async function createBooking(request: boolean) {
    if (!token) { setNotice(t.needLogin); return; }
    try {
      const body = request ? { offeringId: selected?.offerings[0]?.id, message } : { offeringId, startsAt: new Date(startsAt).toISOString(), quantity };
      const item = await jsonRequest<Booking>(`${bookingUrl}/bookings/${request ? 'requests' : 'instant'}`, { method: 'POST', headers: { ...authHeaders, 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(body) });
      setBookings(current => [item, ...current]); setNotice(`${t.success}: ${item.id}`); setSelected(null);
    } catch (e) { setNotice(apiError(e)); }
  }
  async function cancelBooking(id: string) { try { await jsonRequest(`${bookingUrl}/bookings/${id}/cancel`, { method: 'POST', headers: authHeaders }); setBookings(current => current.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b)); } catch (e) { setNotice(apiError(e)); } }
  async function paySandbox(id: string) { try { const form = await jsonRequest<{ action: string; method: string; fields: Record<string, string> }>(`${bookingUrl}/bookings/${id}/sandbox-payment`, { method: 'POST', headers: authHeaders }); const node = document.createElement('form'); node.method = form.method; node.action = form.action; for (const [name, value] of Object.entries(form.fields)) { const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; node.append(input); } document.body.append(node); node.submit(); } catch (e) { setNotice(apiError(e)); } }
  async function logout() { if (firebaseReady && getApps().length) await signOut(getAuth()).catch(() => undefined); sessionStorage.removeItem('gopu-pilot-token'); setToken(''); }

  return <div className="pilot">
    <header className="pilot-header"><a href="/" className="pilot-brand"><Image src="/brand/gopu-logo.png" alt="GOPU" width={54} height={54} /><strong>GOPU <span>Pilot</span></strong></a><nav><a href="/">{t.back}</a><a href="/?view=itinerary">{t.itinerary}</a><a href="#account">{t.account}</a></nav><div className="pilot-languages"><button aria-pressed={locale === 'vi'} onClick={() => setLocale('vi')}>VI</button><button aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button></div></header>
    <main className="pilot-main"><section className="pilot-intro"><div><span className="pilot-kicker">GOPU · PHÚ QUỐC</span><h1>{t.title}</h1><p>{t.subtitle}</p></div><div className="pilot-intro-note">{t.consent}</div></section>
      <section className="pilot-filters" aria-label={t.search}><label>{t.search}<input value={query} onChange={e => setQuery(e.target.value)} /></label><label>{t.area}<input value={area} onChange={e => setArea(e.target.value)} /></label><label>{t.date}<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><label>{t.guests}<input type="number" min="1" max="20" value={guests} onChange={e => setGuests(Number(e.target.value))} /></label><label>{t.maxPrice}<input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} /></label><button onClick={() => { setQuery(''); setArea(''); setDate(''); setGuests(1); setMaxPrice(''); setCategory('ALL'); }}>{t.reset}</button></section>
      <div className="pilot-categories">{categories.map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c === 'ALL' ? t.all : t[c]}</button>)}</div>
      {fx && <p className="pilot-fx">{locale === 'vi' ? 'USD quy đổi tham khảo' : 'Reference USD conversion'} · {fx.source} · {fx.date} · 1 USD ≈ {money(fx.vndPerUsd, locale)}</p>}
      {error && <div className="pilot-alert" role="alert">{t.unavailable} {error}</div>}{notice && <div className="pilot-alert" role="status">{notice}</div>}
      <section className="pilot-results" aria-live="polite">{loading ? <p>{t.loading}</p> : listings.length === 0 ? <p className="pilot-empty">{t.empty}</p> : listings.map(item => <article className="pilot-card" key={item.id}><div className="pilot-card-image">{item.imageUrl ? <Image src={item.imageUrl} alt="" fill unoptimized /> : <span>GOPU</span>}</div><div className="pilot-card-body"><span className="pilot-chip">{t[item.category] || item.category} · {item.area}</span><h2>{locale === 'vi' ? item.titleVi : item.titleEn}</h2><p>{locale === 'vi' ? item.descriptionVi : item.descriptionEn}</p><div className="pilot-card-bottom"><strong>{item.offerings.length ? `${t.price} ${money(Math.min(...item.offerings.map(o => o.unitPriceVnd)), locale)}` : (locale === 'vi' ? 'Liên hệ báo giá' : 'Request a quote')}{fx && item.offerings.length ? <small> ≈ ${Math.round(Math.min(...item.offerings.map(o => o.unitPriceVnd)) / fx.vndPerUsd)} USD</small> : null}</strong><button onClick={() => { setSelected(item); setOfferingId(item.offerings[0]?.id || ''); setStartsAt(''); }}>{t.select}</button></div></div></article>)}</section>
      <section id="account" className="pilot-account"><div><span className="pilot-kicker">GOPU CUSTOMER</span><h2>{t.account}</h2><p>{t.direct}</p></div>{!token ? <div className="pilot-auth"><p>{firebaseReady ? t.needLogin : t.authUnavailable}</p><label>{t.email}<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label>{t.password}<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><div className="pilot-actions"><button disabled={!firebaseReady} onClick={() => authenticate(false)}>{t.login}</button><button disabled={!firebaseReady} onClick={() => authenticate(true)}>{t.register}</button></div></div> : <div className="pilot-auth"><h3>{t.profile}</h3><label>{t.name}<input value={displayName} onChange={e => setDisplayName(e.target.value)} /></label><div className="pilot-actions"><button onClick={saveProfile}>{t.save}</button><button onClick={logout}>{t.logout}</button></div><small>{profile?.customerId}</small></div>}</section>
      <section className="pilot-bookings"><h2>{t.bookings}</h2>{bookings.length === 0 ? <p>{t.noBookings}</p> : <div className="pilot-booking-grid">{bookings.map(b => <article key={b.id}><small>{b.id}</small><h3>{t.status}: {b.status}</h3><p>{b.startsAt ? new Date(b.startsAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US') : new Date(b.createdAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}</p>{b.totalPriceVnd != null && <p>{money(b.totalPriceVnd, locale)} · {money(b.depositVnd || 0, locale)} {locale === 'vi' ? 'cọc' : 'deposit'}</p>}<div className="pilot-actions">{b.status === 'AWAITING_DEPOSIT' && <button onClick={() => paySandbox(b.id)}>{t.pay}</button>}{!['CANCELLED','EXPIRED','COMPLETED'].includes(b.status) && <button onClick={() => cancelBooking(b.id)}>{t.cancel}</button>}</div></article>)}</div>}</section>
    </main>
    {selected && <div className="pilot-overlay" onClick={() => setSelected(null)}><div className="pilot-dialog" role="dialog" aria-modal="true" aria-label={locale === 'vi' ? selected.titleVi : selected.titleEn} onClick={e => e.stopPropagation()}><button className="pilot-close" aria-label="Close" onClick={() => setSelected(null)}>×</button><span className="pilot-kicker">{t[selected.category]} · {selected.area}</span><h2>{locale === 'vi' ? selected.titleVi : selected.titleEn}</h2><p>{locale === 'vi' ? selected.descriptionVi : selected.descriptionEn}</p><h3>{t.map}</h3>{mapsKey && selected.latitude != null && selected.longitude != null ? <iframe title={t.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(mapsKey)}&q=${selected.latitude},${selected.longitude}`} /> : <p className="pilot-map-empty">{t.mapUnavailable}</p>}<div className="pilot-dialog-form"><label>{t.offering}<select value={offeringId} onChange={e => setOfferingId(e.target.value)}>{selected.offerings.map(o => <option value={o.id} key={o.id}>{locale === 'vi' ? o.titleVi : o.titleEn} · {money(o.unitPriceVnd, locale)}</option>)}</select></label><label>{t.time}<input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} /></label><label>{t.quantity}<input type="number" min="1" max="20" value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></label></div>{price != null && <p><strong>{money(price * quantity, locale)}</strong></p>}<p className="pilot-small">{t.direct}</p><div className="pilot-actions"><button disabled={!token || !offeringId || !startsAt} onClick={() => createBooking(false)}>{t.book}</button></div><hr /><label>{t.message}<textarea value={message} onChange={e => setMessage(e.target.value)} minLength={10} maxLength={2000} /></label><div className="pilot-actions"><button disabled={!token || message.trim().length < 10} onClick={() => createBooking(true)}>{t.request}</button></div>{!token && <p>{t.needLogin}</p>}</div></div>}
  </div>;
}
