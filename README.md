# GOPU — Go Phu Quoc, Go Paradise!

Monorepo cho đồ án EXE. **GOPU** lấy Phú Quốc làm điểm khởi đầu; định hướng dài hạn là mở rộng thương hiệu đến những điểm du lịch khác. MVP hiện tại chỉ phục vụ Phú Quốc. Logo gốc: `frontend/public-web/public/brand/gopu-logo.png`.

Tài liệu cần đọc trước khi code: [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) (phạm vi, nghiệp vụ, roadmap), [`AGENTS.md`](./AGENTS.md) (quy ước kiến trúc), [`Docs/`](./Docs) (ADR và backlog).

## Trạng thái hiện tại

Đọc bảng này trước khi tin vào bất kỳ màn hình nào. "Demo" nghĩa là dữ liệu nằm trong trình duyệt, không có backend phía sau.

| Phần | Trạng thái | Ghi chú |
| --- | --- | --- |
| `frontend/public-web` | **Đã có UI + AI chat** | Trang chủ, danh mục 21 dịch vụ, chi tiết dịch vụ, wizard lịch trình, chat GOPU AI (Gemini), thời tiết Open-Meteo, tỷ giá USD/VND |
| Dữ liệu dịch vụ trên web | **Demo** | `app/catalog.ts` + `localStorage`; **chưa gọi** Identity/Supply/Booking |
| Đặt chỗ trên web | **Demo** | Tạo "yêu cầu" trong `localStorage`, không giữ tồn, không thanh toán |
| `backend/identity-service` | **Đã có** | Firebase ID token → JWT nội bộ, `GET/PATCH /v1/auth/me`, Prisma + migration |
| `backend/supply-service` | **Đã có** | Listing/offering/slot, hold 15 phút có idempotency + transaction Serializable, admin CRUD bằng key |
| `backend/booking-service` | **Một phần** | Instant/request booking, huỷ + tính % hoàn cọc, review, SEPay **sandbox**; thiếu worker hết hạn hold, outbox publisher, partner accept/reject |
| `frontend/zalo-mini` | **Shell** | Chỉ `main.tsx` + CSS, chưa có màn hình |
| `frontend/operations-portal` | **Shell** | Chỉ `main.tsx`, chưa có màn hình |
| Thanh toán production | **Chưa bật** | Legal gate chưa xong; SEPay chỉ chạy sandbox, `PAYMENT_PRIVATE_STORAGE_URL` trống thì endpoint fail closed |
| CI, lint, format | **Chưa có** | Không `.github/`, không ESLint/Prettier. Xem `Docs/BACKLOG.md` |
| Outbox, notification, weather risk, partner portal | **Chưa có** | Xem `Docs/BACKLOG.md` |

Các khoảng trống P0/P1 đã rà soát được ghi ở [`Docs/BACKLOG.md`](./Docs/BACKLOG.md) kèm thứ tự ưu tiên.

## Yêu cầu

- Node.js 20.19+ và pnpm 9.15.9 (qua Corepack) nếu chạy trực tiếp trên máy.
- Docker Desktop đang chạy nếu dùng Docker Compose.

## Chạy toàn bộ stack bằng Docker

Tạo `.env` từ `.env.example` rồi đặt mật khẩu riêng cho `POSTGRES_PASSWORD` (ký tự an toàn cho URL). Giữ `.env` ngoài Git.

```powershell
docker compose up --build -d
docker compose ps
```

Mở http://localhost:3000. Xem log bằng `docker compose logs -f`; dừng bằng `docker compose down` (volume `postgres-data` được giữ lại).

GOPU AI trong Docker đọc `GEMINI_API_KEY` từ `.env` ở gốc repo qua Compose. Sau khi thêm hoặc đổi key, chạy lại `docker compose up -d --force-recreate public-web` để container nhận biến môi trường mới; không cần build lại image chỉ vì đổi key.

Compose chạy public web, Identity, Supply, Booking và PostgreSQL. Zalo Mini App và operations portal **chưa** nằm trong Compose. Database Docker là `trip_trip` với ba schema `identity`, `supply`, `booking`, mở tại `127.0.0.1:5433` để xem bằng pgAdmin; PostgreSQL trên máy bạn ở cổng 5432 vẫn tách biệt.

`docker/postgres/init/001-schemas.sql` chỉ tạo schema khi volume mới được khởi tạo. **Compose không chạy Prisma migration** — chạy migration thủ công vào database dev đã chọn (xem bên dưới).

## Chạy trực tiếp trên máy

```powershell
corepack enable
pnpm install
pnpm dev:web
```

| Ứng dụng | Mặc định |
| --- | --- |
| Zalo Mini App shell (Vite) | http://localhost:5173 |
| Public web (Next.js) | http://localhost:3000 |
| Operations portal (Vite) | http://localhost:5174 |
| Identity API | http://localhost:3101/v1/health |
| Supply API | http://localhost:3102/v1/health |
| Booking API | http://localhost:3103/v1/health |

`pnpm dev:web`, `pnpm dev:zalo`, `pnpm dev:portal`, `pnpm dev:services`, hoặc `pnpm dev` cho tất cả. Đừng chạy public web trực tiếp và container cùng lúc trên cổng 3000.

Khi chạy public web trực tiếp bằng `pnpm dev:web`, đặt `GEMINI_API_KEY` trong `frontend/public-web/.env.local` hoặc export biến trong shell. Next.js không tự đọc `.env` ở gốc repo.

Backend chạy trực tiếp **không tự nạp** `.env` ở gốc repo. Khi cần chạy service ngoài Docker, export biến môi trường trong shell hoặc dùng `dotenv-cli`; đừng sửa code để đọc file `.env` riêng.

