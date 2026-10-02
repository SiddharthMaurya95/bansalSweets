'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { CartDrawer } from './CartDrawer';
import {
  MenuIcon,
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
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems, openCart } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  // Close mobile drawer and dropdown on route change & sync search input
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchQuery(q);
    }
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
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
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>🎁 Festive Offers</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-100 my-2">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Quick Navigation
                  </p>
                </div>

                <Link
                  href="/orders/track"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <span>Track Order</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                  </svg>
                  <span>Help &amp; Support</span>
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#1F140D] hover:bg-[#FAF0E8] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>Wishlist</span>
                  </div>
                  {totalWishlistCount > 0 && (
                    <span className="bg-[#8C4A18] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {totalWishlistCount}
                    </span>
                  )}
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
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden ring-1.5 ring-[#C88C3C]/60 shrink-0 bg-[#1a73e8] flex items-center justify-center shadow-2xs">
                        <img
                          src={
                            user?.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user?.name || 'User'
                            )}&background=1a73e8&color=ffffff&size=128&bold=true&rounded=true`
                          }
                          alt={user?.name || 'Profile'}
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-bold text-[#1F140D]">Hi, {user?.name?.split(' ')[0]}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="text-[#8C1C1C] hover:underline font-semibold cursor-pointer"
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

      {/* ════ MAIN HEADER CONTAINER ════ */}
      <header className="w-full bg-white sticky top-0 z-50 shadow-xs border-b border-gray-100">
        
        {/* ── ROW 1: Logo | Search Bar | 5 Action Items ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#8C5D17] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <MenuIcon size={22} />
          </button>

          {/* 1. Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group">
            <svg
              className="w-9 h-9 sm:w-11 sm:h-11 text-[#C88C3C] flex-shrink-0 transition-transform group-hover:scale-105"
              viewBox="0 0 40 40"
              fill="currentColor"
            >
              <path
                d="M20 2C15 6 12 12 12 18C12 24 16 28 20 30C24 28 28 24 28 18C28 12 25 6 20 2ZM10 14C6 17 4 22 5 26C6 30 10 33 14 33C14 27 12 20 10 14ZM30 14C28 20 26 27 26 33C30 33 34 30 35 26C36 22 34 17 30 14Z"
                opacity="0.95"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#1F140D] leading-none">
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

          {/* 2. Desktop Center Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex items-stretch h-10 w-full shadow-2xs">
              <div className="flex-1 flex items-center bg-white border border-gray-300 border-r-0 rounded-l-md focus-within:border-[#C88C3C] transition-colors overflow-hidden">
                <div className="pl-3.5 pr-2 text-gray-400 pointer-events-none flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <input
                  id="site-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for almonds, cashews, walnuts, dates..."
                  className="w-full h-full text-xs sm:text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400 pr-2"
                />
              </div>
              <button
                id="search-submit-btn"
                onClick={handleSearch}
                className="bg-[#C88C3C] hover:bg-[#B57C30] text-white px-4.5 rounded-r-md border border-[#C88C3C] transition-colors flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Submit search"
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 3. Five Header Action Items (Track Order | Help & Support | Sign In | Wishlist | Cart) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7">
            
            {/* 1. Track Order */}
            <Link
              href="/orders/track"
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors"
              aria-label="Track Order"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span className="text-[11px] font-medium mt-1 leading-tight whitespace-nowrap">Track Order</span>
            </Link>

            {/* 2. Help & Support */}
            <Link
              href="/contact"
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors"
              aria-label="Help & Support"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
              <span className="text-[11px] font-medium mt-1 leading-tight whitespace-nowrap">Help &amp; Support</span>
            </Link>

            {/* 3. Sign In / Register & Profile Picture */}
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors"
              aria-label={isAuthenticated ? 'My Account' : 'Sign In or Register'}
            >
              {isAuthenticated ? (
                <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1.5 ring-[#C88C3C]/50 group-hover:ring-[#C88C3C] transition-all shadow-2xs flex items-center justify-center bg-[#1a73e8] shrink-0">
                  <img
                    src={
                      user?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || 'User'
                      )}&background=1a73e8&color=ffffff&size=128&bold=true&rounded=true`
                    }
                    alt={user?.name || 'Profile'}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = 'none';
                      if (img.parentElement) {
                        img.parentElement.textContent = (user?.name || 'U').charAt(0).toUpperCase();
                        img.parentElement.className =
                          'w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs ring-1.5 ring-[#C88C3C]/60 shrink-0 select-none';
                      }
                    }}
                  />
                </div>
              ) : (
                <svg className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
              <span className="text-[11px] font-medium mt-1 leading-tight whitespace-nowrap">
                {isAuthenticated ? (user?.name?.split(' ')[0] ?? 'Account') : 'Sign In / Register'}
              </span>
            </Link>

            {/* 4. Wishlist */}
            <Link
              href="/wishlist"
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors relative"
              aria-label="Wishlist"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {totalWishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#8C4A18] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                    {totalWishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium mt-1 leading-tight whitespace-nowrap">Wishlist</span>
            </Link>

            {/* 5. Cart */}
            <button
              id="cart-trigger-btn"
              onClick={openCart}
              className="flex flex-col items-center group text-gray-700 hover:text-[#C88C3C] transition-colors relative cursor-pointer"
              aria-label={`Open Cart – ${totalItems} items`}
            >
              <div className="relative">
                <svg className="w-5 h-5 text-gray-700 group-hover:text-[#C88C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span className="absolute -top-1.5 -right-2.5 bg-[#C23B22] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-xs">
                  {totalItems}
                </span>
              </div>
              <span className="text-[11px] font-medium mt-1 leading-tight whitespace-nowrap">Cart</span>
            </button>

          </div>

          {/* Mobile Right Icons (Wishlist & Cart) */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/wishlist"
              className="p-1.5 text-gray-700 hover:text-[#C88C3C] relative transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-[#C23B22] text-white text-[8.5px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>

        </div>

        {/* ── Mobile Search Bar ── */}
        <div className="block md:hidden w-full px-2 sm:px-3 pb-3 pt-0.5">
          <div className="flex items-stretch h-10 w-full shadow-2xs">
            <div className="flex-1 min-w-0 flex items-center bg-white border border-gray-300 border-r-0 rounded-l-md focus-within:border-[#C88C3C] transition-colors overflow-hidden">
              <div className="pl-3 pr-1.5 text-gray-400 pointer-events-none flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for almonds, cashews, dates, pista..."
                className="w-full h-full pr-2 text-xs sm:text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#C88C3C] hover:bg-[#B57C30] text-white px-4 rounded-r-md border border-[#C88C3C] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Submit search"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── ROW 2: Categories Bar (All Categories | Links | Festive Offers) ── */}
        <nav
          className="hidden md:block bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-2 relative"
          aria-label="Product categories"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* 1. All Categories Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
                className="bg-[#7A4B20] hover:bg-[#683C15] text-white font-bold text-xs sm:text-[13px] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors flex-shrink-0 shadow-xs cursor-pointer"
              >
                <span className="text-sm">≡</span>
                <span>All Categories</span>
                <svg
                  className={`w-3 h-3 text-white/80 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* All Categories Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#EFE7DC] rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shop by Category</p>
                  </div>
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#2C2114] hover:bg-[#FAF5EB] hover:text-[#7A4B20] transition-colors"
                    >
                      <span>{cat.label}</span>
                      <span className="text-gray-300">›</span>
                    </Link>
                  ))}
                  <div className="pt-1.5 mt-1.5 border-t border-gray-100 px-3 pb-1">
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block text-center py-2 bg-[#7A4B20] text-white text-xs font-bold rounded-lg hover:bg-[#683C15] transition-colors"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Center Category Text Links */}
            <div className="flex items-center gap-4 lg:gap-6 font-semibold text-[#2C2114] overflow-x-auto scrollbar-none whitespace-nowrap">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="hover:text-[#C88C3C] text-xs sm:text-[13px] py-1 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* 3. Festive Offers Button */}
            <Link
              href="/category/gift-boxes"
              className="bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs sm:text-[13px] px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-xs whitespace-nowrap"
            >
              <span>🎁</span>
              <span>Festive Offers</span>
            </Link>

          </div>
        </nav>

        {/* ── Mobile Scrolling Categories Bar ── */}
        <div className="flex md:hidden items-center gap-2 px-3 py-2 bg-[#FAF7F2] border-t border-gray-100 overflow-x-auto scrollbar-none whitespace-nowrap text-xs font-medium">
          <Link
            href="/shop"
            className="bg-[#7A4B20] text-white font-bold px-2.5 py-1 rounded-md text-[11px] shrink-0"
          >
            ≡ All
          </Link>
          {NAV_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-2 py-1 text-gray-700 hover:text-[#7A4B20] shrink-0 text-[11px]"
            >
              {cat.label}
            </Link>
          ))}
          <Link
            href="/category/gift-boxes"
            className="bg-[#B91C1C] text-white font-bold px-2.5 py-1 rounded-md text-[11px] shrink-0"
          >
            🎁 Offers
          </Link>
        </div>

      </header>
    </>
  );
};
