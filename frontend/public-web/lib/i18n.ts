/**
 * Shared copy for the assistant surfaces (full planner chat and the floating
 * mini widget). Both surfaces used to carry their own strings, which drifted:
 * the mini widget was Vietnamese-only while the planner was bilingual.
 *
 * Keep every user-facing string here instead of inline ternaries so a new
 * language is one object, not a hundred call sites.
 */
import type { Lang } from '../app/catalog';

export type AssistantCopy = {
  headerStatus: string;
  headerAccount: string;
  headerCloseMenu: string;
  toastClose: string;
  heading: string;
  intro: string;
  placeholder: string;
  send: string;
  loading: string;
  privacy: string;
  fallback: string;
  retry: string;
  demo: string;
  you: string;
  assistant: string;
  chooseAnswer: string;
  otherAnswerPlaceholder: string;
  failureNetwork: string;
  failureRoute: string;
  failureServer: string;
  failureBusy: string;
  failureTimeout: string;
  failureFormat: string;
  failureKey: string;
  failureAuth: string;
  failureProvider: string;
  failureRate: string;
  widgetTitle: string;
  widgetSubtitle: string;
  widgetReset: string;
  widgetExpand: string;
  widgetClose: string;
  widgetOpen: string;
  widgetPlaceholder: string;
  widgetLoading: string;
  widgetWelcome: string;
  widgetQuickLabel: string;
  widgetQuick: readonly string[];
  widgetError: string;
  planReadyTitle: string;
  planReadyBody: string;
  planReadyCta: string;
};

