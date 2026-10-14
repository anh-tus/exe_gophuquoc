# Kế hoạch dự án Phú Quốc Local Companion

## Tóm tắt điều hành

Phú Quốc Local Companion là nền tảng marketplace và trợ lý hành trình dành riêng cho Phú Quốc, được triển khai trên Zalo Mini App và website song ngữ. Sản phẩm kết nối khách du lịch với các nhà cung cấp địa phương đã được xác minh, đồng thời hỗ trợ khách xây dựng lịch trình, theo dõi thời tiết và điều chỉnh kế hoạch khi điều kiện thực tế thay đổi.

MVP được phát triển trong 16 tuần bởi nhóm ba người. Thành công của dự án không chỉ được đo bằng khả năng chạy demo mà còn bằng nguồn cung thật, booking hoàn thành, phản hồi của người dùng và bằng chứng về khả năng tạo doanh thu. Phạm vi được khóa quanh một khu vực duy nhất để nhóm kiểm soát chất lượng dữ liệu và vận hành tốt hơn một marketplace du lịch tổng quát.

Thứ tự ưu tiên triển khai là: marketplace và booking end-to-end, một phương thức thanh toán production qua SEPay, weather widget và template planner, sau đó mới bật AI qua feature flag. Nếu AI chưa đạt quality gate, sản phẩm vẫn có thể pilot bằng lịch trình mẫu và concierge.

## 1. Tổng quan

### Mục tiêu

Xây dựng MVP trong 16 tuần cho một nền tảng kết nối du khách với các nhà cung cấp dịch vụ địa phương đã được kiểm duyệt tại Phú Quốc.

Sản phẩm phục vụ ngang nhau:

- Khách Việt Nam qua Zalo Mini App và website.
- Khách quốc tế qua website song ngữ Việt–Anh.

Định vị cốt lõi:

> Một cửa địa phương đáng tin cậy để tìm, đặt và nhận hỗ trợ cho các dịch vụ tại Phú Quốc.

### Vấn đề thị trường

Khách du lịch thường phải ghép thông tin từ nhiều nguồn: mạng xã hội, bản đồ, website đặt phòng, tin nhắn cá nhân và lời giới thiệu. Giá, giờ hoạt động, chính sách hủy và khả năng phục vụ không phải lúc nào cũng nhất quán. Khi thời tiết thay đổi hoặc booking gặp sự cố, khách thiếu một đầu mối địa phương có thể đưa ra phương án thay thế nhanh.

Ở phía nhà cung cấp, nhiều đơn vị nhỏ phụ thuộc vào Facebook, Zalo cá nhân hoặc khách vãng lai, chưa có quy trình quản lý listing, availability, booking và đối soát rõ ràng. Dự án giải quyết khoảng trống này bằng nguồn cung được kiểm duyệt, quy trình booking thống nhất và trợ lý hành trình chỉ sử dụng dữ liệu có thể kiểm chứng.

### Phạm vi pilot

Năm nhóm dịch vụ:

1. Lưu trú.
2. Tour và trải nghiệm.
3. Di chuyển và thuê xe.
4. Spa và wellness.
5. Giặt là.

Phạm vi phục vụ là toàn đảo Phú Quốc. Mỗi listing khai báo khu vực phục vụ theo các vùng đặt tên như Dương Đông, Bãi Trường, An Thới và phụ phí tương ứng.

### KPI pilot

- 5 đối tác được xác minh.
- 20 listing hoạt động.
- 50 tài khoản khách hàng.
- 10 booking sử dụng dịch vụ và hoàn thành.
- Phỏng vấn tối thiểu 15 khách hàng và 8 nhà cung cấp.
- Ít nhất 15 lượt bắt đầu AI planner và 10 lịch trình được tạo thành công.
- Ít nhất 30% người dùng planner bấm vào một listing.
- Ít nhất 2 booking hoàn thành được attribution từ AI.
- Điểm hữu ích trung bình của planner đạt tối thiểu 4/5.

## 2. Business plan

### Khách hàng mục tiêu

- Khách Việt Nam và quốc tế được ưu tiên ngang nhau.
- Tập trung vào khách sắp đến hoặc đang ở Phú Quốc.
- Nhu cầu chủ yếu phát sinh trong khoảng 1–3 ngày trước khi sử dụng dịch vụ.

### Giá trị cung cấp

- Một nơi để tìm nhiều loại dịch vụ tại Phú Quốc.
- Nhà cung cấp được mời và kiểm duyệt trước khi xuất hiện.
- Giá và chính sách rõ ràng bằng tiếng Việt và tiếng Anh.
- Có hỗ trợ địa phương khi booking xảy ra vấn đề.
- Kết hợp marketplace với concierge cho những nhu cầu chưa có listing phù hợp.
- Tạo lịch trình Phú Quốc theo thời gian, ngân sách, sở thích và điều kiện thời tiết.
- Đề xuất phương án thay thế khi mưa lớn hoặc hoạt động đã lên lịch bị ảnh hưởng.

### Mô hình doanh thu

| Gói đối tác | Phí tháng | Hoa hồng |
|---|---:|---:|
| Standard | 0đ | 12% giá trị booking sau giảm giá |
| Partner Pro | 299.000đ | 6% giá trị booking sau giảm giá |

Nguyên tắc:

- Không thu thêm service fee từ khách trong MVP.
- Phí thuê bao được gia hạn thủ công.
- Đối soát với đối tác hằng tuần.
- Coupon do đối tác tài trợ.
- Hoa hồng tính trên giá khách thực trả sau giảm giá.
- Tiền cọc mặc định 20%; admin có thể chọn mẫu 10%, 20% hoặc 30%.
- Giao dịch bằng VND; USD chỉ là giá tham khảo.

### Legal gate

Trước khi nền tảng giữ hoặc phân phối tiền của khách, nhóm phải có:

