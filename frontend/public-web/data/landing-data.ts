export interface EcosystemService {
  id: string;
  title: string;
  desc: string;
  priceLabel: string;
  badge?: string;
  iconType: string;
  category: 'tour' | 'transport' | 'rental' | 'food';
}

export interface CuratedSpot {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: string;
  priceRange: string;
  area: string;
  tag: string;
  imageUrl: string;
}

export interface StandardPriceItem {
  id: string;
  serviceName: string;
  categoryBadge: string;
  priceRange: string;
  specNotes: string;
  area: string;
  actionText: string;
}

export interface TimelineActivity {
  time: string;
  title: string;
  description: string;
  location?: string;
  tag?: string;
}

// 1. Prompt chips cho Smart Hero
export const PROMPT_CHIPS = [
  'Lập lịch trình 3 ngày 2 đêm',
  'Tìm cano đi 4 đảo Phú Quốc uy tín',
  'Thuê xe máy tự lái giao tận sân bay',
  'Ăn hải sản ngon view biển',
  'Điểm ngắm hoàng hôn đẹp nhất',
];

// 2. Dữ liệu 10 dịch vụ cốt lõi (Mục 4)
export const ECOSYSTEM_SERVICES: EcosystemService[] = [
  {
    id: 'cano-tour',
    title: 'Cano tour',
    desc: 'Cano riêng, lặn ngắm san hô, tham quan 4 đảo Nam Phú Quốc',
    priceLabel: 'Từ 1.450.000đ/tour',
    badge: 'Bán chạy',
    iconType: 'boat',
    category: 'tour',
  },
  {
    id: 'airport-transfer',
    title: 'Đón tiễn sân bay',
    desc: 'Phòng chờ VIP, tài xế bản địa chu đáo, xe đời mới',
    priceLabel: 'Trọn gói từ 180.000đ',
    badge: 'Cam kết giờ',
    iconType: 'car',
    category: 'transport',
  },
  {
    id: 'motorbike-rental',
    title: 'Xe máy tự lái',
    desc: 'Giao xe tận nơi khách sạn/sân bay, mũ & xăng sẵn sàng',
    priceLabel: 'Từ 120.000đ/ngày',
    badge: 'Giao tận nơi',
    iconType: 'motorcycle',
    category: 'rental',
  },
  {
    id: 'private-boat',
    title: 'Thuê cano riêng',
    desc: 'An Thới & Nam Đảo, thuyền trưởng riêng, tự do lịch trình',
    priceLabel: 'Trọn gói từ 2.200.000đ',
    badge: 'Tiêu chuẩn VIP',
    iconType: 'anchor',
    category: 'tour',
  },
  {
    id: 'tour-car',
    title: 'Xe du lịch',
    desc: 'Xe 4 - 7 - 16 - 29 chỗ, tài xế kiêm hướng dẫn địa phương',
    priceLabel: 'Từ 800.000đ/ngày',
    badge: 'Theo ngày',
    iconType: 'van',
    category: 'transport',
  },
  {
    id: 'squid-fishing',
    title: 'Tàu câu & Câu mực',
    desc: 'Trải nghiệm đêm, câu mực, ngắm hoàng hôn vịnh Thái Lan',
    priceLabel: 'Vé lẻ từ 350.000đ',
    badge: 'Ngắm hoàng hôn',
    iconType: 'fish',
    category: 'tour',
  },
  {
    id: 'south-island-tour',
    title: 'Tour Nam Đảo',
    desc: 'Cáp treo Hòn Thơm, Thị trấn Hoàng Hôn Sunset Town',
    priceLabel: 'Vé trọn gói: 750.000đ',
    badge: 'Cáp treo 3 dây',
    iconType: 'map',
    category: 'tour',
  },
  {
    id: 'north-island-tour',
    title: 'Tour Bắc Đảo',
    desc: 'VinWonders, Safari, Grand World Thành phố không ngủ',
    priceLabel: 'Vé combo: 1.350.000đ',
    badge: 'Vé QR liền tay',
    iconType: 'compass',
    category: 'tour',
  },
  {
    id: 'water-sports',
    title: 'Thể thao biển',
    desc: 'Dù lượn ngắm biển, môtô nước, phao chuối cảm giác mạnh',
    priceLabel: 'Trọn gói từ 850.000đ',
    badge: 'Cảm giác mạnh',
    iconType: 'wave',
    category: 'tour',
  },
  {
    id: 'food-booking',
    title: 'Đặt bàn & Ẩm thực',
    desc: 'Hải sản làng chài Hàm Ninh, nhà hàng ven biển view đỉnh',
    priceLabel: 'Giảm 15% qua GOPU',
    badge: 'Ưu đãi 15%',
    iconType: 'utensils',
    category: 'food',
  },
];

