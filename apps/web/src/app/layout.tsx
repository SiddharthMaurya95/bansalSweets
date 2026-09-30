import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bansal Foods | Dry Fruits Shop in Fatehpuri, Delhi – Buy Online',
  description:
    'Finest quality almonds, cashews, pistachios, walnuts, raisins, dates and festival gift packs from Fatehpuri, Delhi 110006. Fast delivery across Delhi-NCR and India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
