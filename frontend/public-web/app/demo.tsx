'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AssistantWorkspace, { type Trip } from './assistant-workspace';
import { estimateServiceCost, priceUnitLabel, services, type Lang, type Service } from './catalog';
import type { AssistantReply, TripPreferences } from './api/assistant/logic';

type View = 'home' | 'services' | 'itinerary' | 'requests';
type Request = { code: string; serviceId: string; date: string; guests: number; total: number };
const categories = ['all', 'tour', 'restaurant', 'transport', 'stay', 'wellness', 'laundry'];
const labels: Record<Lang, Record<string, string>> = {
  vi: { home: 'Trang chủ', services: 'Dịch vụ đảo', itinerary: 'Lịch trình', requests: 'Yêu cầu', mapSelect: 'Xem trên bản đồ', mapLocation: 'Vị trí khu vực', demo: 'Dữ liệu demo', heroTag: 'Khám phá Phú Quốc theo cách của bạn', heroTitle: 'Phú Quốc, theo cách của bạn.', heroBody: 'Tìm dịch vụ địa phương, xem điều kiện thời tiết và phác thảo hành trình phù hợp với bạn.', need: 'Bạn muốn trải nghiệm điều gì?', needPlaceholder: 'Ví dụ: 3 ngày, 5 người, tổng chi phí khoảng 20 triệu…', plan: 'Chat với GOPU AI', explore: 'Khám phá dịch vụ', featured: 'Điểm khởi đầu cho chuyến đi', featuredBody: 'Những lựa chọn minh họa để bạn thử các luồng trong bản demo.', weather: 'Thời tiết & biển', live: 'Dữ liệu dự báo', loading: 'Đang tải dữ liệu…', unavailable: 'Chưa tải được dữ liệu. Vui lòng thử lại sau.', updated: 'Cập nhật', temperature: 'Nhiệt độ', wind: 'Gió', wave: 'Sóng', source: 'Nguồn', catalogTitle: 'Dịch vụ cho hành trình đảo', catalogBody: 'Tìm và lọc dịch vụ minh họa. Giá và đơn vị cung cấp chưa được xác minh.', search: 'Tìm dịch vụ', area: 'Khu vực', category: 'Danh mục', budget: 'Giá tối đa', all: 'Tất cả', tour: 'Tour & trải nghiệm', restaurant: 'Nhà hàng', transport: 'Di chuyển', stay: 'Lưu trú', wellness: 'Chăm sóc sức khỏe', laundry: 'Giặt là', reset: 'Xóa bộ lọc', empty: 'Không có dịch vụ phù hợp với bộ lọc.', details: 'Xem chi tiết', from: 'Từ', map: 'Bản đồ khu vực', mapFallback: 'Không tải được bản đồ khu vực. Vui lòng thử lại sau.', bookDemo: 'Tạo yêu cầu demo', date: 'Ngày sử dụng', guests: 'Số khách', estimated: 'Tổng minh họa', confirm: 'Xác nhận yêu cầu demo', close: 'Đóng', bookingNotice: 'Chỉ để trải nghiệm giao diện. Chưa đặt dịch vụ, giữ chỗ hoặc thanh toán thật.', requestDone: 'Đã tạo yêu cầu demo', requestCode: 'Mã yêu cầu', savedHere: 'Lưu trên trình duyệt này', noRequests: 'Bạn chưa tạo yêu cầu demo.', plannerTitle: 'Phác thảo những ngày ở Phú Quốc', plannerBody: 'Chọn cách đi, ngân sách và số ngày; chúng tôi sắp xếp hoạt động mẫu để bạn chỉnh sửa.', days: 'Số ngày', interest: 'Sở thích', beach: 'Biển & đảo', calm: 'Nghỉ dưỡng', mixed: 'Khám phá tổng hợp', generate: 'Tạo lịch trình mẫu', day: 'Ngày', remove: 'Xóa', replace: 'Đổi hoạt động', add: 'Thêm hoạt động', total: 'Chi phí ước tính', save: 'Lưu lịch trình', saved: 'Đã lưu trên trình duyệt', share: 'Sao chép liên kết', copied: 'Đã sao chép liên kết', shareError: 'Không thể sao chép; hãy dùng URL trên thanh địa chỉ.', tripNotice: 'Lịch trình và chi phí chỉ là gợi ý minh họa, không xác nhận chỗ hoặc độ an toàn của hoạt động.', noItems: 'Chưa có hoạt động. Hãy thêm một dịch vụ.', viewService: 'Xem dịch vụ', reviewDemo: 'Đánh giá minh họa', reviewCount: 'lượt đánh giá mẫu', priceUnit: 'Đơn vị giá' },
  en: { home: 'Home', services: 'Island services', itinerary: 'Itinerary', requests: 'Requests', mapSelect: 'Show on map', mapLocation: 'Area location', demo: 'Demo data', heroTag: 'Discover Phu Quoc your way', heroTitle: 'Phu Quoc, your way.', heroBody: 'Find local services, check the weather and sketch an itinerary that fits your trip.', need: 'What would you like to experience?', needPlaceholder: 'For example: 3 days, 5 people, about 20 million VND…', plan: 'Chat with GOPU AI', explore: 'Explore services', featured: 'A place to begin', featuredBody: 'Illustrative choices to try the flows in this demo.', weather: 'Weather & sea', live: 'Forecast data', loading: 'Loading data…', unavailable: 'Data is unavailable. Please try again later.', updated: 'Updated', temperature: 'Temperature', wind: 'Wind', wave: 'Waves', source: 'Source', catalogTitle: 'Services for your island trip', catalogBody: 'Browse illustrative services. Prices and providers have not been verified.', search: 'Search services', area: 'Area', category: 'Category', budget: 'Maximum price', all: 'All', tour: 'Tours & experiences', restaurant: 'Restaurants', transport: 'Transport', stay: 'Stays', wellness: 'Wellness', laundry: 'Laundry', reset: 'Reset filters', empty: 'No services match these filters.', details: 'View details', from: 'From', map: 'Area map', mapFallback: 'Map unavailable. Select a service in the list for details.', bookDemo: 'Create demo request', date: 'Service date', guests: 'Guests', estimated: 'Illustrative total', confirm: 'Confirm demo request', close: 'Close', bookingNotice: 'For interface preview only. No real reservation, inventory hold or payment is made.', requestDone: 'Demo request created', requestCode: 'Request code', savedHere: 'Saved in this browser', noRequests: 'You have no demo requests yet.', plannerTitle: 'Sketch your days in Phu Quoc', plannerBody: 'Choose your pace, budget and duration. We arrange sample activities for you to edit.', days: 'Days', interest: 'Interests', beach: 'Sea & islands', calm: 'Rest & wellness', mixed: 'A bit of everything', generate: 'Generate sample trip', day: 'Day', remove: 'Remove', replace: 'Replace activity', add: 'Add activity', total: 'Estimated cost', save: 'Save itinerary', saved: 'Saved in this browser', share: 'Copy share link', copied: 'Link copied', shareError: 'Could not copy. Use the URL in the address bar.', tripNotice: 'This itinerary and its costs are illustrative. Activities are not reserved or safety-certified.', noItems: 'No activities yet. Add a service.', viewService: 'View service', reviewDemo: 'Illustrative reviews', reviewCount: 'sample reviews', priceUnit: 'Price unit' },
};
const formatMoney = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const name = (s: Service, lang: Lang) => lang === 'vi' ? s.vi : s.en;
const description = (s: Service, lang: Lang) => lang === 'vi' ? s.descriptionVi : s.descriptionEn;
const readJson = <T,>(key: string, fallback: T): T => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } };
const safeTrip = (value: unknown): Trip | null => {
  if (!value || typeof value !== 'object') return null;
  const t = value as Partial<Trip>;
  const planDaysValid = t.planDays === undefined || (Array.isArray(t.planDays) && t.planDays.length === t.days && t.planDays.every((day, index) =>
    day && day.day === index + 1 && Array.isArray(day.activities) && day.activities.length <= 5 && day.activities.every(activity =>
      activity && typeof activity.serviceId === 'string' && services.some(service => service.id === activity.serviceId) &&
      typeof activity.time === 'string' && typeof activity.endTime === 'string' && Number.isInteger(activity.durationMinutes) &&
      typeof activity.note === 'string' && typeof activity.logistics === 'string' && typeof activity.tips === 'string')));
  if (!Number.isInteger(t.days) || !t.days || t.days < 1 || t.days > 5 || !Array.isArray(t.ids) || t.ids.length > 25 || !t.ids.every(id => typeof id === 'string' && services.some(s => s.id === id)) || !['beach', 'calm', 'mixed'].includes(t.interest || '') || typeof t.budget !== 'number' || t.budget < 0 || t.budget > 100000000 || (t.guests !== undefined && (!Number.isInteger(t.guests) || t.guests < 1 || t.guests > 20)) || (t.slots !== undefined && (!Array.isArray(t.slots) || t.slots.length !== t.ids.length || !t.slots.every(slot => typeof slot === 'string'))) || (t.planTitle !== undefined && typeof t.planTitle !== 'string') || !planDaysValid) return null;
  return t as Trip;
};

