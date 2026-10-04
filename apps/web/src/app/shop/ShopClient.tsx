'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  WheatHarvestIcon,
  MandiArchIcon,
  VarietyBoxesIcon,
  DeliveryTruckIcon,
  ShoppingCartIcon,
  StarIcon,
  HeartIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/ThemeIcons';

// ─── Data Definitions ─────────────────────────────────────────────────────────

export interface WeightVariant {
  weight: string;
  price: number;
  mrp: number;
}

export interface ListingProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  discountBadge: string;
  inStock: boolean;
  popularityRank: number;
  variants: WeightVariant[];
  defaultVariantIndex: number;
}

const CATEGORY_ITEMS = [
  { name: 'All Dry Fruits', slug: 'all', count: 76, image: '/product-mix.jpg' },
  { name: 'Almonds', slug: 'almonds', count: 12, image: '/product-almonds.jpg' },
  { name: 'Cashews', slug: 'cashews', count: 10, image: '/product-cashews.jpg' },
  { name: 'Pistachios', slug: 'pistachios', count: 8, image: '/product-pistachios.jpg' },
  { name: 'Walnuts', slug: 'walnuts', count: 6, image: '/product-walnuts.jpg' },
  { name: 'Raisins', slug: 'raisins', count: 8, image: '/product-raisins.jpg' },
  { name: 'Dates', slug: 'dates', count: 7, image: '/product-dates.jpg' },
  { name: 'Figs', slug: 'figs', count: 5, image: '/product-figs.jpg' },
  { name: 'Dry Fruit Mix', slug: 'dry-fruit-mix', count: 6, image: '/product-mix.jpg' },
  { name: 'Seeds', slug: 'seeds', count: 6, image: '/product-seeds.jpg' },
  { name: 'Gift Hampers', slug: 'gift-boxes', count: 8, image: '/product-gift-hamper.jpg' },
  { name: 'Festive Offers', slug: 'festive-offers', count: 8, image: '/banner-festive.jpg' },
];

const WEIGHT_OPTIONS = [
  { label: '100g', count: 24 },
  { label: '250g', count: 38 },
  { label: '500g', count: 52 },
  { label: '1kg', count: 40 },
];

const DISCOUNT_OPTIONS = [
  { label: '10% & above', min: 10, count: 52 },
  { label: '20% & above', min: 20, count: 28 },
  { label: '30% & above', min: 30, count: 12 },
];

const RATING_OPTIONS = [
  { stars: 4, label: '4★ & above', count: 60 },
  { stars: 3, label: '3★ & above', count: 64 },
  { stars: 2, label: '2★ & above', count: 68 },
];

