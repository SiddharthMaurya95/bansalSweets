'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useServerCart } from '@/hooks/useCatalog';
import { type ProductDetail } from '@/lib/api';
import {
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  DeliveryTruckIcon,
  MandiArchIcon,
  CrownIcon,
  ZoomInIcon,
  PlayIcon,
  BoltIcon,
  FlaskIcon,
  BrainIcon,
  ScaleIcon,
  SparklesIcon,
  HeartPulseIcon,
  EditIcon,
  ArrowRightIcon,
  CloseIcon,
} from '@/components/ThemeIcons';

interface ProductDetailClientProps {
  product: ProductDetail;
}

interface GalleryItem {
  url: string;
  altText: string;
  isVideo?: boolean;
}

interface WeightVariantCard {
  weight: string;
  price: number;
  mrp: number;
  savePct?: number;
  sku: string;
  perKg: number;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { serverAddItem } = useServerCart();

  // ─── 1. Gallery images (6 thumbnails matching mockup) ──────────────────────
  const galleryImages: GalleryItem[] = useMemo(() => {
    // If it's Kashmiri Mamra Almonds or almonds
    if (product.slug.includes('almond') || product.slug.includes('badam')) {
      return [
        { url: '/product-almonds.jpg', altText: 'Kashmiri Mamra Almonds in wooden bowl' },
        { url: '/almonds-macro.jpg', altText: 'Raw Kashmiri Mamra almonds macro shot' },
        { url: '/product-almonds.jpg', altText: 'Crisp Mamra almonds artisan spread' },
        { url: '/almonds-split.jpg', altText: 'Split Mamra almond kernel cut open' },
        { url: '/almonds-tree.jpg', altText: 'Fresh green almond on tree branch in Kashmir' },
        { url: '/almonds-pouch.jpg', altText: 'Bansal Foods packaging pouch video', isVideo: true },
      ];
    }
    // Fallback for other dry fruits
    let mainImg = '/product-almonds.jpg';
    if (product.slug.includes('cashew') || product.slug.includes('kaju')) mainImg = '/product-cashews.jpg';
    else if (product.slug.includes('pista')) mainImg = '/product-pistachios.jpg';
    else if (product.slug.includes('walnut')) mainImg = '/product-walnuts.jpg';
    else if (product.slug.includes('raisin')) mainImg = '/product-raisins.jpg';
    else if (product.slug.includes('date')) mainImg = '/product-dates.jpg';
    else if (product.slug.includes('fig')) mainImg = '/product-figs.jpg';
    else if (product.slug.includes('mix')) mainImg = '/product-mix.jpg';

    return [
      { url: mainImg, altText: product.name },
      { url: '/almonds-macro.jpg', altText: `${product.name} detail view` },
      { url: mainImg, altText: `${product.name} angle view` },
      { url: '/almonds-split.jpg', altText: `${product.name} kernel cross section` },
      { url: '/almonds-tree.jpg', altText: `${product.name} natural harvest` },
      { url: '/almonds-pouch.jpg', altText: `${product.name} packaging pouch`, isVideo: true },
    ];
  }, [product.slug, product.name]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const activeImage: GalleryItem = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? {
    url: '/product-almonds.jpg',
    altText: product.name,
  };
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // ─── 2. Weight Variants (matching mockup cards) ───────────────────────────
  const weightOptions: WeightVariantCard[] = useMemo(() => {
    return [
      { weight: '100g', price: 120, mrp: 150, sku: 'BF-ALM-MAMRA-100G', perKg: 1200 },
      { weight: '250g', price: 280, mrp: 320, savePct: 7, sku: 'BF-ALM-MAMRA-250G', perKg: 1120 },
      { weight: '500g', price: 550, mrp: 600, savePct: 8, sku: 'BF-ALM-MAMRA-500G', perKg: 1100 },
      { weight: '1kg', price: 1050, mrp: 1200, savePct: 12, sku: 'BF-ALM-MAMRA-1KG', perKg: 1050 },
    ];
  }, []);

  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0); // 100g active by default as shown in mockup
  const currentVariant: WeightVariantCard = weightOptions[selectedWeightIndex] ?? weightOptions[0] ?? {
    weight: '100g',
    price: 120,
    mrp: 150,
    sku: 'BF-ALM-MAMRA-100G',
    perKg: 1200,
  };

