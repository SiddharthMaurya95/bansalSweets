'use client';

import React, { useState } from 'react';

interface WholesaleLead {
  id: string;
  inquiryNumber: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  cityState: string;
  gstin?: string;
  commodity: string;
  volumeKg: number;
  quotedRateInr?: number;
  submittedAt: string;
  status: 'NEW' | 'QUOTED' | 'NEGOTIATION' | 'ORDER_PLACED' | 'ARCHIVED';
  notes?: string;
}

const INITIAL_LEADS: WholesaleLead[] = [
  {
    id: 'lead-001',
    inquiryNumber: 'WL-2026-0901',
    businessName: 'Haldiram Snacks Pvt Ltd (Procurement Desk)',
    contactPerson: 'Vipin Aggarwal',
    phone: '+91 98112 34567',
    email: 'vipin.aggarwal@haldiram.example.com',
    cityState: 'Noida, Uttar Pradesh',
    gstin: '09AAACH1234F1Z8',
    commodity: 'W240 King Cashews',
    volumeKg: 250,
    quotedRateInr: 920,
    submittedAt: '30 Sep 2026, 09:15 AM',
    status: 'QUOTED',
    notes: 'Requires 25kg vacuum packaging, delivery to Sector 68 factory godown.',
  },
  {
    id: 'lead-002',
    inquiryNumber: 'WL-2026-0902',
    businessName: 'Kanpur Dry Fruit & Kirana Syndicate',
    contactPerson: 'Mahesh Gupta',
    phone: '+91 94151 77889',
    email: 'mandi.kanpur@example.com',
    cityState: 'Kanpur, Uttar Pradesh',
    gstin: '09AABCK9988D1Z2',
    commodity: 'Kashmiri Mamra Almonds',
    volumeKg: 100,
    quotedRateInr: 1950,
    submittedAt: '29 Sep 2026, 03:45 PM',
    status: 'NEGOTIATION',
    notes: 'Buyer requested ₹1920/kg for prompt RTGS payment on dispatch.',
  },
  {
    id: 'lead-003',
    inquiryNumber: 'WL-2026-0903',
    businessName: 'Royal Sweets & Confectioners',
    contactPerson: 'Sardar Gurpreet Singh',
    phone: '+91 98765 43210',
    email: 'royalsweets.ludhiana@example.com',
    cityState: 'Ludhiana, Punjab',
    gstin: '03AAACR4433E1ZX',
    commodity: 'Afghan Salted Pistachios',
    volumeKg: 50,
    submittedAt: '30 Sep 2026, 11:20 AM',
    status: 'NEW',
    notes: 'Diwali sweet production requirement. Needs delivery by 15th October.',
  },
  {
    id: 'lead-004',
    inquiryNumber: 'WL-2026-0904',
    businessName: 'Delhi Central Corporate Gifting',
    contactPerson: 'Pooja Verma',
    phone: '+91 99100 22334',
    email: 'pooja@delhigifting.example.com',
    cityState: 'Connaught Place, New Delhi',
    commodity: 'Assorted Festive Hampers (Bulk)',
    volumeKg: 80,
    quotedRateInr: 1400,
    submittedAt: '28 Sep 2026, 02:10 PM',
    status: 'ORDER_PLACED',
    notes: 'Order confirmed with 50% advance paid. Scheduled for 1st October dispatch.',
  },
];

