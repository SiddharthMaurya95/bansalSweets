'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PriceTag } from '@bansal/ui';
import { useCart } from '@/context/CartContext';
import { MapPinIcon, StarIcon } from './ThemeIcons';

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  variantLabel: string;
  pricePaise: number;
  mrpPaise?: number;
  weightGrams: number;
  badge?: string;
  badgeColor?: 'gold' | 'red' | 'green';
  rating?: number;
  reviewCount?: number;
  origin?: string;
  inStock?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem({
      id: `${product.id}-${product.variantLabel}`,
      name: product.name,
      variantLabel: product.variantLabel,
      pricePaise: product.pricePaise,
      mrpPaise: product.mrpPaise,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setTimeout(() => setAdding(false), 1200);
  };

  const stars = product.rating ?? 4.5;
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;

  return (
    <Link href={`/products/${product.slug}`} className="product-card block group">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF8F5]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs ${
              product.badgeColor === 'red'
                ? 'bg-[#C8102E] text-white'
                : product.badgeColor === 'green'
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#0B2A6B] text-[#F2D27A] border border-[#F2D27A]/30'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Origin chip - Bespoke light label */}
        {product.origin && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-white/95 border border-[#E5DDD0] text-[#2C2723] text-[10px] font-bold shadow-2xs flex items-center gap-1">
            <MapPinIcon size={11} className="text-[#C88C3C]" />
            <span>{product.origin}</span>
          </div>
        )}

        {/* Quick-add button */}
        <button
          onClick={handleAdd}
          className="product-card__add-btn absolute bottom-2.5 right-2.5 bg-[#0B2A6B] hover:bg-[#153B8A] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
          aria-label={`Add ${product.name} to cart`}
        >
          {adding ? '✓ Added' : '+ Add'}
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 bg-white">
        {/* Stars */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: fullStars }, (_, i) => (
                <StarIcon key={i} size={12} filled={true} className="text-[#B58117]" />
              ))}
              {hasHalf && (
                <StarIcon size={12} filled={true} className="text-[#B58117] opacity-70" />
              )}
              {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }, (_, i) => (
                <StarIcon key={i} size={12} filled={false} className="text-[#E0D8CB]" />
              ))}
            </div>
            {product.reviewCount && (
              <span className="text-[10px] text-[#7A7266]">({product.reviewCount})</span>
            )}
          </div>
        )}

        <h3 className="font-serif font-bold text-sm text-[#1B1F2A] line-clamp-1 leading-snug mb-0.5 group-hover:text-[#0B2A6B] transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-[#736B5E] mb-2 line-clamp-1">{product.subtitle}</p>

        <div className="flex items-end justify-between gap-2 pt-1 border-t border-[#F3EEE6]">
          <div>
            <PriceTag
              pricePaise={product.pricePaise}
              mrpPaise={product.mrpPaise}
              weightGrams={product.weightGrams}
              size="sm"
              showUnitPrice
            />
          </div>
          <span className="text-[10px] font-semibold text-[#8C5D17] bg-[#FAF5EB] border border-[#EADFCB] px-2 py-0.5 rounded-md flex-shrink-0">
            {product.variantLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