- Pháp nhân hoặc đối tác hợp lệ đứng tên merchant.
- Thỏa thuận với nhà cung cấp.
- Chính sách giao dịch, hủy, hoàn tiền và khiếu nại.
- Chính sách bảo vệ dữ liệu cá nhân.
- Xác nhận về nghĩa vụ đăng ký nền tảng thương mại điện tử.

Không sử dụng tài khoản cá nhân của thành viên nhóm làm tài khoản trung gian nhận tiền.

Nếu legal gate chưa đạt ở tuần 12:

- Khách vẫn tạo và sử dụng booking thật.
- Khách thanh toán trực tiếp cho đối tác.
- Luồng cọc/payment provider chạy sandbox để demo kỹ thuật.

## 3. Vai trò người dùng

### Customer

- Đăng nhập và quản lý hồ sơ.
- Tìm kiếm, lọc và xem bản đồ.
- Xem listing song ngữ.
- Tạo booking hoặc concierge request.
- Thanh toán cọc, hủy và theo dõi booking.
- Đánh giá sau khi hoàn thành dịch vụ.
- Tạo, chỉnh sửa, lưu và chia sẻ lịch trình.
- Nhận cảnh báo booking và thời tiết ảnh hưởng trực tiếp đến hành trình.

### Partner Owner

- Quản lý nhân viên của đối tác.
- Xem và xử lý booking.
- Xem availability và đối soát.
- Gửi đề xuất sửa listing.

### Partner Staff

- Xem booking được giao.
- Xác nhận hoặc từ chối request booking.
- Cập nhật availability và trạng thái phục vụ.
- Không được truy cập KYC hoặc cấu hình tài chính nhạy cảm.

### Admin

- Onboard và xác minh đối tác.
- Quản lý listing, giá, inventory và chính sách.
- Xử lý booking, concierge, refund và dispute.
- Quản lý coupon, subscription và settlement.
- Kiểm duyệt review và xem audit log.
- Quản lý sự kiện địa phương, template itinerary và nội dung FAQ đã xác minh.
- Theo dõi chi phí AI, lỗi provider, fallback rate và cảnh báo ngân sách.

MVP chỉ có một quyền Admin. Mọi thao tác nhạy cảm phải được ghi audit log.

## 4. Nghiệp vụ chính

### Khám phá dịch vụ

Khách có thể:

- Duyệt theo năm danh mục.
- Tìm kiếm và lọc theo ngày, khu vực, giá và số người.
- Xem listing trên Google Maps.
- Xem nội dung bằng tiếng Việt hoặc tiếng Anh.
- Xem giá VND và USD quy đổi tham khảo.
- Gửi concierge request nếu không tìm thấy dịch vụ phù hợp.

Concierge hoạt động từ 08:00–22:00 hằng ngày và phản hồi trong hai giờ làm việc.

### Inventory strategy

- **Lưu trú:** room type, số phòng, giá theo đêm, sức chứa và ngày khóa.
- **Tour:** departure, thời gian, capacity và meeting point.
- **Di chuyển/thuê xe:** resource, thời gian và khu vực phục vụ.
- **Spa:** appointment slot và thời lượng.
- **Giặt là:** pickup window, yêu cầu báo giá và xác nhận sau.

Inventory do admin nhập và kiểm soát trong pilot. Đối tác gửi đề xuất sửa listing; admin duyệt trước khi phiên bản mới được xuất bản.

### Instant booking

1. Khách chọn offering, ngày/giờ và số lượng.
2. Supply Service kiểm tra và giữ tồn trong 15 phút.
3. Booking Service tạo booking ở trạng thái `AWAITING_DEPOSIT`.
4. Khách thanh toán hoặc nộp chứng từ.
5. Thanh toán thành công chuyển booking sang `CONFIRMED`.
6. Hết 15 phút chưa thanh toán thì booking chuyển `EXPIRED` và tồn được trả lại.

### Chuyển khoản thủ công

- Khách nộp mã hoặc ảnh giao dịch trong 15 phút.
- Booking chuyển sang `PAYMENT_SUBMITTED`.
- Inventory hold được gia hạn thêm tối đa hai giờ.
- Admin duyệt hoặc từ chối chứng từ.
- Chứng từ được lưu trong private storage và chỉ truy cập bằng signed URL.

### Request booking

- Đối tác có 60 phút để chấp nhận hoặc từ chối.
- Hệ thống nhắc đối tác sau 30 phút.
- Quá 60 phút, booking chuyển sang `ESCALATED`.
- Admin có thêm 60 phút để tìm phương án thay thế hoặc hủy.

### Hoàn thành dịch vụ

- Đối tác đánh dấu đã phục vụ.
- Khách có 24 giờ để báo vấn đề.
- Nếu không có khiếu nại, booking tự chuyển `COMPLETED`.
- Chỉ booking `COMPLETED` mới được viết review.

### Chính sách hủy

Mỗi offering chọn `FLEXIBLE` hoặc `NON_REFUNDABLE`.

#### Lưu trú Flexible

- Trước 72 giờ: hoàn 100% cọc.
- Từ 24–72 giờ: hoàn 50% cọc.
- Dưới 24 giờ: không hoàn.

#### Tour, thuê xe và spa Flexible

- Trước 24 giờ: hoàn 100% cọc.
- Từ 6–24 giờ: hoàn 50% cọc.
- Dưới 6 giờ: không hoàn.

#### Giặt là Flexible

- Trước khi nhận đồ: hoàn 100% cọc.
- Sau khi nhận đồ: không hoàn.

#### Lỗi từ đối tác

- Hoàn toàn bộ cọc.
- Admin hỗ trợ tìm dịch vụ thay thế.
- Khách quyết định có tạo booking mới hay không.

### Coupon

- Coupon do đối tác tài trợ.
- Hỗ trợ giảm theo phần trăm hoặc số tiền cố định.
- Có thời gian hiệu lực, giá trị booking tối thiểu và quota.
- Có giới hạn số lượt dùng trên mỗi tài khoản.
- Không cộng dồn nhiều coupon.
- Hoa hồng tính trên giá sau giảm.

