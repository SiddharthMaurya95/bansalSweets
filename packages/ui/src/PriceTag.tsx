import React from 'react';
import { formatInr, calculateUnitPricePer100g } from '@bansal/shared/client';

export interface PriceTagProps {
  pricePaise: number;
  mrpPaise?: number;
  weightGrams?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUnitPrice?: boolean;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  pricePaise,
  mrpPaise,
  weightGrams,
  size = 'md',
  showUnitPrice = true,
  className = '',
}) => {
  const hasDiscount = mrpPaise && mrpPaise > pricePaise;
  const discountPercent = hasDiscount ? Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100) : 0;

  const unitPricePer100g =
    showUnitPrice && weightGrams && weightGrams > 0
      ? calculateUnitPricePer100g(pricePaise, weightGrams)
      : null;

  const sizeClasses = {
    sm: { price: 'text-sm font-semibold', mrp: 'text-xs', unit: 'text-[11px]' },
    md: { price: 'text-base font-bold', mrp: 'text-xs', unit: 'text-xs' },
    lg: { price: 'text-xl font-bold', mrp: 'text-sm', unit: 'text-xs' },
    xl: { price: 'text-2xl font-extrabold', mrp: 'text-base', unit: 'text-sm' },
  }[size];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`text-[#0B2A6B] ${sizeClasses.price}`}>{formatInr(pricePaise)}</span>
        {hasDiscount && (
          <>
            <span className={`text-[#4A5163] line-through ${sizeClasses.mrp}`}>
              {formatInr(mrpPaise)}
            </span>
            <span className="text-[#15803D] text-xs font-semibold bg-[#ECFDF5] px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>

      {unitPricePer100g !== null && (
        <span className={`text-[#4A5163] mt-0.5 ${sizeClasses.unit}`}>
          ({formatInr(unitPricePer100g)} / 100g)
        </span>
      )}
    </div>
  );
};
