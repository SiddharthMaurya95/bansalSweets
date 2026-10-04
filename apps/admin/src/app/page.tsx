'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface OrderItemSummary {
  orderNumber: string;
  customerName: string;
  destination: string;
  itemsCount: number;
  totalInr: string;
  paymentMethod: string;
  status: 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED';
}

const RECENT_ORDERS: OrderItemSummary[] = [
  {
    orderNumber: 'BF-20260930-4X91',
    customerName: 'Rajesh K. Bansal',
    destination: 'Civil Lines, Delhi 110054',
    itemsCount: 3,
    totalInr: '₹3,450',
    paymentMethod: 'UPI',
    status: 'CONFIRMED',
  },
  {
    orderNumber: 'BF-20260930-8Y12',
    customerName: 'Ananya Sharma',
    destination: 'Sector 54, Gurugram 122002',
    itemsCount: 2,
    totalInr: '₹2,100',
    paymentMethod: 'CARD',
    status: 'CONFIRMED',
  },
  {
    orderNumber: 'BF-20260930-1M33',
    customerName: 'Mandi B2B Wholesale Corp',
    destination: 'Naya Ganj, Kanpur 208001',
    itemsCount: 50,
    totalInr: '₹58,500',
    paymentMethod: 'NETBANKING',
    status: 'PACKED',
  },
  {
    orderNumber: 'BF-20260929-9K74',
    customerName: 'Vikram Mehta',
    destination: 'Vasant Vihar, Delhi 110057',
    itemsCount: 1,
    totalInr: '₹1,200',
    paymentMethod: 'COD',
    status: 'DISPATCHED',
  },
];

const LOT_HEALTH = [
  {
    batchNumber: 'BATCH-2026-KM-01',
    commodity: 'Kashmiri Mamra Almonds',
    origin: 'Kashmir Valley',
    remainingKg: 145,
    bestBefore: '25 Dec 2026',
    status: 'FRESH',
    daysLeft: 86,
  },
  {
    batchNumber: 'BATCH-2026-W240-02',
    commodity: 'W240 King Cashews',
    origin: 'Goa',
    remainingKg: 280,
    bestBefore: '15 Jan 2027',
    status: 'FRESH',
    daysLeft: 107,
  },
  {
    batchNumber: 'BATCH-2026-AP-04',
    commodity: 'Afghan Salted Pistachios',
    origin: 'Afghanistan',
    remainingKg: 35,
    bestBefore: '20 Oct 2026',
    status: 'NEAR_EXPIRY',
    daysLeft: 20,
  },
];

