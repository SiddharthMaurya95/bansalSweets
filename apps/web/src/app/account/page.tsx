'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

interface Address {
  id: string;
  tag: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  items: string;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'BF-2026-8941',
    date: '28 Sep 2026',
    items: 'Kashmiri Mamra Almonds (500g) × 1, W240 Jumbo Cashews (500g) × 1',
    total: 2150,
    status: 'Delivered',
  },
  {
    id: 'ord-102',
    orderNumber: 'BF-2026-8812',
    date: '14 Sep 2026',
    items: 'Afghan Roasted Pistachios (250g) × 2, Medjool Royal Dates (500g) × 1',
    total: 1650,
    status: 'Delivered',
  },
  {
    id: 'ord-103',
    orderNumber: 'BF-2026-8690',
    date: '02 Sep 2026',
    items: 'Royal Festive Dry Fruit Gift Hamper × 1',
    total: 1499,
    status: 'Delivered',
  },
  {
    id: 'ord-104',
    orderNumber: 'BF-2026-8514',
    date: '19 Aug 2026',
    items: 'Chilean Walnut Kernels (500g) × 1, Green Raisins (500g) × 1',
    total: 1190,
    status: 'Delivered',
  },
  {
    id: 'ord-105',
    orderNumber: 'BF-2026-8340',
    date: '05 Aug 2026',
    items: 'Anjeer Dry Figs (250g) × 2, Mamra Almonds (250g) × 1',
    total: 1420,
    status: 'Delivered',
  },
  {
    id: 'ord-106',
    orderNumber: 'BF-2026-8199',
    date: '22 Jul 2026',
    items: 'Chia & Flax Healthy Seeds Mix (250g) × 2',
    total: 480,
    status: 'Delivered',
  },
];

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    name: 'Siddharth Kumar Maurya',
    street: 'Khari Baoli',
    city: 'Delhi',
    state: 'India',
    pincode: '110006',
    phone: '9313321535',
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: 'Office',
    name: 'Siddharth Kumar Maurya',
    street: 'Bansal Foods, Mandi Gate #4',
    city: 'Old Delhi',
    state: 'Delhi',
    pincode: '110006',
    phone: '701119609',
    isDefault: false,
  },
];

