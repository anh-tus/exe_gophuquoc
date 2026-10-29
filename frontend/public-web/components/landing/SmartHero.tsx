'use client';

import React, { useState } from 'react';
import { PROMPT_CHIPS } from '../../data/landing-data';

interface SmartHeroProps {
  onPlanTrip: (prompt: string) => void;
  lang: 'vi' | 'en';
}

export default function SmartHero({ onPlanTrip, lang }: SmartHeroProps) {
  const [prompt, setPrompt] = useState(
    'Lên plan 3N2Đ cho gia đình 4 người, ngân sách 15 triệu, thích khách sạn 3 sao & ngắm hoàng hôn'
  );
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setPrompt('Lên lịch trình 4 ngày 3 đêm cho cặp đôi, thích lặn ngắm san hô và ẩm thực');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPlanTrip(prompt);
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-200/25 via-emerald-100/30 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#087f78] text-xs font-bold tracking-wider uppercase mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#087f78]" />
          <span>SMART CONCIERGE & TOURISM ENGINE</span>
        </div>

        {/* Subtitle brand */}
        <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
          GOPU.AI — Trợ lý thông minh &amp; nền tảng du lịch Đảo Ngọc số 1
        </p>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.2] max-w-4xl mx-auto mb-6">
          {lang === 'vi' ? (
            <>
              Tối ưu hóa kỳ nghỉ Đảo Ngọc với công nghệ AI:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087f78] to-teal-500">
                Lập kế hoạch cá nhân hóa
              </span>
              , cập nhật biển/thời tiết thời gian thực và dịch vụ bản địa minh bạch giá.
            </>
          ) : (
            <>
              Optimize your Island Vacation with AI:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087f78] to-teal-500">
                Personalized Itineraries
              </span>
              , real-time marine weather, and verified transparent local services.
            </>
          )}
        </h1>

        {/* AI Prompt Box Card */}
        <div className="mt-8 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-teal-950/5 border border-emerald-100 p-4 sm:p-6 text-left">
          <form onSubmit={handleSubmit}>
            {/* Input Row */}
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-gray-50/90 rounded-xl p-2 border border-gray-200 focus-within:border-[#087f78] focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <div className="flex items-center gap-2 flex-1 px-2.5">
                <span className="text-xl text-[#087f78] flex-shrink-0">✨</span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    lang === 'vi'
                      ? 'Nhập yêu cầu: Số ngày, số người, ngân sách, sở thích...'
                      : 'Enter request: Days, travelers, budget, interests...'
                  }
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title="Nhập bằng giọng nói"
                  className={`p-2.5 rounded-lg border text-sm transition-all ${
                    isListening
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  🎤
                </button>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="bg-[#087f78] hover:bg-[#066761] text-white font-bold text-sm sm:text-base px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{lang === 'vi' ? 'Lập plan AI ngay!' : 'Generate Plan!'}</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>

            {/* Parameter Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-400">📅</span>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Ngày đi</div>
                  <div className="font-semibold text-gray-700">15 - 17 Th05, 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-400">👥</span>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Số lượng</div>
                  <div className="font-semibold text-gray-700">4 người (2 lớn, 2 bé)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-400">💰</span>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Ngân sách</div>
                  <div className="font-semibold text-[#087f78]">15.000.000đ</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50/80 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-400">🏖️</span>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Sở thích</div>
                  <div className="font-semibold text-gray-700">Nghỉ dưỡng &amp; Biển</div>
                </div>
              </div>
            </div>
          </form>

          {/* Quick Prompt Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
              {lang === 'vi' ? 'Gợi ý nhanh:' : 'Quick ideas:'}
            </span>
            {PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(chip);
                  onPlanTrip(chip);
                }}
                className="text-xs bg-emerald-50/80 hover:bg-emerald-100 text-[#087f78] font-semibold px-3 py-1.5 rounded-full border border-emerald-100/80 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

