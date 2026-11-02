# ADR 002: Vị trí của trợ lý AI trong giai đoạn demo

Status: accepted for the current demo on 2026-11-02.

## Bối cảnh

`PROJECT_PLAN.md` đặt trợ lý AI trong **Booking Service**, sau một `LLMProviderAdapter` có hai implementation (OpenAI, Gemini), kèm benchmark, quality gate, cost guard và golden test chạy trong CI.

Thực tế hiện tại: toàn bộ trợ lý chạy trong `frontend/public-web/app/api/assistant/` (Next.js route handler), gọi thẳng Gemini bằng `fetch`, dùng `catalog.ts` làm nguồn dữ liệu. Frontend chưa nối với Identity/Supply/Booking, nên chưa có `listingId`/`offeringId` thật để đưa vào tool result hay kiểm tra availability.

Đặt adapter vào Booking Service lúc này sẽ tạo một service phụ thuộc vào dữ liệu chưa tồn tại, trong khi vòng lặp sản phẩm (thử prompt, sửa schema, so sánh model) đang diễn ra hằng ngày ở phía web.

## Quyết định

Giữ trợ lý AI trong Next.js route handler cho đến khi public web đọc listing từ Supply Service thật.

Lý do:

- Route handler là BFF: `GEMINI_API_KEY` chỉ nằm ở server, không lộ qua `NEXT_PUBLIC_*`.
- Schema đầu ra (`responseSchema`), validate (`parseAssistantReply`) và redact PII (`sanitizeMessages`) đã tập trung ở một chỗ, có test.
- Chưa có dữ liệu tồn kho thật nên chưa thể kiểm tra availability/giá như plan yêu cầu; chuyển sang service chỉ làm tăng khoảng cách giữa code và dữ liệu.

## Hệ quả

Điều đã đúng:

- Model không có tool tạo, huỷ hay thanh toán booking. Kết quả chỉ là đề xuất; người dùng vẫn phải bấm sang luồng đặt chỗ.
- Mọi `serviceId` trả về phải tồn tại trong catalog; thời gian được chuẩn hoá về `HH:mm`, sắp xếp lại theo giờ.
- Fallback model và timeout 12 giây mỗi lần gọi.
- Nội dung chat được redact email/số điện thoại trước khi gửi model.

Điều còn thiếu so với plan (phải xong trước pilot):

1. **Rate limit đúng phạm vi.** Hiện là một mảng trong bộ nhớ module: 12 request/phút dùng chung cho mọi người dùng, mất khi restart và không đúng trên serverless. Plan yêu cầu 5 request/phút **mỗi tài khoản**. Cần chuyển sang Redis/Upstash hoặc rate limit theo IP + session.
2. **Cost guard.** Chưa đếm token, chưa có trần 300.000đ/tháng, chưa có cảnh báo 70%/90%, chưa có circuit breaker chuyển sang template planner.
3. **Golden test trong CI.** `logic.test.mjs` kiểm tra parse/redact, nhưng chưa có bộ 15–20 tình huống VI/EN với model thật và chưa chạy trong CI (chưa có CI).
4. **Dữ liệu thật.** Khi public web đọc Supply Service, prompt phải nhận catalog từ API thay vì `catalog.ts`, và kết quả phải kiểm tra lại giá/availability ở backend trước khi hiển thị nút đặt.
5. **Weather risk / replan.** Chưa có; hiện chỉ hiển thị thời tiết, không dùng để đề xuất đổi lịch.

## Khi nào xem lại quyết định

Xem lại khi public web gọi được `GET /v1/listings` và `POST /v1/bookings` thật. Lúc đó:

- Chuyển `LLMProviderAdapter` + validate schema sang Booking Service.
- Giữ route handler như một proxy mỏng (auth, rate limit, correlation ID) để không phá vỡ frontend.
- Đưa golden test và cost guard vào CI cùng lúc, không tách thành việc sau.
