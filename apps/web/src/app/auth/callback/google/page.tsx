'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


function BansalAlmondLogo({ className = 'w-10 h-10 text-[#A86E2B]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 2C32 2 24.5 16 25 29C25.5 38 29.5 43 32 44C34.5 43 38.5 38 39 29C39.5 16 32 2 32 2Z"
        fill="currentColor"
      />
      <path
        d="M13 18C13 18 19 28 27 34C31.5 37.5 34 38.5 33 42C30 44 24 43 17 38C9.5 32.5 8 23 13 18Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M51 18C51 18 45 28 37 34C32.5 37.5 30 38.5 31 42C34 44 40 43 47 38C54.5 32.5 56 23 51 18Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleGoogleCallback() {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');
      const stateParam = searchParams.get('state');

      // 1. Check for error returned by Google
      if (error) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(
          errorDesc ||
            (error === 'access_denied'
              ? 'Access was cancelled or denied on Google.'
              : `Google OAuth error: ${error}`)
        );
        return;
      }

      // 2. Parse target redirect path
      let redirectPath = '/shop';
      if (stateParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(stateParam));
          if (parsed && typeof parsed.redirect === 'string' && parsed.redirect.startsWith('/')) {
            redirectPath = parsed.redirect;
          }
        } catch {
          // Ignore state parse errors
        }
      }

      // 3. Process authorization code
      if (!code) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage('No authorization code was received from Google.');
        return;
      }

      try {
        // 1. Exchange authorization code with Google via secure server route
        const exchangeRes = await fetch('/api/auth/google/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: window.location.origin + '/auth/callback/google',
          }),
        });

        const exchangeData = await exchangeRes.json();

        if (!exchangeRes.ok || !exchangeData.user) {
          throw new Error(
            exchangeData.error || 'Failed to complete Google authentication exchange.'
          );
        }

        // 2. Complete login in AuthContext with real Google Name, Email, and Avatar
        await loginWithGoogle({
          name: exchangeData.user.name,
          email: exchangeData.user.email,
          avatarUrl: exchangeData.user.avatar,
          googleId: exchangeData.user.googleId,
        });

        if (!isMounted) return;
        setStatus('success');

        // Clean redirection
        setTimeout(() => {
          router.replace(redirectPath);
        }, 800);
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to complete Google authentication. Please try again.'
        );
      }
    }

    handleGoogleCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, loginWithGoogle]);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-amber-100/80 text-center relative z-10">
      {/* Brand Logos */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center p-1.5 border border-amber-200/60 shadow-2xs">
          <BansalAlmondLogo className="w-7 h-7 text-[#A86E2B]" />
        </div>
        <span className="text-gray-300 font-light text-xl">×</span>
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-200 shadow-2xs p-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
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
        </div>
      </div>

      {/* Verifying Status */}
      {status === 'verifying' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-3 border-amber-600/20 border-t-amber-700 rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Verifying Google Account
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Completing official third-party authorization with Google. Please wait a moment...
          </p>
        </div>
      )}

      {/* Success Status */}
      {status === 'success' && (
        <div className="space-y-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
            ✓
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Signed in Successfully!
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Redirecting you to Bansal Foods store...
          </p>
        </div>
      )}

      {/* Error Status */}
      {status === 'error' && (
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-xs">
            ⚠️
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200/80 leading-relaxed">
            {errorMessage || 'Failed to authenticate with Google.'}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-2.5 px-4 bg-[#8C4A18] hover:bg-[#733B12] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              Return to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF7F2] p-4 relative overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Loading Google authentication...</p>
          </div>
        }
      >
        <GoogleCallbackContent />
      </Suspense>
    </div>
  );
}
