# GOPU — Go Phu Quoc, Go Paradise!

Monorepo cho đồ án EXE. **GOPU** lấy Phú Quốc làm điểm khởi đầu; định hướng dài hạn là mở rộng thương hiệu đến những điểm đến du lịch khác. MVP hiện tại vẫn chỉ phục vụ Phú Quốc. Logo gốc nằm tại `frontend/public-web/public/brand/gopu-logo.png`.

Nhóm ưu tiên phát triển `frontend/public-web` trước. Docker Compose có thể khởi động public web, ba backend starter và PostgreSQL cùng lúc; **chưa triển khai nghiệp vụ marketplace/booking, thanh toán, AI hay tích hợp nhà cung cấp**.

## Yêu cầu

- Node.js 20.19+ và pnpm 9.15.9 (qua Corepack) nếu chạy trực tiếp trên máy.
- Docker Desktop với Docker Engine đang chạy nếu dùng Docker Compose.

## Chạy toàn bộ stack bằng Docker

Từ thư mục gốc, tạo `.env` từ `.env.example` nếu chưa có và đặt mật khẩu riêng cho `POSTGRES_PASSWORD`. Giữ file `.env` ngoài Git. Sau đó chạy:

```powershell
docker compose up --build -d
docker compose ps
```

Mở http://localhost:3000. Kiểm tra log bằng `docker compose logs -f`; dừng bằng `docker compose down`. Lệnh dừng giữ nguyên Docker volume `postgres-data` để dữ liệu còn sau lần chạy tiếp theo.

Compose khởi động public web, Identity, Supply, Booking và PostgreSQL. Zalo Mini App cùng operations portal chưa được đưa vào Compose. Database Docker là `trip_trip` với ba schema `identity`, `supply`, `booking`. PostgreSQL trên máy của bạn tại cổng 5432 vẫn tách biệt; database Docker được mở riêng tại `127.0.0.1:5433` để có thể xem bằng pgAdmin. Mật khẩu kết nối là `POSTGRES_PASSWORD` trong `.env` local.

Script `docker/postgres/init/001-schemas.sql` chỉ tạo ba schema khi volume database mới được khởi tạo. Compose không chạy Prisma migration và không sao chép dữ liệu từ PostgreSQL trên máy. Backend nhận URL kết nối đến service `postgres`, nhưng mã starter chưa thực sự truy vấn database.

## Chạy trực tiếp trên máy

```powershell
corepack enable
pnpm install
pnpm dev:web
```

`pnpm dev:web` chạy public web tại http://localhost:3000. Các lệnh `pnpm dev:zalo`, `pnpm dev:portal`, `pnpm dev:services` chạy từng phần còn lại; `pnpm dev` chạy tất cả ứng dụng có script dev. Tránh chạy public web trực tiếp và container cùng lúc trên cổng 3000.

| Ứng dụng | Mặc định |
| --- | --- |
| Zalo Mini App shell (Vite) | http://localhost:5173 |
| Public web (Next.js) | http://localhost:3000 |
| Operations portal (Vite) | http://localhost:5174 |
| Identity API | http://localhost:3101/v1/health |
| Supply API | http://localhost:3102/v1/health |
| Booking API | http://localhost:3103/v1/health |

Các màn hình frontend hiện chỉ là placeholder. Health endpoint của backend chỉ xác nhận service khởi động được, không đại diện cho khả năng truy vấn database hay phụ thuộc ngoài. Trong Docker, Compose chờ PostgreSQL báo healthy trước khi khởi động ba backend.

## PostgreSQL trên máy cho backend chạy trực tiếp

Nếu đã tạo database `trip_trip` với ba schema như trong `.env.example`, cấu trúc local hiện tại là:

| Service | Schema sở hữu | Biến môi trường |
| --- | --- | --- |
| Identity | `identity` | `IDENTITY_DATABASE_URL` |
| Supply | `supply` | `SUPPLY_DATABASE_URL` |
| Booking | `booking` | `BOOKING_DATABASE_URL` |

Nếu chạy backend trực tiếp trên máy thay vì qua Compose, dùng ba `*_DATABASE_URL` trong `.env.example` với mật khẩu PostgreSQL local của bạn tại cổng 5432. Mật khẩu này có thể khác `POSTGRES_PASSWORD` của Docker. File `.env` đã được Git bỏ qua; không đưa mật khẩu vào README hoặc commit. Tên database là **`trip_trip`** (có dấu gạch dưới), đúng với ảnh pgAdmin.

Ba Prisma schema đã khai báo URL tương ứng nhưng chưa có model nghiệp vụ; backend chạy trực tiếp trên máy cũng chưa tự nạp file `.env` ở gốc repo. Khi bắt đầu triển khai backend, hãy cấu hình cách nạp biến môi trường, kiểm tra kết nối và xác nhận database local/dev đích trước khi chạy bất kỳ migration nào.

## Đẩy lên GitHub

Nếu checkout của bạn chưa có remote, hãy tự tạo một repository trống trên GitHub rồi chạy từ thư mục gốc (thay `TEN_TAI_KHOAN` và `TEN_REPO` bằng giá trị của bạn):

```powershell
git remote add origin https://github.com/TEN_TAI_KHOAN/TEN_REPO.git
git push -u origin main
```

Kiểm tra remote đã có trước khi thêm bằng `git remote -v`. Không commit `.env`, secret, cache hoặc thư mục tạm của Docker.

## Cấu trúc

```text
frontend/
  zalo-mini/             React + Vite shell; tích hợp Zalo SDK để sau
  public-web/             Next.js shell
  operations-portal/      React + Vite shell
backend/
  identity-service/       NestJS + Prisma skeleton
  supply-service/         NestJS + Prisma skeleton
  booking-service/        NestJS + Prisma skeleton
packages/
  api-contracts/          OpenAPI nguồn hợp đồng API
  api-clients/            placeholder cho client sinh từ OpenAPI
  config/                 TypeScript shared config
  design-tokens/          token trung lập, chưa có design final
  observability/          placeholder cho logging/correlation
```

## Nguyên tắc

- Trong môi trường local hiện tại, mỗi backend service sở hữu một schema riêng trong `trip_trip`; không truy cập schema của service khác.
- OpenAPI là nguồn hợp đồng. Chưa có client runtime hay endpoint nghiệp vụ.
- Không commit `.env`, secrets, dữ liệu khách hàng hoặc chứng từ thanh toán.
- Các tích hợp Zalo, SEPay, Firebase, Redis, AI, thời tiết, bản đồ và storage chưa được bật.
- Trước khi triển khai thật, cần chốt phiên bản SDK Mini App và xác minh quy trình phát hành theo tài liệu Zalo hiện hành.

## Lệnh tiện ích

```powershell
pnpm build
pnpm typecheck
pnpm prisma:validate
```

Lệnh Prisma yêu cầu cài dependencies; validation schema chưa chạy migration. Lint/format và CI chưa được cấu hình trong starter. Xem [AGENTS.md](./AGENTS.md) và [PROJECT_PLAN.md](./PROJECT_PLAN.md) trước khi thêm nghiệp vụ.
