import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),

  // Databases
  DATABASE_URL: z
    .string()
    .url()
    .default('postgres://postgres:postgres@localhost:5432/bansal_foods'),
  REDIS_CACHE_URL: z.string().url().default('redis://localhost:6379'),
  REDIS_QUEUE_URL: z.string().url().default('redis://localhost:6380'),

  // Secrets (at least 32 chars in production)
  JWT_ACCESS_SECRET: z.string().min(16).default('development_jwt_access_secret_min_32_chars_long!'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default('development_jwt_refresh_secret_min_32_chars_long!'),
  COOKIE_SECRET: z.string().min(16).default('development_cookie_secret_min_32_chars_long!'),
  CSRF_SECRET: z.string().min(16).default('development_csrf_secret_min_32_chars_long!'),

  // Payment Gateway
  RAZORPAY_KEY_ID: z.string().default('rzp_test___SET_ME__'),
  RAZORPAY_KEY_SECRET: z.string().default('__SET_ME__'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('__SET_ME__'),

  // Object Storage (S3 / MinIO)
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_REGION: z.string().default('ap-south-1'),
  S3_BUCKET: z.string().default('bansal-foods-media'),
  S3_ACCESS_KEY_ID: z.string().default('minioadmin'),
  S3_SECRET_ACCESS_KEY: z.string().default('minioadmin'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001'),

  // Observability
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function loadEnv(envSource: Record<string, unknown> = process.env): Env {
  if (cachedEnv && envSource === process.env) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(envSource);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Environment variable validation failed');
  }

  // Strict production check: prevent default secrets and placeholders
  if (result.data.NODE_ENV === 'production') {
    const placeholders = ['__SET_ME__', 'minioadmin', 'development_'];
    for (const [key, value] of Object.entries(result.data)) {
      if (typeof value === 'string' && placeholders.some((p) => value.includes(p))) {
        throw new Error(`Production environment contains insecure placeholder for key: ${key}`);
      }
    }
  }

  if (envSource === process.env) {
    cachedEnv = result.data;
  }
  return result.data;
}
