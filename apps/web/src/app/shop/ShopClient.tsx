'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  WheatHarvestIcon,
  MandiArchIcon,
  VarietyBoxesIcon,
  DeliveryTruckIcon,
  ShoppingCartIcon,
  StarIcon,
  HeartIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/ThemeIcons';

// ─── Data Definitions ─────────────────────────────────────────────────────────

export interface WeightVariant {
  weight: string;
  price: number;
  mrp: number;
}

export interface ListingProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  discountBadge: string;
  inStock: boolean;
  popularityRank: number;
  variants: WeightVariant[];
  defaultVariantIndex: number;
}

const CATEGORY_ITEMS = [
  { name: 'All Dry Fruits', slug: 'all', count: 68, image: '/product-mix.jpg' },
  { name: 'Almonds', slug: 'almonds', count: 12, image: '/product-almonds.jpg' },
  { name: 'Cashews', slug: 'cashews', count: 10, image: '/product-cashews.jpg' },
  { name: 'Pistachios', slug: 'pistachios', count: 8, image: '/product-pistachios.jpg' },
  { name: 'Walnuts', slug: 'walnuts', count: 6, image: '/product-walnuts.jpg' },
  { name: 'Raisins', slug: 'raisins', count: 8, image: '/product-raisins.jpg' },
  { name: 'Dates', slug: 'dates', count: 7, image: '/product-dates.jpg' },
  { name: 'Figs', slug: 'figs', count: 5, image: '/product-figs.jpg' },
  { name: 'Dry Fruit Mix', slug: 'dry-fruit-mix', count: 6, image: '/product-mix.jpg' },
  { name: 'Seeds', slug: 'seeds', count: 6, image: '/product-seeds.jpg' },
];

const WEIGHT_OPTIONS = [
  { label: '100g', count: 24 },
  { label: '250g', count: 38 },
  { label: '500g', count: 52 },
  { label: '1kg', count: 40 },
];

const DISCOUNT_OPTIONS = [
  { label: '10% & above', min: 10, count: 52 },
  { label: '20% & above', min: 20, count: 28 },
  { label: '30% & above', min: 30, count: 12 },
];

const RATING_OPTIONS = [
  { stars: 4, label: '4★ & above', count: 60 },
  { stars: 3, label: '3★ & above', count: 64 },
  { stars: 2, label: '2★ & above', count: 68 },
];

