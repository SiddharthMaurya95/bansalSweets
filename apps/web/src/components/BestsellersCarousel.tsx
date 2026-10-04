'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatInr } from '@bansal/shared/client';
import type { HomeProductItem } from './HomeProductCard';
import {
  ShoppingCartIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from './ThemeIcons';

/** Leaf kicker icon matching the BESTSELLERS badge from reference image */
function LeafKickerIcon({ className = 'w-4 h-4 text-[#8E4A18]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.2 4.1c-2.8-.2-6.5 1.5-8.5 4.5-1.8 2.7-1.4 6.2.8 8.6L6 23.7l1.4 1.4 6.5-6.5c2.4 2.2 5.9 2.6 8.6.8 3-2 4.7-5.7 4.5-8.5-2.8.2-6.1-1-7.8-3.4 1.8-1.5 2.5-3 2.5-3l-2.5-.4z" />
      <path d="M10 13c-2.2-.1-4.8 1-6.1 3-1.1 1.7-.8 3.8.5 5.2l-3.4 3.4 1.4 1.4 3.4-3.4c1.4 1.3 3.5 1.6 5.2.5 2-1.3 3.1-3.9 3-6.1-1.8.1-3.8-.7-4.8-2.2.9-.9 1.4-1.7 1.4-1.7l-.6-.1z" />
    </svg>
  );
}

function BestsellerCard({ product }: { product: HomeProductItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addItem({
      id: `${product.id}-${product.variantLabel}`,
      name: product.name,
      variantLabel: product.variantLabel,
      pricePaise: product.pricePaise,
      mrpPaise: product.mrpPaise,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setTimeout(() => setAdded(false), 1200);
  };

  const stars = Math.floor(product.rating);

  return (
    <div className="flex-none flex-[0_0_calc((100%-10px)/2)] w-[calc((100%-10px)/2)] min-w-[calc((100%-10px)/2)] sm:flex-[0_0_calc((100%-20px)/3)] sm:w-[calc((100%-20px)/3)] sm:min-w-[calc((100%-20px)/3)] md:flex-[0_0_calc((100%-36px)/4)] md:w-[calc((100%-36px)/4)] md:min-w-[calc((100%-36px)/4)] lg:flex-[0_0_calc((100%-60px)/6)] lg:w-[calc((100%-60px)/6)] lg:min-w-[calc((100%-60px)/6)] snap-start bg-white rounded-2xl border border-[#EDE4D6] overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Image Container with Red Discount Badge */}
        <div className="relative aspect-square w-full bg-[#FAF8F5] p-2.5 overflow-hidden flex items-center justify-center">
          <span className="absolute top-2 right-2 bg-[#E31B23] text-white text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 rounded shadow-xs z-10 tracking-tight">
            {product.discountBadge}
          </span>

          <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-3 pb-2">
          <Link href={`/products/${product.slug}`} title={product.name}>
            <h3 className="font-bold text-xs sm:text-[12.5px] text-[#1B1F2A] hover:text-[#8E4A18] transition-colors truncate leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 mt-1.5 flex-wrap">
            <span className="font-extrabold text-sm sm:text-base text-[#1B1F2A]">
              {formatInr(product.pricePaise)}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              {formatInr(product.mrpPaise)}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">{product.unitText}</span>
          </div>

          {/* 5-Star Rating & Reviews */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-[#E5A93C]">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  size={12}
                  filled={i < stars}
                  className={i < stars ? 'text-[#E5A93C]' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-700 ml-0.5">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="p-3 pt-0">
        <button
          onClick={handleAdd}
          className="w-full bg-[#F5DCA8] hover:bg-[#EBCF96] active:scale-[0.98] text-[#2C2114] font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCartIcon size={14} className="text-[#2C2114]" />
          <span>{added ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}

export function BestsellersCarousel({ products }: { products: HomeProductItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const updateActiveDot = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const progress = el.scrollLeft / maxScroll;
    const dotIndex = Math.min(4, Math.max(0, Math.round(progress * 4)));
    setActiveDot(dotIndex);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateActiveDot, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveDot);
  }, [updateActiveDot]);

  const scrollToDot = (dotIndex: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetScroll = (maxScroll / 4) * dotIndex;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(dotIndex);
  };

  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-7 sm:py-10 bg-[#FAF6F0] relative overflow-hidden" aria-labelledby="bestsellers-carousel-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header container with blended panoramic nuts banner */}
        <div className="relative flex items-center justify-between gap-4 mb-4 sm:mb-6 min-h-[95px] sm:min-h-[110px]">
          {/* Left Text Block */}
          <div className="max-w-xl z-10 relative">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#8E4A18] mb-1">
              <LeafKickerIcon className="w-4 h-4 text-[#8E4A18]" />
              <span>BESTSELLERS</span>
            </div>
            <h2
              id="bestsellers-carousel-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#2B1B17] tracking-tight leading-tight"
            >
              Fresh Harvest Favorites
            </h2>
            <p className="text-xs sm:text-sm text-[#6C5F53] font-medium mt-1">
              Hand-picked, premium quality dry fruits packed with nutrition
            </p>
          </div>

          {/* Panoramic dry fruits bowl background image */}
          <div className="absolute right-20 sm:right-28 md:right-32 top-1/2 -translate-y-1/2 h-36 sm:h-44 md:h-48 w-56 sm:w-80 md:w-96 pointer-events-none overflow-hidden select-none hidden sm:block">
            <div className="relative w-full h-full">
              <Image
                src="/bestsellers-header-banner.jpg"
                alt="Fresh dry fruits selection"
                fill
                sizes="(max-width: 1024px) 35vw, 25vw"
                className="object-cover object-center"
                priority
              />
              {/* Radial and edge gradient overlays to seamlessly merge into the warm cream background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-transparent to-[#FAF6F0]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/50 via-transparent to-[#FAF6F0]/60" />
            </div>
          </div>

          {/* Right Link */}
          <div className="z-10 relative self-end sm:self-center mb-1 sm:mb-0">
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-bold text-[#2B1B17] hover:text-[#8E4A18] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRightIcon size={14} className="text-[#2B1B17]" />
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous products"
            className="absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E6DDD0] shadow-md hover:shadow-lg flex items-center justify-center text-[#2A1810] hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeftIcon size={18} className="text-[#2A1810]" />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth py-2 px-0.5 scrollbar-none snap-x snap-mandatory focus:outline-none select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ cursor: isDragging ? 'grabbing' : 'default' }}
          >
            {products.map((prod) => (
              <BestsellerCard key={prod.id} product={prod} />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next products"
            className="absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E6DDD0] shadow-md hover:shadow-lg flex items-center justify-center text-[#2A1810] hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRightIcon size={18} className="text-[#2A1810]" />
          </button>
        </div>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeDot
                  ? 'bg-[#4E1A11] w-2.5 sm:w-3 scale-110'
                  : 'bg-[#D9D0C5] hover:bg-[#B8AA9A] w-2 sm:w-2.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