export const PRODUCTS_CATALOG: ListingProduct[] = [
  {
    id: 'p-001',
    slug: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.8,
    reviewCount: 320,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 1,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 520, mrp: 650 },
      { weight: '250g', price: 1250, mrp: 1550 },
      { weight: '500g', price: 2450, mrp: 3000 },
      { weight: '1kg', price: 4800, mrp: 5800 },
    ],
  },
  {
    id: 'p-002',
    slug: 'w320-premium-cashews',
    name: 'W320 Premium Cashews (Kaju)',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.7,
    reviewCount: 280,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 2,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 135, mrp: 170 },
      { weight: '250g', price: 320, mrp: 400 },
      { weight: '500g', price: 620, mrp: 780 },
      { weight: '1kg', price: 1200, mrp: 1500 },
    ],
  },
  {
    id: 'p-003',
    slug: 'iranian-green-pistachios',
    name: 'Iranian Green Pistachios (Pista)',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.8,
    reviewCount: 210,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 3,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 210, mrp: 260 },
      { weight: '250g', price: 500, mrp: 620 },
      { weight: '500g', price: 980, mrp: 1200 },
      { weight: '1kg', price: 1900, mrp: 2350 },
    ],
  },
  {
    id: 'p-004',
    slug: 'california-walnuts',
    name: 'California Walnuts (Akhrot)',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.8,
    reviewCount: 150,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 4,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 145, mrp: 180 },
      { weight: '250g', price: 345, mrp: 430 },
      { weight: '500g', price: 670, mrp: 830 },
      { weight: '1kg', price: 1300, mrp: 1600 },
    ],
  },
  {
    id: 'p-005',
    slug: 'premium-raisins-kishmish',
    name: 'Premium Raisins (Kishmish)',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.5,
    reviewCount: 180,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 5,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 80, mrp: 100 },
      { weight: '250g', price: 190, mrp: 240 },
      { weight: '500g', price: 360, mrp: 450 },
      { weight: '1kg', price: 700, mrp: 880 },
    ],
  },
  {
    id: 'p-006',
    slug: 'medjool-dates-khajur',
    name: 'Medjool Dates (Khajur Matjol)',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.7,
    reviewCount: 120,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 6,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 155, mrp: 195 },
      { weight: '250g', price: 370, mrp: 460 },
      { weight: '500g', price: 720, mrp: 900 },
      { weight: '1kg', price: 1400, mrp: 1750 },
    ],
  },
  {
    id: 'p-007',
    slug: 'premium-figs-anjeer',
    name: 'Premium Figs (Anjeer)',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.6,
    reviewCount: 140,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 7,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 155, mrp: 195 },
      { weight: '250g', price: 370, mrp: 460 },
      { weight: '500g', price: 720, mrp: 900 },
      { weight: '1kg', price: 1400, mrp: 1750 },
    ],
  },
  {
    id: 'p-008',
    slug: 'california-almonds',
    name: 'California Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.7,
    reviewCount: 260,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 8,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 125, mrp: 160 },
      { weight: '250g', price: 295, mrp: 370 },
      { weight: '500g', price: 570, mrp: 700 },
      { weight: '1kg', price: 1100, mrp: 1350 },
    ],
  },
  {
    id: 'p-009',
    slug: 'premium-pistachios',
    name: 'Premium Pistachios (Pista)',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.9,
    reviewCount: 190,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 9,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 460, mrp: 560 },
      { weight: '250g', price: 1100, mrp: 1350 },
      { weight: '500g', price: 2150, mrp: 2600 },
      { weight: '1kg', price: 4200, mrp: 5100 },
    ],
  },
  {
    id: 'p-010',
    slug: 'roasted-chia-pumpkin-seeds',
    name: 'Roasted Chia & Pumpkin Seeds',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.6,
    reviewCount: 110,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 10,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 120, mrp: 150 },
      { weight: '250g', price: 290, mrp: 370 },
      { weight: '500g', price: 550, mrp: 700 },
      { weight: '1kg', price: 1050, mrp: 1350 },
    ],
  },
  {
    id: 'p-011',
    slug: 'jumbo-nonpareil-california-almonds',
    name: 'Jumbo Nonpareil California Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.9,
    reviewCount: 165,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 11,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 130, mrp: 160 },
      { weight: '250g', price: 310, mrp: 380 },
      { weight: '500g', price: 600, mrp: 740 },
      { weight: '1kg', price: 1180, mrp: 1450 },
    ],
  },
  {
    id: 'p-012',
    slug: 'kashmiri-walnut-kernels-giri',
    name: 'Kashmiri Walnut Kernels (Giri)',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.7,
    reviewCount: 135,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 12,
    defaultVariantIndex: 3, // 1kg
    variants: [
      { weight: '100g', price: 145, mrp: 180 },
      { weight: '250g', price: 345, mrp: 430 },
      { weight: '500g', price: 670, mrp: 830 },
      { weight: '1kg', price: 1300, mrp: 1600 },
    ],
  },
  {
    id: 'p-013',
    slug: 'assorted-royal-dry-fruit-mix',
    name: 'Assorted Royal Dry Fruit Mix (Panchmeva)',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.9,
    reviewCount: 240,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 5,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 160, mrp: 200 },
      { weight: '250g', price: 380, mrp: 480 },
      { weight: '500g', price: 740, mrp: 950 },
      { weight: '1kg', price: 1450, mrp: 1850 },
    ],
  },
  {
    id: 'p-014',
    slug: 'daily-healthy-energy-nut-fruit-mix',
    name: 'Daily Healthy Energy Nut & Fruit Mix',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.8,
    reviewCount: 185,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 13,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 140, mrp: 175 },
      { weight: '250g', price: 330, mrp: 420 },
      { weight: '500g', price: 640, mrp: 800 },
      { weight: '1kg', price: 1250, mrp: 1550 },
    ],
  },
  {
    id: 'p-015',
    slug: 'khari-baoli-roasted-salted-trail-mix',
    name: 'Khari Baoli Roasted & Salted Trail Mix',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.7,
    reviewCount: 160,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 14,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 175, mrp: 215 },
      { weight: '250g', price: 410, mrp: 500 },
      { weight: '500g', price: 790, mrp: 980 },
      { weight: '1kg', price: 1550, mrp: 1900 },
    ],
  },
  {
    id: 'p-016',
    slug: 'kashmiri-heritage-panchmeva-prasad-mix',
    name: 'Kashmiri Heritage Panchmeva Prasad Mix',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.9,
    reviewCount: 215,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 15,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 190, mrp: 240 },
      { weight: '250g', price: 450, mrp: 570 },
      { weight: '500g', price: 880, mrp: 1100 },
      { weight: '1kg', price: 1720, mrp: 2150 },
    ],
  },
  {
    id: 'p-017',
    slug: 'omega-3-power-nut-seed-mix',
    name: 'Omega-3 Power Nut & Seed Fusion Mix',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.8,
    reviewCount: 140,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 16,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 150, mrp: 185 },
      { weight: '250g', price: 350, mrp: 440 },
      { weight: '500g', price: 680, mrp: 850 },
      { weight: '1kg', price: 1320, mrp: 1650 },
    ],
  },
  {
    id: 'p-018',
    slug: 'royal-festive-party-snack-mix',
    name: 'Royal Festive Party Snack Mix (Spiced)',
    category: 'dry-fruit-mix',
    imageUrl: '/product-mix.jpg',
    rating: 4.7,
    reviewCount: 125,
    discountBadge: '25% OFF',
    inStock: true,
    popularityRank: 17,
    defaultVariantIndex: 2, // 500g
    variants: [
      { weight: '100g', price: 165, mrp: 220 },
      { weight: '250g', price: 390, mrp: 520 },
      { weight: '500g', price: 760, mrp: 1020 },
      { weight: '1kg', price: 1480, mrp: 1980 },
    ],
  },
  // ALMONDS (p-019 to p-027) -> 9 items (+ p-001, p-008, p-011 = 12 total)
  {
    id: 'p-019',
    slug: 'gurbandi-almonds-chhoti-giri',
    name: 'Gurbandi Almonds (Chhoti Giri)',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.8,
    reviewCount: 190,
    discountBadge: '16% OFF',
    inStock: true,
    popularityRank: 19,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 220, mrp: 260 },
      { weight: '250g', price: 520, mrp: 620 },
      { weight: '500g', price: 1020, mrp: 1220 },
      { weight: '1kg', price: 2000, mrp: 2400 },
    ],
  },
  {
    id: 'p-020',
    slug: 'roasted-salted-california-almonds',
    name: 'Roasted & Salted California Almonds',
    category: 'almonds',
    imageUrl: '/almonds-roasted.jpg',
    rating: 4.7,
    reviewCount: 175,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 20,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 140, mrp: 170 },
      { weight: '250g', price: 330, mrp: 400 },
      { weight: '500g', price: 640, mrp: 780 },
      { weight: '1kg', price: 1250, mrp: 1500 },
    ],
  },
  {
    id: 'p-021',
    slug: 'smoked-barbeque-almonds',
    name: 'Smoked Barbeque Almonds',
    category: 'almonds',
    imageUrl: '/almonds-roasted.jpg',
    rating: 4.6,
    reviewCount: 145,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 21,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 155, mrp: 195 },
      { weight: '250g', price: 365, mrp: 455 },
      { weight: '500g', price: 710, mrp: 890 },
      { weight: '1kg', price: 1380, mrp: 1720 },
    ],
  },
  {
    id: 'p-022',
    slug: 'organic-california-badam',
    name: 'Raw Organic California Badam',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.9,
    reviewCount: 210,
    discountBadge: '15% OFF',
    inStock: true,
    popularityRank: 22,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 135, mrp: 160 },
      { weight: '250g', price: 320, mrp: 380 },
      { weight: '500g', price: 620, mrp: 730 },
      { weight: '1kg', price: 1200, mrp: 1420 },
    ],
  },
  {
    id: 'p-023',
    slug: 'blanched-almond-flakes-slivers',
    name: 'Blanched Almond Flakes & Slivers',
    category: 'almonds',
    imageUrl: '/almonds-slivers.jpg',
    rating: 4.8,
    reviewCount: 130,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 23,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 160, mrp: 200 },
      { weight: '250g', price: 380, mrp: 470 },
      { weight: '500g', price: 740, mrp: 915 },
      { weight: '1kg', price: 1440, mrp: 1780 },
    ],
  },
  {
    id: 'p-024',
    slug: 'premium-sanora-almonds',
    name: 'Premium Sanora Almonds',
    category: 'almonds',
    imageUrl: '/product-almonds.jpg',
    rating: 4.7,
    reviewCount: 115,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 24,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 145, mrp: 175 },
      { weight: '250g', price: 345, mrp: 415 },
      { weight: '500g', price: 670, mrp: 810 },
      { weight: '1kg', price: 1300, mrp: 1570 },
    ],
  },
  {
    id: 'p-025',
    slug: 'chocolate-coated-roasted-almonds',
    name: 'Dark Chocolate Coated Almonds',
    category: 'almonds',
    imageUrl: '/almonds-chocolate.jpg',
    rating: 4.9,
    reviewCount: 260,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 25,
    defaultVariantIndex: 1,
    variants: [
      { weight: '100g', price: 175, mrp: 225 },
      { weight: '250g', price: 410, mrp: 525 },
      { weight: '500g', price: 790, mrp: 1010 },
      { weight: '1kg', price: 1540, mrp: 1980 },
    ],
  },
  {
    id: 'p-026',
    slug: 'peri-peri-spiced-almonds',
    name: 'Peri Peri Spiced Crispy Almonds',
    category: 'almonds',
    imageUrl: '/almonds-roasted.jpg',
    rating: 4.6,
    reviewCount: 140,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 26,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 150, mrp: 185 },
      { weight: '250g', price: 350, mrp: 430 },
      { weight: '500g', price: 680, mrp: 830 },
      { weight: '1kg', price: 1320, mrp: 1610 },
    ],
  },
  {
    id: 'p-027',
    slug: 'honey-glazed-crunchy-almonds',
    name: 'Honey Glazed Roasted Almonds',
    category: 'almonds',
    imageUrl: '/almonds-roasted.jpg',
    rating: 4.8,
    reviewCount: 180,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 27,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 165, mrp: 210 },
      { weight: '250g', price: 390, mrp: 495 },
      { weight: '500g', price: 760, mrp: 960 },
      { weight: '1kg', price: 1480, mrp: 1870 },
    ],
  },

  // CASHEWS (p-028 to p-036) -> 9 items (+ p-002 = 10 total)
  {
    id: 'p-028',
    slug: 'w180-king-jumbo-cashews',
    name: 'W180 King Jumbo Cashews (Kaju)',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.9,
    reviewCount: 310,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 28,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 170, mrp: 215 },
      { weight: '250g', price: 410, mrp: 515 },
      { weight: '500g', price: 800, mrp: 1000 },
      { weight: '1kg', price: 1560, mrp: 1950 },
    ],
  },
  {
    id: 'p-029',
    slug: 'w240-premium-whole-cashews',
    name: 'W240 Premium Whole Cashews',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.8,
    reviewCount: 290,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 29,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 150, mrp: 185 },
      { weight: '250g', price: 360, mrp: 445 },
      { weight: '500g', price: 700, mrp: 865 },
      { weight: '1kg', price: 1360, mrp: 1680 },
    ],
  },
  {
    id: 'p-030',
    slug: 'roasted-salted-pepper-cashews',
    name: 'Black Pepper Roasted Salted Cashews',
    category: 'cashews',
    imageUrl: '/b2b-bowl.jpg',
    rating: 4.8,
    reviewCount: 225,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 30,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 160, mrp: 195 },
      { weight: '250g', price: 380, mrp: 465 },
      { weight: '500g', price: 740, mrp: 905 },
      { weight: '1kg', price: 1440, mrp: 1760 },
    ],
  },
  {
    id: 'p-031',
    slug: 'mangalore-organic-cashews',
    name: 'Mangalore Organic Grade A Cashews',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.7,
    reviewCount: 165,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 31,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 145, mrp: 175 },
      { weight: '250g', price: 345, mrp: 415 },
      { weight: '500g', price: 670, mrp: 810 },
      { weight: '1kg', price: 1300, mrp: 1570 },
    ],
  },
  {
    id: 'p-032',
    slug: 'cashew-splits-2-piece',
    name: 'Cashew Splits 2-Piece (JH Tukda)',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.6,
    reviewCount: 140,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 32,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 115, mrp: 150 },
      { weight: '250g', price: 270, mrp: 345 },
      { weight: '500g', price: 520, mrp: 665 },
      { weight: '1kg', price: 1000, mrp: 1280 },
    ],
  },
  {
    id: 'p-033',
    slug: 'cashew-pieces-lwp',
    name: 'Four-Piece Cashew Kernels (LWP)',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.5,
    reviewCount: 110,
    discountBadge: '25% OFF',
    inStock: true,
    popularityRank: 33,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 100, mrp: 135 },
      { weight: '250g', price: 235, mrp: 315 },
      { weight: '500g', price: 450, mrp: 600 },
      { weight: '1kg', price: 860, mrp: 1150 },
    ],
  },
  {
    id: 'p-034',
    slug: 'tandoori-spiced-cashews',
    name: 'Tandoori Spiced Crunchy Cashews',
    category: 'cashews',
    imageUrl: '/b2b-bowl.jpg',
    rating: 4.7,
    reviewCount: 180,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 34,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 165, mrp: 205 },
      { weight: '250g', price: 390, mrp: 490 },
      { weight: '500g', price: 760, mrp: 950 },
      { weight: '1kg', price: 1480, mrp: 1850 },
    ],
  },
  {
    id: 'p-035',
    slug: 'cheese-herbs-roasted-cashews',
    name: 'Cheese & Herbs Roasted Cashews',
    category: 'cashews',
    imageUrl: '/b2b-bowl.jpg',
    rating: 4.8,
    reviewCount: 205,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 35,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 170, mrp: 210 },
      { weight: '250g', price: 405, mrp: 495 },
      { weight: '500g', price: 790, mrp: 965 },
      { weight: '1kg', price: 1540, mrp: 1880 },
    ],
  },
  {
    id: 'p-036',
    slug: 'raw-goa-whole-cashews',
    name: 'Raw Goa Traditional Whole Cashews',
    category: 'cashews',
    imageUrl: '/product-cashews.jpg',
    rating: 4.8,
    reviewCount: 155,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 36,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 140, mrp: 175 },
      { weight: '250g', price: 335, mrp: 415 },
      { weight: '500g', price: 650, mrp: 805 },
      { weight: '1kg', price: 1260, mrp: 1560 },
    ],
  },

  // PISTACHIOS (p-037 to p-042) -> 6 items (+ p-003, p-009 = 8 total)
  {
    id: 'p-037',
    slug: 'california-roasted-salted-pistachios',
    name: 'California Roasted & Salted Pistachios',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.8,
    reviewCount: 230,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 37,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 220, mrp: 270 },
      { weight: '250g', price: 520, mrp: 635 },
      { weight: '500g', price: 1020, mrp: 1245 },
      { weight: '1kg', price: 1980, mrp: 2415 },
    ],
  },
  {
    id: 'p-038',
    slug: 'raw-turkish-green-pista-kernels',
    name: 'Raw Turkish Green Pista Kernels',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.9,
    reviewCount: 185,
    discountBadge: '16% OFF',
    inStock: true,
    popularityRank: 38,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 420, mrp: 500 },
      { weight: '250g', price: 1000, mrp: 1190 },
      { weight: '500g', price: 1950, mrp: 2320 },
      { weight: '1kg', price: 3800, mrp: 4525 },
    ],
  },
  {
    id: 'p-039',
    slug: 'jumbo-afghani-salted-pistachios',
    name: 'Jumbo Afghani Salted Pistachios',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.8,
    reviewCount: 200,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 39,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 240, mrp: 300 },
      { weight: '250g', price: 570, mrp: 715 },
      { weight: '500g', price: 1115, mrp: 1395 },
      { weight: '1kg', price: 2160, mrp: 2700 },
    ],
  },
  {
    id: 'p-040',
    slug: 'silver-cut-pistachio-slivers',
    name: 'Pistachio Flakes & Slivers (Katri)',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.7,
    reviewCount: 140,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 40,
    defaultVariantIndex: 1,
    variants: [
      { weight: '100g', price: 380, mrp: 470 },
      { weight: '250g', price: 900, mrp: 1110 },
      { weight: '500g', price: 1750, mrp: 2160 },
      { weight: '1kg', price: 3400, mrp: 4200 },
    ],
  },
  {
    id: 'p-041',
    slug: 'roasted-black-pepper-pistachios',
    name: 'Roasted Black Pepper Pistachios',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.8,
    reviewCount: 165,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 41,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 230, mrp: 280 },
      { weight: '250g', price: 545, mrp: 660 },
      { weight: '500g', price: 1065, mrp: 1285 },
      { weight: '1kg', price: 2070, mrp: 2495 },
    ],
  },
  {
    id: 'p-042',
    slug: 'kashmiri-wild-pistachios',
    name: 'Kashmiri Mountain Wild Pistachios',
    category: 'pistachios',
    imageUrl: '/product-pistachios.jpg',
    rating: 4.9,
    reviewCount: 120,
    discountBadge: '15% OFF',
    inStock: true,
    popularityRank: 42,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 360, mrp: 425 },
      { weight: '250g', price: 850, mrp: 1000 },
      { weight: '500g', price: 1660, mrp: 1955 },
      { weight: '1kg', price: 3220, mrp: 3790 },
    ],
  },

  // WALNUTS (p-043 to p-046) -> 4 items (+ p-004, p-012 = 6 total)
  {
    id: 'p-043',
    slug: 'extra-light-halves-kashmiri-walnuts',
    name: 'Extra Light Halves Kashmiri Walnuts',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.9,
    reviewCount: 280,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 43,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 165, mrp: 205 },
      { weight: '250g', price: 395, mrp: 495 },
      { weight: '500g', price: 770, mrp: 965 },
      { weight: '1kg', price: 1500, mrp: 1875 },
    ],
  },
  {
    id: 'p-044',
    slug: 'in-shell-paper-bark-walnuts',
    name: 'In-Shell Paper Bark Walnuts (Kaghzi)',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.7,
    reviewCount: 195,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 44,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 90, mrp: 115 },
      { weight: '250g', price: 215, mrp: 275 },
      { weight: '500g', price: 415, mrp: 530 },
      { weight: '1kg', price: 800, mrp: 1025 },
    ],
  },
  {
    id: 'p-045',
    slug: 'chilean-walnut-kernels',
    name: 'Chilean Extra White Walnut Kernels',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.8,
    reviewCount: 160,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 45,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 155, mrp: 190 },
      { weight: '250g', price: 370, mrp: 450 },
      { weight: '500g', price: 720, mrp: 880 },
      { weight: '1kg', price: 1400, mrp: 1710 },
    ],
  },
  {
    id: 'p-046',
    slug: 'honey-roasted-walnut-halves',
    name: 'Honey Roasted Walnut Halves',
    category: 'walnuts',
    imageUrl: '/product-walnuts.jpg',
    rating: 4.8,
    reviewCount: 145,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 46,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 175, mrp: 220 },
      { weight: '250g', price: 420, mrp: 530 },
      { weight: '500g', price: 820, mrp: 1040 },
      { weight: '1kg', price: 1600, mrp: 2025 },
    ],
  },

  // RAISINS (p-047 to p-053) -> 7 items (+ p-005 = 8 total)
  {
    id: 'p-047',
    slug: 'long-green-afghani-kishmish',
    name: 'Long Green Afghani Kishmish',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.8,
    reviewCount: 220,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 47,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 95, mrp: 120 },
      { weight: '250g', price: 225, mrp: 280 },
      { weight: '500g', price: 430, mrp: 540 },
      { weight: '1kg', price: 840, mrp: 1050 },
    ],
  },
  {
    id: 'p-048',
    slug: 'black-seedless-raisins',
    name: 'Black Seedless Raisins (Kali Kishmish)',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.9,
    reviewCount: 260,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 48,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 90, mrp: 110 },
      { weight: '250g', price: 215, mrp: 260 },
      { weight: '500g', price: 410, mrp: 500 },
      { weight: '1kg', price: 800, mrp: 975 },
    ],
  },
  {
    id: 'p-049',
    slug: 'nashik-golden-jumbo-raisins',
    name: 'Nashik Golden Jumbo Raisins',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.7,
    reviewCount: 175,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 49,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 80, mrp: 100 },
      { weight: '250g', price: 190, mrp: 245 },
      { weight: '500g', price: 360, mrp: 460 },
      { weight: '1kg', price: 700, mrp: 895 },
    ],
  },
  {
    id: 'p-050',
    slug: 'seedless-munakka-large',
    name: 'Kandahari Munakka Jumbo Size',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.8,
    reviewCount: 240,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 50,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 130, mrp: 160 },
      { weight: '250g', price: 310, mrp: 385 },
      { weight: '500g', price: 600, mrp: 740 },
      { weight: '1kg', price: 1160, mrp: 1430 },
    ],
  },
  {
    id: 'p-051',
    slug: 'sundried-kandahari-raisins',
    name: 'Sundried Kandahari Golden Raisins',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.6,
    reviewCount: 135,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 51,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 85, mrp: 105 },
      { weight: '250g', price: 200, mrp: 255 },
      { weight: '500g', price: 385, mrp: 490 },
      { weight: '1kg', price: 750, mrp: 950 },
    ],
  },
  {
    id: 'p-052',
    slug: 'red-flame-seedless-raisins',
    name: 'Red Flame Seedless Sweet Raisins',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.7,
    reviewCount: 150,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 52,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 90, mrp: 110 },
      { weight: '250g', price: 210, mrp: 265 },
      { weight: '500g', price: 400, mrp: 500 },
      { weight: '1kg', price: 780, mrp: 975 },
    ],
  },
  {
    id: 'p-053',
    slug: 'organic-green-valley-kishmish',
    name: 'Organic Green Valley Kishmish',
    category: 'raisins',
    imageUrl: '/product-raisins.jpg',
    rating: 4.8,
    reviewCount: 160,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 53,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 100, mrp: 120 },
      { weight: '250g', price: 235, mrp: 285 },
      { weight: '500g', price: 450, mrp: 545 },
      { weight: '1kg', price: 880, mrp: 1060 },
    ],
  },

  // DATES (p-054 to p-059) -> 6 items (+ p-006 = 7 total)
  {
    id: 'p-054',
    slug: 'ajwa-dates-madinah',
    name: 'Original Ajwa Dates from Madinah',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 5.0,
    reviewCount: 380,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 54,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 220, mrp: 270 },
      { weight: '250g', price: 520, mrp: 635 },
      { weight: '500g', price: 1020, mrp: 1245 },
      { weight: '1kg', price: 1980, mrp: 2415 },
    ],
  },
  {
    id: 'p-055',
    slug: 'kalmi-safawi-dark-dates',
    name: 'Kalmi (Safawi) Soft Dark Dates',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.8,
    reviewCount: 245,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 55,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 160, mrp: 200 },
      { weight: '250g', price: 380, mrp: 475 },
      { weight: '500g', price: 740, mrp: 925 },
      { weight: '1kg', price: 1440, mrp: 1800 },
    ],
  },
  {
    id: 'p-056',
    slug: 'kimia-soft-iranian-dates',
    name: 'Kimia Soft Iranian Mazafati Dates',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.7,
    reviewCount: 310,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 56,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 80, mrp: 100 },
      { weight: '250g', price: 190, mrp: 245 },
      { weight: '500g', price: 360, mrp: 460 },
      { weight: '1kg', price: 700, mrp: 895 },
    ],
  },
  {
    id: 'p-057',
    slug: 'dry-yellow-dates-chuara',
    name: 'Dry Yellow Dates (Pila Chuara)',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.6,
    reviewCount: 160,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 57,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 65, mrp: 80 },
      { weight: '250g', price: 155, mrp: 190 },
      { weight: '500g', price: 295, mrp: 365 },
      { weight: '1kg', price: 570, mrp: 705 },
    ],
  },
  {
    id: 'p-058',
    slug: 'dry-black-dates-chuara',
    name: 'Dry Black Dates (Kala Chuara)',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.6,
    reviewCount: 140,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 58,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 70, mrp: 90 },
      { weight: '250g', price: 165, mrp: 210 },
      { weight: '500g', price: 315, mrp: 400 },
      { weight: '1kg', price: 610, mrp: 770 },
    ],
  },
  {
    id: 'p-059',
    slug: 'mabroom-saudi-dates',
    name: 'Mabroom Premium Saudi Dates',
    category: 'dates',
    imageUrl: '/product-dates.jpg',
    rating: 4.9,
    reviewCount: 195,
    discountBadge: '17% OFF',
    inStock: true,
    popularityRank: 59,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 190, mrp: 230 },
      { weight: '250g', price: 450, mrp: 540 },
      { weight: '500g', price: 880, mrp: 1060 },
      { weight: '1kg', price: 1720, mrp: 2070 },
    ],
  },

  // FIGS (p-060 to p-063) -> 4 items (+ p-007 = 5 total)
  {
    id: 'p-060',
    slug: 'jumbo-afghan-white-anjeer',
    name: 'Jumbo Afghan White Anjeer (Figs)',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.9,
    reviewCount: 290,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 60,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 180, mrp: 225 },
      { weight: '250g', price: 430, mrp: 540 },
      { weight: '500g', price: 840, mrp: 1050 },
      { weight: '1kg', price: 1640, mrp: 2050 },
    ],
  },
  {
    id: 'p-061',
    slug: 'garland-pressed-dried-figs',
    name: 'Garland Pressed Dried Figs (Mala Anjeer)',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.8,
    reviewCount: 220,
    discountBadge: '19% OFF',
    inStock: true,
    popularityRank: 61,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 170, mrp: 210 },
      { weight: '250g', price: 410, mrp: 505 },
      { weight: '500g', price: 800, mrp: 990 },
      { weight: '1kg', price: 1560, mrp: 1925 },
    ],
  },
  {
    id: 'p-062',
    slug: 'turkish-natural-dried-figs',
    name: 'Turkish Natural Sun-Dried Figs',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.7,
    reviewCount: 175,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 62,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 160, mrp: 195 },
      { weight: '250g', price: 380, mrp: 465 },
      { weight: '500g', price: 740, mrp: 905 },
      { weight: '1kg', price: 1440, mrp: 1760 },
    ],
  },
  {
    id: 'p-063',
    slug: 'baby-anjeer-daily-soak',
    name: 'Baby Anjeer for Daily Morning Soak',
    category: 'figs',
    imageUrl: '/product-figs.jpg',
    rating: 4.8,
    reviewCount: 185,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 63,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 140, mrp: 180 },
      { weight: '250g', price: 330, mrp: 425 },
      { weight: '500g', price: 640, mrp: 820 },
      { weight: '1kg', price: 1250, mrp: 1600 },
    ],
  },

  // SEEDS (p-064 to p-068) -> 5 items (+ p-010 = 6 total)
  {
    id: 'p-064',
    slug: 'raw-organic-pumpkin-seeds',
    name: 'Raw AAA Grade Organic Pumpkin Seeds',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.8,
    reviewCount: 230,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 64,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 110, mrp: 140 },
      { weight: '250g', price: 260, mrp: 325 },
      { weight: '500g', price: 500, mrp: 625 },
      { weight: '1kg', price: 960, mrp: 1200 },
    ],
  },
  {
    id: 'p-065',
    slug: 'raw-white-chia-seeds',
    name: 'Raw White Organic Chia Seeds',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.7,
    reviewCount: 190,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 65,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 95, mrp: 120 },
      { weight: '250g', price: 225, mrp: 290 },
      { weight: '500g', price: 430, mrp: 550 },
      { weight: '1kg', price: 840, mrp: 1075 },
    ],
  },
  {
    id: 'p-066',
    slug: 'roasted-sunflower-seeds',
    name: 'Salted & Roasted Sunflower Seeds',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.6,
    reviewCount: 155,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 66,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 80, mrp: 100 },
      { weight: '250g', price: 190, mrp: 240 },
      { weight: '500g', price: 360, mrp: 455 },
      { weight: '1kg', price: 700, mrp: 885 },
    ],
  },
  {
    id: 'p-067',
    slug: 'roasted-super-seeds-blend-7in1',
    name: '7-in-1 Roasted Super Seeds Blend',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.9,
    reviewCount: 275,
    discountBadge: '24% OFF',
    inStock: true,
    popularityRank: 67,
    defaultVariantIndex: 2,
    variants: [
      { weight: '100g', price: 130, mrp: 170 },
      { weight: '250g', price: 310, mrp: 410 },
      { weight: '500g', price: 600, mrp: 790 },
      { weight: '1kg', price: 1160, mrp: 1530 },
    ],
  },
  {
    id: 'p-068',
    slug: 'golden-flax-seeds',
    name: 'Raw Cleaned Golden Flax Seeds (Alsi)',
    category: 'seeds',
    imageUrl: '/product-seeds.jpg',
    rating: 4.7,
    reviewCount: 145,
    discountBadge: '25% OFF',
    inStock: true,
    popularityRank: 68,
    defaultVariantIndex: 3,
    variants: [
      { weight: '100g', price: 60, mrp: 80 },
      { weight: '250g', price: 140, mrp: 185 },
      { weight: '500g', price: 260, mrp: 345 },
      { weight: '1kg', price: 500, mrp: 665 },
    ],
  },
  {
    id: 'p-069',
    slug: 'khari-baoli-royal-festive-gift-box',
    name: 'Khari Baoli Royal Festive 4-in-1 Wooden Gift Box',
    category: 'gift-boxes',
    imageUrl: '/product-gift-hamper.jpg',
    rating: 4.9,
    reviewCount: 340,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 69,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 820, mrp: 1025 },
      { weight: '1kg', price: 1499, mrp: 1875 },
      { weight: '2kg', price: 2850, mrp: 3600 },
    ],
  },
  {
    id: 'p-070',
    slug: 'royaal-uphaar-festive-box',
    name: 'Royaal Uphaar Festive Velvet Corporate Box',
    category: 'gift-boxes',
    imageUrl: '/banner-festive.jpg',
    rating: 4.8,
    reviewCount: 260,
    discountBadge: '22% OFF',
    inStock: true,
    popularityRank: 70,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 980, mrp: 1250 },
      { weight: '1kg', price: 1799, mrp: 2300 },
      { weight: '2kg', price: 3400, mrp: 4400 },
    ],
  },
  {
    id: 'p-071',
    slug: 'shubh-utsav-emerald-gold-box',
    name: 'Shubh Utsav Emerald Gold Dry Fruit Box',
    category: 'festive-offers',
    imageUrl: '/hamper-corporate-box.jpg',
    rating: 4.9,
    reviewCount: 290,
    discountBadge: '24% OFF',
    inStock: true,
    popularityRank: 71,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 880, mrp: 1150 },
      { weight: '1kg', price: 1599, mrp: 2100 },
      { weight: '2kg', price: 2990, mrp: 3950 },
    ],
  },
  {
    id: 'p-072',
    slug: 'shubh-deepawali-brass-platter-hamper',
    name: 'Shubh Deepawali Celebration Brass Platter Hamper',
    category: 'gift-boxes',
    imageUrl: '/hamper-brass-tray.jpg',
    rating: 4.9,
    reviewCount: 210,
    discountBadge: '21% OFF',
    inStock: true,
    popularityRank: 72,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 1199, mrp: 1520 },
      { weight: '1kg', price: 2199, mrp: 2780 },
      { weight: '2kg', price: 4100, mrp: 5200 },
    ],
  },
  {
    id: 'p-073',
    slug: 'mughlai-panchmeva-brocade-potli-set',
    name: 'Mughlai Panchmeva Shahi Brocade Potli Set',
    category: 'festive-offers',
    imageUrl: '/hamper-brocade-potlis.jpg',
    rating: 4.8,
    reviewCount: 180,
    discountBadge: '25% OFF',
    inStock: true,
    popularityRank: 73,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 650, mrp: 870 },
      { weight: '1kg', price: 1199, mrp: 1600 },
      { weight: '2kg', price: 2250, mrp: 3000 },
    ],
  },
  {
    id: 'p-074',
    slug: 'bansal-heritage-grand-festive-basket',
    name: 'Bansal Heritage Grand Festive Wicker Basket',
    category: 'gift-boxes',
    imageUrl: '/hamper-grand-basket.jpg',
    rating: 5.0,
    reviewCount: 150,
    discountBadge: '23% OFF',
    inStock: true,
    popularityRank: 74,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 1499, mrp: 1950 },
      { weight: '1kg', price: 2899, mrp: 3750 },
      { weight: '2kg', price: 5490, mrp: 7100 },
    ],
  },
  {
    id: 'p-075',
    slug: 'imperial-saffron-dry-fruit-hamper',
    name: 'Imperial Saffron & Dry Fruit Delight Hamper',
    category: 'festive-offers',
    imageUrl: '/banner-festive.jpg',
    rating: 4.8,
    reviewCount: 175,
    discountBadge: '20% OFF',
    inStock: true,
    popularityRank: 75,
    defaultVariantIndex: 1, // 1kg
    variants: [
      { weight: '500g', price: 1080, mrp: 1350 },
      { weight: '1kg', price: 1999, mrp: 2500 },
      { weight: '2kg', price: 3800, mrp: 4800 },
    ],
  },
  {
    id: 'p-076',
    slug: 'executive-festive-treats-pack',
    name: 'Executive Festive Treats Dry Fruit Pack',
    category: 'gift-boxes',
    imageUrl: '/product-gift-hamper.jpg',
    rating: 4.7,
    reviewCount: 140,
    discountBadge: '18% OFF',
    inStock: true,
    popularityRank: 76,
    defaultVariantIndex: 1, // 500g
    variants: [
      { weight: '250g', price: 420, mrp: 510 },
      { weight: '500g', price: 799, mrp: 975 },
      { weight: '1kg', price: 1490, mrp: 1820 },
    ],
  },
];

