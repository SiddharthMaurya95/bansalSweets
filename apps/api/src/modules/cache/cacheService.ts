interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private memoryStore: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtlSeconds: number;

  constructor(defaultTtlSeconds = 300) {
    this.defaultTtlSeconds = defaultTtlSeconds;
  }

  /**
   * Retrieve cached item if valid and not expired.
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryStore.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Store item with TTL in seconds.
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds ?? this.defaultTtlSeconds;
    this.memoryStore.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });
  }

  /**
   * Remove a single key.
   */
  async del(key: string): Promise<void> {
    this.memoryStore.delete(key);
  }

  /**
   * Invalidate all keys starting with prefix (e.g. 'catalog:').
   */
  async invalidatePrefix(prefix: string): Promise<number> {
    let count = 0;
    for (const key of this.memoryStore.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryStore.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Atomic get-or-compute pattern.
   */
  async getOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  /**
   * Clear all entries (for testing).
   */
  clear(): void {
    this.memoryStore.clear();
  }

  /**
   * Diagnostics & Health check.
   */
  getHealth(): { healthy: boolean; type: 'memory' | 'redis'; keyCount: number } {
    // Purge expired keys before reporting count
    const now = Date.now();
    for (const [k, v] of this.memoryStore.entries()) {
      if (now > v.expiresAt) {
        this.memoryStore.delete(k);
      }
    }

    return {
      healthy: true,
      type: 'memory',
      keyCount: this.memoryStore.size,
    };
  }
}

export const cacheService = new CacheService();
