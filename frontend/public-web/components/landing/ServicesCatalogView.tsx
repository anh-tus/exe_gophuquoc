'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MagnifyingGlass, Heart, MapPin, Sparkle, ArrowRight } from '@phosphor-icons/react';
import SelectMenu from '../ui/SelectMenu';
import { phuQuocMapUrl, phuQuocGoogleMapUrl } from '../../app/map-url';
import { services, type ServiceCategory } from '../../app/catalog';
import { filterCatalogServices } from '../../app/catalog-filter';

export interface CatalogServiceItem {
  id: string;
  title: string;
  categoryBadge: string;
  highlightBadge?: string;
  area: string;
  rating: number;
  reviewsCount: number;
  description: string;
  perks: string[];
  originalPrice?: string;
  discountBadge?: string;
  price: string;
  priceUnit: string;
  imageUrl: string;
  lat: number;
  lon: number;
}

const CATALOG_SERVICES: CatalogServiceItem[] = [
  {
    id: 'cano-an-thoi',
    title: 'Cano cao tốc khám phá quần đảo An Thới & Lặn ngắm san hô tự nhiên',
    categoryBadge: 'Tour & trải nghiệm',
    highlightBadge: 'Bán chạy nhất',
    area: 'Cảng An Thới, Nam Đảo',
    rating: 4.9,
    reviewsCount: 128,
    description:
      'Hải trình độc quyền khám phá Hòn Mây Rút, Hòn Gầm Ghì, Hòn Móng Tay. Tặng kèm gói quay flycam 4K chuyên nghiệp và chụp ảnh ván SUP giữa vịnh ngọc.',
    perks: ['Tặng Flycam 4K', 'Thiết bị lặn chuẩn', 'Bữa trưa hải sản 8 món'],
    originalPrice: '600.000 đ',
    discountBadge: '-25%',
    price: '450.000 đ',
    priceUnit: '/ người',
    imageUrl: '/island-boat.png',
    lat: 10.027,
    lon: 104.017,
  },
  {
    id: 'bien-bai-sao',
    title: 'Một ngày thư thả nghỉ dưỡng tại Bãi Sao & chèo SUP bãi cát trắng',
    categoryBadge: 'Tour nghỉ dưỡng',
    highlightBadge: 'Thư giãn',
    area: 'Bãi Sao, An Thới',
    rating: 4.7,
    reviewsCount: 86,
    description:
      'Đắm mình trong làn nước phẳng lặng như gương tại bãi biển cát trắng mịn nhất Phú Quốc. Tận hưởng chòi nghỉ view biển riêng tư, set cocktail dừa tươi và hoạt động chèo SUP tự do.',
    perks: ['Miễn phí ván SUP', 'Giường tắm nắng VIP', 'Welcome Drink'],
    price: '320.000 đ',
    priceUnit: '/ người',
    imageUrl: '/island-hero.png',
    lat: 10.045,
    lon: 104.036,
  },
  {
    id: 'xe-san-bay',
    title: 'Xe riêng đưa đón Sân bay Phú Quốc ⇄ Khách sạn trung tâm & Resort',
    categoryBadge: 'Di chuyển',
    highlightBadge: 'Đúng giờ 100%',
    area: 'Sân bay quốc tế Phú Quốc (PQC)',
    rating: 5.0,
    reviewsCount: 210,
    description:
      'Dịch vụ trung chuyển cao cấp không lo chờ đợi. Tài xế đón biển tên tại sảnh đến, hỗ trợ xách hành lý chu đáo, dòng xe SUV và Limousine đời mới êm ái, máy lạnh sâu.',
    perks: ['Đón biển tên sảnh', 'Miễn phí hành lý', 'Chờ máy bay trễ'],
    price: '180.000 đ',
    priceUnit: '/ lượt',
    imageUrl: '/island-transfer.png',
    lat: 10.176,
    lon: 103.993,
  },
  {
    id: 'sunset-sanato-phu-quoc',
    title: 'Vé cổng & Check-in hoàng hôn Sunset Sanato Beach Club',
    categoryBadge: 'Điểm đến & Show',
    highlightBadge: 'Check-in Hot',
    area: 'Bãi Trường, Dương Tơ',
    rating: 4.8,
    reviewsCount: 312,
    description:
      'Thánh địa sống ảo với các tác phẩm điêu khắc đàn voi chân dài, tượng đầu người chia đôi hướng hoàng hôn đỏ rực. Kèm coupon nước uống mát lạnh tại quầy bar ven biển.',
    perks: ['Bao vé cổng', 'Tặng 1 đồ uống', 'Thời điểm vàng 17:30'],
    originalPrice: '120.000 đ',
    discountBadge: '-17%',
    price: '100.000 đ',
    priceUnit: '/ vé',
    imageUrl: '/island-hero.png',
    lat: 10.165,
    lon: 103.966,
  },
  {
    id: 'cau-muc-dem-an-thoi',
    title: 'Trải nghiệm tàu câu mực đêm & Thưởng thức cháo mực giữa biển',
    categoryBadge: 'Tour & trải nghiệm',
    highlightBadge: 'Trải nghiệm đêm',
    area: 'Dương Đông / An Thới',
    rating: 4.8,
    reviewsCount: 154,
    description:
      'Ngắm hoàng hôn lộng lẫy trên vịnh Thái Lan, tự tay câu mực đêm cùng ngư dân kỳ cựu và thưởng thức món mực nhảy hấp, cháo mực nóng hổi ngay trên boong tàu.',
    perks: ['Đầy đủ cần câu & mồi', 'Cháo mực miễn phí', 'Ngắm hoàng hôn'],
    price: '350.000 đ',
    priceUnit: '/ người',
    imageUrl: '/island-boat.png',
    lat: 10.215,
    lon: 103.959,
  },
  {
    id: 'thue-xe-may',
    title: 'Thuê xe máy tay ga & xe số tự lái giao nhận tận khách sạn',
    categoryBadge: 'Thuê xe tự lái',
    highlightBadge: 'Giao tận nơi',
    area: 'Toàn đảo Phú Quốc',
    rating: 4.9,
    reviewsCount: 420,
    description:
      'Xe đời mới Air Blade, Vision, Wave được bảo dưỡng định kỳ, kèm 2 mũ bảo hiểm đạt chuẩn, áo mưa và 1 lít xăng sẵn sàng. Giao nhận miễn phí trong 15 phút.',
    perks: ['Không cọc tiền mặt', 'Bảo hiểm xe máy', 'Cứu hộ 24/7'],
    price: '120.000 đ',
    priceUnit: '/ ngày',
    imageUrl: '/island-transfer.png',
    lat: 10.214,
    lon: 103.961,
  },
];


