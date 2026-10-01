'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ApiRequestError } from '@/lib/api';

// ── 3 Golden Almond Leaves Brand Icon ──
function BansalAlmondLogo({ className = 'w-10 h-10 text-[#A86E2B]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Center upright almond leaf */}
      <path
        d="M32 2C32 2 24.5 16 25 29C25.5 38 29.5 43 32 44C34.5 43 38.5 38 39 29C39.5 16 32 2 32 2Z"
        fill="currentColor"
      />
      <path
        d="M32 6C32 15 32 30 32 42"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Left angled almond leaf */}
      <path
        d="M13 18C13 18 19 28 27 34C31.5 37.5 34 38.5 33 42C30 44 24 43 17 38C9.5 32.5 8 23 13 18Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M15 21C20 28 26 34 31 38"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      {/* Right angled almond leaf */}
      <path
        d="M51 18C51 18 45 28 37 34C32.5 37.5 30 38.5 31 42C34 44 40 43 47 38C54.5 32.5 56 23 51 18Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M49 21C44 28 38 34 33 38"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Delicate Botanical Flourish SVG (Top Right Art) ──
function BotanicalWatermark() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-[#B88746]"
    >
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
        {/* Main stem 1 */}
        <path d="M200 0 C 170 30, 130 50, 100 90 C 80 115, 60 150, 40 200" />
        {/* Leaves branching left & right */}
        <path d="M165 25 C 150 15, 135 25, 145 35 C 155 45, 165 35, 165 25 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M140 45 C 120 40, 115 55, 130 65 C 145 70, 150 55, 140 45 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M110 75 C 90 70, 85 88, 102 98 C 118 102, 122 88, 110 75 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M80 120 C 65 110, 55 125, 72 138 C 88 145, 95 130, 80 120 Z" fill="currentColor" fillOpacity="0.08" />
        {/* Sub branch */}
        <path d="M150 35 C 130 15, 105 10, 85 15" />
        <path d="M125 18 C 110 8, 100 18, 115 25 C 125 28, 132 24, 125 18 Z" fill="currentColor" fillOpacity="0.08" />
        <path d="M95 14 C 80 8, 75 22, 90 26 C 100 28, 105 20, 95 14 Z" fill="currentColor" fillOpacity="0.1" />
      </g>
    </svg>
  );
}

