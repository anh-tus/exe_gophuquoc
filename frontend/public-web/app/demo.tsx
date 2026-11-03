'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import HeaderSection from '../components/landing/HeaderSection';
import FooterSection from '../components/landing/FooterSection';
import ServicesCatalogView, { type CatalogServiceItem } from '../components/landing/ServicesCatalogView';
import ServiceDetailPanel from '../components/booking/ServiceDetailPanel';
import { useToast } from '../components/ui/Toast';
import HomeLanding from './home-landing';
import PriceTableView from './price-table-view';
import { detailFor, estimateServiceCost, priceUnitLabel, services, type Lang, type Service } from './catalog';
import AssistantWorkspace, { type Trip } from './assistant-workspace';
import type { AssistantReply, ChatMessage, TripPreferences } from './api/assistant/logic';

type View = 'home' | 'services' | 'itinerary' | 'requests' | 'price-table';
type Request = {
  code: string;
  serviceId: string;
  date: string;
  guests: number;
  total: number;
  time?: string;
  preOrders?: string[];
  notes?: string;
  planTitle?: string;
};

/** Fixed demo package shown by the "book the whole tour" modal. */
const FULL_TOUR_PACKAGE = {
  code: 'PQ-4PAX-3N2D',
  guests: 4,
  totalVnd: 11_840_000,
  budgetVnd: 12_000_000,
} as const;

/** ISO date in the traveller's own timezone (not UTC, so "today" is not off by one). */
const isoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const tomorrowIso = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return isoDate(date);
};

const todayIso = (): string => isoDate(new Date());

const formatMoney = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
const name = (s: Service, lang: Lang) => lang === 'vi' ? s.vi : s.en;
const description = (s: Service, lang: Lang) => lang === 'vi' ? s.descriptionVi : s.descriptionEn;

/** The quantity field means something different per price unit. */
const quantityLabel = (s: Service, lang: Lang): string => {
  const labels: Partial<Record<Service['priceUnit'], { vi: string; en: string }>> = {
    'per-night': { vi: 'Số đêm lưu trú', en: 'Nights' },
    'per-vehicle': { vi: 'Số chuyến xe', en: 'Trips' },
    'per-kg': { vi: 'Số kg dự kiến', en: 'Estimated kg' },
  };
  return labels[s.priceUnit]?.[lang] ?? (lang === 'vi' ? 'Số khách' : 'Guests');
};

/** The date input stores ISO; everything the user reads shows dd/mm/yyyy. */
const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

