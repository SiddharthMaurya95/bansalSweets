'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/', label: 'Overview & Analytics', icon: '📊' },
  { href: '/orders', label: 'Orders & Fulfillment', icon: '📦' },
  { href: '/inventory', label: 'Inventory & Batches', icon: '🥜' },
  { href: '/wholesale-leads', label: 'Wholesale B2B Leads', icon: '💼' },
  { href: '/reviews', label: 'Reviews & Social Proof', icon: '⭐' },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ── Sidebar (64 cols desktop) ── */}
      <aside className="w-64 bg-[#0B2A6B] text-white flex flex-col flex-shrink-0 min-h-screen border-r border-[#0B2A6B]">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E4BA8] border border-[#F2D27A] flex items-center justify-center font-black text-xl text-[#F2D27A] shadow-md">
            B
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
              BANSAL FOODS
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2D27A] mt-1">
              Ops Hub • Fatehpuri
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-[#0B2A6B] shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mandi Sync & Footer */}
        <div className="p-4 m-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#15803D] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white">Fatehpuri Mandi Online</span>
          </div>
          <p className="text-[10px] text-white/60 leading-snug">
            Khari Baoli Lot Dispatch Desk connected. Standard GST rates (5%/12%) active.
          </p>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khari Baoli Operations Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#0B2A6B] hover:text-[#1E4BA8] flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>🛒 Storefront</span>
              <span className="text-[10px]">↗</span>
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <span className="w-7 h-7 rounded-lg bg-[#0B2A6B] text-white font-bold flex items-center justify-center text-xs">
                A
              </span>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-slate-800 leading-tight">Admin Desk</p>
                <p className="text-[10px] text-slate-400 leading-tight">Fatehpuri Main</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
