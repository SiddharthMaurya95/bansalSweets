import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Dry Fruits Wholesale & Bulk Supply – Khari Baoli Mandi | Bansal Foods',
  description:
    'Direct Mandi wholesale prices for bulk dry fruits: Mamra almonds, W240/W320 cashews, pistachios, walnuts, raisins & festive corporate gifting. GST invoices & Pan-India logistics.',
  alternates: {
    canonical: 'https://bansalfoods.in/wholesale',
  },
  openGraph: {
    title: 'Dry Fruits Wholesale & Bulk Supply | Bansal Foods Khari Baoli',
    description:
      'Direct Mandi rates for caterers, sweet shops, bakeries, corporate gifting and retail distributors across India.',
    url: 'https://bansalfoods.in/wholesale',
    images: ['/banner-wholesale.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dry Fruits Wholesale & Bulk Supply | Bansal Foods Khari Baoli',
    description:
      'Direct Mandi rates for caterers, sweet shops, bakeries and corporate gifting across India.',
    images: ['/banner-wholesale.jpg'],
  },
};

export default function WholesaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Wholesale & Bulk Inquiries', item: '/wholesale' },
        ]}
      />
      {children}
    </>
  );
}
