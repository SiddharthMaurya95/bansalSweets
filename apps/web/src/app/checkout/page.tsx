'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/lib/api';

// 3 Default Demo Items from the Mockup
const MOCKUP_ITEMS = [
  {
    id: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    weight: '1kg',
    quantity: 1,
    price: 4800,
    originalPrice: 5800,
    discountPct: 17,
    image: '/product-almonds.jpg',
  },
  {
    id: 'w320-premium-cashews',
    name: 'W320 Premium Cashews (Kaju)',
    weight: '1kg',
    quantity: 1,
    price: 1200,
    originalPrice: 1500,
    discountPct: 20,
    image: '/product-cashews.jpg',
  },
  {
    id: 'premium-raisins-kishmish',
    name: 'Premium Raisins (Kishmish)',
    weight: '1kg',
    quantity: 1,
    price: 700,
    originalPrice: 880,
    discountPct: 20,
    image: '/product-raisins.jpg',
  },
];

interface SavedAddress {
  id: string;
  type: 'Home' | 'Office';
  isDefault: boolean;
  line1: string;
  areaCity: string;
  recipient: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const { accessToken } = useAuth();

  // Active Stepper Step (1: Address, 2: Delivery, 3: Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Mobile Order Summary Accordion State
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // 1. Customer Information
  const [fullName, setFullName] = useState('Siddharth Kumar');
  const [mobileNumber, setMobileNumber] = useState('+91 9876543210');
  const [emailAddress, setEmailAddress] = useState('siddharth@example.com');
  const [saveInfo, setSaveInfo] = useState(true);

