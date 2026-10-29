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
    { id: 'itinerary', labelVi: 'Kế hoạch hành trình', labelEn: 'AI Itinerary' },
    { id: 'services', labelVi: 'Dịch vụ đảo', labelEn: 'Island Services' },
    { id: 'price-table', labelVi: 'Bản tra giá chuẩn', labelEn: 'Price Standard' },
    { id: 'weather', labelVi: 'Cảnh báo biển & thời tiết', labelEn: 'Marine & Weather' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 transition-all">
      {/* 1. Top Ticker Bar */}
      <div className="bg-[#0b2b2b] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-emerald-300 font-semibold uppercase text-[11px] tracking-wider">
              {lang === 'vi' ? 'Thông báo du lịch:' : 'Travel Notice:'}
            </span>
            <span className="text-gray-200">
              {lang === 'vi'
                ? 'Thời tiết Phú Quốc hôm nay rất đẹp, biển êm, các tuyến cano Nam Đảo hoạt động an toàn.'
                : 'Phu Quoc weather today is clear with calm seas; all South Island boat tours operate normally.'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-300 flex-shrink-0">
            <span>{lang === 'vi' ? 'Trạm An Thới: Sóng 0.4m' : 'An Thoi: Wave 0.4m'}</span>
            <span className="text-emerald-400 font-medium">{lang === 'vi' ? '● Tàu chạy 100%' : '● 100% Operational'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex-shrink-0">
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
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mt-0.5">
              Go Phu Quoc, Go Paradise!
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/70 shadow-inner">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#087f78] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#087f78] hover:bg-white/80'
                }`}
              >
                {lang === 'vi' ? item.labelVi : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Language, CTA) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              onClick={() => onToggleLang('vi')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'vi' ? 'bg-white text-[#087f78] shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'en' ? 'bg-white text-[#087f78] shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onSelectTab('itinerary')}
            className="bg-[#087f78] hover:bg-[#066761] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
          >
            <span>{lang === 'vi' ? 'Lập plan AI ngay' : 'Plan with AI'}</span>
            <span aria-hidden="true">✨</span>
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
                className={`text-left px-4 py-3 rounded-xl text-sm font-semibold ${
                  currentTab === item.id
                    ? 'bg-emerald-50 text-[#087f78]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {lang === 'vi' ? item.labelVi : item.labelEn}
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

