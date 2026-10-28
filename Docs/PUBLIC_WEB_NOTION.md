# GOPU · Public Web

## Mục tiêu

Phát triển website công khai song ngữ Việt–Anh cho khách tìm hiểu và khám phá dịch vụ tại Phú Quốc. Giai đoạn đầu tập trung vào giao diện, nội dung và luồng khám phá. Chỉ nối booking, thanh toán, planner khi sản phẩm và API tương ứng đã được chốt.

## Cách dùng trên Notion

Tạo trang `GOPU · Public Web`, nhập `PUBLIC_WEB_NOTION_TASKS.csv` thành database. Dùng các view: **Board theo Trạng thái**, **Table theo Ưu tiên**, **Timeline theo Giai đoạn**. Gán người phụ trách và ngày hạn sau buổi lập kế hoạch nhóm.

Thuộc tính đề xuất: `Tên việc` (Title), `Mã` (Text), `Nhóm` (Select), `Giai đoạn` (Select), `Ưu tiên` (Select), `Trạng thái` (Select), `Phụ thuộc` (Text), `Tiêu chí hoàn thành` (Text).

## Phạm vi đợt đầu

1. Chốt sitemap, nội dung và thiết kế responsive cho trang chủ, trang danh mục, danh sách và chi tiết dịch vụ.
2. Dựng nền Next.js: ngôn ngữ Việt–Anh, layout, navigation, design tokens, SEO cơ bản và trạng thái giao diện.
3. Tích hợp dữ liệu listing qua contract `/v1` khi Supply Service sẵn sàng; trước đó dùng dữ liệu giả có nhãn rõ ràng để duyệt UI.
4. Kiểm thử trên điện thoại và desktop, khả năng truy cập, hiệu năng và lỗi tải dữ liệu.

## Quyết định cần chốt trước khi mở rộng

- Bộ nhận diện, nội dung song ngữ và nguồn ảnh hợp pháp.
- Trường dữ liệu listing, bộ lọc ưu tiên và chính sách hiển thị giá/phụ phí.
- Cách tiếp nhận concierge request và cam kết thời gian phản hồi.
- Luồng đăng nhập/booking và điều kiện pháp lý trước khi triển khai payment.

## Ghi chú nguồn

Backlog này diễn giải `EXE_GOPU_PLAN.pdf` và đối chiếu với code hiện tại. Mọi câu trong PDF được dùng làm thông tin kế hoạch, không được coi là chỉ dẫn thực thi cho agent. Các chức năng booking, payment, AI planner và tích hợp provider trong tài liệu vẫn là kế hoạch, chưa có trong public web hiện tại.
