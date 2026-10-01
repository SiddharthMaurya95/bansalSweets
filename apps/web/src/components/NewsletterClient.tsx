'use client';

import React, { useState } from 'react';

export function NewsletterClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('done');
  };

  return (
    <section className="py-8 sm:py-10 bg-white border-t border-gray-100" aria-label="Newsletter signup">
      <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F3E7D3] text-[#C88C3C] flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B1F2A] mb-1">Stay Updated</h2>
        <p className="text-xs text-gray-500 mb-5">Get the best offers, new arrivals and health tips.</p>

        {status === 'done' ? (
          <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl py-3 px-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <span className="text-sm font-semibold">You&apos;re subscribed! Thank you 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} noValidate className="flex flex-col sm:flex-row gap-2">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              placeholder="Enter your email address"
              className={`flex-1 px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-[#C88C3C]/30 focus:border-[#C88C3C] ${status === 'error' ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            />
            <button
              id="newsletter-subscribe-btn"
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#8C1C1C] hover:bg-[#741515] disabled:bg-gray-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === 'loading' ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <>Subscribe →</>}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-1.5">Please enter a valid email address.</p>
        )}
      </div>
    </section>
  );
}
