'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrPhone.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <Image
              src="/logo.png"
              alt="Bansal Foods Khari Baoli Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shadow-xs"
            />
            <span className="font-serif font-black text-xl text-[#1F140D]">BANSAL FOODS</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#1F140D]">Reset Your Password</h1>
          <p className="text-xs text-gray-500">
            Enter your registered email address or phone number to receive password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
              ✓
            </div>
            <p className="text-xs font-semibold text-emerald-800">
              Recovery instructions sent to <strong>{emailOrPhone}</strong>!
            </p>
            <p className="text-[11px] text-emerald-700">
              Please check your SMS or email inbox. If you need urgent assistance, contact us on
              WhatsApp.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block px-5 py-2 bg-[#8C5D17] text-white rounded-xl text-xs font-bold hover:bg-[#73430C]"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reset-contact"
                className="block text-xs font-bold text-[#1F140D] mb-1"
              >
                Email Address or Mobile Number
              </label>
              <input
                id="reset-contact"
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. name@example.com or 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8C5D17]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#8C5D17] hover:bg-[#73430C] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="border-t border-gray-100 pt-4 text-center space-y-2">
          <p className="text-xs text-gray-500">
            Remembered your password?{' '}
            <Link href="/login" className="font-bold text-[#8C5D17] hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Need direct help?{' '}
            <a
              href="https://wa.me/919313321535?text=Hello%20Bansal%20Foods%2C%20I%20need%20help%20logging%20in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 hover:underline"
            >
              WhatsApp Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
