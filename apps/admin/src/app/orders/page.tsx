'use client';

import React, { useState } from 'react';

interface AdminOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: { name: string; variant: string; qty: number; price: string }[];
  totalInr: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING_COLLECTION' | 'FAILED';
  status: 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  courierName?: string;
  trackingNumber?: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'BF-20260930-4X91',
    placedAt: '30 Sep 2026, 11:30 AM',
    customerName: 'Rajesh K. Bansal',
    customerPhone: '+91 98110 12345',
    shippingAddress: 'Flat 402, Royal Residency, Civil Lines, Delhi 110054',
    items: [
      { name: 'Kashmiri Mamra Almonds', variant: '500g', qty: 2, price: '₹2,400' },
      { name: 'W240 King Cashews', variant: '500g', qty: 1, price: '₹650' },
    ],
    totalInr: '₹3,050',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
  },
  {
    id: 'ord-002',
    orderNumber: 'BF-20260930-8Y12',
    placedAt: '30 Sep 2026, 10:15 AM',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98711 54321',
    shippingAddress: 'Tower 4, DLF Phase 5, Gurugram 122002',
    items: [{ name: 'Afghan Salted Pistachios', variant: '500g', qty: 2, price: '₹1,600' }],
    totalInr: '₹1,600',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
  },
  {
    id: 'ord-003',
    orderNumber: 'BF-20260930-1M33',
    placedAt: '30 Sep 2026, 09:40 AM',
    customerName: 'Mandi B2B Wholesale Corp',
    customerPhone: '+91 94150 99887',
    shippingAddress: 'Godown 12, Naya Ganj, Kanpur, UP 208001',
    items: [{ name: 'Kashmiri Mamra Almonds', variant: '25kg Tin', qty: 2, price: '₹96,000' }],
    totalInr: '₹96,000',
    paymentMethod: 'NETBANKING',
    paymentStatus: 'PAID',
    status: 'PACKED',
    courierName: 'Delhi-Kanpur Express Freight',
    trackingNumber: 'DKF-902144',
  },
  {
    id: 'ord-004',
    orderNumber: 'BF-20260929-9K74',
    placedAt: '29 Sep 2026, 04:20 PM',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 99990 88776',
    shippingAddress: 'B-12, Vasant Vihar, New Delhi 110057',
    items: [{ name: 'Snow White Walnuts', variant: '500g', qty: 1, price: '₹750' }],
    totalInr: '₹800',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING_COLLECTION',
    status: 'DISPATCHED',
    courierName: 'Delhi Mandi Local Courier',
    trackingNumber: 'DLC-110023',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'DELIVERED'
  >('ALL');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Dispatch modal state
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<AdminOrder | null>(null);
  const [courierName, setCourierName] = useState('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  const filteredOrders =
    activeTab === 'ALL' ? orders : orders.filter((o) => o.status === activeTab);

  const handleMarkPacked = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'PACKED' } : o)));
  };

  const handleOpenDispatch = (ord: AdminOrder) => {
    setTargetOrder(ord);
    setTrackingNumber(`EXP-${Math.floor(100000 + Math.random() * 900000)}`);
    setDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? {
              ...o,
              status: 'DISPATCHED',
              courierName,
              trackingNumber,
            }
          : o,
      ),
    );
    setDispatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Orders &amp; Mandi Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Weighing, vacuum packaging, GST invoice generation, and courier docket assignment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Total Active Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px text-xs font-bold">
        {[
          { key: 'ALL', label: `All Orders (${orders.length})` },
          {
            key: 'CONFIRMED',
            label: `Ready to Pack (${orders.filter((o) => o.status === 'CONFIRMED').length})`,
          },
          {
            key: 'PACKED',
            label: `Packed & Weighed (${orders.filter((o) => o.status === 'PACKED').length})`,
          },
          {
            key: 'DISPATCHED',
            label: `In Transit (${orders.filter((o) => o.status === 'DISPATCHED').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 rounded-t-xl transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#0B2A6B] border-t-2 border-x border-slate-200 border-t-[#0B2A6B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Order Number &amp; Date</th>
                <th className="p-4">Customer &amp; Address</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4 text-right">Total (INR)</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-bold text-sm text-[#0B2A6B]">{ord.orderNumber}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ord.placedAt}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-500 max-w-xs truncate">
                      {ord.shippingAddress}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">📞 {ord.customerPhone}</p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <p key={idx} className="text-[11px]">
                          <strong>{it.name}</strong> ({it.variant}) × {it.qty}
                        </p>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 text-right font-black text-slate-900 text-sm">
                    {ord.totalInr}
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-700 block">{ord.paymentMethod}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        ord.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {ord.paymentStatus === 'PAID' ? '✓ Paid' : 'Cash on Delivery'}
                    </span>
                  </td>

                  <td className="p-4">
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
                    {ord.trackingNumber && (
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        {ord.trackingNumber}
                      </p>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {ord.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleMarkPacked(ord.id)}
                        className="px-2.5 py-1.5 bg-[#0B2A6B] text-white font-bold rounded-lg hover:bg-[#1E4BA8]"
                      >
                        Mark Packed
                      </button>
                    )}

                    {ord.status === 'PACKED' && (
                      <button
                        onClick={() => handleOpenDispatch(ord)}
                        className="px-2.5 py-1.5 bg-[#15803D] text-white font-bold rounded-lg hover:bg-green-800"
                      >
                        Dispatch Courier →
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:border-slate-400"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Dispatch Modal ── */}
      {dispatchModalOpen && targetOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Dispatch Order {targetOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Enter courier partner details and docket number for customer tracking notification
            </p>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="Blue Dart Air">Blue Dart Air</option>
                  <option value="Delhi Mandi Local Courier">Delhi Mandi Local Courier</option>
                  <option value="DTDC Cargo">DTDC Cargo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tracking Docket Number *
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#15803D] hover:bg-green-800 text-white font-bold rounded-xl"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Invoice Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B2A6B]">
                  GST Tax Invoice - {selectedOrder.orderNumber}
                </h3>
                <p className="text-[10px] text-slate-400">Bansal Foods • Fatehpuri Mandi</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Seller GSTIN:</span>
                <span className="font-mono font-bold">07AAAAA0000A1Z5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FSSAI License:</span>
                <span className="font-mono font-bold">13320001000123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Invoice Amount:</span>
                <span className="font-extrabold text-[#0B2A6B]">{selectedOrder.totalInr}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#0B2A6B] text-white font-bold rounded-xl text-xs hover:bg-[#1E4BA8]"
              >
                🖨️ Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
