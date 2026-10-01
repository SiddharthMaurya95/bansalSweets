'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const scrollToContact = () => {
    const el = document.getElementById('visit-our-store-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetDirections = () => {
    showToast('Opening Google Maps directions for Fatehpuri store...');
    window.open(
      'https://www.google.com/maps/search/?api=1&query=Fatehpuri+Delhi+110006',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#2C2114]">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1F2A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ════════════════ 1. HERO BANNER: ROOTED IN FATEHPURI ════════════════ */}
      <section className="relative w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center bg-[#150A05] overflow-hidden">
        {/* Panoramic Fatehpuri Mandi Scene */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero-fatehpuri.jpg"
            alt="Historic Fatehpuri Mandi Dry Fruits Marketplace"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-right opacity-95"
          />
          {/* Subtle dark gradient overlay on left for sharp legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#140A04]/95 via-[#140A04]/80 to-transparent sm:w-3/5" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
          <div className="max-w-2xl text-white space-y-4">
            {/* Breadcrumb */}
            <nav className="text-xs text-amber-200/90 flex items-center gap-2 font-medium">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>&gt;</span>
              <span className="text-white font-bold">About Us</span>
            </nav>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-black tracking-tight text-white leading-tight">
              Rooted in Fatehpuri. <br />
              <span className="font-serif italic font-normal text-[#E5A93C]">
                Made for Every Home.
              </span>
            </h1>

            {/* Subheading & Paragraph */}
            <div className="pt-0.5 space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                About Bansal Foods
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-200/95 leading-relaxed max-w-lg font-normal">
                Premium dry fruits, trusted quality and the warmth of a traditional Delhi marketplace
                — now delivered to your doorstep.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/shop"
                className="bg-[#6E1A1A] hover:bg-[#581414] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Shop Dry Fruits</span>
                <span>→</span>
              </Link>
              <button
                type="button"
                onClick={scrollToContact}
                className="bg-white hover:bg-gray-100 text-[#1B1F2A] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. FOUR TRUST FEATURES RIBBON (UNDER HERO) ════════════════ */}
      <section className="bg-[#140A04] text-white border-y border-[#2C180E] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#2C180E]">
          {/* 1. Premium Quality */}
          <div className="flex items-center gap-3 pr-2">
            <div className="w-8 h-8 rounded-full text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white leading-tight">Premium Quality</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Handpicked Dry Fruits</p>
            </div>
          </div>

          {/* 2. Direct from Mandi */}
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6 pr-2">
            <div className="w-8 h-8 rounded-full text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6 pr-2">
            <div className="w-8 h-8 rounded-full text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-6">
            <div className="w-8 h-8 rounded-full text-[#E5A93C] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
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
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Authentic Storefront Image with Floating Badge (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
                <Image
                  src="/fatehpuri-storefront.jpg"
                  alt="Bansal Foods Traditional Dry Fruit Store in Fatehpuri, Delhi"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Floating Badge at Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs border border-gray-200 rounded-xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAF5EB] border border-[#ECD9BD] text-[#8E4A18] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block leading-none">
                      Serving
                    </span>
                    <strong className="text-xs font-bold text-[#1B1F2A] block leading-tight mt-0.5">
                      Fatehpuri, Delhi
                    </strong>
                    <span className="text-[10px] text-gray-500 font-medium block leading-none mt-0.5">
                      for Generations
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative & 4 Circular Badges (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1B1F2A]">
                  Our Story
                </h2>
                {/* Decorative motif divider */}
                <div className="flex items-center gap-2 my-2 text-[#C88C3C]">
                  <div className="h-px w-8 bg-[#C88C3C]/60" />
                  <span className="text-xs">🍂</span>
                  <div className="h-px w-8 bg-[#C88C3C]/60" />
                </div>
              </div>

              {/* Paragraph 1 */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                Bansal Foods brings the experience of Delhi’s historic Fatehpuri market to your home.
                For generations, we have been a trusted name in dry fruits, serving customers with
                premium quality almonds, cashews, pistachios, walnuts, raisins, dates and a wide range
                of nuts and seeds.
              </p>

              {/* Paragraph 2 */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                What started as a traditional shop in the heart of Fatehpuri has grown into a trusted
                brand for both retail customers and wholesale buyers across India. Our commitment has
                always been the same — authentic products, honest pricing and lasting relationships.
              </p>

              {/* 4 Circular Highlight Badges in a single row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {/* Badge 1: Traditional Family Business */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white hover:bg-[#FAF7F2] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2 shadow-2xs border border-[#F0E5D0]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1B1F2A] leading-tight">
                    Traditional<br />Family Business
                  </h5>
                </div>

                {/* Badge 2: Premium Quality Products */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white hover:bg-[#FAF7F2] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2 shadow-2xs border border-[#F0E5D0]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1B1F2A] leading-tight">
                    Premium<br />Quality Products
                  </h5>
                </div>

                {/* Badge 3: From Fatehpuri Mandi, Delhi */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white hover:bg-[#FAF7F2] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2 shadow-2xs border border-[#F0E5D0]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1B1F2A] leading-tight">
                    From Fatehpuri<br />Mandi, Delhi
                  </h5>
                </div>

                {/* Badge 4: Serving Retail & Wholesale */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white hover:bg-[#FAF7F2] transition-colors">
                  <div className="w-11 h-11 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2 shadow-2xs border border-[#F0E5D0]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#1B1F2A] leading-tight">
                    Serving Retail<br />&amp; Wholesale Customers
                  </h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════ 4. KEY STATS BANNER (PANORAMIC ARCHES) ════════════════ */}
      <section className="py-10 sm:py-14 bg-[#FAF7F2] border-y border-[#EFE5D4] relative overflow-hidden">
        {/* Subtle decorative background arches */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-between items-center px-4 sm:px-12">
          <svg className="w-36 h-36 fill-current text-[#8E4A18]" viewBox="0 0 100 100">
            <path d="M10 90 V50 Q50 10 90 50 V90 Z" />
          </svg>
          <svg className="w-36 h-36 fill-current text-[#8E4A18]" viewBox="0 0 100 100">
            <path d="M10 90 V50 Q50 10 90 50 V90 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {/* Stat 1: 20+ Years of Trust */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FAF2E6] text-[#8E4A18] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1B1F2A]">20+</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Years of Trust</p>
            </div>

            {/* Stat 2: 10,000+ Happy Customers */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FAF2E6] text-[#8E4A18] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1B1F2A]">10,000+</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Happy Customers</p>
            </div>

            {/* Stat 3: 100+ Premium Products */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FAF2E6] text-[#8E4A18] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1B1F2A]">100+</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Premium Products</p>
            </div>

            {/* Stat 4: Pan India Delivery */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FAF2E6] text-[#8E4A18] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="font-serif font-black text-3xl sm:text-4xl text-[#1B1F2A]">Pan India</p>
              <p className="text-xs text-gray-600 font-medium mt-1">Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 5. "OUR VALUES" SECTION ════════════════ */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Header & Intro (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1B1F2A]">
                Our Values
              </h2>
              {/* Decorative divider */}
              <div className="flex items-center gap-2 my-2 text-[#C88C3C]">
                <div className="h-px w-8 bg-[#C88C3C]/60" />
                <span className="text-xs">🍂</span>
                <div className="h-px w-8 bg-[#C88C3C]/60" />
              </div>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                Good food creates stronger bonds. We are committed to bringing you the finest dry
                fruits with integrity, quality and care.
              </p>
            </div>

            {/* Right Cards Grid (8 cols on lg: 4 cards) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Value 1: Quality First */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#8E4A18] hover:shadow-xs transition-all flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2.5 border border-[#F0E5D0]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 12L2 9z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xs text-[#1B1F2A] mb-1">Quality First</h4>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Handpicked, fresh and authentic dry fruits.
                </p>
              </div>

              {/* Value 2: Honest Pricing */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#8E4A18] hover:shadow-xs transition-all flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2.5 border border-[#F0E5D0]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <h4 className="font-bold text-xs text-[#1B1F2A] mb-1">Honest Pricing</h4>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Direct sourcing from trusted mandis.
                </p>
              </div>

              {/* Value 3: Customer Trust */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#8E4A18] hover:shadow-xs transition-all flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2.5 border border-[#F0E5D0]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h4 className="font-bold text-xs text-[#1B1F2A] mb-1">Customer Trust</h4>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Building long-term relationships with our customers.
                </p>
              </div>

              {/* Value 4: Reliable Supply */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 hover:border-[#8E4A18] hover:shadow-xs transition-all flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#8E4A18] flex items-center justify-center mb-2.5 border border-[#F0E5D0]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-xs text-[#1B1F2A] mb-1">Reliable Supply</h4>
                <p className="text-[11px] text-gray-500 leading-snug">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* ── Left Card: "From Our Shop in Fatehpuri to Your Home" (7 cols) ── */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#2D0B0B] text-white border border-[#4A1515] shadow-md flex flex-col sm:flex-row">
              {/* Dry Fruits Imagery (Left side of card) */}
              <div className="relative w-full sm:w-5/12 min-h-[200px] sm:min-h-full">
                <Image
                  src="/hero-dry-fruits.jpg"
                  alt="Artisan Bowls of Kashmiri Mamra Almonds, Cashews, Pistachios"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text & CTA (Right side of card) */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                    From Our Shop <br />
                    in Fatehpuri to Your Home
                  </h3>
                  <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-normal">
                    Experience the same quality and warmth that our customers have trusted for years,
                    now with the convenience of online shopping. Whether you are buying for your family,
                    business or special occasions, Bansal Foods is here to serve you.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Shop Our Products</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Right Card: "Visit Our Store" (5 cols) ── */}
            <div
              id="visit-our-store-card"
              className="lg:col-span-5 rounded-2xl p-6 sm:p-7 bg-white border border-gray-200 shadow-2xs flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle background Mandi Arch engraving */}
              <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-15 pointer-events-none select-none">
                <Image
                  src="/hero-market-scene.jpg"
                  alt="Fatehpuri Mandi Arch Silhouette"
                  fill
                  className="object-cover object-right"
                />
              </div>

              <div className="relative z-10 space-y-4">
                {/* Location Item */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6E1A1A] text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1B1F2A]">Visit Our Store</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Fatehpuri, Delhi – 110006<br />India
                    </p>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#6E1A1A] text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-900 font-bold flex flex-col gap-0.5">
                      <a href="tel:9313321535" className="hover:text-[#6E1A1A] transition-colors">
                        9313321535
                      </a>
                      <a href="tel:701119609" className="hover:text-[#6E1A1A] transition-colors">
                        701119609
                      </a>
                    </div>
                  </div>
                </div>

                {/* Get Directions Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGetDirections}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Get Directions</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
