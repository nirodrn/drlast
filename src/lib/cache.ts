interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiry: number;
  }
  export class LocalCache {
    private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour
    static set<T>(key: string, data: T): void {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: this.CACHE_DURATION,
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    }
    static get<T>(key: string): T | null {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const cacheItem: CacheItem<T> = JSON.parse(item);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiry;
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      return cacheItem.data;
    }
  }