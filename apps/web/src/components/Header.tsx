'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { CartDrawer } from './CartDrawer';
import {
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  MenuIcon,
  GiftIcon,
  ShieldCheckIcon,
  PriceTagIcon,
  DeliveryTruckIcon,
  CloseIcon,
} from './ThemeIcons';

const NAV_CATEGORIES = [
  { label: 'Almonds', href: '/category/almonds' },
  { label: 'Cashews', href: '/category/cashews' },
  { label: 'Pistachios', href: '/category/pistachios' },
  { label: 'Walnuts', href: '/category/walnuts' },
  { label: 'Raisins', href: '/category/raisins' },
  { label: 'Dates', href: '/category/dates' },
  { label: 'Seeds', href: '/category/seeds' },
  { label: 'Dry Fruit Mix', href: '/category/dry-fruit-mix' },
  { label: 'Gift Hampers', href: '/category/gift-boxes' },
  { label: 'Bulk/Wholesale', href: '/wholesale' },
  { label: 'About Us', href: '/about' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  }, [searchQuery, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (pathname === '/checkout' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <>
      <CartDrawer />

      {/* ── Slide-Over Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-[310px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slideRight overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <svg className="w-8 h-8 text-[#C88C3C]" viewBox="0 0 40 40" fill="currentColor">
                    <path
                      d="M20 2C15 6 12 12 12 18C12 24 16 28 20 30C24 28 28 24 28 18C28 12 25 6 20 2ZM10 14C6 17 4 22 5 26C6 30 10 33 14 33C14 27 12 20 10 14ZM30 14C28 20 26 27 26 33C30 33 34 30 35 26C36 22 34 17 30 14Z"
                      opacity="0.95"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-lg text-[#0F2244] leading-tight">
                      BANSAL FOODS
                    </span>
                    <span className="text-[7.5px] uppercase font-bold tracking-[0.2em] text-[#C88C3C]">
                      FATEHPURI, DELHI
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200/60 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="py-2 px-3 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#8C1C1C] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>🏠</span>
                  <span>Home</span>
                </Link>

                <div className="pt-1 pb-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Categories
                  </p>
                </div>

                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] hover:text-[#8C5D17] transition-colors"
                  >
                    <span>{cat.label}</span>
                    <span className="text-gray-300 text-sm">›</span>
                  </Link>
                ))}

                {/* Festive Offers Highlight */}
                <div className="pt-2 pb-1">
                  <Link
                    href="/category/gift-boxes"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#8C1C1C] hover:bg-[#721515] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <GiftIcon size={14} className="text-white" />
                    <span>🎁 Festive Offers</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-100 my-2">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Help &amp; Policies
                  </p>
                </div>

                <Link
                  href="/orders/track"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>📦</span>
                  <span>Track Order</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>📞</span>
                  <span>Contact Us</span>
                </Link>

                <Link
                  href="/shipping-policy"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>🚚</span>
                  <span>Shipping Policy</span>
                </Link>

                <Link
                  href="/returns"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>↩️</span>
                  <span>Return &amp; Refund</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <span>ℹ️</span>
                  <span>About Us</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer (Auth Buttons) */}
            <div className="p-4 border-t border-gray-100 bg-[#FAF7F2]">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F140D]">Hi, {user?.name?.split(' ')[0]}</span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="text-[#8C1C1C] hover:underline font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                  <Link
                    href="/account"
                    className="block text-center w-full py-2 bg-[#8C5D17] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#73430C]"
                  >
                    My Account / Orders
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="py-2.5 px-3 text-center border border-[#8C5D17] text-[#8C5D17] rounded-xl text-xs font-bold hover:bg-[#FAF0E8] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="py-2.5 px-3 text-center bg-[#8C5D17] text-white rounded-xl text-xs font-bold hover:bg-[#73430C] transition-colors shadow-2xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="w-full bg-white sticky top-0 z-50 shadow-xs">
        {/* ── 1. Top Bar (Dark Navy / Mandi Theme) ── */}
        <div className="bg-[#0B1B2B] text-white text-[10.5px] sm:text-[11px] py-1.5 px-3 sm:px-4 border-b border-[#14293D]">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
            {/* Left Location & Hotline */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/90">
              <span className="flex items-center gap-1 sm:gap-1.5 text-white/80">
                <MapPinIcon size={12} className="text-[#C88C3C] flex-shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">Fatehpuri, Delhi 110006</span>
              </span>
              <span className="text-white/30 hidden xs:inline">|</span>
              <span className="hidden xs:flex items-center gap-1 sm:gap-1.5">
                <PhoneIcon size={12} className="text-[#C88C3C] flex-shrink-0" />
                <strong className="text-white font-bold">9313321535</strong>
                <span className="text-white/70 hidden sm:inline">| 701119609</span>
              </span>
            </div>

            {/* Right Tax, Track, Help & Sign In */}
            <div className="flex items-center gap-2 sm:gap-3 text-white/90">
              <span className="hidden lg:inline text-white/70">GSTIN: 07AHKPB8873B1ZD</span>
              <span className="hidden lg:inline text-white/30">|</span>
              <Link href="/orders/track" className="hover:text-[#C88C3C] transition-colors whitespace-nowrap">
                Track Order
              </Link>
              <span className="text-white/30 hidden sm:inline">|</span>
              <Link href="/contact" className="hover:text-[#C88C3C] transition-colors hidden sm:inline">
                Help &amp; Support
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                id="account-link"
                className="hover:text-[#C88C3C] transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
              >
                <svg
                  className="w-3.5 h-3.5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  {isAuthenticated
                    ? (user?.name?.split(' ')[0] ?? 'Account')
                    : 'Sign In'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. Main Header Row ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6 border-b border-gray-100">
          
          {/* Mobile Hamburger Button (Left on mobile, hidden on lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#8C5D17] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <MenuIcon size={22} />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-[#C88C3C] flex-shrink-0 transition-transform group-hover:scale-105"
              viewBox="0 0 40 40"
              fill="currentColor"
            >
              <path
                d="M20 2C15 6 12 12 12 18C12 24 16 28 20 30C24 28 28 24 28 18C28 12 25 6 20 2ZM10 14C6 17 4 22 5 26C6 30 10 33 14 33C14 27 12 20 10 14ZM30 14C28 20 26 27 26 33C30 33 34 30 35 26C36 22 34 17 30 14Z"
                opacity="0.95"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#0F2244] leading-none">
                BANSAL FOODS
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.18em] sm:tracking-[0.2em] text-[#C88C3C] mt-0.5 sm:mt-1">
                DRY FRUITS • WHOLESALE • RETAIL
              </span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.22em] text-gray-500 font-medium hidden sm:block">
                FATEHPURI, DELHI
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:border-[#C88C3C] focus-within:ring-2 focus-within:ring-[#C88C3C]/20 transition-all bg-[#FAF8F5]">
              <input
                id="site-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for almonds, cashews, walnuts, dates..."
                className="w-full px-4 py-2 text-xs sm:text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                id="search-submit-btn"
                onClick={handleSearch}
                className="bg-[#C88C3C] hover:bg-[#B57C30] text-white px-4 py-2 text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Submit search"
              >
                <SearchIcon size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Desktop Right: 3 Trust Badges + Wishlist + Cart */}
          <div className="hidden lg:flex items-center gap-5 text-xs">
            {/* 100% Original */}
            <div className="flex items-center gap-2">
              <ShieldCheckIcon size={20} className="text-[#C88C3C] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1B1F2A] leading-tight">100% Original</p>
                <p className="text-[10px] text-gray-500">Premium Quality</p>
              </div>
            </div>

            {/* Best Prices */}
            <div className="flex items-center gap-2">
              <PriceTagIcon size={20} className="text-[#C88C3C] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1B1F2A] leading-tight">Best Prices</p>
                <p className="text-[10px] text-gray-500">Direct from Mandi</p>
              </div>
            </div>

            {/* Fast & Safe Delivery */}
            <div className="flex items-center gap-2">
              <DeliveryTruckIcon size={20} className="text-[#C88C3C] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#1B1F2A] leading-tight">Fast &amp; Safe</p>
                <p className="text-[10px] text-gray-500">Delivery</p>
              </div>
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors relative px-1"
              aria-label="View Wishlist"
            >
              <svg
                className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 right-0 w-3.5 h-3.5 bg-[#8C4A18] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
              <span className="text-[10px] font-medium mt-0.5">Wishlist</span>
            </Link>

            {/* Cart with Counter Badge */}
            <button
              id="cart-trigger-btn"
              onClick={openCart}
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors relative px-1 cursor-pointer"
              aria-label={`Open cart – ${totalItems} items`}
            >
              <div className="relative">
                <svg
                  className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1.5 -right-2.5 bg-[#C23B22] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-xs">
                  {totalItems}
                </span>
              </div>
              <span className="text-[10px] font-medium mt-0.5">Cart</span>
            </button>
          </div>

          {/* Mobile Right: Wishlist & Cart icons (Always visible on mobile/tablet) */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/wishlist"
              className="p-1.5 text-gray-700 hover:text-[#C88C3C] relative transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {totalWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8C4A18] text-white text-[8.5px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="p-1.5 text-gray-700 hover:text-[#C88C3C] relative transition-colors cursor-pointer"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-[#C23B22] text-white text-[8.5px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>

        </div>

        {/* ── 3. Mobile Search Bar (Visible on mobile/tablet) ── */}
        <div className="block md:hidden px-3 py-2 bg-white border-b border-gray-100">
          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-[#FAF8F5] focus-within:border-[#C88C3C] focus-within:ring-2 focus-within:ring-[#C88C3C]/20">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search almonds, cashews, walnuts..."
              className="w-full pl-3 pr-2 py-2 text-xs text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#C88C3C] text-white px-3.5 py-2 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Submit search"
            >
              <SearchIcon size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* ── 4. Mobile 3-Badge Value Strip (Matches Mobile Reference Screenshot) ── */}
        <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-[#FAF7F2] border-b border-[#EFE5D4] text-[9.5px] text-gray-700 font-medium overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 shrink-0">
            <ShieldCheckIcon size={12} className="text-[#8C5D17]" />
            <span>100% Original</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 shrink-0">
            <PriceTagIcon size={12} className="text-[#8C5D17]" />
            <span>Best Prices</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 shrink-0">
            <DeliveryTruckIcon size={12} className="text-[#8C5D17]" />
            <span>Fast &amp; Safe Delivery</span>
          </div>
        </div>

        {/* ── 5. Desktop Navigation Bar (Categories + CTAs) ── */}
        <nav
          className="hidden md:block bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto scrollbar-none"
          aria-label="Product categories"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 whitespace-nowrap text-xs">
            {/* All Categories Button */}
            <Link
              href="/shop"
              className="bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold px-3.5 py-1.5 rounded-sm flex items-center gap-2 transition-colors flex-shrink-0 shadow-2xs"
            >
              <MenuIcon size={14} className="text-white" />
              <span>All Categories</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-4 sm:gap-6 font-semibold text-[#2C2723] overflow-x-auto scrollbar-none">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="hover:text-[#C88C3C] transition-colors py-1 text-xs"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Festive Offers Button */}
            <Link
              href="/category/gift-boxes"
              className="bg-[#C23B22] hover:bg-[#A83019] text-white font-bold px-3.5 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors flex-shrink-0 ml-auto shadow-2xs"
            >
              <GiftIcon size={14} className="text-white" />
              <span>Festive Offers</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};
