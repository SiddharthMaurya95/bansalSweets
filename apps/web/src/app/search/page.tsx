'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useCatalog';
import { SearchIcon } from '@/components/ThemeIcons';

const QUICK_TAGS = [
  'Kashmiri Mamra',
  'W240 Cashews',
  'Pistachios',
  'Walnuts',
  'Anjeer',
  'Medjool Dates',
  'Gift Hamper',
  'Afghani Kishmish',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') ?? '';

  const [inputVal, setInputVal] = useState(q);
  const [sort, setSort] = useState<'bestseller' | 'price_asc' | 'price_desc' | 'rating'>(
    'bestseller',
  );

  const { products, loading, pagination } = useProducts({
    search: q,
    sort,
    limit: 20,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setInputVal(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Search Header Bar */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A6B] tracking-tight mb-2">
          Search Bansal Foods Direct Mandi
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Search our catalog of handpicked Kashmiri almonds, roasted cashews, Afghan dry fruits, and
          gift boxes
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="search"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search dry fruits, origins, pack sizes (e.g. W240, Mamra, 1kg)..."
            className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base rounded-2xl border-2 border-[#0B2A6B]/20 focus:border-[#0B2A6B] focus:ring-4 focus:ring-[#0B2A6B]/10 outline-none shadow-sm transition-all bg-white"
          />
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0B2A6B] text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#1E4BA8] transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
          <span className="text-xs text-gray-400 font-medium">Popular:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="text-xs bg-white border border-gray-200 hover:border-[#0B2A6B] hover:text-[#0B2A6B] text-gray-600 px-3 py-1 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Toolbar */}
      {q && (
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200 flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1B1F2A]">
              Results for &ldquo;<span className="text-[#0B2A6B]">{q}</span>&rdquo;
            </h2>
            <p className="text-xs text-gray-500">
              {loading
                ? 'Searching catalog...'
                : `Found ${pagination?.total ?? products.length} matching products`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-1.5 bg-white font-medium text-gray-700 outline-none focus:border-[#0B2A6B]"
            >
              <option value="bestseller">Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Product Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="aspect-square skeleton rounded-2xl bg-white border border-gray-100"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                subtitle: product.shortDescription ?? '',
                imageUrl: product.primaryImage?.url ?? '/product-almonds.jpg',
                variantLabel: product.defaultVariant?.label ?? '500g',
                pricePaise: product.defaultVariant?.pricePaise ?? product.minPricePaise ?? 0,
                mrpPaise: product.defaultVariant?.mrpPaise,
                weightGrams: product.defaultVariant?.weightGrams ?? 500,
                badge: product.isBestseller
                  ? 'Bestseller'
                  : product.isNewArrival
                    ? 'New'
                    : undefined,
                badgeColor: product.isBestseller ? 'gold' : 'green',
                rating: product.ratingAvg,
                reviewCount: product.ratingCount,
                origin: product.countryOfOrigin ?? undefined,
                inStock: product.inStock,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#C88C3C] mb-4">
            <SearchIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1B1F2A]">
            No products found matching &ldquo;{q}&rdquo;
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
            We couldn&apos;t find an exact match for your search. Try checking the spelling or
            browse our full dry fruit catalog.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-[#0B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#1E4BA8] transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              href="/wholesale"
              className="px-5 py-2.5 bg-[#FFF9EE] text-[#0B2A6B] border border-[#F2D27A] text-xs font-bold rounded-xl hover:bg-[#F2D27A]/30 transition-colors"
            >
              Wholesale Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="h-14 skeleton rounded-2xl max-w-xl mx-auto mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-square skeleton rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
