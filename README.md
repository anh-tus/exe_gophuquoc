# Phu Quoc Local Companion — starter

Codebase ban đầu cho đồ án EXE. Đây là bộ khung kỹ thuật, **chưa triển khai nghiệp vụ marketplace/booking, thanh toán, AI hay tích hợp nhà cung cấp**.

## Yêu cầu

- Node.js 20.19+ (khuyến nghị Node.js LTS hiện hành)
- pnpm 9+

## Bắt đầu

```powershell
corepack enable
pnpm install
pnpm dev
```

`pnpm dev` khởi chạy các ứng dụng có script dev. Có thể chạy riêng bằng `pnpm dev:zalo`, `pnpm dev:web`, `pnpm dev:portal` hoặc `pnpm dev:services`.

## Chạy public web bằng Docker

Từ thư mục gốc, bật Docker Engine rồi chạy:

```powershell
docker compose up --build -d public-web
```

Mở http://localhost:3000. Lệnh này chỉ chạy public web; các frontend và backend khác chưa được đưa vào Compose. Dừng container bằng `docker compose down`. Image dùng bản build production của Next.js và không cần file `.env` cho trang starter hiện tại.

| Ứng dụng | Mặc định |
| --- | --- |
| Zalo Mini App shell (Vite) | http://localhost:5173 |
| Public web (Next.js) | http://localhost:3000 |
| Operations portal (Vite) | http://localhost:5174 |
| Identity API | http://localhost:3101/v1/health |
| Supply API | http://localhost:3102/v1/health |
| Booking API | http://localhost:3103/v1/health |

Các màn hình frontend hiện chỉ là placeholder. Health endpoint chỉ xác nhận service khởi động được, không đại diện cho readiness của database hay phụ thuộc ngoài.

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

- Mỗi service sở hữu schema/database riêng (`IDENTITY_DATABASE_URL`, `SUPPLY_DATABASE_URL`, `BOOKING_DATABASE_URL`); không truy cập chéo database.
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
