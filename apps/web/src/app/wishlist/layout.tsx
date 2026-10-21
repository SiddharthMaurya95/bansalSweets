import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'My Wishlist | Bansal Foods',
  description:
    'Save and review your favorite dry fruits, nuts, and gift hampers. Easy one-click ordering whenever you are ready.',
  alternates: {
    canonical: 'https://bansalfoods.in/wishlist',
  },
  openGraph: {
    title: 'My Wishlist | Bansal Foods',
    description: 'Your saved favorite dry fruits from Khari Baoli, Delhi.',
    url: 'https://bansalfoods.in/wishlist',
  },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Wishlist', item: '/wishlist' },
        ]}
      />
      {children}
    </>
  );
}
