'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type Lang, type Service, type ServiceCategory, services } from './catalog';
import Icon, { type IconName } from '../components/ui/Icon';
import MiniChatWidget from '../components/landing/MiniChatWidget';
import { useToast } from '../components/ui/Toast';
import type { AssistantReply, ChatMessage } from './api/assistant/logic';

type Props = {
  lang: Lang;
  weather: { temp: number | null; wind: number | null; wave: number | null; time: string } | null;
  weatherState: 'loading' | 'ready' | 'error';
  onExplore: (category?: ServiceCategory, query?: string) => void;
  onSelectService: (service: Service) => void;
  onOpenAssistant: (prompt?: string, messages?: ChatMessage[], choices?: string[]) => void;
  onPlanCreated: (reply: Extract<AssistantReply, { kind: 'itinerary' }>, messages: ChatMessage[]) => void;
};

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';

export default function HomeLanding({
  lang,
  weather,
  weatherState,
  onExplore,
  onSelectService,
  onOpenAssistant,
  onPlanCreated,
}: Props) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'tour' | 'stay' | 'transport'>('all');

  const quickChips = [
    'Tour cano 4 đảo',
    'Sunset Sanato',
    'Hải sản Bãi Trường',
    'Xe riêng sân bay',
    'Bún quậy Kiến Xây',
  ];

  // 1. Danh mục thiết yếu
  const categoriesList = [
    {
      id: 'tour' as ServiceCategory,
      title: 'Tour & Trải nghiệm',
      sub: '8 gói cano & đảo',
      icon: 'boat' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'restaurant' as ServiceCategory,
      title: 'Ẩm thực & Hải sản',
      sub: '18 quán chọn lọc',
      icon: 'utensils' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'stay' as ServiceCategory,
      title: 'Khách sạn & Lưu trú',
      sub: '24 resort & villa',
      icon: 'bed' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'transport' as ServiceCategory,
      title: 'Đặt xe & Thuê xe máy',
      sub: 'Giao xe tận nơi',
      icon: 'car' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'wellness' as ServiceCategory,
      title: 'Spa & Thư giãn',
      sub: 'Liệu trình bấm huyệt',
      icon: 'leaf' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'laundry' as ServiceCategory,
      title: 'Giặt là du lịch',
      sub: 'Lấy trả nhanh 3h',
      icon: 'basket' as IconName,
      color: 'bg-brand-50 text-brand-700',
    },
  ];

  // 2. Ẩm thực tinh tuyển (5 cards)
  const diningCards = [
    {
      id: 'com-nha-phu-quoc',
      title: 'Bữa cơm nhà vị biển đảo',
      location: 'Dương Đông',
      desc: 'Món ăn đậm đà với cá bớp kho tộ, mực hấp gừng và canh chua cá...',
      price: 160000,
      unit: 'phần',
      tag: 'Ẩm thực đảo',
      rating: 4.7,
      reviews: 41,
      image: '/services/restaurant-seafood.jpg',
    },
    {
      id: 'hai-san-bai-truong',
      title: 'Hải sản chiều bên Bãi Trường',
      location: 'Bãi Trường',
      desc: 'Set nướng bờ cát với ghẹ Hàm Ninh, tôm sú nướng muối ớt và...',
      price: 220000,
      unit: 'phần',
      tag: 'View biển ngắm hoàng hôn',
      rating: 4.8,
      reviews: 52,
      image: '/services/restaurant-sunset.jpg',
    },
    {
      id: 'nha-hang-ra-khoi',
      title: 'Nhà hàng hải sản Ra Khơi',
      location: 'Đường 30/4 • Dương Đông',
      desc: 'Hải sản sống bơi tại hồ, niêm yết cân kí minh bạch, chế biến vừa vị...',
      price: 250000,
      unit: 'phần',
      tag: 'Quán uy tín lâu năm',
      rating: 4.9,
      reviews: 180,
      image: '/services/restaurant-seafood.jpg',
    },
    {
      id: 'nha-hang-xin-chao',
      title: 'Nhà hàng Xin Chào',
      location: 'Trần Hưng Đạo • Dương Đông',
      desc: 'Không gian 2 tầng hướng biển, cocktail hoàng hôn độc đáo kết...',
      price: 250000,
      unit: 'phần',
      tag: 'View biển trực diện',
      rating: 4.8,
      reviews: 95,
      image: '/services/restaurant-sunset.jpg',
    },
    {
      id: 'nha-hang-song-xanh',
      title: 'Nhà hàng Sông Xanh',
      location: 'Đường 30/4 • Dương Đông',
      desc: 'Không gian sân vườn thoáng mát bên bờ sông Dương Đông, phục v...',
      price: 220000,
      unit: 'phần',
      tag: 'Thư thái bên sông',
      rating: 4.6,
      reviews: 64,
      image: '/services/restaurant-riverside.jpg',
    },
  ];

  // 3. Khám phá đảo ngọc cards
  const explorationCards = [
    {
      id: 'cano-an-thoi',
      category: 'tour',
      title: 'Cano VIP 4 Đảo: Mây Rút, Gầm Ghì, Móng Tay & Lặn san hô',
      location: 'Quần đảo An Thới',
      tag: 'Bán chạy nhất',
      subtag: '📷 Tặng clip Flycam & Chụp SUP',
      desc: 'Trải nghiệm cano cao tốc êm ái, trang bị kính lặn thở chuyên nghiệp, hướng dẫn viên địa phương chu đáo và đưa đón tận resort.',
      price: 'Giá trọn gói 450.000 đ',
      unit: '/ khách',
      rating: 4.9,
      reviews: 420,
      image: '/services/tour-cano.jpg',
      cta: 'Xem chi tiết →',
    },
    {
      id: 'bien-bai-sao',
      category: 'tour',
      title: 'Một ngày thư thả tại Bãi Sao & Check-in bãi cát trắng mịn',
      location: 'Bãi Sao • Nam Đảo',
      tag: 'Nghỉ dưỡng êm đềm',
      subtag: '🏖️ Bao gồm SUP & Ghế nằm bãi cát',
      desc: 'Khám phá bờ cát trắng mịn như kem, sóng êm ái thích hợp cho gia đình có trẻ nhỏ và người lớn tuổi nghỉ ngơi trọn vẹn.',
      price: 'Giá trọn gói 320.000 đ',
      unit: '/ khách',
      rating: 4.8,
      reviews: 115,
      image: '/island-hero.png',
      cta: 'Xem chi tiết →',
    },
    {
      id: 'xe-san-bay',
      category: 'transport',
      title: 'Xe riêng đón tiễn Sân bay Phú Quốc (Xe 4-7 chỗ sạch sẽ)',
      location: 'Sân bay PQC ⇄ Khách sạn',
      tag: 'Xe riêng 100%',
      subtag: '🚖 Tài xế chờ sẵn khi hạ cánh',
      desc: 'Không lo đợi taxi, giá cố định không phụ phí đêm hay kẹt xe. Tài xế bản địa lịch sự, mở máy lạnh sẵn đón bạn ngay sảnh đến.',
      price: 'Giá cố định 180.000 đ',
      unit: '/ chuyến',
      rating: 4.9,
      reviews: 310,
      image: '/island-transfer.png',
      cta: 'Đặt xe ngay →',
    },
    {
      id: 'seashells-phu-quoc',
      category: 'stay',
      title: 'Seashells Phu Quoc Hotel & Spa',
      location: '01 Võ Thị Sáu',
      tag: '5 Sao • Trung tâm Dương Đông',
      desc: 'Vị trí đắc địa ngay trung tâm, đi bộ ra Chợ Đêm trong 5 phút. Hồ bơi vô cực ngắm hoàng hôn đẹp nhất thị trấn.',
      priceNote: 'Ưu đãi hôm nay từ',
      price: '1.800.000 đ',
      unit: '/ đêm',
      rating: 4.8,
      reviews: 520,
      image: '/services/hotel-seaside.jpg',
      cta: 'Xem phòng →',
    },
    {
      id: 'la-veranda-phu-quoc',
      category: 'stay',
      title: 'La Veranda Resort Phu Quoc – MGallery',
      location: 'Trần Hưng Đạo • Bãi Trường',
      tag: 'Biệt thự biển Pháp cổ điển',
      desc: 'Không gian nghỉ dưỡng hoài niệm thập niên 1920 với khu vườn nhiệt đới xanh mát và bãi biển riêng tư yên tĩnh.',
      priceNote: 'Ưu đãi hôm nay từ',
      price: '3.500.000 đ',
      unit: '/ đêm',
      rating: 4.9,
      reviews: 340,
      image: '/services/hotel-boutique.jpg',
      cta: 'Xem phòng →',
    },
  ];

  const filteredExplorationCards = explorationCards.filter((card) => {
    if (activeFilter === 'all') return true;
    return card.category === activeFilter;
  });

  // 4. Ở lâu hơn, chăm sóc trọn vẹn (3 cards)
  const comfortCards = [
    {
      id: 'spa-duong-dong',
      category: 'wellness',
      icon: 'leaf' as IconName,
      tagTop: '4.9 ★ (120+)',
      tagLabel: 'Liệu pháp bản địa',
      title: 'Liệu trình bấm huyệt thư giãn sau chuyến đi',
      desc: 'Massage tinh dầu tràm Phú Quốc và chườm thảo dược ấm, giải tỏa mỏi cơ bắp và làm dịu làn da sau ngày dài tắm nắng biển.',
      pill: '⏱️ Thời lượng: 60 - 90 phút • Đón tại khách sạn',
      priceLabel: 'Chi phí từ',
      price: '390.000 đ',
      unit: '/ người',
      buttonText: 'Đặt lịch hẹn',
    },
    {
      id: 'nightgo-laundry',
      category: 'laundry',
      icon: 'basket' as IconName,
      tagTop: 'Giao nhận 3h',
      tagLabel: 'Tiện lợi tối đa',
      title: 'NightGo Laundry - Giặt sấy khô giao tận phòng',
      desc: 'Shipper tới tận lễ tân khách sạn lấy đồ dơ và trả lại quần áo thơm tho đóng gói cẩn thận chỉ sau 3 đến 4 tiếng.',
      pill: '✓ Nước xả cao cấp • Giặt riêng từng mẻ',
      priceLabel: 'Đơn giá cân kí',
      price: '45.000 đ',
      unit: '/ kg',
      buttonText: 'Yêu cầu lấy đồ',
    },
    {
      id: 'thue-xe-may',
      category: 'transport',
      icon: 'motorbike' as IconName,
      tagTop: 'Xe đời mới 2023–2024',
      tagLabel: 'Tự do khám phá',
      title: 'Thuê xe máy tay ga giao miễn phí resort',
      desc: 'Xe Vision, Air Blade bảo dưỡng định kỳ, kèm 2 nón bảo hiểm sạch sẽ, áo mưa và bản đồ đường sá Phú Quốc tránh lạc đường.',
      pill: '✓ Không giữ CCCD gốc • Hỗ trợ sự cố 24/7',
      priceLabel: 'Thuê xe theo ngày',
      price: '120.000 đ',
      unit: '/ ngày',
      buttonText: 'Chọn mẫu xe',
    },
  ];

  // 5. Khung giá chuẩn hóa
  const standardPriceRows = [
    {
      icon: 'boat' as IconName,
      name: 'Tour cano ghép 4 đảo ngọc',
      standard: 'Bao gồm cano đời mới, kính lặn, clip flycam, đưa đón',
      price: '450.000 đ',
      unit: '/ khách',
      serviceId: 'cano-an-thoi',
    },
    {
      icon: 'car' as IconName,
      name: 'Xe đón tiễn Sân bay Phú Quốc',
      standard: 'Xe riêng 4-7 chỗ tới trung tâm Dương Đông hoặc Bãi Trường',
      price: '180.000 đ',
      unit: '/ xe / lượt',
      serviceId: 'xe-san-bay',
    },
    {
      icon: 'motorbike' as IconName,
      name: 'Thuê xe máy tay ga (Vision / Airblade)',
      standard: 'Giao nhận tại khách sạn, gồm 2 nón bảo hiểm chuẩn',
      price: '120.000 đ',
      unit: '/ ngày (24h)',
      serviceId: 'thue-xe-may',
    },
    {
      icon: 'cablecar' as IconName,
      name: 'Vé cáp treo Hòn Thơm & Công viên nước',
      standard: 'Cáp treo 2 chiều vượt biển dài nhất thế giới + Aquatopia',
      price: '650.000 đ',
      unit: '/ vé người lớn',
      serviceId: 'cap-treo-hon-thom',
    },
    {
      icon: 'bowl' as IconName,
      name: 'Bữa ăn hải sản tươi sống định lượng',
      standard: 'Thực đơn gồm 4-5 món hải sản theo mùa (ghẹ, mực, ốc)',
      price: '250.000 đ',
      unit: '/ phần',
      serviceId: 'com-nha-phu-quoc',
    },
  ];

  const handleSelectById = (id: string) => {
    const found = services.find((s) => s.id === id);
    if (found) {
      onSelectService(found);
    } else {
      onExplore();
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfdfd] text-gray-900 pb-16">
      {/* SECTION 1: HERO & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#087f78] font-bold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Phú Quốc • Điểm đến đang hoạt động
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
            <Icon name="shield" className="h-3.5 w-3.5" /> Dữ liệu minh bạch thời gian thực
          </span>
          <span className="text-gray-500 text-xs">Cập nhật 5 phút trước</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-1">
            DỊCH VỤ ĐẢO CHỈ TRONG MỘT CHẠM
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Khám phá Phú Quốc theo cách của bạn
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-[54ch] leading-relaxed">
            Tìm trải nghiệm, chỗ nghỉ và dịch vụ địa phương được kiểm định. GOPU AI tối ưu hành
            trình theo thời tiết thực tế và ngân sách chỉ trong vài giây.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 sm:p-3 mb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onExplore(undefined, searchQuery);
            }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2"
          >
            <div className="flex-1 flex items-center px-3 gap-2 text-gray-500">
              <Icon name="search" className="h-5 w-5 text-gray-500" />
              <label htmlFor="hero-search" className="sr-only">
                Tìm kiếm dịch vụ du lịch tại Phú Quốc
              </label>
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tour cano, hải sản, khách sạn view biển, xe đưa đón..."
                className="w-full min-h-11 text-base sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-w-11 min-h-11 text-gray-500 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="min-h-11 px-5 py-2.5 rounded-xl bg-[#087f78] hover:bg-[#066862] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Icon name="search" className="h-4 w-4" />
                <span>Tìm dịch vụ</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenAssistant(
                    searchQuery ||
                      'Mình muốn đi 3 ngày 2 đêm cùng gia đình (4 người), ngân sách khoảng 12 triệu, ưu tiên tắm biển ngắm hoàng hôn, cano 4 đảo và ăn hải sản ngon.'
                  )
                }
                className="min-h-11 px-4 py-2.5 rounded-xl border border-[#087f78]/35 bg-white hover:bg-emerald-50 text-[#087f78] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Icon name="sparkles" className="h-4 w-4" />
                <span>Nhờ AI lên lịch</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6">
          <span className="font-semibold text-gray-600 inline-flex items-center gap-1"><Icon name="bolt" className="h-3.5 w-3.5" /> Gợi ý nhanh:</span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchQuery(chip);
                onExplore(undefined, chip);
              }}
              className="min-h-11 px-4 rounded-full bg-white hover:bg-emerald-50 hover:text-[#087f78] hover:border-emerald-300 border border-gray-200 text-gray-700 transition-all font-medium text-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* WEATHER & SEA CONDITION CAPSULE */}
        <div id="weather" className="scroll-mt-20 md:scroll-mt-32 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            {/* Col 1: Title */}
            <div className="col-span-2 md:col-span-1 flex items-start gap-2.5 border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0 md:pr-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0 text-base">
                <Icon name="waves" className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-900">
                    Thời tiết & Tình trạng biển Phú Quốc
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  Dữ liệu quan trắc thực địa tại Dương Đông & Quần đảo An Thới
                </p>
              </div>
            </div>

            {/* Col 2: Temp */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.temp !== null && weather?.temp !== undefined
                  ? `${weather.temp}°C`
                  : '28.5°C'}
              </span>
              <span className="text-xs font-medium text-amber-600 flex items-center gap-1 mt-0.5">
                <Icon name="sun" className="h-3.5 w-3.5" /> Nắng trong lành
              </span>
            </div>

            {/* Col 3: Wind */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.wind !== null && weather?.wind !== undefined
                  ? `${weather.wind} km/h`
                  : '4.2 km/h'}
              </span>
              <span className="text-xs font-medium text-teal-700 flex items-center gap-1 mt-0.5">
                <Icon name="wind" className="h-3.5 w-3.5" /> Gió êm (Hải trình tốt)
              </span>
            </div>

            {/* Col 4: Waves */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.wave !== null && weather?.wave !== undefined
                  ? `≈ ${weather.wave} m`
                  : '≈ 0.25 m'}
              </span>
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-0.5">
                <Icon name="waves" className="h-3.5 w-3.5" /> Sóng phẳng, an toàn lặn
              </span>
            </div>

            {/* Col 5: Sunset */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">17:48 PM</span>
              <span className="text-xs font-medium text-orange-600 flex items-center gap-1 mt-0.5">
                <Icon name="sunset" className="h-3.5 w-3.5" /> Giờ vàng hoàng hôn
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: DANH MỤC THIẾT YẾU */}
        <div id="services" className="scroll-mt-20 md:scroll-mt-32 mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">
                DANH MỤC THIẾT YẾU
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">Tìm nhanh dịch vụ tại Đảo Ngọc</h2>
            </div>
            <span className="text-xs text-gray-500 mt-1 sm:mt-0">
              Khám phá gợi ý chuẩn hóa bởi cộng đồng địa phương
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onExplore(cat.id)}
                className="bg-white rounded-2xl border border-gray-100 hover:border-teal-500 p-4 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <Icon name={cat.icon} className="h-5 w-5" />
                  </div>
                  <strong className="text-sm font-bold text-gray-900 block group-hover:text-[#087f78] transition-colors leading-snug">
                    {cat.title}
                  </strong>
                  <span className="text-xs text-gray-500 block mt-1">{cat.sub}</span>
                </div>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#087f78] flex items-center gap-1 mt-4 transition-colors">
                  Khám phá <span className="text-xs">↗</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: ẨM THỰC TINH TUYỂN */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">
                ẨM THỰC TINH TUYỂN • ĐÃ XÁC THỰC THỰC ĐƠN & GIÁ NIÊM YẾT
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                Trải nghiệm không thể bỏ lỡ
              </h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">
                Món ngon bản địa và địa chỉ ăn uống tươi ngon bên bờ biển Tây Đảo Ngọc.
              </p>
            </div>
            <button
              onClick={() => onExplore('restaurant')}
              className="min-h-11 text-xs font-bold text-[#087f78] hover:text-[#066862] flex items-center gap-1 mt-2 sm:mt-0"
            >
              Xem tất cả ẩm thực →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {diningCards.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <button
                  type="button"
                  onClick={() => handleSelectById(item.id)}
                  aria-label={`Xem chi tiết ${item.title}`}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                />
                <div>
                  {/* Image with Tag & Rating */}
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 shadow-xs">
                      {item.tag}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold text-white flex items-center gap-1">
                      <span className="text-amber-400">★</span> {item.rating} ({item.reviews})
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Icon name="mapPin" className="h-3 w-3" /> {item.location}</span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#087f78] transition-colors leading-snug line-clamp-2 min-h-[2.75em]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and (+) button */}
                <div className="p-3.5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <div>
                    <span className="text-xs text-gray-500 block">Giá từ</span>
                    <strong className="text-sm font-extrabold text-gray-900 tabular-nums">
                      {formatVND(item.price)}{' '}
                      <span className="text-xs font-normal text-gray-500">/ {item.unit}</span>
                    </strong>
                  </div>
                  {/* Decorative: the whole card is the button. A "+" implied
                      add-to-cart, but this opens the detail panel. */}
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-emerald-50 text-[#087f78] group-hover:bg-[#087f78] group-hover:text-white flex items-center justify-center transition-colors border border-emerald-200"
                  >
                    <Icon name="chevronRight" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: HÀNH TRÌNH KHÁM PHÁ ĐẢO NGỌC */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">
                TRẢI NGHIỆM CHUẨN MỰC • BẢO HIỂM DU LỊCH TRỌN GÓI & CANO ĐỜI MỚI
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                Hành trình khám phá Đảo Ngọc
              </h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">
                Tour cano biển đảo, xe đưa đón và khu nghỉ dưỡng chọn lọc giúp chuyến đi nhẹ nhàng,
                thảnh thơi.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 md:mt-0 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveFilter('tour')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'tour'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tour Cano 4 đảo
              </button>
              <button
                onClick={() => setActiveFilter('stay')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'stay'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Khách sạn & Resort
              </button>
              <button
                onClick={() => setActiveFilter('transport')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'transport'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Xe đưa đón
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExplorationCards.map((card) => (
              <div
                key={card.id}
                className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <button
                  type="button"
                  onClick={() => handleSelectById(card.id)}
                  aria-label={`Xem chi tiết ${card.title}`}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                />
                <div>
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-800 shadow-xs">
                      {card.tag}
                    </div>
                    {card.subtag && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs font-semibold text-white">
                        {card.subtag}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{card.location}</span>
                      <span className="font-semibold text-gray-700">
                        ★ {card.rating} ({card.reviews} đánh giá)
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#087f78] transition-colors leading-snug line-clamp-2">
                      {card.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Footer with Price and CTA */}
                <div className="p-4 pt-2 border-t border-gray-50 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-xs text-gray-500">{card.priceNote}</span>
                    <span className="text-base font-extrabold text-gray-900 tabular-nums whitespace-nowrap">
                      {card.price}
                    </span>
                    <span className="text-xs text-gray-500 font-normal whitespace-nowrap"> {card.unit}</span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 whitespace-nowrap px-4 py-2 rounded-xl bg-gray-100 group-hover:bg-[#087f78] group-hover:text-white text-gray-800 text-xs font-bold transition-colors"
                  >
                    {card.cta}
                  </span>
                </div>
              </div>
            ))}

            {/* CARD 6: GOPU SMART CONCIERGE (Xanh ngọc đậm sang trọng) */}
            <div className="rounded-2xl bg-[#053f38] text-white p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 text-xl mb-3">
                  <Icon name="sparkles" className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block mb-1">
                  GOPU SMART CONCIERGE
                </span>
                <h3 className="text-xl font-extrabold text-white leading-snug">
                  Chưa tìm thấy hành trình ưng ý cho nhóm bạn?
                </h3>
                <p className="text-sm text-emerald-100/85 mt-2.5 leading-[1.65]">
                  Nhập yêu cầu: &quot;Gia đình 4 người, có trẻ 5 tuổi, thích ngắm biển yên tĩnh, ngân
                  sách 15 triệu trong 3 ngày 2 đêm&quot;. AI sẽ tính toán thời gian di chuyển và lập
                  kế hoạch ngay.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() =>
                    onOpenAssistant(
                      'Gia đình 4 người, có trẻ 5 tuổi, thích ngắm biển yên tĩnh, ngân sách 15 triệu trong 3 ngày 2 đêm'
                    )
                  }
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 text-[#064e43] font-bold text-xs text-center transition-colors shadow-sm"
                >
                  Tạo lịch trình riêng với AI →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Ở LÂU HƠN, CHĂM SÓC TRỌN VẸN */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">
                DU LỊCH DÀI NGÀY THẢNH THƠI • DỊCH VỤ CHĂM SÓC & TIỆN ÍCH THIẾT YẾU
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                Ở lâu hơn, chăm sóc trọn vẹn
              </h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">
                Spa phục hồi thể lực sau ngày lặn biển và dịch vụ giặt sấy giao tận phòng.
              </p>
            </div>
            <button
              onClick={() => onExplore('wellness')}
              className="min-h-11 text-xs font-bold text-[#087f78] hover:text-[#066862] flex items-center gap-1 mt-2 sm:mt-0"
            >
              Xem tất cả dịch vụ hỗ trợ →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comfortCards.map((c) => (
              <div
                key={c.id}
                className="relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <button
                  type="button"
                  onClick={() => handleSelectById(c.id)}
                  aria-label={`Xem chi tiết ${c.title}`}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl text-emerald-700 group-hover:scale-105 transition-transform">
                      <Icon name={c.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {c.tagTop}
                    </span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    {c.tagLabel}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#087f78] transition-colors leading-snug">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{c.desc}</p>

                  <div className="mt-3.5 pl-3 border-l-2 border-emerald-200 text-xs text-gray-600 font-medium">
                    {c.pill}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-gray-500 block">{c.priceLabel}</span>
                    <strong className="text-sm font-extrabold text-gray-900 tabular-nums">
                      {c.price}{' '}
                      <span className="text-xs font-normal text-gray-500">{c.unit}</span>
                    </strong>
                  </div>
                  <span
                    aria-hidden="true"
                    className="px-4 py-2 rounded-xl bg-[#087f78] group-hover:bg-[#066862] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    {c.buttonText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: KHUNG GIÁ DỊCH VỤ CHUẨN HÓA (CHỐNG CHẶT CHÉM) */}
        <div id="price-table" className="scroll-mt-20 md:scroll-mt-32 mb-14">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Heading & Guarantee Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#087f78] text-xs font-bold border border-emerald-200 mb-1.5">
                  <Icon name="shield" className="h-3.5 w-3.5" /> GOPU Fair-Pricing Standard
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Khung giá dịch vụ chuẩn hóa tại Phú Quốc
                </h2>
                <p className="text-sm text-gray-500 mt-1 max-w-[54ch] leading-[1.6]">
                  Chúng tôi công khai mức giá trần & giá sàn minh bạch. Du khách được bảo vệ khỏi
                  việc thổi giá vào mùa cao điểm hoặc chèo kéo tại cảng tàu.
                </p>
              </div>

              {/* Divider instead of a tinted box: a card inside the price card
                  read as nested containers rather than a callout. */}
              <div className="shrink-0 flex items-center gap-3 border-t border-emerald-200/70 pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4">
                <Icon name="wallet" className="h-6 w-6 text-[#087f78]" />
                <div>
                  <span className="text-xs uppercase font-bold text-gray-500 block">
                    Cam kết hoàn tiền chênh lệch
                  </span>
                  <strong className="text-sm font-bold text-[#087f78] block tabular-nums">
                    Đền bù 100% nếu bị bán đắt hơn niêm yết
                  </strong>
                </div>
              </div>
            </div>

            {/* Mobile: one row per service, whole row is the target */}
            <div className="md:hidden mt-4 divide-y divide-gray-100">
              {standardPriceRows.map((row, idx) => (
                <div key={idx} className="relative py-3.5">
                  <button
                    type="button"
                    onClick={() => handleSelectById(row.serviceId)}
                    aria-label={`Xem dịch vụ ${row.name}`}
                    className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold text-gray-900 flex items-start gap-2">
                      <Icon name={row.icon} className="h-4 w-4 shrink-0 text-[#087f78]" />
                      <span>{row.name}</span>
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 whitespace-nowrap tabular-nums">{row.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 leading-[1.5]">{row.standard}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-sm text-gray-500">{row.unit}</span>
                    <span aria-hidden="true" className="text-xs font-bold text-[#087f78]">Xem dịch vụ →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <table className="w-full text-left text-sm leading-[1.5]">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-bold">HẠNG MỤC DỊCH VỤ</th>
                    <th className="pb-3 font-bold">QUY CHUẨN DỊCH VỤ</th>
                    <th className="pb-3 font-bold">GIÁ SÀN THAM KHẢO</th>
                    <th className="pb-3 font-bold">ĐƠN VỊ TÍNH</th>
                    <th className="pb-3 font-bold text-right">TÙY CHỌN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {standardPriceRows.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleSelectById(row.serviceId)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 pr-4 font-bold text-gray-900 group-hover:text-[#087f78] flex items-center gap-2">
                        <Icon name={row.icon} className="h-4 w-4 shrink-0 text-[#087f78]" />
                        <span>{row.name}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-600">{row.standard}</td>
                      <td className="py-3.5 pr-4 font-extrabold text-gray-900 tabular-nums">{row.price}</td>
                      <td className="py-3.5 pr-4 text-gray-500">{row.unit}</td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectById(row.serviceId);
                          }}
                          aria-label={`Xem dịch vụ ${row.name}`}
                          className="min-h-11 px-2 -my-2 text-[#087f78] hover:text-[#066862] font-bold text-xs rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087f78] focus-visible:ring-offset-2"
                        >
                          Xem dịch vụ &gt;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Notes */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm leading-[1.5] text-gray-500 pt-4 border-t border-gray-100 mt-4 gap-2">
              <span className="flex items-center gap-1.5">
                <span>ⓘ</span>
                <span className="max-w-[54ch]">
                  Tất cả nhà xe, thuyền trưởng và nhà hàng đối tác đều ký cam kết chuẩn giá bán với
                  GOPU.
                </span>
              </span>
              <button
                type="button"
                onClick={() =>
                  toast(
                    lang === 'vi'
                      ? 'Bảng quy chuẩn giá PDF chưa được phát hành trong bản demo này.'
                      : 'The price-standard PDF is not published in this demo yet.'
                  )
                }
                className="min-h-11 inline-flex items-center text-[#087f78] hover:underline font-medium"
              >
                <Icon name="doc" className="h-4 w-4" /> Tải bảng quy chuẩn giá toàn đảo PDF (Mùa 2026)
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 7: BANNER LỚN GOPU AI PLANNER */}
        <div id="ai-planner" className="scroll-mt-20 md:scroll-mt-32 rounded-3xl bg-[#064e43] text-white p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold text-emerald-200 border border-white/15 mb-3">
                <Icon name="sparkles" className="h-3.5 w-3.5" /> Trợ lý lập trình GOPU AI thế hệ mới
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Đi ngắn ngày hay ở lại lâu hơn? Lên lịch trình ngay cùng GOPU AI
              </h2>
              <p className="text-sm sm:text-sm text-emerald-50 mt-2.5 leading-[1.7] max-w-[54ch]">
                Chỉ cần chia sẻ số ngày, số lượng người và ngân sách dự kiến. AI sẽ tự động phân bổ
                điểm đến, thời gian ngắm hoàng hôn, phương tiện và bữa ăn hợp lý nhất theo dữ liệu
                gió sóng thời gian thực.
              </p>

              {/* 3 Cam kết */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-100 mt-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-[#064e43] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  Tối ưu cung đường không mệt mỏi
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-[#064e43] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  Dự báo biển động trước 36 giờ
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-[#064e43] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  Xuất lịch trình qua Zalo trong 5s
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() =>
                  onOpenAssistant(
                    'Mình muốn đi 3 ngày 2 đêm cùng gia đình (4 người), ngân sách khoảng 12 triệu, ưu tiên tắm biển ngắm hoàng hôn, cano 4 đảo và ăn hải sản ngon.'
                  )
                }
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064e43] font-extrabold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Icon name="sparkles" className="h-4 w-4" />
                <span>Trò chuyện với GOPU AI ngay</span>
              </button>
              <button
                onClick={() => onExplore()}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Xem danh mục dịch vụ mẫu</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <MiniChatWidget lang={lang} onOpenAssistant={(messages, choices) => onOpenAssistant(undefined, messages, choices)} onPlanCreated={onPlanCreated} />
    </main>
  );
}
