export type ServiceCategory = 'tour' | 'transport' | 'wellness' | 'stay' | 'laundry' | 'restaurant';
export type Lang = 'vi' | 'en';
export type PriceUnit = 'per-person' | 'per-night' | 'per-vehicle' | 'per-item' | 'per-serving' | 'per-kg';
export type ServiceReview = { rating: number; commentVi: string; commentEn: string };

/**
 * One label/value row in a service detail panel.
 *
 * `illustrative: true` means the value was written for the demo and has NOT been
 * confirmed with the provider. The UI must mark those rows, because PRODUCT.md
 * forbids presenting unverified listing facts as if they were confirmed.
 */
export type ServiceFact = {
  labelVi: string;
  labelEn: string;
  valueVi: string;
  valueEn: string;
  illustrative?: boolean;
};

/** Category-specific detail shown before the booking form. All fields optional. */
export type ServiceDetail = {
  facts?: ServiceFact[];
  chipsLabelVi?: string;
  chipsLabelEn?: string;
  chipsVi?: string[];
  chipsEn?: string[];
  listLabelVi?: string;
  listLabelEn?: string;
  listVi?: string[];
  listEn?: string[];
};

export type Service = {
  id: string;
  category: ServiceCategory;
  area: string;
  vi: string;
  en: string;
  descriptionVi: string;
  descriptionEn: string;
  price: number;
  priceUnit: PriceUnit;
  lat: number;
  lon: number;
  image: string;
  imageIsIllustrative?: boolean;
  rating: number;
  reviewCount: number;
  reviews: ServiceReview[];
};

