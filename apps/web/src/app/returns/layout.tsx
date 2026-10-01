import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Bansal Foods',
  description:
    '7-day hassle-free return policy for all retail orders. Learn about eligibility, the return process, and refund timelines for Bansal Foods dry fruit purchases.',
};

export default function ReturnsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
