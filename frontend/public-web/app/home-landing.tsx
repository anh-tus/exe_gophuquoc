'use client';

import { useState } from 'react';
import Image from 'next/image';
import Icon from '../components/ui/Icon';
import { Star, MapPin } from '@phosphor-icons/react';
import { type Lang, type Service, type ServiceCategory, services } from './catalog';
import MiniChatWidget from '../components/landing/MiniChatWidget';
import PriceTableView from './price-table-view';
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

const formatVND = (n: number, lang: Lang) => new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US').format(n) + (lang === 'vi' ? ' đ' : ' VND');

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
  const t = (vi: string, en: string) => lang === 'vi' ? vi : en;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'tour' | 'stay' | 'transport'>('all');

  const quickChips = [
    t("Tour cano 4 đảo", "Four-island canoe tour"),
    'Sunset Sanato',
    t("Hải sản Bãi Trường", "Bai Truong seafood"),
    t("Xe riêng sân bay", "Private airport transfer"),
    t("Bún quậy Kiến Xây", "Kien Xay noodle soup"),
  ];

  // 1. Danh mục thiết yếu
  const categoriesList = [
    {
      id: 'tour' as ServiceCategory,
      title: t("Tour & Trải nghiệm", "Tours & experiences"),
      sub: t("8 gói cano & đảo", "8 island and canoe tours"),

      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'restaurant' as ServiceCategory,
      title: t("Ẩm thực & Hải sản", "Food & seafood"),
      sub: t("18 quán chọn lọc", "18 selected restaurants"),

      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'stay' as ServiceCategory,
      title: t("Khách sạn & Lưu trú", "Hotels & stays"),
      sub: t("24 resort & villa", "24 resorts and villas"),

      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'transport' as ServiceCategory,
      title: t("Đặt xe & Thuê xe máy", "Transfers & motorbike rental"),
      sub: t("Giao xe tận nơi", "Delivery to your location"),

      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'wellness' as ServiceCategory,
      title: t("Spa & Thư giãn", "Spa & relaxation"),
      sub: t("Liệu trình bấm huyệt", "Massage treatments"),

      color: 'bg-brand-50 text-brand-700',
    },
    {
      id: 'laundry' as ServiceCategory,
      title: t("Giặt là du lịch", "Travel laundry"),
      sub: t("Lấy trả nhanh 3h", "Pickup and delivery in 3 hours"),

      color: 'bg-brand-50 text-brand-700',
    },
  ];

  // 2. Ẩm thực tinh tuyển (5 cards)
  const diningCards = [
    {
      id: 'com-nha-phu-quoc',
      title: t("Bữa cơm nhà vị biển đảo", "Island-style home cooking"),
      location: t("Dương Đông", "Duong Dong"),
      desc: t("Món ăn đậm đà với cá bớp kho tộ, mực hấp gừng và canh chua cá...", "Local dishes with braised fish, steamed squid, and sour fish soup..."),
      price: 160000,
      unit: t("phần", "serving"),
      tag: t("Ẩm thực đảo", "Island cuisine"),
      rating: 4.7,
      reviews: 41,
      image: '/services/restaurant-seafood.jpg',
    },
    {
      id: 'hai-san-bai-truong',
      title: t("Hải sản chiều bên Bãi Trường", "Seafood by Bai Truong beach"),
      location: t("Bãi Trường", "Bai Truong"),
      desc: t("Set nướng bờ cát với ghẹ Hàm Ninh, tôm sú nướng muối ớt và...", "Beachside grilled seafood with crab, prawns, and more..."),
      price: 220000,
      unit: t("phần", "serving"),
      tag: t("View biển ngắm hoàng hôn", "Sunset sea view"),
      rating: 4.8,
      reviews: 52,
      image: '/services/restaurant-sunset.jpg',
    },
    {
      id: 'nha-hang-ra-khoi',
      title: t("Nhà hàng hải sản Ra Khơi", "Ra Khoi Seafood Restaurant"),
      location: t("Đường 30/4 • Dương Đông", "30/4 Street • Duong Dong"),
      desc: t("Hải sản sống bơi tại hồ, niêm yết cân kí minh bạch, chế biến vừa vị...", "Live seafood with listed prices and local preparation..."),
      price: 250000,
      unit: t("phần", "serving"),
      tag: t("Quán uy tín lâu năm", "Long-established restaurant"),
      rating: 4.9,
      reviews: 180,
      image: '/services/restaurant-seafood.jpg',
    },
    {
      id: 'nha-hang-xin-chao',
      title: t("Nhà hàng Xin Chào", "Xin Chao Restaurant"),
      location: t("Trần Hưng Đạo • Dương Đông", "Tran Hung Dao • Duong Dong"),
      desc: t("Không gian 2 tầng hướng biển, cocktail hoàng hôn độc đáo kết...", "Two-level sea views and sunset cocktails..."),
      price: 250000,
      unit: t("phần", "serving"),
      tag: t("View biển trực diện", "Direct sea view"),
      rating: 4.8,
      reviews: 95,
      image: '/services/restaurant-sunset.jpg',
    },
    {
      id: 'nha-hang-song-xanh',
      title: t("Nhà hàng Sông Xanh", "Song Xanh Restaurant"),
      location: t("Đường 30/4 • Dương Đông", "30/4 Street • Duong Dong"),
      desc: t("Không gian sân vườn thoáng mát bên bờ sông Dương Đông, phục v...", "Garden seating beside the Duong Dong River..."),
      price: 220000,
      unit: t("phần", "serving"),
      tag: t("Thư thái bên sông", "Riverside dining"),
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
      title: t("Cano VIP 4 Đảo: Mây Rút, Gầm Ghì, Móng Tay & Lặn san hô", "VIP four-island canoe tour and snorkeling"),
      location: t("Quần đảo An Thới", "An Thoi Islands"),
      tag: t("Bán chạy nhất", "Most popular"),
      subtag: t("Tặng clip Flycam & Chụp SUP", "Includes drone video and SUP photos"),
      desc: t("Trải nghiệm cano cao tốc êm ái, trang bị kính lặn thở chuyên nghiệp, hướng dẫn viên địa phương chu đáo và đưa đón tận resort.", "Explore the islands by canoe with snorkeling gear, a local guide, and resort transfers."),
      price: t("Giá trọn gói 450.000 đ", "Package from 450,000 VND"),
      unit: t("/ khách", "/ guest"),
      rating: 4.9,
      reviews: 420,
      image: '/services/tour-cano.jpg',
      cta: t("Xem chi tiết ", "View details"),
    },
    {
      id: 'bien-bai-sao',
      category: 'tour',
      title: t("Một ngày thư thả tại Bãi Sao & Check-in bãi cát trắng mịn", "A relaxing day at Bai Sao beach"),
      location: t("Bãi Sao • Nam Đảo", "Bai Sao • South Island"),
      tag: t("Nghỉ dưỡng êm đềm", "Relax by the beach"),
      subtag: t("Bao gồm SUP & Ghế nằm bãi cát", "Includes SUP and beach loungers"),
      desc: t("Khám phá bờ cát trắng mịn như kem, sóng êm ái thích hợp cho gia đình có trẻ nhỏ và người lớn tuổi nghỉ ngơi trọn vẹn.", "Enjoy soft white sand and calm waves, suitable for families and older travelers."),
      price: t("Giá trọn gói 320.000 đ", "Package from 320,000 VND"),
      unit: t("/ khách", "/ guest"),
      rating: 4.8,
      reviews: 115,
      image: '/island-hero.png',
      cta: t("Xem chi tiết ", "View details"),
    },
    {
      id: 'xe-san-bay',
      category: 'transport',
      title: t("Xe riêng đón tiễn Sân bay Phú Quốc (Xe 4-7 chỗ sạch sẽ)", "Private Phu Quoc airport transfer (4–7 seats)"),
      location: t("Sân bay PQC ⇄ Khách sạn", "PQC airport to hotel"),
      tag: t("Xe riêng 100%", "Private vehicle"),
      subtag: t("Tài xế chờ sẵn khi hạ cánh", "Driver meets you on arrival"),
      desc: t("Không lo đợi taxi, giá cố định không phụ phí đêm hay kẹt xe. Tài xế bản địa lịch sự, mở máy lạnh sẵn đón bạn ngay sảnh đến.", "Fixed-price transfer with a local driver meeting you at arrivals."),
      price: t("Giá cố định 180.000 đ", "Fixed price 180,000 VND"),
      unit: t("/ chuyến", "/ trip"),
      rating: 4.9,
      reviews: 310,
      image: '/island-transfer.png',
      cta: t("Đặt xe ngay ", "View transfer"),
    },
    {
      id: 'seashells-phu-quoc',
      category: 'stay',
      title: 'Seashells Phu Quoc Hotel & Spa',
      location: t("01 Võ Thị Sáu", "01 Vo Thi Sau"),
      tag: t("5 Sao • Trung tâm Dương Đông", "5 stars • Central Duong Dong"),
      desc: t("Vị trí đắc địa ngay trung tâm, đi bộ ra Chợ Đêm trong 5 phút. Hồ bơi vô cực ngắm hoàng hôn đẹp nhất thị trấn.", "Central location, a short walk to the night market, with a sunset infinity pool."),
      priceNote: t("Ưu đãi hôm nay từ", "Indicative price from"),
      price: t("1.800.000 đ", "1,800,000 VND"),
      unit: t("/ đêm", "/ night"),
      rating: 4.8,
      reviews: 520,
      image: '/services/hotel-seaside.jpg',
      cta: t("Xem phòng ", "View rooms"),
    },
    {
      id: 'la-veranda-phu-quoc',
      category: 'stay',
      title: 'La Veranda Resort Phu Quoc – MGallery',
      location: t("Trần Hưng Đạo • Bãi Trường", "Tran Hung Dao • Bai Truong"),
      tag: t("Biệt thự biển Pháp cổ điển", "Classic French seaside villa"),
      desc: t("Không gian nghỉ dưỡng hoài niệm thập niên 1920 với khu vườn nhiệt đới xanh mát và bãi biển riêng tư yên tĩnh.", "A 1920s-inspired resort with tropical gardens and a quiet private beach."),
      priceNote: t("Ưu đãi hôm nay từ", "Indicative price from"),
      price: t("3.500.000 đ", "3,500,000 VND"),
      unit: t("/ đêm", "/ night"),
      rating: 4.9,
      reviews: 340,
      image: '/services/hotel-boutique.jpg',
      cta: t("Xem phòng ", "View rooms"),
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

      tagTop: '4.9 (120+)',
      tagLabel: t("Liệu pháp bản địa", "Local wellness"),
      title: t("Liệu trình bấm huyệt thư giãn sau chuyến đi", "Relaxing acupressure after a day out"),
      desc: t("Massage tinh dầu tràm Phú Quốc và chườm thảo dược ấm, giải tỏa mỏi cơ bắp và làm dịu làn da sau ngày dài tắm nắng biển.", "Essential-oil massage and warm herbal compresses help you unwind after a day by the sea."),
      pill: t("Thời lượng: 60 - 90 phút • Đón tại khách sạn", "60–90 minutes • Hotel pickup"),
      priceLabel: t("Chi phí từ", "Indicative price from"),
      price: t("390.000 đ", "390,000 VND"),
      unit: t("/ người", "/ person"),
      buttonText: t("Đặt lịch hẹn", "View treatment"),
    },
    {
      id: 'nightgo-laundry',
      category: 'laundry',

      tagTop: t("Giao nhận 3h", "Pickup in 3 hours"),
      tagLabel: t("Tiện lợi tối đa", "Easy travel care"),
      title: t("NightGo Laundry - Giặt sấy khô giao tận phòng", "NightGo Laundry — room delivery"),
      desc: t("Shipper tới tận lễ tân khách sạn lấy đồ dơ và trả lại quần áo thơm tho đóng gói cẩn thận chỉ sau 3 đến 4 tiếng.", "Laundry is picked up at hotel reception and returned cleaned and packed in 3–4 hours."),
      pill: t(" Nước xả cao cấp • Giặt riêng từng mẻ", "Separate loads • Fabric conditioner included"),
      priceLabel: t("Đơn giá cân kí", "Indicative price"),
      price: t("45.000 đ", "45,000 VND"),
      unit: '/ kg',
      buttonText: t("Yêu cầu lấy đồ", "View laundry service"),
    },
    {
      id: 'thue-xe-may',
      category: 'transport',

      tagTop: t("Xe đời mới 2023–2024", "Recent model bikes"),
      tagLabel: t("Tự do khám phá", "Explore freely"),
      title: t("Thuê xe máy tay ga giao miễn phí resort", "Scooter rental with resort delivery"),
      desc: t("Xe Vision, Air Blade bảo dưỡng định kỳ, kèm 2 nón bảo hiểm sạch sẽ, áo mưa và bản đồ đường sá Phú Quốc tránh lạc đường.", "Maintained scooters with two helmets, raincoats, and a local road map."),
      pill: t(" Không giữ CCCD gốc • Hỗ trợ sự cố 24/7", "No original ID deposit • 24/7 support"),
      priceLabel: t("Thuê xe theo ngày", "Daily rental"),
      price: t("120.000 đ", "120,000 VND"),
      unit: t("/ ngày", "/ day"),
      buttonText: t("Chọn mẫu xe", "View bikes"),
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
    <main className="gopu-home min-h-[100dvh] bg-[#fcfdfd] text-gray-900 pb-16">
      {/* SECTION 1: HERO & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#087f78] font-bold border border-emerald-200">{t("Phú Quốc • Điểm đến đang hoạt động", "Phu Quoc • Available destination")}</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">{t("Dữ liệu minh bạch thời gian thực", "Current travel information")}</span>
          <span className="text-gray-500 text-xs">{t("Cập nhật 5 phút trước", "Updated 5 minutes ago")}</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-1">{t("DỊCH VỤ ĐẢO CHỈ TRONG MỘT CHẠM", "ISLAND SERVICES IN ONE PLACE")}</span>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-gray-900 leading-tight">{t("Khám phá Phú Quốc theo cách của bạn", "Explore Phu Quoc your way")}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-[54ch] leading-relaxed">{t("Tìm trải nghiệm, chỗ nghỉ và dịch vụ địa phương được kiểm định. GOPU AI tối ưu hành trình theo thời tiết thực tế và ngân sách chỉ trong vài giây.", "Find local experiences, places to stay, and travel services. GOPU AI helps shape a trip around your preferences and budget.")}</p>
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
              <Icon name="search" className="h-5 w-5 shrink-0" aria-hidden="true" />

              <label htmlFor="hero-search" className="sr-only">{t("Tìm kiếm dịch vụ du lịch tại Phú Quốc", "Search Phu Quoc travel services")}</label>
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Tìm tour cano, hải sản, khách sạn, xe đưa đón...', 'Search canoe tours, seafood, hotels, and transfers...')}
                className="w-full min-h-11 text-base sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-w-11 min-h-11 text-gray-500 hover:text-gray-600 text-sm"
                >
                  {t('Xóa', 'Clear')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="min-h-11 px-5 py-2.5 rounded-xl bg-[#087f78] hover:bg-[#066862] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >

                <Icon name="search" className="h-4 w-4" aria-hidden="true" />
                <span>{t("Tìm dịch vụ", "Search services")}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenAssistant(
                    searchQuery ||
                      t('Mình muốn đi 3 ngày 2 đêm cùng gia đình (4 người), ngân sách khoảng 12 triệu, ưu tiên tắm biển ngắm hoàng hôn, cano 4 đảo và ăn hải sản ngon.', 'Plan a 3-day trip for my family of four with a budget of about 12 million VND. We like beaches, sunsets, island tours, and seafood.')
                  )
                }
                className="min-h-11 px-4 py-2.5 rounded-xl border border-[#087f78]/35 bg-white hover:bg-emerald-50 text-[#087f78] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >

                <span>{t("Nhờ AI lên lịch", "Plan with AI")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6">
          <span className="font-semibold text-gray-600 inline-flex items-center gap-1">{t("Gợi ý nhanh:", "Quick searches:")}</span>
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

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-900">{t("Thời tiết & Tình trạng biển Phú Quốc", "Phu Quoc weather & sea")}</span>

                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t("Dữ liệu quan trắc thực địa tại Dương Đông & Quần đảo An Thới", "Weather near Duong Dong and the An Thoi Islands")}</p>
              </div>
            </div>

            {/* Col 2: Temp */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.temp !== null && weather?.temp !== undefined
                  ? `${weather.temp}°C`
                  : '28.5°C'}
              </span>
              <span className="text-xs font-medium text-[#087f78] flex items-center gap-1 mt-0.5">{t("Nắng trong lành", "Sunny")}</span>
            </div>

            {/* Col 3: Wind */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.wind !== null && weather?.wind !== undefined
                  ? `${weather.wind} km/h`
                  : '4.2 km/h'}
              </span>
              <span className="text-xs font-medium text-teal-700 flex items-center gap-1 mt-0.5">{t("Gió êm (Hải trình tốt)", "Light wind")}</span>
            </div>

            {/* Col 4: Waves */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">
                {weather?.wave !== null && weather?.wave !== undefined
                  ? `≈ ${weather.wave} m`
                  : '≈ 0.25 m'}
              </span>
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-0.5">{t("Sóng phẳng, an toàn lặn", "Low waves")}</span>
            </div>

            {/* Col 5: Sunset */}
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-gray-900">17:48 PM</span>
              <span className="text-xs font-medium text-[#087f78] flex items-center gap-1 mt-0.5">{t("Giờ vàng hoàng hôn", "Sunset hour")}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: DANH MỤC THIẾT YẾU */}
        <div id="services" className="scroll-mt-20 md:scroll-mt-32 mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">{t("DANH MỤC THIẾT YẾU", "ESSENTIAL SERVICES")}</span>
              <h2 className="text-2xl font-extrabold text-gray-900">{t("Tìm nhanh dịch vụ tại Đảo Ngọc", "Find island services quickly")}</h2>
            </div>
            <span className="text-xs text-gray-500 mt-1 sm:mt-0">{t("Khám phá gợi ý chuẩn hóa bởi cộng đồng địa phương", "Explore sample local recommendations")}</span>
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

                  </div>
                  <strong className="text-sm font-bold text-gray-900 block group-hover:text-[#087f78] transition-colors leading-snug">
                    {cat.title}
                  </strong>
                  <span className="text-xs text-gray-500 block mt-1">{cat.sub}</span>
                </div>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#087f78] flex items-center gap-1 mt-4 transition-colors">{t("Khám phá", "Explore")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: ẨM THỰC TINH TUYỂN */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">{t("ẨM THỰC TINH TUYỂN • ĐÃ XÁC THỰC THỰC ĐƠN & GIÁ NIÊM YẾT", "ISLAND DINING • SAMPLE LISTINGS")}</span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">{t("Trải nghiệm không thể bỏ lỡ", "Food worth exploring")}</h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">{t("Món ngon bản địa và địa chỉ ăn uống tươi ngon bên bờ biển Tây Đảo Ngọc.", "Discover local dishes and seaside restaurants on the island.")}</p>
            </div>
            <button
              onClick={() => onExplore('restaurant')}
              className="min-h-11 text-xs font-bold text-[#087f78] hover:text-[#066862] flex items-center gap-1 mt-2 sm:mt-0"
            >{t("Xem tất cả ẩm thực", "View all dining")}</button>
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
                  aria-label={`${t('Xem chi tiết', 'View details')} ${item.title}`}
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
                      <Star size={13} weight="fill" className="text-white" aria-hidden="true" /> {item.rating} ({item.reviews})
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><MapPin size={13} aria-hidden="true" /> {item.location}</span>
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
                    <span className="text-xs text-gray-500 block">{t("Giá từ", "From")}</span>
                    <strong className="text-sm font-extrabold text-gray-900 tabular-nums">
                       {formatVND(item.price, lang)}{' '}
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">{t("TRẢI NGHIỆM CHUẨN MỰC • BẢO HIỂM DU LỊCH TRỌN GÓI & CANO ĐỜI MỚI", "ISLAND EXPERIENCES • SAMPLE LISTINGS")}</span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">{t("Hành trình khám phá Đảo Ngọc", "Explore the island")}</h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">{t("Tour cano biển đảo, xe đưa đón và khu nghỉ dưỡng chọn lọc giúp chuyến đi nhẹ nhàng, thảnh thơi.", "Browse canoe tours, transfers, and selected stays for an easy island trip.")}</p>
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
              >{t("Tất cả", "All")}</button>
              <button
                onClick={() => setActiveFilter('tour')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'tour'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >{t("Tour Cano 4 đảo", "Four-island tours")}</button>
              <button
                onClick={() => setActiveFilter('stay')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'stay'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >{t("Khách sạn & Resort", "Hotels & resorts")}</button>
              <button
                onClick={() => setActiveFilter('transport')}
                className={`inline-flex min-h-11 items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-none ${
                  activeFilter === 'transport'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >{t("Xe đưa đón", "Transfers")}</button>
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
                  aria-label={`${t('Xem chi tiết', 'View details')} ${card.title}`}
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
                        <Star size={13} weight="fill" className="text-[#087f78] inline" aria-hidden="true" /> {card.rating} ({card.reviews} {t('đánh giá', 'reviews')})
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

                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block mb-1">
                  GOPU SMART CONCIERGE
                </span>
                <h3 className="text-xl font-extrabold text-white leading-snug">{t("Chưa tìm thấy hành trình ưng ý cho nhóm bạn?", "Need a different itinerary for your group?")}</h3>
                <p className="text-sm text-emerald-100/85 mt-2.5 leading-[1.65]">{t("Cho biết số người, sở thích, ngân sách và ngày đi để GOPU AI gợi ý lịch trình mẫu.", "Tell GOPU AI your group size, interests, budget, and travel dates to get a sample plan.")}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() =>
                    onOpenAssistant(
                       t('Gia đình 4 người, có trẻ 5 tuổi, thích ngắm biển yên tĩnh, ngân sách 15 triệu trong 3 ngày 2 đêm', 'Plan a 3-day trip for a family of four with a 5-year-old child, quiet beaches, and a 15 million VND budget.')
                    )
                  }
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 text-[#064e43] font-bold text-xs text-center transition-colors shadow-sm"
                >{t("Tạo lịch trình riêng với AI", "Create a plan with AI")}</button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Ở LÂU HƠN, CHĂM SÓC TRỌN VẸN */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#087f78] block mb-0.5">{t("DU LỊCH DÀI NGÀY THẢNH THƠI • DỊCH VỤ CHĂM SÓC & TIỆN ÍCH THIẾT YẾU", "LONGER STAYS • WELLNESS AND ESSENTIALS")}</span>
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">{t("Ở lâu hơn, chăm sóc trọn vẹn", "Stay longer, travel comfortably")}</h2>
              <p className="text-sm leading-[1.6] max-w-[54ch] text-gray-500 mt-1">{t("Spa phục hồi thể lực sau ngày lặn biển và dịch vụ giặt sấy giao tận phòng.", "Explore spa treatments and hotel laundry pickup.")}</p>
            </div>
            <button
              onClick={() => onExplore('wellness')}
              className="min-h-11 text-xs font-bold text-[#087f78] hover:text-[#066862] flex items-center gap-1 mt-2 sm:mt-0"
            >{t("Xem tất cả dịch vụ hỗ trợ", "View support services")}</button>
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
                  aria-label={`${t('Xem chi tiết', 'View details')} ${c.title}`}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                />
                <div>
                  <div className="flex items-center justify-between mb-3">

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
        <PriceTableView lang={lang} onSelectService={onSelectService} />

        {/* SECTION 7: BANNER LỚN GOPU AI PLANNER */}
        <div id="ai-planner" className="scroll-mt-20 md:scroll-mt-32 rounded-3xl bg-emerald-50 text-gray-900 p-8 md:p-10 border border-emerald-200 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#087f78] border border-emerald-200 mb-3">{t("Trợ lý lập trình GOPU AI thế hệ mới", "GOPU AI travel planner")}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{t("Đi ngắn ngày hay ở lại lâu hơn? Lên lịch trình ngay cùng GOPU AI", "A short escape or longer stay? Plan with GOPU AI")}</h2>
              <p className="text-sm sm:text-sm text-gray-600 mt-2.5 leading-[1.7] max-w-[54ch]">{t("Chỉ cần chia sẻ số ngày, số lượng người và ngân sách dự kiến. AI sẽ tự động phân bổ điểm đến, thời gian ngắm hoàng hôn, phương tiện và bữa ăn hợp lý nhất theo dữ liệu gió sóng thời gian thực.", "Share your trip length, group size, budget, and interests. GOPU AI will suggest a sample itinerary using the demo catalog.")}</p>

              {/* 3 Cam kết */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#087f78] mt-5">
                <span className="flex items-center gap-1.5">
                  {t("Tối ưu cung đường không mệt mỏi", "A practical route")}</span>
                <span className="flex items-center gap-1.5">
                  {t("Dự báo biển động trước 36 giờ", "Weather information")}</span>
                <span className="flex items-center gap-1.5">
                  {t("Xuất lịch trình qua Zalo trong 5s", "A shareable itinerary")}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() =>
                  onOpenAssistant(
                    t('Mình muốn đi 3 ngày 2 đêm cùng gia đình (4 người), ngân sách khoảng 12 triệu, ưu tiên tắm biển ngắm hoàng hôn, cano 4 đảo và ăn hải sản ngon.', 'Plan a 3-day trip for my family of four with a budget of about 12 million VND. We like beaches, sunsets, island tours, and seafood.')
                  )
                }
                className="px-6 py-3.5 rounded-xl bg-[#087f78] hover:bg-[#066862] text-white font-extrabold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >

                <Icon name="sparkles" className="h-5 w-5" aria-hidden="true" />
                <span>{t("Trò chuyện với GOPU AI ngay", "Chat with GOPU AI")}</span>
              </button>
              <button
                onClick={() => onExplore()}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#087f78] font-bold text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-1.5"
              >
                <span>{t("Xem danh mục dịch vụ mẫu", "View sample services")}</span>

              </button>
            </div>
          </div>
        </div>
      </section>

      <MiniChatWidget lang={lang} onOpenAssistant={(messages, choices) => onOpenAssistant(undefined, messages, choices)} onPlanCreated={onPlanCreated} />
    </main>
  );
}
