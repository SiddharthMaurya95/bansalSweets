'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from './ThemeIcons';

const CATEGORIES = [
  { label: 'Almonds', href: '/category/almonds' },
  { label: 'Cashews', href: '/category/cashews' },
  { label: 'Pistachios', href: '/category/pistachios' },
  { label: 'Walnuts', href: '/category/walnuts' },
  { label: 'Raisins', href: '/category/raisins' },
  { label: 'Dates', href: '/category/dates' },
  { label: 'Seeds', href: '/category/seeds' },
  { label: 'Dry Fruit Mix', href: '/category/dry-fruit-mix' },
  { label: 'Gift Hampers', href: '/category/gift-boxes' },
  { label: 'Bulk/Wholesale', href: '/wholesale' },
];

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Track Order', href: '/orders/track' },
  { label: 'Help & Support', href: '/contact' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Return & Refund', href: '/returns' },
  { label: 'Contact Us', href: '/contact' },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/checkout' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-[#20120A] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <svg
              className="w-9 h-9 text-[#C88C3C] flex-shrink-0"
              viewBox="0 0 40 40"
              fill="currentColor"
            >
              <path
                d="M20 2C15 6 12 12 12 18C12 24 16 28 20 30C24 28 28 24 28 18C28 12 25 6 20 2ZM10 14C6 17 4 22 5 26C6 30 10 33 14 33C14 27 12 20 10 14ZM30 14C28 20 26 27 26 33C30 33 34 30 35 26C36 22 34 17 30 14Z"
                opacity="0.95"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-white leading-none">
                BANSAL FOODS
              </span>
              <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-[#C88C3C] mt-1">
                DRY FRUITS • WHOLESALE • RETAIL
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.25em] text-white/50 font-medium">
                FATEHPURI, DELHI
              </span>
            </div>
          </Link>
          <p className="text-xs text-white/70 leading-relaxed max-w-sm">
            Your trusted source for premium dry fruits and nuts from Fatehpuri, Delhi. Authentic
            quality, best prices and unmatched variety.
          </p>

          {/* Social circular icons matching mockup colors */}
          <div className="flex items-center gap-2.5 pt-2">
            {[
              {
                icon: <FacebookIcon size={14} className="text-white" />,
                label: 'Facebook',
                bg: 'bg-[#1877F2]',
                href: '#',
              },
              {
                icon: <InstagramIcon size={14} className="text-white" />,
                label: 'Instagram',
                bg: 'bg-[#E4405F]',
                href: '#',
              },
              {
                icon: <YouTubeIcon size={14} className="text-white" />,
                label: 'YouTube',
                bg: 'bg-[#CD201F]',
                href: '#',
              },
              {
                icon: <WhatsAppIcon size={14} className="text-white" />,
                label: 'WhatsApp',
                bg: 'bg-[#25D366]',
                href: '#',
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className={`w-7 h-7 flex items-center justify-center rounded-full ${s.bg} text-white shadow-xs hover:opacity-90 transition-opacity`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Shop by Category */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Shop by Category
          </h4>
          <ul className="space-y-2 text-xs text-white/70">
            {CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <Link href={cat.href} className="hover:text-[#C88C3C] transition-colors">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-white/70">
            {QUICK_LINKS.map((lnk) => (
              <li key={lnk.href}>
                <Link href={lnk.href} className="hover:text-[#C88C3C] transition-colors">
                  {lnk.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Contact Information
          </h4>
          <div className="space-y-2.5 text-xs text-white/70">
            <p className="flex items-center gap-2">
              <MapPinIcon size={14} className="text-[#C88C3C] flex-shrink-0" />
              <span>Fatehpuri, Delhi 110006</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneIcon size={14} className="text-[#C88C3C] flex-shrink-0" />
              <a href="tel:+919313321535" className="hover:text-[#C88C3C] transition-colors">
                9313321535 | 701119609
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MailIcon size={14} className="text-[#C88C3C] flex-shrink-0" />
              <a
                href="mailto:info@bansalfoods.in"
                className="hover:text-[#C88C3C] transition-colors"
              >
                info@bansalfoods.in
              </a>
            </p>
            <p className="flex items-center gap-2 pt-1 text-white/60">
              <ClockIcon size={14} className="text-[#C88C3C] flex-shrink-0" />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </p>
            <p className="flex items-center gap-2 text-white/60 pl-6">
              <span>Sunday: 10:00 AM - 6:00 PM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#3A2216] bg-[#160B05]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/50 text-center sm:text-left">
          <p>© 2026 Bansal Foods. All rights reserved.</p>
          <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 flex-wrap">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/returns" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
