'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderApi, ApiRequestError } from '@/lib/api';
import { redirectToGoogle, getGoogleClientId } from '@/lib/googleAuth';
import { GoogleRedirectModal } from '@/components/GoogleRedirectModal';

// 3 Default Demo Items from the Mockup (matching user pricing: Kishmish 700, Kaju 1200, Mamra 4800)
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

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Office';
  isDefault: boolean;
  recipient: string;
  phone: string;
  pincode: string;
  flat: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  line1: string;
  areaCity: string;
}

const INDIAN_STATES = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Punjab',
  'Rajasthan',
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Madhya Pradesh',
  'Bihar',
  'Chandigarh',
  'Jammu and Kashmir',
  'Himachal Pradesh',
  'Uttarakhand',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const { user, isAuthenticated, accessToken, login, register, logout } = useAuth();

  // Active Stepper Step (1: Login/Account, 2: Address, 3: Order Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState<number>(isAuthenticated ? 2 : 1);

  // If auth state changes, update current step appropriately
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => (prev === 1 ? 2 : prev));
    }
  }, [isAuthenticated]);

  // Mobile Order Summary Accordion State
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // ── 1. Step 1: Authentication / Sign In / Register Form State ──
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  // ── 2. Step 2: Delivery Address List & Form ──
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      type: 'Home',
      isDefault: true,
      recipient: user?.name || 'Siddharth Kumar',
      phone: user?.phone?.replace(/\D/g, '').slice(-10) || '9313321535',
      pincode: '110006',
      flat: 'A-302, Green Park Apartments',
      area: 'Fatehpuri',
      landmark: 'Near Fatehpuri Masjid',
      city: 'Delhi',
      state: 'Delhi',
      line1: 'A-302, Green Park Apartments, Fatehpuri',
      areaCity: 'Delhi - 110006',
    },
    {
      id: 'addr-2',
      type: 'Office',
      isDefault: false,
      recipient: user?.name || 'Siddharth Kumar',
      phone: user?.phone?.replace(/\D/g, '').slice(-10) || '9313321535',
      pincode: '110042',
      flat: 'DTU Campus, Tech Block',
      area: 'Bawana Road, Shahbad Daulatpur',
      landmark: 'Main Gate',
      city: 'Delhi',
      state: 'Delhi',
      line1: 'DTU Campus, Tech Block, Bawana Road',
      areaCity: 'Delhi - 110042',
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    recipient: '',
    phone: '',
    pincode: '110006',
    flat: '',
    area: '',
    landmark: '',
    city: 'Delhi',
    state: 'Delhi',
    type: 'Home' as 'Home' | 'Office',
    isDefault: false,
  });

  // Sync recipient name and phone whenever user logs in or updates
  useEffect(() => {
    if (user?.name) {
      setNewAddressForm((prev) => ({
        ...prev,
        recipient: prev.recipient || user.name,
        phone: prev.phone || (user.phone ? user.phone.replace(/\D/g, '').slice(-10) : ''),
      }));
    }

    // Load saved addresses from localStorage
    try {
      const stored = localStorage.getItem('bf_account_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const adapted: SavedAddress[] = parsed.map((a, idx) => ({
            id: a.id || `addr-${idx + 1}`,
            type: a.tag === 'Office' || a.type === 'Office' ? 'Office' : 'Home',
            isDefault: !!a.isDefault,
            recipient: a.name || a.recipient || user?.name || 'Customer',
            phone: (a.phone || user?.phone || '9313321535').replace(/\D/g, '').slice(-10),
            pincode: a.pincode || '110006',
            flat: a.street || a.flat || 'Fatehpuri',
            area: a.area || a.city || 'Delhi',
            landmark: a.landmark || '',
            city: a.city || 'Delhi',
            state: a.state || 'Delhi',
            line1: a.street || a.line1 || `${a.flat || ''}, ${a.area || ''}`.trim(),
            areaCity: `${a.city || 'Delhi'} - ${a.pincode || '110006'}`,
          }));
          setSavedAddresses(adapted);
          const def = adapted.find((a) => a.isDefault) || adapted[0];
          if (def) setSelectedAddressId(def.id);
        }
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  // ── 3. Step 3: Delivery Options ──
  const [selectedDelivery, setSelectedDelivery] = useState<'standard' | 'express'>('standard');

  // ── 4. Step 4: Payment Method ──
  const [selectedPayment, setSelectedPayment] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Order Placement State
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Use items from cart or fallback to mockup items
  const displayItems =
    cartItems.length > 0
      ? cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          weight: item.variantLabel || '1kg',
          quantity: item.quantity,
          price: Math.round(item.pricePaise / 100),
          originalPrice: Math.round((item.mrpPaise || item.pricePaise * 1.25) / 100),
          discountPct: 20,
          image: item.imageUrl || '/product-almonds.jpg',
        }))
      : MOCKUP_ITEMS;

  const totalItemsCount = displayItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Subtotal calculated from items
  const subtotalAmount = displayItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const totalMrp = displayItems.reduce((acc, curr) => acc + curr.originalPrice * curr.quantity, 0);
  const discountAmount = Math.max(0, totalMrp - subtotalAmount);
  const deliveryCharge = selectedDelivery === 'express' ? 100 : 0;
  const gstAmount = Math.round(subtotalAmount * 0.05); // 5% GST
  const couponDiscount = appliedCoupon ? 50 : 0;
  const totalAmount = subtotalAmount + deliveryCharge + gstAmount - couponDiscount;

  // Coupon application handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'BANSAL50' || clean === 'FATEHPURI' || clean === 'FESTIVE10') {
      setAppliedCoupon(clean);
      setCouponMessage('Coupon applied! Extra ₹50 off.');
    } else {
      setCouponMessage('Invalid coupon code. Try BANSAL50');
    }
  };

  // ── Step 1: Sign In Handler ──
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setAuthError('Please enter your mobile number or email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await login(loginIdentifier.trim(), loginPassword);
      setCurrentStep(2);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setAuthError(err.message || 'Invalid credentials. Please verify your details.');
      } else {
        setAuthError('Unable to sign in. Please verify your mobile/email and password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 1: Register / Create Account Handler ──
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (!regAgreeTerms) {
      setAuthError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      await register({
        name: regName.trim(),
        phone: cleanPhone,
        email: regEmail.trim() ? regEmail.trim().toLowerCase() : undefined,
        password: regPassword,
        customerType: 'RETAIL',
        marketingOptIn: true,
      });
      setCurrentStep(2);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setAuthError(err.message || 'Registration failed. Please check your information.');
      } else {
        setAuthError('Registration could not be completed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ── Step 1: Google OAuth Handler ──
  const handleGoogleAuthClick = () => {
    const configuredId = getGoogleClientId();
    if (configuredId) {
      redirectToGoogle('/checkout');
    } else {
      setGoogleModalOpen(true);
    }
  };

  // ── Step 2: Add New Address Submission ──
  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.recipient.trim() || !newAddressForm.phone.trim() || !newAddressForm.flat.trim()) {
      return;
    }
    const newId = `addr-${Date.now()}`;
    const cleanLine1 = `${newAddressForm.flat}, ${newAddressForm.area}`.trim();
    const cleanAreaCity = `${newAddressForm.city}, ${newAddressForm.state} - ${newAddressForm.pincode}`;

    const created: SavedAddress = {
      id: newId,
      type: newAddressForm.type,
      isDefault: newAddressForm.isDefault,
      recipient: newAddressForm.recipient.trim(),
      phone: newAddressForm.phone.trim(),
      pincode: newAddressForm.pincode.trim(),
      flat: newAddressForm.flat.trim(),
      area: newAddressForm.area.trim(),
      landmark: newAddressForm.landmark.trim(),
      city: newAddressForm.city.trim(),
      state: newAddressForm.state.trim(),
      line1: cleanLine1,
      areaCity: cleanAreaCity,
    };

    const updatedList = [created, ...savedAddresses];
    setSavedAddresses(updatedList);
    setSelectedAddressId(newId);
    setIsAddingAddress(false);

    // Persist to account addresses so they show in Account > Addresses
    try {
      localStorage.setItem('bf_account_addresses', JSON.stringify(updatedList));
    } catch {
      /* ignore */
    }
  };

  // ── Continue to next step or place order ──
  const handleContinue = async () => {
    if (!isAuthenticated) {
      setCurrentStep(1);
      const el = document.getElementById('step-account-gate');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      const el = document.getElementById('section-order-summary');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      const el = document.getElementById('section-payment-method');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Step 4: Complete order placement
    setLoading(true);
    setOrderError(null);

    try {
      const activeAddress =
        savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
      const orderId = `BF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(
        2,
        '0',
      )}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;

      // Save complete order to localStorage tied to authenticated customer
      const orderRecord = {
        id: orderId,
        orderNumber: orderId,
        userId: user?.id,
        customerName: user?.name || activeAddress?.recipient || 'Bansal Customer',
        customerPhone: user?.phone || activeAddress?.phone || '+91 9313321535',
        customerEmail: user?.email || 'orders@bansalfoods.in',
        shippingAddress: {
          name: activeAddress?.recipient || user?.name || 'Customer',
          phone: activeAddress?.phone || user?.phone || '9313321535',
          line1: activeAddress?.line1 || `${activeAddress?.flat}, ${activeAddress?.area}`,
          city: activeAddress?.city || 'Delhi',
          state: activeAddress?.state || 'Delhi',
          stateCode: '07',
          pincode: activeAddress?.pincode || '110006',
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
        items: displayItems.map((i) => ({
          id: i.id,
          name: i.name,
          variant: i.weight,
          quantity: i.quantity,
          price: i.price,
          mrp: i.originalPrice,
          imageUrl: i.image,
        })),
        placedAt: new Date().toISOString(),
        status: 'CONFIRMED',
      };

      try {
        localStorage.setItem(`bansal_last_order_${orderId}`, JSON.stringify(orderRecord));
        localStorage.setItem('bansal_last_placed_order', JSON.stringify(orderRecord));
        const recent = JSON.parse(localStorage.getItem('bansal_recent_orders') || '[]');
        localStorage.setItem(
          'bansal_recent_orders',
          JSON.stringify([orderRecord, ...recent.slice(0, 15)]),
        );
        if (user?.id) {
          const userOrders = JSON.parse(
            localStorage.getItem(`bansal_user_orders_${user.id}`) || '[]',
          );
          localStorage.setItem(
            `bansal_user_orders_${user.id}`,
            JSON.stringify([orderRecord, ...userOrders.slice(0, 20)]),
          );
        }
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }

      // Try server checkout API if live cart has items
      if (cartItems.length > 0) {
        try {
          const res = await orderApi.checkout(
            {
              customerName: user?.name || activeAddress?.recipient || 'Customer',
              customerPhone: (user?.phone || activeAddress?.phone || '9313321535').replace(/\D/g, '').slice(-10),
              customerEmail: user?.email || undefined,
              shippingAddress: {
                name: activeAddress?.recipient || user?.name || 'Customer',
                phone: (activeAddress?.phone || user?.phone || '9313321535').replace(/\D/g, '').slice(-10),
                line1: activeAddress?.line1 || `${activeAddress?.flat}, ${activeAddress?.area}`,
                city: activeAddress?.city || 'Delhi',
                state: activeAddress?.state || 'Delhi',
                stateCode: '07',
                pincode: activeAddress?.pincode || '110006',
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
            const updatedRecord = {
              ...orderRecord,
              id: serverOrderId,
              orderNumber: res.data?.order?.orderNumber || serverOrderId,
            };
            localStorage.setItem(`bansal_last_order_${serverOrderId}`, JSON.stringify(updatedRecord));
            localStorage.setItem('bansal_last_placed_order', JSON.stringify(updatedRecord));
          } catch {}
          clearCart();
          router.push(`/order-success/${serverOrderId}`);
          return;
        } catch {
          // Backend may be running without DB or offline; gracefully fallback
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

  const activeAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

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
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">100% Secure Checkout</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Amazon &amp; Flipkart Standard Security</p>
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
                  <p className="text-[10px] text-gray-500 leading-tight">Need help? Mandi helpline</p>
                </div>
              </div>
            </div>

            {/* Right: Back to Cart Link */}
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#7A4116] transition-colors"
            >
              <span>←</span>
              <span>Back to Shop</span>
            </Link>
          </div>

          {/* Mobile Top Row */}
          <div className="flex md:hidden items-center justify-between">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 text-[#B87A24] flex items-center justify-center">
                  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
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
                <span className="font-serif font-extrabold text-sm text-[#24130A] tracking-tight leading-none">
                  BANSAL FOODS
                </span>
              </div>
              <span className="text-[6.5px] font-semibold text-[#8C5D17] tracking-wider uppercase mt-0.5">
                FATEHPURI, DELHI
              </span>
            </Link>

            <Link href="/shop" className="text-xs font-semibold text-[#7A4116]">
              ← Shop
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
            <span className="text-[#8C5D17]">🛒</span>
            <span>
              Order Summary <span className="text-gray-500 font-normal">({totalItemsCount} items)</span> •{' '}
              <strong className="text-[#8B1E1E]">₹{totalAmount.toLocaleString()}</strong>
            </span>
          </div>
          <span className="text-xs text-[#7A4116] font-bold flex items-center gap-1">
            {isMobileSummaryOpen ? 'Hide ▴' : 'Show ▾'}
          </span>
        </button>

        {isMobileSummaryOpen && (
          <div className="pt-3 pb-2 space-y-3 border-t border-[#EFE4D2] mt-2.5">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F140D] truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {item.weight} • Qty: {item.quantity}
                  </p>
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
        {/* ── 3. AMAZON / FLIPKART 4-STEP PROGRESS STEPPER ── */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-between relative">
            {/* Connecting Progress Line */}
            <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-0.5 bg-[#E8DDD0] z-0">
              <div
                className="h-full bg-[#52331C] transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? '12%'
                      : currentStep === 2
                      ? '42%'
                      : currentStep === 3
                      ? '75%'
                      : '100%',
                }}
              />
            </div>

            {/* Step 1: Login / Account */}
            <div
              onClick={() => {
                if (isAuthenticated) setCurrentStep(1);
              }}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  isAuthenticated
                    ? 'bg-[#15803D] text-white'
                    : currentStep === 1
                    ? 'bg-[#52331C] text-white ring-4 ring-[#E8DDD0]'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {isAuthenticated ? '✓' : '1'}
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">1. Account</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">
                {isAuthenticated ? 'Logged In' : 'Sign in / Register'}
              </p>
            </div>

            {/* Step 2: Address */}
            <div
              onClick={() => {
                if (isAuthenticated) setCurrentStep(2);
              }}
              className={`relative z-10 flex flex-col items-center group ${
                isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep > 2
                    ? 'bg-[#15803D] text-white'
                    : currentStep === 2
                    ? 'bg-[#52331C] text-white ring-4 ring-[#E8DDD0]'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">2. Address</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Delivery address</p>
            </div>

            {/* Step 3: Order Summary */}
            <div
              onClick={() => {
                if (isAuthenticated && currentStep > 2) setCurrentStep(3);
              }}
              className={`relative z-10 flex flex-col items-center group ${
                isAuthenticated && currentStep > 2 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep > 3
                    ? 'bg-[#15803D] text-white'
                    : currentStep === 3
                    ? 'bg-[#52331C] text-white ring-4 ring-[#E8DDD0]'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > 3 ? '✓' : '3'}
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">3. Summary</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Order items &amp; speed</p>
            </div>

            {/* Step 4: Payment */}
            <div
              onClick={() => {
                if (isAuthenticated && currentStep > 3) setCurrentStep(4);
              }}
              className={`relative z-10 flex flex-col items-center group ${
                isAuthenticated && currentStep > 3 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  currentStep === 4
                    ? 'bg-[#52331C] text-white ring-4 ring-[#E8DDD0]'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                4
              </div>
              <p className="text-xs font-bold text-[#1F140D] mt-1.5">4. Payment</p>
              <p className="text-[10px] text-gray-500 hidden sm:block">Pay &amp; place order</p>
            </div>
          </div>
        </div>

        {/* ── 4. TWO-COLUMN CHECKOUT MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ════════ LEFT COLUMN: FLIPKART/AMAZON STEP ACCORDION (7 COLS) ════════ */}
          <div className="lg:col-span-7 space-y-5">
            {orderError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{orderError}</span>
              </div>
            )}

            {/* ════════ STEP 1: LOGIN OR SIGNUP (ACCOUNT GATE) ════════ */}
            <div
              id="step-account-gate"
              className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs overflow-hidden transition-all"
            >
              {/* If Authenticated: Collapsed Completed Bar (Flipkart Style) */}
              {isAuthenticated && user && currentStep !== 1 ? (
                <div className="p-5 flex items-center justify-between bg-white hover:bg-[#FDFBF7] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                          1. LOGIN
                        </span>
                        <span className="text-xs font-bold text-[#1F140D]">{user.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        +91 {user.phone?.replace(/\D/g, '').slice(-10) || '9313321535'}{' '}
                        {user.email ? `• ${user.email}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setCurrentStep(1);
                    }}
                    className="border border-[#7A4116] text-[#7A4116] hover:bg-[#FAF4EA] font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    Change Account
                  </button>
                </div>
              ) : (
                /* Expanded Step 1: Login or Register Form */
                <div className="p-6 sm:p-7">
                  {/* Step Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">
                          Login or Create Account
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Every customer must have an account to place and track orders
                        </p>
                      </div>
                    </div>

                    {isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs text-[#7A4116] font-bold hover:underline"
                      >
                        Keep &amp; Continue →
                      </button>
                    )}
                  </div>

                  {/* Auth Switcher Tabs (Sign In vs Create Account) */}
                  <div className="flex border-b border-gray-200 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signin');
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                        authTab === 'signin'
                          ? 'border-[#7A4116] text-[#7A4116]'
                          : 'border-transparent text-gray-500 hover:text-black'
                      }`}
                    >
                      Sign In (Existing Customer)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('register');
                        setAuthError(null);
                      }}
                      className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                        authTab === 'register'
                          ? 'border-[#7A4116] text-[#7A4116]'
                          : 'border-transparent text-gray-500 hover:text-black'
                      }`}
                    >
                      Create Account (New Customer)
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Tab A: Sign In Form */}
                  {authTab === 'signin' ? (
                    <form onSubmit={handleSignInSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Mobile Number or Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. 9876543210 or siddharth@example.com"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-semibold text-gray-700">
                            Password <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                          >
                            {showLoginPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3 bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <span>Sign In &amp; Continue to Delivery Address →</span>
                        )}
                      </button>

                      {/* Google 1-Tap Login Option */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-semibold">
                          OR SIGN IN WITH
                        </span>
                        <div className="flex-grow border-t border-gray-200" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleAuthClick}
                        className="w-full py-2.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-2.5 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <p className="text-center text-xs text-gray-500 pt-1">
                        New to Bansal Foods?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab('register');
                            setAuthError(null);
                          }}
                          className="text-[#7A4116] font-bold hover:underline"
                        >
                          Create your account here
                        </button>
                      </p>
                    </form>
                  ) : (
                    /* Tab B: Create Account Form */
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Siddharth Kumar"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* 10-Digit Mobile */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-xs font-bold text-gray-500 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="9876543210"
                              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-r-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Email Address <span className="text-gray-400 font-normal">(for invoice)</span>
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D]"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Set Account Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#7A4116] focus:ring-1 focus:ring-[#7A4116] text-[#1F140D] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                          >
                            {showRegPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      {/* Terms agreement checkbox */}
                      <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regAgreeTerms}
                          onChange={(e) => setRegAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-[#7A4116] focus:ring-[#7A4116] w-4 h-4 accent-[#7A4116]"
                        />
                        <span className="text-xs text-gray-600 leading-tight">
                          By continuing, I agree to Bansal Foods{' '}
                          <Link href="/terms" target="_blank" className="text-[#7A4116] font-semibold underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" target="_blank" className="text-[#7A4116] font-semibold underline">
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3 bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <span>Create Account &amp; Continue to Delivery Address →</span>
                        )}
                      </button>

                      {/* Google 1-Tap Signup Option */}
                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-semibold">
                          OR QUICK REGISTER WITH
                        </span>
                        <div className="flex-grow border-t border-gray-200" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleAuthClick}
                        className="w-full py-2.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-2.5 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </button>

                      <p className="text-center text-xs text-gray-500 pt-1">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab('signin');
                            setAuthError(null);
                          }}
                          className="text-[#7A4116] font-bold hover:underline"
                        >
                          Sign in here
                        </button>
                      </p>
                    </form>
                  )}

                  {/* Trust highlight box */}
                  <div className="mt-5 p-3.5 bg-[#FAF6EE] border border-[#E9DAC8] rounded-xl flex items-center gap-3">
                    <span className="text-xl">🌿</span>
                    <div className="text-xs text-[#52331C]">
                      <strong className="block text-[#1F140D]">Genuine Fatehpuri Dry Fruits Guarantee</strong>
                      Orders are safely recorded in your account with live order tracking &amp; instant GST invoices.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ════════ STEP 2: DELIVERY ADDRESS ════════ */}
            <div className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs overflow-hidden transition-all">
              {/* If step not reached yet (Locked) */}
              {!isAuthenticated || currentStep < 2 ? (
                <div className="p-5 flex items-center justify-between text-gray-400 bg-gray-50/70">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      2. DELIVERY ADDRESS
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 italic">Sign in or register to unlock</span>
                </div>
              ) : currentStep > 2 ? (
                /* Collapsed Completed Address Summary */
                <div className="p-5 flex items-center justify-between bg-white hover:bg-[#FDFBF7] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                          2. DELIVERY ADDRESS
                        </span>
                        <span className="text-xs font-bold text-[#1F140D]">
                          {activeAddress?.recipient}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0E4] text-[#8C5D17] border border-[#C88C3C]/30">
                          {activeAddress?.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 truncate max-w-md">
                        {activeAddress?.line1}, {activeAddress?.areaCity} • Ph: {activeAddress?.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="border border-[#7A4116] text-[#7A4116] hover:bg-[#FAF4EA] font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                /* Expanded Step 2: Address Selection & New Address Form */
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Delivery Address</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Select the delivery address or add a new one for your account
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>{isAddingAddress ? '✕ Cancel' : '+ Add New Address'}</span>
                    </button>
                  </div>

                  {/* Add New Address Accordion Form */}
                  {isAddingAddress && (
                    <form
                      onSubmit={handleAddNewAddressSubmit}
                      className="mb-6 p-4 sm:p-5 bg-[#FAF6EE] border border-[#E6D4BD] rounded-xl space-y-3.5"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">
                        Add a New Delivery Address
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Recipient Full Name */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Recipient Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={newAddressForm.recipient}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, recipient: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>

                        {/* 10-Digit Phone */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            10-Digit Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={newAddressForm.phone}
                            onChange={(e) =>
                              setNewAddressForm({
                                ...newAddressForm,
                                phone: e.target.value.replace(/\D/g, ''),
                              })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Pincode */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Pincode (6-digit) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="e.g. 110006"
                            value={newAddressForm.pincode}
                            onChange={(e) =>
                              setNewAddressForm({
                                ...newAddressForm,
                                pincode: e.target.value.replace(/\D/g, ''),
                              })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>

                        {/* Flat / House No. */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Flat / House No., Building <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Flat 302, Green Park Apartments"
                            value={newAddressForm.flat}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, flat: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Area / Colony */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Area, Street, Colony <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Fatehpuri, Chandni Chowk"
                            value={newAddressForm.area}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, area: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Town / City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Delhi"
                            value={newAddressForm.city}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, city: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          />
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={newAddressForm.state}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, state: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#7A4116]"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Address Type Radio */}
                      <div className="pt-1 flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="addressType"
                            checked={newAddressForm.type === 'Home'}
                            onChange={() => setNewAddressForm({ ...newAddressForm, type: 'Home' })}
                            className="accent-[#7A4116]"
                          />
                          <span>Home (All day delivery)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="addressType"
                            checked={newAddressForm.type === 'Office'}
                            onChange={() => setNewAddressForm({ ...newAddressForm, type: 'Office' })}
                            className="accent-[#7A4116]"
                          />
                          <span>Office (Delivery 10 AM - 6 PM)</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#7A4116] text-white font-bold text-xs px-5 py-2 rounded-lg hover:bg-[#66340F]"
                        >
                          Save and Deliver Here
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Saved Addresses Cards */}
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border ${
                            isSelected
                              ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
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

                              {/* Details */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#1F140D]">{addr.recipient}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase">
                                    {addr.type}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="bg-[#E7F6EC] text-[#0F7638] text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 leading-snug">{addr.line1}</p>
                                <p className="text-xs text-gray-600 leading-snug">{addr.areaCity}</p>
                                <p className="text-xs text-gray-700 font-medium mt-1">
                                  Mobile: <strong>+91 {addr.phone}</strong>
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              {isSelected && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContinue();
                                  }}
                                  className="bg-[#E29B38] hover:bg-[#D48924] hover:shadow-sm active:scale-[0.98] transition-all duration-200 text-[#1F140D] font-extrabold text-xs px-4 py-2 rounded-lg shadow-xs uppercase tracking-wider cursor-pointer"
                                >
                                  Deliver Here
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Continue Button for Address */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      Deliver to this Address →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ════════ STEP 3: ORDER SUMMARY & DELIVERY SPEED ════════ */}
            <div
              id="section-order-summary"
              className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs overflow-hidden transition-all"
            >
              {!isAuthenticated || currentStep < 3 ? (
                <div className="p-5 flex items-center justify-between text-gray-400 bg-gray-50/70">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      3. ORDER SUMMARY
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 italic">Select address to review items</span>
                </div>
              ) : currentStep > 3 ? (
                /* Collapsed Summary */
                <div className="p-5 flex items-center justify-between bg-white hover:bg-[#FDFBF7] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                          3. ORDER SUMMARY
                        </span>
                        <span className="text-xs font-bold text-[#1F140D]">
                          {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {selectedDelivery === 'express'
                          ? 'Express Delivery (1-2 Business Days)'
                          : 'Standard Delivery (3-5 Business Days, Free)'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="border border-[#7A4116] text-[#7A4116] hover:bg-[#FAF4EA] font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                /* Expanded Step 3: Order Items & Delivery Speed */
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Order Summary</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Review order items and select delivery speed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {displayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 bg-[#FAF9F5]"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-[#1F140D] truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-500">Pack: {item.weight}</p>
                          <p className="text-[11px] text-gray-700 font-medium">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-xs sm:text-sm text-[#1F140D]">
                            ₹{item.price * item.quantity}
                          </p>
                          <p className="text-[10px] text-gray-400 line-through">
                            ₹{item.originalPrice * item.quantity}
                          </p>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            SAVED ₹{(item.originalPrice - item.price) * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Speed Options */}
                  <h4 className="font-bold text-xs text-[#1F140D] mb-3 uppercase tracking-wider">
                    Select Delivery Speed
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
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
                          {selectedDelivery === 'standard' && (
                            <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#1F140D]">Standard Delivery</h5>
                          <p className="text-[11px] text-gray-500">3 - 5 business days</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">Free Pan-India Delivery</p>
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
                          {selectedDelivery === 'express' && (
                            <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-[#1F140D]">Express Delivery</h5>
                          <p className="text-[11px] text-gray-500">1 - 2 business days</p>
                          <p className="text-[10px] text-gray-400">Priority Courier Dispatch</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#1F140D]">₹100</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-5">
                    Order confirmation email will be sent to{' '}
                    <strong>{user?.email || 'your registered email'}</strong>.
                  </p>

                  <div className="border-t border-gray-100 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ════════ STEP 4: PAYMENT OPTIONS & PLACE ORDER ════════ */}
            <div
              id="section-payment-method"
              className="bg-white rounded-2xl border border-[#E9DAC8] shadow-xs overflow-hidden transition-all"
            >
              {!isAuthenticated || currentStep < 4 ? (
                <div className="p-5 flex items-center justify-between text-gray-400 bg-gray-50/70">
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
                      4
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      4. PAYMENT OPTIONS
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 italic">Complete previous steps first</span>
                </div>
              ) : (
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
                    <div className="w-7 h-7 rounded-full bg-[#52331C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#1F140D]">Payment Method</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Select how you want to pay</p>
                    </div>
                  </div>

                  {/* 4 Payment Methods */}
                  <div className="space-y-3 mb-6">
                    {/* 1. UPI */}
                    <div
                      onClick={() => setSelectedPayment('UPI')}
                      className={`cursor-pointer rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border ${
                        selectedPayment === 'UPI'
                          ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedPayment === 'UPI' ? 'border-[#7A4116]' : 'border-gray-300'
                            }`}
                          >
                            {selectedPayment === 'UPI' && (
                              <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">
                              UPI <span className="text-[#8C5D17] font-semibold">(Recommended)</span>
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Google Pay, PhonePe, Paytm, BHIM or any UPI App
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-7 sm:pl-0">
                          <span className="text-[10px] font-bold border border-gray-200 px-2 py-0.5 rounded bg-white text-gray-700">
                            G Pay
                          </span>
                          <span className="text-[10px] font-bold border border-purple-200 px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                            PhonePe
                          </span>
                          <span className="text-[10px] font-bold border border-blue-200 px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            Paytm
                          </span>
                          <span className="text-[10px] font-bold border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            UPI
                          </span>
                        </div>
                      </div>

                      {selectedPayment === 'UPI' && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 pl-7">
                          <input
                            type="text"
                            placeholder="Enter your UPI ID (e.g. mobile@upi)"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* 2. Card */}
                    <div
                      onClick={() => setSelectedPayment('CARD')}
                      className={`cursor-pointer rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border ${
                        selectedPayment === 'CARD'
                          ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedPayment === 'CARD' ? 'border-[#7A4116]' : 'border-gray-300'
                            }`}
                          >
                            {selectedPayment === 'CARD' && (
                              <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">
                              Credit / Debit / ATM Card
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Visa, MasterCard, RuPay, Maestro and more
                            </p>
                          </div>
                        </div>

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

                      {selectedPayment === 'CARD' && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 pl-7 space-y-2.5">
                          <input
                            type="text"
                            placeholder="Card Number (16 digits)"
                            value={cardNumber}
                            maxLength={19}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-24 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-20 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Net Banking */}
                    <div
                      onClick={() => setSelectedPayment('NETBANKING')}
                      className={`cursor-pointer rounded-xl p-4 transition-all border ${
                        selectedPayment === 'NETBANKING'
                          ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedPayment === 'NETBANKING' ? 'border-[#7A4116]' : 'border-gray-300'
                            }`}
                          >
                            {selectedPayment === 'NETBANKING' && (
                              <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">Net Banking</h4>
                            <p className="text-[11px] text-gray-500">All major Indian banks supported</p>
                          </div>
                        </div>

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
                            AXIS
                          </span>
                        </div>
                      </div>

                      {selectedPayment === 'NETBANKING' && (
                        <div className="mt-3 pt-3 border-t border-amber-200/60 pl-7">
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Choose Your Bank
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white"
                          >
                            <option value="SBI">State Bank of India (SBI)</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 4. Cash on Delivery */}
                    <div
                      onClick={() => setSelectedPayment('COD')}
                      className={`cursor-pointer rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs border ${
                        selectedPayment === 'COD'
                          ? 'border-[#D4A359] bg-[#FFFBF4] ring-1 ring-[#D4A359]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedPayment === 'COD' ? 'border-[#7A4116]' : 'border-gray-300'
                            }`}
                          >
                            {selectedPayment === 'COD' && (
                              <div className="w-2 h-2 rounded-full bg-[#7A4116]" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F140D]">
                              Cash on Delivery (COD)
                            </h4>
                            <p className="text-[11px] text-gray-500">Pay with Cash or UPI upon delivery</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold">Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleContinue}
                      className="w-full py-4 px-6 bg-[#7A4116] hover:bg-[#66340F] text-white font-bold text-base sm:text-lg rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Confirming &amp; Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <span>Place Order &amp; Pay ₹{totalAmount.toLocaleString()}</span>
                          <span className="text-xl">→</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2.5">
                      🔒 100% Safe &amp; Secure Payments • Verified Bansal Foods Guarantee
                    </p>
                  </div>
                </div>
              )}
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

              {/* Items in Cart */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-[#1F140D] truncate">{item.name}</h5>
                      <p className="text-[11px] text-gray-500">{item.weight}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs text-[#1F140D]">₹{item.price * item.quantity}</p>
                      <p className="text-[10px] text-gray-400 line-through">
                        ₹{item.originalPrice * item.quantity}
                      </p>
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
                    placeholder="Enter BANSAL50"
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
                  <span>Price ({totalItemsCount} items)</span>
                  <span className="font-semibold text-[#1F140D]">₹{totalMrp.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#15803D]">
                  <span>Discount</span>
                  <span className="font-semibold">- ₹{discountAmount.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#15803D]">
                    <span>Coupon ({appliedCoupon})</span>
                    <span className="font-semibold">- ₹50</span>
                  </div>
                )}

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
                      You save ₹{(discountAmount + couponDiscount).toLocaleString()} on this order!
                    </p>
                  </div>
                </div>
              </div>

              {/* Savings Highlight Card */}
              <div className="bg-[#ECFDF3] border border-[#D1FADF] rounded-xl p-3 flex items-center gap-2 text-xs text-[#027A48] font-semibold">
                <span>🏷</span>
                <span>You are saving ₹{(discountAmount + couponDiscount).toLocaleString()} on this order!</span>
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
                    100% Original<br />Fatehpuri Quality
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
                  <h6 className="font-bold text-xs text-[#1F140D]">Need Help with Checkout?</h6>
                  <p className="text-xs font-bold text-[#7A4116]">9313321535 | 701119609</p>
                  <p className="text-[10px] text-gray-500">Mandi Store: Fatehpuri, Delhi - 110006</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Auth Redirect Modal */}
      <GoogleRedirectModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        redirectPath="/checkout"
      />
    </div>
  );
}
