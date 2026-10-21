import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Track Your Order | Bansal Foods',
  description:
    'Track your Bansal Foods dry fruits order in real-time. View live shipping status, courier partner, tracking number and estimated delivery date.',
  alternates: {
    canonical: 'https://bansalfoods.in/orders/track',
  },
  openGraph: {
    title: 'Track Your Order | Bansal Foods',
    description:
      'Real-time shipment and parcel tracking for Bansal Foods dry fruits orders.',
    url: 'https://bansalfoods.in/orders/track',
  },
};

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Track Order', item: '/orders/track' },
        ]}
      />
      {children}
    </>
  );
}
