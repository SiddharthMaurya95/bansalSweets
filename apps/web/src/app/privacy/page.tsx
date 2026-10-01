import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy & DPDP Act 2023 Compliance | Bansal Foods Fatehpuri',
  description:
    'Our commitment to privacy, personal data security, and rights under the Digital Personal Data Protection Act 2023.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9A521] block mb-1">
          Legal &amp; Compliance • Bansal Foods Fatehpuri
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0B2A6B] tracking-tight">
          Privacy Policy &amp; Data Protection
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Effective Date: 30 September 2026 • Compliant with Digital Personal Data Protection (DPDP)
          Act 2023
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            1. Overview &amp; Data Fiduciary Identity
          </h2>
          <p>
            <strong>BANSAL FOODS</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;),
            operating from Khari Baoli, Fatehpuri, Delhi 110006, acts as the Data Fiduciary under
            the Digital Personal Data Protection Act 2023 (DPDP Act). We are dedicated to
            maintaining the highest degree of confidentiality, security, and integrity regarding the
            personal and transactional data of our retail patrons and wholesale buyers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">2. Personal Data We Collect</h2>
          <p>
            We process only data strictly necessary to fulfill e-commerce transactions and
            regulatory compliance:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Identity &amp; Contact:</strong> Full name, telephone number (for OTP
              verification and delivery coordination), and email address.
            </li>
            <li>
              <strong>Delivery Information:</strong> Physical shipping address, pin code, and
              delivery preferences.
            </li>
            <li>
              <strong>Tax &amp; Commercial Compliance:</strong> GSTIN number, trading name, and
              state code for B2B wholesale buyers requiring GST Tax Invoices.
            </li>
            <li>
              <strong>Technical Identifiers:</strong> IP hash, device user-agent, and transactional
              session tokens (stored securely in HttpOnly cookies).
            </li>
          </ul>
          <p className="text-xs text-gray-500 italic mt-1">
            Note: We do NOT store payment card CVV numbers, netbanking credentials, or UPI PINs. All
            payment processing is secured via RBI-licensed payment aggregators (e.g. Razorpay).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            3. Purpose of Processing &amp; Consent
          </h2>
          <p>Your personal information is collected solely for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Weighing, vacuum packaging, and courier dispatch of dry-fruit consignments from our
              Fatehpuri warehouse.
            </li>
            <li>
              Issuing statutory GST Tax Invoices (Form GST INV-1) in compliance with CBIC and Delhi
              State GST regulations.
            </li>
            <li>
              Sending SMS / WhatsApp updates on shipment dispatch, out-for-delivery alerts, and
              delivery confirmations.
            </li>
            <li>FSSAI traceability audits and food quality recalls if mandated by law.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">4. Your Rights Under DPDP Act 2023</h2>
          <p>As a Data Principal in India, you enjoy comprehensive statutory rights:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-bold text-[#0B2A6B]">Right to Information</p>
              <p className="text-xs text-gray-500 mt-1">
                Access summary of your personal data processed and shared with courier partners.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-bold text-[#0B2A6B]">Right to Correction</p>
              <p className="text-xs text-gray-500 mt-1">
                Update erroneous phone numbers, billing addresses, or commercial GST details.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-bold text-[#0B2A6B]">Right to Erasure (Account Deletion)</p>
              <p className="text-xs text-gray-500 mt-1">
                Permanently erase your online profile and anonymize identity records via your
                Account settings.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-bold text-[#0B2A6B]">Right to Grievance Redressal</p>
              <p className="text-xs text-gray-500 mt-1">
                Direct escalation to our resident Fatehpuri Data Protection &amp; Grievance Officer.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#0B2A6B]">
            5. Data Retention &amp; Security Measures
          </h2>
          <p>
            We implement cryptographic password hashing via Argon2id with 64MB memory cost, AES-256
            data protection at rest, automated refresh token family rotation, and strict PII
            redaction on server logs.
          </p>
          <p>
            Statutory invoice records are maintained for 7 years as required under Section 36 of the
            Central Goods and Services Tax (CGST) Act, 2017, after which financial records are
            archived in cold storage.
          </p>
        </section>

        <section className="space-y-2 border-t pt-4">
          <h2 className="text-lg font-bold text-[#0B2A6B]">6. Grievance Officer Contact</h2>
          <p>
            For any privacy concerns, right to erasure requests, or data audit inquiries, contact
            our Data Grievance Officer:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
            <p>
              <strong>Grievance Officer:</strong> Ramesh Kumar Bansal
            </p>
            <p>
              <strong>Designation:</strong> Compliance &amp; Operations Head, Bansal Foods
            </p>
            <p>
              <strong>Registered Address:</strong> Khari Baoli, Fatehpuri, Chandni Chowk, Delhi
              110006
            </p>
            <p>
              <strong>Email:</strong> privacy@bansalfoods.in • <strong>Phone:</strong> +91 (011)
              2391-4567
            </p>
          </div>
        </section>

        <div className="pt-4 border-t flex items-center justify-between text-xs">
          <Link href="/" className="font-bold text-[#0B2A6B] hover:underline">
            ← Back to Storefront
          </Link>
          <Link href="/terms" className="font-bold text-[#0B2A6B] hover:underline">
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
