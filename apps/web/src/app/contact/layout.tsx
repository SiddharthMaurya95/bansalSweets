import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { BreadcrumbsJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us – Store Address, Phone & Directions | Bansal Foods',
  description:
    'Get in touch with Bansal Foods. Call +91-9313321535, WhatsApp, email or visit our store at Khari Baoli, Chandni Chowk, Old Delhi 110006.',
  alternates: {
    canonical: 'https://bansalfoods.in/contact',
  },
  openGraph: {
    title: 'Contact Us | Bansal Foods – Khari Baoli, Delhi',
    description:
      'Visit our Khari Baoli store or reach out via phone, WhatsApp and email for retail and bulk dry fruits inquiries.',
    url: 'https://bansalfoods.in/contact',
    images: ['/og-image.jpg'],
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Contact Us', item: '/contact' },
        ]}
      />
      {children}
    </>
  );
}
