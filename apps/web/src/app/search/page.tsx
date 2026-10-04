'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
} from '@/components/ThemeIcons';

interface ProductVariant {
  weight: string;
  price: number;
  mrp: number;
  discountPct: number;
  unitPriceText: string;
}

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  badge?: string;
  badgeType?: 'gold' | 'red';
  rating: number;
  ratingCount: number;
  imageUrl: string;
  category: string;
  almondType: string;
  variants: ProductVariant[];
  isBestseller?: boolean;
}

// ─── Complete Mock Data Matching the Mockup & Extended ───────────────────────
const ALL_SEARCH_PRODUCTS: SearchProduct[] = [
  {
    id: 'prod-mamra',
    slug: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    subtitle: 'Premium thin-skin, oil-rich variety from Kashmir.',
    badge: 'BESTSELLER',
    badgeType: 'gold',
    rating: 4.8,
    ratingCount: 1243,
    imageUrl: '/product-almonds.jpg',
    category: 'Mamra Almonds',
    almondType: 'Kashmiri Mamra',
    isBestseller: true,
    variants: [
      { weight: '250g', price: 1250, mrp: 1550, discountPct: 19, unitPriceText: '₹500.00 / 100g' },
      { weight: '500g', price: 2450, mrp: 3000, discountPct: 18, unitPriceText: '₹490.00 / 100g' },
      { weight: '1kg', price: 4800, mrp: 5800, discountPct: 17, unitPriceText: '₹480.00 / 100g' },
    ],
  },
  {
    id: 'prod-california',
    slug: 'california-almonds',
    name: 'California Almonds',
    subtitle: 'Big size, crunchy and naturally sweet California almonds.',
    rating: 4.7,
    ratingCount: 890,
    imageUrl: '/almonds-macro.jpg',
    category: 'California Almonds',
    almondType: 'California',
    variants: [
      { weight: '250g', price: 295, mrp: 370, discountPct: 20, unitPriceText: '₹118.00 / 100g' },
      { weight: '500g', price: 570, mrp: 700, discountPct: 19, unitPriceText: '₹114.00 / 100g' },
      { weight: '1kg', price: 1100, mrp: 1350, discountPct: 18, unitPriceText: '₹110.00 / 100g' },
    ],
  },
  {
    id: 'prod-w240',
    slug: 'w240-jumbo-almonds',
    name: 'W240 Almonds',
    subtitle: 'Jumbo size premium almonds with rich taste.',
    badge: '15% OFF',
    badgeType: 'red',
    rating: 4.6,
    ratingCount: 420,
    imageUrl: '/b2b-bowl.jpg',
    category: 'California Almonds',
    almondType: 'Regular Almonds',
    variants: [
      { weight: '250g', price: 1150, mrp: 1350, discountPct: 15, unitPriceText: '₹230.00 / 100g' },
      { weight: '500g', price: 2200, mrp: 2600, discountPct: 15, unitPriceText: '₹220.00 / 100g' },
      { weight: '1kg', price: 4250, mrp: 5000, discountPct: 15, unitPriceText: '₹212.50 / 100g' },
    ],
  },
  {
    id: 'prod-regular',
    slug: 'regular-quality-almonds',
    name: 'Regular Almonds',
    subtitle: 'High quality, naturally nutritious almonds for everyday use.',
    rating: 4.5,
    ratingCount: 320,
    imageUrl: '/almonds-split.jpg',
    category: 'Almonds',
    almondType: 'Regular Almonds',
    variants: [
      { weight: '250g', price: 650, mrp: 800, discountPct: 19, unitPriceText: '₹130.00 / 100g' },
      { weight: '500g', price: 1250, mrp: 1550, discountPct: 19, unitPriceText: '₹125.00 / 100g' },
      { weight: '1kg', price: 2400, mrp: 3000, discountPct: 20, unitPriceText: '₹120.00 / 100g' },
    ],
  },
  {
    id: 'prod-roasted',
    slug: 'roasted-and-salted-almonds',
    name: 'Roasted & Salted Almonds',
    subtitle: 'Perfectly roasted almonds with a dash of salt.',
    rating: 4.4,
    ratingCount: 210,
    imageUrl: '/almonds-roasted.jpg',
    category: 'Flavoured Almonds',
    almondType: 'Flavoured',
    variants: [
      { weight: '250g', price: 699, mrp: 850, discountPct: 18, unitPriceText: '₹139.80 / 100g' },
      { weight: '500g', price: 1349, mrp: 1650, discountPct: 18, unitPriceText: '₹134.90 / 100g' },
      { weight: '1kg', price: 2599, mrp: 3200, discountPct: 19, unitPriceText: '₹129.95 / 100g' },
    ],
  },
  {
    id: 'prod-chocolate',
    slug: 'chocolate-coated-almonds',
    name: 'Chocolate Coated Almonds',
    subtitle: 'Premium almonds coated with rich chocolate.',
    rating: 4.6,
    ratingCount: 180,
    imageUrl: '/almonds-chocolate.jpg',
    category: 'Flavoured Almonds',
    almondType: 'Flavoured',
    variants: [
      { weight: '250g', price: 950, mrp: 1150, discountPct: 17, unitPriceText: '₹190.00 / 100g' },
      { weight: '500g', price: 1850, mrp: 2250, discountPct: 18, unitPriceText: '₹185.00 / 100g' },
    ],
  },
  {
    id: 'prod-slivers',
    slug: 'almond-slivers-sliced',
    name: 'Almond Slivers',
    subtitle: 'Finely sliced almonds, ideal for cooking and baking.',
    rating: 4.5,
    ratingCount: 150,
    imageUrl: '/almonds-slivers.jpg',
    category: 'Almonds',
    almondType: 'California',
    variants: [
      { weight: '250g', price: 620, mrp: 750, discountPct: 17, unitPriceText: '₹124.00 / 100g' },
      { weight: '500g', price: 1199, mrp: 1450, discountPct: 17, unitPriceText: '₹119.90 / 100g' },
    ],
  },
  {
    id: 'prod-gift-box',
    slug: 'festive-almond-gift-box',
    name: 'Almond Gift Box',
    subtitle: 'Premium almond gift pack for your loved ones.',
    rating: 4.8,
    ratingCount: 95,
    imageUrl: '/product-gift-hamper.jpg',
    category: 'Almond Gift Packs',
    almondType: 'Kashmiri Mamra',
    variants: [
      { weight: '500g', price: 1499, mrp: 1799, discountPct: 17, unitPriceText: '₹299.80 / 100g' },
      { weight: '1kg', price: 2899, mrp: 3499, discountPct: 17, unitPriceText: '₹289.90 / 100g' },
    ],
  },
  // Extra products for pagination demo (Page 2 & 3)
  {
    id: 'prod-gurbandi',
    slug: 'gurbandi-choti-giri-almonds',
    name: 'Gurbandi Choti Giri Almonds',
    subtitle: 'Pure Afghan wild almonds with intense natural aroma & oil.',
    rating: 4.7,
    ratingCount: 310,
    imageUrl: '/product-almonds.jpg',
    category: 'Mamra Almonds',
    almondType: 'Kashmiri Mamra',
    variants: [
      { weight: '250g', price: 799, mrp: 999, discountPct: 20, unitPriceText: '₹159.80 / 100g' },
      { weight: '500g', price: 1550, mrp: 1950, discountPct: 21, unitPriceText: '₹155.00 / 100g' },
    ],
  },
  {
    id: 'prod-honey-roasted',
    slug: 'honey-glazed-roasted-almonds',
    name: 'Honey Glazed Almonds',
    subtitle: 'Crisp California almonds tossed in organic Kashmiri honey.',
    rating: 4.6,
    ratingCount: 140,
    imageUrl: '/almonds-roasted.jpg',
    category: 'Flavoured Almonds',
    almondType: 'Flavoured',
    variants: [
      { weight: '250g', price: 749, mrp: 899, discountPct: 17, unitPriceText: '₹149.80 / 100g' },
      { weight: '500g', price: 1450, mrp: 1750, discountPct: 17, unitPriceText: '₹145.00 / 100g' },
    ],
  },
  {
    id: 'prod-royal-hamper',
    slug: 'royal-heritage-mamra-box',
    name: 'Royal Heritage Almond Box',
    subtitle: 'Hand-carved wooden box loaded with Kashmir Gold Mamra.',
    rating: 4.9,
    ratingCount: 88,
    imageUrl: '/product-gift-hamper.jpg',
    category: 'Almond Gift Packs',
    almondType: 'Kashmiri Mamra',
    variants: [
      { weight: '1kg', price: 3499, mrp: 4200, discountPct: 17, unitPriceText: '₹349.90 / 100g' },
    ],
  },
  {
    id: 'prod-smoke-almonds',
    slug: 'hickory-smoked-almonds',
    name: 'Smoked Barbeque Almonds',
    subtitle: 'Artisanal slow wood-smoked crunch for snacking.',
    rating: 4.5,
    ratingCount: 125,
    imageUrl: '/almonds-roasted.jpg',
    category: 'Flavoured Almonds',
    almondType: 'Flavoured',
    variants: [
      { weight: '250g', price: 680, mrp: 820, discountPct: 17, unitPriceText: '₹136.00 / 100g' },
    ],
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const rawQ = searchParams.get('q');
  const query = rawQ && rawQ.trim() ? rawQ.trim() : 'almonds';

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const { addItem, openCart } = useCart();
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();

  // ─── Filter States ──────────────────────────────────────────────────────────
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Almonds']);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(5000);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'bestseller' | 'price_asc' | 'price_desc' | 'rating'>(
    'bestseller',
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Accordion toggle states
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openWeight, setOpenWeight] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [openAvailability, setOpenAvailability] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  // Selected variant index per product ID
  const [variantSelections, setVariantSelections] = useState<Record<string, number>>({});
  const [addedItemState, setAddedItemState] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ─── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return ALL_SEARCH_PRODUCTS.filter((prod) => {
      // Category filter (if Almonds checked, includes all almond items)
      if (selectedCategories.length > 0 && !selectedCategories.includes('Almonds')) {
        if (!selectedCategories.includes(prod.category)) return false;
      }

      // Price filter
      const activeVariant = prod.variants[variantSelections[prod.id] ?? 0] ?? prod.variants[0];
      if (activeVariant && (activeVariant.price < appliedMinPrice || activeVariant.price > appliedMaxPrice)) {
        return false;
      }

      // Weight filter
      if (selectedWeights.length > 0) {
        const hasWeight = prod.variants.some((v) => selectedWeights.includes(v.weight));
        if (!hasWeight) return false;
      }

      // Type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(prod.almondType)) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = (a.variants[variantSelections[a.id] ?? 0] ?? a.variants[0])?.price ?? 0;
      const priceB = (b.variants[variantSelections[b.id] ?? 0] ?? b.variants[0])?.price ?? 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: bestseller
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [selectedCategories, appliedMinPrice, appliedMaxPrice, selectedWeights, selectedTypes, sortBy, variantSelections]);

  // Paginated slice
  const totalProducts = 24; // Mockup specifies 24 products found
  const paginatedProducts = useMemo(() => {
    // If on page 1, show first 8 products
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleToggleWeight = (w: string) => {
    setSelectedWeights((prev) =>
      prev.includes(w) ? prev.filter((item) => item !== w) : [...prev, w],
    );
  };

  const handleToggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t],
    );
  };

  const handleApplyPrice = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    triggerToast(`Applied price range ₹${minPrice} - ₹${maxPrice}`);
  };

  const handleClearAll = () => {
    setSelectedCategories(['Almonds']);
    setMinPrice(0);
    setMaxPrice(5000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(5000);
    setSelectedWeights([]);
    setSelectedTypes([]);
    setSortBy('bestseller');
    setCurrentPage(1);
    triggerToast('All filters cleared');
  };

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setVariantSelections((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  const handleAddToCart = (product: SearchProduct) => {
    const vIndex = variantSelections[product.id] ?? 0;
    const variant = product.variants[vIndex] ?? product.variants[0];
    if (!variant) return;

    addItem({
      id: `${product.id}-${variant.weight}`,
      name: product.name,
      variantLabel: variant.weight,
      pricePaise: variant.price * 100,
      mrpPaise: variant.mrp * 100,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });

    setAddedItemState((prev) => ({ ...prev, [product.id]: true }));
    triggerToast(`Added ${product.name} (${variant.weight}) to cart!`);

    setTimeout(() => {
      setAddedItemState((prev) => ({ ...prev, [product.id]: false }));
      openCart();
    }, 400);
  };

  const handleToggleProductWishlist = (product: SearchProduct) => {
    const vIndex = variantSelections[product.id] ?? 0;
    const variant = product.variants[vIndex] ?? product.variants[0];
    const isW = checkIsWishlisted(product.id) || checkIsWishlisted(product.slug);

    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      discountBadge: `${variant?.discountPct ?? 15}% OFF`,
      rating: product.rating,
      reviewCount: product.ratingCount,
      variants: product.variants.map((v) => ({
        weight: v.weight,
        price: v.price,
        mrp: v.mrp,
        savingsText: `Save ${v.discountPct}%`,
      })),
    });

    triggerToast(isW ? 'Removed from Wishlist' : 'Saved to Wishlist!');
  };

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#2C2723] pb-20">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1F2A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#B5712E] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1B1F2A] font-bold">Search</span>
        </nav>
      </div>

      {/* ── Search Results Banner Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="relative rounded-2xl bg-[#FBF8F3] border border-[#F0ECE1] overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          {/* Left Text */}
          <div className="space-y-1.5 z-10 max-w-lg">
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1B1F2A] tracking-tight leading-none">
              Search Results
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Showing results for <span className="text-[#8C1C1C] font-serif font-bold">&ldquo;{query}&rdquo;</span>
            </p>
            <p className="text-xs text-gray-500 font-normal pt-0.5">
              {totalProducts} products found
            </p>
          </div>

          {/* Right Almonds Banner Image */}
          <div className="relative w-full md:w-[480px] h-36 sm:h-44 rounded-xl overflow-hidden shadow-xs">
            <Image
              src="/almonds-search-banner.jpg"
              alt="Search results for almonds"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Filters Sidebar (~3 cols) ── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Filters Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="font-serif font-black text-base text-[#1B1F2A]">Filters</h2>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-[#8E4A18] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* 1. Category Accordion */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  type="button"
                  onClick={() => setOpenCategory(!openCategory)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer mb-2.5"
                >
                  <span>Category</span>
                  <span className="text-gray-400 text-xs">{openCategory ? '⌃' : '⌄'}</span>
                </button>

                {openCategory && (
                  <div className="space-y-2 pt-1 text-xs">
                    {[
                      { label: 'Almonds', count: 24 },
                      { label: 'Mamra Almonds', count: 6 },
                      { label: 'California Almonds', count: 8 },
                      { label: 'Flavoured Almonds', count: 4 },
                      { label: 'Almond Gift Packs', count: 3 },
                    ].map((cat) => {
                      const isChecked = selectedCategories.includes(cat.label);
                      return (
                        <label
                          key={cat.label}
                          className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCategory(cat.label)}
                              className="w-3.5 h-3.5 rounded accent-[#8E4A18] cursor-pointer"
                            />
                            <span className={isChecked ? 'font-bold text-[#1B1F2A]' : 'font-normal'}>
                              {cat.label}
                            </span>
                          </div>
                          <span className="text-gray-400 text-[11px]">({cat.count})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Price Range Accordion */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  type="button"
                  onClick={() => setOpenPrice(!openPrice)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer mb-2.5"
                >
                  <span>Price Range</span>
                  <span className="text-gray-400 text-xs">{openPrice ? '⌃' : '⌄'}</span>
                </button>

                {openPrice && (
                  <div className="space-y-3 pt-1">
                    {/* Inputs */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-2 py-1.5 bg-[#FAF9F6]">
                        <span className="text-gray-400 mr-1">₹</span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-gray-800 font-semibold text-xs"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-2 py-1.5 bg-[#FAF9F6]">
                        <span className="text-gray-400 mr-1">₹</span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full bg-transparent outline-none text-gray-800 font-semibold text-xs"
                        />
                      </div>
                    </div>

                    {/* Dual Slider Mockup Track */}
                    <div className="relative py-2">
                      <div className="h-1.5 bg-gray-200 rounded-full relative">
                        <div className="absolute left-[5%] right-[10%] top-0 bottom-0 bg-[#8E4A18] rounded-full" />
                        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#8E4A18] rounded-full border-2 border-white shadow-xs cursor-pointer" />
                        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#8E4A18] rounded-full border-2 border-white shadow-xs cursor-pointer" />
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      onClick={handleApplyPrice}
                      className="w-full py-2 bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Weight Accordion */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  type="button"
                  onClick={() => setOpenWeight(!openWeight)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer mb-2.5"
                >
                  <span>Weight</span>
                  <span className="text-gray-400 text-xs">{openWeight ? '⌃' : '⌄'}</span>
                </button>

                {openWeight && (
                  <div className="space-y-2 pt-1 text-xs">
                    {[
                      { label: '100g', count: 4 },
                      { label: '250g', count: 6 },
                      { label: '500g', count: 8 },
                      { label: '1kg', count: 6 },
                    ].map((w) => {
                      const isChecked = selectedWeights.includes(w.label);
                      return (
                        <label
                          key={w.label}
                          className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWeight(w.label)}
                              className="w-3.5 h-3.5 rounded accent-[#8E4A18] cursor-pointer"
                            />
                            <span className={isChecked ? 'font-bold text-[#1B1F2A]' : 'font-normal'}>
                              {w.label}
                            </span>
                          </div>
                          <span className="text-gray-400 text-[11px]">({w.count})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Type Accordion */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  type="button"
                  onClick={() => setOpenType(!openType)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer mb-2.5"
                >
                  <span>Type</span>
                  <span className="text-gray-400 text-xs">{openType ? '⌃' : '⌄'}</span>
                </button>

                {openType && (
                  <div className="space-y-2 pt-1 text-xs">
                    {[
                      { label: 'Kashmiri Mamra', count: 6 },
                      { label: 'California', count: 8 },
                      { label: 'Regular Almonds', count: 6 },
                      { label: 'Flavoured', count: 4 },
                    ].map((t) => {
                      const isChecked = selectedTypes.includes(t.label);
                      return (
                        <label
                          key={t.label}
                          className="flex items-center justify-between text-gray-700 hover:text-black cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleType(t.label)}
                              className="w-3.5 h-3.5 rounded accent-[#8E4A18] cursor-pointer"
                            />
                            <span className={isChecked ? 'font-bold text-[#1B1F2A]' : 'font-normal'}>
                              {t.label}
                            </span>
                          </div>
                          <span className="text-gray-400 text-[11px]">({t.count})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Availability Accordion */}
              <div className="border-b border-gray-100 pb-3">
                <button
                  type="button"
                  onClick={() => setOpenAvailability(!openAvailability)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer"
                >
                  <span>Availability</span>
                  <span className="text-gray-400 text-xs">{openAvailability ? '⌃' : '⌄'}</span>
                </button>
                {openAvailability && (
                  <div className="space-y-2 pt-3 text-xs">
                    <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded accent-[#8E4A18]" />
                        <span>In Stock</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">(22)</span>
                    </label>
                    <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#8E4A18]" />
                        <span>Out of Stock</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">(2)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 6. Brand / Origin Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenBrand(!openBrand)}
                  className="flex items-center justify-between w-full text-left text-xs font-bold text-[#1B1F2A] cursor-pointer"
                >
                  <span>Brand / Origin</span>
                  <span className="text-gray-400 text-xs">{openBrand ? '⌃' : '⌄'}</span>
                </button>
                {openBrand && (
                  <div className="space-y-2 pt-3 text-xs">
                    <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#8E4A18]" />
                        <span>Kashmir, India</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">(10)</span>
                    </label>
                    <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#8E4A18]" />
                        <span>California, USA</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">(8)</span>
                    </label>
                    <label className="flex items-center justify-between text-gray-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#8E4A18]" />
                        <span>Khari Baoli Mandi Special</span>
                      </div>
                      <span className="text-gray-400 text-[11px]">(6)</span>
                    </label>
                  </div>
                )}
              </div>

            </div>

            {/* ── Bulk Orders? Callout Card (Matching Mockup) ── */}
            <div className="rounded-2xl bg-[#FDF4E7] border border-[#F6DEC0] p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1 flex-1">
                <h3 className="font-serif font-black text-sm text-[#1B1F2A]">Bulk Orders?</h3>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Get special wholesale rates on almonds and other dry fruits.
                </p>
                <Link
                  href="/wholesale"
                  className="inline-flex items-center gap-1.5 bg-[#6E1A1A] hover:bg-[#581414] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors mt-2"
                >
                  <span>Get Wholesale Quote</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Jute sack / almond bowl graphic */}
              <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src="/product-almonds.jpg"
                  alt="Bulk Almond Orders"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Sort Toolbar, 4x2 Grid, Pagination (~9 cols) ── */}
          <div className="lg:col-span-9 space-y-5">
            
            {/* Sort & View Mode Toolbar */}
            <div className="flex items-center justify-end gap-3 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs font-semibold text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 bg-white outline-none cursor-pointer hover:border-gray-400"
                >
                  <option value="bestseller">Best Sellers</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              {/* Grid / List View Icons */}
              <div className="flex items-center gap-1">
                {/* Grid Icon */}
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#8E4A18] text-white shadow-2xs'
                      : 'text-gray-400 hover:text-gray-700 bg-white border border-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>

                {/* List Icon */}
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#8E4A18] text-white shadow-2xs'
                      : 'text-gray-400 hover:text-gray-700 bg-white border border-gray-200'
                  }`}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Product Grid (4 columns on lg) ── */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
                  : 'space-y-4'
              }
            >
              {paginatedProducts.map((product) => {
                const currentVariantIdx = variantSelections[product.id] ?? 0;
                const activeVariant = product.variants[currentVariantIdx] ?? product.variants[0];
                const isWishlisted = checkIsWishlisted(product.id) || checkIsWishlisted(product.slug);
                const isAdded = addedItemState[product.id];

                if (!activeVariant) return null;

                if (viewMode === 'list') {
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative w-28 h-28 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0"
                        >
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        </Link>
                        <div>
                          <Link href={`/products/${product.slug}`} className="hover:text-[#8E4A18]">
                            <h3 className="font-serif font-black text-base text-[#1B1F2A]">{product.name}</h3>
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.subtitle}</p>
                          <div className="flex items-center gap-1 text-[#E5A93C] text-xs mt-1">
                            <StarIcon size={12} filled={true} />
                            <span className="font-bold text-gray-800">{product.rating}</span>
                            <span className="text-gray-400">({product.ratingCount})</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            {product.variants.map((v, idx) => (
                              <button
                                key={v.weight}
                                type="button"
                                onClick={() => handleSelectVariant(product.id, idx)}
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                                  currentVariantIdx === idx
                                    ? 'bg-[#1B1F2A] text-white border-[#1B1F2A]'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {v.weight}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif font-black text-lg text-[#1B1F2A]">
                              ₹{formatCurrency(activeVariant.price)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{formatCurrency(activeVariant.mrp)}
                            </span>
                            <span className="text-[10px] font-bold text-[#16A34A]">
                              {activeVariant.discountPct}% OFF
                            </span>
                          </div>
                          <span className="text-[10.5px] text-gray-400">({activeVariant.unitPriceText})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#FCE7C8] hover:bg-[#F8DAAF] text-[#3D2411] font-bold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <ShoppingCartIcon size={13} />
                          <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                // Grid View Card (Matches Mockup Pixel-for-Pixel)
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Top: Image + Badges */}
                      <div className="relative aspect-[4/3] w-full bg-[#FAF8F5] overflow-hidden">
                        {/* Top-Left Badge */}
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 z-10">
                            {product.badgeType === 'gold' ? (
                              <span className="bg-[#B45309] text-white text-[9.5px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide shadow-2xs">
                                {product.badge}
                              </span>
                            ) : (
                              <span className="bg-[#D92D20] text-white text-[9.5px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide shadow-2xs">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Top-Right Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleProductWishlist(product)}
                          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-2xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                          aria-label="Wishlist"
                        >
                          <HeartIcon
                            size={14}
                            filled={isWishlisted}
                            className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}
                          />
                        </button>

                        {/* Product Image */}
                        <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      </div>

                      {/* Card Content */}
                      <div className="p-3.5 space-y-1.5">
                        {/* Title */}
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-serif font-black text-sm text-[#1B1F2A] hover:text-[#8E4A18] transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Subtitle */}
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed h-8">
                          {product.subtitle}
                        </p>

                        {/* Ratings */}
                        <div className="flex items-center gap-1 text-[11px] text-[#E5A93C] pt-0.5">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
                            ))}
                          </div>
                          <span className="font-bold text-gray-800 ml-0.5">{product.rating}</span>
                          <span className="text-gray-400">({product.ratingCount})</span>
                        </div>

                        {/* Price Row */}
                        <div className="pt-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-serif font-black text-base text-[#1B1F2A]">
                              ₹{formatCurrency(activeVariant.price)}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{formatCurrency(activeVariant.mrp)}
                            </span>
                            <span className="text-[10.5px] font-bold text-[#16A34A]">
                              {activeVariant.discountPct}% OFF
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium">
                            ({activeVariant.unitPriceText})
                          </p>
                        </div>

                        {/* Weight Variant Pills */}
                        <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                          {product.variants.map((v, vIdx) => {
                            const isVActive = currentVariantIdx === vIdx;
                            return (
                              <button
                                key={v.weight}
                                type="button"
                                onClick={() => handleSelectVariant(product.id, vIdx)}
                                className={`text-[10px] font-semibold px-2 py-1 rounded border transition-colors cursor-pointer ${
                                  isVActive
                                    ? 'bg-white text-gray-900 border-gray-400 shadow-2xs font-bold'
                                    : 'bg-[#FAF8F5] text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {v.weight}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart CTA Button */}
                    <div className="p-3.5 pt-0">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-[#FCE7C8] hover:bg-[#F8DAAF] text-[#3D2411] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        <ShoppingCartIcon size={13} className="shrink-0" />
                        <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Bottom Pagination Bar ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Showing 1–{paginatedProducts.length} of {totalProducts} products
              </span>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((page) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                      className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#6E1A1A] text-white shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(3, p + 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="w-7 h-7 rounded-md bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xs font-bold cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRightIcon size={12} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-44 bg-gray-100 rounded-2xl w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-3 h-96 bg-gray-100 rounded-2xl" />
              <div className="lg:col-span-9 grid grid-cols-4 gap-4 h-96 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
