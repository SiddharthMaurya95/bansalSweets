import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopClient } from '@/app/shop/ShopClient';

import { BreadcrumbsJsonLd } from '@/components/JsonLd';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedCategory = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Dry Fruits';

  const title = `${formattedCategory} – Premium Khari Baoli Selection | Bansal Foods`;
  const description = `Buy authentic ${formattedCategory} directly from Old Delhi Khari Baoli Mandi. 100% pure quality, wholesale & retail rates, fast pan-India delivery.`;
  const canonicalUrl = `https://bansalfoods.in/category/${slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedCategory = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Dry Fruits';

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Shop', item: '/shop' },
          { name: formattedCategory, item: `/category/${slug}` },
        ]}
      />
      <Suspense fallback={<CategorySkeleton />}>
        <ShopClient />
      </Suspense>
    </div>
  );
}

function CategorySkeleton() {
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