Health endpoint chỉ xác nhận process sống, **không** kiểm tra database hay dependency ngoài.

## Biến môi trường

Toàn bộ danh sách ở [`.env.example`](./.env.example). Nhóm chính:

| Nhóm | Biến |
| --- | --- |
| Database local | `IDENTITY_DATABASE_URL`, `SUPPLY_DATABASE_URL`, `BOOKING_DATABASE_URL` |
| Auth | `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`, `IDENTITY_JWT_SECRET` (≥ 32 byte) |
| Gọi nội bộ giữa service | `IDENTITY_SERVICE_URL`, `SUPPLY_SERVICE_URL`, `INTERNAL_SERVICE_KEY`, `SUPPLY_SERVICE_KEY`, `SUPPLY_ADMIN_KEY` |
| SEPay sandbox | `SEPAY_MODE`, `SEPAY_SANDBOX_MERCHANT_ID`, `SEPAY_SANDBOX_SECRET_KEY`, `SEPAY_SANDBOX_IPN_SECRET`, `PUBLIC_WEB_ORIGIN` |
| AI (chỉ server) | `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL` — đặt trong `frontend/public-web/.env.local` |
| Frontend | `NEXT_PUBLIC_IDENTITY_API_URL`, `NEXT_PUBLIC_SUPPLY_API_URL`, `NEXT_PUBLIC_BOOKING_API_URL`, `NEXT_PUBLIC_FIREBASE_*` |

`GEMINI_API_KEY` tuyệt đối không đặt sau tiền tố `NEXT_PUBLIC_` và không commit.

Client chat cũ vẫn đọc được `chat`, `itinerary` và `service_search` như trước. Phản hồi `clarify` từ `/api/assistant/chat` nay có thêm `choices` (2–4 câu trả lời); client mới hiển thị nút chọn và gửi lựa chọn được bấm như tin nhắn người dùng. Client dùng `clarify` cần hỗ trợ trường này.

## Database và migration

Local: một database `trip_trip`, ba schema, mỗi service chỉ nhận URL tới schema của mình.

| Service | Schema | Biến |
| --- | --- | --- |
| Identity | `identity` | `IDENTITY_DATABASE_URL` |
| Supply | `supply` | `SUPPLY_DATABASE_URL` |
| Booking | `booking` | `BOOKING_DATABASE_URL` |

Migration đã có sẵn trong `backend/*/prisma/migrations`. Chỉ chạy với database local/dev đã xác nhận tên:

```powershell
pnpm --filter @pqlc/identity-service exec prisma migrate dev --schema prisma/schema.prisma
pnpm --filter @pqlc/supply-service exec prisma migrate dev --schema prisma/schema.prisma
pnpm --filter @pqlc/booking-service exec prisma migrate dev --schema prisma/schema.prisma
```

Không chạy migration production từ máy phát triển. Kiểm tra schema không cần kết nối DB: `pnpm prisma:validate`.

## Kiểm tra trước khi bàn giao

```powershell
pnpm typecheck                # tất cả package
pnpm build                    # build toàn monorepo
pnpm prisma:validate          # validate 3 schema

pnpm --filter @pqlc/public-web test
pnpm --filter @pqlc/identity-service test
pnpm --filter @pqlc/supply-service test    # có pretest: build trước khi chạy
pnpm --filter @pqlc/booking-service test   # có pretest: build trước khi chạy
```

Backend test chạy trên `dist/` nên cần build trước — các package đã có `pretest` lo việc này. Lint và format **chưa** có cấu hình; nếu bạn thêm ESLint/Prettier, cập nhật luôn mục này và `turbo.json` (task `lint` đã khai báo nhưng chưa package nào implement).

## Bản đồ tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| `PROJECT_PLAN.md` | Phạm vi MVP, nghiệp vụ, KPI, roadmap 16 tuần, rủi ro |
| `AGENTS.md` | Quy ước kiến trúc, ranh giới service/database, quy trình thay đổi |
| `Docs/ADR-001-customer-booking.md` | Ranh giới booking, state machine, thanh toán sandbox |
| `Docs/ADR-002-ai-assistant-placement.md` | Vì sao trợ lý AI đang nằm ở Next.js route thay vì booking-service |
| `Docs/BACKLOG.md` | Các khoảng trống đã rà soát (P0/P1) và thứ tự ưu tiên |
| `frontend/public-web/DESIGN.md` | Màu, typography, quy tắc thị giác của public web |
| `frontend/public-web/PRODUCT.md` | Người dùng, nguyên tắc nội dung (không trình bày dữ liệu chưa xác minh như dữ liệu thật) |

## Nguyên tắc

- Mỗi service sở hữu schema riêng; không đọc chéo database, chỉ trao đổi qua API/event.
- OpenAPI ở `packages/api-contracts/openapi.yaml` là nguồn hợp đồng. Hiện **chưa** khớp hoàn toàn với code (thiếu `/holds/{id}/extend`, IPN, `/admin/*`) — xem backlog.
- Không commit `.env`, secret, dữ liệu khách hàng hoặc chứng từ thanh toán.
- Không hiển thị giá/giờ/chỗ chưa xác minh như dữ liệu thật. Dữ liệu minh họa phải được đánh dấu trong UI.
- AI chỉ đề xuất; không có tool tạo/huỷ/thanh toán booking.

## Mã nguồn

Repository: [anh-tus/exe_gophuquoc](https://github.com/anh-tus/exe_gophuquoc), nhánh chính `main`.

```powershell
git clone https://github.com/anh-tus/exe_gophuquoc.git
cd exe_gophuquoc
```
