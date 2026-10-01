'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatInr } from '@bansal/shared/client';
import { useAuth } from '@/context/AuthContext';
import { orderApi, type OrderData } from '@/lib/api';

export default function AccountPage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');

  useEffect(() => {
    const localOrders =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('bansal_recent_orders') || '[]')
        : [];

    if (!authLoading && !isAuthenticated) {
      if (localOrders.length > 0) {
        setOrders(localOrders);
        setLoadingOrders(false);
        return;
      }
      router.push('/login?redirect=/account');
      return;
    }

    if (accessToken) {
      setLoadingOrders(true);
      orderApi
        .listMyOrders(accessToken)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setOrders(res.data);
          } else {
            setOrders(localOrders);
          }
        })
        .catch(() => {
          setOrders(localOrders);
        })
        .finally(() => setLoadingOrders(false));
    } else {
      setOrders(localOrders);
      setLoadingOrders(false);
    }
  }, [authLoading, isAuthenticated, accessToken, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="w-full max-w-md h-64 skeleton rounded-2xl bg-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B2A6B] text-[#F2D27A] flex items-center justify-center text-2xl font-black shadow-sm border border-[#D9A521]/40">
              {user?.name?.charAt(0).toUpperCase() || 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B1F2A]">
                  {user?.name || 'Customer Account'}
                </h1>
                <span className="text-[10px] bg-[#FFF9EE] text-[#0B2A6B] border border-[#F2D27A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {user?.role || 'Retail Customer'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user?.phone ? `📱 ${user.phone}` : ''} {user?.email ? `• ✉️ ${user.email}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-4 py-2 bg-[#0B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#1E4BA8] transition-colors shadow-sm"
            >
              Order Dry Fruits →
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'text-[#0B2A6B] border-b-2 border-[#0B2A6B]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'profile'
                ? 'text-[#0B2A6B] border-b-2 border-[#0B2A6B]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Profile &amp; Preferences
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'support'
                ? 'text-[#0B2A6B] border-b-2 border-[#0B2A6B]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Fatehpuri Mandi Support
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 skeleton rounded-2xl bg-white" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <span className="text-4xl block mb-3">📦</span>
                <h3 className="font-bold text-gray-900 text-base mb-1">No Orders Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                  You haven&apos;t placed any orders yet. Discover our premium Kashmiri and Afghan
                  dry fruits.
                </p>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-[#0B2A6B] text-white text-xs font-bold rounded-xl hover:bg-[#1E4BA8] transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-[#0B2A6B]">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          ord.status === 'CONFIRMED' || ord.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : ord.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ord.placedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Deliver to: {ord.shippingAddress?.city}, {ord.shippingAddress?.state} •
                      Payment: {ord.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-gray-400">Total Amount</p>
                      <p className="font-extrabold text-base text-[#0B2A6B]">
                        {formatInr(ord.totalPaise)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/track?orderId=${ord.orderNumber || ord.id}`}
                        className="px-3.5 py-2 bg-[#FAF4EA] hover:bg-[#F3E7D3] text-[#7A4116] border border-[#E8D9C5] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>Track</span>
                        <span>→</span>
                      </Link>
                      <Link
                        href={`/order-success/${ord.id}`}
                        className="px-3.5 py-2 border border-gray-300 hover:border-[#0B2A6B] text-[#0B2A6B] text-xs font-bold rounded-xl transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <h3 className="font-bold text-base text-[#1B1F2A]">Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px] block">
                  Name
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-1 block">
                  {user?.name || '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px] block">
                  Customer Type
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-1 block">
                  {user?.role === 'WHOLESALE' ? '💼 Wholesale / B2B Buyer' : '🛒 Retail Customer'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px] block">
                  Mobile Number
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-1 block">
                  {user?.phone || 'Not linked'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 uppercase tracking-wider font-bold text-[10px] block">
                  Email Address
                </span>
                <span className="font-semibold text-gray-800 text-sm mt-1 block">
                  {user?.email || 'Not linked'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fatehpuri Mandi Support */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm max-w-2xl space-y-4">
            <h3 className="font-bold text-base text-[#1B1F2A]">Bansal Foods Direct Support</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We operate directly from Asia&apos;s largest dry-fruit trading market in Fatehpuri,
              Chandni Chowk, Delhi. For bulk rate negotiations, customized gifting, or delivery
              assistance, reach out directly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#FFF9EE] border border-[#F2D27A] text-xs">
                <p className="font-bold text-[#0B2A6B]">📞 Mandi Helpdesk</p>
                <p className="text-gray-600 mt-1">+91 11 2390 1234</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Mon–Sat, 10:00 AM – 7:30 PM IST</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF9EE] border border-[#F2D27A] text-xs">
                <p className="font-bold text-[#0B2A6B]">✉️ Email Inquiries</p>
                <p className="text-gray-600 mt-1">support@bansalfoods.in</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Response within 2 hours</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/wholesale"
                className="inline-block text-xs font-bold text-[#0B2A6B] hover:underline"
              >
                Download Fatehpuri Wholesale Mandi Rate Card →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