## 5. Payment và đối soát

Sau legal gate:

- Zalo Mini App dùng Checkout SDK.
- SEPay là payment provider production chính cho cả Zalo Mini App và public web.
- Trên Zalo Mini App, SEPay được cấu hình như custom payment method của Checkout SDK.
- Hệ thống tạo Zalo order, chuyển người dùng sang SEPay, nhận IPN và đồng bộ trạng thái order.
- Callback/IPN phải xác minh chữ ký, số tiền, mã đơn, trạng thái hiện tại và xử lý idempotent.
- Refund do admin thực hiện trên dashboard provider rồi nhập mã tham chiếu.
- Không tự động payout, refund hoặc recurring subscription trong MVP.
- Đối soát với đối tác hằng tuần.
- ZaloPay, MoMo và VNPay chỉ giữ interface hoặc sandbox; không triển khai production trong MVP.

## 6. Xác minh đối tác

Checklist Verified:

- Danh tính hoặc thông tin pháp nhân.
- Giấy phép phù hợp với loại dịch vụ.
- Tài khoản nhận tiền.
- Số điện thoại, email và người đại diện.
- Địa chỉ hoặc bằng chứng địa điểm hoạt động.

Quy tắc lưu KYC:

- Lưu private và không dùng chung với ảnh listing.
- Signed URL có thời hạn ngắn.
- Ghi audit người truy cập.
- Xóa sau 90 ngày kể từ khi chấm dứt hợp tác, trừ yêu cầu pháp lý khác.

## 7. Kiến trúc hệ thống

### Monorepo

Sử dụng pnpm và Turborepo:

```text
frontend/
├── zalo-mini/          React + Vite + ZaUI
├── public-web/         Next.js + Tailwind + shadcn/ui
└── operations-portal/  React + Vite + Ant Design

backend/
├── identity-service/  NestJS + Prisma
├── supply-service/    NestJS + Prisma
└── booking-service/   NestJS + Prisma

packages/
├── api-clients/        Client TypeScript sinh từ OpenAPI
├── api-contracts/      OpenAPI source of truth
├── design-tokens/      Màu sắc, typography, spacing và icons
├── config/             ESLint, TypeScript và build config
└── observability/      Logger, correlation ID và Sentry helpers
```

Ba frontend deploy độc lập nhưng dùng chung TypeScript, design token và API contract.

### Identity Service

- Firebase Auth cho Google, email magic link và SMS OTP.
- Zalo authorization và phone consent.
- Xác minh Firebase/Zalo token rồi phát hành JWT của nền tảng.
- Quản lý user, external identity, account linking và role.
- Chỉ gộp tài khoản sau khi người dùng xác minh và chủ động xác nhận.

### Supply Service

- Partner và trạng thái KYC.
- Category, listing, offering và nội dung song ngữ.
- Rate plan, availability và service area.
- Inventory hold, release và commit.
- Promotion/coupon definition.
- Listing revision và admin approval.
- Aggregate rating projection.

### Booking Service

- Booking state machine.
- Concierge request.
- Deposit, payment attempt và refund reference.
- Cancellation và dispute.
- Partner confirmation SLA.
- Review.
- Commission, subscription và weekly settlement.
- Notification Center và Zalo OA/ZBS adapter.
- WebSocket booking status.
- Itinerary và AI Assistant module.
- Weather monitoring, replan suggestion và share-link lifecycle.

### Database

Một Neon PostgreSQL cluster chứa ba database riêng:

- `identity_db`
- `supply_db`
- `booking_db`

Mỗi service có credential riêng và không truy cập trực tiếp database của service khác.

### Giao tiếp service

- REST API version `/v1`.
- OpenAPI là nguồn sự thật cho API contract.
- Sinh TypeScript client cho frontend.
- Cloudflare Worker làm edge proxy, CORS và rate limit.
- WebSocket chỉ dùng cho booking mới và thay đổi trạng thái.
- Redis Streams truyền domain event.
- Transactional Outbox chống mất event.
- Correlation ID theo request xuyên service.

Domain events tối thiểu:

- `InventoryHeld`
- `InventoryHoldExpired`
- `DepositSubmitted`
- `DepositPaid`
- `BookingConfirmed`
- `BookingEscalated`
- `BookingCancelled`
- `ServiceCompleted`
- `ReviewPublished`
- `SettlementClosed`
- `ItineraryCreated`
- `WeatherRiskDetected`
- `TravelAlertPublished`

### API chính

- `POST /v1/auth/exchange/zalo`
- `POST /v1/auth/exchange/firebase`
- `POST /v1/accounts/link`
- `GET /v1/listings`
- `GET /v1/listings/{slug}`
- `GET /v1/offerings/{id}/availability`
- `POST /v1/internal/inventory-holds`
- `POST /v1/bookings`
- `POST /v1/bookings/{id}/payment-proof`
- `POST /v1/bookings/{id}/cancel`
- `POST /v1/bookings/{id}/complete`
- `POST /v1/payments/{provider}/callback`
- `POST /v1/payments/sepay/checkout`
- `POST /v1/payments/sepay/webhook`
- `POST /v1/concierge-requests`
- `POST /v1/reviews`
- `POST /v1/assistant/sessions`
- `POST /v1/assistant/sessions/{id}/messages`
- `POST /v1/itineraries`
- `GET /v1/itineraries/{id}`
- `PATCH /v1/itineraries/{id}/items/{itemId}`
- `POST /v1/itineraries/{id}/replan`
- `POST /v1/itineraries/{id}/share`
- `GET /v1/shared-itineraries/{token}`
- `GET /v1/weather`
- `GET /v1/notifications`

### Design patterns

