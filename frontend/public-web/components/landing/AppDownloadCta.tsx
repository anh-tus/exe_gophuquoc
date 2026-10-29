'use client';

import React from 'react';

export default function AppDownloadCta({ lang }: { lang: 'vi' | 'en' }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#07302d] via-[#09413d] to-[#07302d] p-8 sm:p-12 lg:p-14 text-white overflow-hidden shadow-xl">
          {/* Subtle Decorative Shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full mb-4 border border-white/15">
                {lang === 'vi' ? 'TIỆN ÍCH DU LỊCH TRÊN ĐIỆN THOẠI' : 'MOBILE TRAVEL COMPANION'}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-3">
                {lang === 'vi'
                  ? 'Mang Cả Đảo Ngọc Phú Quốc Vào Túi Áo Bạn'
                  : 'Carry All of Phu Quoc Island in Your Pocket'}
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                {lang === 'vi'
                  ? 'Nhận thông báo triều cường thời gian thực, theo dõi vị trí cano & tài xế đón, đồng thời lưu trữ trọn bộ vé điện tử QR không cần in giấy.'
                  : 'Get live tide and marine alerts, track your driver & boat in real time, and store all your digital QR vouchers in one spot.'}
              </p>
            </div>

            {/* Action Buttons & Zalo QR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-shrink-0">
              {/* Zalo Mini App Button */}
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0068ff] hover:bg-[#0057d6] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span className="text-lg">💬</span>
                <span>{lang === 'vi' ? 'Mở trên Zalo Mini App' : 'Open in Zalo'}</span>
              </a>

              {/* App Store / Google Play Button */}
              <button
                type="button"
                onClick={() => alert(lang === 'vi' ? 'Ứng dụng di động đang trong giai đoạn phát hành thử nghiệm!' : 'Mobile app coming soon!')}
                className="bg-white/15 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>📱</span>
                <span>App Store / Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