export default function AdminWholesaleLeadsPage() {
  const [leads, setLeads] = useState<WholesaleLead[]>(INITIAL_LEADS);
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'NEW' | 'QUOTED' | 'NEGOTIATION' | 'ORDER_PLACED'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quotation Modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<WholesaleLead | null>(null);
  const [rateInr, setRateInr] = useState(1900);
  const [paymentTerms, setPaymentTerms] = useState('100% Advance via RTGS/NEFT');
  const [dispatchMode, setDispatchMode] = useState('Delhi Mandi Transport Godown (Freight To-Pay)');
  const [quoteNotes, setQuoteNotes] = useState('');

  // Add Manual Lead Modal
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cityState: '',
    gstin: '',
    commodity: 'Kashmiri Mamra Almonds',
    volumeKg: 50,
    notes: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenQuoteModal = (lead: WholesaleLead) => {
    setSelectedLead(lead);
    setRateInr(lead.quotedRateInr || 1850);
    setQuoteNotes(lead.notes || '');
    setQuoteModalOpen(true);
  };

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              quotedRateInr: rateInr,
              status: 'QUOTED',
              notes: `${quoteNotes} | Terms: ${paymentTerms}, Dispatch: ${dispatchMode}`,
            }
          : l,
      ),
    );

    setQuoteModalOpen(false);
    showNotification(
      `Formal Mandi quotation of ₹${rateInr}/kg saved for ${selectedLead.businessName}.`,
    );
  };

  const handleUpdateStatus = (leadId: string, nextStatus: WholesaleLead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)));
    showNotification(`Lead status updated to ${nextStatus}.`);
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: WholesaleLead = {
      id: `lead-${Date.now()}`,
      inquiryNumber: `WL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      businessName: newLeadForm.businessName,
      contactPerson: newLeadForm.contactPerson,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      cityState: newLeadForm.cityState,
      gstin: newLeadForm.gstin || undefined,
      commodity: newLeadForm.commodity,
      volumeKg: Number(newLeadForm.volumeKg),
      submittedAt: 'Just Now',
      status: 'NEW',
      notes: newLeadForm.notes,
    };

    setLeads([created, ...leads]);
    setAddLeadModalOpen(false);
    showNotification(`Walk-in wholesale lead recorded: ${created.inquiryNumber}`);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesQuery =
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.cityState.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const totalVolume = leads.reduce((acc, l) => acc + l.volumeKg, 0);

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Wholesale B2B &amp; Mandi Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Khari Baoli bulk buyer pipeline, Mandi proforma quotes, GSTIN verifications, and freight
            dispatches
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddLeadModalOpen(true)}
            className="px-4 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <span>+</span>
            <span>Record Walk-in Mandi Inquiry</span>
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
            Total Active Inquiries
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{leads.length} Leads</p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            {leads.filter((l) => l.status === 'NEW').length} New / Unquoted
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Bulk Volume Demanded
          </span>
          <p className="text-2xl font-black text-[#0B2A6B] mt-1">{totalVolume} kg</p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">Mandi Bulk Lots</span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Quoted Pipeline Value
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹6,88,500</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
            Avg. ₹1,434 / kg
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Deal Conversion
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">25.0%</p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            1 Order Placed This Week
          </span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {[
            { key: 'ALL', label: `All (${leads.length})` },
            { key: 'NEW', label: `New (${leads.filter((l) => l.status === 'NEW').length})` },
            {
              key: 'QUOTED',
              label: `Quoted (${leads.filter((l) => l.status === 'QUOTED').length})`,
            },
            {
              key: 'NEGOTIATION',
              label: `Negotiation (${leads.filter((l) => l.status === 'NEGOTIATION').length})`,
            },
            {
              key: 'ORDER_PLACED',
              label: `Order Placed (${leads.filter((l) => l.status === 'ORDER_PLACED').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === tab.key
                  ? 'bg-[#0B2A6B] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search business, contact or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs w-60 focus:border-[#0B2A6B]"
          />
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Lead # &amp; Date</th>
                <th className="p-4">Business / Buyer</th>
                <th className="p-4">Commodity &amp; Volume</th>
                <th className="p-4">Delivery Location</th>
                <th className="p-4 text-right">Quoted Rate</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.map((lead) => {
                const estValue = lead.quotedRateInr
                  ? `₹${(lead.volumeKg * lead.quotedRateInr).toLocaleString('en-IN')}`
                  : null;

                return (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-xs text-[#0B2A6B] block">
                        {lead.inquiryNumber}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lead.submittedAt}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{lead.businessName}</p>
                      <p className="text-[11px] text-slate-500">
                        {lead.contactPerson} • {lead.phone}
                      </p>
                      {lead.gstin && (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          GSTIN: {lead.gstin}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{lead.commodity}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[#0B2A6B] font-black text-[11px] mt-1">
                        {lead.volumeKg} kg
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="text-slate-800 font-medium">{lead.cityState}</p>
                    </td>

                    <td className="p-4 text-right">
                      {lead.quotedRateInr ? (
                        <div>
                          <p className="font-black text-slate-900 text-sm">
                            ₹{lead.quotedRateInr}{' '}
                            <span className="text-[10px] font-normal">/kg</span>
                          </p>
                          {estValue && (
                            <p className="text-[10px] text-emerald-700 font-bold">
                              Est: {estValue}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                          Quote Pending
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          lead.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : lead.status === 'QUOTED'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'NEGOTIATION'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenQuoteModal(lead)}
                        className="px-2.5 py-1.5 bg-[#0B2A6B] text-white font-bold rounded-lg hover:bg-[#1E4BA8] text-xs"
                      >
                        {lead.quotedRateInr ? 'Revise Quote' : 'Quote Rate'}
                      </button>

                      {lead.status !== 'ORDER_PLACED' && (
                        <button
                          onClick={() => handleUpdateStatus(lead.id, 'ORDER_PLACED')}
                          className="px-2.5 py-1.5 bg-[#15803D] text-white font-bold rounded-lg hover:bg-green-800 text-xs"
                        >
                          Confirm Order
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Namaste%20from%20Bansal%20Foods%20Khari%20Baoli.%20Regarding%20your%20inquiry%20${lead.inquiryNumber}...`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1.5 border border-slate-300 text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 text-xs inline-block"
                        title="Chat on WhatsApp"
                      >
                        💬
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Mandi Proforma Quotation ── */}
      {quoteModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B2A6B]">
                  Mandi Proforma Quote — {selectedLead.inquiryNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Buyer: {selectedLead.businessName} ({selectedLead.volumeKg} kg{' '}
                  {selectedLead.commodity})
                </p>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Quoted Mandi Rate (₹ / kg) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={rateInr}
                    onChange={(e) => setRateInr(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-black text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Calculated Lot Total
                  </label>
                  <div className="px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 font-black text-sm text-[#0B2A6B]">
                    ₹{(rateInr * selectedLead.volumeKg).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Payment Terms *
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-medium"
                >
                  <option value="100% Advance via RTGS/NEFT">100% Advance via RTGS/NEFT</option>
                  <option value="50% Advance + 50% Against Bilty (Transport Copy)">
                    50% Advance + 50% Against Bilty (Transport Copy)
                  </option>
                  <option value="Khari Baoli Mandi Local Cash on Delivery">
                    Khari Baoli Mandi Local Cash on Delivery
                  </option>
                  <option value="7 Days Verified Trade Credit (Approved B2B)">
                    7 Days Verified Trade Credit (Approved B2B)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Logistics &amp; Dispatch Point *
                </label>
                <select
                  value={dispatchMode}
                  onChange={(e) => setDispatchMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-medium"
                >
                  <option value="Delhi Mandi Transport Godown (Freight To-Pay)">
                    Delhi Mandi Transport Godown (Freight To-Pay)
                  </option>
                  <option value="Door Delivery via V-Trans / TCI Freight">
                    Door Delivery via V-Trans / TCI Freight
                  </option>
                  <option value="Khari Baoli Self-Pickup (Buyer Vehicle)">
                    Khari Baoli Self-Pickup (Buyer Vehicle)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Merchant Notes &amp; Quality Specifications
                </label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="e.g. Moisture < 5%, 25kg double-laminated bags with lot tags"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Mandi Proforma Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Record Walk-in Lead ── */}
      {addLeadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B2A6B]">
                  Record Walk-in Mandi Inquiry
                </h3>
                <p className="text-xs text-slate-500">Khari Baoli desk bulk buyer inquiry</p>
              </div>
              <button
                onClick={() => setAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Business / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aggarwal Sweets"
                    value={newLeadForm.businessName}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, businessName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Aggarwal"
                    value={newLeadForm.contactPerson}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="contact@example.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Commodity *
                  </label>
                  <select
                    value={newLeadForm.commodity}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, commodity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white font-medium"
                  >
                    <option value="Kashmiri Mamra Almonds">Kashmiri Mamra Almonds</option>
                    <option value="W240 King Cashews">W240 King Cashews</option>
                    <option value="Afghan Salted Pistachios">Afghan Salted Pistachios</option>
                    <option value="Snow White Kashmiri Walnuts">Snow White Kashmiri Walnuts</option>
                    <option value="Assorted Festive Hampers (Bulk)">
                      Assorted Festive Hampers (Bulk)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Required Volume (kg) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newLeadForm.volumeKg}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, volumeKg: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    City, State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={newLeadForm.cityState}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, cityState: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={newLeadForm.gstin}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Initial Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Visited Khari Baoli shop #14, inspected Mamra Lot sample"
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddLeadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2A6B] hover:bg-[#1E4BA8] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
