'use client';

import React, { useState } from 'react';
import { SAMPLE_TIMELINE, TimelineActivity } from '../../data/landing-data';

interface AiPlannerSectionProps {
  onOpenChat: () => void;
  lang: 'vi' | 'en';
}

export default function AiPlannerSection({ onOpenChat, lang }: AiPlannerSectionProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleExportQr = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-planner" className="py-14 lg:py-20 bg-[#f7fbf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#087f78] tracking-widest uppercase mb-2 block">
            {lang === 'vi' ? 'HỆ THỐNG GỢI Ý TOUR THÔNG MINH' : 'SMART TOUR ENGINE'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            {lang === 'vi'
              ? 'Trợ Lý AI Lên Lịch Trình Tự Động Trong 3 Giây'
              : 'Automated 3-Second AI Trip Planner'}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3">
            {lang === 'vi'
              ? 'Dựa trên điểm lưu trú, thời tiết biển thực tế và sở thích ẩm thực cá nhân, GOPU AI tự động sắp xếp quãng đường ngắn nhất và tránh sự cố trễ giờ cano.'
              : 'GOPU AI arranges optimal travel routes based on weather and your preferences.'}
          </p>
        </div>

        {/* 2-Column Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Timeline Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md">
            {/* Header of Timeline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#087f78] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block mb-1">
                  {lang === 'vi' ? 'Lịch Trình Mẫu • Gia đình 4 người (3N2Đ)' : 'Sample Trip • Family 4 (3D2N)'}
                </span>
                <h3 className="font-bold text-lg text-gray-900">
                  {lang === 'vi' ? 'Ngày 1: Khám phá trọn vẹn cụm 4 đảo Nam' : 'Day 1: Southern 4-Island Adventure'}
                </h3>
              </div>

              {/* Day selector tabs */}
              <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      selectedDay === d
                        ? 'bg-[#087f78] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {lang === 'vi' ? `Ngày ${d}` : `Day ${d}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="py-6 space-y-6">
              {SAMPLE_TIMELINE.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Timeline connector line */}
                  {idx !== SAMPLE_TIMELINE.length - 1 && (
                    <div className="absolute left-[27px] top-7 bottom-[-24px] w-0.5 bg-emerald-100" />
                  )}

                  {/* Time Circle */}
                  <div className="relative z-10 w-14 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-[#087f78] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                    {item.time}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                        {item.title}
                      </h4>
                      {item.location && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded flex-shrink-0">
                          📍 {item.location}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Total & Actions */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  {lang === 'vi' ? 'Tổng chi phí ước tính (Ngày 1):' : 'Estimated Cost (Day 1):'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#087f78]">
                  4.250.000đ <span className="text-xs font-normal text-gray-400">/ 4 khách</span>
                </span>
              </div>

              <button
                onClick={handleExportQr}
                className="bg-[#087f78] hover:bg-[#066761] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
              >
                <span>{copied ? '✓ Đã tạo mã QR lưu máy' : 'Lưu & Xuất Lịch Trình (QR)'}</span>
                <span>📱</span>
              </button>
            </div>
          </div>

          {/* Right Column: Map & Chat with AI Widget (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Map Preview Card */}
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-md overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <span>🗺️</span>
                  <span>{lang === 'vi' ? 'Bản Đồ Tuyến Di Chuyển Thông Minh' : 'Route Map Preview'}</span>
                </span>
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Nam Đảo (4 đảo)
                </span>
              </div>

              {/* Interactive OpenStreetMap iframe container */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  title="Bản đồ Nam Đảo Phú Quốc"
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=103.95%2C100.00%2C104.10%2C100.30&amp;layer=mapnik&amp;marker=10.027%2C104.017"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl text-xs flex items-center justify-between border border-gray-200 shadow-sm">
                  <span className="text-gray-700 font-semibold">Tuyến: Khách sạn ➔ Cảng An Thới ➔ 4 Đảo</span>
                  <span className="text-emerald-700 font-bold">28 km</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Callout Box */}
            <div className="bg-gradient-to-br from-[#0c3935] to-[#072422] rounded-3xl p-6 text-white shadow-lg flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-2xl flex-shrink-0">
                🤖
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-base text-white mb-1">
                  {lang === 'vi' ? 'Cần điều chỉnh lịch trình riêng?' : 'Need a custom itinerary?'}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {lang === 'vi'
                    ? 'Bạn có thể yêu cầu trợ lý AI đổi giờ cano, thay đổi điểm ăn uống hoặc chỉnh ngân sách chỉ bằng một tin nhắn.'
                    : 'Chat with GOPU AI to adjust timings, restaurant spots, or budget on the fly.'}
                </p>
                <button
                  onClick={onOpenChat}
                  className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>{lang === 'vi' ? 'Chat với GOPU AI ngay' : 'Chat with AI'}</span>
                  <span>✨</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

