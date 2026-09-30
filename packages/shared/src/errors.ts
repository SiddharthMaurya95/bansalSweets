/**
 * Standard Error Codes and Envelope as specified in Section 11.2 and 11.4
 */

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VERSION_CONFLICT: 'VERSION_CONFLICT',
  IDEMPOTENCY_KEY_REUSED: 'IDEMPOTENCY_KEY_REUSED',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
  PRICE_CHANGED: 'PRICE_CHANGED',
  COUPON_INVALID: 'COUPON_INVALID',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_LIMIT_REACHED: 'COUPON_LIMIT_REACHED',
  DELIVERY_NOT_AVAILABLE: 'DELIVERY_NOT_AVAILABLE',
  COD_NOT_AVAILABLE: 'COD_NOT_AVAILABLE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_VERIFICATION_FAILED: 'PAYMENT_VERIFICATION_FAILED',
  PAYMENT_GATEWAY_UNAVAILABLE: 'PAYMENT_GATEWAY_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type StandardErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface ErrorDetail {
  field?: string;
  issue: string;
  [key: string]: unknown;
}

export interface ApiSuccessEnvelope<T> {
  data: T;
  meta?: {
    requestId?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    nextCursor?: string | null;
  };
}

export interface ApiErrorEnvelope {
  error: {
    code: StandardErrorCode;
    message: string;
    details?: ErrorDetail[];
    requestId?: string;
  };
}

export class AppError extends Error {
  readonly code: StandardErrorCode;
  readonly statusCode: number;
  readonly details?: ErrorDetail[];

  constructor(
    code: StandardErrorCode,
    arg2: number | string,
    arg3?: string | number,
    details?: ErrorDetail[],
  ) {
    let msg: string;
    let status: number;

    if (typeof arg2 === 'number') {
      status = arg2;
      msg = typeof arg3 === 'string' ? arg3 : '';
    } else {
      msg = arg2;
      status = typeof arg3 === 'number' ? arg3 : 400;
    }

    super(msg);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: ErrorDetail[]) {
    super(ERROR_CODES.VALIDATION_ERROR, 422, message, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message = 'Authentication required',
    code: StandardErrorCode = ERROR_CODES.UNAUTHENTICATED,
  ) {
    super(code, 401, message);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Permission denied') {
    super(ERROR_CODES.FORBIDDEN, 403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(ERROR_CODES.NOT_FOUND, 404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string,
    code: StandardErrorCode = ERROR_CODES.CONFLICT,
    details?: ErrorDetail[],
  ) {
    super(code, 409, message, details);
    this.name = 'ConflictError';
  }
}

export class InsufficientStockError extends AppError {
  constructor(message = 'Insufficient stock for requested items', details?: ErrorDetail[]) {
    super(ERROR_CODES.INSUFFICIENT_STOCK, 409, message, details);
    this.name = 'InsufficientStockError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please slow down') {
    super(ERROR_CODES.RATE_LIMITED, 429, message);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message = 'External service unavailable',
    code: StandardErrorCode = ERROR_CODES.SERVICE_UNAVAILABLE,
  ) {
    super(code, 502, message);
    this.name = 'ExternalServiceError';
  }
}