export default function AdminDashboardPage() {
  const [ordersList, setOrdersList] = useState(RECENT_ORDERS);
  const [sweeping, setSweeping] = useState(false);
  const [sweepMsg, setSweepMsg] = useState<string | null>(null);

  const handleQuickStatusUpdate = (orderNumber: string, nextStatus: 'PACKED' | 'DISPATCHED') => {
    setOrdersList((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: nextStatus } : o)),
    );
  };

  const handleSweepReservations = () => {
    setSweeping(true);
    setSweepMsg(null);
    setTimeout(() => {
      setSweeping(false);
      setSweepMsg('Expired reservation sweep executed. Released 0 stale holds.');
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* ── Top Metric Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Khari Baoli Mandi Operations Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time dry fruit fulfillment, batch shelf-life health, and wholesale order dispatch
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSweepReservations}
            disabled={sweeping}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>🧹</span>
            <span>{sweeping ? 'Sweeping...' : 'Sweep Expired Holds'}</span>
          </button>

          <Link
            href="/inventory"
            className="px-4 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            + Inward Harvest Lot
          </Link>
        </div>
      </div>

      {sweepMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl font-semibold">
          {sweepMsg}
        </div>
      )}

      {/* ── 4 KPI Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="admin-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Today&apos;s Mandi GMV
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#0B2A6B] mt-1.5">₹1,48,500</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
            ↑ +18.4% vs yesterday
          </span>
        </div>

        <div className="admin-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Orders Today
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">32 Orders</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
            14 Pending Dispatch
          </span>
        </div>

        <div className="admin-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Harvest Lots
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">6 Batches</p>
          <span className="text-[11px] font-bold text-amber-600 mt-1 inline-block">
            1 Near-Expiry Warning (&lt; 30d)
          </span>
        </div>

        <div className="admin-card p-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Wholesale Leads
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">8 Inquiries</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
            Est. Bulk: 450 kg
          </span>
        </div>
      </div>

      {/* ── Live Order Queue ── */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Live Mandi Packing &amp; Dispatch Queue
            </h2>
            <p className="text-xs text-slate-400">
              Orders requiring verification, weighing, and courier docket generation
            </p>
          </div>
          <Link href="/orders" className="text-xs font-bold text-[#0B2A6B] hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer &amp; Destination</th>
                <th className="p-3 text-right">Items</th>
                <th className="p-3 text-right">Total (INR)</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ordersList.map((ord) => (
                <tr key={ord.orderNumber} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#0B2A6B]">{ord.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-400">{ord.destination}</p>
                  </td>
                  <td className="p-3 text-right font-medium">{ord.itemsCount}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{ord.totalInr}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-600">{ord.paymentMethod}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ord.status === 'CONFIRMED'
                          ? 'bg-amber-100 text-amber-800'
                          : ord.status === 'PACKED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.orderNumber, 'PACKED')}
                        className="px-2.5 py-1 bg-[#0B2A6B] text-white text-[11px] font-bold rounded-lg hover:bg-[#1E4BA8]"
                      >
                        Mark Packed
                      </button>
                    )}
                    {ord.status === 'PACKED' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(ord.orderNumber, 'DISPATCHED')}
                        className="px-2.5 py-1 bg-[#15803D] text-white text-[11px] font-bold rounded-lg hover:bg-green-800"
                      >
                        Dispatch
                      </button>
                    )}
                    {ord.status === 'DISPATCHED' && (
                      <span className="text-[11px] font-semibold text-slate-400">In Transit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Batch Health & Expiry Tracker ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Harvest Lot &amp; Expiry Health Monitor
              </h2>
              <p className="text-xs text-slate-400">
                Shelf life tracking for Khari Baoli warehouse lots and bulk packaging
              </p>
            </div>
            <Link href="/inventory" className="text-xs font-bold text-[#0B2A6B] hover:underline">
              Inventory Console →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Commodity &amp; Origin</th>
                  <th className="p-3 text-right">Remaining</th>
                  <th className="p-3">Best Before</th>
                  <th className="p-3">Expiry Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {LOT_HEALTH.map((lot) => (
                  <tr key={lot.batchNumber} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0B2A6B]">{lot.batchNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{lot.commodity}</p>
                      <p className="text-[10px] text-slate-400">{lot.origin}</p>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {lot.remainingKg} kg
                    </td>
                    <td className="p-3">{lot.bestBefore}</td>
                    <td className="p-3">
                      {lot.status === 'FRESH' ? (
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Fresh ({lot.daysLeft}d left)
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          ⚠️ Action Required ({lot.daysLeft}d left)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Guide (4 cols) */}
        <div className="lg:col-span-4 admin-card p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Mandi Quick Actions</h3>
          <div className="space-y-2.5 text-xs">
            <Link
              href="/orders"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between border border-slate-200 transition-colors block"
            >
              <div>
                <p className="font-bold text-slate-800">Generate GST Tax Invoices</p>
                <p className="text-[10px] text-slate-500">Sequential FY2627 invoice numbers</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
            </Link>

            <Link
              href="/inventory"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between border border-slate-200 transition-colors block"
            >
              <div>
                <p className="font-bold text-slate-800">Inward Arrival Lots</p>
                <p className="text-[10px] text-slate-500">Record fresh Kashmir &amp; Goa lots</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
            </Link>

            <Link
              href="/wholesale-leads"
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between border border-slate-200 transition-colors block"
            >
              <div>
                <p className="font-bold text-slate-800">Commercial Wholesale Leads</p>
                <p className="text-[10px] text-slate-500">Review pending bulk mandi inquiries</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
