import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Analytics } from '@vercel/analytics/next';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://bansalfoods.in'),
  title: {
    default: 'Bansal Foods | Premium Dry Fruits & Nuts – Khari Baoli, Delhi',
    template: '%s | Bansal Foods',
  },
  description:
    'Buy authentic dry fruits, Kashmiri Mamra almonds, W320 cashews, Afghan pistachios, walnuts, raisins, dates and festive gift hampers directly from historic Khari Baoli, Old Delhi. Wholesale and retail rates with fast pan-India delivery.',
  keywords: [
    'dry fruits',
    'Khari Baoli dry fruits',
    'buy almonds online',
    'Kashmiri Mamra almonds',
    'W320 cashews',
    'Afghan pistachios',
    'dry fruit wholesale Delhi',
    'dry fruit gift hampers',
    'Bansal Foods',
  ],
  alternates: {
    canonical: 'https://bansalfoods.in',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Bansal Foods | Premium Dry Fruits & Nuts – Khari Baoli, Delhi',
    description:
      'Buy authentic dry fruits directly from Old Delhi Khari Baoli Mandi. 100% pure Kashmiri almonds, jumbo cashews, Afghan pistachios, and festive gift boxes with fast pan-India delivery.',
    url: 'https://bansalfoods.in',
    siteName: 'Bansal Foods',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bansal Foods - Premium Dry Fruits Khari Baoli Delhi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bansal Foods | Premium Dry Fruits & Nuts – Khari Baoli, Delhi',
    description:
      'Buy authentic dry fruits directly from historic Khari Baoli, Old Delhi. Fast pan-India delivery.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'GSC-BANSAL-FOODS-VERIFICATION',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#FAFAF8]">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
