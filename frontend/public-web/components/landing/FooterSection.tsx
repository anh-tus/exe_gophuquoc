'use client';

import React from 'react';
import Image from 'next/image';

export default function FooterSection({ lang }: { lang: 'vi' | 'en' }) {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
          {/* Column 1: Brand & Office (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-100 flex-shrink-0">
                <Image
                  src="/brand/gopu-logo.png"
                  alt="GOPU Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black text-[#087f78]">
                  GOPU<span className="text-emerald-500 font-bold text-base">.AI</span>
                </span>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Go Phu Quoc, Go Paradise!
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {lang === 'vi'
                ? 'Hệ sinh thái du lịch bản địa Phú Quốc ứng dụng công nghệ AI tiên tiến, kết nối khách du lịch và các đối tác tài xế, tàu cano bản địa uy tín nhất.'
                : 'Advanced AI-powered local travel platform connecting travelers with verified native drivers and tour operators across Phu Quoc Island.'}
            </p>

            <div className="text-xs text-gray-500 space-y-1 pt-1">
              <p>📍 Văn phòng: Đường Trần Hưng Đạo, P. Dương Đông, TP. Phú Quốc</p>
              <p>🏛️ Giấy phép ĐKKD: 1702xxxxxx - Sở Du Lịch Kiên Giang</p>
            </div>
          </div>

          {/* Column 2: Dịch vụ VIP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {lang === 'vi' ? 'DỊCH VỤ ĐẶC SẮC' : 'FEATURED SERVICES'}
            </h4>
            <ul className="text-xs space-y-2.5 text-gray-600">
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Tour cano VIP 4 đảo &amp; Lặn san hô
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Xe đưa đón sân bay Phú Quốc (Xe riêng)
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Thuê xe máy tự lái giao tận khách sạn
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Trải nghiệm câu mực đêm &amp; Ngắm hoàng hôn
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Vé cáp treo Hòn Thơm &amp; Sun World
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ & An toàn (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {lang === 'vi' ? 'HỖ TRỢ & AN TOÀN' : 'SUPPORT & TRUST'}
            </h4>
            <ul className="text-xs space-y-2.5 text-gray-600">
              <li>
                <a href="#price-table" className="hover:text-[#087f78] transition-colors">
                  Bảng giá chuẩn (Chống chặt chém)
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Cảnh báo biển &amp; thời tiết
                </a>
              </li>
              <li>
                <a href="#ai-planner" className="hover:text-[#087f78] transition-colors">
                  Chính sách hủy hoàn &amp; bảo hiểm
                </a>
              </li>
              <li>
                <a href="#services-ecosystem" className="hover:text-[#087f78] transition-colors">
                  Điều khoản dịch vụ &amp; bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hotline Cứu Hộ 24/7 (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {lang === 'vi' ? 'HOTLINE KHẨN CẤP 24/7' : 'EMERGENCY HOTLINE 24/7'}
            </h4>

            {/* Hotline Box */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80">
              <span className="text-[11px] text-gray-500 font-medium block">
                {lang === 'vi' ? 'Tổng đài cứu trợ sự cố du lịch:' : 'Emergency Tourism Assistance:'}
              </span>
              <div className="text-2xl font-black text-[#087f78] mt-1 tracking-tight">
                1900 88 PPPQ
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                {lang === 'vi'
                  ? 'Trực tiếp hỗ trợ sự cố trễ cano, thời tiết xấu hoặc cứu hộ khẩn cấp trên toàn đảo Phú Quốc.'
                  : 'On-island team ready to assist with boat schedules, weather alerts and emergency rescue.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 GOPU.AI. All rights reserved. Đồ án EXE Phú Quốc Local Companion.</p>
          <div className="flex items-center gap-6">
            <span>Bảo mật thông tin</span>
            <span>Điều khoản sử dụng</span>
            <span>Tiêu chuẩn dịch vụ đảo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

