'use client';

import React from 'react';
import Image from 'next/image';
import Icon from '../ui/Icon';

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
                <span className="text-xl font-extrabold text-[#087f78]">
                  GOPU<span className="text-emerald-500 font-bold text-base">.AI</span>
                </span>
                <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                  Go Phu Quoc, Go Paradise!
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {lang === 'vi'
                ? 'Hệ sinh thái du lịch bản địa Phú Quốc ứng dụng công nghệ AI tiên tiến, kết nối khách du lịch và các đối tác tài xế, tàu cano bản địa uy tín nhất.'
                : 'Advanced AI-powered local travel platform connecting travelers with verified native drivers and tour operators across Phu Quoc Island.'}
            </p>

            <div className="text-sm text-gray-500 space-y-1.5 pt-1">
              <p className="flex items-start gap-2">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-[#087f78]" />
                <span>Văn phòng: Đường Trần Hưng Đạo, P. Dương Đông, TP. Phú Quốc</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon name="doc" className="mt-0.5 h-4 w-4 shrink-0 text-[#087f78]" />
                <span>Đồ án học thuật (EXE) — dịch vụ và giá hiển thị là dữ liệu minh hoạ.</span>
              </p>
            </div>
          </div>

          {/* Column 2: Dịch vụ VIP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {lang === 'vi' ? 'DỊCH VỤ ĐẶC SẮC' : 'FEATURED SERVICES'}
            </h4>
            <ul className="text-sm space-y-0.5 text-gray-600">
              <li>
                <a href="#services" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Tour cano VIP 4 đảo &amp; Lặn san hô
                </a>
              </li>
              <li>
                <a href="#services" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Xe đưa đón sân bay Phú Quốc (Xe riêng)
                </a>
              </li>
              <li>
                <a href="#services" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Thuê xe máy tự lái giao tận khách sạn
                </a>
              </li>
              <li>
                <a href="#services" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Trải nghiệm câu mực đêm &amp; Ngắm hoàng hôn
                </a>
              </li>
              <li>
                <a href="#services" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
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
            <ul className="text-sm space-y-0.5 text-gray-600">
              <li>
                <a href="#price-table" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Bảng giá chuẩn (Chống chặt chém)
                </a>
              </li>
              <li>
                <a href="#weather" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Cảnh báo biển &amp; thời tiết
                </a>
              </li>
              <li>
                <a href="#price-table" className="inline-flex items-center min-h-11 hover:text-[#087f78] transition-colors">
                  Chính sách hủy hoàn &amp; bảo hiểm
                </a>
              </li>
              <li>
                {/* No terms/privacy page exists yet, so this is text rather than a
                    link that would jump somewhere unrelated. */}
                <span className="inline-flex items-center min-h-11">
                  Điều khoản dịch vụ &amp; bảo mật
                </span>
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
              <span className="text-xs text-gray-500 font-medium block">
                {lang === 'vi' ? 'Tổng đài cứu trợ sự cố du lịch:' : 'Emergency Tourism Assistance:'}
              </span>
              <a
                href="tel:19008860"
                className="mt-1 inline-block text-2xl font-extrabold text-[#087f78] tracking-tight hover:underline"
              >
                1900 8860
              </a>
              <span className="block text-xs text-gray-500">
                {lang === 'vi' ? 'Số tổng đài minh hoạ' : 'Sample hotline number'}
              </span>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {lang === 'vi'
                  ? 'Trực tiếp hỗ trợ sự cố trễ cano, thời tiết xấu hoặc cứu hộ khẩn cấp trên toàn đảo Phú Quốc.'
                  : 'On-island team ready to assist with boat schedules, weather alerts and emergency rescue.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
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

