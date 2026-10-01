'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 6 B2B Customer Categories
const B2B_SECTORS = [
  {
    title: 'Retailers',
    description: 'Kirana stores, supermarkets and retail chains',
    image: '/b2b-retailers.jpg',
  },
  {
    title: 'Restaurants',
    description: 'Fine dining restaurants and cafes',
    image: '/b2b-restaurants.jpg',
  },
  {
    title: 'Hotels',
    description: 'Hotels, resorts and hospitality chains',
    image: '/b2b-hotels.jpg',
  },
  {
    title: 'Caterers',
    description: 'Event caterers and wedding planners',
    image: '/b2b-caterers.jpg',
  },
  {
    title: 'Sweet Shops',
    description: 'Mithai shops and confectioneries',
    image: '/b2b-sweets.jpg',
  },
  {
    title: 'Corporate Gifting',
    description: 'Bulk gifting for offices and events',
    image: '/b2b-corporate.jpg',
  },
];

// 6 Value Propositions for "Why Choose Bansal Foods"
const VALUE_PROPS = [
  {
    title: 'Direct from Mandi',
    description: 'Sourced fresh from Fatehpuri, Delhi',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6" />
      </svg>
    ),
  },
  {
    title: 'Premium Quality',
    description: 'Carefully graded and lab tested',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: 'Wide Variety',
    description: '100+ dry fruits and nuts',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Competitive Pricing',
    description: 'Best wholesale rates for bulk orders',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    title: 'Pan India Delivery',
    description: 'Safe and timely delivery across India',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Dedicated Support',
    description: 'Relationship manager for bulk clients',
    icon: (
      <svg className="w-5 h-5 text-[#E5A93C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

// Sample Wholesale Tier Pricing Table Data
const PRICING_DATA = [
  {
    name: 'Kashmiri Mamra Almonds',
    p1kg: '₹1,200',
    p5kg: '₹1,100',
    p10kg: '₹1,050',
    p25kg: '₹980',
    p50kg: '₹900',
  },
  {
    name: 'W320 Premium Cashews',
    p1kg: '₹780',
    p5kg: '₹720',
    p10kg: '₹680',
    p25kg: '₹640',
    p50kg: '₹600',
  },
  {
    name: 'Iranian Green Pistachios',
    p1kg: '₹1,550',
    p5kg: '₹1,450',
    p10kg: '₹1,380',
    p25kg: '₹1,300',
    p50kg: '₹1,200',
  },
  {
    name: 'California Walnuts',
    p1kg: '₹900',
    p5kg: '₹850',
    p10kg: '₹800',
    p25kg: '₹750',
    p50kg: '₹700',
  },
  {
    name: 'Premium Raisins (Kishmish)',
    p1kg: '₹400',
    p5kg: '₹360',
    p10kg: '₹330',
    p25kg: '₹300',
    p50kg: '₹280',
  },
  {
    name: 'Ajwa Premium Dates',
    p1kg: '₹850',
    p5kg: '₹800',
    p10kg: '₹750',
    p25kg: '₹700',
    p50kg: '₹650',
  },
];

// 4 Simple Ordering Steps
const ORDER_STEPS = [
  {
    step: '1',
    title: 'Send Inquiry',
    description: 'Fill the form with your requirements',
  },
  {
    step: '2',
    title: 'Get Quote',
    description: 'Receive best wholesale rates',
  },
  {
    step: '3',
    title: 'Confirm Order',
    description: 'Finalize products and quantity',
  },
  {
    step: '4',
    title: 'Fast Delivery',
    description: 'Get timely delivery across India',
  },
];

// B2B Testimonials
const TESTIMONIALS = [
  {
    quote:
      'We have been sourcing dry fruits from Bansal Foods for over 3 years. Consistent quality, best prices and always on-time delivery.',
    name: 'Rajesh Gupta',
    role: 'Retail Store Owner, Delhi',
    initial: 'R',
  },
  {
    quote:
      'Excellent quality and professional service. They understand our bulk requirements and provide great rates for our hotel chain.',
    name: 'Sandeep Malhotra',
    role: 'Hotel Owner, Noida',
    initial: 'S',
  },
  {
    quote:
      'Reliable supplier with wide variety of premium dry fruits. Our go-to partner for corporate gifting and bulk orders.',
    name: 'Priya Mehta',
    role: 'Corporate Gifting Company, Gurgaon',
    initial: 'P',
  },
];

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    mobileNumber: '',
    email: '',
    productsRequired: '',
    approxQuantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const scrollToQuoteForm = () => {
    const el = document.getElementById('quote-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2C2114]">
      {/* ── 1. HERO BANNER SECTION ── */}
      <section className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center bg-[#1B0F08] overflow-hidden">
        {/* Panoramic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-mandi-dark.jpg"
            alt="Fatehpuri Mandi Dry Fruits Wholesale"
            fill
            priority
            className="object-cover object-center lg:object-right opacity-95"
          />
          {/* Subtle left gradient overlay to ensure text contrast while retaining the right market view */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#140B05] via-[#140B05]/85 to-transparent sm:w-3/5" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="max-w-2xl text-white space-y-5">
            {/* Top gold tag */}
            <p className="text-xs sm:text-sm font-bold tracking-widest text-[#E5A93C] uppercase">
              DIRECT FROM FATEHPURI MANDI
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              Wholesale Dry Fruits <br />
              <span className="font-serif italic font-normal text-[#E5A93C]">for Businesses</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-200/90 leading-relaxed max-w-xl">
              Premium quality dry fruits with competitive bulk pricing from Fatehpuri, Delhi.
            </p>

            {/* 5 Circular Badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              {/* 1. Competitive Bulk Pricing */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#E5A93C]/70 flex items-center justify-center text-[#E5A93C] shrink-0 bg-[#2A180E]/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-200 leading-tight">
                  Competitive<br />Bulk Pricing
                </span>
              </div>

              {/* 2. Consistent Quality */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#E5A93C]/70 flex items-center justify-center text-[#E5A93C] shrink-0 bg-[#2A180E]/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 12L2 9z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-200 leading-tight">
                  Consistent<br />Quality
                </span>
              </div>

              {/* 3. Large Inventory */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#E5A93C]/70 flex items-center justify-center text-[#E5A93C] shrink-0 bg-[#2A180E]/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-200 leading-tight">
                  Large<br />Inventory
                </span>
              </div>

              {/* 4. Pan India Delivery */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#E5A93C]/70 flex items-center justify-center text-[#E5A93C] shrink-0 bg-[#2A180E]/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-200 leading-tight">
                  Pan India<br />Delivery
                </span>
              </div>

              {/* 5. Reliable Supply */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#E5A93C]/70 flex items-center justify-center text-[#E5A93C] shrink-0 bg-[#2A180E]/60">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-200 leading-tight">
                  Reliable<br />Supply
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToQuoteForm}
                className="bg-[#F5DCA8] hover:bg-[#EDCF94] text-[#2C2114] font-bold text-sm sm:text-base px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Get Wholesale Quote</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUSTED BY VARIOUS BUSINESSES GRID ── */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FAF2E6] border border-[#ECD9BD] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#8C5D17] tracking-wider uppercase mb-3">
            <span>✦</span>
            <span>OUR B2B CUSTOMERS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F140D]">
            Trusted by Various Businesses
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto mt-2 mb-10">
            Supplying premium dry fruits to retailers, restaurants, hotels, caterers, sweet shops and corporate clients.
          </p>

          {/* 6 Sector Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {B2B_SECTORS.map((sector) => (
              <div
                key={sector.title}
                className="group flex flex-col text-center bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-3 shadow-xs">
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#1F140D] mb-1">{sector.title}</h3>
                <p className="text-[11px] text-gray-500 leading-snug px-1">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SPLIT SECTION: WHY CHOOSE BANSAL FOODS + BOWL + REQUEST QUOTE FORM ── */}
      <section id="quote-form" className="relative py-14 sm:py-20 bg-[#1E110A] text-white overflow-hidden">
        {/* Center Wooden Dry Fruit Bowl (Positioned elegantly between the left features and right form) */}
        <div className="hidden lg:block absolute left-[55%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-4 border-[#3A2315] z-10 pointer-events-none opacity-90 xl:opacity-100">
          <Image
            src="/b2b-bowl.jpg"
            alt="Assorted Premium Dry Fruits Bowl"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Why Choose Bansal Foods (7 cols) */}
            <div className="lg:col-span-7 space-y-6 lg:pr-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#362114] border border-[#523321] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#E5A93C] tracking-wider uppercase">
                <span>✦</span>
                <span>WHY CHOOSE BANSAL FOODS</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                Your Trusted Wholesale <br />
                Partner in Dry Fruits
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-xl">
                For generations, Bansal Foods has been a trusted source of premium dry fruits from the historic Fatehpuri Mandi, Delhi. We provide authentic quality, competitive pricing and reliable supply to businesses across India.
              </p>

              {/* 6 Value Points (2 columns x 3 rows) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 pt-4">
                {VALUE_PROPS.map((prop) => (
                  <div key={prop.title} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#362114] border border-[#593721] text-[#E5A93C] flex items-center justify-center shrink-0">
                      {prop.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{prop.title}</h4>
                      <p className="text-xs text-amber-100/70 mt-0.5 leading-snug">{prop.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Request Wholesale Quote Form (5 cols) */}
            <div className="lg:col-span-5 relative z-20">
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-[#1F140D] shadow-2xl">
                {/* Form Tag */}
                <div className="inline-flex items-center gap-1.5 bg-[#FAF2E6] border border-[#ECD9BD] px-3 py-0.5 rounded-full text-[10px] font-bold text-[#8C5D17] tracking-wider uppercase mb-2">
                  <span>✦</span>
                  <span>WHOLESALE INQUIRY</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F140D]">
                  Request Wholesale Quote
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-5">
                  Get the best bulk pricing for your business requirements.
                </p>

                {submitted ? (
                  <div className="p-6 bg-[#F3FAF4] border border-[#BDE3C4] rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 bg-[#15803D] text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                      ✓
                    </div>
                    <h4 className="font-bold text-[#15803D] text-lg">Inquiry Received!</h4>
                    <p className="text-xs text-gray-600">
                      Thank you, {formData.fullName || 'Valued Partner'}. Our wholesale desk will review your requirement and share competitive mandi rates within 2 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-[#8B1E1E] font-bold underline mt-2"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Row 1: Full Name & Business Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="Enter business name"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                      </div>
                    </div>

                    {/* Row 2: Mobile Number & Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email (optional)"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
                        />
                      </div>
                    </div>

                    {/* Row 3: Products Required & Approx Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Products Required <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.productsRequired}
                          onChange={(e) => setFormData({ ...formData, productsRequired: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E] bg-white text-gray-700"
                        >
                          <option value="">Select products</option>
                          <option value="Mamra Almonds">Kashmiri Mamra Almonds</option>
                          <option value="Premium Cashews">W320 Premium Cashews</option>
                          <option value="Iranian Pistachios">Iranian Green Pistachios</option>
                          <option value="California Walnuts">California Walnuts</option>
                          <option value="Premium Raisins">Premium Raisins (Kishmish)</option>
                          <option value="Ajwa Dates">Ajwa Premium Dates</option>
                          <option value="Mixed Assorted">Mixed Dry Fruits Assortment</option>
                          <option value="All Catalog">All Products / General Inquiry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Approx Quantity <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.approxQuantity}
                          onChange={(e) => setFormData({ ...formData, approxQuantity: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E] bg-white text-gray-700"
                        >
                          <option value="">Select quantity range</option>
                          <option value="25-50 kg">25 – 50 kg</option>
                          <option value="50-100 kg">50 – 100 kg</option>
                          <option value="100-250 kg">100 – 250 kg</option>
                          <option value="250-500 kg">250 – 500 kg</option>
                          <option value="500kg-1ton">500 kg – 1 Ton</option>
                          <option value="1ton+">1 Ton+ (Bulk Container)</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Message (Optional) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your specific requirements..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#8B1E1E] focus:ring-1 focus:ring-[#8B1E1E]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 bg-[#8B1E1E] hover:bg-[#721818] text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
                    >
                      <span>{submitting ? 'Submitting...' : 'Request Wholesale Quote'}</span>
                      <span className="text-base">→</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. LOWER SPLIT: COMPETITIVE BULK PRICING + ORDERING PROCESS ── */}
      <section className="py-14 sm:py-18 bg-[#FAF7F2] border-b border-[#EFE8DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Competitive Bulk Pricing Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E9DAC7] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#FAF2E6] border border-[#ECD9BD] px-3 py-0.5 rounded-full text-[10px] font-bold text-[#8C5D17] tracking-wider uppercase mb-1.5">
                    <span>✦</span>
                    <span>WHOLESALE PRICING (EXAMPLE)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F140D]">
                    Competitive Bulk Pricing
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Special rates for bulk orders. Contact us for customized quotes.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors"
                >
                  View All Products
                </Link>
              </div>

              {/* Responsive Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-bold">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-2 text-right">1 kg</th>
                      <th className="py-2.5 px-2 text-right">5 kg</th>
                      <th className="py-2.5 px-2 text-right">10 kg</th>
                      <th className="py-2.5 px-2 text-right">25 kg</th>
                      <th className="py-2.5 px-2 text-right font-bold text-[#1F140D]">50 kg+</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {PRICING_DATA.map((row) => (
                      <tr key={row.name} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#1F140D]">{row.name}</td>
                        <td className="py-3 px-2 text-right text-gray-600">{row.p1kg}</td>
                        <td className="py-3 px-2 text-right text-gray-600">{row.p5kg}</td>
                        <td className="py-3 px-2 text-right text-gray-600">{row.p10kg}</td>
                        <td className="py-3 px-2 text-right text-gray-600">{row.p25kg}</td>
                        <td className="py-3 px-2 text-right font-medium text-[#1F140D]">{row.p50kg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                * Prices are indicative and may vary based on quantity, quality and market rates. Contact us for latest wholesale rates.
              </p>
            </div>

            {/* Right: Easy Wholesale Ordering Process (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#FAF2E6] border border-[#ECD9BD] px-3 py-0.5 rounded-full text-[10px] font-bold text-[#8C5D17] tracking-wider uppercase mb-1.5">
                  <span>✦</span>
                  <span>HOW IT WORKS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F140D]">
                  Easy Wholesale Ordering Process
                </h3>
              </div>

              {/* 4 Steps Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                {ORDER_STEPS.map((item) => (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center mb-2 shadow-sm">
                      {item.step}
                    </div>
                    <h5 className="font-bold text-xs text-[#1F140D]">{item.title}</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Pan India Delivery Highlight Card */}
              <div className="bg-[#F8EFE4] border border-[#E9DAC8] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-[#E8D4BE] text-[#52331C] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>

                <div className="space-y-1 pr-14">
                  <h4 className="font-bold text-sm text-[#1F140D]">Pan India Delivery</h4>
                  <p className="text-xs text-gray-600 leading-snug">
                    We deliver to all major cities and towns across India with secure packaging and reliable logistics partners.
                  </p>
                </div>

                {/* India Map Silhouette Illustration */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-35 pointer-events-none text-[#8C5D17]">
                  <svg width="70" height="85" viewBox="0 0 100 125" fill="currentColor">
                    <path d="M 43,5 C 46,4 51,7 50,11 C 49,15 44,18 43,22 C 42,26 48,27 52,28 C 56,29 64,26 70,30 C 75,34 81,37 83,42 C 85,46 88,48 94,48 C 96,51 94,56 89,58 C 86,59 84,62 82,65 C 79,69 77,74 74,78 C 70,83 66,90 62,96 C 58,103 54,113 50,120 C 47,121 46,118 45,114 C 42,106 38,97 34,91 C 30,85 24,80 20,74 C 16,68 12,65 10,60 C 8,55 12,50 16,47 C 20,44 24,42 27,38 C 30,34 32,29 34,24 C 36,19 37,13 40,8 Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CLIENT TESTIMONIALS ── */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FAF2E6] border border-[#ECD9BD] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#8C5D17] tracking-wider uppercase mb-3">
            <span>✦</span>
            <span>CLIENT TESTIMONIALS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F140D]">
            What Our B2B Clients Say
          </h2>

          {/* 3 Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-[#F59E0B] text-sm mb-3">
                    {'★★★★★'}
                  </div>
                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#64748B] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#1F140D]">{t.name}</h5>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
