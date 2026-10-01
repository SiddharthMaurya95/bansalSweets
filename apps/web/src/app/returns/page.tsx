'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FAQS = [
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are dispatched from our Fatehpuri godown. Once dispatched, cancellation is not possible. Please contact us immediately if you need to cancel.' },
  { q: 'How do I request a return?', a: 'Contact our support team via phone, email, or WhatsApp within 7 days of delivery. Provide your order ID and photos of the product/packaging to initiate a return.' },
  { q: 'What if I received the wrong product?', a: 'If you received a wrong product, contact us within 48 hours with photos. We will arrange a free replacement or full refund with free reverse pickup.' },
  { q: 'What if my product arrives damaged?', a: 'Do not accept packages with tamper-evident seals broken. If damage is found inside, photograph it and contact us within 48 hours. We will replace or refund immediately.' },
  { q: 'How will I receive my refund?', a: 'Refunds are processed to the original payment source. UPI/Net Banking: 3–5 working days. Credit/Debit Card: 5–7 working days. COD orders receive NEFT bank transfer within 3 working days of approval.' },
  { q: 'How long does a refund take?', a: 'After return approval and quality inspection, refunds are initiated within 2–3 working days and reflect in your account within 5–7 working days depending on your payment method.' },
  { q: 'Who should I contact about a return?', a: 'You can reach us at 9313321535, email returns@bansalfoods.in, or WhatsApp us at +91-9313321535. Our team is available Mon–Sat 9 AM to 6 PM.' },
];

const POLICY_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15l-9 9-9-9V3l9 6 9-6v12z" />
      </svg>
    ),
    title: 'Returns',
    desc: 'Information about eligible returns and the return process.',
    link: '#return-process',
    linkText: 'View Return Policy',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: 'Refunds',
    desc: 'Details about refund approval, processing and payment methods.',
    link: '#how-refunds-work',
    linkText: 'View Refund Policy',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    title: 'Cancellation',
    desc: 'Information about cancelling your order based on order status.',
    link: '#order-cancellation',
    linkText: 'View Cancellation Policy',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><line x1="12" y1="22" x2="12" y2="12" /><path d="M7.5 9.5L12 12l4.5-2.5" />
      </svg>
    ),
    title: 'Damaged Orders',
    desc: 'What to do if you receive a damaged, defective or incorrect product.',
    link: '#damaged-product',
    linkText: 'View Guidelines',
  },
];

