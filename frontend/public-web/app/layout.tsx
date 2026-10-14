import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GOPU — Go Phu Quoc, Go Paradise!',
  description: 'GOPU bắt đầu từ Phú Quốc, hướng đến những thiên đường du lịch khác trong tương lai.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
