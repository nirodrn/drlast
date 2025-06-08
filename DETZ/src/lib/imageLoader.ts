export class ImagePreloader {
  /**
   * Preloads a single image.
   * @param src - The source URL of the image.
   * @returns A promise that resolves when the image is loaded or fails gracefully.
   */
  static preloadImage(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve(true);
      };
      
      img.onerror = (error) => {
        console.warn(`Failed to preload image: ${src}`, error);
        resolve(false);
      };
      
      img.src = src;
    });
  }

  /**
   * Preloads all images concurrently for faster loading.
   * @param images - An array of image URLs to preload.
   * @returns A promise that resolves when all images are processed.
   */
  static async preloadImages(images: string[]): Promise<void> {
    try {
      const results = await Promise.all(images.map((src) => this.preloadImage(src)));
      
      const successCount = results.filter(Boolean).length;
      const failureCount = results.length - successCount;
      
      if (failureCount > 0) {
        console.info(`Image preloading complete. Successfully loaded: ${successCount}, Failed: ${failureCount}`);
      }
    } catch (error) {
      console.error('Unexpected error during image preloading:', error);
    }
  }
}