const PROCESS_STEPS = [
  { num: '1', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72" /></svg>, title: 'CONTACT SUPPORT', desc: 'Contact Bansal Foods regarding your issue.' },
  { num: '2', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>, title: 'SHARE ORDER DETAILS', desc: 'Provide your order ID and relevant information.' },
  { num: '3', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>, title: 'REVIEW', desc: 'The request is reviewed according to the applicable policy.' },
  { num: '4', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>, title: 'APPROVAL', desc: 'If eligible, the return/replacement process is initiated.' },
  { num: '5', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'RESOLUTION', desc: 'Replacement/refund is processed as applicable.' },
];

const RETURN_CATEGORIES = [
  { label: 'Damaged Product', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg> },
  { label: 'Incorrect Product', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> },
  { label: 'Missing Item', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><line x1="12" y1="22" x2="12" y2="12" /></svg> },
  { label: 'Quality-related Issue', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
  { label: 'Other Eligible Cases', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> },
];

const REFUND_FLOW = [
  { label: 'Request\nInitiated', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
  { label: 'Review &\nVerification', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
  { label: 'Approval', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> },
  { label: 'Refund\nInitiated', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg> },
  { label: 'Payment\nProvider Processing', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> },
];

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2114]">

      {/* ════ 1. HERO BANNER ════ */}
      <section className="relative w-full min-h-[260px] sm:min-h-[300px] overflow-hidden bg-[#1B0F08]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/hero-market-scene.jpg" alt="Returns & Refunds" fill className="object-cover object-center opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B0F08]/95 via-[#1B0F08]/70 to-[#1B0F08]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="text-xs text-amber-200/70 flex items-center gap-1.5 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/40">›</span>
            <span className="text-white/90 font-medium">Return &amp; Refund</span>
          </nav>

          <div className="flex items-start justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-3">
                Returns &amp; Refunds
              </h1>
              <p className="text-sm text-gray-300/90 leading-relaxed">
                Here is everything you need to know about cancellations, returns, replacements and refunds.
              </p>
            </div>

            {/* Right badge */}
            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#C88C3C]/20 border border-[#C88C3C]/40 text-[#C88C3C] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Quality Products</p>
                <p className="text-[11px] text-amber-200/70">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 2. POLICY SUMMARY ════ */}
      <section className="py-10 sm:py-12 bg-white border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F140D]">Policy Summary</h2>
            <p className="text-sm text-gray-500 mt-1">A quick overview of our return, refund, cancellation and replacement policies.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POLICY_CARDS.map((card) => (
              <div key={card.title} className="bg-[#FAF8F5] border border-[#EFE5D4] rounded-xl p-5 hover:shadow-sm hover:border-[#C88C3C]/40 transition-all group">
                <div className="w-11 h-11 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center mb-3 group-hover:bg-[#E8C98A]/40 transition-colors">
                  {card.icon}
                </div>
                <h3 className="font-bold text-sm text-[#1F140D] mb-1.5">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.desc}</p>
                <a href={card.link} className="text-xs font-bold text-[#8C1C1C] hover:underline flex items-center gap-1 transition-colors">
                  {card.linkText} <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ 3. RETURN & REFUND PROCESS (5-step) ════ */}
      <section id="return-process" className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F140D]">Return &amp; Refund Process</h2>
            <p className="text-sm text-gray-500 mt-1">A simple and transparent process to help you with returns, replacements or refunds.</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-0 right-0 h-px bg-[#D4AF37]/40 mx-16 z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="w-16 h-16 rounded-full bg-[#8C1C1C] text-white flex flex-col items-center justify-center shadow-md mb-3 relative">
                    <span className="text-[10px] font-black leading-none mb-0.5">{step.num}</span>
                    {step.icon}
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="sm:hidden absolute -right-6 top-1/2 -translate-y-1/2 text-[#D4AF37] text-lg">›</div>
                    )}
                  </div>
                  <h4 className="text-[10px] font-black text-[#1F140D] tracking-wider leading-tight mb-1">{step.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-tight">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ 4. TWO-COL: WHEN CAN I REQUEST + DAMAGED PRODUCT ════ */}
      <section className="py-10 sm:py-12 bg-white border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: When can I request a return */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F140D]">When Can I Request a Return?</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Return eligibility, applicable time limits and product-specific conditions should be configured according to Bansal Foods' final business policy.
            </p>

            {/* Product image strip */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {['/product-almonds.jpg', '/product-cashews.jpg', '/product-pistachios.jpg', '/product-mix.jpg'].map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#EFE5D4]">
                  <Image src={img} alt="Product" width={64} height={64} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>

            {/* Category chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RETURN_CATEGORIES.map((cat) => (
                <div key={cat.label} className="flex flex-col items-center p-3 rounded-xl bg-[#FAF8F5] border border-[#EFE5D4] hover:border-[#C88C3C]/50 transition-all text-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <p className="text-[11px] font-semibold text-[#1F140D] leading-tight">{cat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Damaged or Incorrect Product */}
          <div id="damaged-product" className="bg-[#FAF8F5] border border-[#EFE5D4] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F140D]">Received a Damaged or Incorrect Product?</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              If you receive a damaged, defective or incorrect product, please follow the steps below:
            </p>

            <ol className="space-y-3 mb-6">
              {[
                'Keep the product and packaging.',
                'Contact our support team as soon as possible.',
                'Provide your order number.',
                'Share clear photographs where requested.',
                'Wait for further instructions from our team.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-[#8C1C1C] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <span>Contact Support</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════ 5. TWO-COL: HOW REFUNDS WORK + ORDER CANCELLATION ════ */}
      <section className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: How Refunds Work */}
          <div id="how-refunds-work">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F140D]">How Refunds Work</h2>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Once your return or cancellation is approved, the refund will be processed through your original payment method.
            </p>

            {/* Refund Flow */}
            <div className="flex items-start gap-1 overflow-x-auto pb-2">
              {REFUND_FLOW.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center text-center shrink-0 w-[80px]">
                    <div className="w-10 h-10 rounded-full bg-[#FAF5EC] border-2 border-[#D4AF37]/50 text-[#7A4116] flex items-center justify-center mb-2">
                      {step.icon}
                    </div>
                    <p className="text-[10px] font-semibold text-[#1F140D] leading-tight whitespace-pre-line">{step.label}</p>
                  </div>
                  {i < REFUND_FLOW.length - 1 && (
                    <div className="flex-shrink-0 mt-5 text-[#D4AF37] text-sm font-bold">›</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                Refund eligibility, processing time and timelines may vary based on your payment method and are subject to our final business policy.
              </p>
            </div>
          </div>

          {/* Right: Order Cancellation */}
          <div id="order-cancellation">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="8 12 12 16 16 12" /><line x1="12" y1="8" x2="12" y2="16" /></svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F140D]">Order Cancellation</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Cancellation is subject to your order status. Please check the status of your order before requesting a cancellation.
            </p>

            {/* 3 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                {
                  stage: 'Before Processing',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>,
                  desc: 'Cancellation may be possible if the order has not been processed yet.',
                  color: 'bg-green-50 border-green-200 text-green-700',
                },
                {
                  stage: 'During Processing',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                  desc: 'Cancellation may be limited or not available once the order is being prepared.',
                  color: 'bg-amber-50 border-amber-200 text-amber-700',
                },
                {
                  stage: 'After Dispatch',
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
                  desc: "Cancellation is usually not possible once the order has been dispatched for delivery.",
                  color: 'bg-red-50 border-red-200 text-red-700',
                },
              ].map((card) => (
                <div key={card.stage} className={`p-4 rounded-xl border ${card.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {card.icon}
                    <p className="text-xs font-bold leading-tight">{card.stage}</p>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-80">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 bg-[#FAF5EC] border border-[#EFE5D4] rounded-lg px-4 py-3">
              <svg className="w-4 h-4 text-[#8C5D17] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <p className="text-xs text-[#7A4116] leading-relaxed">
                Please check your order status or contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 6. FAQ + NEED HELP SIDE BY SIDE ════ */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left: FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-[#8C1C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
              <h2 className="text-xl font-bold text-[#1F140D]">Frequently Asked Questions</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5">Quick answers to common queries.</p>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-[#EFE5D4] rounded-xl overflow-hidden bg-[#FAF8F5] hover:border-[#C88C3C]/40 transition-colors">
                  <button
                    id={`faq-btn-${idx}`}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span className="font-semibold text-sm text-[#1F140D] pr-3">{faq.q}</span>
                    <span className={`text-[#8C1C1C] shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-[#EFE5D4] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Need Help CTA */}
          <div className="flex flex-col justify-between gap-6">
            <div className="bg-[#1B0F08] rounded-2xl overflow-hidden relative">
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <Image src="/hero-dry-fruits.jpg" alt="Need help" fill className="object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B0F08]/90 to-[#1B0F08]/70" />
              </div>

              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#C88C3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12" /></svg>
                  <h3 className="text-lg font-bold text-white">Need help with a return or refund?</h3>
                </div>
                <p className="text-xs text-gray-300/80 mb-6">Our support team is here to help.</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Link href="/contact" className="bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72" /></svg>
                    Contact Support
                  </Link>
                  <Link href="/orders/track" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    Track Order
                  </Link>
                  <a
                    href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods,%20I%20need%20help%20with%20a%20return."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" /></svg>
                    WhatsApp Us
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300/80">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#C88C3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12" /></svg>
                    9313321535 | 701119609
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#C88C3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Mon–Sat: 9:00 AM – 6:00 PM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#C88C3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Sunday: 10:00 AM – 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Quick links bottom */}
            <div className="bg-[#FAF8F5] border border-[#EFE5D4] rounded-xl p-5">
              <h4 className="font-bold text-sm text-[#1F140D] mb-3">Related Policies</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Shipping Policy', href: '/shipping-policy' },
                  { label: 'Track My Order', href: '/orders/track' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'About Us', href: '/about' },
                ].map((lnk) => (
                  <Link key={lnk.href} href={lnk.href} className="text-xs text-[#8C1C1C] font-semibold hover:underline flex items-center gap-1">
                    <span>→</span> {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