const COUPONS = [
  {
    code: 'FESTIVE10',
    discount: '10% OFF',
    desc: 'Valid on festive gift hampers & assorted nuts above ₹1,499',
    expiry: 'Expires 31 Oct 2026',
  },
  {
    code: 'BANSAL50',
    discount: '₹50 FLAT OFF',
    desc: 'Applicable on your next order above ₹999',
    expiry: 'Expires 15 Nov 2026',
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  // Active section
  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'orders'
    | 'addresses'
    | 'coupons'
    | 'notifications'
    | 'settings'
  >('profile');

  // Profile form state
  const [fullName, setFullName] = useState('Siddharth Kumar Maurya');
  const [emailAddress, setEmailAddress] = useState('siddharth@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 9313321535');
  const [dob, setDob] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Orders state
  const [ordersList, setOrdersList] = useState<OrderItem[]>(DEFAULT_ORDERS);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Preferences state
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersPromotions, setOffersPromotions] = useState(true);
  const [productRecommendations, setProductRecommendations] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profile details and orders from current authenticated user if available
  useEffect(() => {
    if (user?.name && user.name !== 'Google User' && user.name !== 'Google') {
      setFullName(user.name);
    } else {
      setFullName('Siddharth Kumar Maurya');
    }
    if (user?.email && !user.email.includes('google.user@gmail.com')) {
      setEmailAddress(user.email);
    } else {
      setEmailAddress('siddharth@example.com');
    }
    if (user?.phone) {
      setPhoneNumber(user.phone.startsWith('+91') ? user.phone : `+91 ${user.phone}`);
    }

    // Load saved preferences if available
    try {
      const savedPref = localStorage.getItem('bf_account_pref');
      if (savedPref) {
        const parsed = JSON.parse(savedPref);
        if (typeof parsed.orderUpdates === 'boolean') setOrderUpdates(parsed.orderUpdates);
        if (typeof parsed.offersPromotions === 'boolean') setOffersPromotions(parsed.offersPromotions);
        if (typeof parsed.productRecommendations === 'boolean') setProductRecommendations(parsed.productRecommendations);
      }
      const savedAddr = localStorage.getItem('bf_account_addresses');
      if (savedAddr) {
        setAddresses(JSON.parse(savedAddr));
      }

      // Load dynamically placed orders for this account
      const userOrders = user?.id
        ? JSON.parse(localStorage.getItem(`bansal_user_orders_${user.id}`) || '[]')
        : [];
      const recentOrders = JSON.parse(localStorage.getItem('bansal_recent_orders') || '[]');
      const combined = [
        ...userOrders,
        ...recentOrders.filter(
          (ro: { id: string }) => !userOrders.some((uo: { id: string }) => uo.id === ro.id),
        ),
      ];

      if (combined.length > 0) {
        const mapped: OrderItem[] = combined.map(
          (
            po: {
              id?: string;
              orderNumber?: string;
              items?: Array<{ name: string; variant?: string; quantity: number }>;
              placedAt?: string;
              totalPaise?: number;
              totalAmount?: number;
              status?: string;
            },
            idx: number,
          ) => {
            const itemsStr = Array.isArray(po.items)
              ? po.items
                  .map((i) => `${i.name} (${i.variant || '1kg'}) × ${i.quantity}`)
                  .join(', ')
              : 'Assorted Premium Dry Fruits';
            const dateStr = po.placedAt
              ? new Date(po.placedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Today';
            return {
              id: po.id || `placed-${idx}`,
              orderNumber: po.orderNumber || po.id || `BF-2026-${8000 + idx}`,
              date: dateStr,
              items: itemsStr,
              total: Math.round((po.totalPaise || 0) / 100) || po.totalAmount || 2150,
              status: po.status === 'CONFIRMED' || po.status === 'Processing' ? 'Processing' : 'Delivered',
            };
          },
        );
        setOrdersList([...mapped, ...DEFAULT_ORDERS]);
      }
    } catch {
      // Ignore storage errors
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    showToast('Profile information updated successfully!');

    // Persist to session
    try {
      const stored = sessionStorage.getItem('bf_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = fullName;
        parsed.email = emailAddress;
        parsed.phone = phoneNumber;
        sessionStorage.setItem('bf_user', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const handleTogglePreference = (type: 'orders' | 'offers' | 'recs') => {
    let newOrders = orderUpdates;
    let newOffers = offersPromotions;
    let newRecs = productRecommendations;

    if (type === 'orders') {
      newOrders = !orderUpdates;
      setOrderUpdates(newOrders);
    } else if (type === 'offers') {
      newOffers = !offersPromotions;
      setOffersPromotions(newOffers);
    } else if (type === 'recs') {
      newRecs = !productRecommendations;
      setProductRecommendations(newRecs);
    }

    try {
      localStorage.setItem(
        'bf_account_pref',
        JSON.stringify({
          orderUpdates: newOrders,
          offersPromotions: newOffers,
          productRecommendations: newRecs,
        })
      );
    } catch {
      // ignore
    }
    showToast('Preferences updated successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    try {
      localStorage.setItem('bf_account_addresses', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Address removed successfully');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    let updated: Address[];
    const exists = addresses.some((a) => a.id === editingAddress.id);
    if (exists) {
      updated = addresses.map((a) => (a.id === editingAddress.id ? editingAddress : a));
    } else {
      updated = [...addresses, editingAddress];
    }
    setAddresses(updated);
    try {
      localStorage.setItem('bf_account_addresses', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAddressModal(false);
    setEditingAddress(null);
    showToast('Address saved successfully!');
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const userInitial = fullName.trim().charAt(0).toUpperCase() || 'S';
  const firstName = fullName.trim().split(' ')[0] || 'Siddharth';

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#24130A] text-white px-5 py-3 rounded-xl shadow-xl border border-amber-500/40 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-slideDown">
          <span className="text-[#C88C3C] text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Address Edit Modal */}
      {showAddressModal && editingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative">
            <button
              type="button"
              onClick={() => {
                setShowAddressModal(false);
                setEditingAddress(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
            <h3 className="font-serif font-bold text-lg text-[#1F140D] mb-4">
              Edit Delivery Address
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Address Label (e.g. Home, Office)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAddress.tag}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, tag: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAddress.name}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={editingAddress.street}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, street: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAddress.city}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAddress.state}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, state: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAddress.pincode}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, pincode: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={editingAddress.phone}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#8C4A18]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8C4A18] hover:bg-[#733B12] text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#8C4A18] transition-colors">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-800 font-semibold">My Account</span>
        </nav>

        {/* ════════════════ HERO BANNER ════════════════ */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8DCCB] shadow-xs mb-6 sm:mb-8 bg-[#FAF2E5]">
          {/* Panoramic dry fruits image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/profile-hero-banner.jpg"
              alt="Dry fruits assortment"
              fill
              priority
              className="object-cover object-right opacity-95"
            />
            {/* Soft left gradient overlay to keep text ultra crisp */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF2E6] via-[#FAF2E6]/95 to-transparent w-full md:w-3/5" />
            {/* Soft right highlight for user badge legibility */}
            <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-[#FAF2E6]/90 via-[#FAF2E6]/40 to-transparent pointer-events-none" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-9 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-[#1F140D] tracking-tight leading-[1.15]">
                Welcome back, {firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-sans leading-relaxed max-w-md">
                Manage your orders, wishlist, addresses and account preferences.
              </p>
            </div>

            {/* Profile Badge in Banner (sitting directly on banner as in mockup) */}
            <div className="flex items-center gap-4 self-start md:self-auto shrink-0 pr-2 sm:pr-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#52101B] text-white flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold shadow-md shrink-0 select-none">
                {userInitial}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-[#1F140D] leading-tight">
                  {firstName}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Customer</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setIsEditingProfile(true);
                  }}
                  className="mt-2 text-xs font-semibold text-[#24130A] hover:text-[#52101B] inline-flex items-center gap-1.5 border border-gray-300/90 bg-white hover:bg-gray-50 px-3 py-1 rounded-md transition-all shadow-2xs cursor-pointer"
                >
                  <span>Edit Profile</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════ 2-COLUMN MAIN CONTENT ════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ──── LEFT SIDEBAR NAVIGATION (3.5 cols) ──── */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5">
            {/* Navigation Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-3.5">
              <div className="px-3 py-2 border-b border-gray-100 mb-1.5">
                <h2 className="text-base font-serif font-bold text-[#52101B]">
                  My Account
                </h2>
              </div>

              <div className="space-y-1">
                {/* 1. Profile */}
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profile</span>
                </button>

                {/* 2. My Orders */}
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <span>My Orders</span>
                </button>

                {/* 3. Track Order */}
                <Link
                  href="/orders/track"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B] transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span>Track Order</span>
                </Link>

                {/* 4. Wishlist */}
                <Link
                  href="/wishlist"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B] transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>Wishlist</span>
                </Link>

                {/* 5. My Addresses */}
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>My Addresses</span>
                </button>

                {/* 6. Returns & Refunds */}
                <Link
                  href="/returns"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B] transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Returns &amp; Refunds</span>
                </Link>

                {/* 7. Gift Cards / Coupons */}
                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'coupons'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                  <span>Gift Cards / Coupons</span>
                </button>

                {/* 8. Notifications */}
                <button
                  type="button"
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'notifications'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Notifications</span>
                </button>

                {/* 9. Account Settings */}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#52101B] text-white shadow-xs'
                      : 'text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Account Settings</span>
                </button>

                {/* 10. Help & Support */}
                <Link
                  href="/contact"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#24130A] hover:bg-[#FAF0E8] hover:text-[#52101B] transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Help &amp; Support</span>
                </Link>

                {/* 11. Logout */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-50 transition-all cursor-pointer pt-2 mt-2 border-t border-gray-100"
                >
                  <svg className="w-4 h-4 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Sidebar Promo Box: Premium Dry Fruits for a Healthier You */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xs border border-amber-200/70 bg-[#FAF1E6] p-5">
              {/* Wooden bowl of mixed nuts resting on bottom-right corner */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full overflow-hidden border-2 border-white/80 shadow-xs pointer-events-none">
                <Image
                  src="/profile-promo-card.jpg"
                  alt="Premium Dry Fruits"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative z-10 max-w-[145px]">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#52101B] leading-tight">
                  Premium <br />
                  Dry Fruits
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-700 font-medium mt-1 mb-3.5">
                  for a Healthier You
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#52101B] hover:bg-[#3D0A13] text-white text-xs font-semibold rounded-md shadow-xs transition-all"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ──── RIGHT MAIN CONTENT (8.5 cols) ──── */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* 1. TOP 4 METRIC STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Stat 1: My Orders */}
              <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#A86E2B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1F140D] block leading-tight">
                    My Orders
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F140D] block mt-0.5 leading-tight">
                    {ordersList.length}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    Total Orders
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="mt-2 text-[11px] font-bold text-[#52101B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Orders</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Stat 2: Wishlist */}
              <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#A86E2B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1F140D] block leading-tight">
                    Wishlist
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F140D] block mt-0.5 leading-tight">
                    {wishlistItems.length || 4}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    Saved Products
                  </span>
                  <Link
                    href="/wishlist"
                    className="mt-2 text-[11px] font-bold text-[#52101B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Wishlist</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Stat 3: Addresses */}
              <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#A86E2B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1F140D] block leading-tight">
                    Addresses
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F140D] block mt-0.5 leading-tight">
                    2
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    Saved Addresses
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('addresses')}
                    className="mt-2 text-[11px] font-bold text-[#52101B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Addresses</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Stat 4: Coupons */}
              <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#A86E2B] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1F140D] block leading-tight">
                    Coupons
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1F140D] block mt-0.5 leading-tight">
                    1
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium block">
                    Available Coupon
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('coupons')}
                    className="mt-2 text-[11px] font-bold text-[#52101B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Coupons</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ════════════════ TAB CONTENT ════════════════ */}

            {/* TAB 1: PROFILE (Mockup View) */}
            {activeTab === 'profile' && (
              <>
                {/* SECTION 1: PROFILE INFORMATION CARD */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
                  <div className="flex items-start justify-between pb-5 border-b border-gray-100 mb-6 gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#FAF0E4] text-[#8C4A18] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-serif font-bold text-[#52101B]">
                          Profile Information
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Update your personal details and contact information.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-300/80 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                            isEditingProfile
                              ? 'bg-white border-[#8C4A18] ring-1 ring-[#8C4A18]/20 text-gray-900'
                              : 'bg-white border-gray-200/90 text-gray-800'
                          }`}
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled={!isEditingProfile}
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                            isEditingProfile
                              ? 'bg-white border-[#8C4A18] ring-1 ring-[#8C4A18]/20 text-gray-900'
                              : 'bg-white border-gray-200/90 text-gray-800'
                          }`}
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                            isEditingProfile
                              ? 'bg-white border-[#8C4A18] ring-1 ring-[#8C4A18]/20 text-gray-900'
                              : 'bg-white border-gray-200/90 text-gray-800'
                          }`}
                        />
                      </div>

                      {/* Date of Birth (Optional) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Date of Birth (Optional)
                        </label>
                        <div className="relative flex items-center">
                          {isEditingProfile ? (
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white border-[#8C4A18] ring-1 ring-[#8C4A18]/20 text-gray-900"
                            />
                          ) : (
                            <div className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-200/90 bg-white text-gray-400 flex items-center justify-between select-none">
                              <span>{dob ? dob.split('-').reverse().join(' / ') : 'DD / MM / YYYY'}</span>
                              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#52101B] hover:bg-[#3D0A13] text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-400 mt-4 leading-normal">
                      We&apos;ll use your information only to process your orders and keep you updated.
                    </p>
                  </form>
                </div>

                {/* SECTION 2: DEFAULT ADDRESS CARD */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
                  <div className="flex items-start justify-between pb-5 border-b border-gray-100 mb-5 gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#FAF0E4] text-[#8C4A18] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-serif font-bold text-[#52101B]">
                          Default Address
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          This address will be used for faster checkout.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('addresses')}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-300/80 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
                    >
                      <span>Manage Addresses</span>
                      <span>→</span>
                    </button>
                  </div>

                  {defaultAddress ? (
                    <div className="rounded-xl border border-[#EADECE] p-5 bg-[#FAF7F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between sm:justify-start gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDEED9] text-[#B26B1E]">
                            Home
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5ECD7] text-[#9A7432] sm:ml-auto">
                            Default
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1F140D]">
                          {defaultAddress.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {defaultAddress.street} – {defaultAddress.pincode}
                        </p>
                        <p className="text-xs text-gray-600">
                          {defaultAddress.city}, {defaultAddress.state}
                        </p>
                        <p className="text-xs text-gray-600 pt-0.5 font-medium">
                          Mobile: {defaultAddress.phone.replace('+91 ', '')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-end mt-2 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(defaultAddress);
                            setShowAddressModal(true);
                          }}
                          className="px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(defaultAddress.id)}
                          className="px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No default address set.</p>
                  )}
                </div>

                {/* SECTION 3: ACCOUNT PREFERENCES CARD */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs">
                  <div className="flex items-start justify-between pb-5 border-b border-gray-100 mb-5 gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#FAF0E4] text-[#8C4A18] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-serif font-bold text-[#52101B]">
                          Account Preferences
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Manage your communication and shopping preferences.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Click on any preference below to toggle.')}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-300/80 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Edit Preferences</span>
                    </button>
                  </div>

                  {/* 3 Interactive Preference Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* 1. Order Updates */}
                    <div
                      onClick={() => handleTogglePreference('orders')}
                      className="p-4 rounded-xl border border-gray-200/90 bg-white hover:border-amber-300/60 transition-all cursor-pointer select-none flex items-start gap-3 shadow-2xs"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        orderUpdates ? 'bg-[#1F140D] text-white' : 'border border-gray-300 bg-white'
                      }`}>
                        {orderUpdates && (
                          <svg className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1F140D]">
                          Order Updates
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                          Get notified about your orders
                        </p>
                      </div>
                    </div>

                    {/* 2. Offers & Promotions */}
                    <div
                      onClick={() => handleTogglePreference('offers')}
                      className="p-4 rounded-xl border border-gray-200/90 bg-white hover:border-amber-300/60 transition-all cursor-pointer select-none flex items-start gap-3 shadow-2xs"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        offersPromotions ? 'bg-[#1F140D] text-white' : 'border border-gray-300 bg-white'
                      }`}>
                        {offersPromotions && (
                          <svg className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1F140D]">
                          Offers &amp; Promotions
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                          Receive updates on new offers
                        </p>
                      </div>
                    </div>

                    {/* 3. Product Recommendations */}
                    <div
                      onClick={() => handleTogglePreference('recs')}
                      className="p-4 rounded-xl border border-gray-200/90 bg-white hover:border-amber-300/60 transition-all cursor-pointer select-none flex items-start gap-3 shadow-2xs"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        productRecommendations ? 'bg-[#1F140D] text-white' : 'border border-gray-300 bg-white'
                      }`}>
                        {productRecommendations && (
                          <svg className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1F140D]">
                          Product Recommendations
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                          Get personalized product suggestions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#1F140D]">
                    My Orders ({ordersList.length})
                  </h2>
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-[#8C4A18] hover:underline"
                  >
                    + Place New Order
                  </Link>
                </div>

                <div className="divide-y divide-gray-100">
                  {ordersList.map((order) => (
                    <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1F140D]">{order.orderNumber}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                        <span className="text-[11px] text-gray-400 mt-1 block">Ordered on {order.date}</span>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <span className="font-bold text-sm text-[#1F140D]">₹{order.total}</span>
                        <Link
                          href={`/orders/track?orderId=${encodeURIComponent(order.orderNumber)}`}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-[#8C4A18] text-xs font-semibold rounded-lg border border-amber-200 transition-colors"
                        >
                          Track Package
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#1F140D]">
                    Saved Addresses ({addresses.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress({
                        id: `addr-${Date.now()}`,
                        tag: 'Home',
                        name: fullName,
                        street: '',
                        city: 'Delhi',
                        state: 'Delhi',
                        pincode: '110006',
                        phone: phoneNumber,
                        isDefault: false,
                      });
                      setShowAddressModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#8C4A18] hover:bg-[#733B12] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-gray-200/80 bg-[#FCFBF9] flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 uppercase tracking-wider">
                            {addr.tag}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF0E4] text-[#8C5D17] border border-[#C88C3C]/30 uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[#1F140D]">{addr.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 font-medium">
                          Mobile: {addr.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(addr);
                            setShowAddressModal(true);
                          }}
                          className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="px-3 py-1 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg shadow-2xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#1F140D]">
                    Available Coupons &amp; Gift Cards ({COUPONS.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COUPONS.map((cpn) => (
                    <div
                      key={cpn.code}
                      className="p-5 rounded-2xl border border-dashed border-[#C88C3C] bg-[#FFFBF5] relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-lg font-extrabold text-[#52101B]">
                            {cpn.discount}
                          </span>
                          <div className="mt-1 font-mono font-bold text-xs bg-[#52101B] text-white px-2.5 py-1 rounded inline-block tracking-wider">
                            {cpn.code}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(cpn.code)}
                          className="px-3 py-1.5 bg-[#8C4A18] hover:bg-[#733B12] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                        >
                          Copy Code
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                        {cpn.desc}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                        {cpn.expiry}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#1F140D]">
                    Notification Settings
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-[#FCFBF9]">
                    <div>
                      <h4 className="text-xs font-bold text-[#1F140D]">SMS Dispatch Alerts</h4>
                      <p className="text-[11px] text-gray-500">Receive tracking link via SMS when order leaves Mandi</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8C4A18]" />
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-[#FCFBF9]">
                    <div>
                      <h4 className="text-xs font-bold text-[#1F140D]">WhatsApp Delivery Updates</h4>
                      <p className="text-[11px] text-gray-500">Get instant invoice and out-for-delivery alerts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8C4A18]" />
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-[#FCFBF9]">
                    <div>
                      <h4 className="text-xs font-bold text-[#1F140D]">Festive Discount Emails</h4>
                      <p className="text-[11px] text-gray-500">Early access to Diwali, Eid, and New Year offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8C4A18]" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#1F140D]">
                    Account &amp; Security Settings
                  </h2>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Account Status
                    </label>
                    <div className="flex items-center gap-2 text-xs text-green-700 font-semibold bg-green-50 p-2.5 rounded-lg border border-green-200">
                      <span>✓</span>
                      <span>Active Verified Retail Customer Account</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Connected Providers
                    </label>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <span className="text-xs font-medium text-gray-800">Google Authentication</span>
                      <span className="text-[11px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Connected</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => showToast('Password reset link sent to your registered email!')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:text-black font-semibold text-xs rounded-lg shadow-2xs hover:bg-gray-50"
                    >
                      Request Password Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
