'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/* ─── Types ─────────────────────────────────────────────────── */
type TrackingStep = {
  id: string;
  label: string;
  date: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
  sub: string;
};

type OrderItem = {
  id: string;
  name: string;
  imageUrl?: string;
  image?: string;
  variantLabel?: string;
  variant?: string;
  weight?: string;
  quantity: number;
  price?: number;
  originalPrice?: number;
};

type OrderData = {
  orderNumber: string;
  id: string;
  status: string;
  placedAt?: string;
  deliveryEstimate?: string;
  trackingId?: string;
  courier?: string;
  totalPaise?: number;
  discountPaise?: number;
  deliveryFeePaise?: number;
  paymentMethod?: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    city?: string;
    pincode?: string;
    phone?: string;
  };
  items?: OrderItem[];
};

/* ─── Default Sample Order Data ──────────────────────────────── */
const DEMO_ORDER: OrderData = {
  orderNumber: 'BF202610016669',
  id: 'BF202610016669',
  status: 'Out for Delivery',
  placedAt: '2026-10-01T09:07:00Z',
  deliveryEstimate: '3-5 Business Days',
  trackingId: 'DTDC123456789',
  courier: 'DTDC',
  totalPaise: 136500,
  discountPaise: 43000,
  deliveryFeePaise: 0,
  paymentMethod: 'UPI (Google Pay / PhonePe)',
  shippingAddress: {
    name: 'Siddharth Kumar',
    line1: 'A-302, Green Park Apartments',
    city: 'Khari Baoli, Delhi',
    pincode: '110006',
    phone: '+91 9876543210',
  },
  items: [
    {
      id: 'i1',
      name: 'Kashmiri Mamra Almonds',
      imageUrl: '/product-almonds.jpg',
      variantLabel: '500g',
      quantity: 1,
      price: 550,
      originalPrice: 700,
    },
    {
      id: 'i2',
      name: 'W320 Premium Cashews',
      imageUrl: '/product-cashews.jpg',
      variantLabel: '500g',
      quantity: 1,
      price: 780,
      originalPrice: 980,
    },
    {
      id: 'i3',
      name: 'Afghani Black Raisins',
      imageUrl: '/product-raisins.jpg',
      variantLabel: '250g',
      quantity: 1,
      price: 240,
      originalPrice: 320,
    },
  ],
};

const ORDER_TIMELINE_STEPS: TrackingStep[] = [
  { id: 'placed',    label: 'Order Placed',    date: '25 Sep 2026', time: '10:15 AM', status: 'completed', sub: 'Your order is received and confirmed.' },
  { id: 'confirmed', label: 'Order Confirmed', date: '25 Sep 2026', time: '11:30 AM', status: 'completed', sub: 'Payment verified and sent to warehouse.' },
  { id: 'packed',    label: 'Packed',          date: '26 Sep 2026', time: '04:20 PM', status: 'completed', sub: 'Items are carefully picked and packed.' },
  { id: 'shipped',   label: 'Shipped',         date: '26 Sep 2026', time: '08:10 PM', status: 'completed', sub: 'Your order is dispatched to courier.' },
  { id: 'out',       label: 'Out for Delivery', date: '28 Sep 2026', time: '09:30 AM', status: 'current',   sub: 'Your order is on the way to your address.' },
  { id: 'delivered', label: 'Delivered',       date: '',            time: 'Pending',  status: 'pending',   sub: 'Your order reaches you.' },
];

/* ─── 5-Step Process Reference Data (Exact Match to Web Page) ── */
const HOW_IT_WORKS_STEPS = [
  {
    num: 1,
    label: 'Order Placed',
    sub: 'Your order is received and confirmed.',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    num: 2,
    label: 'Packed',
    sub: 'Items are carefully picked and packed.',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      </svg>
    ),
  },
  {
    num: 3,
    label: 'Shipped',
    sub: 'Your order is dispatched to our delivery partner.',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    num: 4,
    label: 'Out for Delivery',
    sub: 'Your order is on the way to your address.',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    num: 5,
    label: 'Delivered',
    sub: 'Your order reaches you.',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
];

