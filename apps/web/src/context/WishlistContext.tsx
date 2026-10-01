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
    discountBadge: '20% OFF',
    rating: 4.8,
    reviewCount: 320,
    selectedWeight: '500g',
    variants: [
      { weight: '100g', price: 280, mrp: 350, savingsText: 'Save ₹70 (20%)' },
      { weight: '250g', price: 650, mrp: 800, savingsText: 'Save ₹150 (19%)' },
      { weight: '500g', price: 1200, mrp: 1500, savingsText: 'Save ₹300 (20%)' },
      { weight: '1kg', price: 2300, mrp: 2850, savingsText: 'Save ₹550 (19%)' },
    ],
  },
  {
    id: 'w320-premium-cashews',
    name: 'W320 Premium Cashews',
    slug: 'w320-premium-cashews',
    imageUrl: '/product-cashews.jpg',
    discountBadge: '10% OFF',
    rating: 4.7,
    reviewCount: 280,
    selectedWeight: '500g',
    variants: [
      { weight: '100g', price: 180, mrp: 200, savingsText: 'Save ₹20 (10%)' },
      { weight: '250g', price: 420, mrp: 470, savingsText: 'Save ₹50 (11%)' },
      { weight: '500g', price: 780, mrp: 870, savingsText: 'Save ₹90 (10%)' },
      { weight: '1kg', price: 1500, mrp: 1680, savingsText: 'Save ₹180 (11%)' },
    ],
  },
  {
    id: 'iranian-green-pistachios',
    name: 'Iranian Green Pistachios',
    slug: 'iranian-green-pistachios',
    imageUrl: '/product-pistachios.jpg',
    discountBadge: '18% OFF',
    rating: 4.8,
    reviewCount: 210,
    selectedWeight: '500g',
    variants: [
      { weight: '100g', price: 350, mrp: 430, savingsText: 'Save ₹80 (19%)' },
      { weight: '250g', price: 820, mrp: 1000, savingsText: 'Save ₹180 (18%)' },
      { weight: '500g', price: 1550, mrp: 1900, savingsText: 'Save ₹350 (18%)' },
      { weight: '1kg', price: 2950, mrp: 3600, savingsText: 'Save ₹650 (18%)' },
    ],
  },
  {
    id: 'ajwa-premium-dates',
    name: 'Ajwa Premium Dates',
    slug: 'ajwa-premium-dates',
    imageUrl: '/product-dates.jpg',
    discountBadge: '15% OFF',
    rating: 4.7,
    reviewCount: 120,
    selectedWeight: '500g',
    variants: [
      { weight: '100g', price: 200, mrp: 235, savingsText: 'Save ₹35 (15%)' },
      { weight: '250g', price: 450, mrp: 530, savingsText: 'Save ₹80 (15%)' },
      { weight: '500g', price: 850, mrp: 1000, savingsText: 'Save ₹150 (15%)' },
      { weight: '1kg', price: 1600, mrp: 1900, savingsText: 'Save ₹300 (16%)' },
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

const STORAGE_KEY = 'bansal_wishlist_items_v2';

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
