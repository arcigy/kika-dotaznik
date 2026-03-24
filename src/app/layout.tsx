import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-syne' });

export const metadata: Metadata = {
  title: 'AI & MSP Prieskum 2025 | Arcigy',
  description: 'Anonymný akademický prieskum o vplyve umelej inteligencie na slovenské firmy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className={`${inter.variable} ${syne.variable}`}>
      <body className="antialiased font-sans bg-[#060a16]">
        {children}
      </body>
    </html>
  );
}
