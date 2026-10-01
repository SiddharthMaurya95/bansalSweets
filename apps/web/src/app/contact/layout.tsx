import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us | Bansal Foods – Fatehpuri, Delhi',
  description:
    'Get in touch with Bansal Foods. Call, email, WhatsApp or visit our store in Fatehpuri, Chandni Chowk, Delhi. We respond within 24 hours.',
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
