import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="sk">
      <body className="antialiased font-sans bg-[#060a16]">
        {children}
      </body>
    </html>
  );
}
