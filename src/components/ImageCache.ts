import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';

interface CachedImage {
  url: string;
  width: number;
  height: number;
  timestamp: number;
}

class ImageCache {
  private static cache = new Map<string, CachedImage>();
  private static CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  private static loadingPromises = new Map<string, Promise<CachedImage | null>>();
  private static maxConcurrentLoads = 4;
  private static currentLoads = 0;

  static async getImages(category: string): Promise<string[]> {
    try {
      const treatmentsRef = ref(database, `treatments/${category}/images`);
      const snapshot = await get(treatmentsRef);
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  }

  static async preloadImage(url: string): Promise<CachedImage | null> {
    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url) ?? null;
    }

    // Check cache first
    if (this.cache.has(url)) {
      const cached = this.cache.get(url)!;
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached;
      }
      this.cache.delete(url);
    }

    // Wait if too many concurrent loads
    while (this.currentLoads >= this.maxConcurrentLoads) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.currentLoads++;

    const loadPromise = new Promise<CachedImage | null>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const cached: CachedImage = {
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          timestamp: Date.now(),
        };
        this.cache.set(url, cached);
        this.currentLoads--;
        this.loadingPromises.delete(url);
        resolve(cached);
      };

      img.onerror = () => {
        this.currentLoads--;
        this.loadingPromises.delete(url);
        resolve(null);
      };

      img.src = url;
    });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  static async preloadImages(urls: string[]): Promise<void> {
    const chunks = this.chunkArray(urls, this.maxConcurrentLoads);
    
    for (const chunk of chunks) {
      await Promise.all(chunk.map(url => this.preloadImage(url)));
    }
  }

  static getCachedImage(url: string): CachedImage | null {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }
    return null;
  }

  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
    this.currentLoads = 0;
  }
}

export default ImageCache;