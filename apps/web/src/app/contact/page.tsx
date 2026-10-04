'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ContactFormData {
  fullName: string;
  mobile: string;
  email: string;
  subject: string;
  orderId: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    mobile: '',
    email: '',
    subject: '',
    orderId: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 500) return; // 500 char limit

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      errors.subject = 'Please select a subject';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please type a message of at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // 8 FAQs split into 2 columns of 4
  const faqsCol1 = [
    {
      q: 'Where is Bansal Foods located?',
      a: 'We are located at Khari Baoli, Chandni Chowk, Delhi – 110006, right in the heart of Asia’s largest dry fruit and spice market.',
    },
    {
      q: 'How can I contact the store?',
      a: 'You can call us directly at 9313321535 or 701119609, email shashwatbansal2610@gmail.com, or WhatsApp us at +91-9313321535 during store operating hours.',
    },
    {
      q: 'Do you accept wholesale orders?',
      a: 'Yes! We specialize in wholesale dry fruits (25 kg, 50 kg, 100 kg+ bulk bags) for retailers, caterers, hotels, sweet makers, and corporate clients with direct mandi rates.',
    },
    {
      q: 'Can I order through WhatsApp?',
      a: 'Absolutely! Send us your list of items and quantities on WhatsApp (+91-9313321535). Our team will confirm stock availability, wholesale rates, and delivery details.',
    },
  ];

  const faqsCol2 = [
    {
      q: 'Do you offer delivery?',
      a: 'Yes, we provide pan-India delivery across 19,000+ PIN codes. All retail orders above ₹999 qualify for Free Standard Delivery.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is dispatched, a tracking ID and link are sent via SMS and WhatsApp. You can also visit our Track Order page and enter your Order ID.',
    },
    {
      q: 'What are your store timings?',
      a: 'Our physical Khari Baoli store is open Monday through Saturday from 9:30 AM to 7:30 PM, and Sunday from 9:30 AM to 4:00 PM.',
    },
    {
      q: 'How can I get a wholesale quote?',
      a: 'Click "Request Wholesale Quote" on this page or WhatsApp your required quantities. Our wholesale desk responds within 2 hours with competitive rates.',
    },
  ];

  // Buyer categories for wholesale card
  const buyerTypes = [
    {
      label: 'Retailers',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: 'Restaurants',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8h1a4 4 0 010 8h-1"/>
          <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
          <line x1="6" y1="2" x2="6" y2="4"/>
          <line x1="10" y1="2" x2="10" y2="4"/>
          <line x1="14" y1="2" x2="14" y2="4"/>
        </svg>
      ),
    },
    {
      label: 'Hotels',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
    },
    {
      label: 'Caterers',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      label: 'Sweet Shops',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      label: 'Corporate Gifting',
      icon: (
        <svg className="w-5 h-5 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2114] font-sans pb-16">
      
      {/* ══════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="relative w-full border-b border-[#2C1910] bg-[#1B0F08] overflow-hidden">
        {/* Background Image: Old Delhi Mandi atmosphere */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-market-scene.jpg"
            alt="Bansal Foods Old Delhi Khari Baoli Market"
            fill
            priority
            className="object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B0F08]/95 via-[#1B0F08]/80 to-[#1B0F08]/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="text-xs text-amber-200/80 flex items-center gap-1.5 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/40">&gt;</span>
            <span className="text-white font-semibold">Contact Us</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading and intro */}
            <div className="lg:col-span-7 space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-white tracking-tight leading-[1.15]">
                Get in Touch with<br />
                <span className="italic font-serif font-normal text-[#E5A93C]">Bansal Foods</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-200/90 leading-relaxed max-w-xl font-normal pt-1">
                Have a question about our products, your order or a wholesale requirement? We&apos;re here to help.
              </p>
            </div>

            {/* Right Column: Parcel box illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] h-[210px] sm:h-[240px] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/20">
                <Image
                  src="/shipping-parcel-box.jpg"
                  alt="Bansal Foods Packaging and Delivery"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. FOUR CONTACT METHOD CARDS IN A ROW
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: CALL US */}
          <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 overflow-hidden">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 12 19.79 19.79 0 011.04 3.4a2 2 0 012-1.72h3a2 2 0 012 1.72c.153.925.36 1.835.62 2.726a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.891.26 1.8.467 2.726.62A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8C1C1C] uppercase tracking-wider block">CALL US</span>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">9313321535</p>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">701119609</p>
                </div>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-tight">
                Speak directly with our team for any assistance.
              </p>
              <div>
                <a
                  href="tel:9313321535"
                  className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Call Now</span>
                  <span>→</span>
                </a>
              </div>
            </div>
            {/* Almonds image thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EFE7DC]">
              <Image src="/product-almonds.jpg" alt="Call Bansal Foods" fill className="object-cover" />
            </div>
          </div>

          {/* Card 2: WHATSAPP */}
          <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 overflow-hidden">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.749 0-3.393-.454-4.832-1.248l-5.168 1.352 1.378-5.035c-.886-1.488-1.378-3.218-1.378-5.069 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">WHATSAPP</span>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">Chat with Bansal Foods</p>
                </div>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-tight">
                Get quick replies on products, orders and wholesale inquiries.
              </p>
              <div>
                <a
                  href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>WhatsApp Us</span>
                  <span>→</span>
                </a>
              </div>
            </div>
            {/* Pistachios image thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EFE7DC]">
              <Image src="/product-pistachios.jpg" alt="WhatsApp Bansal Foods" fill className="object-cover" />
            </div>
          </div>

          {/* Card 3: EMAIL */}
          <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 overflow-hidden">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8C5D17] uppercase tracking-wider block">EMAIL</span>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">Send us an email</p>
                  <p className="text-[11px] font-semibold text-[#6E1A1A] leading-tight">shashwatbansal2610@gmail.com</p>
                </div>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-tight">
                We usually respond within 24 hours.
              </p>
              <div>
                <a
                  href="mailto:shashwatbansal2610@gmail.com"
                  className="bg-[#8C5D24] hover:bg-[#734a17] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Email Us</span>
                  <span>→</span>
                </a>
              </div>
            </div>
            {/* Dates image thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EFE7DC]">
              <Image src="/product-dates.jpg" alt="Email Bansal Foods" fill className="object-cover" />
            </div>
          </div>

          {/* Card 4: VISIT US */}
          <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 overflow-hidden">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6E1A1A] uppercase tracking-wider block">VISIT US</span>
                  <p className="text-xs font-bold text-[#1F140D] leading-tight">Khari Baoli, Delhi – 110006</p>
                </div>
              </div>
              <p className="text-[11px] text-[#6B635B] leading-tight">
                Come to our store for the best variety and prices.
              </p>
              <div>
                <a
                  href="https://maps.google.com/?q=Khari+Baoli+Chandni+Chowk+Delhi+110006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Get Directions</span>
                  <span>→</span>
                </a>
              </div>
            </div>
            {/* Storefront thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EFE7DC]">
              <Image src="/khari-baoli-storefront.jpg" alt="Visit Bansal Foods Store" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. MIDDLE SECTION: SEND US A MESSAGE + WHOLESALE CARD
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Send Us a Message (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-8 shadow-xs">
            <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#2C1A14]">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-1 mb-6">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>

            {isSubmitted ? (
              <div className="bg-[#FAF5EB] border border-[#E9DAC6] rounded-xl p-8 text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-xl text-[#2C1A14]">Thank You, {formData.fullName}!</h3>
                <p className="text-xs sm:text-sm text-[#5C554E] max-w-md mx-auto leading-relaxed">
                  Your message regarding <strong>&ldquo;{formData.subject}&rdquo;</strong> has been successfully received. Our Khari Baoli support team will contact you at <strong>{formData.email}</strong> or <strong>{formData.mobile}</strong> within 24 hours.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ fullName: '', mobile: '', email: '', subject: '', orderId: '', message: '' });
                    }}
                    className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                
                {/* Row 1: Full Name + Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                      Full Name <span className="text-[#8C1C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#2C1A14] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] transition-colors ${
                        formErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:border-[#6E1A1A]'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                      Mobile Number <span className="text-[#8C1C1C]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#2C1A14] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] transition-colors ${
                        formErrors.mobile ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:border-[#6E1A1A]'
                      }`}
                    />
                    {formErrors.mobile && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1">{formErrors.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email Address + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                      Email Address <span className="text-[#8C1C1C]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#2C1A14] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] transition-colors ${
                        formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:border-[#6E1A1A]'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                      Subject <span className="text-[#8C1C1C]">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#2C1A14] focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] transition-colors cursor-pointer ${
                        formErrors.subject ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:border-[#6E1A1A]'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status / Tracking">Order Status / Tracking</option>
                      <option value="Wholesale & Bulk Orders">Wholesale &amp; Bulk Orders</option>
                      <option value="Return or Refund Request">Return or Refund Request</option>
                      <option value="Feedback / Other">Feedback / Other</option>
                    </select>
                    {formErrors.subject && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1">{formErrors.subject}</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Order ID (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="Enter your order ID (if any)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white text-[#2C1A14] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] focus:border-[#6E1A1A] transition-colors"
                  />
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="block text-xs font-semibold text-[#2C1A14] mb-1">
                    Message <span className="text-[#8C1C1C]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border bg-white text-[#2C1A14] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6E1A1A] resize-none transition-colors ${
                      formErrors.message ? 'border-red-400 bg-red-50/20' : 'border-gray-300 focus:border-[#6E1A1A]'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 px-1">
                    {formErrors.message ? (
                      <span className="text-red-600">{formErrors.message}</span>
                    ) : (
                      <span />
                    )}
                    <span>{formData.message.length}/500</span>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#6E1A1A] hover:bg-[#581313] active:bg-[#430d0d] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        <span>Send Message</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <span>We&apos;ll use your information only to respond to your inquiry.</span>
                  </div>
                </div>

              </form>
            )}
          </div>

          {/* Right Column: Wholesale + Store Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Top Card: Looking for Wholesale or Bulk Orders? */}
            <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 sm:p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2C1A14]">
                    Looking for Wholesale or Bulk Orders?
                  </h3>
                  <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
                    Speak with our team about bulk dry-fruit requirements for your business.
                  </p>
                </div>
                {/* Jute sacks thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EFE7DC]">
                  <Image src="/contact-wholesale-jute.jpg" alt="Wholesale Jute Sacks" fill className="object-cover" />
                </div>
              </div>

              {/* Client Types Row (6 categories) */}
              <div className="grid grid-cols-6 gap-1.5 py-3 border-y border-[#EFE7DC] text-center mb-4">
                {buyerTypes.map((buyer, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0E2] flex items-center justify-center mb-1">
                      {buyer.icon}
                    </div>
                    <span className="text-[9px] font-semibold text-[#4A4540] leading-tight">
                      {buyer.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Request Wholesale Quote Button */}
              <a
                href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20would%20like%20to%20request%20a%20wholesale%20quote%20for%20bulk%20dry%20fruits."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs sm:text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs mb-4"
              >
                <span>Request Wholesale Quote</span>
                <span>→</span>
              </a>

              {/* Wholesale Features List (Dark maroon container) */}
              <div className="bg-[#6E1A1A] text-white rounded-xl p-4 space-y-2.5">
                {[
                  'Wide variety of premium dry fruits',
                  'Competitive wholesale pricing',
                  'Suitable for businesses and institutions',
                  'Consistent quality and supply',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-amber-50">
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-[#6E1A1A] flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card: Store & Support Hours */}
            <div className="bg-white rounded-2xl border border-[#EFE7DC] p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-base text-[#2C1A14]">
                  Store &amp; Support Hours
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 mb-4 pl-10.5">
                (Timings can be changed as per business requirements)
              </p>

              <div className="space-y-2.5 text-xs">
                {/* Monday - Saturday */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE7DC]">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="font-semibold text-[#2C1A14]">Monday – Saturday</span>
                  </div>
                  <span className="font-bold text-[#6E1A1A]">9:30 AM – 7:30 PM</span>
                </div>

                {/* Sunday */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EFE7DC]">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A66224]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="font-semibold text-[#2C1A14]">Sunday</span>
                  </div>
                  <span className="font-bold text-[#6E1A1A]">9:30 AM – 4:00 PM</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. VISIT BANSAL FOODS (Store Info, Map, Photo)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#6E1A1A]">
            Visit Bansal Foods
          </h2>
          <p className="text-xs sm:text-sm text-[#6B635B] mt-1">
            We are located in the heart of Khari Baoli, Delhi, serving customers for generations with premium dry fruits and nuts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Store Details & Buttons (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EFE7DC] p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#8C1C1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C1A14]">Bansal Foods</h3>
                  <p className="text-xs text-[#6B635B]">Khari Baoli</p>
                  <p className="text-xs text-[#6B635B]">Delhi – 110006</p>
                </div>
              </div>
              <p className="text-xs text-[#6B635B] leading-relaxed">
                Visit our historic store in Khari Baoli to explore our extensive range of dry fruits, nuts, saffron, and festive gift boxes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-6">
              <a
                href="https://maps.google.com/?q=Khari+Baoli+Chandni+Chowk+Delhi+110006"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
              >
                <span>Get Directions</span>
                <span>→</span>
              </a>

              <a
                href="tel:9313321535"
                className="bg-transparent hover:bg-[#FAF4EB] text-[#2C1A14] border border-[#D4C3AC] font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Call Store</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card 2: Stylized Map Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EFE7DC] overflow-hidden shadow-xs relative aspect-[4/3] lg:aspect-auto">
            <a
              href="https://maps.google.com/?q=Khari+Baoli+Chandni+Chowk+Delhi+110006"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative group cursor-pointer"
            >
              <Image
                src="/contact-map.jpg"
                alt="Map of Bansal Foods Khari Baoli Delhi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#6E1A1A] border border-[#EFE7DC] shadow-xs flex items-center gap-1">
                <span>📍 View on Google Maps</span>
                <span>↗</span>
              </div>
            </a>
          </div>

          {/* Card 3: Storefront Photo (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-[#EFE7DC] overflow-hidden shadow-xs relative aspect-[4/3] lg:aspect-auto bg-[#1B0F08]">
            <Image
              src="/khari-baoli-storefront.jpg"
              alt="Bansal Foods Storefront in Khari Baoli Delhi"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. FREQUENTLY ASKED QUESTIONS (2 Columns)
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-[#EFE7DC] p-6 sm:p-8 shadow-xs">
          
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#8C5D24] text-white flex items-center justify-center shrink-0 font-bold text-sm">
              ?
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2C1A14]">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xs text-[#6B635B] mb-6 pl-11">
            Quick answers to common queries.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* FAQ Column 1 (4 questions) - 5 cols */}
            <div className="lg:col-span-5 divide-y divide-[#EFE7DC]">
              {faqsCol1.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                    >
                      <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isOpen ? 'text-[#6E1A1A]' : 'text-[#2C1A14] group-hover:text-[#6E1A1A]'
                      }`}>
                        {faq.q}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 group-hover:text-[#6E1A1A] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#6E1A1A]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="pt-2.5 pr-6 text-xs sm:text-[13px] text-[#5C554E] leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Column 2 (4 questions) - 5 cols */}
            <div className="lg:col-span-5 divide-y divide-[#EFE7DC]">
              {faqsCol2.map((faq, index) => {
                const actualIndex = index + 4;
                const isOpen = openFaqIndex === actualIndex;
                return (
                  <div key={actualIndex} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(actualIndex)}
                      className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                    >
                      <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isOpen ? 'text-[#6E1A1A]' : 'text-[#2C1A14] group-hover:text-[#6E1A1A]'
                      }`}>
                        {faq.q}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 group-hover:text-[#6E1A1A] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#6E1A1A]' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="pt-2.5 pr-6 text-xs sm:text-[13px] text-[#5C554E] leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Decorative Photo Thumbnail (2 cols) */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="relative w-full h-[220px] rounded-xl overflow-hidden shadow-xs border border-[#EFE7DC]">
                <Image
                  src="/return-help-banner.jpg"
                  alt="Dry Fruits Assortment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. BOTTOM BAR: LET'S TALK DRY FRUITS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#FAF5EB] border border-[#EADAC5] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-xs">
          
          {/* Left: Lotus / Leaf Icon + Text */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#FAF0E2] text-[#A66224] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#8C5D17]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#2C1A14]">
                Let&apos;s Talk Dry Fruits
              </h3>
              <p className="text-xs sm:text-sm text-[#6B635B]">
                We&apos;re always happy to help with your orders, inquiries or business requirements.
              </p>
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 z-10">
            <Link
              href="/shop"
              className="bg-[#6E1A1A] hover:bg-[#581313] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Shop Now →
            </Link>

            <a
              href="#cf-form"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="bg-transparent hover:bg-white text-[#331C10] border border-[#D4C3AC] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact Support →
            </a>

            <a
              href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20have%20a%20wholesale%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8C5D24] hover:bg-[#734a17] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Wholesale Inquiry →
            </a>
          </div>

          {/* Decorative subtle whole almonds right background image */}
          <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-20">
            <Image src="/product-almonds.jpg" alt="Almonds" fill className="object-cover" />
          </div>

        </div>
      </section>

    </div>
  );
}
