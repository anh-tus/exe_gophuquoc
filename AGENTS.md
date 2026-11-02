# Hướng dẫn cho agent và người phát triển

## Phạm vi starter

Đây là khung codebase. Không coi placeholder là nghiệp vụ đã triển khai. Không tự thêm payment, AI planner, booking workflow hay provider integration khi chưa có yêu cầu và quyết định sản phẩm tương ứng.

Trạng thái thật của từng phần nằm ở bảng đầu `README.md`. Hai điểm dễ nhầm nhất:

- Public web **chưa** gọi backend; dữ liệu dịch vụ và "yêu cầu đặt chỗ" vẫn nằm trong `localStorage`.
- `frontend/zalo-mini` và `frontend/operations-portal` chỉ là shell, không có màn hình nghiệp vụ.

Khoảng trống đã rà soát: `Docs/BACKLOG.md`. Quyết định về trợ lý AI: `Docs/ADR-002-ai-assistant-placement.md`.

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

- Thay đổi API phải cập nhật OpenAPI và ghi chú tương thích client. Nếu endpoint đang chạy mà chưa có trong `openapi.yaml`, bổ sung cùng PR.
- Thay đổi schema phải nằm trong service sở hữu dữ liệu, kèm migration trong `backend/<service>/prisma/migrations`.
- Trước khi bàn giao, chạy trong phạm vi đã sửa:
  - `pnpm typecheck`
  - `pnpm --filter <package> build`
  - `pnpm --filter <package> test` (supply/booking có `pretest: pnpm build`)
  - `pnpm prisma:validate` nếu chạm schema
  - Lint/format **chưa có cấu hình** — nêu rõ trong mô tả PR rằng bước này chưa chạy được, đừng giả định nó đã chạy.
- Tài liệu sản phẩm và quyết định nằm trong `PROJECT_PLAN.md` hoặc ADR; cập nhật khi quyết định nền tảng thay đổi.
- Chuỗi hiển thị mới cho trợ lý AI, toast, header đặt trong `frontend/public-web/lib/i18n.ts`, không thêm ternary ngôn ngữ rải rác.