// ─── Sub-Component: Product Card with Interactive Weight Pills ────────────────

function ProductCardItem({ product }: { product: ListingProduct }) {
  const { addItem } = useCart();
  const { isWishlisted: checkWishlisted, toggleWishlist } = useWishlist();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(product.defaultVariantIndex);
  const [added, setAdded] = useState(false);

  const isWishlisted = checkWishlisted(product.id) || checkWishlisted(product.slug);

  const currentVariant: WeightVariant =
    product.variants[selectedVariantIndex] ??
    product.variants[0] ?? { weight: '500g', price: 1000, mrp: 1200 };
  const savings = Math.max(0, currentVariant.mrp - currentVariant.price);
  const discountPct = Math.round((savings / currentVariant.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addItem({
      id: `${product.id}-${currentVariant.weight}`,
      name: product.name,
      variantLabel: currentVariant.weight,
      pricePaise: currentVariant.price * 100,
      mrpPaise: currentVariant.mrp * 100,
      imageUrl: product.imageUrl,
      slug: product.slug,
    });
    setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      discountBadge: product.discountBadge,
      rating: product.rating,
      reviewCount: product.reviewCount,
      variants: product.variants.map((v) => ({
        weight: v.weight,
        price: v.price,
        mrp: v.mrp,
        savingsText: `Save ₹${v.mrp - v.price} (${Math.round(((v.mrp - v.price) / v.mrp) * 100)}%)`,
      })),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden">
          {/* Red discount pill badge */}
          <span className="absolute top-2.5 left-2.5 bg-[#D92D20] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-xs z-10 shadow-xs tracking-wider">
            {product.discountBadge}
          </span>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all z-10 cursor-pointer"
            aria-label="Add to Wishlist"
          >
            <HeartIcon
              size={14}
              filled={isWishlisted}
              className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Product Image */}
          <Link href={`/products/${product.slug}`} className="relative w-full h-full block p-2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Card Details */}
        <div className="p-2.5 sm:p-3.5 pb-2">
          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-[#1B1F2A] hover:text-[#C88C3C] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5 text-[#E5A93C]">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} size={11} filled={true} className="text-[#E5A93C]" />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 ml-0.5">{product.rating}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Pricing & Savings */}
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xs sm:text-base text-[#1B1F2A]">
                ₹{currentVariant.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ₹{currentVariant.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#15803D] block mt-0.5 leading-tight truncate">
              Save ₹{savings.toLocaleString('en-IN')} ({discountPct}%)
            </span>
          </div>

          {/* Weight Variant Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-2 pt-1 overflow-x-auto scrollbar-none">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIndex === idx;
              return (
                <button
                  key={v.weight}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[9px] sm:text-[11px] py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-md border text-center transition-all cursor-pointer font-medium shrink-0 ${
                    isActive
                      ? 'bg-[#F5E5C9] border-[#E5A93C] text-[#2C2114] font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {v.weight}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add to Cart button */}
      <div className="p-2.5 sm:p-3.5 pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#F5DCA8] hover:bg-[#E5CB97] text-[#2C2114] font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 px-2 sm:px-3 rounded-md flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer active:scale-[0.98] shadow-2xs"
          aria-label={`Add ${product.name} (${currentVariant.weight}) to cart`}
        >
          <ShoppingCartIcon size={13} className="text-[#2C2114]" />
          <span>{added ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Shop Client Component ───────────────────────────────────────────────

export function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const fromQuery = searchParams.get('category');
    if (fromQuery) return fromQuery;
    if (pathname.startsWith('/category/')) {
      return pathname.replace('/category/', '').split('/')[0] || 'all';
    }
    return 'all';
  });

  // Keep category in sync with URL
  React.useEffect(() => {
    const fromQuery = searchParams.get('category');
    if (fromQuery) {
      setActiveCategory(fromQuery);
    } else if (pathname.startsWith('/category/')) {
      setActiveCategory(pathname.replace('/category/', '').split('/')[0] || 'all');
    } else {
      setActiveCategory('all');
    }
  }, [searchParams, pathname]);

  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync category changes with URL
  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    if (slug === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${slug}`);
    }
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setMaxPrice(5000);
    setSelectedWeights([]);
    setInStockOnly(true);
    setMinDiscount(null);
    setMinRating(null);
    setSortBy('popularity');
    setCurrentPage(1);
    router.push(pathname);
  };

  // Toggle weight checkbox
  const toggleWeight = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight],
    );
    setCurrentPage(1);
  };

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => {
      // Category filter
      if (activeCategory !== 'all') {
        const isGiftCat = (cat: string) =>
          cat === 'gift-boxes' || cat === 'gift-hampers' || cat === 'festive-offers' || cat === 'gift-packs' || cat === 'festive';

        const matchesCategory =
          p.category === activeCategory ||
          (isGiftCat(activeCategory) && isGiftCat(p.category)) ||
          (activeCategory === 'dry-fruit-mix' && (p.category === 'mixed-dry-fruits' || p.category === 'mix')) ||
          (activeCategory === 'mixed-dry-fruits' && (p.category === 'dry-fruit-mix' || p.category === 'mix'));
        if (!matchesCategory) {
          return false;
        }
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Price limit
      const defaultVar: WeightVariant =
        p.variants[p.defaultVariantIndex] ??
        p.variants[0] ?? { weight: '500g', price: 1000, mrp: 1200 };
      const currentPrice = defaultVar.price;
      if (currentPrice > maxPrice) {
        return false;
      }
      // Weight filter
      if (selectedWeights.length > 0) {
        const hasMatchingWeight = p.variants.some((v) => selectedWeights.includes(v.weight));
        if (!hasMatchingWeight) return false;
      }
      // Rating filter
      if (minRating !== null && p.rating < minRating) {
        return false;
      }
      // Discount filter
      if (minDiscount !== null) {
        const disc = Math.round(((defaultVar.mrp - defaultVar.price) / defaultVar.mrp) * 100);
        if (disc < minDiscount) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.variants[a.defaultVariantIndex]?.price ?? a.variants[0]?.price ?? 0;
      const priceB = b.variants[b.defaultVariantIndex]?.price ?? b.variants[0]?.price ?? 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return a.popularityRank - b.popularityRank; // Matches mockup 1-8 order
    });
  }, [activeCategory, inStockOnly, maxPrice, selectedWeights, minRating, minDiscount, sortBy]);

  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, validCurrentPage]);

  const startIndex = filteredProducts.length === 0 ? 0 : (validCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(validCurrentPage * ITEMS_PER_PAGE, filteredProducts.length);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === validCurrentPage) return;
    setCurrentPage(newPage);
    const toolbarEl = document.getElementById('products-grid-toolbar');
    if (toolbarEl) {
      toolbarEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Sidebar Filter Panel JSX
  const FilterSidebarContent = (
    <aside className="w-full space-y-6">
      {/* 1. Categories */}
      <div>
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-3">Categories</h3>
        <div className="space-y-1">
          {CATEGORY_ITEMS.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#B5712E] text-white font-bold shadow-2xs'
                    : 'text-gray-700 hover:bg-[#FAF8F5] hover:text-[#B5712E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border bg-white ${
                      isActive ? 'border-white/40' : 'border-amber-900/15'
                    }`}
                  >
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  </div>
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{cat.name}</span>
                </div>
                <span className={isActive ? 'text-white/95 text-[11px] font-semibold' : 'text-gray-400 text-[11px]'}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2">Price Range</h3>
        <div className="flex items-center justify-between text-xs text-gray-700 font-semibold mb-2">
          <span>₹ 0</span>
          <span>₹ {maxPrice === 5000 ? '5000+' : maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="200"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            background: `linear-gradient(to right, #B5712E 0%, #B5712E ${(maxPrice / 5000) * 100}%, #E8E1D5 ${(maxPrice / 5000) * 100}%, #E8E1D5 100%)`,
          }}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#B5712E]"
        />
      </div>

      {/* 3. Select Weight */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Select Weight</h3>
        <div className="space-y-2">
          {WEIGHT_OPTIONS.map((w) => {
            const checked = selectedWeights.includes(w.label);
            return (
              <label
                key={w.label}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleWeight(w.label)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <span>{w.label}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({w.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Availability */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
              />
              <span>In Stock</span>
            </div>
            <span className="text-gray-400 text-[11px]">(68)</span>
          </label>
          <label className="flex items-center justify-between text-xs text-gray-400 cursor-not-allowed">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled
                checked={false}
                className="w-3.5 h-3.5 rounded border-gray-200 text-gray-300 cursor-not-allowed"
              />
              <span>Out of Stock</span>
            </div>
            <span className="text-gray-400 text-[11px]">(0)</span>
          </label>
        </div>
      </div>

      {/* 5. Discount */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Discount</h3>
        <div className="space-y-2">
          {DISCOUNT_OPTIONS.map((d) => {
            const checked = minDiscount === d.min;
            return (
              <label
                key={d.label}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setMinDiscount(checked ? null : d.min)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <span>{d.label}</span>
                </div>
                <span className="text-gray-400 text-[11px]">({d.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Customer Rating */}
      <div className="pt-2 border-t border-gray-100">
        <h3 className="font-serif font-black text-sm text-[#1B1F2A] mb-2.5">Customer Rating</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((r) => {
            const checked = minRating === r.stars;
            return (
              <label
                key={r.stars}
                className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-[#B5712E]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setMinRating(checked ? null : r.stars)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#B5712E] focus:ring-[#B5712E] accent-[#B5712E]"
                  />
                  <div className="flex items-center gap-0.5 text-[#E5A93C]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        size={11}
                        filled={i < r.stars}
                        className={i < r.stars ? 'text-[#E5A93C]' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-[11px] text-gray-600 ml-1">&amp; above</span>
                  </div>
                </div>
                <span className="text-gray-400 text-[11px]">({r.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Clear Filters Button */}
      <div className="pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full bg-[#8E4A18] hover:bg-[#783D12] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer active:scale-98"
        >
          <RotateCcwIcon size={14} className="text-white" />
          <span>Clear Filters</span>
        </button>
      </div>
    </aside>
  );

  const isGiftActive =
    activeCategory === 'gift-boxes' ||
    activeCategory === 'gift-hampers' ||
    activeCategory === 'festive-offers' ||
    activeCategory === 'festive';

  const bannerTitle = isGiftActive
    ? 'Festive Gift Hampers & Offers'
    : activeCategory === 'all'
    ? 'Shop Dry Fruits'
    : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, ' ')}`;

  const bannerSubtitle = isGiftActive
    ? 'Handcrafted dry fruit hampers, royal wooden gift boxes, and festive celebration platters'
    : "Premium quality dry fruits from Old Delhi's historic mandi";

  const breadcrumbLabel = isGiftActive
    ? 'Gift Hampers & Festive Offers'
    : activeCategory === 'all'
    ? 'Dry Fruits'
    : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, ' ')}`;

  return (
    <div className="w-full pb-16">
      {/* ── 1. Full-Width Breadcrumb & Hero Banner matching the mockup ── */}
      <div className="w-full relative overflow-hidden min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex items-center bg-[#101924]">
        {/* Background Image */}
        <Image
          src={isGiftActive ? '/banner-festive.jpg' : '/hero-mandi-dark.jpg'}
          alt={bannerTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Left Dark Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />

        {/* Banner Content inside max-w-7xl */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 text-white space-y-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/80 font-medium tracking-wide">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/40">&gt;</span>
            <span className="text-[#E5A93C] font-semibold">{breadcrumbLabel}</span>
          </nav>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
            {bannerTitle}
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-sm sm:text-base text-[#E5A93C] drop-shadow-sm">
            {bannerSubtitle}
          </p>

          {/* 4 Value Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-white text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <WheatHarvestIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">100% Pure</p>
                <p className="text-[9px] text-white/70">No Adulteration</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <MandiArchIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Direct from Mandi</p>
                <p className="text-[9px] text-white/70">Best Prices</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <VarietyBoxesIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Wide Variety</p>
                <p className="text-[9px] text-white/70">100+ Products</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-[#E5A93C] flex items-center justify-center text-[#E5A93C] bg-black/40 flex-shrink-0">
                <DeliveryTruckIcon size={14} className="text-[#E5A93C]" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold">Pan India Delivery</p>
                <p className="text-[9px] text-white/70">Safe &amp; Fast</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Two-Column Layout (Sidebar + Grid) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar (260px) */}
          <div className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
            {FilterSidebarContent}
          </div>

          {/* Mobile Filter Drawer Overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative bg-white w-80 h-full overflow-y-auto p-6 shadow-2xl z-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                    <h3 className="font-bold text-base text-[#1B1F2A]">Filter Products</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>
                  {FilterSidebarContent}
                </div>
              </div>
            </div>
          )}

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0" id="products-grid-toolbar">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-xs font-bold border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 shadow-2xs cursor-pointer"
                >
                  <MenuIcon size={14} className="text-gray-700" />
                  <span>Filters</span>
                </button>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Showing {startIndex}–{endIndex} of {filteredProducts.length} products
                </p>
              </div>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold border border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#B5712E] outline-none bg-white text-gray-800 shadow-2xs cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid: 4 columns on large screens */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-2xs flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#C88C3C] mb-4">
                  <VarietyBoxesIcon size={32} />
                </div>
                <h3 className="font-bold text-base text-[#1B1F2A]">No products found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  We couldn&apos;t find any products matching your current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2 bg-[#8E4A18] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-[#783D12] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {paginatedProducts.map((prod) => (
                  <ProductCardItem key={prod.id} product={prod} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 pt-6">
                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  const isActive = validCurrentPage === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePageChange(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                        isActive
                          ? 'bg-[#8E4A18] text-white shadow-xs'
                          : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