export const PRODUCTS_CATALOG: ListingProduct[] = [
  {
    id: 'p-001',
    slug: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.8,
    reviewCount: 320,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 1,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 520, mrp: 650 },
      { weight: '250g', price: 1250, mrp: 1550 },
      { weight: '500g', price: 2450, mrp: 3000 },
      { weight: '1kg', price: 4800, mrp: 5800 },
    ],
  },
  {
    id: 'p-002',
    slug: 'w320-premium-cashews',
    name: 'W320 Premium Cashews (Kaju)',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.7,
    reviewCount: 280,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 2,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 135, mrp: 170 },
      { weight: '250g', price: 320, mrp: 400 },
      { weight: '500g', price: 620, mrp: 780 },
      { weight: '1kg', price: 1200, mrp: 1500 },
    ],
  },
  {
    id: 'p-003',
    slug: 'iranian-green-pistachios',
    name: 'Iranian Green Pistachios (Pista)',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.8,
    reviewCount: 210,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 3,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 210, mrp: 260 },
      { weight: '250g', price: 500, mrp: 620 },
      { weight: '500g', price: 980, mrp: 1200 },
      { weight: '1kg', price: 1900, mrp: 2350 },
    ],
  },
  {
    id: 'p-004',
    slug: 'california-walnuts',
    name: 'California Walnuts (Akhrot)',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.8,
    reviewCount: 150,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 4,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 145, mrp: 180 },
      { weight: '250g', price: 345, mrp: 430 },
      { weight: '500g', price: 670, mrp: 830 },
      { weight: '1kg', price: 1300, mrp: 1600 },
    ],
  },
  {
    id: 'p-005',
    slug: 'premium-raisins-kishmish',
    name: 'Premium Raisins (Kishmish)',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.5,
    reviewCount: 180,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 5,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 80, mrp: 100 },
      { weight: '250g', price: 190, mrp: 240 },
      { weight: '500g', price: 360, mrp: 450 },
      { weight: '1kg', price: 700, mrp: 880 },
    ],
  },
  {
    id: 'p-006',
    slug: 'medjool-dates-khajur',
    name: 'Medjool Dates (Khajur Matjol)',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.7,
    reviewCount: 120,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 6,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 155, mrp: 195 },
      { weight: '250g', price: 370, mrp: 460 },
      { weight: '500g', price: 720, mrp: 900 },
      { weight: '1kg', price: 1400, mrp: 1750 },
    ],
  },
  {
    id: 'p-007',
    slug: 'premium-figs-anjeer',
    name: 'Premium Figs (Anjeer)',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.6,
    reviewCount: 140,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 7,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 155, mrp: 195 },
      { weight: '250g', price: 370, mrp: 460 },
      { weight: '500g', price: 720, mrp: 900 },
      { weight: '1kg', price: 1400, mrp: 1750 },
    ],
  },
  {
    id: 'p-008',
    slug: 'california-almonds',
    name: 'California Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.7,
    reviewCount: 260,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 8,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 125, mrp: 160 },
      { weight: '250g', price: 295, mrp: 370 },
      { weight: '500g', price: 570, mrp: 700 },
      { weight: '1kg', price: 1100, mrp: 1350 },
    ],
  },
  {
    id: 'p-009',
    slug: 'premium-pistachios',
    name: 'Premium Pistachios (Pista)',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.9,
    reviewCount: 190,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 9,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 460, mrp: 560 },
      { weight: '250g', price: 1100, mrp: 1350 },
      { weight: '500g', price: 2150, mrp: 2600 },
      { weight: '1kg', price: 4200, mrp: 5100 },
    ],
  },
  {
    id: 'p-010',
    slug: 'roasted-chia-pumpkin-seeds',
    name: 'Roasted Chia & Pumpkin Seeds',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.6,
    reviewCount: 110,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 10,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 120, mrp: 150 },
      { weight: '250g', price: 290, mrp: 370 },
      { weight: '500g', price: 550, mrp: 700 },
      { weight: '1kg', price: 1050, mrp: 1350 },
    ],
  },
  {
    id: 'p-011',
    slug: 'royal-dry-fruit-gift-hamper',
    name: 'Royal Dry Fruit Gift Hamper',
    category: 'gift-boxes',
    imageUrl: '/product-gift-hamper.jpg',
    rating: 4.9,
    reviewCount: 95,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 11,
    defaultVariantIndex: 1,
    variants: [
      { weight: '500g', price: 1350, mrp: 1650 },
      { weight: '1kg', price: 2450, mrp: 3000 },
    ],
  },
  {
    id: 'p-012',
    slug: 'kashmiri-walnut-kernels-giri',
    name: 'Kashmiri Walnut Kernels (Giri)',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.7,
    reviewCount: 135,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 12,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 145, mrp: 180 },
      { weight: '250g', price: 345, mrp: 430 },
      { weight: '500g', price: 670, mrp: 830 },
      { weight: '1kg', price: 1300, mrp: 1600 },
    ],
  },
];

// ─── Sub-Component: Product Card with Interactive Weight Pills ────────────────

