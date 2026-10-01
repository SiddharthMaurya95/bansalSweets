'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  catalogApi,
  cartApi,
  type ProductSummary,
  type ProductDetail,
  type CategorySummary,
  type CartData,
  type ListProductsParams,
  type Pagination,
  ApiRequestError,
} from '@/lib/api';

// ─── useProducts ──────────────────────────────────────────────────────────────

export interface UseProductsResult {
  products: ProductSummary[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(params: ListProductsParams = {}): UseProductsResult {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogApi.listProducts(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { products, pagination, loading, error, refetch: fetch };
}

// ─── useProduct ───────────────────────────────────────────────────────────────

export interface UseProductResult {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    catalogApi
      .getProduct(slug)
      .then((res) => setProduct(res.data))
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : 'Failed to load product'),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalogApi
      .listCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {
        /* silently fail – categories have SSR fallback */
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

// ─── useServerCart ────────────────────────────────────────────────────────────
// Synchronises the client-side CartContext with the server cart

export interface UseServerCartResult {
  serverCart: CartData | null;
  syncing: boolean;
  syncError: string | null;
  serverAddItem: (variantId: string, quantity: number) => Promise<void>;
  serverUpdateItem: (itemId: string, quantity: number) => Promise<void>;
  serverClearCart: () => Promise<void>;
  refetchCart: () => void;
}

export function useServerCart(): UseServerCartResult {
  const [serverCart, setServerCart] = useState<CartData | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const refetchCart = useCallback(() => {
    startTransition(() => {
      setSyncing(true);
      cartApi
        .getCart()
        .then((res) => setServerCart(res.data))
        .catch((err) =>
          setSyncError(err instanceof ApiRequestError ? err.message : 'Cart sync failed'),
        )
        .finally(() => setSyncing(false));
    });
  }, []);

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  const serverAddItem = useCallback(async (variantId: string, quantity: number) => {
    setSyncing(true);
    try {
      const res = await cartApi.addItem(variantId, quantity);
      setServerCart(res.data);
    } catch (err) {
      setSyncError(err instanceof ApiRequestError ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  const serverUpdateItem = useCallback(async (itemId: string, quantity: number) => {
    setSyncing(true);
    try {
      const res = await cartApi.updateItem(itemId, quantity);
      setServerCart(res.data);
    } catch (err) {
      setSyncError(err instanceof ApiRequestError ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setSyncing(false);
    }
  }, []);

  const serverClearCart = useCallback(async () => {
    setSyncing(true);
    try {
      await cartApi.clearCart();
      setServerCart((prev) =>
        prev ? { ...prev, items: [], subtotalPaise: 0, itemCount: 0 } : null,
      );
    } finally {
      setSyncing(false);
    }
  }, []);

  return {
    serverCart,
    syncing,
    syncError,
    serverAddItem,
    serverUpdateItem,
    serverClearCart,
    refetchCart,
  };
}