- NestJS Module/Layer: Controller → Service → Repository.
- Strategy: inventory, pricing và cancellation theo loại dịch vụ.
- State Machine: booking lifecycle.
- Adapter: Firebase, Zalo, SEPay, LLM, weather và maps.
- Saga Orchestration: inventory hold → deposit → booking confirmation.
- Transactional Outbox: đảm bảo domain event.
- Repository: cô lập Prisma trong persistence layer.
- Idempotency Key: tạo booking và payment callback.

## 8. AI đồng hành và thời tiết

### Trải nghiệm người dùng

AI hoạt động trên Zalo Mini App và public web. Người dùng bắt đầu bằng wizard năm bước gồm ngày đi, số người, ngân sách, sở thích và khu vực lưu trú. Kết quả là lịch trình theo khung giờ, có thời gian di chuyển, chi phí dự kiến, nguồn dữ liệu và phương án thay thế khi trời mưa.

Sau khi tạo lịch trình, người dùng có thể chat để đổi từng hoạt động, khung giờ hoặc ngân sách. AI chỉ đưa ra đề xuất. Hệ thống không cung cấp cho model công cụ tạo booking, giữ chỗ, hủy hoặc thanh toán. Khi khách chọn một dịch vụ, app mở trang booking đã điền dịch vụ, ngày và giờ; backend vẫn phải kiểm tra lại giá và availability.

Khách web ẩn danh được tạo một lịch trình tạm và dữ liệu hết hạn sau 24 giờ. Đăng nhập là bắt buộc để lưu, tiếp tục chỉnh sửa, chia sẻ hoặc đặt dịch vụ. Link chia sẻ ở chế độ chỉ đọc, có token ngẫu nhiên và có thể thu hồi.

### Nguồn dữ liệu

- Listing, offering, availability và booking lấy từ service nội bộ.
- Địa điểm ngoài marketplace lấy từ Google Places; chỉ lưu `place_id` và dữ liệu được phép lưu.
- Google Routes tính thời gian di chuyển cho ô tô, xe máy và đi bộ; app mở Google Maps khi người dùng bắt đầu điều hướng.
- WeatherAPI cung cấp thời tiết hiện tại và dự báo theo giờ trong 48 giờ.
- Google Weather Alerts cung cấp cảnh báo thời tiết nghiêm trọng.
- Sự kiện địa phương do admin nhập, kèm nguồn, thời gian, trạng thái và `lastVerifiedAt`.

MVP dùng PostgreSQL có cấu trúc, chưa sử dụng vector database hoặc RAG. Cách này phù hợp với khoảng 20 listing và giúp kiểm tra chính xác giá, giờ mở cửa, availability và nguồn dữ liệu.

### Model và provider adapter

Booking Service chứa `LLMProviderAdapter` với hai implementation chính: OpenAI và Gemini. Nhóm benchmark `gpt-6-luna` và `gemini-3.8-flash` trên cùng bộ dữ liệu giả.

Model phải đạt 100% kiểm tra schema, an toàn và ID hợp lệ, đồng thời đạt ít nhất 85% tình huống có lịch trình đúng. Nếu cả hai đạt, model có chi phí trung bình thấp hơn được chọn làm primary. Nếu chênh lệch chi phí dưới 10%, model chính xác hơn được chọn. Model còn lại làm fallback kỹ thuật.

Luồng lỗi là: primary, retry primary một lần, secondary một lần, GPT-6 Sol một lần, sau đó template planner và concierge. GPT-6 Sol chỉ là fallback cấp cuối khi các model khác lỗi schema hoặc tool calling, không dùng để nâng chất lượng cảm tính.

### Kiểm soát chất lượng và an toàn

- Kết quả cuối phải vượt JSON Schema validation và business validation.
- Mọi `listingId`, `offeringId` và `placeId` phải tồn tại trong tool result.
- Kiểm tra giờ mở cửa, xung đột booking, travel time và weather risk trước khi hiển thị.
- Không stream nội dung chưa được xác minh ra giao diện.
- Mục tiêu phản hồi là 15 giây; timeout ở 25 giây rồi chuyển sang template.
- AI chỉ đề xuất đổi lịch khi có cảnh báo chính thức hoặc quy tắc rủi ro được cấu hình.
- AI không tự sửa lịch đã lưu; người dùng phải xác nhận.

### Quyền riêng tư và lưu trữ

Chỉ gửi khu vực gần đúng, sở thích, ngân sách và các ID cần thiết cho model. Không gửi số điện thoại, email, token, tọa độ GPS thô hoặc thông tin thanh toán. Quyền vị trí chỉ được yêu cầu khi người dùng bấm “Gần tôi” hoặc “Cập nhật vị trí”; không theo dõi nền.

Chat history được giữ 30 ngày. Lịch trình đã lưu được xóa 30 ngày sau ngày kết thúc chuyến đi; sau đó chỉ giữ analytics đã ẩn danh. Lịch trình tạm của khách ẩn danh hết hạn sau 24 giờ.

### Giới hạn chi phí và vận hành

- Rate limit 5 yêu cầu AI mỗi phút trên mỗi tài khoản.
- Khách ẩn danh chỉ được tạo một lịch trình tạm.
- Ngân sách AI tối đa 300.000đ mỗi tháng.
- Cảnh báo chi phí tại 70% và 90%.
- Khi đạt 100%, circuit breaker ngừng gọi LLM và chuyển sang template planner.
- Theo dõi latency, provider error, schema failure, fallback rate, token và chi phí mỗi lịch trình.

## 9. Hạ tầng pilot

- Zalo Mini App: Zalo Platform.
- Public web: Vercel.
- Operations portal: Cloudflare Pages.
- Ba NestJS service: Render free.
- Edge proxy: Cloudflare Worker.
- PostgreSQL: Neon.
- Redis Streams/cache: Upstash.
- Ảnh listing: Cloudinary.
- KYC và payment proof: Cloudflare R2 private bucket.
- Email: Resend.
- Authentication: Firebase Auth.
- Maps: Google Maps.
- Weather: WeatherAPI và Google Weather Alerts.
- AI: OpenAI API và Gemini API qua provider adapter.
- Payment: SEPay.
- Analytics: PostHog Cloud.
- Error monitoring: Sentry.
- CI/CD: GitHub Actions.

