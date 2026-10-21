import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sign In / Register | Bansal Foods',
  description: 'Log into your Bansal Foods account or create a new account.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
