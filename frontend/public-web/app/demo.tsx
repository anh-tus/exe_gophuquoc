'use client';

import { useEffect, useMemo, useState } from 'react';
import HeaderSection from '../components/landing/HeaderSection';
import FooterSection from '../components/landing/FooterSection';
import ServicesCatalogView, { type CatalogServiceItem } from '../components/landing/ServicesCatalogView';
import HomeLanding from './home-landing';
import { estimateServiceCost, priceUnitLabel, services, type Lang, type Service } from './catalog';
import AssistantWorkspace, { type Trip } from './assistant-workspace';
import type { AssistantReply, ChatMessage, TripPreferences } from './api/assistant/logic';

type View = 'home' | 'services' | 'itinerary' | 'requests';
type Request = { code: string; serviceId: string; date: string; guests: number; total: number };

const formatMoney = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const name = (s: Service, lang: Lang) => lang === 'vi' ? s.vi : s.en;
const description = (s: Service, lang: Lang) => lang === 'vi' ? s.descriptionVi : s.descriptionEn;
const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export default function Demo() {
  const [lang, setLang] = useState<Lang>('vi');
  const [view, setView] = useState<View>('home');
  const [selected, setSelected] = useState<Service | null>(null);
  const [date, setDate] = useState('2026-05-15');
  const [guests, setGuests] = useState(4);
  const [assistantSeed, setAssistantSeed] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [planDays, setPlanDays] = useState(3);
  const [planGuests, setPlanGuests] = useState(4);
  const [planInterest, setPlanInterest] = useState('mixed');
  const [planBudget, setPlanBudget] = useState(12000000);
  const [tripMessage, setTripMessage] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [success, setSuccess] = useState<Request | null>(null);
  const [weather, setWeather] = useState<{ temp: number | null; wind: number | null; wave: number | null; time: string } | null>(null);
  const [weatherState, setWeatherState] = useState<'loading' | 'ready' | 'error'>('loading');

  // Booking Modal State for Full Tour or Catalog Service
  const [fullTourBookingModal, setFullTourBookingModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialView = params.get('view');
    if (initialView && ['home', 'services', 'itinerary', 'requests'].includes(initialView)) {
      setView(initialView as View);
    }
    if (params.get('lang') === 'en') setLang('en');

    setRequests(
      readJson<Request[]>('gopu-demo-requests', []).filter(
        (r) => r && typeof r.code === 'string' && services.some((s) => s.id === r.serviceId)
      )
    );

    const onPop = () => {
      const p = new URLSearchParams(location.search);
      setView((['home', 'services', 'itinerary', 'requests'].includes(p.get('view') || '') ? p.get('view') : 'home') as View);
      setLang(p.get('lang') === 'en' ? 'en' : 'vi');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const weatherUrl =
          'https://api.open-meteo.com/v1/forecast?latitude=10.22&longitude=103.96&current=temperature_2m,wind_speed_10m&timezone=Asia%2FBangkok';
        const marineUrl =
          'https://marine-api.open-meteo.com/v1/marine?latitude=10.03&longitude=104.02&current=wave_height&timezone=Asia%2FBangkok';
        const [a, b] = await Promise.all([fetch(weatherUrl), fetch(marineUrl)]);
        if (!a.ok || !b.ok) throw new Error('forecast unavailable');
        const [w, m] = await Promise.all([a.json(), b.json()]);
        if (!cancelled) {
          setWeather({
            temp: typeof w.current?.temperature_2m === 'number' ? w.current.temperature_2m : null,
            wind: typeof w.current?.wind_speed_10m === 'number' ? w.current.wind_speed_10m : null,
            wave: typeof m.current?.wave_height === 'number' ? m.current.wave_height : null,
            time: w.current?.time || '',
          });
          setWeatherState('ready');
        }
      } catch {
        if (!cancelled) setWeatherState('error');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (next: View, nextLang = lang) => {
    setView(next);
    setLang(nextLang);
    setSelected(null);
    setSuccess(null);
    const p = new URLSearchParams(location.search);
    p.set('view', next);
    p.set('lang', nextLang);
    history.pushState({}, '', '?' + p.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createRequest = () => {
    if (!selected || !date) return;
    const entry = {
      code: 'DEMO-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      serviceId: selected.id,
      date,
      guests,
      total: estimateServiceCost(selected, guests, 1),
    };
    const next = [entry, ...requests];
    setRequests(next);
    localStorage.setItem('gopu-demo-requests', JSON.stringify(next));
    setSuccess(entry);
  };

  const applyPlan = (reply: Extract<AssistantReply, { kind: 'itinerary' }>) => {
    const activities = reply.plan.days.flatMap((day) => day.activities);
    setTrip({
      days: reply.plan.days.length,
      guests: reply.preferences.guests || planGuests,
      budget: reply.preferences.budgetVnd || planBudget,
      interest: reply.preferences.interest || planInterest,
      ids: activities.map((item) => item.serviceId),
      slots: activities.map((item) => item.time),
      planTitle: reply.plan.title,
      planDays: reply.plan.days,
    });
    setPlanDays(reply.plan.days.length);
    if (reply.preferences.guests) setPlanGuests(reply.preferences.guests);
    if (reply.preferences.budgetVnd) setPlanBudget(reply.preferences.budgetVnd);
    if (reply.preferences.interest) setPlanInterest(reply.preferences.interest);
    setTripMessage('');
  };

  const generateSamplePlan = (preferences?: TripPreferences) => {
    const days = preferences?.days || planDays;
    const guests = preferences?.guests || planGuests;
    const budget = preferences?.budgetVnd || planBudget;
    const choices = services.filter((service) => service.category === 'tour' || service.category === 'restaurant' || service.category === 'stay');
    setTrip({ days, guests, budget, interest: preferences?.interest || planInterest, ids: Array.from({ length: days * 2 }, (_, index) => choices[index % choices.length].id), planTitle: lang === 'vi' ? 'Lịch trình mẫu Phú Quốc' : 'Sample Phu Quoc itinerary' });
    setPlanDays(days);
    setPlanGuests(guests);
    setPlanBudget(budget);
    setTripMessage(lang === 'vi' ? 'Đã tạo lịch trình mẫu từ danh mục minh họa.' : 'Sample plan created from the demo catalog.');
  };

  const handleConfirmFullTourBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const tourCode = 'TOUR-PQ-' + Math.floor(100000 + Math.random() * 900000);
    alert(`🎉 Giữ chỗ trọn gói thành công!\nMã đặt tour của bạn: ${tourCode}\nTổng chi phí: 11.840.000 đ (4 khách)\nĐội ngũ GOPU sẽ liên hệ xác nhận chuyến bay và chuẩn bị xe đón.`);
    setFullTourBookingModal(false);
  };

  return (
    <div className="site min-h-screen bg-white flex flex-col">
      {/* 1. Header with full navigation matching Image 1 & 4 */}
      <HeaderSection
        currentTab={view}
        onSelectTab={(tabId) => {
          if (tabId === 'price-table') {
            if (view !== 'home') go('home');
            window.setTimeout(() => {
              document.getElementById('price-table')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            go(tabId as View);
          }
        }}
        lang={lang}
        onToggleLang={(nextL) => go(view, nextL)}
      />

      {/* 2. Main Views */}
      <div className="flex-1">
        {/* VIEW 1: HOME LANDING */}
        {view === 'home' && (
          <HomeLanding
            lang={lang}
            weather={weather}
            weatherState={weatherState}
            onExplore={() => go('services')}
            onSelectService={(service) => {
              setSelected(service);
              // Mở xem chi tiết và đặt dịch vụ trực tiếp tại trang chủ, không chuyển sang trang khác
            }}
            onOpenAssistant={(prompt) => {
              if (prompt) setAssistantSeed(prompt);
              go('itinerary');
            }}
            onPlanCreated={(reply, messages) => {
              setConversation(messages);
              setAssistantSeed('');
              applyPlan(reply);
              go('itinerary');
            }}
          />
        )}

        {/* VIEW 2: SERVICES & REVIEWS CATALOG (MATCHING IMAGE 4 & 5) */}
        {view === 'services' && (
          <ServicesCatalogView
            lang={lang}
            onAddServiceToAi={(service: CatalogServiceItem) => {
              setAssistantSeed(`Thêm dịch vụ "${service.title}" vào lịch trình`);
              go('itinerary');
            }}
            onViewServiceDetail={(service: CatalogServiceItem) => {
              // Match with local service object if available
              const found = services.find((s) => s.id === service.id) || services[0];
              setSelected(found);
            }}
            onOpenAiPlanner={() => {
              go('itinerary');
            }}
          />
        )}

        {/* VIEW 3: GOPU AI SMART ITINERARY WORKSPACE (MATCHING IMAGE 1, 2, 3) */}
        {view === 'itinerary' && (
          <main className="w-full max-w-7xl mx-auto px-4 py-8">
          <AssistantWorkspace
            initialPrompt={assistantSeed}
            initialMessages={conversation}
            onMessagesChange={setConversation}
            onInitialPromptConsumed={() => setAssistantSeed('')}
            onPlan={applyPlan}
            onUseTemplate={(_text, preferences) => generateSamplePlan(preferences)}
            trip={trip}
            days={planDays}
            guests={planGuests}
            interest={planInterest}
            budget={planBudget}
            onDaysChange={setPlanDays}
            onGuestsChange={setPlanGuests}
            onInterestChange={setPlanInterest}
            onBudgetChange={setPlanBudget}
            onGenerate={() => generateSamplePlan()}
            onUpdateTrip={setTrip}
            onSave={() => { if (trip) { localStorage.setItem('gopu-demo-trip', JSON.stringify(trip)); setTripMessage(lang === 'vi' ? 'Đã lưu trên trình duyệt này.' : 'Saved in this browser.'); } }}
            onShare={() => { void navigator.clipboard.writeText(location.href).then(() => setTripMessage(lang === 'vi' ? 'Đã sao chép liên kết trang.' : 'Page link copied.')); }}
            tripMessage={tripMessage}
            lang={lang}
          />
          </main>
        )}

        {/* VIEW 4: SAMPLE REQUESTS */}
        {view === 'requests' && (
          <main className="max-w-5xl mx-auto px-4 py-12">
            <div className="page-intro mb-8">
              <span className="eyebrow text-[#087f78] text-xs font-bold uppercase tracking-wider block mb-1">
                GOPU / Yêu cầu demo
              </span>
              <h1 className="text-3xl font-black text-gray-900">Yêu cầu mẫu của bạn</h1>
              <p className="text-sm text-gray-500 mt-1">
                Các yêu cầu được lưu trên trình duyệt của bạn để trải nghiệm giao diện.
              </p>
            </div>

            {requests.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requests.map((r) => {
                  const s = services.find((item) => item.id === r.serviceId);
                  return (
                    <article className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm" key={r.code}>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#087f78]">
                        Đã xác nhận demo
                      </span>
                      <h2 className="text-base font-bold text-gray-900 mt-2 mb-1">
                        {s ? name(s, lang) : r.serviceId}
                      </h2>
                      <p className="text-xs text-gray-500">Mã yêu cầu: <strong className="text-gray-900">{r.code}</strong></p>
                      <p className="text-xs text-gray-500">Ngày: {r.date} • Khách: {r.guests}</p>
                      <strong className="text-base text-[#087f78] block mt-2">{formatMoney(r.total)}</strong>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Bạn chưa tạo yêu cầu demo nào.</h2>
                <button
                  className="bg-[#087f78] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
                  onClick={() => go('services')}
                >
                  Khám phá dịch vụ đảo ngay
                </button>
              </div>
            )}
          </main>
        )}
      </div>

      {/* 3. Footer */}
      <FooterSection lang={lang} />

      {/* MODAL 1: Single Service Detail & Booking */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
              setSuccess(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelected(null);
                setSuccess(null);
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center text-sm font-bold shadow-md transition-colors"
            >
              ✕
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">Đặt Dịch Vụ Thành Công!</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Dịch vụ: <strong className="text-gray-900">{name(selected, lang)}</strong>
                </p>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 inline-block text-left text-xs">
                  <p className="text-gray-500">Mã yêu cầu: <strong className="text-[#087f78]">{success.code}</strong></p>
                  <p className="text-gray-500">Ngày sử dụng: <strong className="text-gray-800">{success.date}</strong></p>
                  <p className="text-gray-500">Tổng thanh toán dự kiến: <strong className="text-[#087f78]">{formatMoney(success.total)}</strong></p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    className="w-full sm:w-auto bg-[#087f78] hover:bg-[#066761] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                    onClick={() => {
                      setSelected(null);
                      setSuccess(null);
                    }}
                  >
                    Tiếp tục xem trang chủ
                  </button>
                  <button
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                    onClick={() => {
                      setSelected(null);
                      setSuccess(null);
                      go('requests');
                    }}
                  >
                    Xem danh sách yêu cầu
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header Image if present */}
                {selected.image && (
                  <div className="relative h-44 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden rounded-t-3xl bg-gray-100">
                    <img
                      src={selected.image}
                      alt={name(selected, lang)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-gray-800 shadow-xs">
                      📍 {selected.area}
                    </div>
                    {selected.rating > 0 && (
                      <div className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-bold text-white flex items-center gap-1">
                        <span className="text-amber-400">★</span> {selected.rating} ({selected.reviewCount} đánh giá)
                      </div>
                    )}
                  </div>
                )}

                <span className="text-[11px] font-bold text-[#087f78] uppercase tracking-wider block mb-1">
                  CHI TIẾT &amp; ĐẶT DỊCH VỤ TRỰC TIẾP
                </span>
                <h2 className="text-xl font-black text-gray-900 mb-1.5">{name(selected, lang)}</h2>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{description(selected, lang)}</p>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl mb-4 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-gray-600">Mức giá niêm yết:</span>
                  <span className="text-lg font-black text-[#087f78]">
                    {formatMoney(selected.price)} <small className="text-xs font-normal text-gray-500">{priceUnitLabel(selected.priceUnit, lang)}</small>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ngày sử dụng</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      {selected.priceUnit === 'per-night'
                        ? 'Số đêm lưu trú'
                        : selected.priceUnit === 'per-vehicle'
                        ? 'Số chuyến xe'
                        : selected.priceUnit === 'per-kg'
                        ? 'Số kg dự kiến'
                        : 'Số lượng khách'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold py-3 border-y border-gray-100 mb-5">
                  <span className="text-gray-600">Tổng chi phí ước tính:</span>
                  <span className="text-base text-[#087f78]">
                    {formatMoney(estimateServiceCost(selected, guests, 1))}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={createRequest}
                    className="w-2/3 py-2.5 rounded-xl bg-[#087f78] hover:bg-[#066761] text-white text-xs font-black shadow-md transition-colors"
                  >
                    Xác Nhận Giữ Chỗ (Demo)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Full Tour 3N2D Checkout Modal */}
      {fullTourBookingModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setFullTourBookingModal(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setFullTourBookingModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <form onSubmit={handleConfirmFullTourBooking}>
              <span className="text-[11px] font-bold text-[#087f78] uppercase tracking-wider block mb-1">
                ĐẶT TRỌN GÓI TOUR AI GOPU
              </span>
              <h2 className="text-xl font-black text-gray-900 mb-1">
                Phú Quốc 3N2Đ: Thiên Đường Biển Đảo &amp; Hải Sản
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Mã tour: PQ-4PAX-3N2D • Đoàn 4 khách • Xe riêng &amp; Cano VIP
              </p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-gray-600 font-semibold">Tổng chi phí trọn gói:</span>
                  <span className="text-xl font-black text-[#087f78]">11.840.000 đ</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  ✓ Tiết kiệm 160.000 đ so với ngân sách ban đầu (12.000.000 đ)
                </p>
              </div>

              <div className="space-y-3 mb-5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Họ tên người đại diện</label>
                  <input
                    required
                    type="text"
                    defaultValue="Nguyễn Văn A"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Số điện thoại / Zalo</label>
                    <input
                      required
                      type="tel"
                      defaultValue="0912 345 678"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Ngày bắt đầu chuyến đi</label>
                    <input
                      required
                      type="date"
                      defaultValue="2026-05-15"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 mb-5 leading-relaxed">
                🛡️ <strong>Cam kết GOPU:</strong> Không phụ thu ẩn, miễn phí dời chuyến khi thời tiết biển xấu, tài xế bản địa đón tại sân bay đúng giờ.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFullTourBookingModal(false)}
                  className="w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-[#087f78] hover:bg-[#066761] text-white text-xs font-black shadow-lg shadow-teal-950/10 active:scale-95 transition-all"
                >
                  Xác Nhận Giữ Chỗ Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
