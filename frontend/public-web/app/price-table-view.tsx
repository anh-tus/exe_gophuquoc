'use client';

import { useToast } from '../components/ui/Toast';
import { services, type Lang, type Service } from './catalog';

type Props = { lang: Lang; onSelectService: (service: Service) => void };

export default function PriceTableView({ lang, onSelectService }: Props) {
  const toast = useToast();
  const t = (vi: string, en: string) => lang === 'vi' ? vi : en;
  const standardPriceRows = [
    {

      name: t("Tour cano ghép 4 đảo ngọc", "Shared four-island canoe tour"),
      standard: t("Bao gồm cano đời mới, kính lặn, clip flycam, đưa đón", "Includes canoe, snorkeling gear, drone video, and transfers"),
      price: t("450.000 đ", "450,000 VND"),
      unit: t("/ khách", "/ guest"),
      serviceId: 'cano-an-thoi',
    },
    {

      name: t("Xe đón tiễn Sân bay Phú Quốc", "Phu Quoc airport transfer"),
      standard: t("Xe riêng 4-7 chỗ tới trung tâm Dương Đông hoặc Bãi Trường", "Private 4–7 seat vehicle to Duong Dong or Bai Truong"),
      price: t("180.000 đ", "180,000 VND"),
      unit: t("/ xe / lượt", "/ vehicle / trip"),
      serviceId: 'xe-san-bay',
    },
    {

      name: t("Thuê xe máy tay ga (Vision / Airblade)", "Scooter rental (Vision / Air Blade)"),
      standard: t("Giao nhận tại khách sạn, gồm 2 nón bảo hiểm chuẩn", "Hotel pickup and return, including two helmets"),
      price: t("120.000 đ", "120,000 VND"),
      unit: t("/ ngày (24h)", "/ day (24h)"),
      serviceId: 'thue-xe-may',
    },
    {

      name: t("Vé cáp treo Hòn Thơm & Công viên nước", "Hon Thom cable car and water park ticket"),
      standard: t("Cáp treo 2 chiều vượt biển dài nhất thế giới + Aquatopia", "Round-trip sea cable car and Aquatopia"),
      price: t("650.000 đ", "650,000 VND"),
      unit: t("/ vé người lớn", "/ adult ticket"),
      serviceId: 'cap-treo-hon-thom',
    },
    {

      name: t("Bữa ăn hải sản tươi sống định lượng", "Fresh seafood meal"),
      standard: t("Thực đơn gồm 4-5 món hải sản theo mùa (ghẹ, mực, ốc)", "Four or five seasonal seafood dishes"),
      price: t("250.000 đ", "250,000 VND"),
      unit: t("/ phần", "/ serving"),
      serviceId: 'com-nha-phu-quoc',
    },
  ];


  const handleSelectById = (id: string) => {
    const service = services.find((item) => item.id === id);
    if (service) onSelectService(service);
  };

  return (
        <div id="price-table" className="scroll-mt-20 md:scroll-mt-32 mb-14">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* Heading & Guarantee Badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#087f78] text-xs font-bold border border-emerald-200 mb-1.5">
                   GOPU Fair-Pricing Standard
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">{t("Khung giá dịch vụ chuẩn hóa tại Phú Quốc", "Sample service prices in Phu Quoc")}</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-[54ch] leading-[1.6]">{t("Chúng tôi công khai mức giá trần & giá sàn minh bạch. Du khách được bảo vệ khỏi việc thổi giá vào mùa cao điểm hoặc chèo kéo tại cảng tàu.", "Compare illustrative prices across travel services. Confirm current prices with each provider before booking.")}</p>
              </div>

              {/* Divider instead of a tinted box: a card inside the price card
                  read as nested containers rather than a callout. */}
              <div className="shrink-0 flex items-center gap-3 border-t border-emerald-200/70 pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4">

                <div>
                  <span className="text-xs uppercase font-bold text-gray-500 block">{t("Cam kết hoàn tiền chênh lệch", "Price difference policy")}</span>
                  <strong className="text-sm font-bold text-[#087f78] block tabular-nums">{t("Đền bù 100% nếu bị bán đắt hơn niêm yết", "Ask the provider to confirm its listed price")}</strong>
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
                    aria-label={`${t('Xem dịch vụ', 'View service')} ${row.name}`}
                    className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087f78]"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold text-gray-900 flex items-start gap-2">

                      <span>{row.name}</span>
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 whitespace-nowrap tabular-nums">{row.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 leading-[1.5]">{row.standard}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-sm text-gray-500">{row.unit}</span>
                    <span aria-hidden="true" className="text-xs font-bold text-[#087f78]">{t("Xem dịch vụ", "View service")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <table className="w-full text-left text-sm leading-[1.5]">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-bold">{t("HẠNG MỤC DỊCH VỤ", "SERVICE")}</th>
                    <th className="pb-3 font-bold">{t("QUY CHUẨN DỊCH VỤ", "WHAT IS INCLUDED")}</th>
                    <th className="pb-3 font-bold">{t("GIÁ SÀN THAM KHẢO", "REFERENCE PRICE")}</th>
                    <th className="pb-3 font-bold">{t("ĐƠN VỊ TÍNH", "UNIT")}</th>
                    <th className="pb-3 font-bold text-right">{t("TÙY CHỌN", "ACTION")}</th>
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
                          aria-label={`${t('Xem dịch vụ', 'View service')} ${row.name}`}
                          className="min-h-11 px-2 -my-2 text-[#087f78] hover:text-[#066862] font-bold text-xs rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087f78] focus-visible:ring-offset-2"
                        >
                          {t('Xem dịch vụ', 'View service')}
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

                <span className="max-w-[54ch]">{t("Tất cả nhà xe, thuyền trưởng và nhà hàng đối tác đều ký cam kết chuẩn giá bán với GOPU.", "These are sample listings. Confirm the provider and final price before making a decision.")}</span>
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
              >{t("Tải bảng quy chuẩn giá toàn đảo PDF (Mùa 2026)", "Download island price guide PDF (2026)")}</button>
            </div>
          </div>
        </div>
  );
}
