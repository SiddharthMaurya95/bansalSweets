'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

// ── Golden Line-Art Heart & Floating Nuts Empty State Illustration ──
function WishlistEmptyIllustration() {
  return (
    <div className="relative w-64 h-40 sm:w-80 sm:h-48 mx-auto my-2 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="heartGold" x1="120" y1="50" x2="200" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E2BD78" />
            <stop offset="0.5" stopColor="#C88C3C" />
            <stop offset="1" stopColor="#A66C22" />
          </linearGradient>

          <linearGradient id="almondGrad" x1="30" y1="60" x2="90" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B36531" />
            <stop offset="0.5" stopColor="#8C4116" />
            <stop offset="1" stopColor="#5E270A" />
          </linearGradient>

          <linearGradient id="cashewGrad" x1="220" y1="60" x2="270" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFDF7" />
            <stop offset="0.4" stopColor="#F5E8D0" />
            <stop offset="1" stopColor="#DECAA3" />
          </linearGradient>

          <linearGradient id="pistachioGrad" x1="220" y1="130" x2="270" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8DAF46" />
            <stop offset="0.6" stopColor="#6C8C30" />
            <stop offset="1" stopColor="#4A661D" />
          </linearGradient>

          <linearGradient id="shellGrad" x1="210" y1="120" x2="260" y2="160" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F1E3CD" />
            <stop offset="1" stopColor="#CEB795" />
          </linearGradient>
        </defs>

        {/* ── Central Golden Outline Heart ── */}
        <path
          d="M160 148 C 120 110, 100 85, 100 68 C 100 50, 115 40, 134 40 C 147 40, 155 48, 160 56 C 165 48, 173 40, 186 40 C 205 40, 220 50, 220 68 C 220 85, 200 110, 160 148 Z"
          stroke="url(#heartGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FFFDF7"
          fillOpacity="0.4"
        />

        {/* ── Floating Almond Nut (Left) ── */}
        <g transform="translate(45, 60) rotate(-22)">
          <path
            d="M20 2 C 32 18, 38 42, 28 62 C 20 74, 5 72, -4 56 C -12 40, -4 18, 20 2 Z"
            fill="url(#almondGrad)"
          />
          {/* Almond surface texture lines */}
          <path d="M12 12 C 18 24, 22 42, 16 54" stroke="#682F0D" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M4 20 C 8 32, 10 46, 6 52" stroke="#682F0D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          <path d="M22 24 C 26 36, 26 48, 22 56" stroke="#682F0D" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* ── Second Small Almond (Far Left bottom) ── */}
        <g transform="translate(90, 125) rotate(45) scale(0.65)">
          <path
            d="M20 2 C 32 18, 38 42, 28 62 C 20 74, 5 72, -4 56 C -12 40, -4 18, 20 2 Z"
            fill="url(#almondGrad)"
            opacity="0.85"
          />
        </g>

        {/* ── Floating Cashew Nut (Top Right) ── */}
        <g transform="translate(210, 50) rotate(15)">
          <path
            d="M10 20 C 15 5, 35 5, 45 15 C 55 25, 52 45, 38 52 C 28 58, 12 55, 10 45 C 8 36, 22 36, 26 28 C 28 22, 22 18, 16 20 Z"
            fill="url(#cashewGrad)"
            stroke="#C9B189"
            strokeWidth="1"
          />
          {/* Inner contour */}
          <path d="M22 20 C 30 18, 38 24, 38 34" stroke="#D8C29D" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* ── Floating Pistachio Nut (Bottom Right) ── */}
        <g transform="translate(235, 120) rotate(-18)">
          {/* Green kernel inside */}
          <ellipse cx="20" cy="20" rx="14" ry="10" transform="rotate(30 20 20)" fill="url(#pistachioGrad)" />
          {/* Purple skin shadow */}
          <path d="M12 14 C 18 10, 24 16, 22 24 C 18 20, 14 18, 12 14 Z" fill="#7A4156" opacity="0.75" />
          {/* Left open shell */}
          <path
            d="M6 10 C 2 20, 8 32, 18 36 C 24 38, 22 32, 16 28 C 10 22, 10 16, 6 10 Z"
            fill="url(#shellGrad)"
            stroke="#BBA37E"
            strokeWidth="0.8"
          />
          {/* Right open shell */}
          <path
            d="M34 10 C 38 20, 32 32, 22 36 C 16 38, 18 32, 24 28 C 30 22, 30 16, 34 10 Z"
            fill="url(#shellGrad)"
            stroke="#BBA37E"
            strokeWidth="0.8"
          />
        </g>

        {/* ── Delicate Golden Sparkles and Twigs ── */}
        {/* Twigs / leaves around heart */}
        <path d="M125 35 C 115 25, 100 28, 95 35 C 105 38, 115 38, 125 35 Z" fill="#C88C3C" opacity="0.35" />
        <path d="M195 35 C 205 25, 220 28, 225 35 C 215 38, 205 38, 195 35 Z" fill="#C88C3C" opacity="0.35" />

        {/* Golden star sparkles */}
        <path d="M160 22 L162 27 L167 29 L162 31 L160 36 L158 31 L153 29 L158 27 Z" fill="#E2BD78" opacity="0.8" />
        <path d="M90 75 L91 78 L94 79 L91 80 L90 83 L89 80 L86 79 L89 78 Z" fill="#E2BD78" opacity="0.6" />
        <path d="M225 105 L226 108 L229 109 L226 110 L225 113 L224 110 L221 109 L224 108 Z" fill="#E2BD78" opacity="0.6" />

        {/* Floating soft gold dots */}
        <circle cx="110" cy="95" r="2" fill="#E2BD78" opacity="0.5" />
        <circle cx="210" cy="85" r="2.5" fill="#E2BD78" opacity="0.5" />
        <circle cx="160" cy="165" r="1.5" fill="#E2BD78" opacity="0.4" />
      </svg>
    </div>
  );
}