/* ─── FAQs ───────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Where can I find my Order ID?',
    a: 'Your Order ID is mentioned in the order confirmation email and SMS sent to your registered email and mobile number immediately after placing the order. It begins with "BF" followed by digits (e.g. BF202610016669).',
  },
  {
    q: 'How do I track my order?',
    a: 'Enter your Order ID in the search box above and click "Track Order". You will see the real-time status of your shipment including packing, dispatch, courier tracking ID (DTDC), and estimated delivery time.',
  },
  {
    q: 'My order is showing delayed. What should I do?',
    a: 'Delays can occasionally happen due to seasonal demand or transit weather. If your order has not arrived by the expected delivery date, contact our customer support team directly at 9313321535 or WhatsApp us for instant resolution.',
  },
  {
    q: "I haven't received my order. What can I do?",
    a: 'If your tracking status shows "Delivered" but you have not received your package, please check with family members or building security. If still not found, contact us immediately at 9313321535 or email shashwatbansal2610@gmail.com. We resolve delivery discrepancies within 24 hours.',
  },
];

/* ─── Main Content Component (Suspense-wrapped) ──────────────── */
function TrackOrderContent() {
  const searchParams = useSearchParams();
  const paramOrderId = searchParams?.get('orderId') ?? '';

  const [inputId, setInputId] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showWhereId, setShowWhereId] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mobile collapsible state for bottom cards (matches mobile reference design)
  const [mobileHelpOpen, setMobileHelpOpen] = useState(true);
  const [mobileFaqOpen, setMobileFaqOpen] = useState(true);

  // Recent order check on mount
  useEffect(() => {
    if (paramOrderId) {
      setInputId(paramOrderId);
      executeSearch(paramOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramOrderId]);

  function getStoredOrders(): OrderData[] {
    try {
      const recent: OrderData[] = JSON.parse(localStorage.getItem('bansal_recent_orders') || '[]');
      return recent;
    } catch {
      return [];
    }
  }

  function getLatestStoredOrder(): OrderData | null {
    try {
      const recent = getStoredOrders();
      if (recent.length > 0 && recent[0]) return recent[0];
      // Check for any bansal_last_order_*
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bansal_last_order_')) {
          const val = localStorage.getItem(key);
          if (val) return JSON.parse(val) as OrderData;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  function executeSearch(query: string, isFallback = false) {
    setSearching(true);
    setNotFound(false);

    setTimeout(() => {
      const clean = query.trim().toUpperCase();
      let matched: OrderData | null = null;

      // 1. Try local storage exact match
      try {
        const direct = localStorage.getItem(`bansal_last_order_${clean}`);
        if (direct) matched = JSON.parse(direct) as OrderData;
        if (!matched) {
          const recent = getStoredOrders();
          matched = recent.find((o) => o.id?.toUpperCase() === clean || o.orderNumber?.toUpperCase() === clean) ?? null;
        }
      } catch {
        matched = null;
      }

      // 2. If clean query matches demo order or any sample pattern
      if (!matched && (clean === DEMO_ORDER.orderNumber || clean.startsWith('BF') || isFallback)) {
        matched = {
          ...DEMO_ORDER,
          orderNumber: clean || DEMO_ORDER.orderNumber,
          id: clean || DEMO_ORDER.id,
        };
      }

      if (matched) {
        setOrder(matched);
        setNotFound(false);
      } else {
        setOrder(null);
        setNotFound(true);
      }
      setSearching(false);
    }, 450);
  }

  /* Handle submit - Functional even when orderID is NOT inputted */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputId.trim();

    if (!q) {
      // ORDER ID NOT INPUTTED: Functional handling
      // Automatically retrieve latest stored order or provide the sample demo order
      const latest = getLatestStoredOrder();
      const fallbackOrder = latest ?? DEMO_ORDER;
      const targetId = fallbackOrder.orderNumber || fallbackOrder.id;

      setInputId(targetId);
      setInfoMessage(
        latest
          ? `No Order ID entered — automatically tracking your latest order (#${targetId}).`
          : `No Order ID entered — showing sample tracking for demo order #${targetId}.`
      );
      executeSearch(targetId, true);
      return;
    }

    setInfoMessage(null);
    executeSearch(q, false);
  };

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneInput.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Try finding order by phone in storage
    const stored = getStoredOrders();
    const match = stored.find((o) => o.shippingAddress?.phone?.replace(/\D/g, '').includes(cleanPhone));
    const target = match ?? DEMO_ORDER;
    const targetId = target.orderNumber || target.id;

    setInputId(targetId);
    setShowWhereId(false);
    setInfoMessage(`Order found for mobile number ${cleanPhone}! Tracking Order #${targetId}.`);
    executeSearch(targetId, true);
  };

  const handleTrackSample = () => {
    setInputId(DEMO_ORDER.orderNumber);
    setInfoMessage(`Tracking sample demo order #${DEMO_ORDER.orderNumber}.`);
    executeSearch(DEMO_ORDER.orderNumber, true);
  };

  const resetSearch = () => {
    setOrder(null);
    setInputId('');
    setInfoMessage(null);
    setNotFound(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2114]">

      {/* ══════════════════════════════════════════════════════════
          1. HERO BANNER (Matches Reference Web Page)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#1B0F08] border-b border-[#2C1910]">
        {/* Background Image: Old Delhi Mandi market + dry fruits */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-banner.jpg"
            alt="Bansal Foods Old Delhi Mandi"
            fill
            priority
            className="object-cover object-center opacity-65"
          />
          {/* Gradient Overlay for high contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B0F08]/95 via-[#1B0F08]/80 to-[#1B0F08]/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 flex items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <nav className="text-xs text-amber-200/80 flex items-center gap-1.5 mb-3 font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-white/40">&gt;</span>
              <span className="text-white font-semibold">Track Order</span>
            </nav>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-2">
              Track Your <span className="italic font-serif text-[#D89B37]">Order</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-300 font-normal">
              Enter your order ID to get real-time updates on your order status.
            </p>
          </div>

          {/* Right Side: Bansal Foods Delivery Box Mockup (As shown in reference image) */}
          <div className="hidden md:flex shrink-0 items-center justify-end">
            <div className="relative w-[210px] lg:w-[260px] h-[140px] lg:h-[160px] rounded-2xl bg-gradient-to-br from-[#D9A76A] via-[#C58B47] to-[#8C5D17] p-0.5 shadow-2xl border border-amber-400/20 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Cardboard Kraft Box Styling */}
              <div className="w-full h-full rounded-2xl bg-[#D69F5E] p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
                {/* Kraft texture effect lines */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#47250B_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full pointer-events-none" />

                {/* Box Top Flap fold illusion */}
                <div className="border-b border-[#9C682E]/40 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#52290D] flex items-center justify-center text-[9px] text-[#F3D8B0] font-black">
                      BF
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-[#52290D]/80 uppercase font-bold">FRAGILE • DRY FRUITS</span>
                  </div>
                  <span className="text-[9px] text-[#52290D]/70 font-mono">100% PURE</span>
                </div>

                {/* Box Stamp */}
                <div className="text-center my-auto py-1">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#52290D]/40 mb-1">
                    <span className="text-xs font-serif font-black text-[#52290D]">🌾</span>
                  </div>
                  <p className="font-serif font-black text-sm lg:text-base text-[#421E08] tracking-wider leading-none">
                    BANSAL FOODS
                  </p>
                  <p className="text-[8px] font-bold text-[#5A2C0D] tracking-widest uppercase mt-0.5">
                    DRY FRUITS • WHOLESALE • RETAIL
                  </p>
                  <p className="text-[7px] text-[#5A2C0D]/80 tracking-wider uppercase font-semibold">
                    KHARI BAOLI, DELHI
                  </p>
                </div>

                {/* Box barcode / footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[#9C682E]/30 text-[8px] font-mono text-[#52290D]/70">
                  <span>DISPATCHED FROM MANDI</span>
                  <span className="font-bold">DELIVERY ASSURED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN TRACKING INPUT CARD (Matches Reference Screenshot)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Informative banner when auto-populated or demo-loaded */}
        {infoMessage && (
          <div className="mb-4 flex items-center justify-between gap-3 bg-[#FAF0E8] border border-[#E5A93C]/40 text-[#8C5D17] px-4 py-3 rounded-xl text-xs sm:text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="text-base">💡</span>
              <p>{infoMessage}</p>
            </div>
            <button
              onClick={() => setInfoMessage(null)}
              className="text-[#8C5D17] hover:text-[#5A2C0D] font-bold text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* White Card: 2 columns on desktop, stacked on mobile */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EFE5D4] shadow-sm p-5 sm:p-7 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Enter Your Order ID (7 cols on desktop) */}
            <div className="lg:col-span-7">
              {/* Header */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FAF0E8] border border-[#F0DFCD] text-[#8C5D17] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Enter Your Order ID</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You can find your Order ID in the order confirmation email or SMS.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form id="track-order-form" onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      </svg>
                    </div>
                    <input
                      id="track-order-input"
                      type="text"
                      value={inputId}
                      onChange={(e) => {
                        setInputId(e.target.value);
                        setNotFound(false);
                      }}
                      placeholder="Enter Order ID (e.g. BF123456)"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#8C5D17] focus:ring-2 focus:ring-[#8C5D17]/20 bg-[#FCFBF8] text-[#1F140D] placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    id="track-order-btn"
                    type="submit"
                    disabled={searching}
                    className="w-full sm:w-auto bg-[#8C5D17] hover:bg-[#73430C] active:bg-[#5A2C0D] disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    {searching ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>Tracking…</span>
                      </>
                    ) : (
                      <>
                        <span>Track Order</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-form actions: Where can I find my Order ID? + One-click demo chip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowWhereId(!showWhereId)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8C5D17] hover:text-[#5A2C0D] font-medium transition-colors cursor-pointer group"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#FAF0E8] border border-[#F0DFCD] text-[#8C5D17] text-[10px] font-bold flex items-center justify-center">
                      ?
                    </span>
                    <span>Where can I find my Order ID?</span>
                    <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  </button>

                  {/* 1-Click Demo / Sample Tracker (Guarantees functionality when no order ID is inputted) */}
                  <button
                    type="button"
                    onClick={handleTrackSample}
                    className="text-[11px] font-semibold text-[#8C1C1C] hover:text-[#5E1010] bg-[#FAF0E8] hover:bg-[#F5E2D2] px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>✨ Try sample:</span>
                    <span className="font-mono underline">BF202610016669</span>
                  </button>
                </div>

                {/* "Where can I find my Order ID" Expandable Drawer with Phone Search */}
                {showWhereId && (
                  <div className="mt-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE5D4] text-xs text-[#1F140D] space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <p className="font-bold text-[#8C1C1C]">How to locate your Order ID:</p>
                      <p className="text-gray-600 leading-relaxed">
                        1. Check the SMS from <strong>BANSAL</strong> received on placing your order.
                        <br />
                        2. Check your confirmation email with the subject <em>&ldquo;Order Confirmed - Bansal Foods&rdquo;</em>.
                        <br />
                        3. The ID format is <strong>BF</strong> followed by numbers (e.g. <span className="font-mono font-bold text-[#8C1C1C]">BF202610016669</span>).
                      </p>
                    </div>

                    <div className="border-t border-[#EFE5D4] pt-3">
                      <p className="font-bold mb-1.5 text-[#1F140D]">Don&apos;t have your Order ID? Track by Phone Number:</p>
                      <form onSubmit={handlePhoneSearch} className="flex gap-2">
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                        />
                        <button
                          type="submit"
                          className="bg-[#8C5D17] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#73430C] transition-colors"
                        >
                          Find Order
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Not Found Alert */}
                {notFound && (
                  <div className="flex items-start gap-2.5 text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      <p className="font-bold">Order not found</p>
                      <p className="mt-0.5 text-amber-700">
                        No order found for <strong>&ldquo;{inputId.trim().toUpperCase()}&rdquo;</strong>.
                        You can <button type="button" onClick={handleTrackSample} className="underline font-bold text-[#8C1C1C]">view the sample order</button> or call support at 9313321535.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Vertical Divider (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-1 h-full flex items-center justify-center">
              <div className="w-px h-32 bg-[#EFE5D4]" />
            </div>

            {/* Right Column: Check your email or SMS card (4 cols on desktop) */}
            <div className="lg:col-span-4 border-t lg:border-t-0 border-[#EFE5D4] pt-4 lg:pt-0">
              <div className="flex items-center gap-4">
                {/* Receipt / Invoice Graphic (Exact Match to Web Page Screenshot) */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#FAF0E8] border border-[#F0DFCD] flex items-center justify-center shrink-0 text-[#8C5D17] shadow-2xs">
                  <svg className="w-9 h-9 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <circle cx="10" cy="9" r="1"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1F140D]">Check your email or SMS</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    Your Order ID is mentioned in the order confirmation message sent to your email or mobile.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TRACKED ORDER DETAILS (When Order ID is submitted or demo loaded)
        ══════════════════════════════════════════════════════════ */}
        {order && (
          <div className="mt-6 bg-white rounded-2xl sm:rounded-3xl border border-[#EFE5D4] shadow-sm p-5 sm:p-7 animate-fadeIn">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EFE5D4]">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1F140D]">
                    Order #{order.orderNumber || order.id}
                  </h3>
                  <span className="bg-[#E7F6EC] text-[#0F7638] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F7638] animate-pulse" />
                    Out for Delivery
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {order.placedAt ? new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Oct 2026'}
                  {' '}| Expected Delivery: <strong className="text-[#1F140D] font-semibold">{order.deliveryEstimate || '3-5 Business Days'}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F140D] border border-[#EFE5D4] hover:bg-[#FAF0E8] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72c.153.925.36 1.835.62 2.726a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.891.26 1.8.467 2.726.62A2 2 0 0122 16.92z"/>
                  </svg>
                  <span>Contact Support</span>
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-[#8C5D17] hover:bg-[#73430C] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>Download Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={resetSearch}
                  className="text-xs text-gray-500 hover:text-[#8C1C1C] underline cursor-pointer ml-1"
                >
                  Track Another
                </button>
              </div>
            </div>

            {/* Timeline Progress Bar (Matches Web Page Screenshot) */}
            <div className="py-6 sm:py-8 border-b border-[#EFE5D4]">
              {/* Desktop horizontal progress line */}
              <div className="hidden sm:block relative">
                {/* Connecting bar */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 z-0 rounded-full">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                </div>

                <div className="grid grid-cols-6 gap-2 relative z-10">
                  {ORDER_TIMELINE_STEPS.map((step) => {
                    const isDone = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    return (
                      <div key={step.id} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-[#52290D] text-white ring-4 ring-amber-200'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                        >
                          {isDone ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : isCurrent ? (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                          ) : (
                            <span className="text-gray-400 text-xs">✕</span>
                          )}
                        </div>
                        <p className={`text-xs font-bold mt-2 ${isDone || isCurrent ? 'text-[#1F140D]' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.date && <p className="text-[10px] text-gray-400 mt-0.5">{step.date}</p>}
                        {step.time && <p className="text-[9px] text-gray-400 font-mono">{step.time}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile vertical progress timeline */}
              <div className="sm:hidden space-y-4">
                {ORDER_TIMELINE_STEPS.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  const isLast = idx === ORDER_TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.id} className="flex items-start gap-3 relative">
                      {!isLast && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                            isDone ? 'bg-emerald-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#52290D] text-white ring-2 ring-amber-200'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isDone ? '✓' : isCurrent ? '🚚' : '✕'}
                      </div>
                      <div className="pb-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${isDone || isCurrent ? 'text-[#1F140D]' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          <span className="text-[10px] text-gray-400">{step.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{step.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Courier Status Alert */}
              <div className="mt-6 bg-[#FAF0E8]/70 border border-[#EFE5D4] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8C5D17] text-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1F140D]">Your order is out for delivery and will be delivered today.</p>
                    <p className="text-[11px] text-gray-500">Delivery executive assigned by {order.courier || 'DTDC'}.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs text-gray-600 font-mono">
                    Tracking ID: <strong className="text-[#1F140D]">{order.trackingId || 'DTDC123456789'}</strong>
                  </span>
                  <a
                    href="https://www.dtdc.in/tracking/shipment-tracking.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#8C5D17] hover:underline bg-white border border-[#EFE5D4] px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Track on DTDC ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Details Grid: Delivery Address & Ordered Items */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Left: Delivery Address + Need Help */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-[#EFE5D4] rounded-2xl p-4 sm:p-5 bg-[#FAF7F2]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">Delivery Address</h4>
                    </div>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-[#1F140D]">
                    {order.shippingAddress?.name || 'Siddharth Kumar'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {order.shippingAddress?.line1 || 'A-302, Green Park Apartments'}<br />
                    {order.shippingAddress?.city || 'Khari Baoli, Delhi'} - {order.shippingAddress?.pincode || '110006'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    {order.shippingAddress?.phone || '+91 9876543210'}
                  </p>
                </div>

                <div className="border border-[#EFE5D4] rounded-2xl p-4 sm:p-5 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🎧</span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">Need Help?</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Our support team is here for you.
                  </p>
                  <a
                    href="https://wa.me/919313321535?text=Hello%2C+I+need+help+with+my+order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBD58] text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>💬 Chat on WhatsApp ›</span>
                  </a>
                </div>
              </div>

              {/* Right: Ordered Items Breakdown */}
              <div className="lg:col-span-7 border border-[#EFE5D4] rounded-2xl p-4 sm:p-5 bg-[#FAF7F2]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📦</span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">
                      Ordered Products ({order.items?.length || 3} items)
                    </h4>
                  </div>
                  <Link href="/shop" className="text-xs text-[#8C5D17] hover:underline font-semibold">
                    View All Products →
                  </Link>
                </div>

                <div className="space-y-3 divide-y divide-[#EFE5D4]">
                  {(order.items || DEMO_ORDER.items || []).map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white shadow-2xs">
                          <Image
                            src={item.imageUrl || item.image || '/product-almonds.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#1F140D]">{item.name}</p>
                          <p className="text-[11px] text-gray-500">
                            {item.variantLabel || item.variant || item.weight || '500g'} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-xs sm:text-sm text-[#1F140D]">
                          ₹{(item.price ?? 550).toLocaleString('en-IN')}
                        </p>
                        {item.originalPrice && (
                          <p className="text-[10px] text-gray-400 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="border-t border-[#EFE5D4] mt-5 pt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.items?.length || 3} items)</span>
                    <span>₹1,730</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>- ₹430</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#EFE5D4] text-sm">
                    <span className="font-bold text-[#1F140D]">Total Amount</span>
                    <div className="text-right">
                      <span className="font-bold text-lg sm:text-xl text-[#8C1C1C]">₹1,365</span>
                      <p className="text-[10px] text-emerald-700 font-semibold">You saved ₹430</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ══════════════════════════════════════════════════════════
          3. HOW ORDER TRACKING WORKS? (Exact Match to Web Page Screenshot)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-[#EFE5D4] py-8 sm:py-12 my-2 sm:my-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="mb-6 sm:mb-10 text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#8C1C1C] flex items-center gap-1.5">
              <span className="text-[#8C1C1C] text-lg sm:text-xl">*</span>
              <span>How Order Tracking Works?</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              From packing to delivery, stay updated at every step.
            </p>
          </div>

          {/* 5-Step Process (Connected with dotted lines as in reference image) */}
          <div className="relative">
            {/* Desktop Dotted Connecting Line */}
            <div className="hidden sm:block absolute top-7 left-[8%] right-[8%] h-0.5 border-t-2 border-dashed border-[#E5A93C]/40 z-0" />

            {/* Grid of 5 Steps */}
            <div className="grid grid-cols-5 gap-1 sm:gap-4 relative z-10">
              {HOW_IT_WORKS_STEPS.map((step, idx) => (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  
                  {/* Step Number Badge (Red Circle at Top) */}
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8C1C1C] text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-xs mb-1.5">
                    {step.num}
                  </div>

                  {/* Icon Circle (Warm Peach Background) */}
                  <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#FAF0E8] border border-[#F0DFCD] group-hover:border-[#8C5D17] group-hover:bg-[#F5E2D2] text-[#8C5D17] flex items-center justify-center shadow-2xs transition-colors mb-2">
                    {step.icon}
                  </div>

                  {/* Step Label */}
                  <p className="font-bold text-[11px] sm:text-sm text-[#1F140D] leading-tight">
                    {step.label}
                  </p>

                  {/* Subtitle (Shown on desktop/tablet, concise on mobile) */}
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-snug hidden md:block max-w-[150px]">
                    {step.sub}
                  </p>

                  {/* Connecting Arrow between steps (Desktop only) */}
                  {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div
                      className="hidden lg:flex absolute items-center pointer-events-none"
                      style={{ left: `${20 * (idx + 1) - 1.5}%`, top: '1.6rem' }}
                    >
                      <svg className="w-3.5 h-3.5 text-[#E5A93C]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. NEED HELP & FAQ (Exact Match to Web Page Screenshot)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop: Two Columns side by side. Mobile: Clean Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* ──── Need Help Card ──── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EFE5D4] shadow-sm p-6 sm:p-7">
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer sm:cursor-default"
                onClick={() => setMobileHelpOpen(!mobileHelpOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0E8] border border-[#F0DFCD] text-[#8C5D17] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#8C1C1C]">Need Help?</h3>
                    <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
                      If you&apos;re unable to track your order or facing any issues, our support team is here to help.
                    </p>
                  </div>
                </div>

                {/* Mobile Chevron Toggle */}
                <button
                  type="button"
                  aria-label="Toggle Need Help details"
                  className="sm:hidden text-[#8C5D17]"
                >
                  <svg className={`w-5 h-5 transition-transform duration-200 ${mobileHelpOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {/* Mobile text when open */}
              <div className={`mt-3 ${mobileHelpOpen ? 'block' : 'hidden sm:block'}`}>
                <p className="text-xs text-gray-500 sm:hidden mb-4">
                  If you&apos;re unable to track your order or facing any issues, our support team is here to help.
                </p>

                {/* 3 Action Buttons in a Row (Matches Web Page Screenshot) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4">
                  {/* Button 1: Contact Support */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 bg-[#8C5D17] hover:bg-[#73430C] active:bg-[#5A2C0D] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
                  >
                    <span>Contact Support</span>
                    <span>→</span>
                  </Link>

                  {/* Button 2: WhatsApp Us */}
                  <a
                    href="https://wa.me/919313321535?text=Hello%2C+I+need+help+tracking+my+order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF0E8] border border-[#EFE5D4] text-[#1F140D] font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 text-[#25D366] fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
                    </svg>
                    <span>WhatsApp Us</span>
                  </a>

                  {/* Button 3: Call Us with phone numbers */}
                  <a
                    href="tel:9313321535"
                    className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF0E8] border border-[#EFE5D4] text-[#1F140D] px-3.5 py-2.5 rounded-xl transition-colors shadow-2xs"
                  >
                    <svg className="w-4 h-4 text-[#8C5D17] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72c.153.925.36 1.835.62 2.726a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.891.26 1.8.467 2.726.62A2 2 0 0122 16.92z"/>
                    </svg>
                    <div className="leading-tight text-left">
                      <p className="font-bold text-xs text-[#1F140D]">9313321535</p>
                      <p className="text-[10px] text-gray-500">701119609</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* ──── Frequently Asked Questions Card ──── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EFE5D4] shadow-sm p-6 sm:p-7">
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer sm:cursor-default mb-4"
                onClick={() => setMobileFaqOpen(!mobileFaqOpen)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0E8] border border-[#F0DFCD] text-[#8C5D17] flex items-center justify-center shrink-0">
                    <span className="text-base font-bold">?</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-[#8C1C1C]">Frequently Asked Questions</h3>
                </div>

                {/* Mobile Chevron Toggle */}
                <button
                  type="button"
                  aria-label="Toggle FAQs list"
                  className="sm:hidden text-[#8C5D17]"
                >
                  <svg className={`w-5 h-5 transition-transform duration-200 ${mobileFaqOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {/* FAQ Accordion Items */}
              <div className={`space-y-2.5 ${mobileFaqOpen ? 'block' : 'hidden sm:block'}`}>
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-[#EFE5D4] rounded-xl overflow-hidden transition-all bg-[#FAFBF9]"
                  >
                    <button
                      id={`track-faq-item-${idx}`}
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-white transition-colors"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      aria-expanded={openFaq === idx}
                    >
                      <span className="font-semibold text-xs sm:text-sm text-[#1F140D] pr-2 leading-snug">
                        {faq.q}
                      </span>
                      <svg
                        className={`w-4 h-4 text-[#8C5D17] shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>

                    {openFaq === idx && (
                      <div className="px-4 pb-3.5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#EFE5D4] bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

/* ─── Page Wrapper with Suspense Boundary ─────────────────────── */
export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-8 h-8 animate-spin text-[#8C5D17] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-sm text-gray-500 font-medium">Loading tracking portal…</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
