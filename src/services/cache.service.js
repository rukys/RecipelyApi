import { LRUCache } from 'lru-cache';
import { config } from '../config/index.js';

class CacheService {
  constructor() {
    this.cache = new LRUCache({
      max: 500, // Max 500 cached items
      ttl: config.cacheTtlSeconds * 1000, // TTL in milliseconds
      allowStale: false,
      updateAgeOnGet: false
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttlMs) {
    if (ttlMs) {
      this.cache.set(key, value, { ttl: ttlMs });
    } else {
      this.cache.set(key, value);
    }
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  /**
   * Helper wrap function: Get from cache or compute & store
   */
  async remember(key, fetchFn, ttlMs) {
    if (this.has(key)) {
      return this.get(key);
    }
    const result = await fetchFn();
    if (result !== undefined && result !== null) {
      this.set(key, result, ttlMs);
    }
    return result;
  }
}

export const cacheService = new CacheService();
