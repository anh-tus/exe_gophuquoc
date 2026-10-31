'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  lang: 'vi' | 'en';
  onToggleLang: (lang: 'vi' | 'en') => void;
}

export default function HeaderSection({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelVi: 'Trang chủ', labelEn: 'Home' },
    { id: 'services', labelVi: 'Dịch vụ & đánh giá', labelEn: 'Services & Reviews' },
    { id: 'itinerary', labelVi: 'Lập kế hoạch GOPU AI', labelEn: 'GOPU AI Planner', hasSparkle: true },
    { id: 'requests', labelVi: 'Yêu cầu mẫu', labelEn: 'Sample Requests' },
    { id: 'price-table', labelVi: 'Bảng giá', labelEn: 'Price Standard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 transition-all">
      {/* 1. Top Ticker Bar */}
      <div className="bg-[#0b2b2b] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-emerald-300 font-semibold uppercase text-[11px] tracking-wider">
              {lang === 'vi' ? 'GOPU Phú Quốc:' : 'GOPU Phu Quoc:'}
            </span>
            <span className="text-gray-200">
              {lang === 'vi'
                ? 'Khám phá dịch vụ và lên lịch trình từ danh mục minh họa; kiểm tra thời tiết và hoạt động trước chuyến đi.'
                : 'Explore sample services and plan your trip; check weather and activity conditions before travelling.'}
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-4 text-[11px] text-gray-300 flex-shrink-0">
            <span>{lang === 'vi' ? 'Dữ liệu dịch vụ minh họa' : 'Illustrative service data'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Sub-tag */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 text-left focus:outline-none group shrink-0"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex-shrink-0">
            <Image
              src="/brand/gopu-logo.png"
              alt="GOPU Logo"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#087f78] leading-none">
                GOPU<span className="text-emerald-500 font-bold text-lg">.AI</span>
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Phú Quốc • Đang hoạt động
              </span>
            </div>
            <p className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">
              Go Phu Quoc, Go Paradise!
            </p>
          </div>
        </button>

        {/* Right Tools */}
        <div className="hidden lg:flex shrink-0 items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px] font-bold">
            <button
              onClick={() => onToggleLang('vi')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'vi' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'en' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Saved Itineraries Button */}
          <button
            onClick={() => onSelectTab('itinerary')}
            className="shrink-0 text-xs font-bold text-gray-600 hover:text-[#087f78] bg-gray-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-gray-200 transition-colors flex items-center gap-1 whitespace-nowrap"
            aria-label={lang === 'vi' ? 'Xem lịch trình đã lưu' : 'View saved itineraries'}
          >
            <span>🔖</span>
            <span>{lang === 'vi' ? 'Lịch trình đã lưu' : 'Saved itineraries'}</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => alert('Thông tin tài khoản GOPU')}
            className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-emerald-400 transition-all flex-shrink-0"
          >
            👤
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center bg-gray-100 p-0.5 rounded text-xs font-bold mr-1">
            <button
              onClick={() => onToggleLang('vi')}
              className={`px-2 py-0.5 rounded ${lang === 'vi' ? 'bg-white text-[#087f78]' : 'text-gray-500'}`}
            >
              VI
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-white text-[#087f78]' : 'text-gray-500'}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200"
            aria-label="Toggle navigation"
          >
            <span className="text-xl leading-none">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block border-t border-gray-100 bg-gray-50/70">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 py-1.5" aria-label={lang === 'vi' ? 'Điều hướng chính' : 'Main navigation'}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#087f78] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#087f78] hover:bg-white'
                }`}
              >
                {item.hasSparkle && <span aria-hidden="true">✨</span>}
                <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  currentTab === item.id
                    ? 'bg-emerald-50 text-[#087f78]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.hasSparkle && <span>✨</span>}
                <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => {
                  onSelectTab('itinerary');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#087f78] text-white py-3 rounded-xl font-bold text-center text-sm shadow-md"
              >
                {lang === 'vi' ? 'Lập Kế Hoạch Chuyến Đi (AI)' : 'Plan Trip with AI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
