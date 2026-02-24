import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Gate Guard | Multi-Family Security Ecosystem',
  description: 'Redefining multi-family access control through edge-computing, proactive monitoring, and intelligent integration.',
  openGraph: {
    title: 'Gate Guard | Security Ecosystem',
    description: 'Predictable per-unit operating expenses for complete gate management and security.',
    url: 'https://gateguard.co',
    siteName: 'Gate Guard',
    images: [
      {
        url: '/og-image.jpg', // Create a 1200x630 branded image and put it in your public folder!
        width: 1200,
        height: 630,
        alt: 'Gate Guard Security Ecosystem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
