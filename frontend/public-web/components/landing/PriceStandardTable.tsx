'use client';

import React from 'react';
import { STANDARD_PRICES, StandardPriceItem } from '../../data/landing-data';

interface PriceStandardTableProps {
  onActionClick: (item: StandardPriceItem) => void;
  lang: 'vi' | 'en';
}

export default function PriceStandardTable({ onActionClick, lang }: PriceStandardTableProps) {
  return (
    <section id="price-table" className="py-14 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚖️</span>
              <span className="text-xs font-bold text-[#087f78] tracking-widest uppercase">
                {lang === 'vi' ? 'MINH BẠCH DỊCH VỤ ĐẢO' : 'PRICE TRANSPARENCY'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {lang === 'vi'
                ? 'Bảng Tra Cứu Giá Chuẩn Đảo Ngọc (Chống Chặt Chém)'
                : 'Standard Price Matrix (Fair Price Guarantee)'}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-3xl">
              {lang === 'vi'
                ? '100% niêm yết theo khung giá chuẩn được khảo sát & giám sát bởi các hiệp hội địa phương để du khách an tâm tuyệt đối.'
                : '100% benchmarked against verified island tourism standards to guarantee fair pricing.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#087f78] border border-emerald-200">
              <span>📅</span>
              <span>{lang === 'vi' ? 'Niêm yết Q2/2026' : 'Verified Q2/2026'}</span>
            </span>
          </div>
        </div>

        {/* Responsive Table for Desktop / Tablet */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6 w-1/4">{lang === 'vi' ? 'Loại Dịch Vụ' : 'Service'}</th>
                <th className="py-4 px-6 w-1/5">{lang === 'vi' ? 'Khung Giá Chuẩn' : 'Standard Rate'}</th>
                <th className="py-4 px-6">{lang === 'vi' ? 'Quy Cách & Lưu Ý Minh Bạch' : 'Specs & Inclusions'}</th>
                <th className="py-4 px-6 w-1/6">{lang === 'vi' ? 'Khu Vực' : 'Area'}</th>
                <th className="py-4 px-6 text-center w-28">{lang === 'vi' ? 'Thao Tác' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {STANDARD_PRICES.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                  {/* Service name & badge */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900 mb-1">{item.serviceName}</div>
                    <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                      {item.categoryBadge}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#087f78]">{item.priceRange}</div>
                    <span className="text-[11px] text-gray-400">Niêm yết cam kết</span>
                  </td>

                  {/* Specs & Notes */}
                  <td className="py-4 px-6 text-xs text-gray-600 leading-relaxed">
                    {item.specNotes}
                  </td>

                  {/* Area */}
                  <td className="py-4 px-6 text-xs font-semibold text-gray-700">
                    📍 {item.area}
                  </td>

                  {/* Button Action */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onActionClick(item)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#087f78] hover:bg-[#066761] text-white shadow-sm transition-all"
                    >
                      {item.actionText}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {STANDARD_PRICES.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-block mb-1">
                    {item.categoryBadge}
                  </span>
                  <h3 className="font-bold text-base text-gray-900">{item.serviceName}</h3>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">📍 {item.area}</span>
              </div>

              <div className="text-sm font-extrabold text-[#087f78] bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                {item.priceRange}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{item.specNotes}</p>

              <button
                onClick={() => onActionClick(item)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#087f78] text-white text-center shadow-sm"
              >
                {item.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

