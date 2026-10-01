'use client';

import React, { useState } from 'react';

interface AdminReview {
  id: string;
  productName: string;
  sku: string;
  reviewerName: string;
  reviewerPhone: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  moderationNote?: string;
}

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev-001',
    productName: 'Kashmiri Mamra Almonds',
    sku: 'ALM-MAMRA-500G',
    reviewerName: 'Rajesh K. Bansal',
    reviewerPhone: '+91 98110 12345',
    rating: 5,
    title: 'Authentic Fatehpuri quality! High oil content and unmatched crunch',
    body: 'We have been buying dry fruits from Khari Baoli for 20 years. These Mamra almonds are genuinely high oil content, no polish, natural sweetness. Ordering online is just as authentic as the shop.',
    isVerifiedPurchase: true,
    status: 'APPROVED',
    submittedAt: '30 Sep 2026, 11:45 AM',
  },
  {
    id: 'rev-002',
    productName: 'W240 King Cashews',
    sku: 'CSH-W240-500G',
    reviewerName: 'Meenakshi Sundaram',
    reviewerPhone: '+91 98401 22334',
    rating: 5,
    title: 'Huge size, completely unbroken kernels',
    body: 'The vacuum packing preserved freshness perfectly during transit to Chennai. Every cashew is whole and creamy. Great job Bansal Foods team.',
    isVerifiedPurchase: true,
    status: 'APPROVED',
    submittedAt: '29 Sep 2026, 04:10 PM',
  },
  {
    id: 'rev-003',
    productName: 'Afghan Salted Pistachios',
    sku: 'PST-AFG-500G',
    reviewerName: 'Sanjay Chhabra',
    reviewerPhone: '+91 99112 88990',
    rating: 4,
    title: 'Good flavor and easy open shells, mild salt',
    body: 'Very fresh pistachios with natural green color. Salt level is just right for evening tea. Would prefer 1kg family pouch option.',
    isVerifiedPurchase: true,
    status: 'PENDING',
    submittedAt: '30 Sep 2026, 10:20 AM',
  },
  {
    id: 'rev-004',
    productName: 'Snow White Walnuts (Kashmiri)',
    sku: 'WLN-KASH-500G',
    reviewerName: 'Anil Joshi',
    reviewerPhone: '+91 94120 55667',
    rating: 5,
    title: 'Light golden kernels with no bitterness',
    body: 'Hard to find genuine snow white Kashmiri akhrot without oil rancidity in retail markets. These arrived fresh and vacuum-sealed.',
    isVerifiedPurchase: false,
    status: 'PENDING',
    submittedAt: '30 Sep 2026, 09:05 AM',
  },
  {
    id: 'rev-005',
    productName: 'Kashmiri Mamra Almonds',
    sku: 'ALM-MAMRA-500G',
    reviewerName: 'Spam Bot Profile',
    reviewerPhone: '+91 90000 00000',
    rating: 1,
    title: 'Visit our external discount site at http://free-cashew.xyz',
    body: 'Click here for 90% coupon discounts across all Delhi dry fruits.',
    isVerifiedPurchase: false,
    status: 'REJECTED',
    submittedAt: '28 Sep 2026, 01:00 AM',
    moderationNote: 'Spam link detected and filtered',
  },
];