Giới hạn được chấp nhận:

- Render free có cold start và không có production SLA.
- WebSocket chỉ mở khi người dùng đang xem booking hoặc portal.
- Frontend hiển thị trạng thái khởi động và retry khi backend đang wake up.
- Google Maps, weather, AI, SMS và payment có quota/budget alert.

## 10. Roadmap 16 tuần

### Tuần 1–2: Discovery và validation

- Phỏng vấn khách và nhà cung cấp.
- Kiểm chứng pain point và willingness-to-pay.
- Hoàn thiện Lean Canvas, persona, JTBD và customer journey.
- Tạo glossary domain và workflow specs.
- Cập nhật kế hoạch khi nhận rubric môn học.
- Xác nhận legal gate, AI consent và nguồn dữ liệu được phép sử dụng.
- Chuẩn bị golden dataset cho benchmark model bằng dữ liệu giả.

### Tuần 3–4: UX và foundation

- Sitemap, wireframe và prototype song ngữ.
- Dùng Google Stitch MCP để thử các luồng mobile; chốt `DESIGN.md` và kiểm tra thiết kế trên kích thước Zalo Mini App trước khi code.
- Khởi tạo monorepo, CI, môi trường và secrets.
- Tạo `AGENTS.md`, các rule theo phạm vi và Git hooks sau khi có lệnh kiểm tra thực tế; kết nối GitHub MCP và Context7 khi repo hoạt động.
- Xây design tokens.
- Dựng ba service, database, Prisma và OpenAPI.
- Hoàn thiện Identity Service và RBAC.
- Tạo interface cho SEPay, LLM, weather và maps adapters.
- Thiết lập cost dashboard, rate limit và feature flags.

### Tuần 5–6: Supply và admin

- Partner/KYC onboarding.
- Listing revision và approval.
- Bilingual content.
- Năm inventory strategy.
- Service area và Google Maps.
- Admin quản lý giá, tồn và cancellation policy.
- Admin quản lý sự kiện, FAQ và template itinerary đã xác minh.

### Tuần 7–8: Trải nghiệm khách hàng

- Zalo Mini App.
- Chuyển thiết kế Stitch thành React/ZaUI có kiểm tra safe area, khả năng đọc chữ và thao tác chạm; không dùng React Native cho Mini App.
- Public Next.js web.
- Search, filter, map và listing detail.
- Firebase/Zalo authentication.
- Account linking.
- USD reference display.
- Concierge form.
- Weather widget và template planner không dùng LLM.

### Tuần 9–10: Booking và partner portal

- Inventory hold 15 phút.
- Booking state machine và Saga.
- Instant booking và request booking.
- Partner owner/staff portal.
- Nhắc 30 phút và escalation 60 phút.
- WebSocket booking updates.
- Completion và review.

### Tuần 11–12: Payment và engagement

- Manual payment proof và hold hai giờ.
- SEPay sandbox và Checkout SDK custom payment method.
- Webhook/IPN idempotency và payment reconciliation.
- Cancellation, refund và dispute.
- Coupon.
- Subscription và weekly settlement.
- Notification Center và Zalo OA/ZBS notifications.
- Legal/merchant checkpoint.

### Tuần 13: AI planner

- Wizard năm bước và itinerary schema.
- Chat chỉnh sửa từng mục lịch trình.
- Booking deep link với dữ liệu điền sẵn.
- Anonymous itinerary và login gate.
- Share link chỉ đọc và thu hồi token.

### Tuần 14: Live data và benchmark

- WeatherAPI, Google Weather Alerts, Places và Routes tools.
- Weather risk detection và replan suggestion.
- Golden tests cho OpenAI và Gemini.
- Chọn primary model theo quality gate và chi phí.
- Bật circuit breaker, budget alert và template fallback.

### Tuần 15: Tích hợp và chuẩn bị pilot

- Manual regression toàn hệ thống.
- Dùng Playwright cho public web và portal; kiểm thử riêng Mini App trong Zalo và trên thiết bị thật.
- Automated golden tests cho AI.
- Security review, audit log và retention jobs.
- Seed 20 listing từ 5 đối tác.
- Nộp Zalo Mini App để xét duyệt.
- Kiểm tra cold start, retry và provider outage.
- Bật production payment nếu legal gate đạt.
- Nếu chưa đạt, sử dụng pay-at-provider.

### Tuần 16: Pilot và pitching

- Chạy closed pilot.
- Theo dõi lỗi bằng Sentry và funnel/feature flag bằng PostHog; chỉ cấp quyền MCP khi cần phân tích pilot.
- Theo dõi funnel và xử lý lỗi.
- Đạt 10 booking hoàn thành.
- Đo planner start, generation success, listing click và booking attribution.
- Phỏng vấn khách và đối tác sau sử dụng.
- Tổng hợp conversion, unit economics và cancellation rate.
- Hoàn thiện business plan, demo script và pitch deck.

## 11. Phân công nhóm

### Product/UX

- Customer discovery và partner interview.
- Business plan, workflow và policy.
- Wireframe, prototype và content song ngữ.
- Quản lý pilot, QA và pitch deck.
- Biên tập sự kiện, template planner và nội dung an toàn.

### Frontend

- Zalo Mini App.
- Public web.
- Operations portal.
- Design tokens, responsive UI và analytics events.
- Wizard AI, itinerary editor, weather widget và Notification Center.

### Backend/DevOps

- Ba NestJS service.
- Database, Redis Streams và WebSocket.
- Payment, notification và storage adapters.
- CI/CD, deployment, logging và monitoring.
- SEPay, LLM, weather và maps adapters.
- Golden test runner, cost controls và retention jobs.