export const services: Service[] = [
  { id: 'cano-an-thoi', category: 'tour', area: 'An Thới', vi: 'Cano khám phá quần đảo An Thới', en: 'An Thoi island boat tour', descriptionVi: 'Hành trình qua những đảo nhỏ và bãi biển phía nam.', descriptionEn: 'A journey through southern islets and beaches.', price: 450000, priceUnit: 'per-person', lat: 10.027, lon: 104.017, image: '/services/tour-cano.jpg', imageIsIllustrative: true, rating: 4.8, reviewCount: 36, reviews: [{ rating: 5, commentVi: 'Cảnh biển rất đẹp, lịch trình thoải mái.', commentEn: 'Beautiful sea views and a relaxed itinerary.' }, { rating: 4, commentVi: 'Trải nghiệm vui, nhớ chuẩn bị kem chống nắng.', commentEn: 'A fun trip; remember sunscreen.' }] },
  { id: 'xe-san-bay', category: 'transport', area: 'Dương Đông', vi: 'Xe đón sân bay Phú Quốc', en: 'Phu Quoc airport transfer', descriptionVi: 'Xe riêng từ sân bay đến khu vực trung tâm đảo.', descriptionEn: 'Private transfer from the airport to the island center.', price: 180000, priceUnit: 'per-vehicle', lat: 10.176, lon: 103.993, image: '/island-transfer.png', rating: 4.7, reviewCount: 22, reviews: [{ rating: 5, commentVi: 'Di chuyển thuận tiện và nhanh.', commentEn: 'A convenient and quick ride.' }] },
  { id: 'bien-bai-sao', category: 'tour', area: 'Bãi Sao', vi: 'Một ngày thư thả ở Bãi Sao', en: 'A relaxed day at Bai Sao', descriptionVi: 'Khám phá bờ cát trắng và các điểm dừng ven biển.', descriptionEn: 'Discover white sand and scenic coastal stops.', price: 320000, priceUnit: 'per-person', lat: 10.045, lon: 104.036, image: '/island-hero.png', rating: 4.6, reviewCount: 18, reviews: [{ rating: 5, commentVi: 'Bãi biển đẹp, hợp đi cùng gia đình.', commentEn: 'A lovely beach for a family visit.' }] },
  { id: 'spa-duong-dong', category: 'wellness', area: 'Dương Đông', vi: 'Liệu trình thư giãn sau chuyến đi', en: 'Post-trip wellness treatment', descriptionVi: 'Khoảng nghỉ nhẹ nhàng sau một ngày khám phá.', descriptionEn: 'A gentle break after a day of exploring.', price: 390000, priceUnit: 'per-person', lat: 10.215, lon: 103.959, image: '/island-hero.png', rating: 4.9, reviewCount: 14, reviews: [{ rating: 5, commentVi: 'Không gian yên tĩnh và dễ chịu.', commentEn: 'A calm and comfortable space.' }] },
  { id: 'luu-tru-bai-truong', category: 'stay', area: 'Bãi Trường', vi: 'Phòng nghỉ ven Bãi Trường', en: 'Bai Truong coastal stay', descriptionVi: 'Không gian nghỉ gần bãi biển, giá minh họa theo phòng/đêm.', descriptionEn: 'A stay near the beach, illustrative price per room/night.', price: 850000, priceUnit: 'per-night', lat: 10.165, lon: 103.966, image: '/island-hero.png', rating: 4.5, reviewCount: 27, reviews: [{ rating: 5, commentVi: 'Vị trí thuận tiện để ra biển.', commentEn: 'A convenient location for the beach.' }] },
  { id: 'giat-la-trung-tam', category: 'laundry', area: 'Dương Đông', vi: 'Giặt là nhận và trả tại trung tâm', en: 'Central pickup laundry', descriptionVi: 'Dịch vụ giặt là tiện lợi trong thời gian lưu trú.', descriptionEn: 'Convenient laundry during your island stay.', price: 90000, priceUnit: 'per-item', lat: 10.214, lon: 103.961, image: '/island-hero.png', rating: 4.4, reviewCount: 9, reviews: [{ rating: 4, commentVi: 'Nhận đồ và giao lại khá tiện.', commentEn: 'Pickup and delivery were convenient.' }] },
  { id: 'com-nha-phu-quoc', category: 'restaurant', area: 'Dương Đông', vi: 'Bữa cơm nhà vị biển đảo', en: 'Island-style home cooking', descriptionVi: 'Món ăn địa phương trong không gian gần gũi.', descriptionEn: 'Local dishes in a welcoming setting.', price: 160000, priceUnit: 'per-serving', lat: 10.218, lon: 103.963, image: '/island-hero.png', rating: 4.7, reviewCount: 41, reviews: [{ rating: 5, commentVi: 'Món địa phương ngon, khẩu phần vừa đủ.', commentEn: 'Tasty local dishes with generous portions.' }, { rating: 4, commentVi: 'Nên thử hải sản theo mùa.', commentEn: 'Try the seasonal seafood.' }] },
  { id: 'hai-san-bai-truong', category: 'restaurant', area: 'Bãi Trường', vi: 'Hải sản chiều bên Bãi Trường', en: 'Bai Truong seaside seafood', descriptionVi: 'Gợi ý bữa tối hải sản, giá minh họa theo phần.', descriptionEn: 'A seafood dinner suggestion, illustrative price per serving.', price: 220000, priceUnit: 'per-serving', lat: 10.164, lon: 103.968, image: '/island-hero.png', rating: 4.6, reviewCount: 32, reviews: [{ rating: 5, commentVi: 'Ngắm hoàng hôn rất đẹp.', commentEn: 'Lovely sunset views.' }] },
  { id: 'khach-san-duong-dong', category: 'stay', area: 'Dương Đông', vi: 'Phòng nghỉ trung tâm Dương Đông', en: 'Central Duong Dong room', descriptionVi: 'Chỗ nghỉ minh họa gần khu vực trung tâm, giá theo phòng/đêm.', descriptionEn: 'Illustrative central stay, price per room/night.', price: 720000, priceUnit: 'per-night', lat: 10.211, lon: 103.962, image: '/island-hero.png', rating: 4.3, reviewCount: 19, reviews: [{ rating: 4, commentVi: 'Gần nhiều địa điểm ăn uống.', commentEn: 'Close to several places to eat.' }] },
  { id: 'nha-hang-ra-khoi', category: 'restaurant', area: 'Dương Đông', vi: 'Nhà hàng hải sản Ra Khơi', en: 'Ra Khoi Seafood Restaurant', descriptionVi: 'Nhà hàng hải sản tại khu vực đường 30/4, Dương Đông. Ảnh và giá trong bản demo chỉ mang tính minh họa, chưa xác minh.', descriptionEn: 'Seafood restaurant around 30/4 Street, Duong Dong. Demo image and price are illustrative and unverified.', price: 250000, priceUnit: 'per-serving', lat: 10.211, lon: 103.965, image: '/services/restaurant-seafood.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'nha-hang-xin-chao', category: 'restaurant', area: 'Dương Đông', vi: 'Nhà hàng Xin Chào', en: 'Xin Chao Restaurant', descriptionVi: 'Nhà hàng hải sản tại 66 Trần Hưng Đạo, gần khu vực biển Dương Đông. Ảnh và giá demo chưa xác minh.', descriptionEn: 'Seafood restaurant at 66 Tran Hung Dao, near the Duong Dong waterfront. Demo image and price are unverified.', price: 250000, priceUnit: 'per-serving', lat: 10.207, lon: 103.962, image: '/services/restaurant-sunset.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'nha-hang-song-xanh', category: 'restaurant', area: 'Dương Đông', vi: 'Nhà hàng Sông Xanh', en: 'Song Xanh Restaurant', descriptionVi: 'Nhà hàng bên sông trên đường 30/4, khu phố 1. Ảnh và giá demo chưa xác minh.', descriptionEn: 'Riverside restaurant on 30/4 Street, Quarter 1. Demo image and price are unverified.', price: 220000, priceUnit: 'per-serving', lat: 10.209, lon: 103.964, image: '/services/restaurant-riverside.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'bun-quay-kien-xay', category: 'restaurant', area: 'Dương Đông', vi: 'Bún Quậy Kiến Xây', en: 'Kien Xay Bun Quay', descriptionVi: 'Quán bún quậy địa phương tại 28 Bạch Đằng, Dương Đông. Ảnh minh họa; giá demo chưa xác minh.', descriptionEn: 'Local bun quay eatery at 28 Bach Dang, Duong Dong. Illustrative image; demo price is unverified.', price: 80000, priceUnit: 'per-serving', lat: 10.217, lon: 103.961, image: '/services/bun-quay.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'nightgo-laundry', category: 'laundry', area: 'Dương Đông', vi: 'NightGo Laundry · Giặt sấy trong ngày', en: 'NightGo Laundry · Same-day wash & dry', descriptionVi: 'Dịch vụ tại hẻm 124 Trần Hưng Đạo, Dương Đông. Website nhà cung cấp nêu thời gian tiêu chuẩn khoảng 3–4 giờ; ảnh minh họa, giá demo chưa xác minh.', descriptionEn: 'Service at Alley 124 Tran Hung Dao, Duong Dong. Provider website lists standard turnaround around 3–4 hours; illustrative image and unverified demo price.', price: 45000, priceUnit: 'per-kg', lat: 10.205, lon: 103.963, image: '/services/laundry.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'seashells-phu-quoc', category: 'stay', area: 'Dương Đông', vi: 'Seashells Phu Quoc Hotel & Spa', en: 'Seashells Phu Quoc Hotel & Spa', descriptionVi: 'Khách sạn tại 01 Võ Thị Sáu, Dương Đông. Ảnh minh họa; giá demo theo phòng/đêm chưa xác minh.', descriptionEn: 'Hotel at 01 Vo Thi Sau, Duong Dong. Illustrative image; demo room/night price is unverified.', price: 1800000, priceUnit: 'per-night', lat: 10.216, lon: 103.960, image: '/services/hotel-seaside.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'la-veranda-phu-quoc', category: 'stay', area: 'Dương Đông', vi: 'La Veranda Resort Phú Quốc – MGallery', en: 'La Veranda Resort Phu Quoc – MGallery', descriptionVi: 'Khu nghỉ dưỡng trên đường Trần Hưng Đạo, Dương Đông. Ảnh minh họa; giá demo theo phòng/đêm chưa xác minh.', descriptionEn: 'Resort on Tran Hung Dao Street, Duong Dong. Illustrative image; demo room/night price is unverified.', price: 3500000, priceUnit: 'per-night', lat: 10.193, lon: 103.963, image: '/services/hotel-boutique.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'premier-village-phu-quoc', category: 'stay', area: 'Mũi Ông Đội', vi: 'Premier Village Phu Quoc Resort', en: 'Premier Village Phu Quoc Resort', descriptionVi: 'Khu nghỉ dưỡng tại Mũi Ông Đội, phía nam đảo. Ảnh minh họa; giá demo theo phòng/đêm chưa xác minh.', descriptionEn: 'Resort at Ong Doi Cape in southern Phu Quoc. Illustrative image; demo room/night price is unverified.', price: 6500000, priceUnit: 'per-night', lat: 10.002, lon: 104.05, image: '/services/hotel-villa.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'thue-xe-may', category: 'transport', area: 'Dương Đông & Toàn đảo', vi: 'Thuê xe máy tay ga giao miễn phí resort', en: 'Scooter rental with free resort delivery', descriptionVi: 'Xe Vision, Air Blade bảo dưỡng định kỳ, kèm 2 nón bảo hiểm sạch sẽ, áo mưa và bản đồ đường sá Phú Quốc.', descriptionEn: 'Vision & Air Blade scooters, including 2 clean helmets, raincoats, and Phu Quoc island road map.', price: 120000, priceUnit: 'per-item', lat: 10.211, lon: 103.962, image: '/island-transfer.png', rating: 4.9, reviewCount: 88, reviews: [{ rating: 5, commentVi: 'Xe mới, giao nhanh tận khách sạn.', commentEn: 'New scooter, delivered promptly to hotel.' }] },
  { id: 'cap-treo-hon-thom', category: 'tour', area: 'An Thới', vi: 'Vé cáp treo Hòn Thơm & Công viên nước', en: 'Hon Thom Cable Car & Water Park', descriptionVi: 'Cáp treo 2 chiều vượt biển dài nhất thế giới kèm vé vui chơi công viên nước Aquatopia.', descriptionEn: '2-way world record sea cable car plus entry to Aquatopia water park.', price: 650000, priceUnit: 'per-person', lat: 10.021, lon: 104.012, image: '/services/tour-cano.jpg', rating: 4.9, reviewCount: 512, reviews: [{ rating: 5, commentVi: 'Cảnh từ cáp treo ngoạn mục, công viên nước chơi vui.', commentEn: 'Spectacular cable car views, great water park.' }] },
  { id: 'sunset-sanato-phu-quoc', category: 'tour', area: 'Bãi Trường', vi: 'Check-in hoàng hôn Sunset Sanato', en: 'Sunset Sanato sunset check-in', descriptionVi: 'Khu check-in ven biển Bãi Trường, đông nhất vào khung giờ hoàng hôn. Giá và khung giờ trong bản demo chỉ mang tính minh họa.', descriptionEn: 'A beachfront check-in spot at Bai Truong, busiest around sunset. Demo price and hours are illustrative only.', price: 100000, priceUnit: 'per-person', lat: 10.165, lon: 103.966, image: '/island-hero.png', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
  { id: 'cau-muc-dem-an-thoi', category: 'tour', area: 'An Thới', vi: 'Tàu câu mực đêm & cháo mực trên biển', en: 'Night squid fishing & squid porridge', descriptionVi: 'Ra khơi buổi tối cùng ngư dân địa phương. Giá, giờ tàu chạy và thực đơn trong bản demo là minh họa, chưa xác minh.', descriptionEn: 'An evening boat trip with local fishermen. Demo price, departure times and menu are illustrative and unverified.', price: 350000, priceUnit: 'per-person', lat: 10.027, lon: 104.017, image: '/services/tour-cano.jpg', imageIsIllustrative: true, rating: 0, reviewCount: 0, reviews: [] },
];

export const serviceIds = services.map((service) => service.id);

export function estimateServiceCost(service: Service, guests: number, tripDays: number): number {
  switch (service.priceUnit) {
    case 'per-person':
    case 'per-serving': return service.price * guests;
    case 'per-night': return service.price * Math.max(1, tripDays - 1);
    case 'per-vehicle':
    case 'per-item':
    case 'per-kg': return service.price;
  }
}

export function priceUnitLabel(unit: PriceUnit, lang: 'vi' | 'en'): string {
  const labels = {
    vi: { 'per-person': '/ người', 'per-night': '/ phòng / đêm', 'per-vehicle': '/ xe', 'per-item': '/ món', 'per-serving': '/ phần', 'per-kg': '/ kg' },
    en: { 'per-person': '/ person', 'per-night': '/ room / night', 'per-vehicle': '/ vehicle', 'per-item': '/ item', 'per-serving': '/ serving', 'per-kg': '/ kg' },
  };
  return labels[lang][unit];
}

/**
 * Detail data lives beside the catalog instead of inline on every listing row so
 * the rows above stay readable.
 *
 * Everything marked `illustrative: true` is written for the demo. Opening hours,
 * seating, phone numbers and dish lists were NOT confirmed with the providers, so
 * the UI marks those rows and never presents them as verified facts.
 */
export const serviceDetails: Record<string, ServiceDetail> = {
  // ---------- Nhà hàng ----------
  'com-nha-phu-quoc': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '10:30 – 21:30', valueEn: '10:30 – 21:30', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '120.000 – 250.000 ₫', valueEn: '120,000 – 250,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~40 chỗ', valueEn: '~40 seats', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Nên đặt trước 2 giờ', valueEn: 'Book about 2 hours ahead', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 399 1188', valueEn: '0297 399 1188', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Máy lạnh', 'Giữ xe miễn phí', 'Nhận đoàn nhỏ', 'Có món chay'],
    chipsEn: ['Air conditioning', 'Free parking', 'Small groups', 'Vegetarian options'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Cá bớp kho tộ', 'Mực hấp gừng', 'Canh chua cá bớp', 'Rau rừng xào tỏi'],
    listEn: ['Clay-pot cobia', 'Steamed squid with ginger', 'Cobia sour soup', 'Stir-fried wild greens'],
  },
  'hai-san-bai-truong': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '11:00 – 22:00', valueEn: '11:00 – 22:00', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '180.000 – 400.000 ₫', valueEn: '180,000 – 400,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~120 chỗ', valueEn: '~120 seats', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Nên đặt trước 1 ngày', valueEn: 'Book about a day ahead', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 399 2266', valueEn: '0297 399 2266', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['View biển', 'Bàn ngoài trời', 'Giữ xe', 'Nhận đoàn lớn'],
    chipsEn: ['Sea view', 'Outdoor seating', 'Parking', 'Large groups'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Ghẹ Hàm Ninh hấp', 'Tôm sú nướng muối ớt', 'Mực nhảy nướng', 'Sò huyết cháy tỏi'],
    listEn: ['Steamed Ham Ninh crab', 'Grilled tiger prawns', 'Grilled jumping squid', 'Blood cockles with garlic'],
  },
  'nha-hang-ra-khoi': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '10:00 – 22:30', valueEn: '10:00 – 22:30', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '200.000 – 450.000 ₫', valueEn: '200,000 – 450,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~150 chỗ', valueEn: '~150 seats', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Không bắt buộc; cuối tuần nên đặt', valueEn: 'Not required; weekends recommended', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 384 6138', valueEn: '0297 384 6138', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Hồ hải sản sống', 'Cân tại chỗ', 'Máy lạnh', 'Giữ xe'],
    chipsEn: ['Live seafood tank', 'On-site scale', 'Air conditioning', 'Parking'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Hải sản chọn tại hồ', 'Cá mú hấp Hồng Kông', 'Tôm hùm nướng', 'Cơm chiên hải sản'],
    listEn: ['Seafood picked from the tank', 'Steamed grouper, Hong Kong style', 'Grilled lobster', 'Seafood fried rice'],
  },
  'nha-hang-xin-chao': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '10:00 – 23:00', valueEn: '10:00 – 23:00', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '200.000 – 500.000 ₫', valueEn: '200,000 – 500,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~200 chỗ, 2 tầng', valueEn: '~200 seats over 2 floors', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Nên đặt trước 1 ngày', valueEn: 'Book about a day ahead', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 384 7288', valueEn: '0297 384 7288', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['View biển trực diện', 'Sân thượng', 'Cocktail', 'Giữ xe'],
    chipsEn: ['Direct sea view', 'Rooftop', 'Cocktails', 'Parking'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Cocktail hoàng hôn', 'Hải sản nướng than', 'Bò lúc lắc', 'Bánh xèo hải sản'],
    listEn: ['Sunset cocktail', 'Charcoal-grilled seafood', 'Shaking beef', 'Seafood banh xeo'],
  },
  'nha-hang-song-xanh': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '09:00 – 22:00', valueEn: '09:00 – 22:00', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '150.000 – 350.000 ₫', valueEn: '150,000 – 350,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~90 chỗ', valueEn: '~90 seats', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Nên đặt trước 4 giờ', valueEn: 'Book about 4 hours ahead', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 399 5050', valueEn: '0297 399 5050', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Ven sông', 'Sân vườn', 'Có món chay', 'Giữ xe'],
    chipsEn: ['Riverside', 'Garden seating', 'Vegetarian options', 'Parking'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Lẩu cá bớp', 'Gỏi cá trích', 'Mực chiên nước mắm', 'Chè chuối'],
    listEn: ['Cobia hotpot', 'Herring salad', 'Squid in fish sauce', 'Banana dessert'],
  },
  'bun-quay-kien-xay': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '06:00 – 21:00', valueEn: '06:00 – 21:00', illustrative: true },
      { labelVi: 'Khoảng giá mỗi khách', labelEn: 'Price per guest', valueVi: '60.000 – 120.000 ₫', valueEn: '60,000 – 120,000 ₫', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Seating', valueVi: '~60 chỗ', valueEn: '~60 seats', illustrative: true },
      { labelVi: 'Đặt bàn trước', labelEn: 'Reservation lead time', valueVi: 'Không nhận đặt bàn', valueEn: 'Walk-in only', illustrative: true },
      { labelVi: 'Điện thoại', labelEn: 'Phone', valueVi: '0297 399 3456', valueEn: '0297 399 3456', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Nước chấm pha tại bàn', 'Mở sớm', 'Bán mang về', 'Giữ xe'],
    chipsEn: ['DIY dipping sauce', 'Opens early', 'Takeaway', 'Parking'],
    listLabelVi: 'Món nên thử', listLabelEn: 'Dishes to try',
    listVi: ['Bún quậy tôm', 'Bún quậy mực', 'Chả giò', 'Nước mắm pha theo ý'],
    listEn: ['Bun quay with prawn', 'Bun quay with squid', 'Fried spring rolls', 'Custom dipping sauce'],
  },

  // ---------- Lưu trú ----------
  'luu-tru-bai-truong': {
    facts: [
      { labelVi: 'Nhận phòng', labelEn: 'Check-in', valueVi: 'Từ 14:00', valueEn: 'From 14:00', illustrative: true },
      { labelVi: 'Trả phòng', labelEn: 'Check-out', valueVi: 'Trước 12:00', valueEn: 'Before 12:00', illustrative: true },
      { labelVi: 'Hạng phòng', labelEn: 'Room types', valueVi: 'Standard, Deluxe hướng biển, Family', valueEn: 'Standard, Sea-view Deluxe, Family', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 3 ngày', valueEn: 'Book about 3 days ahead', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Hồ bơi', 'WiFi', 'Bãi đỗ xe', 'Ăn sáng'],
    chipsEn: ['Pool', 'WiFi', 'Parking', 'Breakfast'],
  },
  'khach-san-duong-dong': {
    facts: [
      { labelVi: 'Nhận phòng', labelEn: 'Check-in', valueVi: 'Từ 14:00', valueEn: 'From 14:00', illustrative: true },
      { labelVi: 'Trả phòng', labelEn: 'Check-out', valueVi: 'Trước 12:00', valueEn: 'Before 12:00', illustrative: true },
      { labelVi: 'Hạng phòng', labelEn: 'Room types', valueVi: 'Standard, Superior', valueEn: 'Standard, Superior', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 2 ngày', valueEn: 'Book about 2 days ahead', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['WiFi', 'Máy lạnh', 'Thuê xe máy', 'Gần chợ đêm'],
    chipsEn: ['WiFi', 'Air conditioning', 'Scooter rental', 'Near night market'],
  },
  'seashells-phu-quoc': {
    facts: [
      { labelVi: 'Nhận phòng', labelEn: 'Check-in', valueVi: 'Từ 15:00', valueEn: 'From 15:00', illustrative: true },
      { labelVi: 'Trả phòng', labelEn: 'Check-out', valueVi: 'Trước 12:00', valueEn: 'Before 12:00', illustrative: true },
      { labelVi: 'Hạng phòng', labelEn: 'Room types', valueVi: 'Deluxe, Suite, Panorama', valueEn: 'Deluxe, Suite, Panorama', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 7 ngày', valueEn: 'Book about 7 days ahead', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Hồ bơi vô cực', 'Spa', 'Phòng gym', 'Bãi biển riêng'],
    chipsEn: ['Infinity pool', 'Spa', 'Gym', 'Private beach'],
  },
  'la-veranda-phu-quoc': {
    facts: [
      { labelVi: 'Nhận phòng', labelEn: 'Check-in', valueVi: 'Từ 14:00', valueEn: 'From 14:00', illustrative: true },
      { labelVi: 'Trả phòng', labelEn: 'Check-out', valueVi: 'Trước 12:00', valueEn: 'Before 12:00', illustrative: true },
      { labelVi: 'Hạng phòng', labelEn: 'Room types', valueVi: 'Garden, Ocean, Villa', valueEn: 'Garden, Ocean, Villa', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 7 ngày', valueEn: 'Book about 7 days ahead', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Bãi biển riêng', 'Spa', 'Nhà hàng', 'Xe đưa đón sân bay'],
    chipsEn: ['Private beach', 'Spa', 'Restaurant', 'Airport transfer'],
  },
  'premier-village-phu-quoc': {
    facts: [
      { labelVi: 'Nhận phòng', labelEn: 'Check-in', valueVi: 'Từ 15:00', valueEn: 'From 15:00', illustrative: true },
      { labelVi: 'Trả phòng', labelEn: 'Check-out', valueVi: 'Trước 12:00', valueEn: 'Before 12:00', illustrative: true },
      { labelVi: 'Hạng phòng', labelEn: 'Room types', valueVi: 'Villa 1 phòng ngủ, Villa 2 phòng ngủ, Villa sát biển', valueEn: '1-bedroom Villa, 2-bedroom Villa, Beachfront Villa', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 10 ngày', valueEn: 'Book about 10 days ahead', illustrative: true },
    ],
    chipsLabelVi: 'Tiện ích', chipsLabelEn: 'Amenities',
    chipsVi: ['Hồ bơi riêng', 'Golf', 'Spa', 'Bãi biển riêng'],
    chipsEn: ['Private pool', 'Golf', 'Spa', 'Private beach'],
  },

  // ---------- Tour & trải nghiệm ----------
  'cano-an-thoi': {
    facts: [
      { labelVi: 'Giờ khởi hành', labelEn: 'Departure', valueVi: '08:00 và 13:00', valueEn: '08:00 and 13:00', illustrative: true },
      { labelVi: 'Thời lượng', labelEn: 'Duration', valueVi: 'Khoảng 6 giờ', valueEn: 'About 6 hours', illustrative: true },
      { labelVi: 'Điểm tập trung', labelEn: 'Meeting point', valueVi: 'Cảng An Thới', valueEn: 'An Thoi harbour', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Vé cano', 'Áo phao', 'Ăn trưa trên đảo', 'Ống thở và kính lặn'],
    listEn: ['Boat ticket', 'Life jacket', 'Lunch on the island', 'Snorkel and mask'],
  },
  'bien-bai-sao': {
    facts: [
      { labelVi: 'Giờ khởi hành', labelEn: 'Departure', valueVi: '09:00', valueEn: '09:00', illustrative: true },
      { labelVi: 'Thời lượng', labelEn: 'Duration', valueVi: 'Khoảng 4 giờ', valueEn: 'About 4 hours', illustrative: true },
      { labelVi: 'Điểm tập trung', labelEn: 'Meeting point', valueVi: 'Bãi Sao', valueEn: 'Sao Beach', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Ghế nằm', 'Dù che', 'Nước uống', 'Khăn tắm'],
    listEn: ['Sun lounger', 'Parasol', 'Drinking water', 'Towel'],
  },
  'cap-treo-hon-thom': {
    facts: [
      { labelVi: 'Giờ hoạt động', labelEn: 'Operating hours', valueVi: '09:00 – 17:00', valueEn: '09:00 – 17:00', illustrative: true },
      { labelVi: 'Thời lượng', labelEn: 'Duration', valueVi: '5 – 6 giờ', valueEn: '5 – 6 hours', illustrative: true },
      { labelVi: 'Điểm tập trung', labelEn: 'Meeting point', valueVi: 'Ga An Thới', valueEn: 'An Thoi station', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Vé cáp treo 2 chiều', 'Vé công viên nước Aquatopia', 'Xe điện trong khu'],
    listEn: ['Return cable car ticket', 'Aquatopia water park entry', 'Shuttle within the complex'],
  },

  'sunset-sanato-phu-quoc': {
    facts: [
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '07:00 – 21:00', valueEn: '07:00 – 21:00', illustrative: true },
      { labelVi: 'Giờ hoàng hôn đẹp nhất', labelEn: 'Best sunset window', valueVi: '17:15 – 18:15', valueEn: '17:15 – 18:15', illustrative: true },
      { labelVi: 'Thời lượng tham quan', labelEn: 'Suggested visit', valueVi: '1 – 2 giờ', valueEn: '1 – 2 hours', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Vé vào cổng', 'Một đồ uống tại quầy bar ven biển'],
    listEn: ['Entrance ticket', 'One drink at the beach bar'],
  },

  'cau-muc-dem-an-thoi': {
    facts: [
      { labelVi: 'Giờ khởi hành', labelEn: 'Departure', valueVi: '17:30 hằng ngày', valueEn: '17:30 daily', illustrative: true },
      { labelVi: 'Thời lượng', labelEn: 'Duration', valueVi: 'Khoảng 4 giờ', valueEn: 'About 4 hours', illustrative: true },
      { labelVi: 'Điểm tập trung', labelEn: 'Meeting point', valueVi: 'Cảng An Thới', valueEn: 'An Thoi harbour', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Cần câu và mồi', 'Cháo mực nóng trên tàu', 'Áo phao'],
    listEn: ['Rod and bait', 'Hot squid porridge on board', 'Life jacket'],
  },

  // ---------- Di chuyển ----------
  'xe-san-bay': {
    facts: [
      { labelVi: 'Loại xe', labelEn: 'Vehicle', valueVi: 'Sedan 4 chỗ hoặc SUV 7 chỗ', valueEn: '4-seat sedan or 7-seat SUV', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Capacity', valueVi: '3 – 5 khách kèm hành lý', valueEn: '3 – 5 guests with luggage', illustrative: true },
      { labelVi: 'Chờ tại sân bay', labelEn: 'Airport waiting', valueVi: '60 phút miễn phí', valueEn: '60 minutes free', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['Tài xế đón tại ga đến', 'Biển tên', 'Nước uống'],
    listEn: ['Driver at arrivals', 'Name board', 'Drinking water'],
  },
  'thue-xe-may': {
    facts: [
      { labelVi: 'Loại xe', labelEn: 'Vehicle', valueVi: 'Vision hoặc Air Blade', valueEn: 'Vision or Air Blade', illustrative: true },
      { labelVi: 'Sức chứa', labelEn: 'Capacity', valueVi: '2 người', valueEn: '2 people', illustrative: true },
      { labelVi: 'Giao xe', labelEn: 'Delivery', valueVi: 'Tại khách sạn trong 30 phút', valueEn: 'To your hotel within 30 minutes', illustrative: true },
    ],
    listLabelVi: 'Bao gồm', listLabelEn: 'Included',
    listVi: ['2 nón bảo hiểm', 'Áo mưa', 'Bản đồ đường sá Phú Quốc'],
    listEn: ['2 helmets', 'Raincoat', 'Phu Quoc road map'],
  },

  // ---------- Wellness ----------
  'spa-duong-dong': {
    facts: [
      { labelVi: 'Thời lượng', labelEn: 'Duration', valueVi: '60 hoặc 90 phút', valueEn: '60 or 90 minutes', illustrative: true },
      { labelVi: 'Giờ mở cửa', labelEn: 'Opening hours', valueVi: '09:00 – 21:00', valueEn: '09:00 – 21:00', illustrative: true },
      { labelVi: 'Đặt trước', labelEn: 'Booking lead time', valueVi: 'Nên đặt trước 3 giờ', valueEn: 'Book about 3 hours ahead', illustrative: true },
    ],
    chipsLabelVi: 'Phù hợp', chipsLabelEn: 'Good for',
    chipsVi: ['Phòng đôi', 'Xông hơi', 'Trà thảo mộc'],
    chipsEn: ['Couples room', 'Steam room', 'Herbal tea'],
  },

  // ---------- Giặt là ----------
  'giat-la-trung-tam': {
    facts: [
      { labelVi: 'Thời gian xử lý', labelEn: 'Turnaround', valueVi: '6 – 8 giờ', valueEn: '6 – 8 hours', illustrative: true },
      { labelVi: 'Giờ nhận đồ', labelEn: 'Drop-off hours', valueVi: '07:00 – 19:00', valueEn: '07:00 – 19:00', illustrative: true },
      { labelVi: 'Hình thức', labelEn: 'Service mode', valueVi: 'Nhận và trả tại tiệm', valueEn: 'Drop off and collect in store', illustrative: true },
    ],
  },
  'nightgo-laundry': {
    facts: [
      { labelVi: 'Thời gian xử lý', labelEn: 'Turnaround', valueVi: '3 – 4 giờ', valueEn: '3 – 4 hours', illustrative: true },
      { labelVi: 'Giờ nhận đồ', labelEn: 'Drop-off hours', valueVi: '06:00 – 22:00', valueEn: '06:00 – 22:00', illustrative: true },
      { labelVi: 'Hình thức', labelEn: 'Service mode', valueVi: 'Nhận tại hẻm 124 Trần Hưng Đạo', valueEn: 'Drop off at Alley 124 Tran Hung Dao', illustrative: true },
    ],
  },
};

export const detailFor = (id: string): ServiceDetail | undefined => serviceDetails[id];

/** Panel heading per category, so each service shows its own kind of detail. */
export const categoryDetailLabel: Record<ServiceCategory, { vi: string; en: string }> = {
  restaurant: { vi: 'Thông tin nhà hàng', en: 'Restaurant details' },
  stay: { vi: 'Thông tin lưu trú', en: 'Stay details' },
  tour: { vi: 'Thông tin tour', en: 'Tour details' },
  transport: { vi: 'Thông tin di chuyển', en: 'Transport details' },
  wellness: { vi: 'Thông tin liệu trình', en: 'Treatment details' },
  laundry: { vi: 'Thông tin giặt là', en: 'Laundry details' },
};