// 3. Trải nghiệm không thể bỏ lỡ (Mục 6)
export const CURATED_SPOTS: CuratedSpot[] = [
  {
    id: 'bun-quay',
    title: 'Bún Quậy Kiến Xây & Thanh Hùng',
    category: 'Ăn uống nổi bật',
    rating: 4.8,
    reviewsCount: '1.2k đánh giá',
    priceRange: 'Từ 55.000đ',
    area: 'Dương Đông',
    tag: 'Đặc sản đảo',
    imageUrl: '/island-hero.png',
  },
  {
    id: 'bien-gio',
    title: 'Nhà Hàng Biển Gió Dương Đông',
    category: 'Hải sản tươi sống',
    rating: 4.9,
    reviewsCount: '860 đánh giá',
    priceRange: 'Từ 180.000đ',
    area: 'Dương Đông',
    tag: 'View hoàng hôn',
    imageUrl: '/island-boat.png',
  },
  {
    id: 'sunset-sanato',
    title: 'Sunset Sanato Beach Club',
    category: 'Check-in hoàng hôn',
    rating: 4.7,
    reviewsCount: '2.4k đánh giá',
    priceRange: '100.000đ/vé',
    area: 'Bãi Trường',
    tag: 'Biểu tượng đàn voi',
    imageUrl: '/island-transfer.png',
  },
  {
    id: 'grand-world',
    title: 'Grand World - Thành Phố Không Ngủ',
    category: 'Vui chơi giải trí',
    rating: 4.9,
    reviewsCount: '3.1k đánh giá',
    priceRange: 'Miễn phí vé vào',
    area: 'Gành Dầu',
    tag: 'Show Tinh Hoa',
    imageUrl: '/island-hero.png',
  },
];

// 4. Bảng tra cứu giá chuẩn Đảo Ngọc (Mục 7)
export const STANDARD_PRICES: StandardPriceItem[] = [
  {
    id: 'bike',
    serviceName: 'Thuê xe máy tự lái (Ga & Số)',
    categoryBadge: 'Di chuyển',
    priceRange: '120.000 - 150.000đ / ngày',
    specNotes: 'Giao nhận miễn phí tại sân bay/khách sạn Dương Đông, kèm 2 mũ bảo hiểm đạt chuẩn',
    area: 'Dương Đông & Sân bay',
    actionText: 'Đặt ngay',
  },
  {
    id: 'airport-taxi',
    serviceName: 'Taxi / Xe đón tiễn Sân bay - Trung tâm',
    categoryBadge: 'Xe riêng',
    priceRange: '160.000 - 200.000đ / chuyến',
    specNotes: 'Xe riêng 4-7 chỗ không ghép khách, đón theo giờ hạ cánh thực tế chuyến bay',
    area: 'Sân bay -> Trần Hưng Đạo',
    actionText: 'Đặt xe',
  },
  {
    id: 'cano-4-islands',
    serviceName: 'Tour cano riêng 4 đảo Nam Phú Quốc + Lặn ngắm san hô',
    categoryBadge: 'Tour VIP',
    priceRange: '400.000 - 550.000đ / người (ghép)',
    specNotes: 'Bao gồm áo phao, kính lặn, sup, hỗ trợ quay flycam và chụp ảnh kỷ niệm miễn phí',
    area: 'Cảng An Thới',
    actionText: 'Chi tiết',
  },
  {
    id: 'seafood',
    serviceName: 'Hải sản tươi sống (Ghẹ Hàm Ninh, Tôm tích, Mực nhảy)',
    categoryBadge: 'Ẩm thực',
    priceRange: '350.000 - 650.000đ / kg',
    specNotes: 'Cân sống tại bể kính, bao ăn 1 đổi 1 nếu ốp hoặc không tươi, chế biến tính phí hợp lý',
    area: 'Làng chài Hàm Ninh',
    actionText: 'Xem quán',
  },
  {
    id: 'cable-car',
    serviceName: 'Vé cáp treo Hòn Thơm & Công viên nước Aquatopia',
    categoryBadge: 'Vé vui chơi',
    priceRange: '650.000 - 750.000đ / người',
    specNotes: 'Vé khứ hồi cáp treo vượt biển dài nhất thế giới, kèm buffet trưa (tùy gói combo)',
    area: 'Thị trấn Hoàng Hôn',
    actionText: 'Mua vé',
  },
];

// 5. Lịch trình mẫu 3N2Đ (Mục 8)
export const SAMPLE_TIMELINE: TimelineActivity[] = [
  {
    time: '08:30',
    title: 'Xe riêng đón tại khách sạn di chuyển về cảng An Thới',
    description: 'Tài xế đón đúng giờ tại sảnh khách sạn khu vực Dương Đông/Bãi Trường.',
    location: 'Cảng An Thới',
  },
  {
    time: '09:15',
    title: 'Khởi hành cano SB cao tốc khám phá cụm 4 đảo Nam',
    description: 'Tham quan Hòn Mây Rút Trong, Hòn Móng Tay, check-in bãi cát trắng mịn.',
    location: 'Hòn Mây Rút',
  },
  {
    time: '12:30',
    title: 'Ăn trưa hải sản 8 món tươi sống trên đảo',
    description: 'Thưởng thức lẩu cá bớp, mực hấp gừng, tôm nướng muối ớt, nhum nướng mỡ hành.',
    location: 'Hòn Mây Rút Trong',
  },
  {
    time: '14:30',
    title: 'Lặn ngắm san hô tự nhiên tại Hòn Gầm Ghì & Chụp SUP Flycam',
    description: 'Trang bị kính lặn cao cấp, áo phao tiêu chuẩn; đội ngũ media hỗ trợ ghi hình.',
    location: 'Hòn Gầm Ghì',
  },
  {
    time: '17:00',
    title: 'Cano cập bến cảng, ngắm trọn hoàng hôn Sunset Town',
    description: 'Dạo bước Cầu Hôn (Kiss Bridge), check-in Tháp Đồng Hồ Venice phong cách Địa Trung Hải.',
    location: 'Sunset Town',
  },
];

