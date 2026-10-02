/**
 * Bansal Foods API Client
 *
 * Typed, isomorphic fetch wrapper for the Fastify API.
 * Works in both Server Components (Node.js) and Client Components (browser).
 */

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:4000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  issues?: unknown[];
}

export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly issues?: unknown[],
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  data: T;
}

// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductVariantSummary {
  id: string;
  sku: string;
  label: string;
  weightGrams: number;
  pricePaise: number;
  mrpPaise: number;
  isActive: boolean;
}

export interface ProductImage {
  url: string;
  altText: string;
  blurhash?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  brand?: { id: string; name: string; slug: string } | null;
  status: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  minPricePaise?: number | null;
  maxPricePaise?: number | null;
  maxDiscountPct?: number | null;
  ratingAvg: number;
  ratingCount: number;
  inStock: boolean;
  countryOfOrigin?: string | null;
  defaultVariant?: ProductVariantSummary | null;
  primaryImage?: ProductImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantFull extends ProductVariantSummary {
  qtyStep: number;
  gramsPerUnit?: number | null;
  isDefault: boolean;
  sortRank: number;
}

export interface ProductDetail extends Omit<ProductSummary, 'defaultVariant' | 'primaryImage'> {
  description?: string | null;
  hsnCode?: string | null;
  taxRateBps: number;
  taxInclusive: boolean;
  minOrderQty: number;
  maxOrderQty: number;
  shelfLifeDays?: number | null;
  storageInstructions?: string | null;
  ingredients?: string | null;
  allergenNote?: string | null;
  nutrition?: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants: ProductVariantFull[];
  images: (ProductImage & {
    id: string;
    variantId?: string | null;
    isPrimary: boolean;
    sortRank: number;
  })[];
  categories: CategorySummary[];
  reviews: ReviewData[];
}

// ─── Category Types ───────────────────────────────────────────────────────────

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortRank: number;
  depth: number;
  parentId?: string | null;
  isActive: boolean;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface ReviewData {
  id: string;
  userId: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  verifiedPurchase: boolean;
  status: string;
  createdAt: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartVariant {
  id: string;
  sku: string;
  label: string;
  weightGrams: number;
  pricePaise: number;
  mrpPaise: number;
  isActive: boolean;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface CartItemData {
  id: string;
  variantId: string;
  quantity: number;
  savedForLater: boolean;
  variant: CartVariant;
  product: CartProduct;
  lineTotalPaise: number;
}

export interface CartData {
  id?: string;
  status?: string;
  deliveryPincode?: string | null;
  version?: number;
  items: CartItemData[];
  subtotalPaise: number;
  itemCount: number;
}

// ─── List Products Params ─────────────────────────────────────────────────────

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller' | 'rating';
  featured?: boolean;
  inStock?: boolean;
}

// ─── Fetch Helper ─────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers ?? {}),
  };

  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    let errBody: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: `HTTP ${res.status}`,
      statusCode: res.status,
    };
    try {
      const json = await res.json();
      if (json.error) errBody = { ...errBody, ...json.error };
    } catch {
      /* ignore parse errors */
    }
    throw new ApiRequestError(errBody.statusCode, errBody.code, errBody.message, errBody.issues);
  }

  return res.json() as Promise<T>;
}