function ProductCardItem({ product }: { product: ListingProduct }) {
  const { addItem } = useCart();
  const { isWishlisted: checkWishlisted, toggleWishlist } = useWishlist();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(product.defaultVariantIndex);
  const [added, setAdded] = useState(false);

  const isWishlisted = checkWishlisted(product.id) || checkWishlisted(product.slug);

  const currentVariant: WeightVariant =
    product.variants[selectedVariantIndex] ??
    product.variants[0] ?? { weight: '500g', price: 1000, mrp: 1200 };
  const savings = Math.max(0, currentVariant.mrp - currentVariant.price);
  const discountPct = Math.round((savings / currentVariant.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addItem({
      id: `${product.id}-${currentVariant.weight}`,
      name: product.name,
      variantLabel: currentVariant.weight,
      pricePaise: currentVariant.price * 100,
      mrpPaise: currentVariant.mrp * 100,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      discountBadge: product.discountBadge,
      rating: product.rating,
      reviewCount: product.reviewCount,
      variants: product.variants.map((v) => ({
        weight: v.weight,
        price: v.price,
        mrp: v.mrp,
        savingsText: `Save ₹${v.mrp - v.price} (${Math.round(((v.mrp - v.price) / v.mrp) * 100)}%)`,
      })),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden">
          {/* Red discount pill badge */}
          <span className="absolute top-2.5 left-2.5 bg-[#D92D20] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-xs z-10 shadow-xs tracking-wider">
            {product.discountBadge}
          </span>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all z-10 cursor-pointer"
            aria-label="Add to Wishlist"
          >
            <HeartIcon
              size={14}
              filled={isWishlisted}
              className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Product Image */}
          <Link href={`/products/${product.slug}`} className="relative w-full h-full block p-2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Card Details */}
        <div className="p-2.5 sm:p-3.5 pb-2">
          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-[#1B1F2A] hover:text-[#C88C3C] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5 text-[#E5A93C]">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 ml-0.5">{product.rating}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Pricing & Savings */}
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xs sm:text-base text-[#1B1F2A]">
                ₹{currentVariant.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ₹{currentVariant.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#15803D] block mt-0.5 leading-tight truncate">
              Save ₹{savings.toLocaleString('en-IN')} ({discountPct}%)
            </span>
          </div>

          {/* Weight Variant Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-2 pt-1 overflow-x-auto scrollbar-none">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIndex === idx;
              return (
                <button
                  key={v.weight}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[9px] sm:text-[11px] py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-md border text-center transition-all cursor-pointer font-medium shrink-0 ${
                    isActive
                      ? 'bg-[#F5E5C9] border-[#E5A93C] text-[#2C2114] font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {v.weight}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add to Cart button */}
      <div className="p-2.5 sm:p-3.5 pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#F5DCA8] hover:bg-[#E5CB97] text-[#2C2114] font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 px-2 sm:px-3 rounded-md flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer active:scale-[0.98] shadow-2xs"
          aria-label={`Add ${product.name} (${currentVariant.weight}) to cart`}
        >
          <ShoppingCartIcon size={13} className="text-[#2C2114]" />
          <span>{added ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Shop Client Component ───────────────────────────────────────────────

export function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const fromQuery = searchParams.get('category');
    if (fromQuery) return fromQuery;
    if (pathname.startsWith('/category/')) {
      return pathname.replace('/category/', '').split('/')[0] || 'all';
    }
    return 'all';
  });

  // Keep category in sync with URL
  React.useEffect(() => {
    const fromQuery = searchParams.get('category');
    if (fromQuery) {
      setActiveCategory(fromQuery);
    } else if (pathname.startsWith('/category/')) {
      setActiveCategory(pathname.replace('/category/', '').split('/')[0] || 'all');
    } else {
      setActiveCategory('all');
    }
  }, [searchParams, pathname]);

  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync category changes with URL
  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    if (slug === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${slug}`);
    }
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setMaxPrice(5000);
    setSelectedWeights([]);
    setInStockOnly(true);
    setMinDiscount(null);
    setMinRating(null);
    setSortBy('popularity');
    setCurrentPage(1);
    router.push(pathname);
  };

  // Toggle weight checkbox
  const toggleWeight = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight],
    );
    setCurrentPage(1);
  };

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Price limit
      const defaultVar: WeightVariant =
        p.variants[p.defaultVariantIndex] ??
        p.variants[0] ?? { weight: '500g', price: 1000, mrp: 1200 };
      const currentPrice = defaultVar.price;
      if (currentPrice > maxPrice) {
        return false;
      }
      // Weight filter
      if (selectedWeights.length > 0) {
        const hasMatchingWeight = p.variants.some((v) => selectedWeights.includes(v.weight));
        if (!hasMatchingWeight) return false;
      }
      // Rating filter
      if (minRating !== null && p.rating < minRating) {
        return false;
      }
      // Discount filter
      if (minDiscount !== null) {
        const disc = Math.round(((defaultVar.mrp - defaultVar.price) / defaultVar.mrp) * 100);
        if (disc < minDiscount) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.variants[a.defaultVariantIndex]?.price ?? a.variants[0]?.price ?? 0;
      const priceB = b.variants[b.defaultVariantIndex]?.price ?? b.variants[0]?.price ?? 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return a.popularityRank - b.popularityRank; // Matches mockup 1-8 order
    });
  }, [activeCategory, inStockOnly, maxPrice, selectedWeights, minRating, minDiscount, sortBy]);

  // Sidebar Filter Panel JSX
  const FilterSidebarContent = (
    <aside className="w-full space-y-6">
      {/* 1. Categories */}
      <div>
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-3">Categories</h3>
        <div className="space-y-1">
          {CATEGORY_ITEMS.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#B5712E] text-white font-bold shadow-2xs'
                    : 'text-gray-700 hover:bg-[#FAF8F5] hover:text-[#B5712E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border bg-white ${
                      isActive ? 'border-white/40' : 'border-amber-900/15'
                    }`}
                  >
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  </div>
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{cat.name}</span>
                </div>
                <span className={isActive ? 'text-white/95 text-[11px] font-semibold' : 'text-gray-400 text-[11px]'}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2">Price Range</h3>
        <div className="flex items-center justify-between text-xs text-gray-700 font-semibold mb-2">
          <span>₹ 0</span>
          <span>₹ {maxPrice === 5000 ? '5000+' : maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="200"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            background: `linear-gradient(to right, #B5712E 0%, #B5712E ${(maxPrice / 5000) * 100}%, #E8E1D5 ${(maxPrice / 5000) * 100}%, #E8E1D5 100%)`,
          }}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#B5712E]"
        />
      </div>

      {/* 3. Select Weight */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Select Weight</h3>
        <div className="space-y-2">
          {WEIGHT_OPTIONS.map((w) => {
            const checked = selectedWeights.includes(w.label);
            return (
              <label
                key={w.label}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleWeight(w.label)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <span>{w.label}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({w.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Availability */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
              />
              <span>In Stock</span>
            </div>
            <span className="text-gray-400 text-[11px]">(68)</span>
          </label>
          <label className="flex items-center justify-between text-xs text-gray-400 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled
                checked={false}
                className="w-3.5 h-3.5 rounded border-gray-200 text-gray-300 cursor-not-allowed"
              />
              <span>Out of Stock</span>
            </div>
            <span className="text-gray-400 text-[11px]">(0)</span>
          </label>
        </div>
      </div>

      {/* 5. Discount */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Discount</h3>
        <div className="space-y-2">
          {DISCOUNT_OPTIONS.map((d) => {
            const checked = minDiscount === d.min;
            return (
              <label
                key={d.label}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setMinDiscount(checked ? null : d.min)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <span>{d.label}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({d.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Customer Rating */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Customer Rating</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((r) => {
            const checked = minRating === r.stars;
            return (
              <label
                key={r.stars}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setMinRating(checked ? null : r.stars)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <div className="flex items-center gap-0.5 text-[#E5A93C]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        size={11}
                        filled={i < r.stars}
                        className={i < r.stars ? 'text-[#E5A93C]' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-[11px] text-gray-600 ml-1">&amp; above</span>
                  </div>
                </div>
                <span className="text-gray-400 text-[11px]">({r.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Clear Filters Button */}
      <div className="pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer active:scale-98"
        >
          <RotateCcwIcon size={14} className="text-white" />
          <span>Clear Filters</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="w-full pb-16">
      {/* ── 1. Full-Width Breadcrumb & Hero Banner matching the mockup ── */}
      <div className="w-full relative overflow-hidden min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex items-center bg-[#101924]">
        {/* Panoramic dry fruits spread at Mandi background */}
        <Image
          src="/hero-mandi-dark.jpg"
          alt="Dry fruits and nuts spread at Old Delhi historic mandi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Left Dark Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />

        {/* Banner Content inside max-w-7xl */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 text-white space-y-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/80 font-medium tracking-wide">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">&gt;</span>
            <span className="text-[#E5A93C] font-semibold">Dry Fruits</span>
          </nav>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            Shop Dry Fruits
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-sm sm:text-base text-[#E5A93C] drop-shadow-sm">
            Premium quality dry fruits from Old Delhi&apos;s historic mandi
          </p>

          {/* 4 Value Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-white text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <WheatHarvestIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">100% Pure</p>
                <p className="text-[9px] text-white/70">No Adulteration</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <MandiArchIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Direct from Mandi</p>
                <p className="text-[9px] text-white/70">Best Prices</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <VarietyBoxesIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Wide Variety</p>
                <p className="text-[9px] text-white/70">100+ Products</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <DeliveryTruckIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Pan India Delivery</p>
                <p className="text-[9px] text-white/70">Safe &amp; Fast</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Two-Column Layout (Sidebar + Grid) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar (260px) */}
          <div className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            {FilterSidebarContent}
          </div>

          {/* Mobile Filter Drawer Overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative bg-white w-80 h-full overflow-y-auto p-6 shadow-2xl z-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                    <h3 className="font-bold text-base text-[#1B1F2A]">Filter Products</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>
                  {FilterSidebarContent}
                </div>
              </div>
            </div>
          )}

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-xs font-bold border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer"
                >
                  <MenuIcon size={14} className="text-gray-700" />
                  <span>Filters</span>
                </button>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Showing 1–{filteredProducts.length} of 68 products
                </p>
              </div>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold border border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#B5712E] outline-none bg-white text-gray-800 shadow-2xs cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid: 4 columns on large screens */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-2xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#C88C3C] mb-4">
                  <VarietyBoxesIcon size={32} />
                </div>
                <h3 className="font-bold text-base text-[#1B1F2A]">No products found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  We couldn&apos;t find any products matching your current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2 bg-[#8E4A18] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#783D12] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((prod) => (
                  <ProductCardItem key={prod.id} product={prod} />
                ))}
              </div>
            )}

            {/* Pagination Controls matching mockup */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 pt-6">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeftIcon size={14} />
              </button>

              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isActive = currentPage === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                      isActive
                        ? 'bg-[#8E4A18] text-white shadow-xs'
                        : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(6, p + 1))}
                disabled={currentPage === 6}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRightIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
