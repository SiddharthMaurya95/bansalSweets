import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Search Dry Fruits & Nuts | Bansal Foods',
  description:
    'Search premium Kashmiri almonds, cashews, pistachios, walnuts, dates and seeds from Khari Baoli, Delhi.',
  alternates: {
    canonical: 'https://bansalfoods.in/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
