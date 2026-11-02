import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import ExtensionCleaner from '../components/ui/ExtensionCleaner';
import ToastProvider from '../components/ui/Toast';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gopu.vn'),
  title: {
    default: 'GOPU — Go Phu Quoc, Go Paradise!',
    template: '%s · GOPU',
  },
  description: 'GOPU bắt đầu từ Phú Quốc, hướng đến những thiên đường du lịch khác trong tương lai.',
  applicationName: 'GOPU',
  openGraph: {
    type: 'website',
    siteName: 'GOPU',
    locale: 'vi_VN',
    alternateLocale: ['en_US'],
    title: 'GOPU — Go Phu Quoc, Go Paradise!',
    description: 'Khám phá, đặt và nhận hỗ trợ cho dịch vụ tại Phú Quốc trên một nền tảng duy nhất.',
    images: [{ url: '/brand/gopu-logo.png', alt: 'GOPU' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#087f78',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <html lang="vi" className={beVietnamPro.variable} suppressHydrationWarning={isDev}>
      <body suppressHydrationWarning={isDev}>
        <ToastProvider>{children}</ToastProvider>
        {/* Browser extensions inject attributes that break hydration in dev only. */}
        {isDev && <ExtensionCleaner />}
      </body>
    </html>
  );
}
