import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Phú Quốc Local Companion',
  description: 'Starter codebase for the Phu Quoc local travel companion project.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
