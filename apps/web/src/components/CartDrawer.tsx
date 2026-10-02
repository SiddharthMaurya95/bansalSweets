'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatInr } from '@bansal/shared/client';
import {
  ShoppingCartIcon,
  CloseIcon,
  DeliveryTruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from './ThemeIcons';

// ─── Single Cart Line Item ────────────────────────────────────────────────────

function CartLineItem({ item }: { item: CartItem }) {
  const { removeItem, updateQty } = useCart();

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0 group">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-sm font-semibold text-[#1B1F2A] hover:text-[#0B2A6B] transition-colors line-clamp-2 leading-tight"
        >
          {item.name}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{item.variantLabel}</p>

        <div className="flex items-center justify-between mt-2">
          {/* Qty stepper */}
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1 py-0.5">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all text-sm font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-5 text-center text-xs font-semibold text-[#1B1F2A]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-600 transition-all text-sm font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Price */}
          <span className="text-sm font-bold text-[#0B2A6B]">
            {formatInr(item.pricePaise * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 mt-1 cursor-pointer"
        aria-label="Remove item"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

export function CartDrawer() {
  const { isOpen, closeCart, items, totalPaise, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Lock body scroll when open and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const deliveryThresholdPaise = 50000; // ₹500
  const remaining = deliveryThresholdPaise - totalPaise;
  const pct = Math.min(100, (totalPaise / deliveryThresholdPaise) * 100);

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay animate-fade-in" onClick={closeCart} aria-hidden="true" />

      {/* Drawer */}
      <div
        className="cart-drawer animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon size={20} className="text-[#C88C3C]" />
            <h2 className="text-base font-bold text-[#1B1F2A]">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFF9EE] flex items-center justify-center text-[#C88C3C]">
              <ShoppingCartIcon size={36} className="text-[#C88C3C]" />
            </div>
            <div>
              <p className="font-semibold text-[#1B1F2A]">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some premium dry fruits!</p>
            </div>
            <button
              onClick={closeCart}
              className="mt-2 px-6 py-2.5 bg-[#0B2A6B] text-white text-sm font-semibold rounded-full hover:bg-[#1E4BA8] transition-colors cursor-pointer"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 py-3 bg-[#FFF9EE] border-b border-[#F2D27A]/30">
              {remaining > 0 ? (
                <p className="text-xs text-[#B45309] font-medium mb-1.5 flex items-center gap-1.5">
                  <span>
                    Add <strong>{formatInr(remaining)}</strong> more for free delivery
                  </span>
                  <DeliveryTruckIcon size={14} className="text-[#C88C3C]" />
                </p>
              ) : (
                <p className="text-xs text-[#15803D] font-semibold mb-1.5 flex items-center gap-1.5">
                  <ShieldCheckIcon size={14} className="text-[#15803D]" />
                  <span>You qualify for free delivery!</span>
                </p>
              )}
              <div className="h-1.5 bg-[#F2D27A]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D9A521] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-gray-100 bg-white space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#1B1F2A]">{formatInr(totalPaise)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span
                  className={
                    totalPaise >= deliveryThresholdPaise
                      ? 'text-[#15803D] font-semibold'
                      : 'text-gray-700 font-medium'
                  }
                >
                  {totalPaise >= deliveryThresholdPaise ? 'FREE' : formatInr(4900)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-3">
                <span className="text-[#1B1F2A]">Total</span>
                <span className="text-[#0B2A6B]">
                  {formatInr(totalPaise >= deliveryThresholdPaise ? totalPaise : totalPaise + 4900)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full text-center bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon size={14} className="text-white" />
              </Link>
              {!isAuthenticated && (
                <p className="text-[11px] text-center text-amber-700 bg-amber-50 py-1.5 px-2 rounded-lg border border-amber-200/80 font-medium">
                  🔒 Sign in or create an account at checkout to complete order
                </p>
              )}
              <button
                onClick={clearCart}
                className="block w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors mt-1 cursor-pointer"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