const EN_SERVICE_DATA: Record<string, Pick<CatalogServiceItem, 'title' | 'categoryBadge' | 'highlightBadge' | 'area' | 'description' | 'perks' | 'priceUnit'>> = {
  'cano-an-thoi': { title: 'An Thoi island speedboat tour and natural coral snorkeling', categoryBadge: 'Tours & experiences', highlightBadge: 'Bestseller', area: 'An Thoi Port, South Island', description: 'Explore May Rut, Gam Ghi and Mong Tay islands. Includes professional 4K drone footage and SUP photos.', perks: ['4K drone footage', 'Snorkeling equipment', 'Eight-course seafood lunch'], priceUnit: '/ person' },
  'bien-bai-sao': { title: 'A relaxing day at Bai Sao with white-sand beach SUP', categoryBadge: 'Relaxation tours', highlightBadge: 'Relaxing', area: 'Bai Sao, An Thoi', description: 'Enjoy calm water and white sand, a private seaside shelter, a fresh coconut cocktail and unlimited SUP paddling.', perks: ['Free SUP board', 'VIP sun lounger', 'Welcome drink'], priceUnit: '/ person' },
  'xe-san-bay': { title: 'Private transfer between Phu Quoc Airport and central hotels or resorts', categoryBadge: 'Transport', highlightBadge: 'Always on time', area: 'Phu Quoc International Airport (PQC)', description: 'A driver meets you in arrivals, helps with luggage and takes you in a modern air-conditioned SUV or limousine.', perks: ['Name-sign pickup', 'Luggage included', 'Flight delay waiting'], priceUnit: '/ trip' },
  'sunset-sanato-phu-quoc': { title: 'Sunset Sanato Beach Club admission and sunset photos', categoryBadge: 'Attractions & shows', highlightBadge: 'Popular photo spot', area: 'Bai Truong, Duong To', description: 'Explore seaside sculptures at sunset. Includes a drink voucher for the beach bar.', perks: ['Admission included', 'One free drink', 'Golden hour at 17:30'], priceUnit: '/ ticket' },
  'cau-muc-dem-an-thoi': { title: 'Night squid fishing cruise and fresh squid porridge', categoryBadge: 'Tours & experiences', highlightBadge: 'Night experience', area: 'Duong Dong / An Thoi', description: 'Watch the Gulf of Thailand sunset, fish for squid with local crew and enjoy fresh seafood aboard.', perks: ['Fishing gear included', 'Free squid porridge', 'Sunset views'], priceUnit: '/ person' },
  'thue-xe-may': { title: 'Self-drive scooter and motorbike rental with hotel delivery', categoryBadge: 'Self-drive rental', highlightBadge: 'Delivered to you', area: 'Across Phu Quoc Island', description: 'Modern serviced scooters and motorbikes include two helmets, raincoats and one liter of fuel. Free local delivery.', perks: ['No cash deposit', 'Motorbike insurance', '24/7 roadside help'], priceUnit: '/ day' },
};

