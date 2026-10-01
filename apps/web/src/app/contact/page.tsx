'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Types ──────────────────────────────────────────────────── */
interface FormData {
  name: string;
  mobile: string;
  email: string;
  subject: string;
  orderId: string;
  message: string;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

/* ─── Static data ─────────────────────────────────────────────── */
const SUBJECTS = [
  'Order Inquiry',
  'Return / Refund Request',
  'Wholesale / Bulk Order',
  'Product Quality Complaint',
  'Shipping & Delivery',
  'Payment Issue',
  'General Inquiry',
];

const BUYER_TYPES = [
  { label: 'Retailers', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { label: 'Restaurants', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg> },
  { label: 'Hotels', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg> },
  { label: 'Caterers', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 21M9.5 9.5C9.5 9.5 10 15 15 16.5" /><path d="M14.5 7.5C14.5 7.5 16 9 16 12" /></svg> },
  { label: 'Sweet Shops', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> },
  { label: 'Corporate Gifting', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></svg> },
];

const FAQS = [
  { q: 'Where is Bansal Foods located?', a: 'We are located at Fatehpuri, Chandni Chowk, Delhi – 110006, in the heart of the historic spice and dry fruit market.' },
  { q: 'Do you offer delivery?', a: 'Yes! We offer pan-India delivery. Orders above ₹999 qualify for free shipping. Delivery to Delhi NCR takes 1–2 days; rest of India 3–5 business days.' },
  { q: 'How can I contact the store?', a: 'You can call us at 9313321535 or 701119609, email info@bansalfoods.in, or WhatsApp us at +91-9313321535 during store hours.' },
  { q: 'Can I order through WhatsApp?', a: 'Yes! Send us your order details on WhatsApp at +91-9313321535. Our team will confirm availability, pricing, and delivery details within a few hours.' },
  { q: 'How can I track my order?', a: 'Use the "Track Order" link in the navigation or visit /orders/track. Enter your order ID from the confirmation email or SMS to get live updates.' },
  { q: 'What are your store timings?', a: 'Our store is open Monday to Saturday 9:00 AM – 6:00 PM and Sunday 10:00 AM – 6:00 PM. Online orders can be placed any time.' },
  { q: 'Do you accept wholesale orders?', a: 'Yes! We specialize in wholesale dry fruits for retailers, restaurants, caterers, hotels and corporate clients. Contact us or fill out the wholesale inquiry form.' },
  { q: 'How can I get a wholesale quote?', a: 'Click "Request Wholesale Quote" on this page or call 9313321535. Our wholesale desk responds within 2 business hours with competitive mandi rates.' },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', mobile: '', email: '', subject: '', orderId: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* form helpers */
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim() || form.message.trim().length < 15) e.message = 'Message must be at least 15 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2114]">

      {/* ════ 1. HERO ════ */}
      <section className="relative w-full min-h-[260px] sm:min-h-[300px] overflow-hidden bg-[#1B0F08]">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-market-scene.jpg" alt="Contact Bansal Foods" fill className="object-cover object-center opacity-55" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B0F08]/95 via-[#1B0F08]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center justify-between gap-6">
          <div className="max-w-lg">
            <nav className="text-xs text-amber-200/70 flex items-center gap-1.5 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-white/40">›</span>
              <span className="text-white/90 font-medium">Contact Us</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-3">
              Get in Touch with<br />
              <span className="italic text-[#E5A93C]">Bansal Foods</span>
            </h1>
            <p className="text-sm text-gray-300/90 leading-relaxed">
              Have a question about our products, your order or a wholesale requirement? We&apos;re here to help.
            </p>
          </div>

          {/* Right: Bansal Foods box */}
          <div className="hidden lg:flex shrink-0 items-center justify-end">
            <div className="bg-[#FAF5EC]/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden w-[200px] h-[160px] relative">
              <Image src="/b2b-retailers.jpg" alt="Bansal Foods Store" fill className="object-cover opacity-70" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1B0F08]/50">
                <div className="bg-[#FAF5EC]/90 rounded-xl px-3 py-2 text-center">
                  <p className="font-serif font-black text-sm text-[#1F140D] leading-tight">BANSAL FOODS</p>
                  <p className="text-[8px] font-bold text-[#8C5D17] tracking-widest uppercase mt-0.5">DRY FRUITS • WHOLESALE • RETAIL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 2. FOUR CONTACT METHOD CARDS ════ */}
      <section className="bg-white border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EFE5D4]">

