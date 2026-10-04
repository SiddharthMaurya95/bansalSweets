'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReturnsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Damaged Product');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 4 Policy Summary Cards
  const policyCards = [
    {
      id: 'returns',
      title: 'Returns',
      description: 'Information about eligible returns and the return process.',
      linkText: 'View Return Policy',
      targetId: 'return-process',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
      ),
    },
    {
      id: 'refunds',
      title: 'Refunds',
      description: 'Details about refund approval, processing and payment methods.',
      linkText: 'View Refund Policy',
      targetId: 'how-refunds-work',
      icon: (
        <span className="text-xl font-bold text-[#A66224] leading-none">₹</span>
      ),
    },
    {
      id: 'cancellation',
      title: 'Cancellation',
      description: 'Information about cancelling your order based on order status.',
      linkText: 'View Cancellation Policy',
      targetId: 'order-cancellation',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
    },
    {
      id: 'damaged',
      title: 'Damaged Orders',
      description: 'What to do if you receive a damaged, defective or incorrect product.',
      linkText: 'View Guidelines',
      targetId: 'damaged-product',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
  ];

  // 5 Process Steps
  const processSteps = [
    {
      step: 1,
      title: 'CONTACT SUPPORT',
      description: 'Contact Bansal Foods regarding your issue.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0118 0v6"/>
          <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
        </svg>
      ),
    },
    {
      step: 2,
      title: 'SHARE ORDER DETAILS',
      description: 'Provide your order ID and relevant information.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      step: 3,
      title: 'REVIEW',
      description: 'The request is reviewed according to the applicable policy.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      step: 4,
      title: 'APPROVAL',
      description: 'If eligible, the return/replacement process is initiated.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
    },
    {
      step: 5,
      title: 'RESOLUTION',
      description: 'Replacement/refund is processed as applicable.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
    },
  ];

  // 5 Return Eligibility Categories
  const returnCategories = [
    {
      title: 'Damaged Product',
      image: '/product-walnuts.jpg',
      icon: (
        <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      note: 'Outer carton or vacuum pouch punctured or physically broken upon transit.',
    },
    {
      title: 'Incorrect Product',
      image: '/product-cashews.jpg',
      icon: (
        <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
      ),
      note: 'Received a different variant, grade, or weight than the items ordered.',
    },
    {
      title: 'Missing Item',
      image: '/product-mix.jpg',
      icon: (
        <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
        </svg>
      ),
      note: 'Order parcel delivered with missing packages or incorrect quantity counts.',
    },
    {
      title: 'Quality-related Issue',
      image: '/product-almonds.jpg',
      icon: (
        <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      ),
      note: 'Taste, moisture, or freshness discrepancy reported within 48 hours.',
    },
    {
      title: 'Other Eligible Cases',
      image: '/almonds-roasted.jpg',
      icon: (
        <span className="font-bold text-[#A66224] tracking-widest text-sm leading-none">•••</span>
      ),
      note: 'Non-delivery, carrier loss, or special authorization by Bansal Foods support.',
    },
  ];

  // 5 Step Refund Process Subflow
  const refundSteps = [
    {
      label: 'Request\nInitiated',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    },
    {
      label: 'Review\n& Verification',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      label: 'Approval',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
    },
    {
      label: 'Refund\nInitiated',
      icon: (
        <span className="text-base font-bold text-[#A66224]">₹</span>
      ),
    },
    {
      label: 'Payment Provider\nProcessing',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
  ];

  // 7 FAQs
  const faqs = [
    {
      q: 'Can I cancel my order?',
      a: 'Orders can be cancelled before they are processed or dispatched from our Khari Baoli central mandi facility. Once an order is handed over to the courier partner, cancellation is not possible.',
    },
    {
      q: 'How do I request a return?',
      a: 'To request a return or replacement, contact our customer support team via phone (9313321535), WhatsApp, or email within 48 hours of delivery. Please have your Order ID and clear unboxing photos/video ready.',
    },
    {
      q: 'What if I receive the wrong product?',
      a: 'If you receive an incorrect product, inform us immediately. We will arrange a free reverse pickup and expedite the dispatch of your correct dry fruits order at no extra charge.',
    },
    {
      q: 'What if my product arrives damaged?',
      a: 'All our dry fruits are vacuum-sealed in heavy-duty food-grade packaging. If the outer shipping box or vacuum seal arrives damaged or severed, please do not accept the package or take photos immediately and contact our support team.',
    },
    {
      q: 'How will I receive my refund?',
      a: 'Refunds are credited directly to your original payment method (Credit/Debit Card, Net Banking, or UPI). For Cash on Delivery (COD) orders, our support team will request your bank account details or UPI ID for direct NEFT/IMPS transfer.',
    },
    {
      q: 'How long does a refund take?',
      a: 'Once approved, refunds are initiated within 24–48 hours. Depending on your bank or payment gateway, the amount typically reflects in your account within 3–7 business days.',
    },
    {
      q: 'Who should I contact about a return?',
      a: 'You can contact our dedicated support team via phone at 9313321535 or 701119609, via WhatsApp, or email us at shashwatbansal2610@gmail.com. We are available Monday to Saturday (9:30 AM – 7:30 PM) and Sunday (9:30 AM – 4:00 PM).',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2114] font-sans pb-16">
      
      {/* ══════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full border-b border-[#EFE5D4] bg-[#FAF5EB]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb */}
          <nav className="text-xs text-[#8C827A] flex items-center gap-1.5 mb-6 font-medium">
            <Link href="/" className="hover:text-[#6E1A1A] transition-colors">Home</Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-[#332219] font-medium">Return &amp; Refund</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading and intro */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#6E1A1A] tracking-tight leading-[1.15]">
                Returns &amp; Refunds
              </h1>
              <p className="text-base sm:text-lg text-[#554D45] leading-relaxed max-w-xl font-normal">
                Here is everything you need to know about cancellations, returns, replacements and refunds.
              </p>
            </div>

            {/* Right Column: Parcel box illustration with Quality Badge */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] h-[220px] sm:h-[260px] rounded-2xl overflow-hidden shadow-lg border border-[#E9DAC6]">
                <Image
                  src="/shipping-parcel-box.jpg"
                  alt="Bansal Foods Returns & Refunds Policy"
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Floating Pill Badge: Quality Products | Happy Customers */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md border border-[#E8D6BF] rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-[#1F140D] leading-tight">Quality Products</p>
                    <p className="text-[10px] text-[#7A6455] leading-tight">Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. POLICY SUMMARY (4 Cards)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#2C1A14] mb-1">
          Policy Summary
        </h2>
        <p className="text-xs sm:text-sm text-[#6B635B] mb-6">
          A quick overview of our return, refund, cancellation and replacement policies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {policyCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-[#EFE7DC] p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#D9C4A8] transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-[#2C1A14] text-base mb-1.5">
                  {card.title}
                </h3>
                <p className="text-xs text-[#6B635B] leading-relaxed mb-4">
                  {card.description}
                </p>
              </div>

              <a
                href={`#${card.targetId}`}
                onClick={(e) => scrollToSection(e, card.targetId)}
                className="text-xs font-semibold text-[#6E1A1A] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>{card.linkText}</span>
                <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. RETURN & REFUND PROCESS (5 Steps)
      ══════════════════════════════════════════════════════════ */}
      <section id="return-process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-6">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#6E1A1A]">
            Return &amp; Refund Process
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            A simple and transparent process to help you with returns, replacements or refunds.
          </p>
        </div>

        {/* 5-Step Horizontal Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {processSteps.map((step, idx) => {
            const isLast = idx === processSteps.length - 1;
            return (
              <div key={step.step} className="flex flex-col items-center text-center relative group">
                {/* Horizontal dotted connector for desktop */}
                {!isLast && (
                  <div className="hidden lg:flex items-center absolute top-7 left-[65%] w-[70%] z-0 pointer-events-none">
                    <div className="flex-1 border-t-2 border-dotted border-[#D4C3AC]" />
                    <span className="text-[10px] text-[#A66224] -ml-1">›</span>
                  </div>
                )}

                {/* Circle Icon Container with Number Badge */}
                <div className="relative mb-3 z-10">
                  {/* Badge */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#8C2323] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {step.step}
                  </div>
                  {/* Main Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-[12px] sm:text-[13px] tracking-wide text-[#6E1A1A] uppercase mb-1.5 px-1">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-[#6B635B] leading-relaxed max-w-[170px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. TWO-COL: WHEN CAN I REQUEST + RECEIVED DAMAGED PRODUCT
      ══════════════════════════════════════════════════════════ */}
      <section id="return-eligibility" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: When Can I Request a Return? (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                  When Can I Request a Return?
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#6B635B] mb-5 leading-relaxed">
                Return eligibility, applicable time limits and product-specific conditions should be configured according to Bansal Foods&apos; final business policy.
              </p>

              {/* 5 Product Category Cards */}
              <div className="grid grid-cols-5 gap-2.5">
                {returnCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.title;
                  return (
                    <button
                      key={cat.title}
                      type="button"
                      onClick={() => setSelectedCategory(cat.title)}
                      className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#6E1A1A] bg-[#FAF3EA] ring-2 ring-[#6E1A1A]/20'
                          : 'border-[#EFE7DC] bg-[#FAF8F5] hover:border-[#D4C3AC]'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white border border-[#EAE0D3] flex items-center justify-center mb-1 shrink-0">
                        {cat.icon}
                      </div>
                      <span className="text-[10px] font-semibold text-[#2C1A14] leading-tight line-clamp-2">
                        {cat.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Category note preview */}
              {selectedCategory && (
                <div className="mt-4 p-3 bg-[#FAF5EB] border border-[#E9DAC6] rounded-xl text-xs text-[#5C554E] flex items-center gap-2">
                  <span className="font-bold text-[#6E1A1A]">{selectedCategory}:</span>
                  <span>{returnCategories.find((c) => c.title === selectedCategory)?.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Received a Damaged or Incorrect Product? (6 cols) */}
          <div id="damaged-product" className="lg:col-span-6 bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs scroll-mt-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                  Received a Damaged or Incorrect Product?
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#6B635B] mb-5 leading-relaxed">
                If you receive a damaged, defective or incorrect product, please follow the steps below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* 5 Numbered Steps */}
                <div className="sm:col-span-7 space-y-3">
                  {[
                    'Keep the product and packaging.',
                    'Contact our support team as soon as possible.',
                    'Provide your order number.',
                    'Share clear photographs where requested.',
                    'Wait for further instructions from our team.',
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#8C5D24] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#4A4540] leading-snug">
                        {text}
                      </p>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Contact Support</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Right Image: Opened shipping box with dry fruits inside */}
                <div className="sm:col-span-5">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#E2D2BE]">
                    <Image
                      src="/return-damaged-box.jpg"
                      alt="Damaged or defective parcel package verification"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. TWO-COL: HOW REFUNDS WORK + ORDER CANCELLATION
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: How Refunds Work (6 cols) */}
          <div id="how-refunds-work" className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs scroll-mt-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                  How Refunds Work
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#6B635B] mb-6 leading-relaxed">
                Once your return or cancellation is approved, the refund will be processed through your original payment method.
              </p>

              {/* 5-Step Refund Flow */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-3">
                {refundSteps.map((step, idx) => {
                  const isLast = idx === refundSteps.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center text-center shrink-0 min-w-[70px]">
                        <div className="w-11 h-11 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center mb-2 shadow-2xs">
                          {step.icon}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-[#2C1A14] leading-tight whitespace-pre-line">
                          {step.label}
                        </p>
                      </div>

                      {!isLast && (
                        <div className="flex-1 flex items-center justify-center min-w-[12px] pb-5">
                          <span className="text-[10px] text-[#D4C3AC] tracking-widest font-mono">···&gt;</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Bottom Notice Card */}
            <div className="bg-[#FAF4EB] border border-[#EADAC5] rounded-xl p-3.5 flex items-start gap-2.5 mt-5">
              <span className="w-4 h-4 rounded-full bg-[#8C5D24] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </span>
              <p className="text-xs text-[#5C554E] leading-relaxed">
                Refund eligibility, processing time and timelines may vary based on your payment method and are subject to our final business policy.
              </p>
            </div>
          </div>

          {/* Right Column: Order Cancellation (6 cols) */}
          <div id="order-cancellation" className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs scroll-mt-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0 font-bold text-sm">
                  ?
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                  Order Cancellation
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#6B635B] mb-5 leading-relaxed">
                Cancellation is subject to your order status. Please check the status of your order before requesting a cancellation.
              </p>

              {/* 3 Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Before Processing */}
                <div className="bg-[#F2F9F4] border border-[#D1EBD9] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                    <h4 className="text-xs sm:text-[13px] font-bold text-emerald-900">Before Processing</h4>
                  </div>
                  <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                    Cancellation may be possible if the order has not been processed yet.
                  </p>
                </div>

                {/* During Processing */}
                <div className="bg-[#FCF7ED] border border-[#F1E0C9] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#8C5D17]">During Processing</h4>
                  </div>
                  <p className="text-[11px] text-[#6B5034] leading-relaxed">
                    Cancellation may be limited or not available once the order is being prepared.
                  </p>
                </div>

                {/* After Dispatch */}
                <div className="bg-[#FDF2F2] border border-[#F7D3D3] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <h4 className="text-xs sm:text-[13px] font-bold text-red-900">After Dispatch</h4>
                  </div>
                  <p className="text-[11px] text-red-800/90 leading-relaxed">
                    Cancellation is usually not possible once the order has been dispatched for delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Notice Card */}
            <div className="bg-[#FAF4EB] border border-[#EADAC5] rounded-xl p-3.5 flex items-start gap-2.5 mt-5">
              <span className="w-4 h-4 rounded-full bg-[#8C5D24] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </span>
              <p className="text-xs text-[#5C554E] leading-relaxed">
                Please check your order status or contact our support team for assistance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. TWO-COL: FAQ + NEED HELP CARD
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Frequently Asked Questions (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#8C5D24] text-white flex items-center justify-center shrink-0 font-bold text-sm">
                ?
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="divide-y divide-[#EFE7DC]">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                    >
                      <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isOpen ? 'text-[#6E1A1A]' : 'text-[#2C1A14] group-hover:text-[#6E1A1A]'
                      }`}>
                        {faq.q}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 group-hover:text-[#6E1A1A] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#6E1A1A]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="pt-2.5 pr-6 text-xs sm:text-[13px] text-[#5C554E] leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Need Help with a Return or Refund? (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#EFE7DC] overflow-hidden shadow-xs">
            {/* Top Banner Image with Dry Fruits */}
            <div className="relative w-full h-[150px] sm:h-[180px] bg-[#FAF5EB]">
              <Image
                src="/return-help-banner.jpg"
                alt="Need help with return or refund - Bansal Foods"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#2C1A14]">
                  Need help with a return or refund?
                </h3>
                <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
                  Our support team is here to help.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/contact"
                  className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  Contact Support →
                </Link>

                <Link
                  href="/orders/track"
                  className="bg-transparent hover:bg-[#FAF4EB] text-[#331C10] border border-[#D4C3AC] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Track Order
                </Link>

                <a
                  href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20need%20help%20with%20a%20return%20or%20refund."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.749 0-3.393-.454-4.832-1.248l-5.168 1.352 1.378-5.035c-.886-1.488-1.378-3.218-1.378-5.069 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* Working Contact Details Row */}
              <div className="pt-3 border-t border-[#EFE7DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#4A4540]">
                {/* Phone */}
                <a
                  href="tel:9313321535"
                  className="inline-flex items-center gap-2 font-bold text-[#2C1A14] hover:text-[#6E1A1A] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72c.153.925.36 1.835.62 2.726a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.891.26 1.8.467 2.726.62A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <span>9313321535 | 701119609</span>
                </a>

                {/* Operating Timings */}
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-7 h-7 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="text-[11px] leading-tight">
                    <p>Mon - Sat: 9:30 AM - 7:30 PM</p>
                    <p>Sunday: 9:30 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
