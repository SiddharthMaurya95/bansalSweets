import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BreadcrumbsJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Return & Refund Policy – 7-Day Guarantee | Bansal Foods',
  description:
    '7-day replacement and refund policy for all retail orders. Simple doorstep return pickup, prompt quality verification, and quick UPI/bank refunds.',
  alternates: {
    canonical: 'https://bansalfoods.in/returns',
  },
  openGraph: {
    title: 'Return & Refund Policy | Bansal Foods',
    description:
      'Learn about Bansal Foods 7-day hassle-free return policy, damaged parcel reporting, and refund timelines.',
    url: 'https://bansalfoods.in/returns',
    images: ['/return-damaged-box.jpg'],
  },
};

const RETURN_FAQS = [
  {
    question: 'What is the return window for dry fruits?',
    answer:
      'We offer a 7-day return and replacement window from the date of parcel delivery if you receive a defective, damaged, or incorrect item.',
  },
  {
    question: 'How do I raise a return request?',
    answer:
      'Simply WhatsApp our customer support team at +91-9313321535 or email shashwatbansal2610@gmail.com with your order number and photo/video of the parcel.',
  },
  {
    question: 'How long do refunds take?',
    answer:
      'Refunds are processed within 24-48 business hours after inspection, credited directly to your original payment method, UPI ID, or bank account.',
  },
];

export default function ReturnsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Return & Refund Policy', item: '/returns' },
        ]}
      />
      <FaqJsonLd faqs={RETURN_FAQS} />
      {children}
    </>
  );
}