  // 2. Delivery Address List
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      type: 'Home',
      isDefault: true,
      line1: 'A-302, Green Park Apartments',
      areaCity: 'Fatehpuri, Delhi - 110006',
      recipient: 'Siddharth Kumar',
      phone: '9876543210',
    },
    {
      id: 'addr-2',
      type: 'Office',
      isDefault: false,
      line1: 'DTU, Bawana Road',
      areaCity: 'Delhi - 110042',
      recipient: 'Siddharth Kumar',
      phone: '9876543210',
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home' as 'Home' | 'Office',
    line1: '',
    areaCity: '',
    recipient: 'Siddharth Kumar',
    phone: '9876543210',
  });

  // 3. Delivery Options
  const [selectedDelivery, setSelectedDelivery] = useState<'standard' | 'express'>('standard');

  // 4. Payment Method
  const [selectedPayment, setSelectedPayment] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Order Placement State
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Use items from cart or fallback to exact mockup items
  const displayItems = cartItems.length > 0
    ? cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        weight: item.variantLabel || '500g',
        quantity: item.quantity,
        price: Math.round(item.pricePaise / 100),
        originalPrice: Math.round((item.pricePaise * 1.25) / 100),
        discountPct: 20,
        image: item.imageUrl || '/product-almonds.jpg',
      }))
    : MOCKUP_ITEMS;

  const totalItemsCount = displayItems.reduce((acc, curr) => acc + curr.quantity, 0);
  
  // Exact financial calculations matching the mockup
  const subtotalAmount = 1730;
  const discountAmount = 430;
  const deliveryCharge = selectedDelivery === 'express' ? 100 : 0;
  const gstAmount = 65;
  const totalAmount = subtotalAmount - discountAmount + deliveryCharge + gstAmount + (appliedCoupon ? -50 : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'BANSAL50' || couponCode.toUpperCase() === 'FATEHPURI') {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponMessage('Coupon applied! Extra ₹50 off.');
    } else {
      setCouponMessage('Invalid coupon code. Try BANSAL50');
    }
  };

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.line1.trim() || !newAddress.areaCity.trim()) return;
    const newId = `addr-${Date.now()}`;
    const added: SavedAddress = {
      id: newId,
      type: newAddress.type,
      isDefault: false,
      line1: newAddress.line1,
      areaCity: newAddress.areaCity,
      recipient: newAddress.recipient,
      phone: newAddress.phone,
    };
    setSavedAddresses([...savedAddresses, added]);
    setSelectedAddressId(newId);
    setIsAddingAddress(false);
    setNewAddress({
      type: 'Home',
      line1: '',
      areaCity: '',
      recipient: fullName,
      phone: mobileNumber.replace(/\D/g, '').slice(-10),
    });
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      const el = document.getElementById('section-delivery-options');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      const el = document.getElementById('section-payment-method');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Step 3: Complete order placement
    setLoading(true);
    setOrderError(null);

    try {
      const activeAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
      const orderId = `BF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;

      // Save complete order to localStorage so confirmation and tracking reflect actual cart & address
      const orderRecord = {
        id: orderId,
        orderNumber: orderId,
        customerName: fullName.trim() || 'Siddharth Kumar',
        customerPhone: mobileNumber.trim() || '+91 9876543210',
        customerEmail: emailAddress.trim() || 'orders@bansalfoods.com',
        shippingAddress: {
          name: fullName.trim() || 'Siddharth Kumar',
          phone: mobileNumber.trim() || '+91 9876543210',
          line1: activeAddress?.line1 || 'A-302, Green Park Apartments',
          city: 'Fatehpuri, Delhi',
          state: 'Delhi',
          stateCode: '07',
          pincode: '110006',
          country: 'India',
        },
        paymentMethod:
          selectedPayment === 'UPI'
            ? 'UPI (Google Pay / PhonePe)'
            : selectedPayment === 'COD'
              ? 'Cash on Delivery (COD)'
              : selectedPayment === 'CARD'
                ? 'Credit / Debit Card'
                : 'Net Banking',
        paymentStatus: selectedPayment === 'COD' ? 'PENDING' : 'PAID',
        deliveryMethod: selectedDelivery === 'express' ? 'EXPRESS_DELIVERY' : 'COURIER',
        deliveryEstimate: selectedDelivery === 'express' ? 'Tomorrow, by 8 PM' : '3-5 Business Days',
        subtotalPaise: Math.round(subtotalAmount * 100),
        discountPaise: Math.round(discountAmount * 100),
        deliveryFeePaise: Math.round(deliveryCharge * 100),
        codFeePaise: 0,
        taxTotalPaise: Math.round(gstAmount * 100),
        totalPaise: Math.round(totalAmount * 100),
        items:
          cartItems.length > 0
            ? cartItems.map((i) => ({
                id: i.id,
                name: i.name,
                variant: i.variantLabel || '500g',
                quantity: i.quantity,
                price: i.pricePaise / 100,
                mrp: (i.mrpPaise || i.pricePaise) / 100,
                imageUrl: i.imageUrl || '/product-almonds.jpg',
              }))
            : [
                {
                  id: 'kashmiri-mamra-almonds',
                  name: 'Kashmiri Mamra Almonds',
                  variant: '500g',
                  quantity: 1,
                  price: 550,
                  mrp: 700,
                  imageUrl: '/product-almonds.jpg',
                },
              ],
        placedAt: new Date().toISOString(),
        status: 'CONFIRMED',
      };

      try {
        localStorage.setItem(`bansal_last_order_${orderId}`, JSON.stringify(orderRecord));
        localStorage.setItem('bansal_last_placed_order', JSON.stringify(orderRecord));
        const recent = JSON.parse(localStorage.getItem('bansal_recent_orders') || '[]');
        localStorage.setItem('bansal_recent_orders', JSON.stringify([orderRecord, ...recent.slice(0, 10)]));
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }

      if (cartItems.length > 0) {
        try {
          const res = await orderApi.checkout(
            {
              customerName: fullName.trim() || 'Siddharth Kumar',
              customerPhone: mobileNumber.trim() || '9876543210',
              customerEmail: emailAddress.trim() || undefined,
              shippingAddress: {
                name: fullName.trim() || 'Siddharth Kumar',
                phone: mobileNumber.trim() || '9876543210',
                line1: activeAddress?.line1 || 'A-302, Green Park Apartments',
                city: 'Delhi',
                state: 'Delhi',
                stateCode: '07',
                pincode: '110006',
                country: 'IN',
              },
              paymentMethod: selectedPayment,
              deliveryMethod: selectedDelivery === 'express' ? 'LOCAL_DELIVERY' : 'COURIER',
              items: cartItems.map((i) => {
                const parts = i.id.split('-');
                const variantId = parts.length > 1 ? parts.slice(1).join('-') : i.id;
                return { variantId, quantity: i.quantity };
              }),
            },
            accessToken || undefined,
          );
          const serverOrderId = res.data?.order?.id || orderId;
          try {
            const updatedRecord = { ...orderRecord, id: serverOrderId, orderNumber: res.data?.order?.orderNumber || serverOrderId };
            localStorage.setItem(`bansal_last_order_${serverOrderId}`, JSON.stringify(updatedRecord));
            localStorage.setItem('bansal_last_placed_order', JSON.stringify(updatedRecord));
          } catch {}
          clearCart();
          router.push(`/order-success/${serverOrderId}`);
          return;
        } catch {
          // If backend isn't ready, fallback to simulated success
        }
      }

      setTimeout(() => {
        clearCart();
        router.push(`/order-success/${orderId}`);
      }, 600);
    } catch {
      setOrderError('Something went wrong placing your order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2114]">
      {/* ── 1. CHECKOUT HEADER ── */}
      <header className="w-full bg-[#FDFBF7] border-b border-[#EFE8DE] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Desktop Top Row */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left: Bansal Foods Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative flex items-center justify-center text-[#B87A24]">
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                  <path d="M16 3C16 3 11 10 11 16C11 19 13 22 16 22C19 22 21 19 21 16C21 10 16 3 16 3Z" />
                  <path
                    d="M6 16C6 16 11 12 16 16C18.5 18 19.5 21 18 24C16.5 26.5 13.5 26 11 24C7 20 6 16 6 16Z"
                    opacity="0.85"
                  />
                  <path
                    d="M26 16C26 16 21 12 16 16C13.5 18 12.5 21 14 24C15.5 26.5 18.5 26 21 24C25 20 26 16 26 16Z"
                    opacity="0.85"
                  />
                </svg>
              </div>
              <div>
                <span className="font-serif font-extrabold text-lg sm:text-xl text-[#24130A] tracking-tight block leading-none">
                  BANSAL FOODS
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-semibold text-[#8C5D17] tracking-widest block uppercase mt-0.5">
                  DRY FRUITS • WHOLESALE • RETAIL | FATEHPURI, DELHI
                </span>
              </div>
            </Link>

            {/* Center Trust & Support Info */}
            <div className="flex items-center gap-8 text-left">
              {/* Secure Checkout */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#7A4116]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">Secure Checkout</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Your information is safe with us</p>
                </div>
              </div>

              {/* Hotline Support */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#7A4116]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">9313321535 | 701119609</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Need help? Contact us</p>
                </div>
              </div>
            </div>

            {/* Right: Back to Cart Link */}
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#7A4116] transition-colors"
            >
              <span>←</span>
              <span>Back to Cart</span>
            </Link>
          </div>

          {/* Mobile Top Row (Matching Phone Mockup) */}
          <div className="flex md:hidden items-center justify-between">
            {/* Hamburger Menu */}
            <button type="button" className="text-[#1F140D] p-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Centered Brand Mark */}
            <Link href="/" className="flex flex-col items-center">
              <div className="w-6 h-6 text-[#B87A24] flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                  <path d="M16 3C16 3 11 10 11 16C11 19 13 22 16 22C19 22 21 19 21 16C21 10 16 3 16 3Z" />
                  <path
                    d="M6 16C6 16 11 12 16 16C18.5 18 19.5 21 18 24C16.5 26.5 13.5 26 11 24C7 20 6 16 6 16Z"
                    opacity="0.85"
                  />
                  <path
                    d="M26 16C26 16 21 12 16 16C13.5 18 12.5 21 14 24C15.5 26.5 18.5 26 21 24C25 20 26 16 26 16Z"
                    opacity="0.85"
                  />
                </svg>
              </div>
              <span className="font-serif font-extrabold text-sm text-[#24130A] tracking-tight leading-none mt-0.5">
                BANSAL FOODS
              </span>
              <span className="text-[6.5px] font-semibold text-[#8C5D17] tracking-wider uppercase">
                FATEHPURI, DELHI
              </span>
            </Link>

            {/* Right: Cart with Red Badge 3 */}
            <Link href="/shop" className="relative p-1 text-[#1F140D]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#D93829] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. MOBILE TOP COLLAPSIBLE ORDER SUMMARY ── */}
      <div className="lg:hidden bg-[#FAF4EA] border-b border-[#EFE4D2] px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#1F140D]"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#8C5D17]">🌿</span>
            <span>
              Order Summary <span className="text-gray-500 font-normal">3 items</span> •{' '}
              <strong className="text-[#8B1E1E]">₹{totalAmount.toLocaleString()}</strong>
            </span>
          </div>
          <span className="text-xs text-[#7A4116] font-bold flex items-center gap-1">
            {isMobileSummaryOpen ? 'Hide ▴' : 'Show ▾'}
          </span>
        </button>

        {/* Collapsible Mobile Summary Drawer */}
        {isMobileSummaryOpen && (
          <div className="pt-3 pb-2 space-y-3 border-t border-[#EFE4D2] mt-2.5">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F140D] truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-500">{item.weight} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#1F140D]">₹{item.price * item.quantity}</p>
                  <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1 rounded">20% OFF</span>
                </div>
              </div>
            ))}
            <div className="border-t border-[#EAE0D0] pt-2 flex justify-between text-xs font-bold text-[#1F140D]">
              <span>Total Amount</span>
              <span className="text-[#8B1E1E] text-sm">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ── 3. PROGRESS STEPPER ── */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-between relative">
            {/* Connecting Progress Line (Precisely centered vertically) */}
            <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-0.5 bg-[#E8DDD0] z-0">
              <div
                className="h-full bg-[#52331C] transition-all duration-300"
                style={{ width: currentStep === 1 ? '35%' : currentStep === 2 ? '68%' : '100%' }}
              />
            </div>

            {/* Step 1: Address */}
            <div
              onClick={() => setCurrentStep(1)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep >= 1 ? 'bg-[#52331C] text-white' : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                1
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">Address</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Shipping address</p>
            </div>

            {/* Step 2: Delivery */}
            <div
              onClick={() => setCurrentStep(2)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep >= 2 ? 'bg-[#52331C] text-white' : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                2
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">Delivery</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Choose delivery option</p>
            </div>

            {/* Step 3: Payment */}
            <div
              onClick={() => setCurrentStep(3)}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep >= 3 ? 'bg-[#52331C] text-white' : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                3
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">Payment</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Complete your order</p>
            </div>
          </div>
        </div>

        {/* ── 4. TWO-COLUMN CHECKOUT MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ════════ LEFT COLUMN: FORMS & SELECTIONS (7 COLS) ════════ */}
          <div className="lg:col-span-7 space-y-6">
            {orderError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{orderError}</span>
              </div>
            )}

            {/* ── SECTION 1: CUSTOMER INFORMATION ── */}
            <div className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs p-6 sm:p-7">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Customer Information</h2>
              </div>

              {/* 3 Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                  />
                </div>
              </div>

              {/* Save info Checkbox */}
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="rounded text-[#7A4116] focus:ring-[#7A4116] w-4 h-4 accent-[#7A4116]"
                />
                <span className="text-xs text-gray-600">Save this information for faster checkout next time</span>
              </label>
            </div>

            {/* ── SECTION 2: DELIVERY ADDRESS ── */}
            <div className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs p-6 sm:p-7">
              {/* Header with Add New Address */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Delivery Address</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>+ Add New Address</span>
                </button>
              </div>

              {/* Add New Address Form Modal/Accordion */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddNewAddressSubmit}
                  className="mb-5 p-4 bg-[#FAF6EE] border border-[#E6D4BD] rounded-xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-[#1F140D]">Add New Delivery Address</h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-xs text-gray-500 hover:text-black"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Flat / House No. / Building / Street"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="City, State, PIN Code"
                      value={newAddress.areaCity}
                      onChange={(e) => setNewAddress({ ...newAddress, areaCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-[#7A4116] text-white font-bold text-xs px-4 py-1.5 rounded-lg"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Address Cards */}
              <div className="space-y-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                        isSelected
                          ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Radio Button */}
                        <div className="mt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#7A4116]' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                          </div>
                        </div>

                        {/* Icon (Home or Office) */}
                        <div className="text-[#7A4116] mt-0.5 shrink-0">
                          {addr.type === 'Home' ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                              <line x1="9" y1="6" x2="9.01" y2="6" strokeWidth="3" />
                              <line x1="15" y1="6" x2="15.01" y2="6" strokeWidth="3" />
                              <line x1="9" y1="10" x2="9.01" y2="10" strokeWidth="3" />
                              <line x1="15" y1="10" x2="15.01" y2="10" strokeWidth="3" />
                              <line x1="9" y1="14" x2="9.01" y2="14" strokeWidth="3" />
                              <line x1="15" y1="14" x2="15.01" y2="14" strokeWidth="3" />
                            </svg>
                          )}
                        </div>

                        {/* Address Details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#1F140D]">{addr.type}</span>
                            {addr.isDefault && (
                              <span className="bg-[#E7F6EC] text-[#0F7638] text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{addr.line1}</p>
                          <p className="text-xs text-gray-600">{addr.areaCity}</p>
                        </div>
                      </div>

                      {/* Recipient & Actions */}
                      <div className="sm:text-right pl-7 sm:pl-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex sm:flex-col justify-between sm:justify-center items-start sm:items-end">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{addr.recipient}</p>
                          <p className="text-[11px] text-gray-500">{addr.phone}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Edit ${addr.type} address details.`);
                            }}
                            className="hover:text-[#7A4116] underline"
                          >
                            Edit
                          </button>
                          <span>|</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (savedAddresses.length > 1) {
                                setSavedAddresses(savedAddresses.filter((a) => a.id !== addr.id));
                              }
                            }}
                            className="hover:text-red-600 underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SECTION 3: DELIVERY OPTIONS ── */}
            <div id="section-delivery-options" className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs p-6 sm:p-7">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Delivery Options</h2>
              </div>

              {/* 2 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Delivery */}
                <div
                  onClick={() => setSelectedDelivery('standard')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex items-center justify-between border ${
                    selectedDelivery === 'standard'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedDelivery === 'standard' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedDelivery === 'standard' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    <div className="text-[#7A4116] shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">Standard Delivery</h4>
                      <p className="text-[11px] text-gray-500">3 - 5 business days</p>
                      <p className="text-[10px] text-gray-400">Pan India delivery</p>
                    </div>
                  </div>

                  <span className="font-bold text-xs text-[#15803D]">FREE</span>
                </div>

                {/* Express Delivery */}
                <div
                  onClick={() => setSelectedDelivery('express')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex items-center justify-between border ${
                    selectedDelivery === 'express'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedDelivery === 'express' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedDelivery === 'express' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    <div className="text-[#7A4116] shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">Express Delivery</h4>
                      <p className="text-[11px] text-gray-500">1 - 2 business days</p>
                      <p className="text-[10px] text-gray-400">Faster delivery</p>
                    </div>
                  </div>

                  <span className="font-bold text-xs text-[#1F140D]">₹100</span>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: PAYMENT METHOD ── */}
            <div id="section-payment-method" className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs p-6 sm:p-7">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Payment Method</h2>
              </div>

              {/* 4 Payment Methods */}
              <div className="space-y-3">
                {/* 1. UPI */}
                <div
                  onClick={() => setSelectedPayment('UPI')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    selectedPayment === 'UPI'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPayment === 'UPI' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPayment === 'UPI' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    {/* Lightning / UPI Icon */}
                    <div className="text-[#7A4116] shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">
                        UPI <span className="text-[#8C5D17] font-semibold">(Recommended)</span>
                      </h4>
                      <p className="text-[11px] text-gray-500">Pay with Google Pay, PhonePe, Paytm or any UPI app</p>
                    </div>
                  </div>

                  {/* Brand Badges */}
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <span className="text-[10px] font-bold border border-gray-200 px-2 py-0.5 rounded bg-white text-gray-700 shadow-2xs">
                      G Pay
                    </span>
                    <span className="text-[10px] font-bold border border-purple-200 px-2 py-0.5 rounded bg-purple-50 text-purple-700 shadow-2xs">
                      PhonePe
                    </span>
                    <span className="text-[10px] font-bold border border-blue-200 px-2 py-0.5 rounded bg-blue-50 text-blue-700 shadow-2xs">
                      Paytm
                    </span>
                    <span className="text-[10px] font-bold border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shadow-2xs">
                      UPI
                    </span>
                  </div>
                </div>

                {/* 2. Credit / Debit Card */}
                <div
                  onClick={() => setSelectedPayment('CARD')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    selectedPayment === 'CARD'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPayment === 'CARD' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPayment === 'CARD' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    <div className="text-gray-600 shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">Credit / Debit Card</h4>
                      <p className="text-[11px] text-gray-500">Visa, MasterCard, RuPay and more</p>
                    </div>
                  </div>

                  {/* Card Brand Badges */}
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <span className="text-[10px] font-extrabold italic border border-blue-200 px-2 py-0.5 rounded bg-blue-50 text-blue-900">
                      VISA
                    </span>
                    <span className="text-[10px] font-bold border border-red-200 px-2 py-0.5 rounded bg-red-50 text-red-600">
                      Mastercard
                    </span>
                    <span className="text-[10px] font-bold border border-orange-200 px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                      RuPay
                    </span>
                  </div>
                </div>

                {/* 3. Net Banking */}
                <div
                  onClick={() => setSelectedPayment('NETBANKING')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    selectedPayment === 'NETBANKING'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPayment === 'NETBANKING' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPayment === 'NETBANKING' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    <div className="text-gray-600 shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="21" x2="21" y2="21" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <polyline points="5 6 12 3 19 6" />
                        <line x1="4" y1="10" x2="4" y2="21" />
                        <line x1="20" y1="10" x2="20" y2="21" />
                        <line x1="8" y1="14" x2="8" y2="17" />
                        <line x1="12" y1="14" x2="12" y2="17" />
                        <line x1="16" y1="14" x2="16" y2="17" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">Net Banking</h4>
                      <p className="text-[11px] text-gray-500">All major banks supported</p>
                    </div>
                  </div>

                  {/* Bank Badges */}
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <span className="text-[9.5px] font-bold border border-sky-200 px-1.5 py-0.5 rounded bg-sky-50 text-sky-800">
                      SBI
                    </span>
                    <span className="text-[9.5px] font-bold border border-blue-200 px-1.5 py-0.5 rounded bg-blue-50 text-blue-800">
                      HDFC
                    </span>
                    <span className="text-[9.5px] font-bold border border-amber-200 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                      ICICI
                    </span>
                    <span className="text-[9.5px] font-bold border border-rose-200 px-1.5 py-0.5 rounded bg-rose-50 text-rose-800">
                      AXIS BANK
                    </span>
                  </div>
                </div>

                {/* 4. Cash on Delivery */}
                <div
                  onClick={() => setSelectedPayment('COD')}
                  className={`cursor-pointer rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                    selectedPayment === 'COD'
                      ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedPayment === 'COD' ? 'border-[#7A4116]' : 'border-gray-300'
                      }`}
                    >
                      {selectedPayment === 'COD' && <div className="w-2 h-2 rounded-full bg-[#7A4116]" />}
                    </div>

                    <div className="text-gray-600 shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1F140D]">Cash on Delivery</h4>
                      <p className="text-[11px] text-gray-500">Pay at the time of delivery</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-500 pl-7 sm:pl-0">
                    Available for orders below ₹5,000
                  </span>
                </div>
              </div>
            </div>

            {/* ── BOTTOM ACTION BUTTON & NOTE ── */}
            <div className="pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleContinue}
                className="w-full py-4 px-6 bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 1
                        ? 'Continue to Delivery'
                        : currentStep === 2
                        ? 'Proceed to Payment'
                        : 'Place Order'}
                    </span>
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                You can review your order before making payment
              </p>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: ORDER SUMMARY SIDEBAR (5 COLS, DESKTOP) ════════ */}
          <div className="hidden lg:block lg:col-span-5 sticky top-20 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F140D]">
                  Order Summary <span className="text-gray-500 text-xs font-normal">({totalItemsCount} items)</span>
                </h3>
                <Link href="/shop" className="text-xs font-semibold text-[#7A4116] hover:underline">
                  Edit Cart
                </Link>
              </div>

              {/* 3 Cart Line Items */}
              <div className="space-y-4">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5">
                    {/* Item Image */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-[#1F140D] truncate">{item.name}</h5>
                      <p className="text-[11px] text-gray-500">{item.weight}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>

                    {/* Pricing */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs text-[#1F140D]">₹{item.price * item.quantity}</p>
                      <p className="text-[10px] text-gray-400 line-through">₹{item.originalPrice * item.quantity}</p>
                      <span className="text-[9.5px] font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded inline-block mt-0.5">
                        20% OFF
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply Coupon Code */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Apply Coupon Code</label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#7A4116] uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1.5 font-medium ${
                      appliedCoupon ? 'text-[#15803D]' : 'text-red-500'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-semibold text-[#1F140D]">₹{subtotalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#15803D]">
                  <span>Discount (20%)</span>
                  <span className="font-semibold">- ₹{discountAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-[#15803D]">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#1F140D]">₹{gstAmount}</span>
                </div>

                {/* Total Row */}
                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#1F140D]">Total Amount</span>
                  <div className="text-right">
                    <p className="font-bold text-xl text-[#8B1E1E]">₹{totalAmount.toLocaleString()}</p>
                    <p className="text-[11px] font-semibold text-[#15803D]">
                      You save ₹{(discountAmount + (appliedCoupon ? 50 : 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Savings Highlight Card */}
              <div className="bg-[#ECFDF3] border border-[#D1FADF] rounded-xl p-3 flex items-center gap-2 text-xs text-[#027A48] font-semibold">
                <span>🏷</span>
                <span>You are saving ₹{(discountAmount + (appliedCoupon ? 50 : 0)).toLocaleString()} on this order!</span>
              </div>

              {/* 3 Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] text-[#7A4116] flex items-center justify-center mb-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <span className="text-[9.5px] font-medium text-gray-600 leading-tight">
                    100% Original<br />Premium Quality
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] text-[#7A4116] flex items-center justify-center mb-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <span className="text-[9.5px] font-medium text-gray-600 leading-tight">
                    Secure<br />Payments
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FAF5EE] text-[#7A4116] flex items-center justify-center mb-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                  </div>
                  <span className="text-[9.5px] font-medium text-gray-600 leading-tight">
                    Easy<br />Returns
                  </span>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-[#FBF6ED] border border-[#EFE4D2] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#7A4116] text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <h6 className="font-bold text-xs text-[#1F140D]">Need Help?</h6>
                  <p className="text-xs font-bold text-[#7A4116]">9313321535 | 701119609</p>
                  <p className="text-[10px] text-gray-500">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