const categoryLabels: Record<ServiceCategory, { vi: string; en: string }> = {
  tour: { vi: 'Tour & trải nghiệm', en: 'Tours & experiences' },
  restaurant: { vi: 'Ẩm thực & hải sản', en: 'Food & seafood' },
  stay: { vi: 'Khách sạn & lưu trú', en: 'Hotels & stays' },
  transport: { vi: 'Di chuyển & thuê xe', en: 'Transfers & rentals' },
  wellness: { vi: 'Spa & thư giãn', en: 'Wellness' },
  laundry: { vi: 'Giặt là', en: 'Laundry' },
};

const areaInEnglish = (area: string) => area
  .replaceAll('Dương Đông', 'Duong Dong')
  .replaceAll('Bãi Trường', 'Bai Truong')
  .replaceAll('Bãi Sao', 'Bai Sao')
  .replaceAll('An Thới', 'An Thoi')
  .replaceAll('Sân bay', 'Airport')
  .replaceAll('Phú Quốc', 'Phu Quoc')
  .replaceAll('Toàn đảo', 'Island-wide')
  .replaceAll('Mũi Ông Đội', 'Ong Doi Cape');

const unitInEnglish = (unit: string) => ({
  '/ đêm': '/ night', '/ xe': '/ vehicle', '/ phần': '/ serving',
  '/ kg': '/ kg', '/ món': '/ item', '/ người': '/ person', '/ lượt': '/ trip', '/ ngày': '/ day', '/ vé': '/ ticket',
}[unit] || unit);

const catalogById = new Map(CATALOG_SERVICES.map((item) => [item.id, item]));
const allCatalogServices: CatalogServiceItem[] = services.map((source) => catalogById.has(source.id) ? { ...catalogById.get(source.id)!, rating: source.rating, reviewsCount: source.reviewCount } : {
  id: source.id,
  title: source.vi,
  categoryBadge: categoryLabels[source.category].vi,
  area: source.area,
  rating: source.rating,
  reviewsCount: source.reviewCount,
  description: source.descriptionVi,
  perks: [],
  price: new Intl.NumberFormat('vi-VN').format(source.price) + ' đ',
  priceUnit: source.priceUnit === 'per-night' ? '/ đêm' : source.priceUnit === 'per-vehicle' ? '/ xe' : source.priceUnit === 'per-serving' ? '/ phần' : source.priceUnit === 'per-kg' ? '/ kg' : source.priceUnit === 'per-item' ? '/ món' : '/ người',
  imageUrl: source.image,
  lat: source.lat,
  lon: source.lon,
});

interface ServicesCatalogViewProps {
  onAddServiceToAi: (service: CatalogServiceItem) => void;
  onViewServiceDetail: (service: CatalogServiceItem) => void;
  onOpenAiPlanner: () => void;
  lang: 'vi' | 'en';
  initialSearch?: string;
  initialCategory?: ServiceCategory | 'all';
}