/** Booking a table and booking a tour are not the same action. */
const bookingHeading = (s: Service, lang: Lang): string => {
  if (s.category === 'restaurant') {
    return lang === 'vi' ? 'Chi tiết nhà hàng & đặt bàn' : 'Restaurant details & table booking';
  }
  return lang === 'vi' ? 'Chi tiết & đặt dịch vụ trực tiếp' : 'Details & direct booking';
};
const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export default function Demo() {
  const toast = useToast();
  const [lang, setLang] = useState<Lang>('vi');
  const [view, setView] = useState<View>('home');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<Service['category'] | 'all'>('all');
  const [selected, setSelected] = useState<Service | null>(null);
  const [date, setDate] = useState<string>(tomorrowIso);
  const [arrivalTime, setArrivalTime] = useState('19:00');
  const [guests, setGuests] = useState(4);
  const [assistantSeed, setAssistantSeed] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [assistantChoices, setAssistantChoices] = useState<string[]>([]);
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
  const [selectedPreOrders, setSelectedPreOrders] = useState<string[]>([]);
  const [bookingNotes, setBookingNotes] = useState('');
  const [fullTourLeadName, setFullTourLeadName] = useState('Nguyễn Văn A');
  const [fullTourPhone, setFullTourPhone] = useState('0912 345 678');
  const [fullTourStartDate, setFullTourStartDate] = useState(tomorrowIso);
  const [fullTourNotes, setFullTourNotes] = useState('');

  useEffect(() => {
    setSelectedPreOrders([]);
    setBookingNotes('');
  }, [selected]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialView = params.get('view');
    if (initialView && ['home', 'services', 'itinerary', 'requests', 'price-table'].includes(initialView)) {
      setView(initialView as View);
    }
    if (params.get('lang') === 'en') setLang('en');

    setRequests(
      readJson<Request[]>('gopu-demo-requests', []).filter(
        (r) => r && typeof r.code === 'string' && (r.serviceId === 'full-trip' || services.some((s) => s.id === r.serviceId))
      )
    );

    const onPop = () => {
      const p = new URLSearchParams(location.search);
      setView((['home', 'services', 'itinerary', 'requests', 'price-table'].includes(p.get('view') || '') ? p.get('view') : 'home') as View);
      setLang(p.get('lang') === 'en' ? 'en' : 'vi');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

  const restaurantDishes = useMemo(() => {
    if (!selected || selected.category !== 'restaurant') return [];
    const detail = detailFor(selected.id);
    const dishNames = (lang === 'vi' ? detail?.listVi : detail?.listEn) || [
      lang === 'vi' ? 'Hải sản nướng mỡ hành' : 'Grilled seafood with scallion oil',
      lang === 'vi' ? 'Gỏi cá trích Phú Quốc' : 'Phu Quoc herring salad',
      lang === 'vi' ? 'Cơm chiên hải sản' : 'Seafood fried rice',
      lang === 'vi' ? 'Lẩu hải sản chua cay' : 'Spicy sour seafood hotpot',
    ];
    return dishNames.map((dishName) => {
      let price = 120000;
      const lower = dishName.toLowerCase();
      if (lower.includes('tôm hùm') || lower.includes('lobster')) price = 390000;
      else if (lower.includes('cá mú') || lower.includes('ghẹ') || lower.includes('crab') || lower.includes('grouper')) price = 280000;
      else if (lower.includes('lẩu') || lower.includes('hotpot')) price = 250000;
      else if (lower.includes('gỏi') || lower.includes('salad') || lower.includes('mực') || lower.includes('squid')) price = 150000;
      else if (lower.includes('bún quậy')) price = 65000;
      else if (lower.includes('cocktail')) price = 95000;
      else if (lower.includes('cá bớp')) price = 180000;
      return { name: dishName, price };
    });
  }, [selected, lang]);

  const stayAmenities = useMemo(() => {
    if (!selected || selected.category !== 'stay') return [];
    return [
      { name: lang === 'vi' ? 'Nhận phòng sớm nếu còn phòng trống (Early check-in)' : 'Early check-in (subject to availability)', price: 0 },
      { name: lang === 'vi' ? 'Phòng tầng cao, view biển ngắm hoàng hôn' : 'High floor, ocean sunset view', price: 0 },
      { name: lang === 'vi' ? 'Bố trí 01 giường lớn King-size' : 'One King-size bed arrangement', price: 0 },
      { name: lang === 'vi' ? 'Xe riêng đón tiễn sân bay Phú Quốc (2 chiều)' : 'Roundtrip private airport transfer', price: 320000 },
      { name: lang === 'vi' ? 'Set trái cây nhiệt đới & dừa tươi chào mừng' : 'Welcome tropical fruit & coconut set', price: 150000 },
    ];
  }, [selected, lang]);

  const preOrderTotal = useMemo(() => {
    if (!selected) return 0;
    if (selected.category === 'restaurant') {
      return selectedPreOrders.reduce((sum, dishName) => {
        const item = restaurantDishes.find((d) => d.name === dishName);
        return sum + (item?.price || 0);
      }, 0);
    }
    if (selected.category === 'stay') {
      return selectedPreOrders.reduce((sum, amenityName) => {
        const item = stayAmenities.find((a) => a.name === amenityName);
        return sum + (item?.price || 0);
      }, 0);
    }
    return 0;
  }, [selected, selectedPreOrders, restaurantDishes, stayAmenities]);

  const availabilityInfo = useMemo(() => {
    if (!selected) return null;
    if (selected.category === 'restaurant') {
      if (selected.id === 'bun-quay-kien-xay') {
        return {
          badge: lang === 'vi' ? 'Phục vụ trực tiếp (Không nhận đặt trước bàn)' : 'Walk-in only',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
          desc: lang === 'vi'
            ? 'Quán phục vụ trực tiếp; khung giờ 18:30 - 20:00 thường đông khách. Bạn có thể order món trước để bếp ưu tiên chuẩn bị nhanh khi đến.'
            : 'Walk-in only; peak hours 18:30 - 20:00 are crowded. Pre-order dishes for priority preparation upon arrival.',
        };
      }
      const isPeak = arrivalTime >= '18:30' && arrivalTime <= '20:15';
      if (isPeak) {
        return {
          badge: lang === 'vi' ? 'Sắp hết bàn (Còn 2 bàn trống)' : 'Almost full (2 tables left)',
          badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
          dotClass: 'bg-orange-500 animate-pulse',
          desc: lang === 'vi'
            ? `Khung giờ cao điểm ${arrivalTime} ngày ${formatDate(date)} đang có nhiều khách đặt. Bạn nên xác nhận giữ bàn & order món trước.`
            : `Peak dining time ${arrivalTime} on ${formatDate(date)}. Confirm now and pre-order to secure your table.`,
        };
      }
      return {
        badge: lang === 'vi' ? 'Còn 6 bàn trống hôm nay' : '6 tables available today',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        desc: lang === 'vi'
          ? `Khung giờ ${arrivalTime} ngày ${formatDate(date)} còn nhiều bàn đẹp. Đặt trước & order món để bếp chuẩn bị chu đáo.`
          : `Good table availability at ${arrivalTime} on ${formatDate(date)}. Pre-order dishes for attentive service.`,
      };
    }
    if (selected.category === 'stay') {
      return {
        badge: lang === 'vi' ? 'Còn 3 phòng trống' : '3 rooms available',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        desc: lang === 'vi'
          ? `Ngày ${formatDate(date)} còn 3 phòng (Hạng Deluxe & Hướng biển). Bạn có thể chọn trước dịch vụ đón tiễn và nhận phòng sớm.`
          : `3 rooms left for ${formatDate(date)} (Deluxe & Ocean view). You can pre-select early check-in and airport transfer.`,
      };
    }
    if (selected.category === 'tour') {
      return {
        badge: lang === 'vi' ? 'Còn 8 chỗ khởi hành' : '8 spots available',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        desc: lang === 'vi'
          ? `Chuyến khởi hành ngày ${formatDate(date)} đảm bảo đúng giờ. Miễn phí dời lịch nếu thời tiết biển có sóng lớn.`
          : `Departure on ${formatDate(date)} confirmed. Free reschedule if sea weather is rough.`,
      };
    }
    return {
      badge: lang === 'vi' ? 'Sẵn sàng phục vụ' : 'Available',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
      desc: lang === 'vi' ? `Dịch vụ sẵn sàng phục vụ cho ngày ${formatDate(date)}.` : `Service ready for ${formatDate(date)}.`,
    };
  }, [selected, arrivalTime, date, lang]);

  const activePlanTotal = useMemo(() => {
    if (!trip) return FULL_TOUR_PACKAGE.totalVnd;
    const g = trip.guests || planGuests;
    return trip.ids.reduce((sum, id, index, allIds) => {
      const s = services.find((item) => item.id === id);
      if (!s || (s.priceUnit === 'per-night' && allIds.indexOf(id) !== index)) return sum;
      return sum + estimateServiceCost(s, g, trip.days);
    }, 0);
  }, [trip, planGuests]);

  const createRequest = () => {
    if (!selected || !date) return;
    const finalTotal = estimateServiceCost(selected, guests, 1) + preOrderTotal;
    const entry: Request = {
      code: 'DEMO-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
      serviceId: selected.id,
      date,
      guests,
      total: finalTotal,
      time: selected.category === 'restaurant' ? arrivalTime : undefined,
      preOrders: selectedPreOrders.length > 0 ? [...selectedPreOrders] : undefined,
      notes: bookingNotes.trim() || undefined,
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
    const activeDays = trip?.days || planDays;
    const activeGuests = trip?.guests || planGuests;
    const activeTitle = trip?.planTitle || (lang === 'vi' ? `Lịch trình Phú Quốc trọn gói ${activeDays}N${Math.max(1, activeDays - 1)}Đ` : `Full Phu Quoc Package ${activeDays}D`);

    const entry: Request = {
      code: tourCode,
      serviceId: 'full-trip',
      date: fullTourStartDate || tomorrowIso(),
      guests: activeGuests,
      total: activePlanTotal,
      planTitle: activeTitle,
      notes: fullTourNotes.trim() ? `${fullTourLeadName} (${fullTourPhone}) • ${fullTourNotes.trim()}` : `${fullTourLeadName} (${fullTourPhone})`,
    };
    const next = [entry, ...requests];
    setRequests(next);
    localStorage.setItem('gopu-demo-requests', JSON.stringify(next));

    toast(
      lang === 'vi'
        ? `Đã giữ chỗ trọn gói thành công!\nMã đặt tour: ${tourCode}\nTổng chi phí: ${formatMoney(activePlanTotal)} (${activeGuests} khách).\nĐội ngũ GOPU sẽ liên hệ SĐT ${fullTourPhone} để xác nhận chi tiết!`
        : `Package successfully held!\nTour code: ${tourCode}\nTotal: ${formatMoney(activePlanTotal)} (${activeGuests} guests).\nGOPU team will contact ${fullTourPhone} to confirm details!`
    );
    setFullTourBookingModal(false);
  };

  const selectedDetail = selected ? detailFor(selected.id) : undefined;
  const isRestaurant = selected?.category === 'restaurant';

  return (
    <div className="site min-h-screen bg-white flex flex-col">
      {/* 1. Header with full navigation matching Image 1 & 4 */}
      <HeaderSection
        currentTab={view}
        onSelectTab={(tabId) => go(tabId as View)}
        lang={lang}
        onToggleLang={(nextL) => go(view, nextL)}
      />

      {/* 2. Main Views */}
      <div className="flex-1">
        {view === 'price-table' && (
          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <PriceTableView lang={lang} onSelectService={setSelected} />
          </main>
        )}

        {/* VIEW 1: HOME LANDING */}
        {view === 'home' && (
          <HomeLanding
            lang={lang}
            weather={weather}
            weatherState={weatherState}
            onExplore={(category, query) => {
              setCatalogCategory(category ?? 'all');
              setCatalogSearch(query ?? '');
              go('services');
            }}
            onSelectService={(service) => {
              setSelected(service);
              // Mở xem chi tiết và đặt dịch vụ trực tiếp tại trang chủ, không chuyển sang trang khác
            }}
            onOpenAssistant={(prompt, messages, choices) => {
              if (messages) setConversation(messages);
              if (choices) setAssistantChoices(choices);
              if (prompt) setAssistantSeed(prompt);
              go('itinerary');
            }}
            onPlanCreated={(reply, messages) => {
              setConversation(messages);
              setAssistantChoices([]);
              setAssistantSeed('');
              applyPlan(reply);
            }}
          />
        )}

        {/* VIEW 2: SERVICES & REVIEWS CATALOG (MATCHING IMAGE 4 & 5) */}
        {view === 'services' && (
          <ServicesCatalogView
            lang={lang}
            initialSearch={catalogSearch}
            initialCategory={catalogCategory}
            onAddServiceToAi={(service: CatalogServiceItem) => {
              setAssistantSeed(lang === 'vi' ? 'Thêm dịch vụ "' + service.title + '" vào lịch trình' : 'Add "' + service.title + '" to my itinerary');
              go('itinerary');
            }}
            onViewServiceDetail={(service: CatalogServiceItem) => {
              // Card ids are service ids. If a card ever drifts from the catalog,
              // open nothing rather than silently showing a different service.
              const found = services.find((s) => s.id === service.id);
              if (found) setSelected(found);
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
            initialChoices={assistantChoices}
            onMessagesChange={setConversation}
            onChoicesChange={setAssistantChoices}
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
            onSelectService={setSelected}
            onBookFullTrip={() => setFullTourBookingModal(true)}
          />
          </main>
        )}

        {/* VIEW 4: SAMPLE REQUESTS */}
        {view === 'requests' && (
          <main className="max-w-5xl mx-auto px-4 py-12">
            <div className="page-intro mb-8">
              <span className="eyebrow text-[#087f78] text-xs font-bold uppercase tracking-wider block mb-1">
                GOPU / {lang === 'vi' ? 'Yêu cầu demo' : 'Demo requests'}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">{lang === 'vi' ? 'Yêu cầu mẫu của bạn' : 'Your sample requests'}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {lang === 'vi' ? 'Các yêu cầu được lưu trên trình duyệt của bạn để trải nghiệm giao diện.' : 'Requests are saved in this browser for this demo.'}
              </p>
            </div>

            {requests.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requests.map((r) => {
                  const isFullTrip = r.serviceId === 'full-trip';
                  const s = services.find((item) => item.id === r.serviceId);
                  return (
                    <article className={`p-5 rounded-2xl border shadow-sm ${isFullTrip ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border-emerald-300 sm:col-span-2' : 'bg-white border-gray-200'}`} key={r.code}>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-[10px] ${isFullTrip ? 'bg-[#087f78] text-white' : 'bg-emerald-50 text-[#087f78]'}`}>
                        {isFullTrip
                          ? (lang === 'vi' ? '🎯 Đã giữ chỗ trọn gói tour' : '🎯 Package tour confirmed')
                          : (lang === 'vi' ? 'Đã xác nhận demo' : 'Demo confirmed')}
                      </span>
                      <h2 className="text-base font-bold text-gray-900 mt-2 mb-1">
                        {isFullTrip ? (r.planTitle || (lang === 'vi' ? 'Lịch trình Phú Quốc trọn gói' : 'Full Phu Quoc Package')) : (s ? name(s, lang) : r.serviceId)}
                      </h2>
                      <p className="text-xs text-gray-500">{lang === 'vi' ? 'Mã yêu cầu: ' : 'Request code: '}<strong className="text-gray-900">{r.code}</strong></p>
                      <p className="text-xs text-gray-500">
                        {lang === 'vi' ? 'Ngày: ' : 'Date: '}{formatDate(r.date)}
                        {r.time ? ' • ' + (lang === 'vi' ? 'Giờ' : 'Time') + ': ' + r.time : ''}
                        {s ? ` • ${quantityLabel(s, lang)}: ${r.guests}` : ` • ${lang === 'vi' ? 'Số khách' : 'Guests'}: ${r.guests}`}
                      </p>
                      {r.preOrders && r.preOrders.length > 0 && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-white/90 border border-emerald-100 text-xs text-emerald-950">
                          <strong>{lang === 'vi' ? '🍽️ Món / dịch vụ đặt trước:' : '🍽️ Pre-ordered:'}</strong>{' '}
                          {r.preOrders.join(', ')}
                        </div>
                      )}
                      {r.notes && (
                        <div className="mt-1.5 p-2 rounded-xl bg-gray-50 text-xs text-gray-600 italic">
                          <strong>{lang === 'vi' ? '📝 Ghi chú:' : '📝 Notes:'}</strong> {r.notes}
                        </div>
                      )}
                      <strong className="text-base text-[#087f78] block mt-2">{formatMoney(r.total)}</strong>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-4">{lang === 'vi' ? 'Bạn chưa tạo yêu cầu demo nào.' : 'You have not created a demo request yet.'}</h2>
                <button
                  className="bg-[#087f78] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
                  onClick={() => go('services')}
                >
                  {lang === 'vi' ? 'Khám phá dịch vụ đảo ngay' : 'Explore island services'}
                </button>
              </div>
            )}
          </main>
        )}
      </div>

      {/* 3. Footer */}
      <FooterSection lang={lang} onOpenPriceTable={() => go('price-table')} />

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
          {/* Flex column, not a single scroll box: the summary bar must never be
              scrollable past, and nothing may render in the gap beneath it. */}
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => {
                setSelected(null);
                setSuccess(null);
              }}
              className="absolute top-4 right-4 z-10 min-h-11 rounded-full bg-white/90 hover:bg-white text-gray-700 px-3 flex items-center justify-center text-sm font-bold shadow-md transition-colors"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>

            {success ? (
              <div className="p-6 sm:p-8 overflow-y-auto text-center py-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                  {isRestaurant
                    ? lang === 'vi' ? 'Đặt Bàn Thành Công!' : 'Table booked!'
                    : lang === 'vi' ? 'Đặt Dịch Vụ Thành Công!' : 'Booking confirmed!'}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {lang === 'vi' ? 'Dịch vụ: ' : 'Service: '}
                  <strong className="text-gray-900">{name(selected, lang)}</strong>
                </p>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 inline-block text-left text-xs">
                  <p className="text-gray-500">
                    {lang === 'vi' ? 'Mã yêu cầu: ' : 'Request code: '}
                    <strong className="text-[#087f78]">{success.code}</strong>
                  </p>
                  <p className="text-gray-500">
                    {lang === 'vi' ? 'Ngày sử dụng: ' : 'Date: '}
                    <strong className="text-gray-800">{formatDate(success.date)}</strong>
                  </p>
                  {success.time && (
                    <p className="text-gray-500">
                      {lang === 'vi' ? 'Giờ đến: ' : 'Arrival time: '}
                      <strong className="text-gray-800">{success.time}</strong>
                    </p>
                  )}
                  <p className="text-gray-500">
                    {lang === 'vi' ? 'Tổng thanh toán dự kiến: ' : 'Estimated total: '}
                    <strong className="text-[#087f78]">{formatMoney(success.total)}</strong>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    className="w-full sm:w-auto bg-[#087f78] hover:bg-[#066862] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                    onClick={() => {
                      setSelected(null);
                      setSuccess(null);
                    }}
                  >
                    {lang === 'vi' ? 'Tiếp tục xem trang chủ' : 'Back to home'}
                  </button>
                  <button
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                    onClick={() => {
                      setSelected(null);
                      setSuccess(null);
                      go('requests');
                    }}
                  >
                    {lang === 'vi' ? 'Xem danh sách yêu cầu' : 'View my requests'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                {/* Header Image if present */}
                {selected.image && (
                  <div className="relative h-44 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden rounded-t-3xl bg-gray-100">
                    <Image
                      src={selected.image}
                      alt={name(selected, lang)}
                      fill
                      sizes="(max-width: 640px) 100vw, 480px"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold tracking-normal text-gray-800 shadow-xs">
                      {selected.area}
                    </div>
                    {selected.rating > 0 && (
                      <div className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold tracking-normal text-white flex items-center gap-1">
                        {selected.rating} ({selected.reviewCount} {lang === 'vi' ? 'đánh giá' : 'reviews'})
                      </div>
                    )}
                  </div>
                )}

                <span className="text-xs font-bold text-[#087f78] uppercase tracking-wider block mb-1">
                  {bookingHeading(selected, lang)}
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1.5">{name(selected, lang)}</h2>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{description(selected, lang)}</p>

                {selectedDetail && (
                  <ServiceDetailPanel detail={selectedDetail} category={selected.category} lang={lang} />
                )}

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl mt-4 mb-4 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-gray-600">
                    {lang === 'vi' ? 'Mức giá niêm yết:' : 'Listed price:'}
                  </span>
                  <span className="text-xl font-extrabold text-[#087f78]">
                    {formatMoney(selected.price)}{' '}
                    <small className="text-xs font-normal text-gray-500">{priceUnitLabel(selected.priceUnit, lang)}</small>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div>
                    <label htmlFor="booking-date" className="block font-bold text-gray-700 mb-1">
                      {lang === 'vi' ? 'Ngày sử dụng' : 'Date'}
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full min-h-11 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                  {isRestaurant && (
                    <div>
                      <label htmlFor="booking-time" className="block font-bold text-gray-700 mb-1">
                        {lang === 'vi' ? 'Giờ đến' : 'Arrival time'}
                      </label>
                      <input
                        id="booking-time"
                        type="time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="w-full min-h-11 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                      />
                    </div>
                  )}
                  <div className={isRestaurant ? 'col-span-2' : ''}>
                    <label htmlFor="booking-qty" className="block font-bold text-gray-700 mb-1">
                      {quantityLabel(selected, lang)}
                    </label>
                    <input
                      id="booking-qty"
                      type="number"
                      min="1"
                      max="30"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full min-h-11 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Availability status badge */}
                {availabilityInfo && (
                  <div className={`p-3.5 rounded-2xl border mb-4 ${availabilityInfo.badgeClass}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${availabilityInfo.dotClass}`}></span>
                        {lang === 'vi' ? 'Tình trạng chỗ hôm nay:' : 'Current availability:'}
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white/80 shadow-2xs">
                        {availabilityInfo.badge}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-95">
                      {availabilityInfo.desc}
                    </p>
                  </div>
                )}

                {/* Restaurant Pre-order Dishes */}
                {isRestaurant && (
                  <div className="mb-4 p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span>🍽️</span> {lang === 'vi' ? 'Order trước món ăn (Bếp chuẩn bị sẵn)' : 'Pre-order dishes (Prepared in advance)'}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {lang === 'vi' ? 'Tiết kiệm 20–30 phút chờ món, giữ nguyên liệu tươi sống.' : 'Save 20–30 mins wait time, lock in fresh seafood.'}
                        </p>
                      </div>
                      {selectedPreOrders.length > 0 && (
                        <span className="text-xs font-extrabold text-[#087f78] bg-emerald-100 px-2 py-0.5 rounded-md">
                          +{formatMoney(preOrderTotal)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      {restaurantDishes.map((dish) => {
                        const checked = selectedPreOrders.includes(dish.name);
                        return (
                          <label
                            key={dish.name}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              checked ? 'bg-white border-[#087f78] shadow-xs' : 'bg-white/70 border-gray-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPreOrders([...selectedPreOrders, dish.name]);
                                  } else {
                                    setSelectedPreOrders(selectedPreOrders.filter((name) => name !== dish.name));
                                  }
                                }}
                                className="w-4 h-4 text-[#087f78] rounded border-gray-300 focus:ring-[#087f78]"
                              />
                              <span className={`font-semibold ${checked ? 'text-gray-900' : 'text-gray-700'}`}>{dish.name}</span>
                            </div>
                            <span className="font-bold text-[#087f78] text-xs">+{formatMoney(dish.price)}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'vi' ? 'Ghi chú cho bếp / bàn ăn' : 'Notes for kitchen / table'}
                      </label>
                      <input
                        type="text"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder={lang === 'vi' ? 'Ví dụ: Bàn gần cửa sổ, ăn ít cay, dị ứng hải sản có vỏ…' : 'E.g., Window table, mild spicy, shellfish allergy…'}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Stay Pre-arrival Requests */}
                {selected.category === 'stay' && (
                  <div className="mb-4 p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span>🛎️</span> {lang === 'vi' ? 'Yêu cầu phòng & đón tiễn đặt trước' : 'Room requests & arrival services'}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {lang === 'vi' ? 'Lễ tân sắp xếp trước khi bạn nhận phòng.' : 'Front desk prepares before your check-in.'}
                        </p>
                      </div>
                      {selectedPreOrders.length > 0 && (
                        <span className="text-xs font-extrabold text-[#087f78] bg-emerald-100 px-2 py-0.5 rounded-md">
                          +{formatMoney(preOrderTotal)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      {stayAmenities.map((amenity) => {
                        const checked = selectedPreOrders.includes(amenity.name);
                        return (
                          <label
                            key={amenity.name}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              checked ? 'bg-white border-[#087f78] shadow-xs' : 'bg-white/70 border-gray-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPreOrders([...selectedPreOrders, amenity.name]);
                                  } else {
                                    setSelectedPreOrders(selectedPreOrders.filter((name) => name !== amenity.name));
                                  }
                                }}
                                className="w-4 h-4 text-[#087f78] rounded border-gray-300 focus:ring-[#087f78]"
                              />
                              <span className={`font-semibold ${checked ? 'text-gray-900' : 'text-gray-700'}`}>{amenity.name}</span>
                            </div>
                            <span className="font-bold text-[#087f78] text-xs">
                              {amenity.price > 0 ? `+${formatMoney(amenity.price)}` : (lang === 'vi' ? 'Miễn phí' : 'Free')}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'vi' ? 'Ghi chú cho lễ tân' : 'Notes for front desk'}
                      </label>
                      <input
                        type="text"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder={lang === 'vi' ? 'Ví dụ: Dự kiến đến sớm lúc 11:30, đi cùng trẻ nhỏ…' : 'E.g., Arriving early around 11:30 AM, traveling with kids…'}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Notes for other services */}
                {!isRestaurant && selected.category !== 'stay' && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'vi' ? 'Ghi chú thêm cho nhà cung cấp' : 'Notes for provider'}
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder={lang === 'vi' ? 'Ví dụ: Đón tại khách sạn trung tâm Dương Đông, mang theo hành lý lớn…' : 'E.g., Pickup at Duong Dong hotel, large luggage…'}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium"
                    />
                  </div>
                )}
                </div>

                {/* Outside the scroll region, so it is always reachable and the
                    content it covers can never peek out underneath it. */}
                <div className="shrink-0 px-6 sm:px-8 py-3 bg-white border-t border-gray-100 shadow-[0_-8px_16px_-10px_rgba(16,42,44,0.18)]">
                  <div className="flex items-center justify-between text-xs font-bold mb-2.5">
                    <div>
                      <span className="text-gray-600 block">
                        {lang === 'vi' ? 'Tổng chi phí ước tính:' : 'Estimated total:'}
                      </span>
                      {preOrderTotal > 0 && (
                        <span className="text-[11px] font-normal text-emerald-700">
                          {lang === 'vi' ? `(Đã gồm +${formatMoney(preOrderTotal)} món/dịch vụ đặt trước)` : `(Includes +${formatMoney(preOrderTotal)} pre-orders)`}
                        </span>
                      )}
                    </div>
                    <span className="text-base text-[#087f78]">
                      {formatMoney(estimateServiceCost(selected, guests, 1) + preOrderTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelected(null)}
                      className="w-1/3 min-h-11 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {lang === 'vi' ? 'Đóng' : 'Close'}
                    </button>
                    <button
                      onClick={createRequest}
                      className="w-2/3 min-h-11 py-2.5 rounded-xl bg-[#087f78] hover:bg-[#066862] text-white text-xs font-extrabold shadow-md transition-colors"
                    >
                      {isRestaurant
                        ? lang === 'vi' ? 'Xác Nhận Đặt Bàn (Demo)' : 'Confirm table (demo)'
                        : lang === 'vi' ? 'Xác Nhận Giữ Chỗ (Demo)' : 'Confirm hold (demo)'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Full Tour Package Checkout Modal */}
      {fullTourBookingModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setFullTourBookingModal(false);
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setFullTourBookingModal(false)}
              className="absolute top-5 right-5 min-h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 px-3 flex items-center justify-center text-sm font-bold z-10"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>

            <form onSubmit={handleConfirmFullTourBooking} className="flex flex-col min-h-0 flex-1">
              <div className="overflow-y-auto pr-1">
                <span className="text-xs font-bold text-[#087f78] uppercase tracking-wider block mb-1">
                  {lang === 'vi' ? 'ĐẶT TRỌN GÓI LỊCH TRÌNH AI GOPU' : 'BOOK FULL GOPU AI ITINERARY'}
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 mb-1">
                  {trip?.planTitle || (lang === 'vi' ? `Lịch trình Phú Quốc ${trip?.days || 3} ngày trọn gói` : `Phu Quoc ${trip?.days || 3}-day Full Trip`)}
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  {trip?.days || 3} {lang === 'vi' ? 'ngày' : 'days'} • {trip?.guests || planGuests} {lang === 'vi' ? 'khách • Giữ chỗ toàn bộ dịch vụ trong kế hoạch' : 'guests • Complete itinerary included'}
                </p>

                {/* Scheduled Services List Preview */}
                {trip && trip.ids.length > 0 && (
                  <div className="mb-4 max-h-36 overflow-y-auto p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                    <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                      {lang === 'vi' ? `Các dịch vụ trong chuyến đi (${trip.ids.length} dịch vụ):` : `Included activities (${trip.ids.length} items):`}
                    </div>
                    {trip.ids.map((id, idx) => {
                      const s = services.find((item) => item.id === id);
                      if (!s) return null;
                      return (
                        <div key={`${idx}-${id}`} className="flex items-center justify-between text-gray-600">
                          <span className="truncate pr-2">• {name(s, lang)}</span>
                          <span className="shrink-0 font-semibold text-[#087f78]">{formatMoney(s.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-gray-600 font-semibold">{lang === 'vi' ? 'Tổng chi phí trọn gói:' : 'Package total:'}</span>
                    <span className="text-xl font-extrabold text-[#087f78]">{formatMoney(activePlanTotal)}</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    {lang === 'vi' ? 'Bao gồm toàn bộ xe đón tiễn, cano đảo, nhà hàng & phòng lưu trú đã lên lịch.' : 'Includes all scheduled airport rides, boat trips, restaurants & stay.'}
                  </p>
                </div>

                <div className="space-y-3 mb-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{lang === 'vi' ? 'Họ tên người đại diện' : 'Lead traveller name'}</label>
                    <input
                      required
                      type="text"
                      value={fullTourLeadName}
                      onChange={(e) => setFullTourLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{lang === 'vi' ? 'Số điện thoại / Zalo' : 'Phone / Zalo'}</label>
                      <input
                        required
                        type="tel"
                        value={fullTourPhone}
                        onChange={(e) => setFullTourPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{lang === 'vi' ? 'Ngày bắt đầu chuyến đi' : 'Trip start date'}</label>
                      <input
                        required
                        type="date"
                        value={fullTourStartDate}
                        onChange={(e) => setFullTourStartDate(e.target.value)}
                        min={todayIso()}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      {lang === 'vi' ? 'Ghi chú chuyến đi (giờ bay, yêu cầu ăn uống…)' : 'Trip notes (flight times, meal preferences…)'}
                    </label>
                    <input
                      type="text"
                      value={fullTourNotes}
                      onChange={(e) => setFullTourNotes(e.target.value)}
                      placeholder={lang === 'vi' ? 'Ví dụ: Đến sân bay lúc 10:30, đoàn có trẻ nhỏ…' : 'E.g., Landing at 10:30, traveling with children…'}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 mb-4 leading-relaxed">
                  <strong>{lang === 'vi' ? 'Cam kết GOPU:' : 'GOPU promise:'}</strong> {lang === 'vi' ? 'Không phụ thu ẩn, miễn phí dời chuyến khi thời tiết biển xấu, tài xế bản địa đón tại sân bay đúng giờ.' : 'No hidden charges, free rescheduling in bad sea weather, and an on-time airport pickup by a local driver.'}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setFullTourBookingModal(false)}
                  className="w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  {lang === 'vi' ? 'Đóng' : 'Close'}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-[#087f78] hover:bg-[#066862] text-white text-xs font-extrabold shadow-lg shadow-teal-950/10 active:scale-95 transition-all"
                >
                  {lang === 'vi' ? 'Xác Nhận Giữ Chỗ Ngay' : 'Confirm reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