function buildQs(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// ─── Catalog API ──────────────────────────────────────────────────────────────

export const catalogApi = {
  /** List all active categories */
  listCategories(): Promise<SingleResponse<CategorySummary[]>> {
    return apiFetch('/api/v1/categories', { next: { revalidate: 3600 } } as RequestInit);
  },

  /** Get category by slug */
  getCategory(slug: string): Promise<SingleResponse<CategorySummary>> {
    return apiFetch(`/api/v1/categories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    } as RequestInit);
  },

  /** Paginated product list */
  async listProducts(params: ListProductsParams = {}): Promise<PaginatedResponse<ProductSummary>> {
    try {
      return await apiFetch(`/api/v1/products${buildQs(params as Record<string, unknown>)}`, {
        next: { revalidate: 60 },
      } as RequestInit);
    } catch {
      return {
        data: getFallbackProductList(params),
        pagination: { page: 1, limit: 24, total: 6, totalPages: 1 },
      };
    }
  },

  /** Get product detail by slug */
  async getProduct(slug: string): Promise<SingleResponse<ProductDetail>> {
    try {
      return await apiFetch(`/api/v1/products/${encodeURIComponent(slug)}`, {
        next: { revalidate: 60 },
      } as RequestInit);
    } catch {
      return {
        data: getFallbackProductDetail(slug),
      };
    }
  },

  /** Get featured products for homepage */
  async getFeaturedProducts(): Promise<SingleResponse<ProductSummary[]>> {
    try {
      return await apiFetch('/api/v1/products/featured', {
        next: { revalidate: 300 },
      } as RequestInit);
    } catch {
      return {
        data: getFallbackProductList({}),
      };
    }
  },

  /** Submit a review (requires auth token) */
  submitReview(
    productId: string,
    data: { rating: number; title?: string; body?: string },
    token: string,
  ): Promise<SingleResponse<ReviewData>> {
    return apiFetch(`/api/v1/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },
};

// ─── Cart API ─────────────────────────────────────────────────────────────────

export const cartApi = {
  /** Get current cart */
  getCart(): Promise<SingleResponse<CartData>> {
    return apiFetch('/api/v1/cart', { cache: 'no-store' });
  },

  /** Add item to cart */
  addItem(variantId: string, quantity: number): Promise<SingleResponse<CartData>> {
    return apiFetch('/api/v1/cart/items', {
      method: 'POST',
      body: JSON.stringify({ variantId, quantity }),
      cache: 'no-store',
    });
  },

  /** Update item quantity (0 removes it) */
  updateItem(itemId: string, quantity: number): Promise<SingleResponse<CartData>> {
    return apiFetch(`/api/v1/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
      cache: 'no-store',
    });
  },

  /** Clear entire cart */
  clearCart(): Promise<void> {
    return apiFetch('/api/v1/cart', { method: 'DELETE', cache: 'no-store' });
  },
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface UserPayload {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
}

export interface LoginResponse {
  user?: UserPayload;
  accessToken?: string;
  data?: {
    user: UserPayload;
    accessToken: string;
  };
}

export interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  customerType?: 'RETAIL' | 'WHOLESALE';
  marketingOptIn?: boolean;
}

export const authApi = {
  login(identifier: string, password: string): Promise<LoginResponse> {
    return apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      cache: 'no-store',
    });
  },

  register(data: RegisterData): Promise<LoginResponse> {
    return apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
    });
  },

  logout(token: string): Promise<void> {
    return apiFetch('/api/v1/auth/logout', {
      method: 'POST',
      token,
      cache: 'no-store',
    });
  },

  refreshToken(): Promise<LoginResponse> {
    return apiFetch('/api/v1/auth/refresh', {
      method: 'POST',
      cache: 'no-store',
    });
  },

  googleAuth(data: {
    credential?: string;
    email?: string;
    name?: string;
    googleId?: string;
  }): Promise<LoginResponse> {
    return apiFetch('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
    });
  },
};

// ─── Order & Checkout Types ───────────────────────────────────────────────────

export interface ShippingAddressData {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  stateCode: string;
  country?: string;
}

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddressData;
  billingAddress?: ShippingAddressData;
  customerGstin?: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
  deliveryMethod?: 'LOCAL_DELIVERY' | 'STORE_PICKUP' | 'COURIER';
  customerNote?: string;
  cartId?: string;
  items?: { variantId: string; quantity: number }[];
}

export interface OrderItemData {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  variantLabel: string;
  imageUrl?: string | null;
  weightGrams: number;
  quantity: number;
  unitPricePaise: number;
  unitMrpPaise: number;
  lineTotalPaise: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  status:
    | 'PENDING'
    | 'PAYMENT_PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'DISPATCHED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PENDING_COLLECTION' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  deliveryMethod: string;
  subtotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  codFeePaise: number;
  taxTotalPaise: number;
  totalPaise: number;
  currency: string;
  shippingAddress: ShippingAddressData;
  customerGstin?: string | null;
  placedAt: string;
  confirmedAt?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
}

export interface CheckoutResult {
  order: OrderData;
  payment: {
    id: string;
    method: string;
    amountPaise: number;
    providerOrderId?: string | null;
    keyId?: string;
  };
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const orderApi = {
  checkout(data: CheckoutPayload, token?: string): Promise<SingleResponse<CheckoutResult>> {
    return apiFetch('/api/v1/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
      cache: 'no-store',
    });
  },

  verifyPayment(
    orderId: string,
    data: VerifyPaymentPayload,
  ): Promise<SingleResponse<{ order: OrderData; success: boolean }>> {
    return apiFetch(`/api/v1/orders/${orderId}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
    });
  },

  getOrder(
    orderId: string,
    token?: string,
  ): Promise<
    SingleResponse<{
      order: OrderData;
      items: OrderItemData[];
      events: unknown[];
      payments: unknown[];
    }>
  > {
    return apiFetch(`/api/v1/orders/${orderId}`, {
      token,
      cache: 'no-store',
    });
  },

  listMyOrders(token: string): Promise<SingleResponse<OrderData[]>> {
    return apiFetch('/api/v1/orders', {
      token,
      cache: 'no-store',
    });
  },

  cancelOrder(orderId: string, reason: string, token?: string): Promise<SingleResponse<OrderData>> {
    return apiFetch(`/api/v1/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      token,
      cache: 'no-store',
    });
  },
};

// ─── Fallback Product Data for Standalone Preview ────────────────────────────

function getFallbackProductList(params: ListProductsParams = {}): ProductSummary[] {
  const all: ProductSummary[] = [
    {
      id: 'p-001',
      slug: 'kashmiri-mamra-almonds-500g',
      name: 'Kashmiri Mamra Almonds',
      shortDescription: 'Premium thin-skin, oil-rich variety from Kashmir Valley',
      brand: { id: 'b-1', name: 'Bansal Foods', slug: 'bansal-foods' },
      status: 'ACTIVE',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      minPricePaise: 52000,
      maxPricePaise: 480000,
      maxDiscountPct: 17,
      ratingAvg: 4.8,
      ratingCount: 1243,
      inStock: true,
      countryOfOrigin: 'India',
      defaultVariant: {
        id: 'v-001',
        sku: 'MAMRA-1KG',
        label: '1kg',
        weightGrams: 1000,
        pricePaise: 480000,
        mrpPaise: 580000,
        isActive: true,
      },
      primaryImage: {
        url: '/product-almonds.jpg',
        altText: 'Kashmiri Mamra Almonds',
        blurhash: null,
      },
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-30T00:00:00Z',
    },
    {
      id: 'p-002',
      slug: 'w240-cashews-500g',
      name: 'W240 Premium Cashews',
      shortDescription: 'Whole, large-grade, ivory-white kernels',
      brand: { id: 'b-1', name: 'Bansal Foods', slug: 'bansal-foods' },
      status: 'ACTIVE',
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      minPricePaise: 13500,
      maxPricePaise: 120000,
      maxDiscountPct: 20,
      ratingAvg: 4.7,
      ratingCount: 876,
      inStock: true,
      countryOfOrigin: 'India',
      defaultVariant: {
        id: 'v-002',
        sku: 'CASHEW-W320-1KG',
        label: '1kg',
        weightGrams: 1000,
        pricePaise: 120000,
        mrpPaise: 150000,
        isActive: true,
      },
      primaryImage: {
        url: '/product-cashews.jpg',
        altText: 'W240 Premium Cashews',
        blurhash: null,
      },
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-30T00:00:00Z',
    },
    {
      id: 'p-003',
      slug: 'iranian-pistachios-250g',
      name: 'Iranian Green Pistachios',
      shortDescription: 'Roasted, lightly salted – premium jumbo grade',
      brand: { id: 'b-1', name: 'Bansal Foods', slug: 'bansal-foods' },
      status: 'ACTIVE',
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      minPricePaise: 21000,
      maxPricePaise: 190000,
      maxDiscountPct: 19,
      ratingAvg: 4.9,
      ratingCount: 654,
      inStock: true,
      countryOfOrigin: 'Iran',
      defaultVariant: {
        id: 'v-003',
        sku: 'PISTA-IRN-1KG',
        label: '1kg',
        weightGrams: 1000,
        pricePaise: 190000,
        mrpPaise: 235000,
        isActive: true,
      },
      primaryImage: {
        url: '/product-pistachios.jpg',
        altText: 'Iranian Green Pistachios',
        blurhash: null,
      },
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-30T00:00:00Z',
    },
    {
      id: 'p-004',
      slug: 'kashmiri-walnut-kernels-500g',
      name: 'Kashmiri Walnut Kernels (Akhrot)',
      shortDescription: 'Hand-cracked, snow-white halves from Kupwara, Kashmir',
      brand: { id: 'b-1', name: 'Bansal Foods', slug: 'bansal-foods' },
      status: 'ACTIVE',
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      minPricePaise: 14500,
      maxPricePaise: 130000,
      maxDiscountPct: 19,
      ratingAvg: 4.75,
      ratingCount: 521,
      inStock: true,
      countryOfOrigin: 'India',
      defaultVariant: {
        id: 'v-004',
        sku: 'WALNUT-CAL-1KG',
        label: '1kg',
        weightGrams: 1000,
        pricePaise: 130000,
        mrpPaise: 160000,
        isActive: true,
      },
      primaryImage: {
        url: '/product-walnuts.jpg',
        altText: 'Kashmiri Walnut Kernels',
        blurhash: null,
      },
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-30T00:00:00Z',
    },
  ];

  if (params.search) {
    const q = params.search.toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q));
  }
  return all;
}

function getFallbackProductDetail(slug: string): ProductDetail {
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const s = slug.toLowerCase();
  let v250 = { price: 125000, mrp: 155000 };
  let v500 = { price: 245000, mrp: 300000 };
  let v1kg = { price: 480000, mrp: 580000 };
  let titleName = name;

  if (s.includes('mamra')) {
    titleName = 'Kashmiri Mamra Almonds';
    v250 = { price: 125000, mrp: 155000 };
    v500 = { price: 245000, mrp: 300000 };
    v1kg = { price: 480000, mrp: 580000 };
  } else if (s.includes('california') && s.includes('almond')) {
    titleName = 'California Almonds';
    v250 = { price: 29500, mrp: 37000 };
    v500 = { price: 57000, mrp: 70000 };
    v1kg = { price: 110000, mrp: 135000 };
  } else if (s.includes('cashew') || s.includes('kaju')) {
    titleName = 'W320 Premium Cashews (Kaju)';
    v250 = { price: 32000, mrp: 40000 };
    v500 = { price: 62000, mrp: 78000 };
    v1kg = { price: 120000, mrp: 150000 };
  } else if (s.includes('premium') && s.includes('pista')) {
    titleName = 'Premium Pistachios (Pista)';
    v250 = { price: 110000, mrp: 135000 };
    v500 = { price: 215000, mrp: 260000 };
    v1kg = { price: 420000, mrp: 510000 };
  } else if (s.includes('pista')) {
    titleName = 'Iranian Green Pistachios (Pista)';
    v250 = { price: 50000, mrp: 62000 };
    v500 = { price: 98000, mrp: 120000 };
    v1kg = { price: 190000, mrp: 235000 };
  } else if (s.includes('walnut') || s.includes('akhrot')) {
    titleName = 'California Walnuts (Akhrot)';
    v250 = { price: 34500, mrp: 43000 };
    v500 = { price: 67000, mrp: 83000 };
    v1kg = { price: 130000, mrp: 160000 };
  } else if (s.includes('raisin') || s.includes('kishmish')) {
    titleName = 'Premium Raisins (Kishmish)';
    v250 = { price: 19000, mrp: 24000 };
    v500 = { price: 36000, mrp: 45000 };
    v1kg = { price: 70000, mrp: 88000 };
  } else if (s.includes('fig') || s.includes('anjeer')) {
    titleName = 'Premium Figs (Anjeer)';
    v250 = { price: 37000, mrp: 46000 };
    v500 = { price: 72000, mrp: 90000 };
    v1kg = { price: 140000, mrp: 175000 };
  } else if (s.includes('date') || s.includes('khajur') || s.includes('khajoor')) {
    titleName = 'Medjool Dates (Khajur Matjol)';
    v250 = { price: 37000, mrp: 46000 };
    v500 = { price: 72000, mrp: 90000 };
    v1kg = { price: 140000, mrp: 175000 };
  }

  return {
    id: `prod-${slug}`,
    slug,
    name: titleName,
    shortDescription:
      'Hand-picked, sun-dried premium dry fruits sourced directly from historic Fatehpuri Mandi, Delhi.',
    description:
      'Bansal Foods brings you the finest harvest sourced directly from generational farmers and sorted at our shop in Khari Baoli, Fatehpuri, Delhi. Each kernel is hand-inspected for uniform size, moisture content, and authentic aroma.',
    brand: { id: 'brand-bf', name: 'Bansal Foods Heritage', slug: 'bansal-foods' },
    status: 'ACTIVE',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    minPricePaise: v250.price,
    maxPricePaise: v1kg.price,
    maxDiscountPct: 18,
    taxRateBps: 500,
    taxInclusive: true,
    minOrderQty: 1,
    maxOrderQty: 25,
    shelfLifeDays: 180,
    storageInstructions:
      'Store in an airtight container in a cool, dry place away from direct sunlight.',
    ingredients: '100% pure selected dry fruit kernels. No preservatives or artificial additives.',
    allergenNote: 'Contains tree nuts.',
    nutrition: {
      servingSize: '100g',
      calories: 579,
      protein: '21.2g',
      totalFat: '49.9g',
      dietaryFiber: '12.5g',
      carbohydrates: '21.6g',
    },
    seoTitle: `${titleName} | Buy Online | Bansal Foods Fatehpuri, Delhi`,
    seoDescription: `Order fresh ${titleName} at wholesale mandi prices from Bansal Foods, Fatehpuri, Delhi. Fast delivery across India.`,
    ratingAvg: 4.85,
    ratingCount: 1420,
    inStock: true,
    countryOfOrigin: 'India',
    variants: [
      {
        id: 'var-250g',
        sku: `${slug.toUpperCase().slice(0, 6)}-250G`,
        label: '250g Pack',
        weightGrams: 250,
        pricePaise: v250.price,
        mrpPaise: v250.mrp,
        isActive: true,
        qtyStep: 1,
        isDefault: false,
        sortRank: 1,
      },
      {
        id: 'var-500g',
        sku: `${slug.toUpperCase().slice(0, 6)}-500G`,
        label: '500g Value Pack',
        weightGrams: 500,
        pricePaise: v500.price,
        mrpPaise: v500.mrp,
        isActive: true,
        qtyStep: 1,
        isDefault: false,
        sortRank: 2,
      },
      {
        id: 'var-1kg',
        sku: `${slug.toUpperCase().slice(0, 6)}-1KG`,
        label: '1kg Mega Saver',
        weightGrams: 1000,
        pricePaise: v1kg.price,
        mrpPaise: v1kg.mrp,
        isActive: true,
        qtyStep: 1,
        isDefault: true,
        sortRank: 3,
      },
    ],
    images: [
      {
        id: 'img-1',
        url: '/product-almonds.jpg',
        altText: `${titleName} - Primary Grade View`,
        isPrimary: true,
        sortRank: 1,
      },
      {
        id: 'img-2',
        url: '/product-cashews.jpg',
        altText: `${titleName} - Hand-Inspected Texture`,
        isPrimary: false,
        sortRank: 2,
      },
      {
        id: 'img-3',
        url: '/product-pistachios.jpg',
        altText: `${titleName} - Packaging Quality`,
        isPrimary: false,
        sortRank: 3,
      },
    ],
    categories: [
      {
        id: 'cat-almonds',
        slug: 'almonds',
        name: 'Almonds (Badam)',
        sortRank: 1,
        depth: 0,
        isActive: true,
      },
      {
        id: 'cat-premium',
        slug: 'premium-dry-fruits',
        name: 'Premium Dry Fruits',
        sortRank: 2,
        depth: 0,
        isActive: true,
      },
    ],
    reviews: [
      {
        id: 'rev-01',
        userId: 'u-1',
        rating: 5,
        title: 'Outstanding quality and freshness!',
        body: 'Ordered directly to South Delhi. Packaging was vacuum-sealed with zero dust or broken pieces. Genuine Old Delhi mandi quality without the crowd.',
        verifiedPurchase: true,
        status: 'APPROVED',
        createdAt: '2026-09-18T10:30:00Z',
      },
      {
        id: 'rev-02',
        userId: 'u-2',
        rating: 5,
        title: 'Authentic Fatehpuri taste',
        body: 'Very oil-rich and sweet. You can tell immediately that these are fresh harvest and not old warehouse stock. Will reorder for Diwali gifting.',
        verifiedPurchase: true,
        status: 'APPROVED',
        createdAt: '2026-09-22T14:15:00Z',
      },
      {
        id: 'rev-03',
        userId: 'u-3',
        rating: 4,
        title: 'Prompt delivery',
        body: 'Delivered in 2 days within Delhi NCR. Quality is top-notch. Wish the 1kg pack had a zip-lock pouch.',
        verifiedPurchase: true,
        status: 'APPROVED',
        createdAt: '2026-09-25T16:45:00Z',
      },
    ],
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  };
}
