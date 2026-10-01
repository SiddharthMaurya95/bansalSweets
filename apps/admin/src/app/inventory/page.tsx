'use client';

import React, { useState } from 'react';

interface SkuInventoryItem {
  id: string;
  sku: string;
  name: string;
  variant: string;
  category: string;
  onHand: number;
  reserved: number;
  safetyBuffer: number;
  available: number;
  unit: string;
  reorderLevel: number;
}

interface BatchItem {
  id: string;
  batchNumber: string;
  commodity: string;
  supplierName: string;
  grade: string;
  initialQty: number;
  remainingQty: number;
  procuredDate: string;
  bestBeforeDate: string;
  daysRemaining: number;
  qcPassed: boolean;
  status: 'ACTIVE' | 'DEPLETED' | 'NEAR_EXPIRY' | 'QUARANTINE';
}

const INITIAL_SKUS: SkuInventoryItem[] = [
  {
    id: 'sku-001',
    sku: 'ALM-MAMRA-500G',
    name: 'Kashmiri Mamra Almonds',
    variant: '500g Vacuum Pack',
    category: 'Almonds',
    onHand: 180,
    reserved: 12,
    safetyBuffer: 10,
    available: 158,
    unit: 'packs',
    reorderLevel: 25,
  },
  {
    id: 'sku-002',
    sku: 'ALM-MAMRA-25KG',
    name: 'Kashmiri Mamra Almonds',
    variant: '25kg Tin (Wholesale)',
    category: 'Almonds',
    onHand: 14,
    reserved: 2,
    safetyBuffer: 2,
    available: 10,
    unit: 'tins',
    reorderLevel: 3,
  },
  {
    id: 'sku-003',
    sku: 'CSH-W240-500G',
    name: 'W240 King Cashews',
    variant: '500g Jar',
    category: 'Cashews',
    onHand: 340,
    reserved: 15,
    safetyBuffer: 20,
    available: 305,
    unit: 'jars',
    reorderLevel: 50,
  },
  {
    id: 'sku-004',
    sku: 'PST-AFG-500G',
    name: 'Afghan Salted Pistachios',
    variant: '500g Pouch',
    category: 'Pistachios',
    onHand: 42,
    reserved: 10,
    safetyBuffer: 15,
    available: 17,
    unit: 'pouches',
    reorderLevel: 30,
  },
  {
    id: 'sku-005',
    sku: 'WLN-KASH-500G',
    name: 'Snow White Walnuts (Kashmiri)',
    variant: '500g Box',
    category: 'Walnuts',
    onHand: 120,
    reserved: 8,
    safetyBuffer: 15,
    available: 97,
    unit: 'boxes',
    reorderLevel: 25,
  },
];

