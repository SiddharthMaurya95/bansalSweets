'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUsPage() {
  const scrollToContact = () => {
    const el = document.getElementById('visit-our-store-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2C2114]">
      {/* ════════════════ 1. HERO BANNER: ROOTED IN FATEHPURI ════════════════ */}
      <section className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] flex items-center bg-[#1B0F08] overflow-hidden">
        {/* Panoramic Old Delhi & Fatehpuri Mandi Visual */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-market-scene.jpg"
            alt="Historic Fatehpuri Mandi Dry Fruits Marketplace"
            fill
            priority
            className="object-cover object-center lg:object-right opacity-90"
          />
          {/* Subtle dark gradient overlay on left for sharp legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#140B05] via-[#140B05]/85 to-transparent sm:w-3/5" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 cols on lg) */}
            <div className="lg:col-span-7 text-white space-y-4 sm:space-y-5">
              {/* Breadcrumb */}
              <nav className="text-xs text-amber-200/80 flex items-center gap-2">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>&gt;</span>
                <span className="text-white font-medium">About Us</span>
              </nav>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                Rooted in Fatehpuri. <br />
                <span className="font-serif italic font-normal text-[#E5A93C]">Made for Every Home.</span>
              </h1>

              {/* Subheading & Paragraph */}
              <div className="pt-1">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  About Bansal Foods
                </h2>
                <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-lg mt-1.5">
                  Premium dry fruits, trusted quality and the warmth of a traditional Delhi marketplace
                  — now delivered to your doorstep.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Link
                  href="/shop"
                  className="bg-[#7A2E1A] hover:bg-[#642312] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>Shop Dry Fruits</span>
                  <span>→</span>
                </Link>
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="bg-white hover:bg-gray-100 text-[#2C2114] font-bold text-xs sm:text-sm px-6 py-3 rounded-full border border-gray-200 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Right Artisan Signboard Motif (5 cols on lg) */}
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="bg-[#FAF5EC]/95 backdrop-blur-md border-2 border-[#D4AF37]/60 rounded-2xl p-6 shadow-2xl text-center max-w-xs transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="w-12 h-12 mx-auto text-[#C88C3C] mb-2 flex items-center justify-center">
                  <svg className="w-12 h-12 fill-current" viewBox="0 0 40 40">
                    <path d="M20 2C15 6 12 12 12 18C12 24 16 28 20 30C24 28 28 24 28 18C28 12 25 6 20 2ZM10 14C6 17 4 22 5 26C6 30 10 33 14 33C14 27 12 20 10 14ZM30 14C28 20 26 27 26 33C30 33 34 30 35 26C36 22 34 17 30 14Z" />
                  </svg>
                </div>
                <h3 className="font-serif font-black text-xl text-[#0F2244] tracking-tight">
                  BANSAL FOODS
                </h3>
                <p className="text-[9px] font-bold text-[#8C5D17] tracking-widest uppercase mt-1">
                  DRY FRUITS • WHOLESALE • RETAIL
                </p>
                <div className="h-px bg-[#E2D1B8] my-2 w-3/4 mx-auto" />
                <p className="text-[8.5px] font-semibold text-gray-600 tracking-wider uppercase">
                  FATEHPURI, DELHI
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                  <span>✦</span>
                  <span>Direct From Mandi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. FOUR TRUST FEATURES RIBBON (UNDER HERO) ════════════════ */}
      <section className="bg-[#190E08] text-white border-y border-[#331C10] py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Premium Quality */}
          <div className="flex items-center gap-3 md:border-r md:border-[#331C10]/80 pr-2">
            <div className="w-9 h-9 rounded-full bg-[#2A170D] border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white leading-tight">Premium Quality</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Handpicked Dry Fruits</p>
            </div>
          </div>

          {/* 2. Direct from Mandi */}
          <div className="flex items-center gap-3 md:border-r md:border-[#331C10]/80 pr-2">
            <div className="w-9 h-9 rounded-full bg-[#2A170D] border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white leading-tight">Direct from Mandi</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Fatehpuri, Delhi</p>
            </div>
          </div>

          {/* 3. Trusted by Thousands */}
          <div className="flex items-center gap-3 md:border-r md:border-[#331C10]/80 pr-2">
            <div className="w-9 h-9 rounded-full bg-[#2A170D] border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white leading-tight">Trusted by</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Thousands of Customers</p>
            </div>
          </div>

          {/* 4. Wholesale & Retail */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2A170D] border border-[#E5A93C]/40 text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C7 2 3 7 3 12C3 16 6 19 10 19C12 19 14 18 15 16C16 18 18 19 20 19C22 19 23 18 23 16C23 11 18 2 12 2Z" />
                <path d="M12 2V16" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white leading-tight">Wholesale &amp; Retail</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">For All Your Needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 3. "OUR STORY" SECTION ════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Authentic Storefront Image with Floating Badge (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#E9DAC8] shadow-md group">
                {/* Traditional Storefront Scene */}
                <Image
                  src="/b2b-retailers.jpg"
                  alt="Bansal Foods Traditional Dry Fruit Store in Fatehpuri, Delhi"
                  fill
                  priority
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Overhead Shop Signboard Overlay */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 sm:p-5 text-center">
                  <div className="inline-block bg-[#FAF5EC]/95 backdrop-blur-xs border border-[#C88C3C]/60 rounded-xl px-4 py-2 shadow-lg">
                    <span className="font-serif font-black text-sm sm:text-base text-[#1F140D] tracking-tight block leading-tight">
                      BANSAL FOODS
                    </span>
                    <span className="text-[8px] font-bold text-[#8C5D17] tracking-widest uppercase block mt-0.5">
                      DRY FRUITS • WHOLESALE • RETAIL | FATEHPURI, DELHI
                    </span>
                  </div>
                </div>

                {/* Floating Badge at Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs border border-[#E9DAC8] rounded-xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF2E6] border border-[#ECD9BD] text-[#8C5D17] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C7 2 3 7 3 12C3 16 6 19 10 19C12 19 14 18 15 16C16 18 18 19 20 19C22 19 23 18 23 16C23 11 18 2 12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block leading-none">
                      Serving
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[#1F140D] block leading-tight mt-0.5">
                      Fatehpuri, Delhi
                    </strong>
                    <span className="text-[10px] text-gray-500 font-medium block leading-none mt-0.5">
                      for Generations
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative & 4 Circular Badges (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F140D]">
                  Our Story
                </h2>
                {/* Decorative motif divider */}
                <div className="flex items-center gap-2 my-3 text-[#C88C3C]">
                  <div className="h-px w-8 bg-[#C88C3C]/60" />
                  <span className="text-sm">🌾</span>
                  <div className="h-px w-8 bg-[#C88C3C]/60" />
                </div>
              </div>

              {/* Paragraph 1 */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Bansal Foods brings the experience of Delhi’s historic Fatehpuri market to your home.
                For generations, we have been a trusted name in dry fruits, serving customers with
                premium quality almonds, cashews, pistachios, walnuts, raisins, dates and a wide range
                of nuts and seeds.
              </p>

              {/* Paragraph 2 */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                What started as a traditional shop in the heart of Fatehpuri has grown into a trusted
                brand for both retail customers and wholesale buyers across India. Our commitment has
                always been the same — authentic products, honest pricing and lasting relationships.
              </p>

              {/* 4 Circular Highlight Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {/* Badge 1: Traditional Family Business */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1F140D] leading-tight">
                    Traditional<br />Family Business
                  </h5>
                </div>

                {/* Badge 2: Premium Quality Products */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1F140D] leading-tight">
                    Premium<br />Quality Products
                  </h5>
                </div>

                {/* Badge 3: From Fatehpuri Mandi, Delhi */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1F140D] leading-tight">
                    From Fatehpuri<br />Mandi, Delhi
                  </h5>
                </div>

                {/* Badge 4: Serving Retail & Wholesale */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DC]">
                  <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-2 shadow-2xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1F140D] leading-tight">
                    Serving Retail &amp;<br />Wholesale Customers
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 4. KEY STATS BANNER (PANORAMIC MANDI WATERMARK) ════════════════ */}
      <section className="py-10 sm:py-14 bg-[#FAF5EC] border-y border-[#EFE5D4] relative overflow-hidden">
        {/* Subtle decorative background arches */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex justify-between items-center px-8">
          <svg className="w-48 h-48 fill-current text-[#7A4116]" viewBox="0 0 100 100">
            <path d="M10 90 V50 Q50 10 90 50 V90 Z" />
          </svg>
          <svg className="w-48 h-48 fill-current text-[#7A4116]" viewBox="0 0 100 100">
            <path d="M10 90 V50 Q50 10 90 50 V90 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {/* Stat 1: 20+ Years of Trust */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE3D3] text-[#8C5D17] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1F140D]">20+</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">Years of Trust</p>
            </div>

            {/* Stat 2: 10,000+ Happy Customers */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE3D3] text-[#8C5D17] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1F140D]">10,000+</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">Happy Customers</p>
            </div>

            {/* Stat 3: 100+ Premium Products */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE3D3] text-[#8C5D17] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1F140D]">100+</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">Premium Products</p>
            </div>

            {/* Stat 4: Pan India Delivery */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE3D3] text-[#8C5D17] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1F140D]">Pan India</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. "OUR VALUES" SECTION ════════════════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header & Intro (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F140D]">
                Our Values
              </h2>
              {/* Decorative divider */}
              <div className="flex items-center gap-2 my-2 text-[#C88C3C]">
                <div className="h-px w-8 bg-[#C88C3C]/60" />
                <span className="text-sm">🌾</span>
                <div className="h-px w-8 bg-[#C88C3C]/60" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Good food creates stronger bonds. We are committed to bringing you the finest dry
                fruits with integrity, quality and care.
              </p>
            </div>

            {/* Right Cards Grid (8 cols on lg: 4 cards) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Value 1: Quality First */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D4] hover:border-[#D4AF37] hover:shadow-sm transition-all flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 12L2 9z" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#1F140D] mb-1.5">Quality First</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Handpicked, fresh and authentic dry fruits.
                </p>
              </div>

              {/* Value 2: Honest Pricing */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D4] hover:border-[#D4AF37] hover:shadow-sm transition-all flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C7 2 3 7 3 12C3 16 6 19 10 19C12 19 14 18 15 16C16 18 18 19 20 19C22 19 23 18 23 16C23 11 18 2 12 2Z" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#1F140D] mb-1.5">Honest Pricing</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Direct sourcing from trusted mandis.
                </p>
              </div>

              {/* Value 3: Customer Trust */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D4] hover:border-[#D4AF37] hover:shadow-sm transition-all flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#1F140D] mb-1.5">Customer Trust</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Building long-term relationships with our customers.
                </p>
              </div>

              {/* Value 4: Reliable Supply */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D4] hover:border-[#D4AF37] hover:shadow-sm transition-all flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#1F140D] mb-1.5">Reliable Supply</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Serving both retail and wholesale across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 6. BOTTOM SPLIT: "FROM OUR SHOP" & "VISIT OUR STORE" ════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FAF7F2] border-t border-[#EFE8DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* ── Left Card: "From Our Shop in Fatehpuri to Your Home" ── */}
            <div className="rounded-2xl overflow-hidden bg-[#2D0B0B] text-white border border-[#4A1515] shadow-lg flex flex-col md:flex-row">
              {/* Dry Fruits Imagery (Left side of card) */}
              <div className="relative w-full md:w-5/12 min-h-[220px] md:min-h-full">
                <Image
                  src="/hero-dry-fruits.jpg"
                  alt="Artisan Bowls of Kashmiri Mamra Almonds, Cashews, Pistachios"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-[#2D0B0B]" />
              </div>

              {/* Text & CTA (Right side of card) */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                    From Our Shop <br className="hidden sm:inline" />
                    in Fatehpuri to Your Home
                  </h3>
                  <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                    Experience the same quality and warmth that our customers have trusted for years,
                    now with the convenience of online shopping. Whether you are buying for your family,
                    business or special occasions, Bansal Foods is here to serve you.
                  </p>
                </div>

                <div className="pt-5">
                  <Link
                    href="/shop"
                    className="bg-[#8C4A18] hover:bg-[#783D12] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Shop Our Products</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Right Card: "Visit Our Store" ── */}
            <div
              id="visit-our-store-card"
              className="rounded-2xl p-6 sm:p-8 bg-white border border-[#E9DAC8] shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle background Mandi Arch engraving */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none select-none">
                <Image
                  src="/hero-market-scene.jpg"
                  alt="Fatehpuri Mandi Arch Silhouette"
                  fill
                  className="object-cover object-right"
                />
              </div>

              <div className="relative z-10 space-y-4">
                {/* Location Item */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FBEAE8] text-[#8B1E1E] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1F140D]">Visit Our Store</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Fatehpuri, Delhi – 110006, India
                    </p>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FBEAE8] text-[#8B1E1E] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1F140D]">Phone Numbers</h4>
                    <div className="text-xs text-gray-700 mt-0.5 flex flex-col sm:flex-row gap-1 sm:gap-3">
                      <a href="tel:9313321535" className="hover:text-[#8B1E1E] font-semibold hover:underline">
                        9313321535
                      </a>
                      <span className="hidden sm:inline text-gray-400">•</span>
                      <a href="tel:701119609" className="hover:text-[#8B1E1E] font-semibold hover:underline">
                        701119609
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Support Item */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E8F8EE] text-[#128C7E] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1F140D]">WhatsApp Inquiry</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Chat directly with our Fatehpuri store desk
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 pt-5 flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Fatehpuri+Chandni+Chowk+Delhi+110006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 text-[#1F140D] border border-gray-300 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <span>Get Directions</span>
                  <span>→</span>
                </a>

                <a
                  href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods,%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                >
                  <span>Chat on WhatsApp</span>
                  <span>›</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
