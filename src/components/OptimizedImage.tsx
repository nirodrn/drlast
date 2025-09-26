import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState, useEffect } from 'react';
import ImageCache from './ImageCache';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  priority?: boolean;
  placeholder?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  priority = false,
  placeholder,
}: OptimizedImageProps) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: width || 400, height: height || 400 });

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Check cache first
        const cached = ImageCache.getCachedImage(src);
        if (cached) {
          setOptimizedSrc(cached.url);
          setDimensions({ width: cached.width, height: cached.height });
          setLoading(false);
          onLoad?.();
          return;
        }

        // If not in cache, preload and cache
        const result = await ImageCache.preloadImage(src);
        if (result) {
          setOptimizedSrc(result.url);
          setDimensions({ width: result.width, height: result.height });
          setLoading(false);
          onLoad?.();
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    if (priority) {
      loadImage();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );

      const element = document.createElement('div');
      observer.observe(element);

      return () => observer.disconnect();
    }
  }, [src, priority, onLoad]);

  const placeholderSrc = placeholder || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${dimensions.width} ${dimensions.height}'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E`;

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${loading ? 'bg-gray-100 animate-pulse' : ''}`}>
      <LazyLoadImage
        src={optimizedSrc}
        alt={alt}
        effect="blur"
        className={className}
        width={dimensions.width}
        height={dimensions.height}
        threshold={100}
        beforeLoad={() => setLoading(true)}
        afterLoad={() => {
          setLoading(false);
          onLoad?.();
        }}
        placeholderSrc={placeholderSrc}
        wrapperClassName="w-full h-full"
      />
    </div>
  );
}