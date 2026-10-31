export type ServiceCategory = 'tour' | 'transport' | 'wellness' | 'stay' | 'laundry' | 'restaurant';
export type Lang = 'vi' | 'en';
export type PriceUnit = 'per-person' | 'per-night' | 'per-vehicle' | 'per-item' | 'per-serving' | 'per-kg';
export type ServiceReview = { rating: number; commentVi: string; commentEn: string };
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
