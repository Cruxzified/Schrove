import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Schrove - School Transport Intelligence',
  description: 'Premium AI-powered school transport operations dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