export default function AdminReviewsPage() {
  const [reviewsList, setReviewsList] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>(
    'PENDING',
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [rejectReason, setRejectReason] = useState(
    'Inappropriate content or external advertising links',
  );

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: 'APPROVED' as const, moderationNote: undefined } : r,
      ),
    );
    showNotification('Review approved and published to live storefront product page.');
  };

  const handleOpenReject = (review: AdminReview) => {
    setSelectedReview(review);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? { ...r, status: 'REJECTED' as const, moderationNote: rejectReason }
          : r,
      ),
    );

    setRejectModalOpen(false);
    showNotification(`Review rejected: "${rejectReason}"`);
  };

  const filteredReviews = reviewsList.filter((rev) => {
    const matchesFilter = statusFilter === 'ALL' || rev.status === statusFilter;
    const matchesQuery =
      rev.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const pendingCount = reviewsList.filter((r) => r.status === 'PENDING').length;
  const approvedCount = reviewsList.filter((r) => r.status === 'APPROVED').length;
  const verifiedCount = reviewsList.filter((r) => r.isVerifiedPurchase).length;

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews &amp; Social Proof Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticate genuine buyer feedback, verify Mandi quality claims, and publish verified
            testimonials
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl animate-pulse">
              ⚠️ {pendingCount} Pending Moderation
            </span>
          )}
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
            Total Reviews Received
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{reviewsList.length} Reviews</p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            Across all dry fruit SKUs
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Moderation Queue
          </span>
          <p className="text-2xl font-black text-amber-700 mt-1">{pendingCount} Awaiting Review</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 inline-block">
            Mandi Quality Desk Check
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Storefront Average Score
          </span>
          <p className="text-2xl font-black text-[#0B2A6B] mt-1">4.9 / 5.0 ⭐</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
            {approvedCount} Live Testimonials
          </span>
        </div>

        <div className="admin-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Verified Buyer Share
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {Math.round((verifiedCount / reviewsList.length) * 100)}%
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
            Order # Authenticated
          </span>
        </div>
      </div>

      {/* ── Filter Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { key: 'PENDING', label: `Pending Queue (${pendingCount})` },
            { key: 'APPROVED', label: `Published Live (${approvedCount})` },
            {
              key: 'REJECTED',
              label: `Rejected (${reviewsList.filter((r) => r.status === 'REJECTED').length})`,
            },
            { key: 'ALL', label: `All (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
              className={`px-3.5 py-2 rounded-xl transition-all ${
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
            placeholder="Search reviews, products or buyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs w-60 focus:border-[#0B2A6B]"
          />
        </div>
      </div>

      {/* ── Reviews Table ── */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Product &amp; SKU</th>
                <th className="p-4">Customer &amp; Status</th>
                <th className="p-4">Rating &amp; Feedback</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Moderation State</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    No reviews in this status queue.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{rev.productName}</p>
                      <span className="font-mono text-[10px] text-slate-400">{rev.sku}</span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{rev.reviewerName}</p>
                      <p className="text-[10px] text-slate-400">{rev.reviewerPhone}</p>
                      {rev.isVerifiedPurchase ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                          ✓ Verified Buyer
                        </span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="p-4 max-w-md">
                      <div className="flex items-center gap-1 text-[#D9A521] text-xs font-bold mb-1">
                        {'★'.repeat(rev.rating)}
                        <span className="text-slate-400 font-normal text-[10px] ml-1">
                          ({rev.rating}/5)
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs">{rev.title}</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed mt-1 line-clamp-2">
                        {rev.body}
                      </p>
                      {rev.moderationNote && (
                        <p className="text-[10px] text-rose-700 font-medium mt-1">
                          Note: {rev.moderationNote}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">{rev.submittedAt}</td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          rev.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : rev.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {rev.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprove(rev.id)}
                          className="px-2.5 py-1.5 bg-[#15803D] hover:bg-green-800 text-white font-bold rounded-lg text-xs"
                        >
                          ✓ Approve
                        </button>
                      )}

                      {rev.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleOpenReject(rev)}
                          className="px-2.5 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-lg text-xs"
                        >
                          ✕ Reject
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${rev.reviewerPhone.replace(/[^0-9]/g, '')}?text=Namaste%20${encodeURIComponent(
                          rev.reviewerName,
                        )},%20thank%20you%20for%20your%20feedback%20on%20Bansal%20Foods%20Fatehpuri...`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1.5 border border-slate-300 text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 text-xs inline-block"
                        title="Contact customer on WhatsApp"
                      >
                        💬
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Rejection Modal ── */}
      {rejectModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Reject Review for {selectedReview.productName}
            </h3>
            <p className="text-xs text-slate-500">
              Select the compliance or quality moderation reason for rejecting this customer
              feedback.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Rejection Reason *
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none bg-white font-medium"
                >
                  <option value="Inappropriate content or external advertising links">
                    Inappropriate content or external advertising links
                  </option>
                  <option value="Duplicate or bot-generated submission">
                    Duplicate or bot-generated submission
                  </option>
                  <option value="Feedback pertains to third-party courier, not Mandi dry fruit quality">
                    Feedback pertains to third-party courier, not Mandi dry fruit quality
                  </option>
                  <option value="Contains personal identifiable information (PII)">
                    Contains personal identifiable information (PII)
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