  // ─── 3. Purchase State ────────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkIsWishlisted(product.id) || checkIsWishlisted(product.slug);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: activeImage.url,
      discountBadge: `${currentVariant.savePct || 15}% OFF`,
      rating: 4.8,
      reviewCount: 320,
      variants: weightOptions.map((w) => ({
        weight: w.weight,
        price: w.price,
        mrp: w.mrp,
        savingsText: `Save ₹${w.mrp - w.price} (${w.savePct || Math.round(((w.mrp - w.price) / w.mrp) * 100)}%)`,
      })),
    });
  };

  // ─── 4. Tabs State ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    'details' | 'benefits' | 'nutrition' | 'storage' | 'shipping' | 'returns' | 'reviews'
  >('details');

  // ─── 5. Frequently Bought Together Bundle ─────────────────────────────────
  const [bundleAlmonds, setBundleAlmonds] = useState(true);
  const [bundleCashews, setBundleCashews] = useState(true);
  const [bundlePistachios, setBundlePistachios] = useState(true);
  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleTotal = useMemo(() => {
    let total = 0;
    let mrp = 0;
    if (bundleAlmonds) {
      total += 550;
      mrp += 700;
    }
    if (bundleCashews) {
      total += 780;
      mrp += 980;
    }
    if (bundlePistachios) {
      total += 1550;
      mrp += 1900;
    }
    const savings = mrp - total;
    const savePct = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
    return { total, mrp, savings, savePct };
  }, [bundleAlmonds, bundleCashews, bundlePistachios]);

  // ─── 6. Review Modal State ────────────────────────────────────────────────
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Handlers
  const handleAddToCart = () => {
    setAddedToCart(true);
    addItem({
      id: `${product.id}-${currentVariant.weight}`,
      name: product.name,
      variantLabel: currentVariant.weight,
      pricePaise: currentVariant.price * 100,
      mrpPaise: currentVariant.mrp * 100,
      imageUrl: activeImage.url,
      slug: product.slug,
    });
    serverAddItem(currentVariant.sku, quantity).catch(() => {});
    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 400);
  };

  const handleBuyNow = () => {
    addItem({
      id: `${product.id}-${currentVariant.weight}`,
      name: product.name,
      variantLabel: currentVariant.weight,
      pricePaise: currentVariant.price * 100,
      mrpPaise: currentVariant.mrp * 100,
      imageUrl: activeImage.url,
      slug: product.slug,
    });
    router.push('/checkout');
  };

  const handleAddBundleToCart = () => {
    setBundleAdded(true);
    if (bundleAlmonds) {
      addItem({
        id: 'bundle-almonds-500g',
        name: 'Kashmiri Mamra Almonds',
        variantLabel: '500g',
        pricePaise: 55000,
        mrpPaise: 70000,
        imageUrl: '/product-almonds.jpg',
        slug: 'kashmiri-mamra-almonds',
      });
    }
    if (bundleCashews) {
      addItem({
        id: 'bundle-cashews-500g',
        name: 'W320 Premium Cashews',
        variantLabel: '500g',
        pricePaise: 78000,
        mrpPaise: 98000,
        imageUrl: '/product-cashews.jpg',
        slug: 'w320-premium-cashews',
      });
    }
    if (bundlePistachios) {
      addItem({
        id: 'bundle-pista-500g',
        name: 'Iranian Green Pistachios',
        variantLabel: '500g',
        pricePaise: 155000,
        mrpPaise: 190000,
        imageUrl: '/product-pistachios.jpg',
        slug: 'iranian-green-pistachios',
      });
    }
    setTimeout(() => {
      setBundleAdded(false);
      openCart();
    }, 400);
  };

  const handleTabClick = (tabId: typeof activeTab, elementId: string) => {
    setActiveTab(tabId);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full pb-20">
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#B5712E] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link href="/category/almonds" className="hover:text-[#B5712E] transition-colors">
            Almonds
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1B1F2A] font-bold">{product.name}</span>
        </nav>
      </div>

      {/* ── Top Main Product Section (Left Gallery & Right Buy Box) ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT: Product Gallery (7 cols on lg) ── */}
          <div className="lg:col-span-7">
            {/* Main Featured Image Container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden border border-gray-200/80 bg-[#FAF8F5] shadow-2xs group">
              {/* Gold "PREMIUM QUALITY" Seal Badge */}
              <div className="absolute top-4 left-4 z-10 w-16 h-16 rounded-full bg-[#E5A93C] text-[#2C2114] flex flex-col items-center justify-center border-2 border-white/90 shadow-md">
                <CrownIcon size={16} className="text-[#2C2114]" />
                <span className="text-[7.5px] font-black tracking-wider uppercase leading-none mt-1">
                  PREMIUM
                </span>
                <span className="text-[7.5px] font-black tracking-wider uppercase leading-none">
                  QUALITY
                </span>
              </div>

              {/* Featured Image */}
              <Image
                src={activeImage.url}
                alt={activeImage.altText}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Wishlist Heart */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 border border-gray-200"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon
                  size={16}
                  filled={isWishlisted}
                  className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}
                />
              </button>

              {/* Click to Zoom Pill */}
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-xs hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                aria-label="Zoom image"
              >
                <ZoomInIcon size={13} className="text-gray-600" />
                <span>Click to Zoom</span>
              </button>
            </div>

            {/* 6 Thumbnail Selector Grid */}
            <div className="grid grid-cols-6 gap-2.5 sm:gap-3 mt-3.5">
              {galleryImages.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#FAF8F5] ${
                      isSelected
                        ? 'border-[#B5712E] ring-2 ring-[#B5712E]/25 shadow-xs scale-102'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image src={img.url} alt={img.altText} fill className="object-cover" />
                    {img.isVideo && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-gray-900 shadow-xs">
                          <PlayIcon size={9} className="ml-0.5 text-[#1B1F2A]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Product Details & Purchase Controls (5 cols on lg) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Bestseller Tag */}
              <div>
                <span className="inline-flex items-center gap-1 bg-[#FDF2E9] text-[#B54708] border border-[#FCE0CC] text-[10.5px] font-black px-2.5 py-0.5 rounded-full tracking-wider">
                  ✦ BESTSELLER
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1B1F2A] tracking-tight leading-tight mt-2">
                {product.name}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
                Premium quality, hand-picked Mamra almonds from Kashmir. Naturally rich in
                nutrients, crisp, sweet and full of authentic taste.
              </p>

              {/* Star Rating & Social Proof */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex items-center text-[#E5A93C] gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} size={13} filled={true} className="text-[#E5A93C]" />
                  ))}
                </div>
                <span className="font-bold text-gray-800">4.8</span>
                <button
                  type="button"
                  onClick={() => handleTabClick('reviews', 'reviews-section')}
                  className="text-gray-500 hover:text-[#B5712E] hover:underline cursor-pointer"
                >
                  (320 reviews)
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-medium">1K+ bought in last month</span>
              </div>

              {/* SKU, Stock & Free Delivery Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-medium">
                  SKU:{' '}
                  <span className="text-gray-800 font-semibold">{currentVariant.sku}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#15803D] font-bold">
                    <span>✔</span> In Stock
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <DeliveryTruckIcon size={15} className="text-[#15803D]" />
                    <span>
                      Free Pan India Delivery{' '}
                      <span className="text-gray-400">on orders above ₹999</span>
                    </span>
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-4 pt-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif font-black text-2xl sm:text-3xl text-[#1B1F2A]">
                    ₹{selectedWeightIndex === 0 ? '1,200' : currentVariant.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    ₹{selectedWeightIndex === 0 ? '1,500' : currentVariant.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-[#D92D20] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm">
                    {selectedWeightIndex === 0 ? '20%' : `${currentVariant.savePct}%`} OFF
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                  <span>(₹1,200 per kg)</span>
                  <span>•</span>
                  <span>Inclusive of all taxes</span>
                </div>
              </div>

              {/* Mandi Trust Badges Strip */}
              <div className="grid grid-cols-3 divide-x divide-[#F0E5D0] bg-[#FDF8EE] border border-[#F0E5D0] rounded-xl py-2 mt-4 text-[10px] sm:text-[11px] font-bold text-[#6E4214]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 sm:px-2 text-center">
                  <MandiArchIcon size={14} className="text-[#B5712E] shrink-0" />
                  <span className="leading-tight">Direct Mandi</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 sm:px-2 text-center">
                  <StarIcon size={12} filled={true} className="text-[#B5712E] shrink-0" />
                  <span className="leading-tight">100% Original</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 sm:px-2 text-center">
                  <FlaskIcon size={13} className="text-[#B5712E] shrink-0" />
                  <span className="leading-tight">Lab Tested</span>
                </div>
              </div>

              {/* Select Weight Cards */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-900 mb-2">Select Weight</label>
                <div className="grid grid-cols-4 gap-2">
                  {weightOptions.map((w, idx) => {
                    const isSelected = selectedWeightIndex === idx;
                    return (
                      <button
                        key={w.weight}
                        type="button"
                        onClick={() => setSelectedWeightIndex(idx)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#FDF8EE] border-[#B5712E] ring-1 ring-[#B5712E] shadow-2xs'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xs font-black text-gray-900">{w.weight}</span>
                        <span className="text-xs font-semibold text-gray-700 mt-0.5">
                          ₹{w.price.toLocaleString('en-IN')}
                        </span>
                        {w.savePct && (
                          <span className="text-[9.5px] font-bold text-[#15803D] mt-0.5">
                            Save {w.savePct}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 sm:w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 sm:w-8 text-center font-bold text-xs text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-7 sm:w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs h-9 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    <ShoppingCartIcon size={14} className="shrink-0" />
                    <span className="truncate">{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                  </button>

                  {/* Buy Now button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#6E1A1A] hover:bg-[#581414] text-white font-bold text-xs h-9 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    <BoltIcon size={14} className="shrink-0" />
                    <span className="truncate">Buy Now</span>
                  </button>
                </div>

                {/* Add to Wishlist full-width button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <HeartIcon
                    size={14}
                    filled={isWishlisted}
                    className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                  />
                  <span>{isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky / Scrollable Tabs Bar matching the mockup ── */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center gap-1 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'details', label: 'Product Details', target: 'description-section' },
            { id: 'benefits', label: 'Benefits', target: 'benefits-section' },
            { id: 'nutrition', label: 'Nutrition', target: 'nutrition-section' },
            { id: 'storage', label: 'Storage', target: 'info-cards-section' },
            { id: 'shipping', label: 'Shipping', target: 'info-cards-section' },
            { id: 'returns', label: 'Returns', target: 'info-cards-section' },
            { id: 'reviews', label: 'Reviews (320)', target: 'reviews-section' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id as typeof activeTab, tab.target)}
                className={`text-xs py-2 px-4 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#8E4A18] text-white shadow-2xs'
                    : 'text-gray-700 hover:text-[#8E4A18] hover:bg-[#FAF8F5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3-Column Content Section: Description, Key Benefits, Nutrition Table ── */}
      <div id="description-section" className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Product Description */}
          <div>
            <h2 className="font-serif font-black text-base text-[#1B1F2A] mb-3">
              Product Description
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our Kashmiri Mamra almonds are sourced directly from the lush valleys of Kashmir, known
              for producing the finest quality almonds in India. Mamra almonds are premium grade
              almonds with a distinct long shape, rich taste, natural sweetness and high oil content.
              These almonds are carefully hand-picked, cleaned and packed to ensure you get the best
              quality and freshness.
            </p>

            {/* Trust Pill Strip */}
            <div className="mt-5 bg-[#FAF6EE] border border-[#EFE4D2] rounded-xl p-3 text-[11px] text-[#6E4214] font-semibold flex items-center justify-between">
              <span>🍂 100% Pure &amp; Natural</span>
              <span className="text-gray-300">|</span>
              <span>No Added Preservatives</span>
              <span className="text-gray-300">|</span>
              <span>Hand Picked</span>
            </div>
          </div>

          {/* Column 2: Key Benefits */}
          <div id="benefits-section">
            <h2 className="font-serif font-black text-base text-[#1B1F2A] mb-3">Key Benefits</h2>
            <div className="space-y-3">
              {[
                {
                  icon: <HeartIcon size={14} className="text-[#B5712E]" />,
                  title: 'Rich in healthy fats, protein and fibre',
                },
                {
                  icon: <HeartPulseIcon size={14} className="text-[#B5712E]" />,
                  title: 'Supports heart health',
                },
                {
                  icon: <BrainIcon size={14} className="text-[#B5712E]" />,
                  title: 'Good for brain function and memory',
                },
                {
                  icon: <ScaleIcon size={14} className="text-[#B5712E]" />,
                  title: 'Helps in weight management',
                },
                {
                  icon: <SparklesIcon size={14} className="text-[#B5712E]" />,
                  title: 'Rich in Vitamin E and antioxidants',
                },
                {
                  icon: <CrownIcon size={14} className="text-[#B5712E]" />,
                  title: 'Improves skin and hair health',
                },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-[#FDF8EE] border border-[#F0E5D0] flex items-center justify-center flex-shrink-0">
                    {b.icon}
                  </div>
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Nutrition Information (Per 100g) */}
          <div id="nutrition-section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-black text-base text-[#1B1F2A]">
                Nutrition Information
              </h2>
              <span className="text-[11px] text-gray-500 font-medium">(Per 100g)</span>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs text-xs">
              <table className="w-full text-left">
                <tbody>
                  {[
                    { label: 'Energy', val: '579 kcal' },
                    { label: 'Protein', val: '21.2 g' },
                    { label: 'Total Fat', val: '49.9 g' },
                    { label: 'Carbohydrates', val: '21.6 g' },
                    { label: 'Fibre', val: '12.5 g' },
                    { label: 'Vitamin E', val: '25.6 mg' },
                    { label: 'Calcium', val: '269 mg' },
                    { label: 'Iron', val: '3.7 mg' },
                    { label: 'Magnesium', val: '270 mg' },
                  ].map((row, idx) => (
                    <tr
                      key={row.label}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5] border-t border-gray-100'}
                    >
                      <td className="py-1.5 px-3 text-gray-600 font-medium">{row.label}</td>
                      <td className="py-1.5 px-3 text-right text-gray-900 font-bold">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 Info Cards Grid: Storage, Shipping, Returns ── */}
      <div id="info-cards-section" className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Storage Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#B5712E] flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🫙</span>
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">
                Storage Information
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Store in a cool, dry place in an airtight container. Keep away from direct sunlight
                and moisture to maintain freshness.
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#B5712E] flex items-center justify-center flex-shrink-0">
              <DeliveryTruckIcon size={20} className="text-[#B5712E]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">
                Shipping Information
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We deliver across India. Orders are processed within 24 hours and delivered in 2–5
                business days depending on your location.
              </p>
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#B5712E] flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">Return Policy</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Not satisfied? We offer easy returns within 7 days of delivery for unopened and
                unused products. T&amp;C apply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews Section ── */}
      <div id="reviews-section" className="max-w-7xl mx-auto px-4 mt-12 pt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-serif font-black text-lg text-[#1B1F2A]">Customer Reviews</h2>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-[#E5A93C] gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={13} filled={true} className="text-[#E5A93C]" />
                ))}
              </div>
              <span className="font-bold text-gray-800">4.8 out of 5</span>
              <span className="text-gray-400">(320 reviews)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-2xs cursor-pointer self-start sm:self-auto transition-colors"
          >
            <EditIcon size={14} className="text-gray-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {/* Review 1 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#4F6B7E] text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Ravi Sharma</h4>
                    <span className="text-[10px] text-gray-400">5 days ago</span>
                    <div className="flex items-center text-[#E5A93C] gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-600">⋮</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
                Excellent quality almonds! Very fresh and crunchy. The authentic Kashmiri taste is
                unmatched. Been ordering for 6 months now.
              </p>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5D737E] text-white flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Priya Mehta</h4>
                    <span className="text-[10px] text-gray-400">2 weeks ago</span>
                    <div className="flex items-center text-[#E5A93C] gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-600">⋮</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
                Best Mamra almonds I have tried. Good packaging and timely delivery. Highly
                recommended!
              </p>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#64748B] text-white flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Amit Gupta</h4>
                    <span className="text-[10px] text-gray-400">1 month ago</span>
                    <div className="flex items-center text-[#E5A93C] gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-600">⋮</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
                Premium quality and genuine product. You can clearly see the difference in taste and
                size. Will order again.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom 2-Column Section: Frequently Bought Together & Related Products ── */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Frequently Bought Together (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
            <h2 className="font-serif font-black text-base text-[#1B1F2A]">
              Frequently Bought Together
            </h2>
            <p className="text-xs text-gray-500 mb-4">Complete your dry fruit collection</p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* 3 Bundle Product Thumbnails with + signs */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none justify-center sm:justify-start">
                {/* Item 1: Mamra Almonds */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundleAlmonds}
                      onChange={(e) => setBundleAlmonds(e.target.checked)}
                      className="absolute top-1 left-1 z-10 w-3.5 h-3.5 accent-[#8E4A18] cursor-pointer"
                    />
                    <Image
                      src="/product-almonds.jpg"
                      alt="Mamra Almonds"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 line-clamp-1 mt-1">
                    Kashmiri Mamra Almonds (500g)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-black text-gray-900">₹550</span>
                    <span className="text-[9px] text-gray-400 line-through">₹700</span>
                  </div>
                </div>

                <span className="text-lg font-bold text-gray-400">+</span>

                {/* Item 2: Cashews */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundleCashews}
                      onChange={(e) => setBundleCashews(e.target.checked)}
                      className="absolute top-1 left-1 z-10 w-3.5 h-3.5 accent-[#8E4A18] cursor-pointer"
                    />
                    <Image
                      src="/product-cashews.jpg"
                      alt="Premium Cashews"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 line-clamp-1 mt-1">
                    Premium Cashews (500g)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-black text-gray-900">₹780</span>
                    <span className="text-[9px] text-gray-400 line-through">₹980</span>
                  </div>
                </div>

                <span className="text-lg font-bold text-gray-400">+</span>

                {/* Item 3: Pistachios */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundlePistachios}
                      onChange={(e) => setBundlePistachios(e.target.checked)}
                      className="absolute top-1 left-1 z-10 w-3.5 h-3.5 accent-[#8E4A18] cursor-pointer"
                    />
                    <Image
                      src="/product-pistachios.jpg"
                      alt="Iranian Pistachios"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 line-clamp-1 mt-1">
                    Iranian Pistachios (500g)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-black text-gray-900">₹1,550</span>
                    <span className="text-[9px] text-gray-400 line-through">₹1,900</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col items-center sm:items-end justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5">
                <div className="text-center sm:text-right">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-gray-500 font-medium">Total Price:</span>
                    <span className="font-serif font-black text-base text-[#1B1F2A]">
                      ₹{bundleTotal.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{bundleTotal.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#15803D] block mt-0.5">
                    Save ₹{bundleTotal.savings.toLocaleString('en-IN')} ({bundleTotal.savePct}%)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  disabled={bundleTotal.total === 0}
                  className="mt-3 bg-[#8E4A18] hover:bg-[#783D12] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ShoppingCartIcon size={14} />
                  <span>{bundleAdded ? 'Added All to Cart!' : 'Add All to Cart'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Related Products (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-black text-base text-[#1B1F2A]">Related Products</h2>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#8E4A18] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRightIcon size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Product 1: Walnuts */}
              <Link
                href="/products/california-walnuts"
                className="group flex flex-col text-center p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-100 mb-1.5">
                  <Image
                    src="/product-walnuts.jpg"
                    alt="California Walnuts"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#B5712E]">
                  California Walnuts
                </h4>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black text-gray-900">₹900</span>
                  <span className="text-[10px] text-gray-400 line-through">₹1,100</span>
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[#E5A93C] text-[10px] mt-0.5">
                  <StarIcon size={10} filled={true} className="text-[#E5A93C]" />
                  <span className="font-bold text-gray-700">4.8</span>
                  <span className="text-gray-400">(150)</span>
                </div>
              </Link>

              {/* Product 2: Raisins */}
              <Link
                href="/products/premium-raisins-kishmish"
                className="group flex flex-col text-center p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-100 mb-1.5">
                  <Image
                    src="/product-raisins.jpg"
                    alt="Premium Raisins"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#B5712E]">
                  Premium Raisins
                </h4>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black text-gray-900">₹400</span>
                  <span className="text-[10px] text-gray-400 line-through">₹600</span>
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[#E5A93C] text-[10px] mt-0.5">
                  <StarIcon size={10} filled={true} className="text-[#E5A93C]" />
                  <span className="font-bold text-gray-700">4.5</span>
                  <span className="text-gray-400">(180)</span>
                </div>
              </Link>

              {/* Product 3: Dates */}
              <Link
                href="/products/ajwa-premium-dates"
                className="group flex flex-col text-center p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-100 mb-1.5">
                  <Image
                    src="/product-dates.jpg"
                    alt="Ajwa Dates"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#B5712E]">
                  Ajwa Dates
                </h4>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black text-gray-900">₹850</span>
                  <span className="text-[10px] text-gray-400 line-through">₹1,000</span>
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[#E5A93C] text-[10px] mt-0.5">
                  <StarIcon size={10} filled={true} className="text-[#E5A93C]" />
                  <span className="font-bold text-gray-700">4.7</span>
                  <span className="text-gray-400">(120)</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Zoom Modal Overlay ── */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>
            <div className="relative aspect-square sm:aspect-[4/3] w-full">
              <Image
                src={activeImage.url}
                alt={activeImage.altText}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Write Review Modal Overlay ── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-6">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <span className="text-3xl">🎉</span>
                <h3 className="font-bold text-base text-gray-900 mt-2">Thank you for your review!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your feedback helps other customers make confident choices.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setReviewSubmitted(false);
                  }}
                  className="mt-4 px-5 py-2 bg-[#8E4A18] text-white text-xs font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif font-black text-lg text-gray-900 mb-1">
                  Write a Customer Review
                </h3>
                <p className="text-xs text-gray-500 mb-4">{product.name}</p>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                    <div className="flex items-center gap-1 text-[#E5A93C]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewScore(star)}
                          className="cursor-pointer hover:scale-110 transition-transform"
                        >
                          <StarIcon size={20} filled={star <= reviewScore} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#B5712E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with taste, quality, packaging..."
                      className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#B5712E]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (reviewName && reviewComment) {
                        setReviewSubmitted(true);
                      }
                    }}
                    className="w-full bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
