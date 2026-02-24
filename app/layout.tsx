import type { Metadata } from 'next';
import './globals.css';

// 1. Your SEO and Tab Title Data (Including Open Graph for Social Sharing!)
export const metadata: Metadata = {
  title: 'Gate Guard | Security Ecosystem',
  description: 'Redefining multi-family access control through edge-computing, proactive monitoring, and intelligent integration.',
  openGraph: {
    title: 'Gate Guard | Security Ecosystem',
    description: 'Predictable per-unit operating expenses for complete gate management and security.',
    url: 'https://gateguard.co',
    siteName: 'Gate Guard',
    images: [
      {
        url: '/hero-bg.jpg', // Feel free to change this to a specific sharing image later!
        width: 1200,
        height: 630,
        alt: 'Gate Guard Security Ecosystem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// 2. The Regional SEO Schema (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SecurityService",
  "name": "Gate Guard Security Ecosystem",
  "url": "https://gateguard.co",
  "logo": "https://gateguard.co/logo.png",
  "image": "https://gateguard.co/hero-bg.jpg",
  "description": "Proactive multi-family access control, commercial gate repair, virtual concierge, and security monitoring for apartments and HOAs.",
  "telephone": "+1-404-842-5072",
  "priceRange": "$$",
  "areaServed": [
    { "@type": "City", "name": "Atlanta" },
    { "@type": "City", "name": "Chattanooga" },
    { "@type": "State", "name": "Georgia" },
    { "@type": "State", "name": "Tennessee" }
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 33.9304, // Sandy Springs / North Atlanta HQ
      "longitude": -84.3733
    },
    "geoRadius": "643737" // 400 miles in meters
  },
  "knowsAbout": [
    "Commercial Gate Repair",
    "Apartment Gate Repair",
    "Multi-Family Gate Automation",
    "Brivo Access Control Integration",
    "Eagle Eye Networks Surveillance",
    "Virtual Concierge Services",
    "HOA Security Systems"
  ],
  "keywords": "commercial gate repair Atlanta, commercial gate repair Chattanooga, apartment gate repair, multi-family access control, Brivo installation, gate maintenance HOA, broken gate repair"
};

// 3. The Required Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white">
        {/* Injecting the Schema invisibly into the page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