Cả nhóm cùng thực hiện validation và manual regression.

## 12. Kiểm thử và nghiệm thu

Các luồng giao diện và nghiệp vụ chính được kiểm thử tay. Riêng AI có bộ golden tests tự động vì lỗi schema, ID, giờ mở cửa và xung đột lịch khó phát hiện ổn định bằng kiểm thử thủ công. CI chạy lint, type-check, build, OpenAPI diff, migration check và AI golden tests.

### Manual regression bắt buộc

- Đăng nhập Zalo, Google, magic link và SMS OTP.
- Liên kết tài khoản trùng email hoặc số điện thoại.
- Kiểm tra phân quyền Customer, Partner và Admin.
- Search song ngữ, bản đồ và phụ phí vùng.
- Hai khách cạnh tranh slot cuối.
- Hold hết hạn và trả tồn.
- Nhắc đối tác sau 30 phút và escalation sau 60 phút.
- Payment proof được duyệt, từ chối và quá hạn.
- Payment callback thành công, thất bại và gửi lặp.
- Coupon hết hạn, hết quota và dùng lặp.
- Chính sách hoàn 100%, 50% và 0%.
- Đối tác hủy và quy trình tìm thay thế.
- Hoàn thành booking sau 24 giờ và mở review.
- WebSocket reconnect và REST fallback.
- Notification không gửi trùng.
- KYC/payment proof không truy cập công khai.
- PostHog không thu dữ liệu nhạy cảm.
- Render cold start và service tạm thời không khả dụng.
- Khách ẩn danh chỉ tạo được một lịch trình tạm và hết hạn đúng 24 giờ.
- Share link chỉ đọc, không cho người nhận chỉnh sửa và ngừng hoạt động sau khi thu hồi.
- Cảnh báo thời tiết chỉ tác động đến hoạt động liên quan.
- Chạm 100% ngân sách AI phải chuyển sang template mà không làm hỏng planner.

### Automated golden tests cho AI

Bộ test gồm 15–20 tình huống bằng tiếng Việt và tiếng Anh: chuyến một ngày, nhiều ngày, gia đình, cặp đôi, ngân sách thấp, trời mưa, cảnh báo nghiêm trọng, dịch vụ hết chỗ, giờ mở cửa, thời gian di chuyển và xung đột booking.

Mọi kết quả phải đúng schema, chỉ dùng ID tồn tại, không bịa availability, không làm lộ dữ liệu cá nhân và không tạo hành động booking/payment. Model phải đạt 100% kiểm tra an toàn/schema/ID và tối thiểu 85% tình huống đúng về lịch trình.

### Acceptance criteria

- Luồng tìm kiếm → booking → hoàn thành chạy được trên Zalo và web.
- Không double booking trong các kịch bản cạnh tranh.
- Mọi thay đổi booking có actor, thời gian và audit entry.
- Callback lặp không tạo hai khoản thanh toán.
- Listing phải đủ tiếng Việt và tiếng Anh trước khi publish.
- Đạt 5 đối tác, 20 listing, 50 tài khoản và 10 booking hoàn thành.
- Không giữ tiền khách trước khi legal gate được phê duyệt.
- AI tạo lịch trình hợp lệ trong 15 giây ở ít nhất 95% request thành công.
- AI không tự tạo, hủy hoặc thanh toán booking.
- Notification Center luôn lưu được cảnh báo kể cả khi OA/ZBS không gửi được.
- Planner đạt tối thiểu 15 lượt bắt đầu, 10 lịch trình thành công, 30% listing click, 2 booking hoàn thành và điểm hữu ích 4/5.

## 13. Ngoài phạm vi MVP

- Giỏ nhiều nhà cung cấp.
- Chat realtime trong ứng dụng.
- AI translation tự do và chatbot hỏi đáp mọi chủ đề.
- Web search mở, vector database và RAG.
- OA chatbot, voice assistant và background location.
- AI tự động tạo, hủy, đổi hoặc thanh toán booking.
- Loyalty và referral.
- Dynamic pricing.
- Đồng bộ OTA/channel manager.
- Multi-currency settlement.
- Automated payout, refund và recurring billing.
- Nhà hàng/đặt bàn.
- Hỗ trợ 24/7.
- Production SLA hoặc kiến trúc high availability.

## 14. Rủi ro chính

- Chưa có pháp nhân hoặc merchant account.
- Tích hợp Checkout SDK custom method và SEPay phụ thuộc merchant approval.
- Zalo Mini App cần xét duyệt và consent đúng quy định.
- Render free có cold start.
- Chất lượng AI có thể không đạt quality gate hoặc vượt ngân sách.
- Weather, maps hoặc LLM provider có thể gián đoạn.
- Firebase SMS, Zalo OA/ZBS và Google Maps có thể phát sinh phí.
- Nhóm ba người phải đồng thời làm product validation, ba frontend và ba service.

Ưu tiên khi thiếu thời gian:

1. Giữ luồng booking end-to-end.
2. Giữ nguồn cung thật và validation.
3. Giữ một payment production là SEPay; dùng pay-at-provider nếu legal gate chưa đạt.
4. Giữ weather widget và template planner trước khi bật AI.
5. Tắt AI bằng feature flag nếu không đạt quality gate hoặc vượt ngân sách.

## 15. Cấu trúc dữ liệu và chính sách lưu trữ

### Thực thể chính

- Identity: `User`, `ExternalIdentity`, `Consent`, `RoleAssignment`.
- Supply: `Partner`, `Listing`, `Offering`, `Availability`, `InventoryHold`, `LocalEvent`, `VerifiedContent`.
- Booking: `Booking`, `PaymentAttempt`, `RefundReference`, `Review`, `Settlement`, `Notification`.
- Companion: `AssistantSession`, `ChatMessage`, `Itinerary`, `ItineraryItem`, `ShareToken`, `WeatherSnapshot`, `TravelAlert`.

