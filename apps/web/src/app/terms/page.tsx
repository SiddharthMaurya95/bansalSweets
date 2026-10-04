import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Bansal Foods Khari Baoli Mandi',
  description:
    'Commercial terms, dry-fruit quality grades, natural weight tolerances, and return guidelines for retail and wholesale buyers.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9A521] block mb-1">
          Legal &amp; Mandi Regulations • Bansal Foods Khari Baoli
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B2A6B] tracking-tight">
          Terms of Service &amp; Mandi Sale Guidelines
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Last Updated: 30 September 2026 • Governed by the Laws of the Union of India
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            1. Merchant Identity &amp; Food License
          </h2>
          <p>
            These terms govern all transactions conducted on the <strong>Bansal Foods</strong>{' '}
            platform (bansalfoods.in) and at our physical wholesale desk located at Khari Baoli,
            Chandni Chowk, Delhi 110006.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
            <p>
              <strong>FSSAI Registration No:</strong> 13320001000123 (Food Safety and Standards
              Authority of India)
            </p>
            <p>
              <strong>GSTIN:</strong> 07AAAAA0000A1Z5 (Delhi State Jurisdiction)
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            2. Natural Produce &amp; Weight Tolerance
          </h2>
          <p>
            Dry fruits, nuts, and edible seeds are natural agricultural commodities subject to
            seasonal harvest variations, climate factors, and natural moisture exchange.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Natural Desiccation Variance:</strong> In compliance with Legal Metrology
              (Packaged Commodities) Rules, 2011, packed dry fruits may experience a natural
              moisture weight variance of up to ±2% depending on atmospheric humidity during
              transport.
            </li>
            <li>
              <strong>Grading Integrity:</strong> All lot grades (e.g. W240 Whole Cashews, Grade A+
              Kashmiri Mamra, Afghan Natural-Open Pistachios) are physically inspected at our
              Khari Baoli desk before vacuum packaging.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">3. Pricing, GST &amp; Invoicing</h2>
          <p>
            All listed retail prices are inclusive of Goods and Services Tax (GST at 5% or 12% as
            applicable under HSN Chapter 08).
          </p>
          <p>
            Every order generates a sequential, verifiable GST Tax Invoice. Registered commercial
            buyers providing a valid GSTIN at checkout will have their purchase reflected in their
            GSTR-2B input tax credit filing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">4. Cash on Delivery (COD) Terms</h2>
          <p>
            COD is offered across serviceable Indian pin codes up to a maximum cart value of ₹5,000.
            A standard handling charge of ₹50 is applied to cover courier collection fees. COD
            consignments undergo automated OTP and address verification before godown dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            5. Returns, Quality Claims &amp; Refunds
          </h2>
          <p>
            Due to the perishable nature of edible nuts and food commodities, returns are governed
            by strict quality inspection rules:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Eligibility:</strong> Claims must be lodged within <strong>48 hours</strong>{' '}
              of verified courier delivery in case of vacuum-seal puncture during transit, moisture
              damage, or wrong variant dispatch.
            </li>
            <li>
              <strong>Photographic Evidence:</strong> High-resolution photographs of the outer
              carton, batch label, and inner packaging seal must be provided.
            </li>
            <li>
              <strong>Resolution:</strong> Validated claims receive a complimentary replacement lot
              dispatched express or a full refund to the original payment source within 3–5 business
              days.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">6. Dispute Jurisdiction</h2>
          <p>
            Any legal dispute or claim arising out of transactions on this platform shall be subject
            to the exclusive jurisdiction of the competent courts located in{' '}
            <strong>New Delhi, India</strong>.
          </p>
        </section>

        <div className="pt-4 border-t flex items-center justify-between text-xs">
          <Link href="/privacy" className="font-bold text-[#0B2A6B] hover:underline">
            ← Privacy Policy
          </Link>
          <Link href="/shipping-policy" className="font-bold text-[#0B2A6B] hover:underline">
            Shipping &amp; Logistics Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
