'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WishlistVariant {
  weight: string; // e.g. "100g" | "250g" | "500g" | "1kg"
  price: number;
  mrp: number;
  savingsText: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  discountBadge: string;
  rating: number;
  reviewCount: number;
  selectedWeight: string;
  variants: WishlistVariant[];
}

export const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    slug: 'kashmiri-mamra-almonds',
    imageUrl: '/product-almonds.jpg',
    discountBadge: '17% OFF',
    rating: 4.8,
    reviewCount: 320,
    selectedWeight: '1kg',
    variants: [
      { weight: '100g', price: 520, mrp: 650, savingsText: 'Save ₹130 (20%)' },
      { weight: '250g', price: 1250, mrp: 1550, savingsText: 'Save ₹300 (19%)' },
      { weight: '500g', price: 2450, mrp: 3000, savingsText: 'Save ₹550 (18%)' },
      { weight: '1kg', price: 4800, mrp: 5800, savingsText: 'Save ₹1,000 (17%)' },
    ],
  },
  {
    id: 'w320-premium-cashews',
    name: 'W320 Premium Cashews (Kaju)',
    slug: 'w320-premium-cashews',
    imageUrl: '/product-cashews.jpg',
    discountBadge: '20% OFF',
    rating: 4.7,
    reviewCount: 280,
    selectedWeight: '1kg',
    variants: [
      { weight: '100g', price: 135, mrp: 170, savingsText: 'Save ₹35 (21%)' },
      { weight: '250g', price: 320, mrp: 400, savingsText: 'Save ₹80 (20%)' },
      { weight: '500g', price: 620, mrp: 780, savingsText: 'Save ₹160 (21%)' },
      { weight: '1kg', price: 1200, mrp: 1500, savingsText: 'Save ₹300 (20%)' },
    ],
  },
  {
    id: 'iranian-green-pistachios',
    name: 'Iranian Green Pistachios (Pista)',
    slug: 'iranian-green-pistachios',
    imageUrl: '/product-pistachios.jpg',
    discountBadge: '19% OFF',
    rating: 4.8,
    reviewCount: 210,
    selectedWeight: '1kg',
    variants: [
      { weight: '100g', price: 210, mrp: 260, savingsText: 'Save ₹50 (19%)' },
      { weight: '250g', price: 500, mrp: 620, savingsText: 'Save ₹120 (19%)' },
      { weight: '500g', price: 980, mrp: 1200, savingsText: 'Save ₹220 (18%)' },
      { weight: '1kg', price: 1900, mrp: 2350, savingsText: 'Save ₹450 (19%)' },
    ],
  },
  {
    id: 'medjool-dates-khajur',
    name: 'Medjool Dates (Khajur Matjol)',
    slug: 'medjool-dates-khajur',
    imageUrl: '/product-dates.jpg',
    discountBadge: '20% OFF',
    rating: 4.7,
    reviewCount: 120,
    selectedWeight: '1kg',
    variants: [
      { weight: '100g', price: 155, mrp: 195, savingsText: 'Save ₹40 (21%)' },
      { weight: '250g', price: 370, mrp: 460, savingsText: 'Save ₹90 (20%)' },
      { weight: '500g', price: 720, mrp: 900, savingsText: 'Save ₹180 (20%)' },
      { weight: '1kg', price: 1400, mrp: 1750, savingsText: 'Save ₹350 (20%)' },
    ],
  },
];

interface WishlistContextType {
  items: WishlistItem[];
  removeItem: (id: string) => void;
  updateItemWeight: (id: string, weight: string) => void;
  clearWishlist: () => void;
  resetDemoItems: () => void;
  totalWishlistCount: number;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: Partial<WishlistItem> & { id: string; name: string }) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'bansal_wishlist_items_v3';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST_ITEMS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // fallback to initial
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isLoaded]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id && item.slug !== id));
  }, []);

  const updateItemWeight = useCallback((id: string, weight: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id || item.slug === id ? { ...item, selectedWeight: weight } : item)),
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const resetDemoItems = useCallback(() => {
    setItems(INITIAL_WISHLIST_ITEMS);
  }, []);

  const isWishlisted = useCallback(
    (id: string) => items.some((item) => item.id === id || item.slug === id),
    [items],
  );

  const toggleWishlist = useCallback(
    (item: Partial<WishlistItem> & { id: string; name: string }) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.id === item.id || i.slug === item.slug);
        if (exists) {
          return prev.filter((i) => i.id !== item.id && i.slug !== item.slug);
        }
        // Add new item with default variants
        const newItem: WishlistItem = {
          id: item.id,
          name: item.name,
          slug: item.slug || item.id,
          imageUrl: item.imageUrl || '/product-almonds.jpg',
          discountBadge: item.discountBadge || '15% OFF',
          rating: item.rating || 4.8,
          reviewCount: item.reviewCount || 150,
          selectedWeight: '500g',
          variants: item.variants || [
            { weight: '100g', price: 250, mrp: 300, savingsText: 'Save ₹50 (17%)' },
            { weight: '250g', price: 550, mrp: 650, savingsText: 'Save ₹100 (15%)' },
            { weight: '500g', price: 1050, mrp: 1250, savingsText: 'Save ₹200 (16%)' },
            { weight: '1kg', price: 2000, mrp: 2400, savingsText: 'Save ₹400 (17%)' },
          ],
        };
        return [...prev, newItem];
      });
    },
    [],
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        removeItem,
        updateItemWeight,
        clearWishlist,
        resetDemoItems,
        totalWishlistCount: items.length,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
