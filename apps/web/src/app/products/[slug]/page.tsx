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

function getProductPricing(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('mamra')) {
    return {
      name: 'Kashmiri Mamra Almonds',
      skuPrefix: 'BF-ALM-MAMRA',
      v100g: { price: 52000, mrp: 65000 },
      v250g: { price: 125000, mrp: 155000 },
      v500g: { price: 245000, mrp: 300000 },
      v1kg: { price: 480000, mrp: 580000 },
    };
  }
  if (s.includes('california') && s.includes('almond')) {
    return {
      name: 'California Almonds',
      skuPrefix: 'BF-ALM-CAL',
      v100g: { price: 12500, mrp: 16000 },
      v250g: { price: 29500, mrp: 37000 },
      v500g: { price: 57000, mrp: 70000 },
      v1kg: { price: 110000, mrp: 135000 },
    };
  }
  if (s.includes('cashew') || s.includes('kaju')) {
    return {
      name: 'W320 Premium Cashews (Kaju)',
      skuPrefix: 'BF-CSH-W320',
      v100g: { price: 13500, mrp: 17000 },
      v250g: { price: 32000, mrp: 40000 },
      v500g: { price: 62000, mrp: 78000 },
      v1kg: { price: 120000, mrp: 150000 },
    };
  }
  if (s.includes('premium') && s.includes('pista')) {
    return {
      name: 'Premium Pistachios (Pista)',
      skuPrefix: 'BF-PIS-PREM',
      v100g: { price: 46000, mrp: 56000 },
      v250g: { price: 110000, mrp: 135000 },
      v500g: { price: 215000, mrp: 260000 },
      v1kg: { price: 420000, mrp: 510000 },
    };
  }
  if (s.includes('pista')) {
    return {
      name: 'Iranian Green Pistachios (Pista)',
      skuPrefix: 'BF-PIS-IRN',
      v100g: { price: 21000, mrp: 26000 },
      v250g: { price: 50000, mrp: 62000 },
      v500g: { price: 98000, mrp: 120000 },
      v1kg: { price: 190000, mrp: 235000 },
    };
  }
  if (s.includes('walnut') || s.includes('akhrot')) {
    return {
      name: 'California Walnuts (Akhrot)',
      skuPrefix: 'BF-WAL-CAL',
      v100g: { price: 14500, mrp: 18000 },
      v250g: { price: 34500, mrp: 43000 },
      v500g: { price: 67000, mrp: 83000 },
      v1kg: { price: 130000, mrp: 160000 },
    };
  }
  if (s.includes('raisin') || s.includes('kishmish')) {
    return {
      name: 'Premium Raisins (Kishmish)',
      skuPrefix: 'BF-RAI-PREM',
      v100g: { price: 8000, mrp: 10000 },
      v250g: { price: 19000, mrp: 24000 },
      v500g: { price: 36000, mrp: 45000 },
      v1kg: { price: 70000, mrp: 88000 },
    };
  }
  if (s.includes('fig') || s.includes('anjeer')) {
    return {
      name: 'Premium Figs (Anjeer)',
      skuPrefix: 'BF-FIG-ANJ',
      v100g: { price: 15500, mrp: 19500 },
      v250g: { price: 37000, mrp: 46000 },
      v500g: { price: 72000, mrp: 90000 },
      v1kg: { price: 140000, mrp: 175000 },
    };
  }
  if (s.includes('date') || s.includes('khajur') || s.includes('khajoor')) {
    return {
      name: 'Medjool Dates (Khajur Matjol)',
      skuPrefix: 'BF-DAT-MEDJ',
      v100g: { price: 15500, mrp: 19500 },
      v250g: { price: 37000, mrp: 46000 },
      v500g: { price: 72000, mrp: 90000 },
      v1kg: { price: 140000, mrp: 175000 },
    };
  }
  if (s.includes('panchmeva-prasad') || s.includes('kashmiri-heritage')) {
    return {
      name: 'Kashmiri Heritage Panchmeva Prasad Mix',
      skuPrefix: 'BF-MIX-PRASAD',
      v100g: { price: 19000, mrp: 24000 },
      v250g: { price: 45000, mrp: 57000 },
      v500g: { price: 88000, mrp: 110000 },
      v1kg: { price: 172000, mrp: 215000 },
    };
  }
  if (s.includes('roasted-salted') || s.includes('trail-mix')) {
    return {
      name: 'Khari Baoli Roasted & Salted Trail Mix',
      skuPrefix: 'BF-MIX-TRAIL',
      v100g: { price: 17500, mrp: 21500 },
      v250g: { price: 41000, mrp: 50000 },
      v500g: { price: 79000, mrp: 98000 },
      v1kg: { price: 155000, mrp: 190000 },
    };
  }
  if (s.includes('daily-energy') || s.includes('nut-fruit-mix')) {
    return {
      name: 'Daily Healthy Energy Nut & Fruit Mix',
      skuPrefix: 'BF-MIX-NRG',
      v100g: { price: 14000, mrp: 17500 },
      v250g: { price: 33000, mrp: 42000 },
      v500g: { price: 64000, mrp: 80000 },
      v1kg: { price: 125000, mrp: 155000 },
    };
  }
  if (s.includes('omega') || s.includes('seed-fusion') || s.includes('fusion-mix')) {
    return {
      name: 'Omega-3 Power Nut & Seed Fusion Mix',
      skuPrefix: 'BF-MIX-OMEGA',
      v100g: { price: 15000, mrp: 18500 },
      v250g: { price: 35000, mrp: 44000 },
      v500g: { price: 68000, mrp: 85000 },
      v1kg: { price: 132000, mrp: 165000 },
    };
  }
  if (s.includes('party-snack') || s.includes('spiced')) {
    return {
      name: 'Royal Festive Party Snack Mix (Spiced)',
      skuPrefix: 'BF-MIX-PARTY',
      v100g: { price: 16500, mrp: 22000 },
      v250g: { price: 39000, mrp: 52000 },
      v500g: { price: 76000, mrp: 102000 },
      v1kg: { price: 148000, mrp: 198000 },
    };
  }
  if (s.includes('mix') || s.includes('panchmeva')) {
    return {
      name: 'Assorted Royal Dry Fruit Mix (Panchmeva)',
      skuPrefix: 'BF-MIX-ROYAL',
      v100g: { price: 16000, mrp: 20000 },
      v250g: { price: 38000, mrp: 48000 },
      v500g: { price: 74000, mrp: 95000 },
      v1kg: { price: 145000, mrp: 185000 },
    };
  }
  return {
    name: 'Kashmiri Mamra Almonds',
    skuPrefix: 'BF-DRY-FRT',
    v100g: { price: 52000, mrp: 65000 },
    v250g: { price: 125000, mrp: 155000 },
    v500g: { price: 245000, mrp: 300000 },
    v1kg: { price: 480000, mrp: 580000 },
  };
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

    const s = slug.toLowerCase();
    const pricing = getProductPricing(slug);
    const productName = pricing.name || formattedName;

    let productImages = [
      { id: 'img-1', url: '/product-almonds.jpg', altText: productName, isPrimary: true, sortRank: 1 },
      { id: 'img-2', url: '/almonds-macro.jpg', altText: `${productName} Closeup`, isPrimary: false, sortRank: 2 },
      { id: 'img-3', url: '/almonds-split.jpg', altText: `${productName} Kernel`, isPrimary: false, sortRank: 3 },
      { id: 'img-4', url: '/almonds-roasted.jpg', altText: `${productName} Grade`, isPrimary: false, sortRank: 4 },
      { id: 'img-5', url: '/almonds-pouch.jpg', altText: `${productName} Packaging`, isPrimary: false, sortRank: 5 },
    ];
    let catSlug = 'almonds';
    let catName = 'Almonds';

    if (s.includes('cashew') || s.includes('kaju')) {
      productImages = [{ id: 'img-1', url: '/product-cashews.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'cashews';
      catName = 'Cashews (Kaju)';
    } else if (s.includes('pista') || s.includes('pistachio')) {
      productImages = [{ id: 'img-1', url: '/product-pistachios.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'pistachios';
      catName = 'Pistachios (Pista)';
    } else if (s.includes('walnut') || s.includes('akhrot')) {
      productImages = [{ id: 'img-1', url: '/product-walnuts.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'walnuts';
      catName = 'Walnuts (Akhrot)';
    } else if (s.includes('raisin') || s.includes('kishmish')) {
      productImages = [{ id: 'img-1', url: '/product-raisins.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'raisins';
      catName = 'Raisins (Kishmish)';
    } else if (s.includes('date') || s.includes('khajur') || s.includes('khajoor')) {
      productImages = [{ id: 'img-1', url: '/product-dates.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'dates';
      catName = 'Dates (Khajoor)';
    } else if (s.includes('fig') || s.includes('anjeer')) {
      productImages = [{ id: 'img-1', url: '/product-figs.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'figs';
      catName = 'Figs (Anjeer)';
    } else if (s.includes('mix')) {
      productImages = [{ id: 'img-1', url: '/product-mix.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'dry-fruit-mix';
      catName = 'Dry Fruit Mix';
    } else if (s.includes('seed')) {
      productImages = [{ id: 'img-1', url: '/product-seeds.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      catSlug = 'seeds';
      catName = 'Seeds';
    } else if (s.includes('gift') || s.includes('hamper') || s.includes('box') || s.includes('festive') || s.includes('uphaar') || s.includes('potli') || s.includes('basket')) {
      if (s.includes('brass') || s.includes('platter')) {
        productImages = [{ id: 'img-1', url: '/hamper-brass-tray.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      } else if (s.includes('potli')) {
        productImages = [{ id: 'img-1', url: '/hamper-brocade-potlis.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      } else if (s.includes('basket')) {
        productImages = [{ id: 'img-1', url: '/hamper-grand-basket.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      } else if (s.includes('emerald') || s.includes('corporate') || s.includes('utsav')) {
        productImages = [{ id: 'img-1', url: '/hamper-corporate-box.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      } else if (s.includes('royaal') || s.includes('velvet') || s.includes('saffron')) {
        productImages = [{ id: 'img-1', url: '/banner-festive.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      } else {
        productImages = [{ id: 'img-1', url: '/product-gift-hamper.jpg', altText: productName, isPrimary: true, sortRank: 1 }];
      }
      catSlug = 'gift-boxes';
      catName = 'Gift Hampers';
    }

    product = {
      id: `prod-${slug}`,
      slug,
      name: productName,
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
          sku: `${pricing.skuPrefix}-100G`,
          label: '100g',
          weightGrams: 100,
          pricePaise: pricing.v100g.price,
          mrpPaise: pricing.v100g.mrp,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 1,
        },
        {
          id: 'v-250g',
          sku: `${pricing.skuPrefix}-250G`,
          label: '250g',
          weightGrams: 250,
          pricePaise: pricing.v250g.price,
          mrpPaise: pricing.v250g.mrp,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 2,
        },
        {
          id: 'v-500g',
          sku: `${pricing.skuPrefix}-500G`,
          label: '500g',
          weightGrams: 500,
          pricePaise: pricing.v500g.price,
          mrpPaise: pricing.v500g.mrp,
          isActive: true,
          qtyStep: 1,
          isDefault: false,
          sortRank: 3,
        },
        {
          id: 'v-1kg',
          sku: `${pricing.skuPrefix}-1KG`,
          label: '1kg',
          weightGrams: 1000,
          pricePaise: pricing.v1kg.price,
          mrpPaise: pricing.v1kg.mrp,
          isActive: true,
          qtyStep: 1,
          isDefault: true,
          sortRank: 4,
        },
      ],
      images: productImages,
      categories: [
        {
          id: `cat-${catSlug}`,
          slug: catSlug,
          name: catName,
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