export default function Demo() {
  const [lang, setLang] = useState<Lang>('vi');
  const [view, setView] = useState<View>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [need, setNeed] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [area, setArea] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [selected, setSelected] = useState<Service | null>(null);
  const [mapSelection, setMapSelection] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [assistantSeed, setAssistantSeed] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [success, setSuccess] = useState<Request | null>(null);
  const [days, setDays] = useState(3);
  const [interest, setInterest] = useState('mixed');
  const [budget, setBudget] = useState(3000000);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripMessage, setTripMessage] = useState('');
  const [weather, setWeather] = useState<{ temp: number | null; wind: number | null; wave: number | null; time: string } | null>(null);
  const [weatherState, setWeatherState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [mapError, setMapError] = useState(false);
  const t = labels[lang];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialView = params.get('view');
    if (initialView && ['home', 'services', 'itinerary', 'requests'].includes(initialView)) setView(initialView as View);
    if (params.get('lang') === 'en') setLang('en');
    const rawTrip = params.get('trip');
    if (rawTrip) { try { const parsed = safeTrip(JSON.parse(rawTrip)); if (parsed) { setTrip(parsed); setDays(parsed.days); setInterest(parsed.interest); setBudget(parsed.budget); setView('itinerary'); } } catch { /* malformed URL uses saved/default trip */ } }
    else setTrip(null);
    setRequests(readJson<Request[]>('gopu-demo-requests', []).filter(r => r && typeof r.code === 'string' && services.some(s => s.id === r.serviceId)));
    const onPop = () => { const p = new URLSearchParams(location.search); setView((['home', 'services', 'itinerary', 'requests'].includes(p.get('view') || '') ? p.get('view') : 'home') as View); setLang(p.get('lang') === 'en' ? 'en' : 'vi'); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=10.22&longitude=103.96&current=temperature_2m,wind_speed_10m&timezone=Asia%2FBangkok';
        const marineUrl = 'https://marine-api.open-meteo.com/v1/marine?latitude=10.03&longitude=104.02&current=wave_height&timezone=Asia%2FBangkok';
        const [a, b] = await Promise.all([fetch(weatherUrl), fetch(marineUrl)]);
        if (!a.ok || !b.ok) throw new Error('forecast unavailable');
        const [w, m] = await Promise.all([a.json(), b.json()]);
        if (!cancelled) { setWeather({ temp: typeof w.current?.temperature_2m === 'number' ? w.current.temperature_2m : null, wind: typeof w.current?.wind_speed_10m === 'number' ? w.current.wind_speed_10m : null, wave: typeof m.current?.wave_height === 'number' ? m.current.wave_height : null, time: w.current?.time || '' }); setWeatherState('ready'); }
      } catch { if (!cancelled) setWeatherState('error'); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const go = (next: View, nextLang = lang) => { setView(next); setLang(nextLang); setMenuOpen(false); setSelected(null); setSuccess(null); const p = new URLSearchParams(location.search); p.set('view', next); p.set('lang', nextLang); p.delete('trip'); history.pushState({}, '', '?' + p.toString()); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const filtered = useMemo(() => services.filter(s => (category === 'all' || s.category === category) && (area === 'all' || s.area === area) && (!maxPrice || s.price <= Number(maxPrice)) && (!search.trim() || (s.vi + s.en + s.area).toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()))), [category, area, maxPrice, search]);
  const startTrip = () => { setAssistantSeed(need.trim()); go('itinerary'); };
  const generateTrip = (d = days, i = interest, b = budget) => { const order = i === 'beach' ? ['cano-an-thoi', 'bien-bai-sao', 'xe-san-bay', 'spa-duong-dong', 'luu-tru-bai-truong'] : i === 'calm' ? ['luu-tru-bai-truong', 'spa-duong-dong', 'bien-bai-sao', 'xe-san-bay', 'cano-an-thoi'] : ['xe-san-bay', 'bien-bai-sao', 'cano-an-thoi', 'spa-duong-dong', 'luu-tru-bai-truong']; const ids: string[] = []; for (let day = 0; day < d; day++) { const candidates = [order[day % order.length], order[(day + 1) % order.length]]; for (const id of candidates) { const service = services.find(s => s.id === id); const cost = service ? estimateServiceCost(service, guests, d) : 0; const total = ids.reduce((sum, item) => { const found = services.find(s => s.id === item); return sum + (found ? estimateServiceCost(found, guests, d) : 0); }, 0); if (total + cost <= b) ids.push(id); } } setTrip({ days: d, interest: i, budget: b, guests, ids }); setTripMessage(''); };
  const applyAssistantPlan = (reply: Extract<AssistantReply, { kind: 'itinerary' }>) => {
    const daysCount = reply.preferences.days || 3;
    const planItems = reply.plan.days.flatMap(day => day.activities);
    const ids = planItems.map(item => item.serviceId);
    setDays(daysCount);
    setGuests(reply.preferences.guests || 1);
    setInterest(/biển|đảo|beach|sea/i.test(reply.preferences.interest) ? 'beach' : /nghỉ|relax|spa/i.test(reply.preferences.interest) ? 'calm' : 'mixed');
    setBudget(reply.preferences.budgetVnd || 3000000);
    setTrip({ days: daysCount, interest: /beach|sea/i.test(reply.preferences.interest) ? 'beach' : /relax|spa/i.test(reply.preferences.interest) ? 'calm' : 'mixed', budget: reply.preferences.budgetVnd || 3000000, guests: reply.preferences.guests || 1, ids, slots: planItems.map(item => item.time), planTitle: reply.plan.title, planDays: reply.plan.days });
    setTripMessage('');
  };
  const useTemplate = (text: string, prefs: TripPreferences) => {
    const lower = text.toLocaleLowerCase();
    const parsedDays = Number(lower.match(/(\d+)\s*(?:ngày|days?)/)?.[1]);
    const parsedGuests = Number(lower.match(/(\d+)\s*(?:người|khách|people|guests?)/)?.[1]);
    const parsedBudget = Number(lower.match(/(\d+(?:[.,]\d+)?)\s*(?:triệu|tr|million|m)\b/)?.[1]?.replace(',', '.')) * 1000000;
    const d = prefs.days || (parsedDays >= 1 && parsedDays <= 5 ? parsedDays : days);
    const g = prefs.guests || (parsedGuests >= 1 && parsedGuests <= 20 ? parsedGuests : guests);
    const b = prefs.budgetVnd || (parsedBudget >= 100000 && parsedBudget <= 100000000 ? parsedBudget : budget);
    const nextInterest = /biển|đảo|beach|sea/i.test(lower) ? 'beach' : /nghỉ|relax|spa/i.test(lower) ? 'calm' : interest;
    setDays(d); setGuests(g); setBudget(b); setInterest(nextInterest); generateTrip(d, nextInterest, b);
  };
  const updateTrip = (next: Trip) => { setTrip(next); setTripMessage(''); };
  const saveTrip = () => { if (!trip) return; localStorage.setItem('gopu-demo-trip', JSON.stringify(trip)); setTripMessage(t.saved); };
  const shareTrip = async () => { if (!trip) return; const url = new URL(location.href); url.searchParams.set('view', 'itinerary'); url.searchParams.set('lang', lang); url.searchParams.set('trip', JSON.stringify(trip)); const link = url.toString(); try { await navigator.clipboard.writeText(link); setTripMessage(t.copied); } catch { history.replaceState({}, '', link); setTripMessage(t.shareError); } };
  const createRequest = () => { if (!selected || !date) return; const entry = { code: 'DEMO-' + crypto.randomUUID().slice(0, 8).toUpperCase(), serviceId: selected.id, date, guests, total: estimateServiceCost(selected, guests, 1) }; const next = [entry, ...requests]; setRequests(next); localStorage.setItem('gopu-demo-requests', JSON.stringify(next)); setSuccess(entry); };
  const today = new Date().toISOString().slice(0, 10);

  return <div className="site">
    <header className="site-header"><div className="container nav-shell"><button className="brand" onClick={() => go('home')} aria-label={lang === 'vi' ? 'GOPU - về trang chủ' : 'GOPU - go home'}><span className="brand-symbol"><Image src="/brand/gopu-logo.png" alt="" width={1254} height={1254} priority /></span><span className="brand-type"><strong>GOPU</strong><small>Go Phu Quoc, Go Paradise!</small></span></button><button className="mobile-menu" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}<span className="sr-only">Menu</span></button><nav id="main-nav" className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">{(['home', 'services', 'itinerary', 'requests'] as View[]).map(v => <button key={v} className={view === v ? 'nav-link active' : 'nav-link'} onClick={() => go(v)}>{t[v]}</button>)}</nav><div className="language" aria-label="Language"><button aria-pressed={lang === 'vi'} className={lang === 'vi' ? 'active' : ''} onClick={() => go(view, 'vi')}>VI</button><button aria-pressed={lang === 'en'} className={lang === 'en' ? 'active' : ''} onClick={() => go(view, 'en')}>EN</button></div></div></header>
    {view === 'home' && <main><section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">{t.heroTag}</span><h1>{t.heroTitle}</h1><p>{t.heroBody}</p><div className="hero-form"><label htmlFor="need">{t.need}</label><div className="hero-input"><input id="need" value={need} onChange={e => setNeed(e.target.value)} placeholder={t.needPlaceholder} onKeyDown={e => { if (e.key === 'Enter') startTrip(); }} /><button className="button primary" onClick={startTrip}>{t.plan} <span aria-hidden="true">↗</span></button></div></div><button className="text-link" onClick={() => go('services')}>{t.explore} <span aria-hidden="true">→</span></button></div><div className="hero-photo" role="img" aria-label={lang === 'vi' ? 'Minh họa bờ biển đảo nhiệt đới' : 'Illustration of a tropical island coast'}></div></div></section><WeatherSection t={t} lang={lang} weather={weather} state={weatherState} /><section className="section container"><div className="section-heading"><div><h2>{t.featured}</h2><p>{t.featuredBody}</p></div><button className="text-link" onClick={() => go('services')}>{t.explore} →</button></div><div className="featured-grid">{services.slice(0, 4).map((s, idx) => <button key={s.id} className={'feature-card feature-' + idx} onClick={() => { setSelected(s); setMapSelection(s); go('services'); setSelected(s); }}><span className="feature-image" style={{ backgroundImage: `url(${s.image})`, backgroundPosition: `${20 + idx * 18}% center` }} /><span className="feature-content"><span className="chip">{t[s.category]}</span><strong>{name(s, lang)}</strong><small>{s.area} · {t.from} {formatMoney(s.price)}</small></span></button>)}</div></section></main>}
    {view === 'services' && <main className="container catalog section"><div className="page-intro"><span className="eyebrow">GOPU / {t.demo}</span><h1>{t.catalogTitle}</h1><p>{t.catalogBody}</p></div><div className="filter-bar"><label>{t.search}<input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} /></label><label>{t.category}<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c} value={c}>{t[c]}</option>)}</select></label><label>{t.area}<select value={area} onChange={e => setArea(e.target.value)}><option value="all">{t.all}</option>{['An Thới', 'Dương Đông', 'Bãi Sao', 'Bãi Trường'].map(a => <option key={a}>{a}</option>)}</select></label><label>{t.budget}<select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">{t.all}</option><option value="200000">200.000 ₫</option><option value="500000">500.000 ₫</option><option value="1000000">1.000.000 ₫</option></select></label><button className="button subtle" onClick={() => { setSearch(''); setCategory('all'); setArea('all'); setMaxPrice(''); }}>{t.reset}</button></div><div className="catalog-layout"><div><div className="result-count">{filtered.length} {lang === 'vi' ? 'dịch vụ minh họa' : 'illustrative services'}</div>{filtered.length === 0 ? <div className="empty-state"><h2>{t.empty}</h2><button className="button subtle" onClick={() => { setSearch(''); setCategory('all'); setArea('all'); setMaxPrice(''); }}>{t.reset}</button></div> : <div className="service-list">{filtered.map((s, idx) => <article className={mapSelection?.id === s.id ? "service-card map-selected" : "service-card"} key={s.id} tabIndex={0} aria-label={`${name(s, lang)} · ${t.mapSelect}`} onClick={() => { setMapSelection(s); setMapError(false); }} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setMapSelection(s); setMapError(false); } }}><div className="service-photo" style={{ backgroundImage: `url(${s.image})`, backgroundPosition: `${20 + idx * 12}% center` }} /><div className="service-info"><span className="chip">{t[s.category]} · {t.demo}</span><h2>{name(s, lang)}</h2><div className="review-summary" aria-label={`${s.rating} trên 5, ${s.reviewCount} ${t.reviewCount}`}>★ {s.rating.toFixed(1)} <span>· {s.reviewCount} {t.reviewCount}</span></div><p>{description(s, lang)}</p><div className="service-bottom"><span>{s.area}<strong>{t.from} {formatMoney(s.price)}</strong><small>{priceUnitLabel(s.priceUnit, lang)}</small></span><button className="button outline" onClick={() => { setMapSelection(s); setSelected(s); setMapError(false); }}>{t.details} →</button></div></div></article>)}</div>}</div><aside className="map-panel"><h2>{t.map}</h2><p>{mapSelection ? `${name(mapSelection, lang)} · ${mapSelection.area}` : (lang === 'vi' ? 'Chọn dịch vụ để xem khu vực trên bản đồ.' : 'Choose a service to view its area on the map.')}</p>{!mapError ? <iframe title={t.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.openstreetmap.org/export/embed.html?bbox=${(mapSelection?.lon || 103.96) - .035}%2C${(mapSelection?.lat || 10.18) - .03}%2C${(mapSelection?.lon || 103.96) + .035}%2C${(mapSelection?.lat || 10.18) + .03}&layer=mapnik&marker=${mapSelection?.lat || 10.18}%2C${mapSelection?.lon || 103.96}`} onError={() => setMapError(true)} /> : <div className="map-error">{t.mapFallback}</div>}<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></aside></div></main>}
    {view === 'itinerary' && <main className="container section planner">
      <div className="page-intro"><span className="eyebrow">GOPU / {t.demo}</span><h1>{t.plannerTitle}</h1><p>{t.plannerBody}</p></div>
      <AssistantWorkspace
        lang={lang}
        initialPrompt={assistantSeed}
        onInitialPromptConsumed={() => setAssistantSeed('')}
        onPlan={applyAssistantPlan}
        onUseTemplate={useTemplate}
        trip={trip}
        days={days}
        guests={guests}
        interest={interest}
        budget={budget}
        onDaysChange={setDays}
        onGuestsChange={setGuests}
        onInterestChange={setInterest}
        onBudgetChange={setBudget}
        onGenerate={() => generateTrip()}
        onUpdateTrip={updateTrip}
        onSave={saveTrip}
        onShare={() => void shareTrip()}
        tripMessage={tripMessage}
      />
    </main>}
    {view === 'requests' && <main className="container section"><div className="page-intro"><span className="eyebrow">GOPU / {t.demo}</span><h1>{t.requests}</h1><p>{t.savedHere}. {t.bookingNotice}</p></div>{requests.length ? <div className="requests-list">{requests.map(r => <article className="request-card" key={r.code}><span className="chip">{t.demo}</span><h2>{name(services.find(s => s.id === r.serviceId)!, lang)}</h2><p>{t.requestCode}: <strong>{r.code}</strong></p><p>{t.date}: {r.date} · {t.guests}: {r.guests}</p><strong>{formatMoney(r.total)}</strong></article>)}</div> : <div className="empty-state"><h2>{t.noRequests}</h2><button className="button primary" onClick={() => go('services')}>{t.explore}</button></div>}</main>}
    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-symbol"><Image src="/brand/gopu-logo.png" alt="" width={1254} height={1254} /></span><span><strong>GOPU</strong><small>Go Phu Quoc, Go Paradise!</small></span></div><p>{t.demo} · {lang === 'vi' ? 'Không nhận đặt chỗ hoặc thanh toán thật.' : 'No real bookings or payments.'}</p></div></footer>
    {selected && view === 'services' && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) { setSelected(null); setSuccess(null); } }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="service-dialog-title"><button className="modal-close" aria-label={t.close} onClick={() => { setSelected(null); setSuccess(null); }}>×</button>{success ? <><span className="chip">{t.demo}</span><h2 id="service-dialog-title">{t.requestDone}</h2><p>{t.requestCode}: <strong>{success.code}</strong></p><p>{t.bookingNotice}</p><button className="button primary" onClick={() => go('requests')}>{t.requests}</button></> : <><div className="modal-image" /><span className="chip">{t[selected.category]} · {t.demo}</span><h2 id="service-dialog-title">{name(selected, lang)}</h2><p>{description(selected, lang)}</p><p className="muted">{selected.area} · {t.from} {formatMoney(selected.price)} {priceUnitLabel(selected.priceUnit, lang)}</p><section className="review-list"><h3>{t.reviewDemo} · ★ {selected.rating.toFixed(1)} ({selected.reviewCount})</h3>{selected.reviews.map((review, index) => <blockquote key={index}><strong>★ {review.rating}</strong><p>{lang === 'vi' ? review.commentVi : review.commentEn}</p></blockquote>)}</section><section className="modal-map" aria-label={t.mapLocation}><h3>{t.mapLocation}</h3><iframe title={`${t.mapLocation}: ${name(selected, lang)}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected.lon - .035}%2C${selected.lat - .03}%2C${selected.lon + .035}%2C${selected.lat + .03}&layer=mapnik&marker=${selected.lat}%2C${selected.lon}`} /><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></section><div className="modal-fields"><label>{t.date}<input required type="date" min={today} value={date} onChange={e => setDate(e.target.value)} /></label><label>{t.guests}<input type="number" min="1" max="20" value={guests} onChange={e => setGuests(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} /></label></div><div className="estimate"><span>{t.estimated}</span><strong>{formatMoney(estimateServiceCost(selected, guests, 1))}</strong></div><p className="notice">{t.bookingNotice}</p><button className="button primary full" disabled={!date} onClick={createRequest}>{t.confirm}</button></>}</div></div>}
  </div>;
}