// ── Product Card Component ──
function WishlistCard({
  item,
  onRemove,
  onWeightChange,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onWeightChange: (id: string, weight: string) => void;
}) {
  const { addItem } = useCart();
  const [addedToast, setAddedToast] = useState(false);

  const fallbackVariant = {
    weight: '500g',
    price: 1000,
    mrp: 1200,
    savingsText: 'Save ₹200 (16%)',
  };

  const activeVariant =
    item.variants?.find((v) => v.weight === item.selectedWeight) ||
    item.variants?.[2] ||
    item.variants?.[0] ||
    fallbackVariant;

  const handleAddToCart = () => {
    addItem({
      id: `${item.slug}-${activeVariant.weight}`,
      name: item.name,
      variantLabel: activeVariant.weight,
      pricePaise: activeVariant.price * 100,
      mrpPaise: activeVariant.mrp * 100,
      imageUrl: item.imageUrl,
      slug: item.slug,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md transition-all duration-300 p-2.5 sm:p-4 flex flex-col justify-between relative group">
      {/* ── Top Image Container with Badges ── */}
      <div>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] mb-3">
          {/* Discount Badge (Top Left) */}
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#E53935] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs tracking-wide">
            {item.discountBadge}
          </span>

          {/* Red Wishlist Heart Button (Top Right) */}
          <button
            onClick={() => onRemove(item.id)}
            title="Remove from wishlist"
            aria-label="Remove from wishlist"
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center text-[#E53935] hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Product Image */}
          <Link href={`/products/${item.slug}`} className="block w-full h-full relative">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* ── Product Info ── */}
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-bold text-sm sm:text-[15px] text-[#1E120B] hover:text-[#8C4A18] transition-colors line-clamp-1 leading-snug">
            {item.name}
          </h3>
        </Link>

        {/* ── Star Rating ── */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-[#F5A623] text-xs">
            {'★'.repeat(5)}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {item.rating} ({item.reviewCount})
          </span>
        </div>

        {/* ── Price and MRP ── */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base sm:text-lg font-bold text-[#1E120B]">
            ₹{activeVariant.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through font-normal">
            ₹{activeVariant.mrp.toLocaleString('en-IN')}
          </span>
        </div>

        {/* ── Green Savings Text ── */}
        <p className="text-xs font-semibold text-[#2E7D32] mt-0.5">
          {activeVariant.savingsText}
        </p>

        {/* ── Weight Variant Selector Pills ── */}
        <div className="grid grid-cols-4 gap-1.5 mt-2.5">
          {item.variants.map((v) => {
            const isSelected = v.weight === item.selectedWeight;
            return (
              <button
                key={v.weight}
                type="button"
                onClick={() => onWeightChange(item.id, v.weight)}
                className={`py-1 text-[11px] rounded-md font-medium text-center transition-all ${
                  isSelected
                    ? 'bg-[#F8E7BE] text-[#5C3808] font-bold border border-[#E9C87B] shadow-2xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {v.weight}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-3.5 space-y-2">
        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2.5 px-3 bg-[#F8E7BE] hover:bg-[#F3DC9E] text-[#4E300B] font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.99] shadow-2xs"
        >
          <svg className="w-4 h-4 text-[#4E300B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>{addedToast ? 'Added to Cart ✓' : 'Add to Cart'}</span>
        </button>

        {/* Remove from Wishlist Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="w-full py-2 px-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          <span>Remove from Wishlist</span>
        </button>
      </div>
    </div>
  );
}

// ── Bottom 4 Trust Badges Strip (matching mockup exactly) ──
function WishlistTrustStrip() {
  return (
    <div className="w-full bg-[#F7EFE4] rounded-2xl py-6 px-4 sm:px-8 mt-10 border border-[#EDE0D0]/80">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* 1. 100% Original Quality */}
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-[#EFE3D3] text-[#8C4A18] flex items-center justify-center mb-2 shadow-2xs">
            <svg className="w-5 h-5 text-[#8C4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C7 2 3 7 3 12C3 16 6 19 10 19C12 19 14 18 15 16C16 18 18 19 20 19C22 19 23 18 23 16C23 11 18 2 12 2Z" />
              <path d="M12 2V16" />
            </svg>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#1E120B]">100% Original Quality</h4>
          <p className="text-[11px] text-gray-600 mt-0.5">Lab tested and authentic</p>
        </div>

        {/* 2. Secure Payments */}
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-[#EFE3D3] text-[#8C4A18] flex items-center justify-center mb-2 shadow-2xs">
            <svg className="w-5 h-5 text-[#8C4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#1E120B]">Secure Payments</h4>
          <p className="text-[11px] text-gray-600 mt-0.5">UPI, Cards &amp; COD</p>
        </div>

        {/* 3. Fast & Safe Delivery */}
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-[#EFE3D3] text-[#8C4A18] flex items-center justify-center mb-2 shadow-2xs">
            <svg className="w-5 h-5 text-[#8C4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#1E120B]">Fast &amp; Safe Delivery</h4>
          <p className="text-[11px] text-gray-600 mt-0.5">Pan India</p>
        </div>

        {/* 4. Easy Returns */}
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 rounded-full bg-[#EFE3D3] text-[#8C4A18] flex items-center justify-center mb-2 shadow-2xs">
            <svg className="w-5 h-5 text-[#8C4A18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#1E120B]">Easy Returns</h4>
          <p className="text-[11px] text-gray-600 mt-0.5">Hassle-free process</p>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, removeItem, updateItemWeight, resetDemoItems, clearWishlist } = useWishlist();
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(window.location.href).catch(() => {});
        }
      } catch {
        // ignore
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Breadcrumbs ── */}
        <nav className="text-xs text-gray-500 mb-4 sm:mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#8C4A18] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/account" className="hover:text-[#8C4A18] transition-colors">
            My Account
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800 font-semibold">My Wishlist</span>
        </nav>

        {/* ── 2. Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E120B] tracking-tight">
                My Wishlist
              </h1>
              {hasItems && (
                <span className="text-xs sm:text-sm text-gray-500 font-normal">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Your saved favorites, ready whenever you want to shop.
            </p>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasItems && (
              <>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium text-xs sm:text-sm rounded-lg shadow-2xs transition-all flex items-center gap-2 cursor-pointer hover:bg-gray-50/80"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>{copiedToast ? 'Link Copied!' : 'Share Wishlist'}</span>
                </button>

                {/* Clear all toggle for easy testing */}
                <button
                  type="button"
                  onClick={clearWishlist}
                  title="Clear wishlist to test empty state"
                  className="px-2.5 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </>
            )}

            {!hasItems && (
              <button
                type="button"
                onClick={resetDemoItems}
                className="px-3.5 py-2 bg-white border border-[#D9C4A9] text-[#8C4A18] hover:bg-[#FAF4EB] font-semibold text-xs rounded-lg shadow-2xs transition-all"
              >
                Reset Demo Items (4)
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Main Content: Grid OR Empty State ── */}
        {hasItems ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={removeItem}
                onWeightChange={updateItemWeight}
              />
            ))}
          </div>
        ) : (
          /* ── Empty State (matching bottom half of mockup) ── */
          <div className="py-12 sm:py-16 text-center max-w-lg mx-auto">
            {/* Handcrafted Golden Heart & Floating Nuts Art */}
            <WishlistEmptyIllustration />

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E120B] mt-5 tracking-tight">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed max-w-md mx-auto">
              Looks like you haven&apos;t added any products to your wishlist yet.
              <br className="hidden sm:inline" /> Explore our premium dry fruits and save your favorites for later.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#8C4A18] hover:bg-[#733B12] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
              >
                <span>Explore Products</span>
                <span>→</span>
              </Link>
              <button
                type="button"
                onClick={resetDemoItems}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium text-xs sm:text-sm rounded-lg transition-colors"
              >
                Load Sample Wishlist
              </button>
            </div>
          </div>
        )}

        {/* ── 4. Bottom Trust Badges ── */}
        <WishlistTrustStrip />
      </div>
    </div>
  );
}