export const assistantCopy: Record<Lang, AssistantCopy> = {
  vi: {
    headerStatus: 'Phú Quốc • Đang hoạt động',
    headerAccount: 'Tài khoản',
    headerCloseMenu: 'Đóng',
    toastClose: 'Đóng thông báo',
    heading: 'GOPU AI · Phú Quốc',
    intro: 'Chia sẻ số ngày, số người, ngân sách tổng và điều bạn thích. Mình sẽ hỏi thêm nếu cần.',
    placeholder: 'Ví dụ: 3 ngày, 5 người, ngân sách 20 triệu…',
    send: 'Gửi',
    loading: 'Đang lên gợi ý…',
    privacy:
      'Khi bắt đầu, nội dung chat sẽ được gửi tới Gemini để tạo gợi ý. Không gửi thông tin tài khoản hoặc thanh toán; tránh nhập thông tin cá nhân.',
    fallback: 'Tạo lịch trình mẫu',
    retry: 'Thử lại',
    demo: 'Gợi ý từ dữ liệu minh họa; giá chưa xác minh và không thể hiện tình trạng còn chỗ.',
    you: 'Bạn',
    assistant: 'GOPU AI',
    chooseAnswer: 'Chọn một câu trả lời:',
    otherAnswerPlaceholder: 'Hoặc viết câu trả lời khác…',
    failureNetwork: 'Chưa kết nối được Gemini. Tin nhắn của bạn vẫn được giữ lại; bạn có thể thử lại hoặc tiếp tục với lịch trình mẫu.',
    failureRoute: 'Không tìm thấy API chat trên máy chủ web đang mở. Hãy khởi động lại ứng dụng Next.js rồi thử lại.',
    failureServer: 'Không kết nối được tới máy chủ web. Hãy kiểm tra ứng dụng Next.js đang chạy rồi thử lại.',
    failureBusy: 'Gemini đang bận hoặc đã chạm giới hạn tạm thời. Tin nhắn vẫn được giữ lại; hãy thử lại sau ít phút.',
    failureTimeout: 'Gemini phản hồi quá lâu. Tin nhắn vẫn được giữ lại; hãy thử lại hoặc chỉnh câu hỏi ngắn hơn.',
    failureFormat: 'GOPU AI chưa tạo được kế hoạch phù hợp. Tin nhắn vẫn được giữ lại; hãy thử diễn đạt lại hoặc dùng lịch trình mẫu.',
    failureKey: 'Chưa cấu hình được Gemini API key trên máy chủ local.',
    failureAuth: 'Gemini API key không hợp lệ hoặc chưa có quyền truy cập. Hãy tạo khóa Gemini trong Google AI Studio và cập nhật GEMINI_API_KEY trên máy chủ.',
    failureProvider: 'Gemini từ chối yêu cầu. Hãy kiểm tra tên model và quyền sử dụng API key trong cấu hình local.',
    failureRate: 'Bạn đang gửi hơi nhanh. Hãy chờ một chút rồi thử lại.',
    widgetTitle: 'GOPU Smart Concierge',
    widgetSubtitle: 'Trợ lý du lịch kết nối Gemini AI',
    widgetReset: 'Bắt đầu lại hội thoại',
    widgetExpand: 'Mở toàn màn hình AI Planner',
    widgetClose: 'Đóng chat',
    widgetOpen: 'Mở chat với GOPU AI',
    widgetPlaceholder: 'Nhắn tin trò chuyện hoặc bảo AI lên lịch trình…',
    widgetLoading: 'GOPU AI đang phân tích dữ liệu & lên lịch…',
    widgetWelcome:
      '👋 Chào bạn! Mình là GOPU AI. Bạn có thắc mắc gì về Phú Quốc không (thời tiết, món ăn ngon, điểm check-in…)? Cứ trò chuyện tự nhiên với mình nhé, khi nào bạn bảo lên lịch trình thì mình mới tạo kế hoạch chi tiết.',
    widgetQuickLabel: 'Gợi ý câu hỏi nhanh:',
    widgetQuick: [
      'Thời tiết Phú Quốc mùa này thế nào?',
      'Quán hải sản nào ngon ở Dương Đông?',
      'Lên lịch trình 3N2Đ cho gia đình 4 người',
    ],
    widgetError: 'Chưa kết nối được GOPU AI. Tin nhắn của bạn vẫn ở đây để thử lại.',
    planReadyTitle: 'Kế hoạch chi tiết đã sẵn sàng!',
    planReadyBody: 'Xem timeline chi tiết từng giờ, bản đồ vệ tinh & bảng dự toán ngân sách minh bạch.',
    planReadyCta: 'Xem toàn bộ lịch trình trên GOPU AI',
  },
  en: {
    headerStatus: 'Phu Quoc • Available',
    headerAccount: 'Account',
    headerCloseMenu: 'Close',
    toastClose: 'Close notification',
    heading: 'GOPU AI · Phu Quoc',
    intro: 'Share your trip length, group size, total budget, and interests. I’ll ask follow-up questions if needed.',
    placeholder: 'For example: 3 days, 5 people, 20 million VND…',
    send: 'Send',
    loading: 'Preparing suggestions…',
    privacy:
      'When you start, your chat will be sent to Gemini to create suggestions. Do not include account, payment, or personal information.',
    fallback: 'Create sample itinerary',
    retry: 'Try again',
    demo: 'Suggestions use illustrative data; prices are unverified and availability is not shown.',
    you: 'You',
    assistant: 'GOPU AI',
    chooseAnswer: 'Choose an answer:',
    otherAnswerPlaceholder: 'Or write a different answer…',
    failureNetwork: 'Gemini could not be reached. Your message is still here; retry or continue with a sample itinerary.',
    failureRoute: 'The chat API was not found on this web server. Restart the Next.js app and try again.',
    failureServer: 'The web server could not be reached. Check that the Next.js app is running and try again.',
    failureBusy: 'Gemini is busy or temporarily rate limited. Your message is still here; try again in a moment.',
    failureTimeout: 'Gemini took too long to respond. Your message is still here; retry or shorten the request.',
    failureFormat: 'GOPU AI could not shape that into a plan. Your message is still here; rephrase or use the sample planner.',
    failureKey: 'The Gemini API key is not configured on the local server.',
    failureAuth: 'The Gemini API key is invalid or lacks access. Create a Gemini key in Google AI Studio and update GEMINI_API_KEY on the server.',
    failureProvider: 'Gemini rejected the request. Check the configured model and API key access on the local server.',
    failureRate: 'You are sending requests too quickly. Wait a moment and retry.',
    widgetTitle: 'GOPU Smart Concierge',
    widgetSubtitle: 'Travel assistant powered by Gemini AI',
    widgetReset: 'Start the conversation over',
    widgetExpand: 'Open the full AI Planner',
    widgetClose: 'Close chat',
    widgetOpen: 'Chat with GOPU AI',
    widgetPlaceholder: 'Ask anything, or ask AI to build an itinerary…',
    widgetLoading: 'GOPU AI is reading the catalog and planning…',
    widgetWelcome:
      '👋 Hi! I’m GOPU AI. Ask me anything about Phu Quoc — weather, food, photo spots. Chat freely; I only build a detailed plan when you ask for one.',
    widgetQuickLabel: 'Quick questions:',
    widgetQuick: [
      'What is the weather like in Phu Quoc this season?',
      'Which seafood places are good in Duong Dong?',
      'Plan a 3-day trip for a family of four',
    ],
    widgetError: 'GOPU AI could not be reached. Your message is still here so you can retry.',
    planReadyTitle: 'Your detailed plan is ready!',
    planReadyBody: 'See the hour-by-hour timeline, satellite map and a transparent budget estimate.',
    planReadyCta: 'Open the full itinerary in GOPU AI',
  },
};

/** Maps a server error code to a sentence a traveller can act on. */
export function assistantErrorText(code: string, copy: AssistantCopy): string {
  switch (code) {
    case 'GEMINI_OVERLOADED':
      return copy.failureBusy;
    case 'GEMINI_TIMEOUT':
      return copy.failureTimeout;
    case 'GEMINI_INVALID_REPLY':
      return copy.failureFormat;
    case 'GEMINI_NOT_CONFIGURED':
      return copy.failureKey;
    case 'GEMINI_AUTH_ERROR':
      return copy.failureAuth;
    case 'GEMINI_PROVIDER_ERROR':
      return copy.failureProvider;
    case 'LOCAL_RATE_LIMIT':
      return copy.failureRate;
    case 'CHAT_API_NOT_FOUND':
      return copy.failureRoute;
    case 'CHAT_API_UNREACHABLE':
      return copy.failureServer;
    default:
      return copy.failureNetwork;
  }
}
