'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AiPlanResultViewProps {
  initialPrompt?: string;
  onBookFullTour: () => void;
  lang: 'vi' | 'en';
}

export default function AiPlanResultView({
  initialPrompt = 'Mình muốn đi 3 ngày 2 đêm cùng gia đình (4 người), ngân sách khoảng 12 triệu, ưu tiên tắm biển ngắm hoàng hôn, cano 4 đảo và ăn hải sản ngon.',
  onBookFullTour,
  lang,
}: AiPlanResultViewProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [promptInput, setPromptInput] = useState('');
  const [userPromptText, setUserPromptText] = useState(initialPrompt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick prompt adjustments
  const handleApplyQuickPrompt = (adjustment: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setUserPromptText((prev) => `${prev} • ${adjustment}`);
    }, 800);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setUserPromptText(promptInput);
      setPromptInput('');
    }, 900);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-[#f8fbfb] min-h-screen py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* System Alert Status Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#087f78] flex items-center justify-center font-bold flex-shrink-0">
              🛡️
            </span>
            <span className="font-bold text-gray-900">
              Hệ thống GOPU Smart Intelligence v3.2
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="text-gray-500">
              Lộ trình được đồng bộ dữ liệu thời tiết &amp; giá nhà cung cấp đảo ngọc Phú Quốc theo thời gian thực
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              ● Độ trễ AI: 140ms
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              🌊 Sóng biển êm: Cấp 1
            </span>
          </div>
        </div>

        {/* 2-Column Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Gemini Island Planner (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            {/* Chat Box Card */}
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-md">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#087f78] to-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    ✨
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-gray-900 leading-none">
                        Gemini Island Planner
                      </h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Live PQ
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Trợ lý AI Lập Trình Phú Quốc • Đang phản hồi tức thì
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSubmitting(true)}
                  title="Tạo lại lộ trình mới"
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs"
                >
                  ↺
                </button>
              </div>

              {/* Chat Stream */}
              <div className="py-4 space-y-4 text-xs">
                {/* User Message Bubble */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
                  <div className="text-[10px] font-bold text-gray-400 mb-1 flex items-center justify-between">
                    <span>Bạn (Khách gia đình)</span>
                    <span>14:28</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed font-medium">
                    &ldquo;{userPromptText}&rdquo;
                  </p>
                </div>

                {/* AI Response Card */}
                <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-4">
                  <div className="text-[10px] font-bold text-[#087f78] mb-1.5 flex items-center gap-1">
                    <span>🤖 GOPU AI</span>
                    <span className="text-gray-400 font-normal">• Vừa xong</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Chào bạn! Mình đã tổng hợp lộ trình <strong>3 ngày 2 đêm</strong> tối ưu ngân sách{' '}
                    <strong className="text-[#087f78]">11.840.000 đ</strong> cho 4 người lớn (tiết kiệm{' '}
                    <span className="text-emerald-700 font-bold">160.000 đ</span> so với ngân sách dự trù).
                  </p>

                  {/* 4 Feature Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-100/60">
                    <div className="bg-white p-2 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                      <span className="text-base">🚤</span>
                      <div>
                        <div className="font-bold text-gray-800 text-[11px]">Cano 4 Đảo</div>
                        <div className="text-[10px] text-gray-400">An Thới vip</div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                      <span className="text-base">🌅</span>
                      <div>
                        <div className="font-bold text-gray-800 text-[11px]">Hoàng Hôn</div>
                        <div className="text-[10px] text-gray-400">Sunset Sanato</div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                      <span className="text-base">🦞</span>
                      <div>
                        <div className="font-bold text-gray-800 text-[11px]">Ẩm thực biển</div>
                        <div className="text-[10px] text-gray-400">Chợ Đêm &amp; Hải sản</div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100/60 flex items-center gap-2">
                      <span className="text-base">🏨</span>
                      <div>
                        <div className="font-bold text-gray-800 text-[11px]">Khách sạn 4★</div>
                        <div className="text-[10px] text-gray-400">TT. Dương Đông</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-3">
                    Bạn có thể xem timeline chi tiết bên phải và tùy chỉnh trực tiếp bằng các gợi ý:
                  </p>
                </div>

                {/* Quick Adjustment Prompt Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Gợi ý tinh chỉnh nhanh từ AI:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleApplyQuickPrompt('Giảm ngân sách (-15%)')}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#087f78] border border-gray-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>📉</span> <span>Giảm ngân sách (-15%)</span>
                    </button>
                    <button
                      onClick={() => handleApplyQuickPrompt('Thêm điểm check-in hoàng hôn')}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#087f78] border border-gray-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>🌅</span> <span>Thêm điểm check-in hoàng hôn</span>
                    </button>
                    <button
                      onClick={() => handleApplyQuickPrompt('Tour gia đình có trẻ em')}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#087f78] border border-gray-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>👶</span> <span>Tour gia đình có trẻ em</span>
                    </button>
                    <button
                      onClick={() => handleApplyQuickPrompt('Tối ưu thời gian di chuyển')}
                      className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#087f78] border border-gray-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>⏱️</span> <span>Tối ưu thời gian di chuyển</span>
                    </button>
                  </div>
                </div>

                {/* Input Prompt Box */}
                <form onSubmit={handleCustomPromptSubmit} className="pt-2">
                  <div className="relative border border-gray-200 rounded-2xl p-2.5 focus-within:border-[#087f78] focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all bg-white">
                    <textarea
                      rows={2}
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Ví dụ: Đổi bữa trưa ngày 2 sang bún quậy, thêm cáp treo Hòn Thơm..."
                      className="w-full text-xs text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="cursor-pointer hover:text-gray-600">🎤</span>
                        <span>Phím Enter để gửi</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !promptInput.trim()}
                        className="bg-[#087f78] hover:bg-[#066761] disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1"
                      >
                        <span>Gửi prompt AI</span>
                        <span>🚀</span>
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <span>ℹ️</span>
                  <span>Dữ liệu được Gemini AI tổng hợp từ dịch vụ địa phương thời gian thực tại Phú Quốc.</span>
                </div>
              </div>
            </div>

            {/* Smart Tip Card Below */}
            <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div className="text-xs text-gray-700 leading-relaxed">
                <strong className="text-amber-900 block mb-0.5">Mẹo thông minh GOPU:</strong>
                Thời điểm vàng đón hoàng hôn tại Sunset Sanato là <strong>17:20 - 18:05</strong>. AI đã tự động chừa khoảng đệm 25 phút để xe không bị kẹt giờ cao điểm.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Plan Overview, Tabs, Detailed Timeline & Cost Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Plan Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#087f78] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    ✨ AI Generated v3.2
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Mã tour: PQ-4PAX-3N2D
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#087f78]">
                  ✓ Tối ưu trong ngân sách
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                Phú Quốc 3N2Đ: Thiên Đường Biển Đảo &amp; Hải Sản
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                Kế hoạch cá nhân hóa theo phong cách thư giãn gia đình, di chuyển nhẹ nhàng và trọn vị ẩm thực.
              </p>

              {/* 4 KPI Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Tổng chi phí dự kiến</span>
                  <span className="text-base sm:text-lg font-black text-[#087f78]">11.840.000 đ</span>
                  <span className="text-[10px] text-gray-400 block">Đã gồm VAT &amp; Phí cảng</span>
                </div>
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Đơn giá / Khách</span>
                  <span className="text-base sm:text-lg font-black text-gray-900">2.960.000 đ</span>
                  <span className="text-[10px] text-gray-400 block">Áp dụng đoàn 4 khách</span>
                </div>
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Thời lượng hành trình</span>
                  <span className="text-base sm:text-lg font-black text-gray-900">3N 2Đ</span>
                  <span className="text-[10px] text-gray-400 block">7 điểm đến trọng điểm</span>
                </div>
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Chỉ số hài lòng AI</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600">98.4%</span>
                  <span className="text-[10px] text-gray-400 block">Dựa trên 1.250 đánh giá</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-5 border-t border-gray-100 text-xs font-bold">
                <button
                  onClick={() => alert('Xuất file PDF lịch trình thành công!')}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <span>📥</span> <span>Xuất file PDF / Lịch</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <span>🔗</span> <span>{copiedLink ? 'Đã sao chép liên kết' : 'Chia sẻ bạn bè'}</span>
                </button>
                <button
                  onClick={() => alert('Đã lưu lịch trình vào tài khoản GOPU của bạn!')}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <span>💾</span> <span>Lưu vào tài khoản</span>
                </button>
                <button
                  onClick={onBookFullTour}
                  className="ml-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <span>🏷️</span> <span>Đặt trọn gói ưu đãi (-5%)</span>
                </button>
              </div>
            </div>

            {/* Daily Itinerary Tabs */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <h3 className="font-black text-sm text-gray-900">Lộ trình theo ngày</h3>
                <span>Đang xem: Ngày {activeDay} (Bấm chuyển ngày)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Day 1 Tab */}
                <button
                  onClick={() => setActiveDay(1)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeDay === 1
                      ? 'bg-[#087f78] text-white border-[#087f78] shadow-md'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-[#087f78]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="uppercase">NGÀY 1 • HÔM NAY</span>
                    <span>☀️</span>
                  </div>
                  <div className="font-extrabold text-sm leading-tight">Nam Đảo &amp; Hoàng Hôn</div>
                  <div className={`text-[11px] mt-0.5 ${activeDay === 1 ? 'text-emerald-100' : 'text-gray-400'}`}>
                    Bãi Sao, Sunset Sanato, Chợ Đêm
                  </div>
                </button>

                {/* Day 2 Tab */}
                <button
                  onClick={() => setActiveDay(2)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeDay === 2
                      ? 'bg-[#087f78] text-white border-[#087f78] shadow-md'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-[#087f78]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="uppercase">NGÀY 2</span>
                    <span>🏊</span>
                  </div>
                  <div className="font-extrabold text-sm leading-tight">Cano 4 Đảo &amp; Câu Mực</div>
                  <div className={`text-[11px] mt-0.5 ${activeDay === 2 ? 'text-emerald-100' : 'text-gray-400'}`}>
                    Hòn Thơm, Mây Rút, Lặn San Hô
                  </div>
                </button>

                {/* Day 3 Tab */}
                <button
                  onClick={() => setActiveDay(3)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeDay === 3
                      ? 'bg-[#087f78] text-white border-[#087f78] shadow-md'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-[#087f78]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="uppercase">NGÀY 3</span>
                    <span>🏛️</span>
                  </div>
                  <div className="font-extrabold text-sm leading-tight">Bắc Đảo &amp; Mua Đặc Sản</div>
                  <div className={`text-[11px] mt-0.5 ${activeDay === 3 ? 'text-emerald-100' : 'text-gray-400'}`}>
                    Grand World, Tiêu, Nước Mắm
                  </div>
                </button>
              </div>
            </div>

            {/* Detailed Timeline Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md">
              {/* Timeline Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#087f78]" />
                    Timeline Chi Tiết: Ngày {activeDay}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tổng 5 hoạt động chính • Khoảng cách di chuyển: 38 km • Tổng phí ngày: 2.780.000 đ (cho 4 người)
                  </p>
                </div>

                <button
                  onClick={() => alert('Thêm hoạt động mới vào ngày ' + activeDay)}
                  className="px-3 py-1.5 rounded-xl border border-dashed border-emerald-300 text-[#087f78] hover:bg-emerald-50 text-xs font-bold flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>⊕</span> <span>Thêm hoạt động</span>
                </button>
              </div>

              {/* Timeline Items Stream */}
              <div className="py-6 space-y-6">
                {/* Item 1: Xe đón sân bay */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex-1 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">08:30 - 09:30</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Di chuyển riêng
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        250.000 đ <span className="text-[10px] font-normal text-gray-400">/ xe / chỗ</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Đón tại Sân Bay Quốc Tế Phú Quốc về Dương Đông
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      Xe MPV 7 chỗ máy lạnh đón tại sảnh Đến quốc nội (Tài xế cầm bảng tên GOPU đón khách). Chở thẳng về khách sạn gửi hành lý an toàn.
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span>📍 14 km (22 phút)</span>
                        <span>🧳 4 vali lớn</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#087f78] font-bold">
                        <button className="hover:underline">Đổi loại xe</button>
                        <span>•</span>
                        <button className="hover:underline">Chi tiết tài xế</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 2: Bún quậy Kiến Xây */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🍜
                  </div>
                  <div className="flex-1 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">10:00 - 12:00</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Ẩm thực đảo
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        280.000 đ <span className="text-[10px] font-normal text-gray-400">/ 4 tô đặc biệt</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Thưởng thức Bún quậy Kiến Xây &amp; Check-in nhận phòng sớm
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      Trải nghiệm bún quậy trứ danh với chả tôm mực tươi giã tay và nước chấm quậy tự pha độc đáo. Quán cách khách sạn 600m đi bộ mát mẻ.
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-gray-100">
                      <span className="text-amber-500 font-bold">⭐ 4.7★ (3.100+ review)</span>
                      <span>🅿️ Có chỗ đỗ xe lớn</span>
                    </div>
                  </div>
                </div>

                {/* Item 3: Tắm biển Bãi Sao & SUP (Photo Feature Card) */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🏖️
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border-2 border-emerald-500/20 overflow-hidden shadow-sm">
                    {/* Image Banner */}
                    <div className="relative h-44 w-full bg-gray-100">
                      <Image
                        src="/island-hero.png"
                        alt="Bãi Sao"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                          Điểm nhấn ngày 1
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-md">
                          ⭐ 4.8/5
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <span className="text-xs font-bold text-emerald-300 block">14:00 - 17:30</span>
                          <h4 className="font-black text-base leading-tight">
                            Tắm Biển Bãi Sao &amp; Chèo SUP Nước Trong Vắt
                          </h4>
                        </div>
                        <span className="text-sm font-black text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl">
                          650.000 đ
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        Bãi Sao nổi tiếng với bờ cát trắng mịn như kem và sóng biển êm dịu, cực kỳ an toàn cho gia đình. Gói đã bao gồm 2 ván SUP, áo phao tiêu chuẩn và ghế nằm dù mát dưới rặng dừa.
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span>✓</span> <span>Đã đặt trước ghế nằm Paradiso</span>
                        </span>
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#087f78] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>🗺️</span> <span>Mở Google Maps chỉ đường</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 4: Sunset Sanato */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    👑
                  </div>
                  <div className="flex-1 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">17:30 - 19:00</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                          Check-in Nghệ Thuật
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        400.000 đ <span className="text-[10px] font-normal text-gray-400">/ 4 vé cổng</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Ngắm Hoàng Hôn Sunset Sanato Beach Club
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      Thánh địa sống ảo với các tác phẩm điêu khắc độc bản trên mặt biển: Đàn voi chân dài, tượng đầu người chia đôi, cổng trời hướng hoàng hôn đỏ rực.
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                      <span className="text-amber-700 font-medium">🕒 Thời điểm đẹp nhất: 17:45 - 18:10</span>
                      <button className="text-[#087f78] font-bold hover:underline">Đổi điểm ngắm khác</button>
                    </div>
                  </div>
                </div>

                {/* Item 5: Chợ Đêm Dương Đông */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    🍸
                  </div>
                  <div className="flex-1 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">19:30 - 21:30</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          Chợ đêm ẩm thực
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        1.200.000 đ <span className="text-[10px] font-normal text-gray-400">/ Bữa tối no say</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      Dạo Chợ Đêm Dương Đông &amp; Thưởng Thức Hải Sản Tươi Sống
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      Thưởng thức ghẹ Hàm Ninh hấp bia, nhum biển nướng mỡ hành trứng cút, mực chớp hấp gừng, kèm kem cuộn Thái Lan tráng miệng.
                    </p>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs flex items-center justify-between gap-2">
                      <div className="text-gray-600">
                        🍴 <strong>Gợi ý nhà hàng uy tín:</strong> Hải Sản Xin Chào hoặc Cát Biển (đã kiểm định niêm yết giá)
                      </div>
                      <span className="text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded">
                        100% Không chặt chém
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG TỔNG KẾT CHI PHÍ MINH BẠCH TOÀN TOUR */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-black text-lg text-gray-900">
                    Bảng Tổng Kết Chi Phí Minh Bạch Toàn Tour
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    GOPU cam kết 100% không phát sinh phụ phí ẩn tại điểm đến
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#087f78] border border-emerald-200 self-start sm:self-auto">
                  Tình trạng ngân sách: 98.6% (An toàn)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-semibold">
                  <span>Đã dùng: <strong className="text-[#087f78]">11.840.000 đ</strong></span>
                  <span>Hạn mức ban đầu: 12.000.000 đ (Còn dư 160.000 đ)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#087f78] rounded-full w-[98.6%]" />
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Hạng mục dịch vụ</th>
                      <th className="py-3 px-2">Chi tiết bao gồm</th>
                      <th className="py-3 px-2 text-center">Tỷ trọng</th>
                      <th className="py-3 px-2 text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    <tr>
                      <td className="py-3.5 px-2 flex items-center gap-2">
                        <span>🏨</span>
                        <span className="font-bold text-gray-900">Lưu trú (Khách sạn)</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500">
                        2 phòng Deluxe City View 2 đêm tại Dương Đông (gồm buffet sáng)
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-gray-500">32.1%</td>
                      <td className="py-3.5 px-2 text-right font-bold text-gray-900">3.800.000 đ</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-2 flex items-center gap-2">
                        <span>🚤</span>
                        <span className="font-bold text-gray-900">Tour Cano &amp; Trải nghiệm</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500">
                        Cano ghép 4 đảo An Thới, flycam chụp hình, sup, vé Sunset Sanato
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-gray-500">27.0%</td>
                      <td className="py-3.5 px-2 text-right font-bold text-gray-900">3.200.000 đ</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-2 flex items-center gap-2">
                        <span>🦞</span>
                        <span className="font-bold text-gray-900">Ẩm thực &amp; Hải sản</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500">
                        3 bữa trưa, 2 bữa tối hải sản chợ đêm &amp; ẩm thực địa phương
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-gray-500">29.1%</td>
                      <td className="py-3.5 px-2 text-right font-bold text-gray-900">3.450.000 đ</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-2 flex items-center gap-2">
                        <span>🚗</span>
                        <span className="font-bold text-gray-900">Xe đưa đón riêng 7 chỗ</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500">
                        Đón tiễn sân bay + Xe du lịch trọn ngày Nam Đảo
                      </td>
                      <td className="py-3.5 px-2 text-center font-bold text-gray-500">11.8%</td>
                      <td className="py-3.5 px-2 text-right font-bold text-gray-900">1.390.000 đ</td>
                    </tr>
                    <tr className="bg-emerald-50/60 font-black text-sm">
                      <td colSpan={2} className="py-4 px-2 text-[#087f78]">
                        TỔNG CHI PHÍ TRỌN GÓI (4 KHÁCH)
                      </td>
                      <td className="py-4 px-2 text-center text-gray-500 font-bold">100.0%</td>
                      <td className="py-4 px-2 text-right text-lg text-[#087f78]">
                        11.840.000 đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Guarantee Box & Booking Button */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <strong className="text-gray-900 block">Cam kết giá chuẩn bản xứ</strong>
                    <span>Nếu có điểm nào cao hơn giá công bố tại đảo, GOPU hoàn tiền chênh lệch gấp đôi.</span>
                  </div>
                </div>

                <button
                  onClick={onBookFullTour}
                  className="bg-[#087f78] hover:bg-[#066761] text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-teal-950/10 transition-all transform active:scale-95 whitespace-nowrap"
                >
                  Xác nhận &amp; Giữ chỗ ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