            {/* Call Us */}
            <div className="p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF0EC] border border-[#F0D4C8] text-[#8C1C1C] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8C1C1C] mb-0.5">CALL US</p>
                <p className="font-bold text-sm text-[#1F140D]">9313321535</p>
                <p className="font-bold text-sm text-[#1F140D]">701119609</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">Speak directly with our team for any assistance.</p>
                <a href="tel:9313321535" className="mt-3 inline-flex items-center gap-1.5 bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                  Call Now →
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-0.5">WHATSAPP</p>
                <p className="font-bold text-sm text-[#1F140D]">Chat with Bansal Foods</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">Get quick replies on products, orders and wholesale inquiries.</p>
                <a
                  href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods,%20I%20have%20a%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  WhatsApp Us →
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-0.5">EMAIL</p>
                <p className="font-bold text-sm text-[#1F140D]">Send us an email</p>
                <p className="text-xs text-[#8C1C1C] font-medium mt-0.5">info@bansalfoods.in</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">We usually respond within 24 hours.</p>
                <a
                  href="mailto:info@bansalfoods.in"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#8C5D17] hover:bg-[#7A4E10] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  Email Us →
                </a>
              </div>
            </div>

            {/* Visit Us */}
            <div className="p-6 flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-0.5">VISIT US</p>
                <p className="font-bold text-sm text-[#1F140D]">Fatehpuri, Delhi – 110006</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">Come to our store for the best variety and prices.</p>
                <a
                  href="https://maps.google.com/?q=Fatehpuri+Chandni+Chowk+Delhi+110006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 bg-[#1F140D] hover:bg-[#2C1E10] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 3. FORM + WHOLESALE SIDEBAR ════ */}
      <section className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: Contact Form (7 cols) ── */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EFE5D4] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F140D] mb-1">Send Us a Message</h2>
            <p className="text-xs text-gray-500 mb-6">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1F140D] mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm">
                  Thank you, <strong>{form.name}</strong>! We have received your message and will respond to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', email: '', subject: '', orderId: '', message: '' }); }}
                  className="bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate id="contact-form" className="space-y-4">
                {/* Row 1: Name + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cf-name" type="text" name="name" value={form.name} onChange={onChange}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-mobile" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cf-mobile" type="tel" name="mobile" value={form.mobile} onChange={onChange}
                      placeholder="Enter your mobile number"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] ${errors.mobile ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                {/* Row 2: Email + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-email" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cf-email" type="email" name="email" value={form.email} onChange={onChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-subject" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cf-subject" name="subject" value={form.subject} onChange={onChange}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-gray-800 outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] cursor-pointer ${errors.subject ? 'border-red-400' : 'border-gray-300'}`}
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                </div>

                {/* Row 3: Order ID */}
                <div>
                  <label htmlFor="cf-orderid" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                    Order ID <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="cf-orderid" type="text" name="orderId" value={form.orderId} onChange={onChange}
                    placeholder="Enter your order ID (if any)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C]"
                  />
                </div>

                {/* Row 4: Message */}
                <div>
                  <label htmlFor="cf-message" className="block text-xs font-bold text-[#1F140D] mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="cf-message" name="message" value={form.message} onChange={onChange} rows={5}
                    placeholder="Type your message here..."
                    className={`w-full px-3.5 py-3 text-sm rounded-lg border bg-white text-gray-800 placeholder:text-gray-400 outline-none resize-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                    <span className="text-xs text-gray-400">0/300</span>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#8C1C1C] hover:bg-[#741515] disabled:bg-gray-400 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Message →
                      </>
                    )}
                  </button>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    We&apos;ll use your information only to respond to your inquiry.
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* ── RIGHT: Wholesale + Hours (5 cols) ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Wholesale Card */}
            <div className="bg-white rounded-2xl border border-[#EFE5D4] overflow-hidden">
              {/* Header with background */}
              <div className="relative h-36 bg-[#1B0F08]">
                <Image src="/b2b-retailers.jpg" alt="Wholesale" fill className="object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B0F08]/80" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E5A93C] mb-1">✦ WHOLESALE INQUIRY</span>
                  <h3 className="text-lg font-bold text-white leading-tight">Looking for Wholesale or Bulk Orders?</h3>
                  <p className="text-xs text-gray-300/80 mt-0.5">Speak with our team about bulk dry-fruit pricing for your business.</p>
                </div>
              </div>

              <div className="p-5">
                {/* Buyer type icons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
                  {BUYER_TYPES.map((bt) => (
                    <div key={bt.label} className="flex flex-col items-center text-center gap-1">
                      <div className="w-9 h-9 rounded-full bg-[#FAF0E8] text-[#7A4116] flex items-center justify-center">
                        {bt.icon}
                      </div>
                      <p className="text-[9px] font-semibold text-[#1F140D] leading-tight">{bt.label}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods,%20I%20would%20like%20a%20wholesale%20quote."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors mb-4"
                >
                  Request Wholesale Quote →
                </a>

                {/* Checklist */}
                <ul className="space-y-1.5">
                  {['Wide variety of premium dry fruits', 'Competitive wholesale pricing', 'Suitable for businesses and institutions', 'Consistent quality and supply'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="w-4 h-4 text-[#8C1C1C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Store Hours Card */}
            <div className="bg-white rounded-2xl border border-[#EFE5D4] p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#C88C3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="font-bold text-sm text-[#1F140D]">Store &amp; Support Hours</h3>
              </div>
              <p className="text-xs text-gray-400 mb-3">(Timings can be changed as per business requirements)</p>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Saturday', hours: '9:00 AM – 6:00 PM' },
                  { day: 'Sunday', hours: '10:00 AM – 6:00 PM' },
                ].map((row) => (
                  <div key={row.day} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE5D4]">
                    <svg className="w-4 h-4 text-[#C88C3C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-xs text-gray-600 flex-1">{row.day}</span>
                    <span className="text-xs font-bold text-[#1F140D]">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 4. VISIT BANSAL FOODS ════ */}
      <section className="py-10 sm:py-12 bg-white border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* Left: Address info */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#EFE5D4] p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#8C1C1C] mb-1">Visit Bansal Foods</h2>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                  We are located in the heart of Fatehpuri, Delhi, serving customers for generations with premium dry fruits and nuts.
                </p>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAF0E8] text-[#8C1C1C] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1F140D]">Bansal Foods</p>
                    <p className="text-xs text-gray-600 mt-0.5">Fatehpuri</p>
                    <p className="text-xs text-gray-600">Delhi – 110006</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="https://maps.google.com/?q=Fatehpuri+Chandni+Chowk+Delhi+110006"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                >
                  Get Directions →
                </a>
                <a
                  href="tel:9313321535"
                  className="inline-flex items-center gap-1.5 bg-white border border-[#EFE5D4] hover:bg-[#FAF0E8] text-[#1F140D] font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                >
                  Call Store →
                </a>
              </div>
            </div>

            {/* Middle: Map */}
            <div className="rounded-2xl overflow-hidden border border-[#EFE5D4] min-h-[280px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.2867699065!2d77.2180!3d28.6548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0x39b0d961f47e6f97!2sFatehpuri%2C%20Chandni%20Chowk%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1697000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 280 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bansal Foods – Fatehpuri, Chandni Chowk, Delhi"
              />
            </div>

            {/* Right: Store photo */}
            <div className="rounded-2xl overflow-hidden border border-[#EFE5D4] min-h-[280px] relative bg-[#1B0F08]">
              <Image
                src="/b2b-retailers.jpg"
                alt="Bansal Foods Store at Fatehpuri Delhi"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B0F08]/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-[#FAF5EC]/90 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                  <p className="font-serif font-black text-xs text-[#1F140D] leading-tight">BANSAL FOODS</p>
                  <p className="text-[8px] font-bold text-[#8C5D17] tracking-widest uppercase">DRY FRUITS • WHOLESALE • RETAIL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 5. FAQ ════ */}
      <section className="py-10 sm:py-12 bg-[#FAF7F2] border-b border-[#EFE5D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-[#8C1C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F140D]">Frequently Asked Questions</h2>
          </div>
          <p className="text-xs text-gray-500 mb-6">Quick answers to common queries.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#EFE5D4] rounded-xl overflow-hidden hover:border-[#C88C3C]/40 transition-colors">
                <button
                  id={`contact-faq-${idx}`}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-semibold text-sm text-[#1F140D] pr-3 leading-snug">{faq.q}</span>
                  <span className={`text-[#8C1C1C] shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-[#EFE5D4] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ 6. LET'S TALK DRY FRUITS CTA ════ */}
      <section className="relative overflow-hidden bg-[#1B0F08] py-12 sm:py-14">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-dry-fruits.jpg" alt="Let's Talk Dry Fruits" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-[#1B0F08]/75" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Let&apos;s Talk Dry Fruits</h2>
          <p className="text-sm text-gray-300/80 mb-7">We&apos;re always happy to help with your orders, inquiries or business requirements.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#8C1C1C] hover:bg-[#741515] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Shop Now →
            </Link>
            <a
              href="tel:9313321535"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support →
            </a>
            <a
              href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods,%20I%20would%20like%20a%20wholesale%20quote."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C88C3C] hover:bg-[#B57C30] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Wholesale Inquiry →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
