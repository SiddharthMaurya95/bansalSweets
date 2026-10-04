import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: {
    default: 'Bansal Foods | Premium Dry Fruits – Khari Baoli, Delhi',
    template: '%s | Bansal Foods',
  },
  description:
    'Buy premium Kashmiri almonds, W240 cashews, Afghan pistachios, walnuts, raisins, dates and festive gift hampers directly from Khari Baoli, Old Delhi. Fast delivery across India.',
  metadataBase: new URL('https://bansalfoods.in'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    siteName: 'Bansal Foods',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
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
      </body>
    </html>
  );
}
