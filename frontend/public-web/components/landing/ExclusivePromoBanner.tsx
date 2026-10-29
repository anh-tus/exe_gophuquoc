'use client';

import React from 'react';

interface ExclusivePromoBannerProps {
  onBookPromo: () => void;
  lang: 'vi' | 'en';
}

export default function ExclusivePromoBanner({ onBookPromo, lang }: ExclusivePromoBannerProps) {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[340px] flex items-center bg-gradient-to-r from-[#073c38] via-[#0b4d47]/90 to-transparent">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center -z-10 opacity-70 scale-105 transition-transform duration-700 hover:scale-100"
            style={{
              backgroundImage: `url('/island-hero.png')`,
              backgroundPosition: 'center 40%',
            }}
          />

          {/* Left Decorative Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#052825] via-[#052825]/85 to-transparent -z-10" />

          {/* Content Box */}
          <div className="relative z-10 max-w-2xl p-6 sm:p-10 lg:p-14 text-white">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span>💎</span>
              <span>
                {lang === 'vi'
                  ? 'CHƯƠNG TRÌNH ĐỘC QUYỀN • ĐỐI TÁC GOPU & PQ'
                  : 'EXCLUSIVE CAMPAIGN • GOPU & PQ TOURISM'}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-4 text-white">
              {lang === 'vi' ? (
                <>
                  Trải nghiệm <span className="text-emerald-300">KHÁM PHÁ</span> trọn vẹn vẻ đẹp Phú Quốc
                </>
              ) : (
                <>
                  Experience the <span className="text-emerald-300">COMPLETE</span> Beauty of Phu Quoc
                </>
              )}
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6 font-light">
              {lang === 'vi'
                ? 'Gói du ngoạn 4 đảo cao cấp bằng cano SB kèm suất ăn trưa hải sản tươi tại Hòn Mây Rút, lặn ngắm san hô Hòn Gầm Ghì, quay phim flycam & chụp ảnh SUP miễn phí.'
                : 'Premium 4-island speedboat tour including fresh seafood lunch on May Rut Islet, coral snorkeling at Gam Ghi, plus free SUP photography and flycam video footage.'}
            </p>

            {/* CTA & Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={onBookPromo}
                className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-emerald-950/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>{lang === 'vi' ? 'Đặt ngay nhận ưu đãi 15%' : 'Book Now for 15% Off'}</span>
                <span>↗</span>
              </button>

              <span className="text-xs text-emerald-200/90 font-medium italic">
                {lang === 'vi' ? '⚡ Số lượng suất ưu đãi có hạn mỗi ngày' : '⚡ Limited promotional slots daily'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

