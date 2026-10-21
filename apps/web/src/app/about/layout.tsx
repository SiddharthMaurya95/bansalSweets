import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Us – Khari Baoli Heritage & Story | Bansal Foods',
  description:
    'Discover the story of Bansal Foods: our multi-generational roots in historic Khari Baoli Mandi, Asia’s largest dry fruits market, and our commitment to pure, authentic dry fruits.',
  alternates: {
    canonical: 'https://bansalfoods.in/about',
  },
  openGraph: {
    title: 'About Us – Khari Baoli Heritage & Story | Bansal Foods',
    description:
      'Learn about Bansal Foods, authentic dry fruits merchants in Khari Baoli, Old Delhi since generations.',
    url: 'https://bansalfoods.in/about',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us – Khari Baoli Heritage & Story | Bansal Foods',
    description:
      'Generations of trust at Khari Baoli Mandi, Old Delhi. Authentic Kashmiri dry fruits & wholesale merchant.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about' },
        ]}
      />
      {children}
    </>
  );
}