`ItineraryItem` chứa tối thiểu `startAt`, `endAt`, `title`, `type`, `listingId` hoặc `placeId`, `estimatedCost`, `travelDurationMinutes`, `travelMode`, `source`, `verificationStatus`, `weatherRisk`, `rainAlternative` và `bookingDeepLink`.

### Retention

| Loại dữ liệu | Thời hạn | Cách xử lý khi hết hạn |
|---|---|---|
| Lịch trình tạm | 24 giờ | Xóa toàn bộ |
| Chat history | 30 ngày | Xóa nội dung và định danh |
| Lịch trình đã lưu | 30 ngày sau chuyến đi | Xóa nội dung cá nhân, giữ analytics ẩn danh |
| KYC đối tác | 90 ngày sau chấm dứt hợp tác | Xóa nếu không có nghĩa vụ pháp lý khác |
| Payment/audit | Theo yêu cầu pháp lý và đối soát | Hạn chế truy cập, không gửi LLM |

## 16. Chi phí pilot

Nhóm ưu tiên free tier cho hosting nhưng không coi free tier là production SLA. Các dịch vụ phát sinh chi phí phải có quota và budget alert.

| Nhóm chi phí | Nguyên tắc MVP |
|---|---|
| AI | Trần 300.000đ/tháng; cảnh báo 70% và 90%; template fallback tại 100% |
| Maps và routes | Giới hạn theo API key, domain và daily quota |
| Weather | Theo dõi quota WeatherAPI; Google Weather chỉ dùng alerts |
| Payment | Phí giao dịch theo hợp đồng SEPay; không lưu thông tin thẻ |
| Hosting | Vercel, Cloudflare, Render, Neon và Upstash free/pilot tier |
| Notification | Ưu tiên Notification Center; OA/ZBS bật khi được duyệt |

## 17. Thuật ngữ

- **Listing:** trang thông tin của một dịch vụ hoặc cơ sở.
- **Offering:** biến thể có thể đặt của listing, gắn với giá và availability.
- **Inventory hold:** khóa tạm tồn kho trong khi khách thanh toán.
- **Instant booking:** booking được xác nhận tự động sau thanh toán.
- **Request booking:** booking cần đối tác chấp nhận.
- **Concierge:** yêu cầu hỗ trợ thủ công khi chưa có listing phù hợp.
- **Itinerary:** lịch trình gồm các hoạt động theo thời gian.
- **Feature flag:** công tắc cấu hình cho phép bật hoặc tắt tính năng mà không deploy lại.
- **Quality gate:** điều kiện chất lượng bắt buộc trước khi model được dùng trong pilot.
- **Fallback:** phương án dự phòng khi provider hoặc model chính thất bại.
- **IPN/Webhook:** thông báo server-to-server về trạng thái thanh toán.
- **Idempotency:** cùng một request gửi lại không tạo thêm kết quả trùng.

## 18. Tài liệu tham khảo chính thức

- Zalo Mini App Location API: https://docs.zaloplatforms.com/docs/MA/api/location/getLocation
- Zalo Mini App Permission: https://docs.zaloplatforms.com/docs/MA/intro/request-permission
- Zalo Checkout SDK Custom Method: https://docs.zaloplatforms.com/docs/MA/checkoutSdk/custom-method/intro
- SEPay Developer Documentation: https://developer.sepay.vn/vi
- SEPay Webhook Integration: https://developer.sepay.vn/en/sepay-webhooks/tich-hop-webhook
- Google Places API Policies: https://developers.google.com/maps/documentation/places/web-service/policies
- Google Weather Coverage: https://developers.google.com/maps/documentation/weather/coverage
- Google Weather Alerts: https://developers.google.com/maps/documentation/weather/weather-alerts
- WeatherAPI Pricing and Features: https://www.weatherapi.com/pricing.aspx
- Gemini Function Calling: https://ai.google.dev/gemini-api/docs/function-calling
- Gemini Structured Outputs: https://ai.google.dev/gemini-api/docs/generate-content/structured-output
- Gemini API Pricing: https://ai.google.dev/gemini-api/docs/pricing
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs

## Phụ lục A. Bộ công cụ hỗ trợ phát triển

Phụ lục này là kế hoạch sử dụng công cụ cho nhóm phát triển, không phải danh sách thành phần bắt buộc trong ứng dụng chạy production. Chỉ bật từng MCP khi đã có tài khoản, dữ liệu và công việc tương ứng. API runtime của Zalo, SEPay, WeatherAPI, Google Maps và model AI vẫn được gọi qua adapter backend; MCP không thay thế các tích hợp này.

### A.1. MCP được chọn theo giai đoạn

| MCP | Giai đoạn | Mục đích và giới hạn |
|---|---|---|
| GitHub MCP | Khi khởi tạo repo | Đọc issue, pull request, review và CI. Bắt đầu với quyền tối thiểu; không tự động merge hoặc thay đổi bảo vệ nhánh. |
| Context7 | Khi bắt đầu code | Tra tài liệu theo phiên bản của React, NestJS, Prisma, Next.js và thư viện liên quan. Đối chiếu tài liệu chính thức trước quyết định quan trọng. |
| Google Stitch MCP | UX tuần 3–4 | Tạo, sửa và so sánh màn hình mobile; dùng brief và design system chung. Thiết kế được duyệt mới chuyển sang code. |
| Figma MCP chính thức | Khi có file Figma | Đọc component, token và layout; tùy chọn nếu nhóm dùng Figma làm nguồn thiết kế. Không cài trùng công cụ đã kết nối. |
| Playwright MCP | Từ tuần 7–8 | Khám phá, chụp và kiểm tra public web/portal. Không thay thế kiểm thử Mini App trong Zalo. |
| Neon MCP | Sau khi có database dev/test | Xem schema và truy vấn hỗ trợ phát triển. Giới hạn project, ưu tiên read-only; không nối production. |
| Sentry MCP | Pilot | Phân tích lỗi và trace sau khi app đã gắn Sentry; giới hạn quyền theo dự án. |
| PostHog MCP | Pilot | Kiểm tra funnel, analytics và feature flag sau khi đã gắn PostHog; tránh xuất dữ liệu cá nhân không cần thiết. |
| Cloudflare MCP | Khi vận hành Worker | Chỉ dùng nếu cần quản lý hoặc chẩn đoán Worker; quyền thay đổi hạ tầng cần phê duyệt riêng. |

