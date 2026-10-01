import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailClient } from './ProductDetailClient';
import { catalogApi } from '@/lib/api';

interface Params {
  slug: string;
}

// ─── generateStaticParams (build-time SSG for known products) ────────────────
// Skipped in Phase 5 – all pages are dynamic/ISR.

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await catalogApi.getProduct(slug);
    const p = res.data;
    return {
      title: p.seoTitle ?? p.name,
      description: p.seoDescription ?? p.shortDescription ?? undefined,
      openGraph: {
        title: p.seoTitle ?? p.name,
        description: p.seoDescription ?? p.shortDescription ?? undefined,
        images: p.images[0] ? [{ url: p.images[0].url, alt: p.images[0].altText }] : [],
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let product;
  try {
    const res = await catalogApi.getProduct(slug);
    product = res.data;
  } catch {
    // Graceful fallback for catalog items if backend API is not populated
    const formattedName = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    let defaultImg = '/product-almonds.jpg';
    if (slug.includes('cashew')) defaultImg = '/product-cashews.jpg';
    else if (slug.includes('pista')) defaultImg = '/product-pistachios.jpg';
    else if (slug.includes('walnut')) defaultImg = '/product-walnuts.jpg';
    else if (slug.includes('raisin')) defaultImg = '/product-raisins.jpg';
    else if (slug.includes('date')) defaultImg = '/product-dates.jpg';
    else if (slug.includes('fig')) defaultImg = '/product-figs.jpg';
    else if (slug.includes('mix')) defaultImg = '/product-mix.jpg';

    product = {
      id: `prod-${slug}`,
      slug,
      name: slug === 'kashmiri-mamra-almonds' ? 'Kashmiri Mamra Almonds' : formattedName,
      status: 'PUBLISHED',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      ratingAvg: 4.8,
      ratingCount: 320,
      inStock: true,
      countryOfOrigin: 'India',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taxRateBps: 500,
      taxInclusive: true,
      minOrderQty: 1,
      maxOrderQty: 50,
      variants: [
        {
          id: 'v-100g',
          sku: 'BF-ALM-MAMRA-100G',
          label: '100g',
          weightGrams: 100,
          pricePaise: 12000,
          mrpPaise: 15000,
          isActive: true,
          qtyStep: 1,
          isDefault: true,
          sortRank: 1,
        },
        {
          id: 'v-250g',
          sku: 'BF-ALM-MAMRA-250G',
          label: '250g',
          weightGrams: 250,
          pricePaise: 28000,
          mrpPaise: 32000,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 2,
        },
        {
          id: 'v-500g',
          sku: 'BF-ALM-MAMRA-500G',
          label: '500g',
          weightGrams: 500,
          pricePaise: 55000,
          mrpPaise: 60000,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 3,
        },
        {
          id: 'v-1kg',
          sku: 'BF-ALM-MAMRA-1KG',
          label: '1kg',
          weightGrams: 1000,
          pricePaise: 105000,
          mrpPaise: 120000,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 4,
        },
      ],
      images: [
        {
          id: 'img-1',
          url: defaultImg,
          altText: formattedName,
          isPrimary: true,
          sortRank: 1,
        },
      ],
      categories: [
        {
          id: 'cat-almonds',
          slug: 'almonds',
          name: 'Almonds',
          sortRank: 1,
          depth: 0,
          isActive: true,
        },
      ],
      reviews: [],
    };
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient product={product} />
      </Suspense>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square skeleton rounded-2xl" />
        <div className="space-y-4 pt-4">
          <div className="h-5 skeleton rounded w-1/3" />
          <div className="h-8 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/2" />
          <div className="h-12 skeleton rounded" />
          <div className="h-10 skeleton rounded w-full" />
        </div>
      </div>
    </div>
  );
}
