'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShippingPolicyPage() {
  const router = useRouter();
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackError, setTrackError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackOrderId.trim();
    if (!trimmed) {
      setTrackError('Please enter a valid Order ID (e.g. BF2026100100123)');
      return;
    }
    setTrackError('');
    router.push(`/orders/track?orderId=${encodeURIComponent(trimmed)}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 4 Shipping at a Glance Cards
  const glanceCards = [
    {
      id: 'packaging',
      title: 'Secure Packaging',
      description: 'Orders are carefully packed before dispatch.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      id: 'delivery',
      title: 'Reliable Delivery',
      description: 'Delivery options depend on destination and availability.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      id: 'tracking',
      title: 'Order Tracking',
      description: 'Track your order from dispatch to delivery.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
    {
      id: 'security',
      title: 'Secure Ordering',
      description: 'Your order and payment information is handled securely.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
    },
  ];

  // 6 Shipping Process Steps
  const processSteps = [
    {
      step: 1,
      title: 'ORDER PLACED',
      description: 'Your order is received and payment/order details are confirmed.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
      ),
    },
    {
      step: 2,
      title: 'ORDER PROCESSING',
      description: 'Products are picked and prepared for packing.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      step: 3,
      title: 'QUALITY & PACKING',
      description: 'Items are checked and securely packed.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
    },
    {
      step: 4,
      title: 'DISPATCHED',
      description: 'Your order is handed over for delivery.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      step: 5,
      title: 'OUT FOR DELIVERY',
      description: 'The delivery partner brings your order to the provided address.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
    {
      step: 6,
      title: 'DELIVERED',
      description: 'Your order reaches you.',
      icon: (
        <svg className="w-6 h-6 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
  ];

  // 9 Delivery Information Cards
  const infoCards = [
    {
      title: 'Delivery Areas',
      description: 'We currently deliver across India. Delivery options are shown during checkout based on your location.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
    {
      title: 'Delivery Timelines',
      description: 'Estimated delivery time is shown during checkout based on your delivery location and order.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      title: 'Shipping Charges',
      description: 'Applicable shipping charges (if any) are shown at checkout based on your delivery address, weight and order.',
      icon: (
        <span className="text-base font-bold text-[#A66224] leading-none">₹</span>
      ),
    },
    {
      title: 'Order Processing',
      description: 'Orders are first processed and packed before dispatch. Processing time may vary based on product availability, order volume and festive periods.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      ),
    },
    {
      title: 'Tracking',
      description: 'You can track your order using the Order ID on our website. Tracking details will be updated once your order is dispatched.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      title: 'Delivery Attempts',
      description: 'Our delivery partner will attempt delivery as per their standard process. In case of failed delivery, they may re-attempt or contact you.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
      ),
    },
    {
      title: 'Address Changes',
      description: 'If you need to change your delivery address, please contact our support team as soon as possible before dispatch.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
    },
    {
      title: 'Special Locations',
      description: 'Delivery to remote or difficult-to-reach locations may take longer and is subject to courier serviceability.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
        </svg>
      ),
    },
    {
      title: 'Bulk/Wholesale Orders',
      description: 'For bulk orders, delivery timelines and shipping charges may differ. Please contact us for assistance.',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
    },
  ];

  // 7 FAQ items
  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Delivery usually takes 1–2 business days for Delhi NCR, 2–3 business days for major metro cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad), and 3–5 business days for other serviceable pin codes across India.',
    },
    {
      q: 'Do you deliver across India?',
      a: 'Yes, Bansal Foods delivers to over 19,000+ PIN codes across India through our verified logistics partners including BlueDart, Delhivery, DTDC, and India Post Speed Post.',
    },
    {
      q: 'How are shipping charges calculated?',
      a: 'All orders valued at ₹999 or above qualify for FREE standard shipping across India. For orders below ₹999, a nominal shipping charge of ₹80 is applied at checkout based on weight and destination.',
    },
    {
      q: 'Can I track my order?',
      a: 'Yes! As soon as your order is dispatched from our Fatehpuri central mandi warehouse, a tracking number and tracking link are sent via SMS and email. You can also enter your Order ID directly in the tracking box above.',
    },
    {
      q: 'Can I change my delivery address?',
      a: 'You can update your delivery address as long as the order has not been dispatched. Please call us at 9313321535 or send a WhatsApp message with your Order ID immediately.',
    },
    {
      q: 'What happens if I miss my delivery?',
      a: 'Our courier partner will make up to three delivery attempts. The delivery associate will typically call the phone number provided before arrival. You can also reschedule via the courier link.',
    },
    {
      q: 'What if my order arrives damaged?',
      a: 'We pack all dry fruits in tamper-evident food-grade vacuum pouches. If you notice any carton damage or seal tampering upon arrival, please take photos/unboxing video and contact us within 24 hours at info@bansalfoods.in or WhatsApp. We will promptly arrange a replacement.',
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
            <span className="text-[#332219] font-medium">Shipping Policy</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading and intro */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#6E1A1A] tracking-tight leading-[1.15]">
                Shipping Policy
              </h1>
              <p className="text-base sm:text-lg text-[#554D45] leading-relaxed max-w-xl font-normal">
                Everything you need to know about how we pack, process and deliver your Bansal Foods order.
              </p>
            </div>

            {/* Right Column: Parcel box illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] h-[220px] sm:h-[260px] rounded-2xl overflow-hidden shadow-lg border border-[#E9DAC6]">
                <Image
                  src="/shipping-parcel-box.jpg"
                  alt="Bansal Foods Safe Packaging & Fast Delivery"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. SHIPPING AT A GLANCE
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#2C1A14] mb-6">
          Shipping at a Glance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {glanceCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-[#EFE7DC] p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#2C1A14] text-sm sm:text-base leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-[#6B635B] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. OUR SHIPPING PROCESS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#6E1A1A]">
            Our Shipping Process
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            From our store in Fatehpuri to your doorstep, we ensure your dry fruits are packed with care and delivered safely.
          </p>
        </div>

        {/* 6 Step Horizontal Flow on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
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
          4. DELIVERY INFORMATION (3x3 Grid)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#6E1A1A]">
            Delivery Information
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            Find details about our delivery areas, timelines, shipping charges and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {infoCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] rounded-xl border border-[#EFE7DC] p-5 sm:p-6 flex items-start gap-4 hover:border-[#D9C4A8] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center shrink-0 mt-0.5">
                {card.icon}
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="font-bold text-[#2C1A14] text-sm sm:text-base">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6B635B] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. THREE-BOX MIDDLE SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Box 1: When does my order ship? */}
          <div className="bg-white rounded-xl border border-[#EFE7DC] p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#2C1A14]">
                  When does my order ship?
                </h3>
              </div>
              
              <p className="text-xs text-[#6B635B] leading-relaxed pt-1">
                Your order is first processed and packed carefully before it is handed over to our delivery partner. Processing time may vary depending on:
              </p>

              <ul className="space-y-2 text-xs text-[#4A4540] pl-1 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Product availability</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Order volume</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Delivery location</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Holidays and festive periods</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Box 2: Track Your Order (Interactive) */}
          <div className="bg-white rounded-xl border border-[#EFE7DC] p-6 flex flex-col justify-center shadow-xs">
            <div className="text-center sm:text-left space-y-1 mb-4">
              <h3 className="font-bold text-xl text-[#2C1A14]">
                Track Your Order
              </h3>
              <p className="text-xs text-[#6B635B]">
                Enter your Order ID to check the latest status.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={trackOrderId}
                  onChange={(e) => {
                    setTrackOrderId(e.target.value);
                    if (trackError) setTrackError('');
                  }}
                  placeholder="Enter Order ID (e.g. BF2026100100123)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[#6E1A1A] focus:ring-1 focus:ring-[#6E1A1A] bg-white text-[#2C1A14] placeholder:text-gray-400 transition-colors"
                />
                {trackError && (
                  <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{trackError}</p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button
                  type="submit"
                  className="bg-[#6E1A1A] hover:bg-[#581313] active:bg-[#450e0e] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Track Order</span>
                  <span>→</span>
                </button>

                <Link
                  href="/account"
                  className="text-xs sm:text-sm font-semibold text-[#6E1A1A] hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>View My Orders</span>
                  <span>→</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Box 3: Unexpected Delays */}
          <div className="bg-white rounded-xl border border-[#EFE7DC] p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF0E2] border border-[#F1E0C9] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#2C1A14]">
                  Unexpected Delays
                </h3>
              </div>

              <p className="text-xs text-[#6B635B] leading-relaxed pt-1">
                While we strive to deliver on time, occasional delays may occur due to:
              </p>

              <ul className="space-y-1.5 text-xs text-[#4A4540] pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Weather conditions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Traffic or courier disruptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Public holidays</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>High seasonal demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A66224] shrink-0" />
                  <span>Incorrect or incomplete address</span>
                </li>
              </ul>

              <p className="text-[11px] text-[#8C8379] italic pt-1">
                We appreciate your understanding and patience in such situations.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. IMPORTANT DELIVERY NOTES & FAQ (2 Columns)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Important Delivery Notes (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#8C5D24] text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#2C1A14]">
                Important Delivery Notes
              </h3>
            </div>
            
            <p className="text-xs text-[#6B635B] mb-5 leading-relaxed">
              To ensure a smooth delivery experience, please keep the following in mind:
            </p>

            <ul className="space-y-3.5">
              {[
                'Please provide a complete and accurate delivery address.',
                'Ensure your mobile number is reachable.',
                'Check your order details before confirming payment.',
                'Keep your order ID for tracking.',
                'Inspect packages at delivery where applicable.',
              ].map((note, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-xs sm:text-[13px] text-[#4A4540] leading-snug">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Frequently Asked Questions (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#EFE7DC] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#8C5D24] text-white flex items-center justify-center shrink-0 font-bold text-sm">
                ?
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-[#2C1A14]">
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

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. NEED HELP WITH YOUR DELIVERY? BOTTOM BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#FAF4EB] border border-[#EADAC5] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
          
          {/* Left: Thumbnail & Text */}
          <div className="flex items-center gap-4 text-center md:text-left w-full md:w-auto justify-center md:justify-start">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs">
              <Image
                src="/product-mix.jpg"
                alt="Bansal Foods Dry Fruits"
                fill
                className="object-cover object-center"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#331C10]">
                Need Help With Your Delivery?
              </h3>
              <p className="text-xs sm:text-sm text-[#6B635B]">
                Our support team is here to help.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons & Phone */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
            {/* Track Order Button */}
            <Link
              href="/orders/track"
              className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Track Order
            </Link>

            {/* Contact Support Button */}
            <Link
              href="/contact"
              className="bg-transparent hover:bg-white text-[#331C10] border border-[#D4C3AC] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact Support
            </Link>

            {/* WhatsApp Us Button */}
            <a
              href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20need%20help%20with%20my%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.749 0-3.393-.454-4.832-1.248l-5.168 1.352 1.378-5.035c-.886-1.488-1.378-3.218-1.378-5.069 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
              </svg>
              <span>WhatsApp Us</span>
            </a>

            {/* Phone Numbers */}
            <a
              href="tel:9313321535"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#331C10] hover:text-[#6E1A1A] transition-colors ml-1 whitespace-nowrap"
            >
              <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72c.153.925.36 1.835.62 2.726a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.891.26 1.8.467 2.726.62A2 2 0 0122 16.92z"/>
              </svg>
              <span>9313321535 | 701119609</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}
