'use client';

import React from 'react';
import { ECOSYSTEM_SERVICES, EcosystemService } from '../../data/landing-data';

interface ServiceEcosystemProps {
  onSelectService: (service: EcosystemService) => void;
  lang: 'vi' | 'en';
}

export default function ServiceEcosystem({ onSelectService, lang }: ServiceEcosystemProps) {
  // Mapping icons to visually rich emoji or badges
  const iconMap: Record<string, string> = {
    boat: '🚤',
    car: '🚗',
    motorcycle: '🛵',
    anchor: '⚓',
    van: '🚐',
    fish: '🎣',
    map: '🚡',
    compass: '🎡',
    wave: '🏄',
    utensils: '🦞',
  };

  return (
    <section id="services-ecosystem" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#087f78] tracking-widest uppercase mb-2 block">
              {lang === 'vi' ? 'HẠ TẦNG DU LỊCH ĐỊA PHƯƠNG' : 'LOCAL TRAVEL INFRASTRUCTURE'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {lang === 'vi'
                ? 'Hệ Sinh Thái Di Chuyển & Trải Nghiệm Đảo'
                : 'Island Mobility & Curated Experiences'}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
              {lang === 'vi'
                ? 'Dịch vụ liên kết trực tiếp với tài xế & thuyền trưởng địa phương được GOPU xác minh, tiêu chuẩn VIP.'
                : 'Directly linked with verified local drivers, boat captains and service providers.'}
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('price-table');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-bold text-[#087f78] hover:text-[#066761] flex items-center gap-1.5 flex-shrink-0 group"
          >
            <span>{lang === 'vi' ? 'Xem bảng giá chuẩn toàn đảo' : 'View Island Price Standards'}</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* 10 Services Grid (5 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {ECOSYSTEM_SERVICES.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectService(item)}
              className="group cursor-pointer bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-[#087f78] hover:shadow-lg hover:shadow-teal-950/5 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Tag & Icon */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-50/80 group-hover:bg-emerald-100 transition-colors">
                    {iconMap[item.iconType] || '🌴'}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-gray-900 group-hover:text-[#087f78] transition-colors mb-1.5 flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-gray-300 group-hover:text-[#087f78] text-xs transition-colors">
                    ↗
                  </span>
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Price */}
              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                <span className="text-[11px] text-gray-400 font-medium">
                  {lang === 'vi' ? 'Giá minh bạch' : 'Price'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#087f78]">
                  {item.priceLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

