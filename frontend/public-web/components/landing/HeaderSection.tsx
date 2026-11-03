'use client';

import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import { BookmarkSimple, UserCircle, List, X, Sparkle } from '@phosphor-icons/react';
import { assistantCopy } from '../../lib/i18n';

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
  const toast = useToast();

  const navItems = [
    { id: 'home', labelVi: 'Trang chủ', labelEn: 'Home' },
    { id: 'services', labelVi: 'Dịch vụ & đánh giá', labelEn: 'Services & Reviews' },
    { id: 'itinerary', labelVi: 'Lập kế hoạch GOPU AI', labelEn: 'GOPU AI Planner',  },
    { id: 'requests', labelVi: 'Yêu cầu mẫu', labelEn: 'Sample Requests' },
    { id: 'price-table', labelVi: 'Bảng giá', labelEn: 'Price Standard' },
  ];

  return (
    <>
      {/* 1. Top Ticker Bar — deliberately OUTSIDE the sticky header: it is a
          one-time notice, so pinning it would cost 30px of every scroll. */}
      <div className="bg-[#0b2b2b] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-emerald-300 font-semibold uppercase text-xs tracking-wider flex-shrink-0">
              {lang === 'vi' ? 'GOPU Phú Quốc:' : 'GOPU Phu Quoc:'}
            </span>
            <span className="text-gray-200 truncate">
              {lang === 'vi'
                ? 'Dịch vụ minh họa; kiểm tra thời tiết và hoạt động trước chuyến đi.'
                : 'Sample services; check weather and activity before you travel.'}
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-4 text-xs text-gray-300 flex-shrink-0">
            <span>{lang === 'vi' ? 'Dữ liệu dịch vụ minh họa' : 'Illustrative service data'}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-[0_2px_14px_rgba(16,59,59,0.06)] transition-all">

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Sub-tag */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 text-left focus:outline-none group shrink-0"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-[#087f78] leading-none">
                GOPU<span className="text-emerald-500 font-bold text-xl">.AI</span>
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {assistantCopy[lang].headerStatus}
              </span>
            </div>
            <p className="hidden sm:block text-xs uppercase font-bold tracking-wider text-gray-500 mt-0.5">
              Go Phu Quoc, Go Paradise!
            </p>
          </div>
        </button>

        {/* Right Tools */}
        <div className="hidden lg:flex shrink-0 items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
            <button
              onClick={() => onToggleLang('vi')}
              className={`min-h-11 px-3 rounded-[10px] transition-colors ${
                lang === 'vi' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`min-h-11 px-3 rounded-[10px] transition-colors ${
                lang === 'en' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Saved Itineraries Button */}
          <button
            onClick={() => onSelectTab('itinerary')}
            className="shrink-0 text-xs font-bold text-gray-600 hover:text-[#087f78] bg-gray-50 hover:bg-emerald-50 min-h-11 px-2.5 py-1.5 rounded-xl border border-gray-200 transition-colors flex items-center gap-1 whitespace-nowrap"
            aria-label={lang === 'vi' ? 'Xem lịch trình đã lưu' : 'View saved itineraries'}
          >
            <BookmarkSimple size={16} aria-hidden="true" /><span>{lang === 'vi' ? 'Lịch trình đã lưu' : 'Saved itineraries'}</span>
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={() =>
              toast(lang === 'vi' ? 'Tài khoản GOPU sẽ khả dụng khi bật đăng nhập.' : 'GOPU accounts arrive with sign-in.')
            }
            aria-label={lang === 'vi' ? 'Tài khoản GOPU' : 'GOPU account'}
            className="min-h-11 px-3 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-emerald-400 transition-all flex-shrink-0"
          >
            <UserCircle size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center bg-gray-100 p-0.5 rounded-[10px] text-xs font-bold mr-1">
            <button
              onClick={() => onToggleLang('vi')}
              className={`min-h-11 min-w-9 min-[360px]:min-w-11 px-2.5 rounded-[10px] ${lang === 'vi' ? 'bg-white text-[#087f78]' : 'text-gray-500'}`}
            >
              VI
            </button>
            <button
              onClick={() => onToggleLang('en')}
              className={`min-h-11 min-w-9 min-[360px]:min-w-11 px-2.5 rounded-[10px] ${lang === 'en' ? 'bg-white text-[#087f78]' : 'text-gray-500'}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-11 min-h-11 p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
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
                {item.id === 'itinerary' && <Sparkle size={16} aria-hidden="true" />}<span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
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
    </>
  );
}
