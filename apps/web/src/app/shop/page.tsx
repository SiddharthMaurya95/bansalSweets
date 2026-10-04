import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop Dry Fruits & Nuts | Bansal Foods – Khari Baoli, Old Delhi',
  description:
    'Browse our full range of authentic dry fruits from Old Delhi historic mandi: Mamra almonds, W320 cashews, Iranian pistachios, California walnuts, raisins, dates, figs, seeds and festive gift hampers.',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient />
      </Suspense>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="w-full h-48 rounded-2xl bg-gray-200 animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
            <div className="aspect-square bg-gray-100 rounded-xl animate-pulse mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-3 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
