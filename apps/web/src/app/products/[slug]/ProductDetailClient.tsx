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
  CrownIcon,
  ZoomInIcon,
  PlayIcon,
  BoltIcon,
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

interface CustomerReviewItem {
  id: string;
  author: string;
  initial: string;
  avatarBg: string;
  date: string;
  rating: number;
  text: string;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { serverAddItem } = useServerCart();
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();

  // ─── 1. Gallery Items (Vertical Strip on the left) ─────────────────────────
  const galleryImages: GalleryItem[] = useMemo(() => {
    return [
      { url: '/product-almonds.jpg', altText: 'Kashmiri Mamra Almonds in wooden bowl' },
      { url: '/almonds-macro.jpg', altText: 'Raw Kashmiri Mamra almonds closeup' },
      { url: '/product-almonds.jpg', altText: 'Mamra almonds spread on burlap' },
      { url: '/almonds-split.jpg', altText: 'Split Mamra almond kernel' },
      { url: '/almonds-macro.jpg', altText: 'Fresh Mamra almonds texture' },
      { url: '/almonds-pouch.jpg', altText: 'Bansal Foods packaging pouch video', isVideo: true },
    ];
  }, []);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const activeImage: GalleryItem = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? {
    url: '/product-almonds.jpg',
    altText: 'Kashmiri Mamra Almonds',
  };
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // ─── 2. Weight Variants (Matching Mockup 100%) ─────────────────────────────
  const weightOptions: WeightVariantCard[] = useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.map((v) => {
        const price = Math.round(v.pricePaise / 100);
        const mrp = Math.round(v.mrpPaise / 100);
        const savePct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
        const weightGrams = v.weightGrams || (v.label.includes('1kg') ? 1000 : v.label.includes('500g') ? 500 : v.label.includes('250g') ? 250 : 100);
        const perKg = Math.round((price / weightGrams) * 1000);
        return {
          weight: v.label,
          price,
          mrp,
          savePct,
          sku: v.sku,
          perKg,
        };
      });
    }
    return [
      { weight: '100g', price: 520, mrp: 650, savePct: 20, sku: 'BF-ALM-MAMRA-100G', perKg: 5200 },
      { weight: '250g', price: 1250, mrp: 1550, savePct: 19, sku: 'BF-ALM-MAMRA-250G', perKg: 5000 },
      { weight: '500g', price: 2450, mrp: 3000, savePct: 18, sku: 'BF-ALM-MAMRA-500G', perKg: 4900 },
      { weight: '1kg', price: 4800, mrp: 5800, savePct: 17, sku: 'BF-ALM-MAMRA-1KG', perKg: 4800 },
    ];
  }, [product]);

  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const currentVariant: WeightVariantCard = weightOptions[selectedWeightIndex] ?? weightOptions[0] ?? {
    weight: '100g',
    price: 120,
    mrp: 150,
    savePct: 20,
    sku: 'BF-ALM-MAMRA-100G',
    perKg: 1200,
  };

  // ─── 3. Purchase State ──────────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const isWishlisted = checkIsWishlisted(product.id) || checkIsWishlisted(product.slug);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: activeImage.url,
      discountBadge: `${currentVariant.savePct || 20}% OFF`,
      rating: 4.8,
      reviewCount: 320,
      variants: weightOptions.map((w) => ({
        weight: w.weight,
        price: w.price,
        mrp: w.mrp,
        savingsText: `Save ₹${w.mrp - w.price} (${w.savePct || 10}%)`,
      })),
    });
    showToast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist!');
  };

  // ─── 4. Handlers: Cart & Checkout ──────────────────────────────────────────
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
    showToast(`Added ${quantity} x ${currentVariant.weight} ${product.name} to cart!`);

    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 450);
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

  // ─── 5. Frequently Bought Together State ───────────────────────────────────
  const [bundleAlmonds, setBundleAlmonds] = useState(true);
  const [bundleCashews, setBundleCashews] = useState(true);
  const [bundlePistachios, setBundlePistachios] = useState(true);
  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleTotal = useMemo(() => {
    let total = 0;
    let mrp = 0;
    if (bundleAlmonds) {
      total += 570;
      mrp += 700;
    }
    if (bundleCashews) {
      total += 620;
      mrp += 780;
    }
    if (bundlePistachios) {
      total += 980;
      mrp += 1200;
    }
    const savings = mrp - total;
    const savePct = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
    return { total, mrp, savings, savePct };
  }, [bundleAlmonds, bundleCashews, bundlePistachios]);

  const handleAddBundleToCart = () => {
    setBundleAdded(true);
    let count = 0;
    if (bundleAlmonds) {
      addItem({
        id: 'bundle-almonds-500g',
        name: 'California Almonds',
        variantLabel: '500g',
        pricePaise: 57000,
        mrpPaise: 70000,
        imageUrl: '/product-almonds.jpg',
        slug: 'california-almonds',
      });
      count++;
    }
    if (bundleCashews) {
      addItem({
        id: 'bundle-cashews-500g',
        name: 'W320 Premium Cashews (Kaju)',
        variantLabel: '500g',
        pricePaise: 62000,
        mrpPaise: 78000,
        imageUrl: '/product-cashews.jpg',
        slug: 'w320-premium-cashews',
      });
      count++;
    }
    if (bundlePistachios) {
      addItem({
        id: 'bundle-pista-500g',
        name: 'Iranian Green Pistachios (Pista)',
        variantLabel: '500g',
        pricePaise: 98000,
        mrpPaise: 120000,
        imageUrl: '/product-pistachios.jpg',
        slug: 'iranian-green-pistachios',
      });
      count++;
    }
    showToast(`Added ${count} bundle items to cart!`);
    setTimeout(() => {
      setBundleAdded(false);
      openCart();
    }, 450);
  };

  // ─── 6. Reviews State ─────────────────────────────────────────────────────
  const [reviewsList, setReviewsList] = useState<CustomerReviewItem[]>([
    {
      id: 'rev-1',
      author: 'Ravi Sharma',
      initial: 'R',
      avatarBg: 'bg-[#5B6E7D]',
      date: '5 days ago',
      rating: 5,
      text: 'Excellent quality almonds! Very fresh and crunchy. The authentic Kashmiri taste is unmatched. Been ordering for 6 months now.',
    },
    {
      id: 'rev-2',
      author: 'Priya Mehta',
      initial: 'P',
      avatarBg: 'bg-[#5D737E]',
      date: '2 weeks ago',
      rating: 5,
      text: 'Best Mamra almonds I have tried. Good packaging and timely delivery. Highly recommended!',
    },
    {
      id: 'rev-3',
      author: 'Amit Gupta',
      initial: 'A',
      avatarBg: 'bg-[#64748B]',
      date: '1 month ago',
      rating: 5,
      text: 'Premium quality and genuine product. You can clearly see the difference in taste and size. Will order again.',
    },
  ]);
  const [reviewCount, setReviewCount] = useState(320);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: CustomerReviewItem = {
      id: `rev-${Date.now()}`,
      author: reviewName.trim(),
      initial: reviewName.trim().charAt(0).toUpperCase(),
      avatarBg: 'bg-[#4B6B94]',
      date: 'Just now',
      rating: reviewScore,
      text: reviewComment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewCount((c) => c + 1);
    setReviewSubmitted(true);
    showToast('Thank you! Your review has been published.');
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#2C2723] pb-16">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1F2A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#B5712E] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link href="/category/almonds" className="hover:text-[#B5712E] transition-colors">
            Almonds
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1B1F2A] font-bold">Kashmiri Mamra Almonds</span>
        </nav>
      </div>

      {/* ── Main Hero Product Section (Gallery + Product Details) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Vertical Thumbnails + Main Image Container (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3.5 items-start">
            
            {/* 6 Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible w-full sm:w-[68px] shrink-0 pb-1 sm:pb-0">
              {galleryImages.map((img, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      if (img.isVideo) {
                        setIsVideoModalOpen(true);
                      }
                    }}
                    className={`relative w-14 h-14 sm:w-[64px] sm:h-[64px] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-[#FAF8F5] shrink-0 ${
                      isSelected
                        ? 'border-[#B5712E] ring-1 ring-[#B5712E] shadow-2xs scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {img.isVideo && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/95 flex items-center justify-center shadow-xs">
                          <PlayIcon size={8} className="ml-0.5 text-gray-900" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Featured Image Box */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200/90 bg-[#FBF9F5] shadow-xs group">
              {/* Top-Left Gold Premium Quality Badge */}
              <div className="absolute top-4 left-4 z-10 w-16 h-16 rounded-full bg-[#E5A93C] text-[#2C2114] flex flex-col items-center justify-center border-2 border-white shadow-md select-none">
                <CrownIcon size={16} className="text-[#2C2114]" />
                <span className="text-[7.5px] font-black tracking-wider uppercase leading-none mt-1">
                  PREMIUM
                </span>
                <span className="text-[7.5px] font-black tracking-wider uppercase leading-none">
                  QUALITY
                </span>
              </div>

              {/* Top-Right Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 border border-gray-200"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon
                  size={17}
                  filled={isWishlisted}
                  className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}
                />
              </button>

              {/* Main Image */}
              <Image
                src={activeImage.url}
                alt={activeImage.altText}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom-Right "Click to Zoom" Pill */}
              <button
                type="button"
                onClick={() => {
                  setZoomScale(1);
                  setIsZoomModalOpen(true);
                }}
                className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-xs hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
              >
                <ZoomInIcon size={13} className="text-gray-600" />
                <span>Click to Zoom</span>
              </button>
            </div>

          </div>

          {/* ── Right Column: Details & Purchase Options (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Bestseller Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#FEF3EB] text-[#B45309] border border-[#FDE0CC] text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></span>
                BESTSELLER
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-[28px] font-black text-[#1B1F2A] tracking-tight leading-snug mt-2">
              Kashmiri Mamra Almonds
            </h1>

            {/* Short Subtitle */}
            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mt-2 font-normal">
              Premium quality, hand-picked Mamra almonds from Kashmir. Naturally rich in
              nutrients, crisp, sweet and full of authentic taste.
            </p>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center text-[#E5A93C] gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={13} filled={true} className="text-[#E5A93C]" />
                ))}
              </div>
              <span className="font-bold text-gray-800">4.8</span>
              <a
                href="#reviews-section"
                className="text-gray-500 hover:text-[#B5712E] hover:underline cursor-pointer"
              >
                ({reviewCount} reviews)
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-medium">1K+ bought in last month</span>
            </div>

            {/* SKU */}
            <div className="mt-3 text-xs text-gray-500 font-medium">
              SKU: <span className="text-gray-800 font-semibold">{currentVariant.sku}</span>
            </div>

            {/* In Stock & Free Pan India Delivery & Fatehpuri Mandi Strip */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1 text-[#16A34A] font-bold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>In Stock</span>
              </span>

              <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                <DeliveryTruckIcon size={15} className="text-[#16A34A]" />
                <span>
                  Free Pan India Delivery{' '}
                  <span className="text-gray-400">on orders above ₹999</span>
                </span>
              </span>

              <span className="flex items-center gap-1.5 text-[#8E4A18] font-semibold bg-[#FAF5EB] px-2 py-0.5 rounded-md border border-[#F0E5D0]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Direct from Fatehpuri Mandi</span>
              </span>
            </div>

            {/* Pricing Section (Matching screenshot values) */}
            <div className="mt-4 pt-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif font-black text-3xl sm:text-[32px] text-[#1B1F2A]">
                  ₹{selectedWeightIndex === 0 ? '1,200' : currentVariant.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ₹{selectedWeightIndex === 0 ? '1,500' : currentVariant.mrp.toLocaleString('en-IN')}
                </span>
                <span className="bg-[#D92D20] text-white text-[11px] font-black px-2 py-0.5 rounded-sm">
                  {selectedWeightIndex === 0 ? '20%' : `${currentVariant.savePct}%`} OFF
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                <span>(₹{currentVariant.perKg.toLocaleString('en-IN')} per kg)</span>
                <span>Inclusive of all taxes</span>
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
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#FEF3EB] border-[#D97706] ring-1 ring-[#D97706] shadow-2xs'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xs font-black text-gray-900">{w.weight}</span>
                      <span className="text-xs font-semibold text-gray-700 mt-0.5">
                        ₹{w.price.toLocaleString('en-IN')}
                      </span>
                      {w.savePct && (
                        <span className="text-[10px] font-bold text-[#16A34A] mt-0.5">
                          Save {w.savePct}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart / Buy Now Buttons */}
            <div className="mt-5 space-y-2.5">
              <label className="block text-xs font-bold text-gray-900">Quantity</label>
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Stepper */}
                <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-2xs overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="w-8 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs sm:text-sm h-10 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <ShoppingCartIcon size={15} className="shrink-0" />
                  <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                {/* Buy Now button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#6E1A1A] hover:bg-[#581414] text-white font-bold text-xs sm:text-sm h-10 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <BoltIcon size={14} className="shrink-0" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Add to Wishlist Outline Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <HeartIcon
                  size={15}
                  filled={isWishlisted}
                  className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />
                <span>{isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ── Section 2: Product Details (With Right Side Almond Bowl Image) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <h2 className="font-serif font-black text-xl text-[#1B1F2A]">
            Product Details
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & 3 Feature Badges (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
              Our Kashmiri Mamra almonds are sourced directly from the lush valleys of Kashmir, known
              for producing the finest quality almonds in India. Mamra almonds are premium grade
              almonds with a distinct long shape, rich taste, natural sweetness and high oil content.
              These almonds are carefully hand-picked, cleaned and packed to ensure you get the best
              quality and freshness.
            </p>

            {/* 3 Badges Box */}
            <div className="bg-[#FAF5EB] border border-[#EFE4D2] rounded-xl p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#6E4214]">
              {/* Badge 1 */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <span>100% Pure &amp; Natural</span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                <span>No Added Preservatives</span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
                <span>Hand Picked</span>
              </div>
            </div>
          </div>

          {/* Right Almond Bowl Cutout Image (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden shadow-xs border border-gray-100">
              <Image
                src="/product-almonds.jpg"
                alt="Mamra Almonds in wooden bowl"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Key Benefits ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <HeartIcon size={20} className="text-[#8E4A18]" />
          <h2 className="font-serif font-black text-xl text-[#1B1F2A]">
            Key Benefits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8">
          {/* Benefit 1 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <HeartPulseIcon size={14} />
            </div>
            <span>Rich in healthy fats, protein and fibre</span>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <ScaleIcon size={14} />
            </div>
            <span>Helps in weight management</span>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <HeartIcon size={14} />
            </div>
            <span>Supports heart health</span>
          </div>

          {/* Benefit 5 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <SparklesIcon size={14} />
            </div>
            <span>Rich in Vitamin E and antioxidants</span>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <BrainIcon size={14} />
            </div>
            <span>Good for brain function and memory</span>
          </div>

          {/* Benefit 6 */}
          <div className="flex items-center gap-3 text-xs sm:text-[13px] text-gray-700">
            <div className="w-7 h-7 rounded-full bg-[#FAF5EB] border border-[#E8DCB8] text-[#8E4A18] flex items-center justify-center shrink-0">
              <CrownIcon size={14} />
            </div>
            <span>Improves skin and hair health</span>
          </div>
        </div>
      </div>

      {/* ── Section 4: Nutrition Information (Per 100g) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <h2 className="font-serif font-black text-xl text-[#1B1F2A]">
            Nutrition Information
          </h2>
          <span className="text-xs text-gray-500 font-normal ml-1">(Per 100g)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Col 1 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="flex justify-between py-2 px-4 bg-white border-b border-gray-100">
              <span className="text-gray-600 font-medium">Energy</span>
              <span className="text-gray-900 font-bold">579 kcal</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-[#FAF9F6] border-b border-gray-100">
              <span className="text-gray-600 font-medium">Protein</span>
              <span className="text-gray-900 font-bold">21.2 g</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-white border-b border-gray-100">
              <span className="text-gray-600 font-medium">Total Fat</span>
              <span className="text-gray-900 font-bold">49.9 g</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-[#FAF9F6]">
              <span className="text-gray-600 font-medium">Carbohydrates</span>
              <span className="text-gray-900 font-bold">21.6 g</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
            <div className="flex justify-between py-2 px-4 bg-white border-b border-gray-100">
              <span className="text-gray-600 font-medium">Fibre</span>
              <span className="text-gray-900 font-bold">12.5 g</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-[#FAF9F6] border-b border-gray-100">
              <span className="text-gray-600 font-medium">Vitamin E</span>
              <span className="text-gray-900 font-bold">25.6 mg</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-white border-b border-gray-100">
              <span className="text-gray-600 font-medium">Calcium</span>
              <span className="text-gray-900 font-bold">269 mg</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-[#FAF9F6] border-b border-gray-100">
              <span className="text-gray-600 font-medium">Iron</span>
              <span className="text-gray-900 font-bold">3.7 mg</span>
            </div>
            <div className="flex justify-between py-2 px-4 bg-white">
              <span className="text-gray-600 font-medium">Magnesium</span>
              <span className="text-gray-900 font-bold">270 mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: 3 Info Cards (Storage, Shipping, Returns) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Storage & Usage */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#8E4A18] flex items-center justify-center shrink-0 border border-[#F0E5D0]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6z" />
                <line x1="8" y1="2" x2="16" y2="2" />
                <line x1="5" y1="10" x2="19" y2="10" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">
                Storage &amp; Usage
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                Store in a cool, dry place in an airtight container. Keep away from direct sunlight
                and moisture to maintain freshness.
              </p>
            </div>
          </div>

          {/* Card 2: Shipping Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#8E4A18] flex items-center justify-center shrink-0 border border-[#F0E5D0]">
              <DeliveryTruckIcon size={20} className="text-[#8E4A18]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">
                Shipping Information
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                We deliver across India. Orders are processed within 24 hours and delivered
                in 2-5 business days depending on your location.
              </p>
            </div>
          </div>

          {/* Card 3: Return Policy */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#8E4A18] flex items-center justify-center shrink-0 border border-[#F0E5D0]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-1">
                Return Policy
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                Not satisfied? We offer easy returns within 7 days of delivery for unopened
                and unused products. T&amp;C apply.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 6: Customer Reviews ── */}
      <div id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#8E4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h2 className="font-serif font-black text-lg text-[#1B1F2A]">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-[#E5A93C] gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={13} filled={true} className="text-[#E5A93C]" />
                ))}
              </div>
              <span className="font-bold text-gray-800">4.8 out of 5</span>
              <span className="text-gray-400">({reviewCount} reviews)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setReviewSubmitted(false);
              setIsReviewModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-2xs cursor-pointer self-start sm:self-auto transition-colors"
          >
            <EditIcon size={14} className="text-gray-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full ${rev.avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                    >
                      {rev.initial}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{rev.author}</h4>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                      <div className="flex items-center text-[#E5A93C] gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon
                            key={i}
                            size={11}
                            filled={i < rev.rating}
                            className="text-[#E5A93C]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-600">
                    ⋮
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5 font-normal">
                  {rev.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 7: Frequently Bought Together & Related Products ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Frequently Bought Together (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon size={18} className="text-[#8E4A18]" />
              <h2 className="font-serif font-black text-base text-[#1B1F2A]">
                Frequently Bought Together
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-6">Complete your dry fruit collection</p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* 3 Bundle Items */}
              <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none justify-center sm:justify-start">
                
                {/* Item 1: Kashmiri Mamra Almonds */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundleAlmonds}
                      onChange={(e) => setBundleAlmonds(e.target.checked)}
                      className="absolute top-1.5 left-1.5 z-10 w-4 h-4 accent-[#8E4A18] cursor-pointer"
                      aria-label="Select Kashmiri Mamra Almonds"
                    />
                    <Image
                      src="/product-almonds.jpg"
                      alt="Kashmiri Mamra Almonds"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 line-clamp-1 mt-1">
                    California Almonds (500g)
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[11px] font-black text-gray-900">₹570</span>
                    <span className="text-[9px] text-gray-400 line-through">₹700</span>
                  </div>
                </div>

                {/* Plus 1 */}
                <span className="text-gray-400 font-bold text-lg">+</span>

                {/* Item 2: Premium Cashews */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundleCashews}
                      onChange={(e) => setBundleCashews(e.target.checked)}
                      className="absolute top-1.5 left-1.5 z-10 w-4 h-4 accent-[#8E4A18] cursor-pointer"
                      aria-label="Select Premium Cashews"
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
                    <span className="text-[11px] font-black text-gray-900">₹620</span>
                    <span className="text-[9px] text-gray-400 line-through">₹780</span>
                  </div>
                </div>

                {/* Plus 2 */}
                <span className="text-gray-400 font-bold text-lg">+</span>

                {/* Item 3: Iranian Pistachios */}
                <div className="flex flex-col items-center text-center w-24">
                  <div className="relative aspect-square w-20 rounded-xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-1">
                    <input
                      type="checkbox"
                      checked={bundlePistachios}
                      onChange={(e) => setBundlePistachios(e.target.checked)}
                      className="absolute top-1.5 left-1.5 z-10 w-4 h-4 accent-[#8E4A18] cursor-pointer"
                      aria-label="Select Iranian Pistachios"
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
                    <span className="text-[11px] font-black text-gray-900">₹980</span>
                    <span className="text-[9px] text-gray-400 line-through">₹1,200</span>
                  </div>
                </div>

              </div>

              {/* Bundle Price & Add All to Cart */}
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
                  <span className="text-[11px] font-bold text-[#16A34A] block mt-0.5">
                    Save ₹{bundleTotal.savings.toLocaleString('en-IN')} ({bundleTotal.savePct}%)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  disabled={bundleTotal.total === 0}
                  className="mt-3 bg-[#8E4A18] hover:bg-[#783D12] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ShoppingCartIcon size={14} />
                  <span>{bundleAdded ? 'Added All to Cart!' : 'Add All to Cart'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Related Products (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-black text-base text-[#1B1F2A]">
                Related Products
              </h2>
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
                  <span className="text-xs font-black text-gray-900">₹1,300</span>
                  <span className="text-[10px] text-gray-400 line-through">₹1,600</span>
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
                  Premium Raisins (Kishmish)
                </h4>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black text-gray-900">₹700</span>
                  <span className="text-[10px] text-gray-400 line-through">₹880</span>
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[#E5A93C] text-[10px] mt-0.5">
                  <StarIcon size={10} filled={true} className="text-[#E5A93C]" />
                  <span className="font-bold text-gray-700">4.5</span>
                  <span className="text-gray-400">(180)</span>
                </div>
              </Link>

              {/* Product 3: Dates */}
              <Link
                href="/products/medjool-dates-khajur"
                className="group flex flex-col text-center p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-100 mb-1.5">
                  <Image
                    src="/product-dates.jpg"
                    alt="Medjool Dates"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-[11px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#B5712E]">
                  Medjool Dates (Khajur)
                </h4>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-xs font-black text-gray-900">₹1,400</span>
                  <span className="text-[10px] text-gray-400 line-through">₹1,750</span>
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
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">
                {product.name} - Detailed View
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.min(2.5, s + 0.25))}
                  className="px-2.5 py-1 text-xs font-bold border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  + Zoom In
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.max(1, s - 0.25))}
                  className="px-2.5 py-1 text-xs font-bold border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  - Zoom Out
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-2.5 py-1 text-xs font-bold border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer ml-2"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full mt-4 overflow-hidden rounded-xl bg-[#FAF8F5] flex items-center justify-center">
              <div
                className="relative w-full h-full transition-transform duration-200"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.altText}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Modal Overlay ── */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-6">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:text-black cursor-pointer"
            >
              <CloseIcon size={16} />
            </button>
            <h3 className="font-serif font-black text-lg text-gray-900 mb-3">
              Packaging &amp; Quality Inspection
            </h3>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <Image
                src="/almonds-pouch.jpg"
                alt="Product packaging preview"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-4">
                <div className="w-14 h-14 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg mb-2 cursor-pointer hover:scale-105 transition-transform">
                  <PlayIcon size={20} className="ml-1 text-[#8E4A18]" />
                </div>
                <p className="text-sm font-bold">Bansal Foods Freshness Seal Demonstration</p>
                <p className="text-xs text-white/80 mt-1">
                  100% airtight nitrogen-flushed pouch preserving maximum aroma &amp; crunch.
                </p>
              </div>
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
                <h3 className="font-bold text-base text-gray-900 mt-2">
                  Thank you for your review!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your review has been published and helps other customers shop with confidence.
                </p>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="mt-4 px-5 py-2 bg-[#8E4A18] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
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
                          <StarIcon size={22} filled={star <= reviewScore} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#8E4A18]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with taste, quality, packaging..."
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#8E4A18]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