const INITIAL_BATCHES: BatchItem[] = [
  {
    id: 'batch-001',
    batchNumber: 'LOT-KASH-2026-09',
    commodity: 'Kashmiri Mamra Almonds (Grade A+)',
    supplierName: 'Kashmir Dry Fruit Growers Co-op, Srinagar',
    grade: 'A+ Export Origin',
    initialQty: 500,
    remainingQty: 145,
    procuredDate: '01 Sep 2026',
    bestBeforeDate: '25 Dec 2026',
    daysRemaining: 86,
    qcPassed: true,
    status: 'ACTIVE',
  },
  {
    id: 'batch-002',
    batchNumber: 'LOT-GOA-2026-08',
    commodity: 'W240 King Cashews',
    supplierName: 'Konkan Agro Processors, Goa',
    grade: 'Supreme W240 Whole',
    initialQty: 800,
    remainingQty: 280,
    procuredDate: '15 Aug 2026',
    bestBeforeDate: '15 Jan 2027',
    daysRemaining: 107,
    qcPassed: true,
    status: 'ACTIVE',
  },
  {
    id: 'batch-003',
    batchNumber: 'LOT-AFG-2026-06',
    commodity: 'Afghan Salted Pistachios',
    supplierName: 'Khyber Trading Agency, Fatehpuri Import',
    grade: 'Jumbo Salted Natural Open',
    initialQty: 300,
    remainingQty: 35,
    procuredDate: '10 Jun 2026',
    bestBeforeDate: '20 Oct 2026',
    daysRemaining: 20,
    qcPassed: true,
    status: 'NEAR_EXPIRY',
  },
];

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'BATCHES'>('STOCK');
  const [skuList, setSkuList] = useState<SkuInventoryItem[]>(INITIAL_SKUS);
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Inward Modal
  const [inwardModalOpen, setInwardModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batchNumber: `LOT-DEL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    commodity: 'Kashmiri Mamra Almonds',
    supplierName: 'Fatehpuri Wholesale Mandi Traders',
    grade: 'A+ Export Grade',
    quantity: 100,
    costPerUnitInr: 1800,
    bestBeforeDate: '2027-03-31',
    fssaiBatchCert: 'FSSAI-DEL-26-88912',
  });

  // Adjust Stock Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<SkuInventoryItem | null>(null);
  const [deltaQty, setDeltaQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('STOCKTAKE');
  const [adjustNote, setAdjustNote] = useState('');

  // Buffer Edit State
  const [bufferModalOpen, setBufferModalOpen] = useState(false);
  const [bufferItem, setBufferItem] = useState<SkuInventoryItem | null>(null);
  const [newBuffer, setNewBuffer] = useState(10);

  // Status message
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdBatch: BatchItem = {
      id: `batch-${Date.now()}`,
      batchNumber: newBatch.batchNumber,
      commodity: newBatch.commodity,
      supplierName: newBatch.supplierName,
      grade: newBatch.grade,
      initialQty: Number(newBatch.quantity),
      remainingQty: Number(newBatch.quantity),
      procuredDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      bestBeforeDate: new Date(newBatch.bestBeforeDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      daysRemaining: 180,
      qcPassed: true,
      status: 'ACTIVE',
    };

    setBatches([createdBatch, ...batches]);
    setInwardModalOpen(false);
    showNotification(
      `Successfully receipted harvest lot ${newBatch.batchNumber} into Fatehpuri warehouse.`,
    );
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;

    setSkuList((prev) =>
      prev.map((sku) => {
        if (sku.id !== adjustItem.id) return sku;
        const updatedOnHand = Math.max(0, sku.onHand + deltaQty);
        const updatedAvail = Math.max(0, updatedOnHand - sku.reserved - sku.safetyBuffer);
        return {
          ...sku,
          onHand: updatedOnHand,
          available: updatedAvail,
        };
      }),
    );

    setAdjustModalOpen(false);
    showNotification(
      `Stock adjusted for ${adjustItem.sku} (${deltaQty > 0 ? `+${deltaQty}` : deltaQty} units). Reason: ${adjustReason}.`,
    );
  };

  const handleUpdateBuffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bufferItem) return;

    setSkuList((prev) =>
      prev.map((sku) => {
        if (sku.id !== bufferItem.id) return sku;
        const updatedAvail = Math.max(0, sku.onHand - sku.reserved - newBuffer);
        return {
          ...sku,
          safetyBuffer: newBuffer,
          available: updatedAvail,
        };
      }),
    );

    setBufferModalOpen(false);
    showNotification(`Safety buffer updated to ${newBuffer} for ${bufferItem.sku}.`);
  };

  const filteredSkus = skuList.filter((item) => {
    const matchesQuery =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory &amp; Mandi Batch Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-SKU stock balances, safety buffers, harvest lot traceability, and expiry
            audits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInwardModalOpen(true)}
            className="px-4 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <span>📥</span>
            <span>Inward New Harvest Lot</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total On-Hand Items
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {skuList.reduce((acc, it) => acc + it.onHand, 0)} Units
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            Across 5 Primary SKUs
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Reserved for Orders
          </span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {skuList.reduce((acc, it) => acc + it.reserved, 0)} Units
          </p>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 inline-block">
            15-min Checkout Holds Active
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Safety Stock Buffers
          </span>
          <p className="text-2xl font-black text-[#0B2A6B] mt-1">
            {skuList.reduce((acc, it) => acc + it.safetyBuffer, 0)} Units
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            Oversell Prevention Guard
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Harvest Lots
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{batches.length} Lots</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
            100% Mandi QC Passed
          </span>
        </div>
      </div>

      {/* ── Tabs & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STOCK'
                ? 'bg-[#0B2A6B] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📦 SKU Stock Balances ({skuList.length})
          </button>
          <button
            onClick={() => setActiveTab('BATCHES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'BATCHES'
                ? 'bg-[#0B2A6B] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🏷️ Mandi Harvest Lots &amp; Expiry ({batches.length})
          </button>
        </div>

        {activeTab === 'STOCK' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Search SKU or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none w-48 text-xs focus:border-[#0B2A6B]"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs bg-white text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Almonds">Almonds</option>
              <option value="Cashews">Cashews</option>
              <option value="Pistachios">Pistachios</option>
              <option value="Walnuts">Walnuts</option>
            </select>
          </div>
        )}
      </div>

      {/* ── TAB 1: SKU STOCK TABLE ── */}
      {activeTab === 'STOCK' && (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">SKU Code &amp; Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Physical On-Hand</th>
                  <th className="p-4 text-right">Reserved (Hold)</th>
                  <th className="p-4 text-right">Safety Buffer</th>
                  <th className="p-4 text-right">Sellable Stock</th>
                  <th className="p-4">Stock Health</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSkus.map((sku) => {
                  const isLow = sku.available <= sku.reorderLevel;
                  return (
                    <tr key={sku.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-xs text-[#0B2A6B] block">
                          {sku.sku}
                        </span>
                        <p className="font-bold text-slate-900 mt-0.5">{sku.name}</p>
                        <p className="text-[11px] text-slate-400">{sku.variant}</p>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600 text-[10px]">
                          {sku.category}
                        </span>
                      </td>

                      <td className="p-4 text-right font-bold text-slate-800">
                        {sku.onHand} <span className="text-[10px] text-slate-400">{sku.unit}</span>
                      </td>

                      <td className="p-4 text-right font-medium text-amber-700">
                        {sku.reserved > 0 ? `${sku.reserved} ${sku.unit}` : '—'}
                      </td>

                      <td className="p-4 text-right font-medium text-slate-500">
                        <button
                          onClick={() => {
                            setBufferItem(sku);
                            setNewBuffer(sku.safetyBuffer);
                            setBufferModalOpen(true);
                          }}
                          className="hover:underline hover:text-[#0B2A6B] font-bold"
                          title="Click to edit safety buffer"
                        >
                          {sku.safetyBuffer} {sku.unit} ✏️
                        </button>
                      </td>

                      <td className="p-4 text-right font-black text-sm text-[#0B2A6B]">
                        {sku.available} <span className="text-[10px]">{sku.unit}</span>
                      </td>

                      <td className="p-4">
                        {isLow ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px] animate-pulse">
                            ⚠️ Low Stock (&le; {sku.reorderLevel})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                            ✓ Healthy
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setAdjustItem(sku);
                            setDeltaQty(0);
                            setAdjustReason('STOCKTAKE');
                            setAdjustNote('');
                            setAdjustModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:border-slate-400 text-xs"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: HARVEST LOTS & SHELF LIFE TABLE ── */}
      {activeTab === 'BATCHES' && (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Lot # &amp; Commodity</th>
                  <th className="p-4">Origin / Mandi Supplier</th>
                  <th className="p-4">Grade &amp; QC</th>
                  <th className="p-4 text-right">Inward Qty</th>
                  <th className="p-4 text-right">Remaining Qty</th>
                  <th className="p-4">Procured Date</th>
                  <th className="p-4">Best Before</th>
                  <th className="p-4">Expiry Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {batches.map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-xs text-[#0B2A6B] block">
                        {lot.batchNumber}
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">{lot.commodity}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{lot.supplierName}</p>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] block w-fit">
                        {lot.grade}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                        ✓ QC Passed (Fatehpuri)
                      </span>
                    </td>

                    <td className="p-4 text-right font-medium text-slate-600">
                      {lot.initialQty} kg
                    </td>

                    <td className="p-4 text-right font-black text-slate-900 text-sm">
                      {lot.remainingQty} kg
                    </td>

                    <td className="p-4 text-slate-600">{lot.procuredDate}</td>

                    <td className="p-4 font-medium text-slate-800">{lot.bestBeforeDate}</td>

                    <td className="p-4">
                      {lot.status === 'NEAR_EXPIRY' ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full text-[10px] animate-pulse">
                          ⚡ Expiring in {lot.daysRemaining} days
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                          ✓ Fresh ({lot.daysRemaining} days left)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: Inward New Harvest Lot ── */}
      {inwardModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B2A6B]">
                  Inward Fresh Mandi Harvest Lot
                </h3>
                <p className="text-xs text-slate-500">
                  Record incoming shipment at Fatehpuri warehouse
                </p>
              </div>
              <button
                onClick={() => setInwardModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInwardSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Lot / Batch Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.batchNumber}
                    onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Commodity *
                  </label>
                  <select
                    value={newBatch.commodity}
                    onChange={(e) => setNewBatch({ ...newBatch, commodity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-medium"
                  >
                    <option value="Kashmiri Mamra Almonds">Kashmiri Mamra Almonds</option>
                    <option value="W240 King Cashews">W240 King Cashews</option>
                    <option value="Afghan Salted Pistachios">Afghan Salted Pistachios</option>
                    <option value="Snow White Kashmiri Walnuts">Snow White Kashmiri Walnuts</option>
                    <option value="Medjool Royal Dates">Medjool Royal Dates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Supplier / Co-op Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBatch.supplierName}
                  onChange={(e) => setNewBatch({ ...newBatch, supplierName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Quality Grade *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.grade}
                    onChange={(e) => setNewBatch({ ...newBatch, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Cost Price (₹ / kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newBatch.costPerUnitInr}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, costPerUnitInr: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Best Before Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBatch.bestBeforeDate}
                    onChange={(e) => setNewBatch({ ...newBatch, bestBeforeDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  FSSAI Batch Testing Certificate #
                </label>
                <input
                  type="text"
                  value={newBatch.fssaiBatchCert}
                  onChange={(e) => setNewBatch({ ...newBatch, fssaiBatchCert: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setInwardModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-bold rounded-xl shadow-sm"
                >
                  Save &amp; Receipt Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Adjust Stock ── */}
      {adjustModalOpen && adjustItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Adjust Physical Stock for {adjustItem.sku}
            </h3>
            <p className="text-xs text-slate-500">
              Current on-hand: {adjustItem.onHand} {adjustItem.unit}
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Adjustment Delta (+ to add, - to subtract) *
                </label>
                <input
                  type="number"
                  required
                  value={deltaQty}
                  onChange={(e) => setDeltaQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none font-bold text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  New on-hand will be:{' '}
                  <strong>
                    {Math.max(0, adjustItem.onHand + deltaQty)} {adjustItem.unit}
                  </strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Adjustment Reason *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                >
                  <option value="STOCKTAKE">Physical Count Correction / Stocktake</option>
                  <option value="DAMAGE">In-transit or Godown Damage</option>
                  <option value="EXPIRY_WRITE_OFF">Moisture / Expiry Write-Off</option>
                  <option value="SAMPLE_DISPATCH">Wholesale Buyer Sampling</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Discrepancy verified by Fatehpuri godown manager"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-bold rounded-xl"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Safety Buffer ── */}
      {bufferModalOpen && bufferItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Update Safety Buffer for {bufferItem.sku}
            </h3>
            <p className="text-xs text-slate-500">
              Safety buffer stock is protected against online ordering to prevent overselling during
              high-volume Mandi hours.
            </p>

            <form onSubmit={handleUpdateBuffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Buffer Quantity ({bufferItem.unit}) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newBuffer}
                  onChange={(e) => setNewBuffer(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none font-bold text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBufferModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-bold rounded-xl"
                >
                  Save Buffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
