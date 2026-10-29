'use client';

import React, { useEffect, useState } from 'react';

interface WeatherData {
  temp: number | null;
  windSpeed: number | null;
  waveHeight: number | null;
  sunsetTime: string;
}

export default function LiveWeatherStrip({ lang }: { lang: 'vi' | 'en' }) {
  const [data, setData] = useState<WeatherData>({
    temp: 29.4,
    windSpeed: 8.5,
    waveHeight: 0.4,
    sunsetTime: '17:48',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMarineData = async () => {
      try {
        setLoading(true);
        const [weatherRes, marineRes] = await Promise.all([
          fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=10.22&longitude=103.96&current=temperature_2m,wind_speed_10m&daily=sunset&timezone=Asia%2FBangkok'
          ),
          fetch(
            'https://marine-api.open-meteo.com/v1/marine?latitude=10.03&longitude=104.02&current=wave_height&timezone=Asia%2FBangkok'
          ),
        ]);

        if (weatherRes.ok && marineRes.ok) {
          const wJson = await weatherRes.json();
          const mJson = await marineRes.json();

          if (active) {
            const tempVal = wJson.current?.temperature_2m ?? 29;
            const windVal = wJson.current?.wind_speed_10m ?? 8;
            const waveVal = mJson.current?.wave_height ?? 0.4;
            const sunsetRaw = wJson.daily?.sunset?.[0];
            const sunsetFormatted = sunsetRaw ? sunsetRaw.slice(11, 16) : '17:48';

            setData({
              temp: Math.round(tempVal * 10) / 10,
              windSpeed: Math.round(windVal * 10) / 10,
              waveHeight: Math.round(waveVal * 10) / 10,
              sunsetTime: sunsetFormatted,
            });
          }
        }
      } catch (err) {
        // Fallback already in place
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMarineData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-8 bg-[#f5fbf9] border-y border-emerald-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>{lang === 'vi' ? 'Cảnh Báo Biển & Thời Tiết Thời Gian Thực' : 'Real-time Marine & Weather Alerts'}</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#087f78] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              {lang === 'vi' ? 'Cập nhật trực tiếp' : 'Live Data'}
            </span>
          </div>

          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-500 hover:text-[#087f78] transition-colors"
          >
            {lang === 'vi' ? 'Trạm Trắc Quan Nam Đảo & Cảng An Thới (Open-Meteo) ↗' : 'An Thoi Station (Open-Meteo) ↗'}
          </a>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Độ cao sóng */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'vi' ? 'Độ cao sóng biển (Nam Đảo)' : 'Wave Height (South)'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {lang === 'vi' ? 'Biển êm / Rất an toàn' : 'Calm / Safe'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-[#087f78]">
                {data.waveHeight ?? 0.4}m
              </span>
              <span className="text-xs text-gray-400 font-medium">Sóng cấp 1 • Gió êm</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {lang === 'vi'
                ? 'Tàu cano & tàu câu mực hoạt động bình thường tại vịnh Thái Lan & quần đảo An Thới.'
                : 'Speedboats and squid fishing tours operate normally in the Gulf of Thailand.'}
            </p>
          </div>

          {/* Card 2: Nhiệt độ khí quyển */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'vi' ? 'Dự báo & Khí quyển' : 'Atmosphere Forecast'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                {lang === 'vi' ? 'Nắng đẹp / Mây nhẹ' : 'Sunny / Light clouds'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-[#087f78]">
                {data.temp ?? 29}°C
              </span>
              <span className="text-xs text-gray-400 font-medium">Tầm nhìn &gt; 10km</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {lang === 'vi'
                ? 'Tầm nhìn xa trên 10km, chỉ số UV 8. Rất thích hợp các hoạt động ngoài trời, tắm biển.'
                : 'Visibility exceeds 10km, UV index 8. Perfect for swimming and outdoor activities.'}
            </p>
          </div>

          {/* Card 3: Khung giờ hoàng hôn */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {lang === 'vi' ? 'Giờ vàng hoàng hôn' : 'Golden Sunset Hour'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {lang === 'vi' ? 'Khuyên chụp: Rất đẹp' : 'Photo Worthy'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-600">
                {data.sunsetTime}
              </span>
              <span className="text-xs text-gray-400 font-medium">Đẹp nhất 17:20 - 18:05</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {lang === 'vi'
                ? 'Khung giờ vàng hoàng hôn đẹp nhất tại Sunset Sanato, Bãi Trường & Chuồn Chuồn Bistro.'
                : 'Best vantage points at Sunset Sanato, Bai Truong beach, and Chuon Chuon Bistro.'}
            </p>
          </div>

          {/* Card 4: Khuyến nghị an toàn */}
          <div className="bg-gradient-to-br from-emerald-500 to-[#087f78] rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                {lang === 'vi' ? 'Khuyến nghị du lịch' : 'Travel Advice'}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white">
                VIP Safe
              </span>
            </div>
            <div className="text-lg font-bold mb-1.5 flex items-center gap-1.5">
              <span>🤿</span>
              <span>{lang === 'vi' ? 'Phù hợp lặn san hô' : 'Ideal for Coral Diving'}</span>
            </div>
            <p className="text-xs text-emerald-50 leading-relaxed">
              {lang === 'vi'
                ? 'Gió nhẹ Tây Nam cấp 2. Nước biển trong vắt tại Hòn Gầm Ghì, Hòn Mây Rút, hoàn hảo cho tour cano 4 đảo.'
                : 'Light southwest winds. Clear water around southern islets, perfect for snorkeling.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

