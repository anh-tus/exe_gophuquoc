import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'GOPU — Go Phu Quoc, Go Paradise!',
  description: 'GOPU bắt đầu từ Phú Quốc, hướng đến những thiên đường du lịch khác trong tương lai.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className={beVietnamPro.variable}><body>{children}</body></html>;
}
