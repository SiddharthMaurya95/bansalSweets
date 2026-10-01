'use client';

import React, { useState } from 'react';
import { getGoogleOAuthUrl, setLocalGoogleClientId } from '@/lib/googleAuth';

interface GoogleRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function GoogleRedirectModal({
  isOpen,
  onClose,
  redirectPath = '/shop',
}: GoogleRedirectModalProps) {
  const [clientIdInput, setClientIdInput] = useState('');
  const [remember, setRemember] = useState(true);

  if (!isOpen) return null;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = clientIdInput.trim();
    if (idToUse && remember) {
      setLocalGoogleClientId(idToUse);
    }
    const targetUrl = getGoogleOAuthUrl(redirectPath, idToUse || undefined);
    window.location.href = targetUrl;
  };

  const handleTestCallback = () => {
    const origin = window.location.origin;
    const targetUrl = `${origin}/auth/callback/google?code=google_auth_demo_code_${Date.now()}&state=${encodeURIComponent(
      JSON.stringify({ redirect: redirectPath })
    )}`;
    window.location.href = targetUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Google Branding Header */}
        <div className="flex items-center gap-3 mb-4">
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
          <div>
            <h3 className="font-semibold text-base text-gray-900 leading-tight">
              Google Official Redirect Setup
            </h3>
            <p className="text-xs text-gray-500">Official OAuth 2.0 endpoint</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          The app will redirect directly to Google&apos;s authorization server at{' '}
          <code className="bg-gray-100 text-[#8C4A18] px-1 py-0.5 rounded text-[11px]">
            accounts.google.com/o/oauth2/v2/auth
          </code>
          .
        </p>

        <form onSubmit={handleProceed} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Google Client ID{' '}
              <span className="text-gray-400 font-normal">
                (or set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env)
              </span>
            </label>
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#8C4A18] focus:ring-1 focus:ring-[#8C4A18] placeholder:text-gray-400"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-[#8C4A18] focus:ring-[#8C4A18] accent-[#8C4A18]"
            />
            <span>Remember Client ID in this browser</span>
          </label>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#8C4A18] hover:bg-[#733B12] text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Redirect to accounts.google.com</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={handleTestCallback}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
            >
              Test OAuth Callback Flow (Simulation)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
