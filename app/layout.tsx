import type { Metadata } from 'next';
import './globals.css'; // This imports your Tailwind CSS!

// 1. Your SEO and Tab Title Data
export const metadata: Metadata = {
  title: 'Gate Guard | Security Ecosystem',
  description: 'Redefining multi-family access control through edge-computing, proactive monitoring, and intelligent integration.',
};

// 2. The Required Layout Component (This was the missing piece!)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
