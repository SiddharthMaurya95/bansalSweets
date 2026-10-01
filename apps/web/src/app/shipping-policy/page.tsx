import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Bansal Foods Khari Baoli',
  description:
    'Delivery timelines, Delhi NCR same-day/next-day dispatch, free delivery thresholds, and wholesale mandi transport terms.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#2C2114]">
      {/* ════ HERO BANNER ════ */}
      <section className="relative w-full min-h-[300px] sm:min-h-[360px] flex items-center bg-[#1B0F08] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute w-full h-full opacity-5" viewBox="0 0 1440 360" preserveAspectRatio="none">
            <path d="M0 360 V180 Q360 0 720 180 Q1080 360 1440 180 V360 Z" fill="#C88C3C" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B0F08] via-[#2D1509]/90 to-[#3D2010]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-white space-y-4">
              <nav className="text-xs text-amber-200/80 flex items-center gap-2">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white font-medium">Shipping Policy</span>
              </nav>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                Shipping &amp; Delivery{' '}
                <span className="font-serif italic font-normal text-[#E5A93C]">Policy</span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-lg">
                Direct dispatch from Fatehpuri Mandi Godown #14. Same-day processing, nitrogen-flushed
                vacuum packing, and pan-India courier coverage.
              </p>

              <p className="text-[11px] text-amber-200/60">
                Effective Date: 30 September 2026 &nbsp;•&nbsp; Retail &amp; Wholesale Logistics
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="bg-[#7A2E1A] hover:bg-[#642312] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/orders/track"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all"
                >
                  Track Order
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="bg-[#FAF5EC]/95 backdrop-blur-md border-2 border-[#D4AF37]/60 rounded-2xl p-6 shadow-2xl text-center max-w-xs transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 className="font-serif font-black text-lg text-[#0F2244]">Next Day Delivery</h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">Delhi NCR orders placed before 2 PM</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <span>✦</span>
                  <span>Free above ₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ DELIVERY TIMELINE CARDS ════ */}
      <section className="bg-[#190E08] text-white border-y border-[#331C10] py-5 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { zone: 'Delhi NCR Express', timing: 'Next Day', desc: 'Same-day for central Delhi PINs', color: 'text-emerald-400', border: 'sm:border-r sm:border-[#331C10]/80' },
            { zone: 'Metro Cities', timing: '2–3 Business Days', desc: 'Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata', color: 'text-blue-400', border: 'sm:border-r sm:border-[#331C10]/80' },
            { zone: 'Rest of India', timing: '3–5 Business Days', desc: '19,000+ verified Indian postal PIN codes', color: 'text-purple-400', border: '' },
          ].map((z) => (
            <div key={z.zone} className={`p-4 ${z.border} pr-2`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${z.color}`}>{z.zone}</span>
              <p className="text-lg font-black text-white mt-1">{z.timing}</p>
              <p className="text-xs text-gray-400 mt-1">{z.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ POLICY SECTIONS ════ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Dispatch Cutoff */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE5D4] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F140D] mb-3">1. Mandi Dispatch Cutoff Times</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  All retail and commercial orders placed before{' '}
                  <strong>2:00 PM IST (Monday through Saturday)</strong> undergo weighing,
                  nitrogen-flushed vacuum sealing, and dispatch on the same business day from our
                  central Khari Baoli godown. Orders placed after 2:00 PM or on Sundays/national
                  holidays are dispatched on the next working morning.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Fees */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE5D4] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F140D] mb-3">2. Shipping Fees &amp; Free Delivery Threshold</h2>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span><strong>Free Delivery:</strong> All retail orders with an item total of <strong>₹999 or more</strong> qualify for 100% Free Express Shipping across India.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span><strong>Standard Shipping:</strong> Orders under ₹999 incur a nominal flat shipping fee of <strong>₹80</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span><strong>Cash on Delivery (COD) Handling:</strong> A convenience fee of <strong>₹50</strong> is applied for cash collection at doorstep.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vacuum Packaging */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE5D4] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F140D] mb-3">3. Vacuum Packaging &amp; Lot Protection</h2>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span>All nuts are packed in high-barrier food-grade multi-layer vacuum pouches or reusable food-grade jars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span>Shipment cartons are sealed with tamper-evident security tape branded with the Bansal Foods hologram logo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>Do not accept packages if the outer security seal is severed or tampered with.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* B2B Wholesale */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE5D4] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F3E7D3] text-[#7A4116] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1F140D] mb-3">4. B2B Wholesale Mandi Freight</h2>
                <p className="text-sm text-gray-700 mb-3">For commercial bulk consignments (25 kg, 50 kg, 100 kg+):</p>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span>Dispatch is routed through verified transport agencies (e.g. V-Trans, TCI Freight, ARC, Delhi-UP Roadways).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span>Consignment note (Bilty / Lorry Receipt) is uploaded directly to your wholesale buyer dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C88C3C] mt-0.5">✦</span>
                    <span>Delivery available on door delivery or godown-pickup (Freight To-Pay / Paid) terms.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA STRIP ════ */}
      <section className="py-10 bg-[#1B0F08] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold">Questions about your delivery?</h3>
          <p className="text-sm text-gray-300/80">Our Fatehpuri team is available Mon–Sat 9 AM to 8 PM.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/orders/track" className="bg-[#C88C3C] hover:bg-[#B57C30] text-white font-bold text-sm px-7 py-3 rounded-full transition-colors shadow-md">
              Track My Order →
            </Link>
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm px-7 py-3 rounded-full transition-all">
              Contact Support
            </Link>
          </div>
          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-white/40">
            <Link href="/returns" className="hover:text-white/80 transition-colors">Return Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white/80 transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link href="/shop" className="hover:text-white/80 transition-colors">Shop Dry Fruits</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
