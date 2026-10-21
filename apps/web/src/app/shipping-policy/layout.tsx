import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Shipping Policy & Delivery Timelines | Bansal Foods',
  description:
    'Learn about Bansal Foods shipping policy, packaging standards, pan-India delivery schedules (2-5 business days), express options, and dispatch procedures.',
  alternates: {
    canonical: 'https://bansalfoods.in/shipping-policy',
  },
  openGraph: {
    title: 'Shipping Policy | Bansal Foods Khari Baoli Delhi',
    description:
      'Safe vacuum-sealed multi-layered packaging and pan-India express courier delivery for premium dry fruits.',
    url: 'https://bansalfoods.in/shipping-policy',
    images: ['/shipping-parcel-box.jpg'],
  },
};

const SHIPPING_FAQS = [
  {
    question: 'How long does delivery take across India?',
    answer:
      'Orders are typically dispatched within 24 hours from our Khari Baoli hub. Deliveries in Delhi NCR arrive within 24-48 hours, metro cities take 2-4 business days, and rest of India takes 3-6 business days.',
  },
  {
    question: 'How are dry fruits packaged for transit?',
    answer:
      'All dry fruits are vacuum-packed or nitrogen-flushed in food-grade, moisture-barrier pouches with tamper-evident sealing to preserve crunch, aroma, and freshness.',
  },
  {
    question: 'Can I track my order in real-time?',
    answer:
      'Yes, once your order is dispatched, you will receive an SMS and WhatsApp update with your tracking ID and courier link. You can also track your order on our Track Order page.',
  },
  {
    question: 'Is free shipping available?',
    answer:
      'Free standard shipping is applicable on retail prepaid orders above ₹999 across India.',
  },
];

export default function ShippingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Shipping Policy', item: '/shipping-policy' },
        ]}
      />
      <FaqJsonLd faqs={SHIPPING_FAQS} />
      {children}
    </>
  );
}
