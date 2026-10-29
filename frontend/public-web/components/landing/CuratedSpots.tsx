'use client';

import React from 'react';
import Image from 'next/image';
import { CURATED_SPOTS, CuratedSpot } from '../../data/landing-data';

interface CuratedSpotsProps {
  onSelectSpot: (spot: CuratedSpot) => void;
  lang: 'vi' | 'en';
}

export default function CuratedSpots({ onSelectSpot, lang }: CuratedSpotsProps) {
  return (
    <section className="py-14 lg:py-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🍲</span>
              <span className="text-xs font-bold text-[#087f78] tracking-widest uppercase">
                {lang === 'vi' ? 'TUYỂN TẬP ĐẶC SẮC' : 'HANDPICKED EXPERIENCES'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {lang === 'vi' ? 'Trải Nghiệm Không Thể Bỏ Lỡ' : 'Unmissable Island Highlights'}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
              {lang === 'vi'
                ? 'Được tuyển chọn & kiểm chứng chất lượng bởi cộng đồng du lịch Phú Quốc và hàng ngàn đánh giá thực tế.'
                : 'Selected and verified by the local travel community with authentic customer reviews.'}
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('services-ecosystem');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-bold text-[#087f78] hover:text-[#066761] flex items-center gap-1.5 flex-shrink-0 group"
          >
            <span>{lang === 'vi' ? 'Xem tất cả 48 địa điểm' : 'Browse All 48 Spots'}</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_SPOTS.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-[#087f78] hover:shadow-xl hover:shadow-teal-950/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={spot.imageUrl}
                    alt={spot.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-900 backdrop-blur-md shadow-sm">
                      {spot.category}
                    </span>
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                    <span className="text-amber-400">★</span>
                    <span>{spot.rating}</span>
                    <span className="text-gray-300 text-[10px] font-normal">({spot.reviewsCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-[#087f78] transition-colors line-clamp-1">
                      {spot.title}
                    </h3>
                  </div>

                  {/* Area and Tag */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span>📍 {spot.area}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{spot.tag}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    {lang === 'vi' ? 'Mức giá tham khảo' : 'Reference price'}
                  </span>
                  <span className="text-sm font-bold text-[#087f78]">
                    {spot.priceRange}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#087f78] group-hover:underline flex items-center gap-1">
                  {lang === 'vi' ? 'Xem chi tiết' : 'Details'} <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

