# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Khách du lịch Việt Nam và khách quốc tế, ưu tiên ngang nhau — không nhóm nào là bản dịch của nhóm kia. Họ đang ở hoặc sắp đến Phú Quốc, và phần lớn nhu cầu phát sinh trong khoảng 1–3 ngày trước khi sử dụng dịch vụ: tìm chỗ ở, tour, xe, spa, giặt là; ghép chúng thành một chuyến đi; xử lý khi kế hoạch bị lệch vì thời tiết hoặc vì booking gặp sự cố.

Public web và Zalo Mini App là hai kênh chính ngang nhau, cùng một luồng trải nghiệm đầy đủ. Người dùng không phải học lại sản phẩm khi đổi kênh.

Đối tác địa phương (Partner Owner, Partner Staff) và Admin dùng operations portal, không dùng public web.

## Product Purpose

GOPU là marketplace và trợ lý hành trình dành riêng cho Phú Quốc: kết nối du khách với nhà cung cấp địa phương đã được xác minh, đồng thời giúp khách dựng lịch trình, theo dõi thời tiết và điều chỉnh kế hoạch khi điều kiện thực tế thay đổi.

Sản phẩm tồn tại để thay thế việc ghép thông tin từ mạng xã hội, bản đồ, website đặt phòng và tin nhắn cá nhân bằng một đầu mối có giá, giờ hoạt động, chính sách hủy và khả năng phục vụ nhất quán.

Thành công của giai đoạn MVP được đo bằng nguồn cung thật, booking hoàn thành, phản hồi người dùng và bằng chứng tạo doanh thu — không phải bằng việc demo chạy được.

## Positioning

Một cửa địa phương đáng tin cậy để tìm, đặt và nhận hỗ trợ cho các dịch vụ tại Phú Quốc. Điểm khác biệt không nằm ở danh mục dịch vụ mà ở ba thứ đi cùng nhau: nguồn cung được mời và kiểm duyệt trước khi xuất hiện, quy trình booking thống nhất có giữ tồn và trạng thái rõ ràng, và trợ lý hành trình chỉ dùng dữ liệu kiểm chứng được. Marketplace tổng quát không thể copy cả ba cùng lúc mà vẫn giữ được tính địa phương.

## Operating Context

- Phạm vi phục vụ là toàn đảo Phú Quốc; mỗi listing khai báo vùng phục vụ theo tên (Dương Đông, Bãi Trường, An Thới) kèm phụ phí tương ứng.
- Năm nhóm dịch vụ: lưu trú, tour và trải nghiệm, di chuyển và thuê xe, spa và wellness, giặt là.
- Concierge hoạt động 08:00–22:00 hằng ngày, phản hồi trong hai giờ làm việc, dùng cho nhu cầu chưa có listing phù hợp.
- Giao dịch bằng VND; USD chỉ là giá tham khảo quy đổi.
- Khách quốc tế đọc tiếng Anh, khách Việt đọc tiếng Việt; cả hai đều cần cùng một mức thông tin về giá, chính sách và thời gian.
- Trong MVP, admin nhập và kiểm soát inventory; đối tác gửi đề xuất sửa listing và chờ duyệt.

## Capabilities and Constraints

Đang có trong `frontend/public-web`:

- Bốn màn hình của demo khách hàng: trang chủ, danh sách dịch vụ, lịch trình, yêu cầu (concierge request).
- Song ngữ Việt–Anh chuyển ngay trong phiên, không tải lại.
- Bản đồ OpenStreetMap và dự báo Open-Meteo gọi trực tiếp, có hiển thị nguồn và trạng thái lỗi.
- Trợ lý hội thoại và tạo lịch trình mẫu từ danh mục minh họa.
- Next.js 15 + React 19 + Tailwind 4, chạy tại `localhost:3000` bằng `pnpm dev:web`.

Chưa có và không được mô tả như đã có: đặt chỗ thật, giữ tồn, thanh toán, AI planner production, tích hợp nhà cung cấp, đăng nhập thật. Toàn bộ giá, dịch vụ, yêu cầu và lịch trình là dữ liệu minh họa lưu trong trình duyệt.

Ràng buộc kỹ thuật: hợp đồng API là OpenAPI `/v1` trong `packages/api-contracts`; mỗi backend service sở hữu schema riêng; không service nào đọc chéo database. Public web chỉ nối dữ liệu listing khi Supply Service sẵn sàng.

Chưa chốt (ghi nhận là quyết định mở, không tự quyết): trường dữ liệu listing, bộ lọc ưu tiên, chính sách hiển thị giá và phụ phí, cách tiếp nhận concierge request, luồng đăng nhập/booking, điều kiện pháp lý trước khi bật payment.

## Brand Commitments

- Tên **GOPU**, khẩu hiệu giai đoạn này: "Go Phu Quoc, Go Paradise!".
- Logo gốc `public/brand/gopu-logo.png` — giữ nguyên file, không chỉnh sửa.
- Định hướng dài hạn là mở rộng thương hiệu đến các điểm đến khác; MVP vẫn chỉ phục vụ Phú Quốc, không được ngụ ý đã có mặt ở nơi khác.
- Không đưa ra tuyên bố về khả dụng, giá hay đặt chỗ thật khi chưa có nguồn xác minh.

## Evidence on Hand

Chỉ có dữ liệu minh họa. Không có đối tác thật nào đã xác nhận tham gia, không có giá thật, không có ảnh do đối tác cung cấp, không có testimonial, case study, số liệu vận hành hay benchmark.

- `public/island-hero.png`, `island-boat.png`, `island-transfer.png`: ảnh tạo riêng cho demo, chỉ mang tính minh họa.
- `data/landing-data.ts`, `app/catalog.ts`: nội dung và giá minh họa.
- Các con số trong `PROJECT_PLAN.md` (5 đối tác, 20 listing, 50 tài khoản, 10 booking hoàn thành) là **mục tiêu KPI**, chưa đạt. Không được trình bày như thành tích đã có.

Mọi nội dung mới cần dữ liệu thật phải chờ nguồn thật; không tự sinh lời chứng thực, đánh giá, tên đối tác hay con số.

## Product Principles

1. **Không hiển thị như thật khi chưa xác minh.** Nhãn demo, nguồn dữ liệu và thời điểm cập nhật là một phần của sản phẩm, không phải phần trang trí thêm vào.
2. **Song ngữ bình đẳng.** Mỗi ngôn ngữ là một trải nghiệm được viết, không phải bản dịch máy của ngôn ngữ kia.
3. **Một sản phẩm, hai kênh.** Web và Zalo chia sẻ cùng luồng và cùng từ vựng; khác biệt chỉ ở nền tảng, không ở mô hình.
4. **Khi kế hoạch lệch, luôn có đường ra.** Thời tiết xấu hay booking gặp sự cố phải dẫn tới một phương án thay thế hoặc một đầu mối địa phương, không phải ngõ cụt.
5. **Tin cậy là tính năng, không phải khẩu hiệu.** Nguồn cung được kiểm duyệt, trạng thái rõ ràng, và trợ lý chỉ nói điều dữ liệu cho phép.

## Accessibility & Inclusion

Mức tối thiểu đã cam kết trong `DESIGN.md`: vùng chạm tối thiểu 44px, trạng thái focus rõ ràng, tôn trọng thiết lập giảm chuyển động, nhãn form hiển thị rõ và chữ nhỏ vẫn đọc được ở cỡ mobile. Chưa có chuẩn bắt buộc nào khác được xác nhận.
