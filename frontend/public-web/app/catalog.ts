export type ServiceCategory = 'tour' | 'transport' | 'wellness' | 'stay' | 'laundry' | 'restaurant';
export type Lang = 'vi' | 'en';
export type PriceUnit = 'per-person' | 'per-night' | 'per-vehicle' | 'per-item' | 'per-serving';
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
  rating: number;
  reviewCount: number;
  reviews: ServiceReview[];
};

export const services: Service[] = [
  { id: 'cano-an-thoi', category: 'tour', area: 'An Thới', vi: 'Cano khám phá quần đảo An Thới', en: 'An Thoi island boat tour', descriptionVi: 'Hành trình qua những đảo nhỏ và bãi biển phía nam.', descriptionEn: 'A journey through southern islets and beaches.', price: 450000, priceUnit: 'per-person', lat: 10.027, lon: 104.017, image: '/island-boat.png', rating: 4.8, reviewCount: 36, reviews: [{ rating: 5, commentVi: 'Cảnh biển rất đẹp, lịch trình thoải mái.', commentEn: 'Beautiful sea views and a relaxed itinerary.' }, { rating: 4, commentVi: 'Trải nghiệm vui, nhớ chuẩn bị kem chống nắng.', commentEn: 'A fun trip; remember sunscreen.' }] },
  { id: 'xe-san-bay', category: 'transport', area: 'Dương Đông', vi: 'Xe đón sân bay Phú Quốc', en: 'Phu Quoc airport transfer', descriptionVi: 'Xe riêng từ sân bay đến khu vực trung tâm đảo.', descriptionEn: 'Private transfer from the airport to the island center.', price: 180000, priceUnit: 'per-vehicle', lat: 10.176, lon: 103.993, image: '/island-transfer.png', rating: 4.7, reviewCount: 22, reviews: [{ rating: 5, commentVi: 'Di chuyển thuận tiện và nhanh.', commentEn: 'A convenient and quick ride.' }] },
  { id: 'bien-bai-sao', category: 'tour', area: 'Bãi Sao', vi: 'Một ngày thư thả ở Bãi Sao', en: 'A relaxed day at Bai Sao', descriptionVi: 'Khám phá bờ cát trắng và các điểm dừng ven biển.', descriptionEn: 'Discover white sand and scenic coastal stops.', price: 320000, priceUnit: 'per-person', lat: 10.045, lon: 104.036, image: '/island-hero.png', rating: 4.6, reviewCount: 18, reviews: [{ rating: 5, commentVi: 'Bãi biển đẹp, hợp đi cùng gia đình.', commentEn: 'A lovely beach for a family visit.' }] },
  { id: 'spa-duong-dong', category: 'wellness', area: 'Dương Đông', vi: 'Liệu trình thư giãn sau chuyến đi', en: 'Post-trip wellness treatment', descriptionVi: 'Khoảng nghỉ nhẹ nhàng sau một ngày khám phá.', descriptionEn: 'A gentle break after a day of exploring.', price: 390000, priceUnit: 'per-person', lat: 10.215, lon: 103.959, image: '/island-hero.png', rating: 4.9, reviewCount: 14, reviews: [{ rating: 5, commentVi: 'Không gian yên tĩnh và dễ chịu.', commentEn: 'A calm and comfortable space.' }] },
  { id: 'luu-tru-bai-truong', category: 'stay', area: 'Bãi Trường', vi: 'Phòng nghỉ ven Bãi Trường', en: 'Bai Truong coastal stay', descriptionVi: 'Không gian nghỉ gần bãi biển, giá minh họa theo phòng/đêm.', descriptionEn: 'A stay near the beach, illustrative price per room/night.', price: 850000, priceUnit: 'per-night', lat: 10.165, lon: 103.966, image: '/island-hero.png', rating: 4.5, reviewCount: 27, reviews: [{ rating: 5, commentVi: 'Vị trí thuận tiện để ra biển.', commentEn: 'A convenient location for the beach.' }] },
  { id: 'giat-la-trung-tam', category: 'laundry', area: 'Dương Đông', vi: 'Giặt là nhận và trả tại trung tâm', en: 'Central pickup laundry', descriptionVi: 'Dịch vụ giặt là tiện lợi trong thời gian lưu trú.', descriptionEn: 'Convenient laundry during your island stay.', price: 90000, priceUnit: 'per-item', lat: 10.214, lon: 103.961, image: '/island-hero.png', rating: 4.4, reviewCount: 9, reviews: [{ rating: 4, commentVi: 'Nhận đồ và giao lại khá tiện.', commentEn: 'Pickup and delivery were convenient.' }] },
  { id: 'com-nha-phu-quoc', category: 'restaurant', area: 'Dương Đông', vi: 'Bữa cơm nhà vị biển đảo', en: 'Island-style home cooking', descriptionVi: 'Món ăn địa phương trong không gian gần gũi.', descriptionEn: 'Local dishes in a welcoming setting.', price: 160000, priceUnit: 'per-serving', lat: 10.218, lon: 103.963, image: '/island-hero.png', rating: 4.7, reviewCount: 41, reviews: [{ rating: 5, commentVi: 'Món địa phương ngon, khẩu phần vừa đủ.', commentEn: 'Tasty local dishes with generous portions.' }, { rating: 4, commentVi: 'Nên thử hải sản theo mùa.', commentEn: 'Try the seasonal seafood.' }] },
  { id: 'hai-san-bai-truong', category: 'restaurant', area: 'Bãi Trường', vi: 'Hải sản chiều bên Bãi Trường', en: 'Bai Truong seaside seafood', descriptionVi: 'Gợi ý bữa tối hải sản, giá minh họa theo phần.', descriptionEn: 'A seafood dinner suggestion, illustrative price per serving.', price: 220000, priceUnit: 'per-serving', lat: 10.164, lon: 103.968, image: '/island-hero.png', rating: 4.6, reviewCount: 32, reviews: [{ rating: 5, commentVi: 'Ngắm hoàng hôn rất đẹp.', commentEn: 'Lovely sunset views.' }] },
  { id: 'khach-san-duong-dong', category: 'stay', area: 'Dương Đông', vi: 'Phòng nghỉ trung tâm Dương Đông', en: 'Central Duong Dong room', descriptionVi: 'Chỗ nghỉ minh họa gần khu vực trung tâm, giá theo phòng/đêm.', descriptionEn: 'Illustrative central stay, price per room/night.', price: 720000, priceUnit: 'per-night', lat: 10.211, lon: 103.962, image: '/island-hero.png', rating: 4.3, reviewCount: 19, reviews: [{ rating: 4, commentVi: 'Gần nhiều địa điểm ăn uống.', commentEn: 'Close to several places to eat.' }] },
];

export const serviceIds = services.map((service) => service.id);

export function estimateServiceCost(service: Service, guests: number, tripDays: number): number {
  switch (service.priceUnit) {
    case 'per-person':
    case 'per-serving': return service.price * guests;
    case 'per-night': return service.price * Math.max(1, tripDays - 1);
    case 'per-vehicle':
    case 'per-item': return service.price;
  }
}

export function priceUnitLabel(unit: PriceUnit, lang: 'vi' | 'en'): string {
  const labels = {
    vi: { 'per-person': '/ người', 'per-night': '/ phòng / đêm', 'per-vehicle': '/ xe', 'per-item': '/ món', 'per-serving': '/ phần' },
    en: { 'per-person': '/ person', 'per-night': '/ room / night', 'per-vehicle': '/ vehicle', 'per-item': '/ item', 'per-serving': '/ serving' },
  };
  return labels[lang][unit];
}