function WeatherSection({ t, lang, weather, state }: { t: Record<string, string>; lang: Lang; weather: { temp: number | null; wind: number | null; wave: number | null; time: string } | null; state: 'loading' | 'ready' | 'error' }) {
  return <section className="weather-strip"><div className="container"><div className="section-heading compact"><div><h2>{t.weather}</h2></div><span className="weather-source">{t.source}: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a></span></div>{state === 'loading' && <div className="weather-status" role="status">{t.loading}</div>}{state === 'error' && <div className="weather-status" role="status">{t.unavailable}</div>}{state === 'ready' && weather && <><div className="weather-grid">{weather.temp !== null && <div><span>{t.temperature}</span><strong>{weather.temp}°C</strong><small>Dương Đông</small></div>}{weather.wind !== null && <div><span>{t.wind}</span><strong>{weather.wind} km/h</strong><small>Dương Đông</small></div>}{weather.wave !== null && <div><span>{t.wave}</span><strong>{weather.wave} m</strong><small>An Thới</small></div>}</div><p className="weather-foot">{t.updated}: {weather.time ? weather.time.replace('T', ' ') + ' ICT' : '—'} · {lang === 'vi' ? 'Dữ liệu mô hình dự báo, không phải cảnh báo an toàn.' : 'Model forecast, not a safety warning.'} <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener noreferrer">Open-Meteo Marine</a></p></>}</div></section>;
}
