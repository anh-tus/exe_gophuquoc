'use client';

import React, { useState } from 'react';
import HeaderSection from '../components/landing/HeaderSection';
import SmartHero from '../components/landing/SmartHero';
import LiveWeatherStrip from '../components/landing/LiveWeatherStrip';
import ServiceEcosystem from '../components/landing/ServiceEcosystem';
import ExclusivePromoBanner from '../components/landing/ExclusivePromoBanner';
import CuratedSpots from '../components/landing/CuratedSpots';
import PriceStandardTable from '../components/landing/PriceStandardTable';
import AiPlannerSection from '../components/landing/AiPlannerSection';
import AppDownloadCta from '../components/landing/AppDownloadCta';
import FooterSection from '../components/landing/FooterSection';
import { EcosystemService, CuratedSpot, StandardPriceItem } from '../data/landing-data';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function Home() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [currentTab, setCurrentTab] = useState('home');

  // Booking Modal State
  const [bookingItem, setBookingItem] = useState<{
    title: string;
    price: string;
    desc?: string;
  } | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-05-15');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // AI Assistant Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Xin chào! Tôi là GOPU AI — trợ lý du lịch Phú Quốc. Bạn muốn phác thảo lịch trình, tìm cano đi đảo hay gợi ý quán ăn ngon view biển?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Tab navigation handler
  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'services') {
      document.getElementById('services-ecosystem')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'itinerary') {
      document.getElementById('ai-planner')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'price-table') {
      document.getElementById('price-table')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'weather') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Triggering plan from SmartHero
  const handlePlanTrip = (promptText: string) => {
    setIsChatOpen(true);
    sendMessage(promptText);
  };

  // Service Click
  const handleSelectService = (service: EcosystemService) => {
    setBookingItem({
      title: service.title,
      price: service.priceLabel,
      desc: service.desc,
    });
  };

  // Spot Click
  const handleSelectSpot = (spot: CuratedSpot) => {
    setBookingItem({
      title: spot.title,
      price: spot.priceRange,
      desc: `Địa điểm tại ${spot.area} (${spot.tag}) với đánh giá ${spot.rating}★`,
    });
  };

  // Price Table Action
  const handlePriceAction = (item: StandardPriceItem) => {
    setBookingItem({
      title: item.serviceName,
      price: item.priceRange,
      desc: item.specNotes,
    });
  };

  // Exclusive Promo Click
  const handleBookPromo = () => {
    setBookingItem({
      title: 'Gói Tour Cano 4 Đảo Cao Cấp + Flycam & SUP (Ưu đãi 15%)',
      price: '1.230.000đ / người (đã giảm 15%)',
      desc: 'Tour cano riêng khám phá Hòn Mây Rút, Hòn Gầm Ghì, ăn trưa hải sản 8 món, tặng ảnh SUP & video flycam.',
    });
  };

  // Submit Booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess(code);
    setTimeout(() => {
      setBookingItem(null);
      setBookingSuccess(null);
    }, 2500);
  };

  // Send message to AI assistant
  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          lang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data.message || (data.plan ? `Đã tạo kế hoạch: ${data.plan.title}` : 'Đã nhận yêu cầu!');
        setChatMessages((prev) => [...prev, { role: 'assistant', text: replyText }]);
      } else {
        // Friendly fallback response
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Tôi đã ghi nhận yêu cầu "${text}". Đang tối ưu lộ trình kết hợp thời tiết 29°C và biển êm 0.4m tại Nam Đảo. Bạn muốn đi 3N2Đ hay 4N3Đ?`,
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `GOPU AI: Đã nhận thông tin. Lộ trình gợi ý phù hợp nhất hiện tại là: Ngày 1 cano 4 đảo Nam, Ngày 2 khám phá Bắc Đảo (VinWonders & Grand World), Ngày 3 ngắm hoàng hôn Sunset Sanato.`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* 1. Header & Navigation */}
      <HeaderSection
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        lang={lang}
        onToggleLang={setLang}
      />

      <main className="flex-1">
        {/* 2. Smart Hero & AI Concierge Engine */}
        <SmartHero onPlanTrip={handlePlanTrip} lang={lang} />

        {/* 3. Live Weather & Marine Conditions Strip */}
        <LiveWeatherStrip lang={lang} />

        {/* 4. Island Mobility & Experiences Ecosystem (10 Services Grid) */}
        <ServiceEcosystem onSelectService={handleSelectService} lang={lang} />

        {/* 5. Exclusive Campaign Promo Banner */}
        <ExclusivePromoBanner onBookPromo={handleBookPromo} lang={lang} />

        {/* 6. Unmissable Island Highlights */}
        <CuratedSpots onSelectSpot={handleSelectSpot} lang={lang} />

        {/* 7. Standard Price Table (Chống Chặt Chém) */}
        <PriceStandardTable onActionClick={handlePriceAction} lang={lang} />

        {/* 8. AI Automated Itinerary Planner (3 Seconds) */}
        <AiPlannerSection onOpenChat={() => setIsChatOpen(true)} lang={lang} />

        {/* 9. App Download & Zalo Mini App Conversion Banner */}
        <AppDownloadCta lang={lang} />
      </main>

      {/* 10. Footer Section */}
      <FooterSection lang={lang} />

      {/* Booking / Details Modal */}
      {bookingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => {
                setBookingItem(null);
                setBookingSuccess(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Tạo Yêu Cầu Thành Công!
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Mã yêu cầu lưu trong phiên của bạn: <strong className="text-[#087f78]">{bookingSuccess}</strong>
                </p>
                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium">
                  Tài xế/Đội cano liên kết sẽ sẵn sàng đón theo ngày giờ bạn chọn.
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking}>
                <span className="text-[11px] font-bold text-[#087f78] uppercase tracking-wider block mb-1">
                  XÁC MINH &amp; ĐẶT DỊCH VỤ MINH BẠCH
                </span>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {bookingItem.title}
                </h3>
                {bookingItem.desc && (
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {bookingItem.desc}
                  </p>
                )}

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl mb-5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-gray-600">Mức giá niêm yết:</span>
                  <span className="text-lg font-black text-[#087f78]">{bookingItem.price}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Ngày sử dụng dịch vụ</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:outline-none focus:border-[#087f78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">Số lượng khách</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50 focus:outline-none focus:border-[#087f78]"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 mb-6 italic">
                  * 100% tuân thủ quy chuẩn giá đảo. Hỗ trợ dời lịch miễn phí khi thời tiết biển động cấp 4 trở lên.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingItem(null)}
                    className="w-1/3 py-3 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl text-xs font-black bg-[#087f78] hover:bg-[#066761] text-white shadow-md active:scale-95 transition-all"
                  >
                    Xác Nhận Giữ Chỗ (Demo)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-gray-200 flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-100 bg-emerald-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#087f78] text-white flex items-center justify-center text-lg font-bold">
                🤖
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900 leading-tight">
                  GOPU AI Assistant
                </h4>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Gemini Flash Lite • Trực tuyến
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Chat Transcript Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#087f78] flex items-center justify-center text-xs flex-shrink-0">
                    ✨
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#087f78] text-white rounded-br-xs'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce" />
                <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-2 h-2 rounded-full bg-[#087f78] animate-bounce [animation-delay:0.4s]" />
                <span>GOPU AI đang phân tích dữ liệu đảo...</span>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="p-2 border-t border-gray-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
            <button
              onClick={() => sendMessage('Đi cano 4 đảo buổi sáng mấy giờ đẹp nhất?')}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-[#087f78]"
            >
              Giờ cano đẹp nhất?
            </button>
            <button
              onClick={() => sendMessage('Gợi ý quán bún quậy ngon ở Dương Đông')}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-[#087f78]"
            >
              Quán bún quậy ngon?
            </button>
            <button
              onClick={() => sendMessage('Chi phí thuê xe máy tự lái 3 ngày')}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-[#087f78]"
            >
              Giá xe máy 3 ngày?
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(chatInput);
            }}
            className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhắn tin cho trợ lý du lịch GOPU..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#087f78]"
            />
            <button
              type="submit"
              disabled={isThinking || !chatInput.trim()}
              className="bg-[#087f78] hover:bg-[#066761] disabled:opacity-50 text-white font-bold p-2.5 rounded-xl text-xs transition-colors flex-shrink-0"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