export default function ServicesCatalogView({
  onAddServiceToAi,
  onViewServiceDetail,
  onOpenAiPlanner,
  lang,
  initialSearch = '',
  initialCategory = 'all',
}: ServicesCatalogViewProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [areaFilter, setAreaFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'popular' | 'price-asc' | 'rating-desc'>('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [selectedPoi, setSelectedPoi] = useState({
    title: 'Cảng An Thới (Nam Đảo)',
    badge: 'TOUR HOT',
    desc: 'Điểm tập kết xuất phát của hầu hết đoàn cano khám phá cụm 4 đảo: Hòn Mây Rút, Gầm Ghì, Móng Tay.',
    tip: 'Nên đi cano ra các đảo Nam Đảo trước 8:30 sáng để đón ánh sáng đẹp nhất chụp ảnh và tránh lượng khách đông từ đất liền.',
  });

  const poi = lang === 'vi' ? selectedPoi : {
    title: 'An Thoi Port (South Island)',
    badge: 'POPULAR TOUR',
    desc: 'Departure point for many four-island speedboat tours, including May Rut, Gam Ghi and Mong Tay.',
    tip: 'Leave for the southern islands before 8:30 a.m. for the best photo light and smaller crowds.',
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const t = (vi: string, en: string) => lang === 'vi' ? vi : en;
  const filteredIds = filterCatalogServices(services.map((source) => {
    const card = catalogById.get(source.id);
    const english = EN_SERVICE_DATA[source.id];
    return {
      id: source.id, category: source.category, area: card?.area || source.area,
      price: source.price, rating: source.rating, reviewCount: source.reviewCount,
      search: [source.vi, source.en, source.descriptionVi, source.descriptionEn,
        source.area, card?.title || '', card?.area || '', card?.description || '',
        english?.title || '', english?.area || '', english?.description || '',
        source.id === 'cano-an-thoi' ? 'tour cano 4 đảo four island canoe' : '',
        source.id === 'xe-san-bay' ? 'xe riêng sân bay private airport transfer' : '',
        source.category === 'stay' ? 'khách sạn hotel resort lưu trú' : ''],
    };
  }), {
    query: searchTerm,
    category: categoryFilter,
    area: areaFilter,
    minPrice: priceFilter === '500k-1m' ? 500000 : priceFilter === 'above1m' ? 1000001 : undefined,
    maxPrice: priceFilter === 'under500k' ? 500000 : priceFilter === '500k-1m' ? 1000000 : undefined,
    minRating: ratingFilter === 'all' ? undefined : Number(ratingFilter),
    sort: sortOrder,
  });
  const filteredServices = filteredIds.map((item) => allCatalogServices.find((card) => card.id === item.id)!).filter(Boolean);

  return (
    <div className="bg-[#f8fbfb] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <a href="#" className="hover:text-[#087f78]">GOPU</a>

          <span className="text-gray-800 font-semibold">{t('Dịch vụ trải nghiệm Phú Quốc', 'Phu Quoc experiences')}</span>
        </div>

        {/* Heading Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#087f78] border border-emerald-200/80 mb-3">

              <span>{t('Hải trình Đảo Ngọc 2026 • Đảm bảo giá niêm yết', 'Island journeys 2026 • Clear listed prices')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {t('Dịch vụ cho hành trình đảo ngọc', 'Services for your island journey')}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
              {t('Tìm kiếm, so sánh và đặt trước tour cano, lặn ngắm san hô, ẩm thực và xe đưa đón với đối tác địa phương uy tín được kiểm định bởi GOPU.', 'Explore and compare boat tours, snorkeling, dining and transfers from local providers on Phu Quoc.')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#087f78]">

            <span>{t('Thời tiết biển hôm nay: Sóng êm • Thích hợp lặn đảo', 'Sea conditions today: Calm waves • Good for snorkeling')}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative z-20 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input (3 cols) */}
            <div className="lg:col-span-3 relative">
              <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden="true" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Tìm theo tên tour, địa điểm, từ khóa...', 'Search tours, places and keywords...')}
                className="w-full min-h-14 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#087f78]"
              />
            </div>

            {/* Category Dropdown (2 cols) */}
            <SelectMenu className="lg:col-span-2" label={t('Danh mục', 'Category')} value={categoryFilter} onChange={setCategoryFilter} options={[
              { value: 'all', label: t('Tất cả danh mục', 'All categories') },
              ...(Object.keys(categoryLabels) as ServiceCategory[]).map((category) => ({ value: category, label: categoryLabels[category][lang] })),
            ]} />

            {/* Area Dropdown (2 cols) */}
            <SelectMenu className="lg:col-span-2" label={t('Khu vực', 'Area')} value={areaFilter} onChange={setAreaFilter} options={[
              { value: 'all', label: t('Toàn đảo Phú Quốc', 'Across Phu Quoc Island') },
              { value: 'An Thới', label: t('Cảng An Thới (Nam Đảo)', 'An Thoi Port (South Island)') },
              { value: 'Dương Đông', label: t('Dương Đông', 'Duong Dong') },
              { value: 'Bãi Sao', label: t('Bãi Sao', 'Bai Sao') },
              { value: 'Bãi Trường', label: t('Bãi Trường', 'Bai Truong') },
              { value: 'Sân bay', label: t('Sân bay PQC', 'PQC Airport') },
            ]} />

            {/* Price Dropdown (1.5 cols) */}
            <SelectMenu className="lg:col-span-2" label={t('Mức giá', 'Price')} value={priceFilter} onChange={setPriceFilter} options={[
              { value: 'all', label: t('Mọi mức giá', 'All prices') },
              { value: 'under500k', label: t('Dưới 500.000 đ', 'Under 500,000 VND') },
              { value: '500k-1m', label: t('500.000 đ đến 1 triệu', '500k to 1 million VND') },
              { value: 'above1m', label: t('Trên 1 triệu', 'Over 1 million VND') },
            ]} />

            {/* Rating Dropdown (1.5 cols) */}
            <SelectMenu className="lg:col-span-2" label={t('Đánh giá', 'Rating')} value={ratingFilter} onChange={setRatingFilter} options={[
              { value: 'all', label: t('Tất cả đánh giá', 'All ratings') },
              { value: '4.8', label: `4.8 ${t('trở lên', 'and above')}` },
              { value: '4.5', label: `4.5 ${t('trở lên', 'and above')}` },
            ]} />

            {/* Filter Action Buttons (1 col) */}
            <div className="lg:col-span-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setAreaFilter('all');
                  setPriceFilter('all');
                  setRatingFilter('all');
                  setSortOrder('popular');
                }}
                title={t('Đặt lại bộ lọc', 'Reset filters')}
                className="min-h-14 w-full px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#087f78] text-xs font-bold"
              >
                {t('Đặt lại', 'Reset')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Left Service Cards (7 cols), Right Map (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Cards */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pb-1">
              <span className="font-bold text-gray-800">
                {t('Tìm thấy', 'Found')} {filteredServices.length} {t('dịch vụ phù hợp', 'matching services')}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="hidden sm:inline">{t('Sắp xếp theo:', 'Sort by:')}</span>
                <SelectMenu compact className="min-w-44" label={t('Sắp xếp', 'Sort')} value={sortOrder} onChange={(value) => setSortOrder(value as typeof sortOrder)} options={[
                  { value: 'popular', label: t('Phổ biến nhất', 'Most popular') },
                  { value: 'price-asc', label: t('Giá tăng dần', 'Price: low to high') },
                  { value: 'rating-desc', label: t('Đánh giá cao nhất', 'Highest rated') },
                ]} />
              </div>
            </div>

            {filteredServices.map((service) => {
              const source = services.find((item) => item.id === service.id);
              const display = lang === 'vi' ? service : {
                ...service,
                ...(source ? { title: source.en, description: source.descriptionEn, categoryBadge: categoryLabels[source.category].en, area: areaInEnglish(source.area), priceUnit: unitInEnglish(service.priceUnit) } : {}),
                ...EN_SERVICE_DATA[service.id],
                price: service.price.replaceAll('.', ',').replace('đ', 'VND'),
                originalPrice: service.originalPrice?.replaceAll('.', ',').replace('đ', 'VND'),
              };
              const isFav = favorites.includes(service.id);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-[#087f78] hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
                >
                  {/* Image Column */}
                  <div className="relative w-full sm:w-56 h-48 sm:h-auto rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={service.imageUrl}
                      alt={display.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                        {display.categoryBadge}
                      </span>
                      {display.highlightBadge && (
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                          {display.highlightBadge}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(service.id, e)}
                      aria-pressed={isFav}
                      aria-label={isFav ? t('Bỏ lưu dịch vụ', 'Remove saved service') : t('Lưu dịch vụ', 'Save service')}
                      className={`absolute top-2.5 right-2.5 min-h-7 px-2 rounded-full flex items-center justify-center text-xs backdrop-blur-md transition-colors ${
                        isFav ? 'bg-emerald-50 text-[#087f78]' : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Heart size={18} weight={isFav ? "fill" : "regular"} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Rating */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span className="font-medium flex items-center gap-1">
                          {display.area}
                        </span>
                        {service.reviewsCount > 0 && <div className="flex items-center gap-1 font-bold text-gray-800">
                          <span>{service.rating}</span>
                          <span className="text-gray-500 font-normal">({service.reviewsCount})</span>
                        </div>}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onViewServiceDetail(service)}
                        className="font-black text-base text-gray-900 hover:text-[#087f78] cursor-pointer transition-colors leading-snug mb-2"
                      >
                        {display.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {display.description}
                      </p>

                      {/* Perks */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {display.perks.map((perk, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-xs font-bold bg-emerald-50 text-[#087f78] px-2 py-0.5 rounded-md border border-emerald-100"
                          >
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {service.originalPrice && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-gray-500 line-through">{display.originalPrice}</span>
                            <span className="text-xs font-bold text-[#087f78] bg-emerald-50 px-1 rounded-[10px]">
                              {service.discountBadge}
                            </span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-500 font-medium">{t('Từ', 'From')}</span>
                           <span className="text-xl font-black text-[#087f78]">{display.price}</span>
                          <span className="text-xs text-gray-500">{display.priceUnit}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddServiceToAi(service)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-[#087f78] border border-emerald-200 transition-colors flex items-center gap-1"
                        >

                          <Sparkle size={15} aria-hidden="true" /><span>{t('Thêm vào AI', 'Add to AI')}</span>
                        </button>
                        <button
                          onClick={() => onViewServiceDetail(service)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#087f78] hover:bg-[#066862] text-white shadow-sm transition-colors flex items-center gap-1"
                        >
                          <span>{t('Xem chi tiết', 'View details')}</span><ArrowRight size={15} aria-hidden="true" />

                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredServices.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="font-bold text-gray-900">{t('Không tìm thấy dịch vụ phù hợp.', 'No matching services found.')}</p>
                <p className="text-sm text-gray-500 mt-1">{t('Thử từ khóa khác hoặc đặt lại bộ lọc.', 'Try another search or reset the filters.')}</p>
                <button type="button" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setAreaFilter('all'); setPriceFilter('all'); setRatingFilter('all'); }} className="mt-4 min-h-11 px-4 rounded-xl border border-emerald-200 text-[#087f78] font-bold">{t('Đặt lại bộ lọc', 'Reset filters')}</button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Island Map & POI Tip */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            {/* Map Container */}
            <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#087f78]" weight="bold" />
                  <span>{t('Bản đồ Đảo Ngọc', 'Island map')}</span>
                </span>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMapMode('standard')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mapMode === 'standard' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t('Bản đồ', 'Map')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapMode('satellite')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mapMode === 'satellite' ? 'bg-white text-[#087f78] shadow-xs' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t('Vệ tinh', 'Satellite')}
                  </button>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                <iframe
                  title={t('Bản đồ du lịch Phú Quốc', 'Phu Quoc travel map')}
                  width="100%"
                  height="100%"
                  className="border-0"
                  src={phuQuocGoogleMapUrl({ satellite: mapMode === 'satellite' })}
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 border border-emerald-200 shadow-xs">
                   {t('Đang xem: Phú Quốc (Đảo Ngọc)', 'Viewing: Phu Quoc Island')}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 text-xs">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Phú Quốc, Kiên Giang')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-bold text-[#087f78] hover:underline"
                >
                  {t('Mở trong Google Maps ↗', 'Open in Google Maps ↗')}
                </a>
                <a
                  href={phuQuocMapUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-gray-400 hover:text-gray-600 hover:underline"
                >
                  {t('Xem OpenStreetMap', 'View OpenStreetMap')}
                </a>
              </div>

              {/* Selected POI Details Card */}
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">

                    <h4 className="font-bold text-sm text-gray-900">{poi.title}</h4>
                  </div>
                  <span className="text-xs font-black text-[#087f78] bg-emerald-50 px-2 py-0.5 rounded-[10px]">
                    {poi.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  {poi.desc}
                </p>

                <div className="flex items-center justify-between text-xs font-bold">
                  <a href="#services-list" className="text-[#087f78] hover:underline flex items-center gap-1">
                    <span>{t('Xem tour tại điểm này', 'View tours here')}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${poi.title} Phu Quoc`)}`,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1 min-h-11"
                  >
                     <span>{t('Chỉ đường', 'Directions')}</span>
                  </button>
                </div>
              </div>

              {/* Local Smart Tip Box */}
              <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2.5">

                <div className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-[#087f78] block mb-0.5">{t('Mẹo địa phương GOPU:', 'GOPU local tip:')}</strong>
                  {poi.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat with AI Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenAiPlanner}
          className="bg-gradient-to-r from-[#087f78] to-teal-600 hover:from-[#066862] hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all border border-emerald-300/30"
        >

          <Sparkle size={22} weight="fill" aria-hidden="true" /><div className="text-left leading-tight">
            <span className="block font-black">{t('Chat với GOPU AI', 'Chat with GOPU AI')}</span>
            <span className="text-xs text-emerald-200 font-normal">{t('Tạo lịch trình tự động 24/7', 'Plan your trip anytime')}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

