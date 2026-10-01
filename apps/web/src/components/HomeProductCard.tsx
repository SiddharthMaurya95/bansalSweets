'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatInr } from '@bansal/shared/client';
import { ShoppingCartIcon, StarIcon } from './ThemeIcons';

export interface HomeProductItem {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  variantLabel: string;
  pricePaise: number;
  mrpPaise: number;
  discountBadge: string;
  rating: number;
  reviewCount: number;
  unitText: string;
}

export function HomeProductCard({ product }: { product: HomeProductItem }) {
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
    <div className="bg-white rounded-2xl border border-[#ECE5DA] overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between">
      <div>
        {/* Image Container with Discount Badge */}
        <div className="relative aspect-square w-full bg-[#FAF8F5] p-3 flex items-center justify-center overflow-hidden">
          {/* Red discount pill badge */}
          <span className="absolute top-2.5 right-2.5 bg-[#D92D20] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm z-10 shadow-xs">
            {product.discountBadge}
          </span>

          <Link href={`/products/${product.slug}`} className="relative w-full h-full block">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Card Details */}
        <div className="p-3.5 pb-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-[#1B1F2A] hover:text-[#0B2A6B] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="font-extrabold text-sm sm:text-base text-[#1B1F2A]">
              {formatInr(product.pricePaise)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatInr(product.mrpPaise)}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">{product.unitText}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5 text-[#E5A93C]">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  size={12}
                  filled={i < stars}
                  className={i < stars ? 'text-[#E5A93C]' : 'text-gray-200'}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Add to Cart button */}
      <div className="p-3 pt-0">
        <button
          onClick={handleAdd}
          className="w-full bg-[#F2DCAE] hover:bg-[#E5CB97] text-[#2C2114] font-bold text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCartIcon size={14} className="text-[#2C2114]" />
          <span>{added ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