Không cài MCP Google Maps, WeatherAPI hoặc Redis chỉ để thực hiện tính năng runtime. Không chọn MCP Zalo/SEPay không được xác minh nguồn và quyền. Với danh sách cộng đồng, ưu tiên repo chính chủ, đọc quyền yêu cầu và thử trong môi trường dev trước khi kết nối.

### A.2. Skill cho nhóm

| Skill | Thời điểm và kết quả mong đợi |
|---|---|
| `engineering-suite-grill-me:domain-modeling` | Trước code booking: mô hình trạng thái, tồn kho, hủy và đối soát. |
| `engineering-suite-plan:planning-and-task-breakdown` | Chuyển roadmap 16 tuần thành backlog có người phụ trách và tiêu chí nghiệm thu. |
| `engineering-suite-plan:documentation-and-adrs` | Ghi ADR cho ranh giới ba service, SEPay, OpenAPI và AI adapter. |
| `stitch-design-taste` | Tạo `DESIGN.md` làm chuẩn màu, chữ, khoảng cách và trạng thái tương tác cho Stitch. Điều chỉnh quy tắc theo giới hạn mobile/Zalo. |
| `imagegen-frontend-mobile` | Tạo ảnh tham chiếu cho luồng mobile; không tạo code. |
| `design-taste-frontend` | Rà tính nhất quán thị giác khi triển khai React; không áp dụng máy móc hiệu ứng hoặc bố cục website cho Mini App. |
| `build-web-apps:frontend-app-builder` và `build-web-apps:react-best-practices` | Xây ba frontend và kiểm tra thực hành React. |
| `build-web-apps:supabase-postgres-best-practices` | Áp dụng phần thực hành PostgreSQL phù hợp với Neon/Prisma; không dùng cấu hình riêng Supabase. |
| `engineering-suite-review:security-and-hardening` và `engineering-suite-review:code-review-and-quality` | Rà auth, webhook, PII, AI và thay đổi trước merge. |

Với Stitch, ưu tiên skill `stitch::generate-design` cho màn hình và `stitch::react-components` khi chuyển thiết kế sang React. Không dùng `stitch::react-native` vì Zalo Mini App trong kế hoạch là React web app. Đầu ra Stitch là bản thiết kế/điểm xuất phát; frontend phải kiểm tra lại ZaUI, safe area, trạng thái loading/error, đa ngôn ngữ và hiệu năng trên thiết bị.

### A.3. Rules, hooks và kiểm tra tự động

- `AGENTS.md` ở gốc repo là quy ước chung: stack, nguồn sự thật OpenAPI, ranh giới service/database, lệnh kiểm tra và nguyên tắc bảo mật. Nếu dùng Cursor, chỉ tạo `.cursor/rules/*.mdc` cho quy tắc riêng theo thư mục; tránh sao chép toàn bộ `AGENTS.md`.
- Rule booking/payment: giữ chỗ và hết hạn phải có trạng thái rõ; xác thực webhook SEPay, xử lý idempotency, đối soát trước khi xác nhận; không cho AI trực tiếp đặt dịch vụ hoặc thanh toán.
- Rule AI/privacy: kiểm tra schema và ID nguồn, không gửi PII hoặc payment data vào LLM, có consent, quota, feature flag và template fallback.
- Rule database/API: mỗi service sở hữu database của mình; migration phải được kiểm tra; thay đổi OpenAPI phải cập nhật client và kiểm tra breaking change.
- Pre-commit sau khi repo có code: format/lint trên file đã sửa và quét secret. Pre-push: type-check và unit test nhanh. Không chạy tác vụ nặng trên mỗi lần lưu file.
- GitHub Actions trên pull request: lint, type-check, build, OpenAPI diff, Prisma migration check; từ tuần 13 bổ sung AI golden tests. Hook không thay thế CI và kiểm thử thủ công.

### A.4. Quy trình thiết kế mobile

Product/UX chốt luồng khám phá → chi tiết dịch vụ → đặt chỗ → trạng thái thanh toán, cùng luồng wizard lịch trình → chỉnh lịch → cảnh báo thời tiết. Sau đó tạo `DESIGN.md`, dùng Stitch sinh phương án màn hình, duyệt khả năng đọc và thao tác trên thiết bị nhỏ, rồi Frontend triển khai React/ZaUI. Bản code được kiểm tra trong Zalo Mini App, không đánh giá chất lượng chỉ từ ảnh mockup hoặc browser web thông thường.

### A.5. Nguồn công cụ

- Awesome MCP Servers: https://github.com/punkpeye/awesome-mcp-servers
- GitHub MCP: https://github.com/github/github-mcp-server
- Context7: https://github.com/upstash/context7
- Google Stitch MCP: https://stitch.withgoogle.com/docs/mcp/setup
- Google Stitch Skills: https://github.com/google-labs-code/stitch-skills
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Figma MCP: https://help.figma.com/hc/en-us/articles/39216419318551-Get-started-with-the-Figma-MCP-server
- Playwright MCP: https://github.com/microsoft/playwright-mcp
- Neon MCP: https://github.com/neondatabase/mcp-server-neon
- Sentry MCP: https://github.com/getsentry/sentry-mcp
- PostHog MCP: https://github.com/PostHog/posthog/tree/master/services/mcp
- Cloudflare MCP: https://github.com/cloudflare/mcp-server-cloudflare
