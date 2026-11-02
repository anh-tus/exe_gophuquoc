# Backlog kỹ thuật — các khoảng trống đã rà soát

Cập nhật: 2026-11-02. Danh sách này bổ sung cho `PROJECT_PLAN.md`: plan nói **sản phẩm** cần gì, file này nói **code hiện tại còn thiếu gì** để đạt được điều đó.

Đánh dấu `[x]` khi xong và ghi ngày. Mỗi mục nên có PR riêng, không gộp.

## P0 — Chặn luồng nghiệp vụ

- [ ] **Nối public web với backend thật.**
      Hiện `app/catalog.ts` + `localStorage` là nguồn duy nhất; không có lời gọi nào tới `NEXT_PUBLIC_*_API_URL`.
      Xong khi: danh mục đọc từ `GET /v1/listings`, chi tiết từ `GET /v1/listings/{id}`, đặt chỗ gọi `POST /v1/bookings/instant` với `Idempotency-Key`, trạng thái booking đọc từ `GET /v1/bookings`.
- [ ] **Worker hết hạn hold và outbox publisher.**
      `booking.service.ts` ghi `outboxEvent` nhưng không có consumer; hold 15 phút không có job chuyển `EXPIRED`.
      Xong khi: job chạy định kỳ, có test cho "hết 15 phút → EXPIRED + trả tồn", và event được đẩy đi ít nhất một lần (at-least-once).
- [ ] **Partner accept/reject + escalation 60 phút.**
      ADR-001 mô tả `PENDING_PARTNER → ESCALATED` nhưng chưa có endpoint hay job nào.
- [ ] **Đồng bộ OpenAPI với code.**
      Thiếu `/holds/{id}/extend`, `/payment/sepay-sandbox-ipn`, toàn bộ `/admin/*`.
      Xong khi: `openapi.yaml` liệt kê đủ endpoint đang chạy và CI có bước diff.

## P1 — Chất lượng và an toàn

- [ ] **CI.** `.github/workflows/ci.yml`: `pnpm typecheck`, `pnpm build`, test từng package, `prisma:validate`, OpenAPI diff. Chưa có file nào trong `.github/`.
- [ ] **ESLint + Prettier.** `turbo.json` đã khai báo task `lint` nhưng không package nào có script `lint`; chạy `pnpm lint` hiện không làm gì.
- [ ] **Rate limit AI theo tài khoản/IP.** `app/api/assistant/chat/route.ts` dùng mảng trong bộ nhớ (12 req/phút cho tất cả). Cần 5 req/phút mỗi tài khoản, lưu ngoài process.
- [ ] **Cost guard cho AI.** Đếm token, trần ngân sách tháng, cảnh báo 70%/90%, circuit breaker về template planner.
- [ ] **ValidationPipe + exception filter toàn cục.** Hiện mỗi controller tự validate `unknown`; error shape không khớp `ErrorResponse { code, message, correlationId }` trong OpenAPI.
- [ ] **Correlation ID + structured log.** `packages/observability` mới là stub; log đang dùng `console.*` rải rác.
- [ ] **Health check có kiểm tra dependency.** `/v1/health` hiện trả `{ status: 'ok' }` vô điều kiện, kể cả khi DB chết.
- [ ] **BookingService dùng PrismaService.** `booking.service.ts` tự `new PrismaClient()`; identity và supply dùng `PrismaService` có `onModuleDestroy` → rò connection.
- [ ] **Validate env lúc khởi động.** Thiếu biến thì fail-fast thay vì trả 503 rải rác lúc runtime.
- [ ] **Test cho phần rủi ro tiền/tồn kho.** Idempotency trùng key, hai khách tranh slot cuối, ngưỡng hoàn cọc, chuyển trạng thái. Hiện chỉ có 2 test booking và 2 test supply.
- [ ] **Xoá `*.spec.ts` chết.** `cancellation.spec.ts`, `sepay.spec.ts` không có jest trong devDependencies và không được runner nào nhặt.
- [ ] **Pagination.** `listings` dùng `take: 100` cứng, `bookings` trả toàn bộ.

## P2 — Đã xử lý trong đợt rà soát này

- [x] Xoá 9 component landing không còn trong cây import (`AiPlanResultView`, `SmartHero`, `ServiceEcosystem`, `CuratedSpots`, `PriceStandardTable`, `AiPlannerSection`, `AppDownloadCta`, `ExclusivePromoBanner`, `LiveWeatherStrip`) và `data/landing-data.ts` — nguồn dữ liệu dịch vụ thứ hai. 2026-11-02.
- [x] Gộp logic gọi AI vào `lib/assistant-client.ts`; gộp copy song ngữ vào `lib/i18n.ts`. 2026-11-02.
- [x] Tách widget chat nổi khỏi `home-landing.tsx` thành `components/landing/MiniChatWidget.tsx` (1325 → 1061 dòng) và làm widget song ngữ. 2026-11-02.
- [x] Sửa ngày mặc định `2026-05-15` (đã ở quá khứ) thành "ngày mai" theo múi giờ người dùng, thêm `min` cho input ngày. 2026-11-02.
- [x] Thay 8 chỗ `alert()` bằng toast (`components/ui/Toast.tsx`) hoặc hành động thật (mở Google Maps). 2026-11-02.
- [x] `<img>` → `next/image` (3 chỗ), thêm `sizes` và `fill`. 2026-11-02.
- [x] `ExtensionCleaner` chỉ chạy ở dev; đồng bộ `<html lang>` theo ngôn ngữ đang chọn; bổ sung metadata/OpenGraph. 2026-11-02.
- [x] Thêm `pretest: pnpm build` cho supply/booking để `pnpm test` chạy được từ clean checkout. 2026-11-02.

## P3 — Tài liệu

- [x] Viết lại `README.md` theo trạng thái thật (bảng "Đã có / Demo / Chưa có"). 2026-11-02.
- [x] `Docs/ADR-002-ai-assistant-placement.md`: lý do AI nằm ở Next.js route và điều kiện để chuyển sang Booking Service. 2026-11-02.
- [ ] Cập nhật `AGENTS.md` khi có lint/CI thật (hiện chỉ nêu lệnh đã tồn tại).
- [ ] Bổ sung sơ đồ luồng booking (hold → deposit → confirm) vào `Docs/` bằng PlantUML hoặc Mermaid.
- [ ] Ghi ADR cho quyết định "một database, ba schema ở local" và "ba database riêng ở production".

## Ghi chú i18n

Public web tự nhận là song ngữ nhưng `home-landing.tsx` vẫn còn nhiều chuỗi tiếng Việt viết cứng; `lang` chỉ ảnh hưởng một phần màn hình. Phần đã tách (widget chat, toast, header) dùng `lib/i18n.ts`. Việc chuyển toàn bộ landing sang dictionary nên làm cùng lúc với việc nối API thật, vì nội dung sẽ đổi theo dữ liệu.
