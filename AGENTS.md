# Hướng dẫn cho agent và người phát triển

## Phạm vi starter

Đây là khung codebase. Không coi placeholder là nghiệp vụ đã triển khai. Không tự thêm payment, AI planner, booking workflow hay provider integration khi chưa có yêu cầu và quyết định sản phẩm tương ứng.

## Kiến trúc
- Monorepo dùng pnpm workspace và Turborepo.
- Ứng dụng giao diện nằm trong `frontend/`; backend service nằm trong `backend/`; thư viện dùng chung nằm trong `packages/`.
- Frontend: Zalo Mini App React/Vite; public website Next.js; operations portal React/Vite.
- Backend: ba NestJS service độc lập; Identity, Supply và Booking sở hữu database/schema riêng.
- REST API version `/v1`; OpenAPI ở `packages/api-contracts` là nguồn sự thật.
- Không import persistence layer hoặc Prisma client của service khác. Trao đổi giữa service qua API/event contract, không đọc chéo database.
- Không thêm dependency vòng tròn giữa packages.

## Quy tắc dữ liệu và bảo mật

- Dùng biến môi trường cho secret; cập nhật `.env.example` bằng giá trị giả, không đưa secret thật vào git.
- Không ghi token, PII, payment payload hoặc nội dung xác thực vào log.
- Khi triển khai booking/payment: thiết kế idempotency, trạng thái rõ ràng, transaction/outbox và audit trước khi code.
- AI không được tự xác nhận booking hoặc thanh toán; dữ liệu gửi model phải tối thiểu hóa.
- Migration chỉ chạy với database local/dev đã chọn rõ; không chạy migration production tự động từ máy phát triển.

## Quy trình thay đổi

- Thay đổi API phải cập nhật OpenAPI và ghi chú tương thích client.
- Thay đổi schema phải nằm trong service sở hữu dữ liệu.
- Trước khi bàn giao, chạy format/lint/typecheck/build phù hợp với phạm vi và nêu rõ lệnh nào chưa chạy.
- Tài liệu sản phẩm và quyết định nằm trong `PROJECT_PLAN.md` hoặc ADR; cập nhật khi quyết định nền tảng thay đổi.