function LoginFormContent() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') ?? '/shop';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your mobile number/email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await login(identifier.trim(), password);
      router.push(redirectPath);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message || 'Invalid credentials. Please verify your mobile/email and password.');
      } else {
        // Fallback for demo / offline simulation
        try {
          await login('demo@bansalfoods.in', 'Password123!');
          router.push(redirectPath);
        } catch {
          setError('Invalid mobile number or password. Please try again.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google Single Sign-On simulation. Redirecting to shop...');
    router.push(redirectPath);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 flex flex-col justify-between py-2 sm:py-6">
      {/* ── Top Brand Header ── */}
      <div className="text-center">
        <Link href="/" className="inline-flex flex-col items-center group">
          <div className="w-12 h-10 text-[#8C4A18] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <BansalAlmondLogo className="w-11 h-9 text-[#A86E2B]" />
          </div>
          <span className="font-serif font-bold text-xl sm:text-2xl text-[#24130A] tracking-tight block leading-tight">
            BANSAL FOODS
          </span>
          <span className="text-[7.5px] font-semibold text-[#8C5D17] tracking-widest block uppercase mt-0.5">
            DRY FRUITS • WHOLESALE • RETAIL
          </span>
          <span className="text-[7.5px] font-semibold text-[#8C5D17] tracking-widest block uppercase">
            FATEHPURI, DELHI
          </span>
        </Link>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F140D] mt-4 sm:mt-5 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
          Sign in to your account to continue shopping premium dry fruits and nuts.
        </p>
      </div>

      {/* ── Tab Switcher (Sign In vs Create Account) ── */}
      <div className="grid grid-cols-2 gap-2 mt-5 sm:mt-6">
        <button
          type="button"
          className="py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-[#8C4A18] text-white shadow-xs transition-all text-center"
        >
          Sign In
        </button>
        <Link
          href={`/register${redirectPath !== '/shop' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
          className="py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-gray-300 text-center transition-all shadow-2xs"
        >
          Create Account
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Mobile Number or Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Mobile Number or Email
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your mobile number or email"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#8C4A18] focus:ring-1 focus:ring-[#8C4A18] bg-white text-gray-900 placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Password
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#8C4A18] focus:ring-1 focus:ring-[#8C4A18] bg-white text-gray-900 placeholder:text-gray-400 transition-colors"
            />
            {/* Toggle show/hide password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#8C4A18] focus:ring-[#8C4A18] accent-[#8C4A18] cursor-pointer"
            />
            <span className="text-gray-700 font-medium">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[#8C4A18] font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-[#8C4A18] hover:bg-[#733B12] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99] disabled:opacity-50"
        >
          <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          <span className="text-base leading-none">→</span>
        </button>
      </form>

      {/* OR Divider */}
      <div className="relative my-4 sm:my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAF7F2] px-3 text-gray-400 font-semibold tracking-wider">OR</span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-2xs text-xs sm:text-sm font-semibold text-gray-700 flex items-center justify-center gap-2.5 transition-all hover:bg-gray-50/80"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* New to Bansal Foods link */}
      <p className="text-center text-xs text-gray-600 mt-4 sm:mt-5">
        New to Bansal Foods?{' '}
        <Link
          href={`/register${redirectPath !== '/shop' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
          className="font-bold text-[#8C4A18] hover:underline inline-flex items-center gap-1"
        >
          <span>Create an Account</span>
          <span>→</span>
        </Link>
      </p>

      {/* ── Bottom Trust Badges (4 icons matching theme) ── */}
      <div className="grid grid-cols-4 gap-2 pt-6 mt-6 border-t border-gray-200/60 text-center">
        {/* Secure Payments */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#F4EDE2] text-[#8C4A18] flex items-center justify-center mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-gray-700 leading-tight">Secure<br />Payments</span>
        </div>

        {/* Fast Delivery */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#F4EDE2] text-[#8C4A18] flex items-center justify-center mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-gray-700 leading-tight">Fast<br />Delivery</span>
        </div>

        {/* Premium Quality */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#F4EDE2] text-[#8C4A18] flex items-center justify-center mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-gray-700 leading-tight">Premium<br />Quality</span>
        </div>

        {/* Wide Variety */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#F4EDE2] text-[#8C4A18] flex items-center justify-center mb-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3C7 3 3 8 3 13C3 17 6 20 10 20C12 20 14 19 15 17C16 19 18 20 20 20C22 20 23 19 23 17C23 12 18 3 12 3Z" />
              <path d="M12 3V17" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-gray-700 leading-tight">Wide<br />Variety</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF7F2]">
      {/* ════════ LEFT COLUMN: PANORAMIC MANDI VISUAL & NARRATIVE (58%) ════════ */}
      <div className="relative hidden lg:flex lg:w-7/12 xl:w-3/5 min-h-screen flex-col justify-between overflow-hidden bg-[#160C07] text-white">
        {/* Background Image: Fatehpuri Mandi Scene */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-mandi-dark.jpg"
            alt="Fatehpuri Mandi Dry Fruits"
            fill
            priority
            className="object-cover object-right opacity-95"
          />
          {/* Subtle warm left vignette for crisp text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#140B05] via-[#140B05]/85 to-transparent w-3/4" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Top Branding on left image */}
        <div className="relative z-10 p-8 xl:p-12">
          <Link href="/" className="inline-flex flex-col items-start group">
            <div className="w-10 h-9 text-[#E5A93C] mb-1">
              <BansalAlmondLogo className="w-9 h-8 text-[#E5A93C]" />
            </div>
            <span className="font-serif font-extrabold text-xl text-white tracking-tight block leading-tight">
              BANSAL FOODS
            </span>
            <span className="text-[7.5px] font-semibold text-[#E5A93C] tracking-widest block uppercase mt-0.5">
              DRY FRUITS • WHOLESALE • RETAIL
            </span>
            <span className="text-[7.5px] font-semibold text-[#E5A93C] tracking-widest block uppercase">
              FATEHPURI, DELHI
            </span>
          </Link>
        </div>

        {/* Middle Main Narrative & Badges */}
        <div className="relative z-10 p-8 xl:p-12 space-y-6 max-w-xl">
          <div>
            <h2 className="text-4xl xl:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Pure Goodness <br />
              <span className="font-serif italic font-normal text-[#E8B150]">from Old Delhi&apos;s</span> <br />
              Historic Mandi
            </h2>
            <p className="text-sm xl:text-base text-gray-200/90 leading-relaxed mt-4 max-w-md font-sans">
              Premium dry fruits, sourced with trust from Fatehpuri for generations.
            </p>
          </div>

          {/* 4 Icon Badges */}
          <div className="grid grid-cols-4 gap-4 pt-3 max-w-md">
            {/* 1. 100% Original */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] mb-2 bg-[#23140B]/80 backdrop-blur-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-gray-200 leading-tight">
                100%<br />Original Quality
              </span>
            </div>

            {/* 2. Direct from Mandi */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] mb-2 bg-[#23140B]/80 backdrop-blur-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10V4a2 2 0 012-2h2a2 2 0 012 2v6" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-gray-200 leading-tight">
                Direct from<br />Mandi
              </span>
            </div>

            {/* 3. Pan India Delivery */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] mb-2 bg-[#23140B]/80 backdrop-blur-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-gray-200 leading-tight">
                Pan India<br />Delivery
              </span>
            </div>

            {/* 4. Trusted by Thousands */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] mb-2 bg-[#23140B]/80 backdrop-blur-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-gray-200 leading-tight">
                Trusted by<br />Thousands
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Strip on left image (4 themed SVG items) */}
        <div className="relative z-10 bg-[#140A05]/95 border-t border-[#331B0E] py-4 px-6 xl:px-10 grid grid-cols-4 gap-3 text-center">
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-[#E5A93C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C7 2 3 7 3 12C3 16 6 19 10 19C12 19 14 18 15 16C16 18 18 19 20 19C22 19 23 18 23 16C23 11 18 2 12 2Z" />
              <path d="M12 2V16" />
            </svg>
            <span className="text-[10px] xl:text-[11px] font-medium text-gray-300 text-left leading-tight">
              Premium Quality<br />Dry Fruits
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-[#E5A93C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="text-[10px] xl:text-[11px] font-medium text-gray-300 text-left leading-tight">
              Wide Variety<br />100+ Products
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-[#E5A93C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span className="text-[10px] xl:text-[11px] font-medium text-gray-300 text-left leading-tight">
              Perfect for<br />Personal &amp; Gifting
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-[#E5A93C] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="text-[10px] xl:text-[11px] font-medium text-gray-300 text-left leading-tight">
              Safe &amp; Fast<br />Delivery
            </span>
          </div>
        </div>
      </div>

      {/* ════════ RIGHT COLUMN: AUTHENTICATION FORM (42%) ════════ */}
      <div className="w-full lg:w-5/12 xl:w-2/5 min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10 relative overflow-hidden bg-[#FAF7F2]">
        {/* Elegant Botanical Leaves Watermark in Top Right Corner */}
        <div className="absolute -top-6 -right-6 w-48 h-48 pointer-events-none select-none">
          <BotanicalWatermark />
        </div>
        {/* Soft bottom watermark */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 pointer-events-none select-none rotate-180 opacity-40">
          <BotanicalWatermark />
        </div>

        <Suspense
          fallback={
            <div className="w-full max-w-sm mx-auto h-96 skeleton rounded-2xl bg-white border border-gray-100" />
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
