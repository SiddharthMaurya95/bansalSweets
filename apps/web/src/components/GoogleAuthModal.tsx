'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MockGoogleAccount {
  name: string;
  email: string;
  picture?: string;
}

const DEFAULT_ACCOUNTS: MockGoogleAccount[] = [
  {
    name: 'Siddharth Maurya',
    email: 'siddharthmaurya95@gmail.com',
  },
  {
    name: 'Bansal Dry Fruits Buyer',
    email: 'buyer.bansalfoods@gmail.com',
  },
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAccount = async (account: MockGoogleAccount) => {
    setSelectedEmail(account.email);
    setLoading(true);

    try {
      await loginWithGoogle({
        name: account.name,
        email: account.email,
        googleId: 'g_' + Math.abs(account.email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    } finally {
      setLoading(false);
      setSelectedEmail(null);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setCustomError('Please enter your full name');
      return;
    }
    if (!customEmail.trim() || !/\S+@\S+\.\S+/.test(customEmail)) {
      setCustomError('Please enter a valid Google email address');
      return;
    }
    setCustomError('');
    handleSelectAccount({
      name: customName.trim(),
      email: customEmail.trim().toLowerCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 animate-scaleUp">
        
        {/* Top Header */}
        <div className="pt-7 pb-4 px-6 text-center border-b border-gray-100 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Authentic Google "G" Logo */}
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-9 h-9" viewBox="0 0 24 24">
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

          <h2 className="text-xl font-medium text-gray-800 tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            to continue to <strong className="text-gray-700 font-semibold">Bansal Foods</strong>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              {/* Google Spinner */}
              <div className="w-10 h-10 border-3 border-gray-200 border-t-[#4285F4] border-r-[#34A853] border-b-[#FBBC05] border-l-[#EA4335] rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-600">
                Signing you in as <strong className="text-gray-900">{selectedEmail}</strong>…
              </p>
            </div>
          ) : showCustomInput ? (
            /* Custom Account Form */
            <form onSubmit={handleCustomSubmit} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Siddharth Maurya"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Google Email
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                />
              </div>

              {customError && (
                <p className="text-xs text-red-600 font-medium">{customError}</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                >
                  ← Back to account list
                </button>
                <button
                  type="submit"
                  className="bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            /* Account Chooser List */
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-2">Choose an account:</p>

              {DEFAULT_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className="w-full p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center gap-3.5 text-left transition-all group cursor-pointer"
                >
                  {/* Avatar circle */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {acc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {acc.email}
                    </p>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-600 text-sm">›</span>
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full p-3 rounded-xl border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center gap-3.5 text-left transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Use another Google Account
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer info & privacy */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 leading-tight">
            To continue, Google will share your name, email address, and profile picture with Bansal Foods. See our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
          </p>
        </div>

      </div>
    </div>
  );
};
