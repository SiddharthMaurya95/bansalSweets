import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bansal Foods Admin Portal',
  description: 'Operations, inventory, and order management dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

import { AdminShell } from '@/components/AdminShell';

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
