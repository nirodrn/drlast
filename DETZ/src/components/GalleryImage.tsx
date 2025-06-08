import React, { useEffect, useRef, memo } from "react";
import { Loader } from "lucide-react";
interface GalleryImageProps {
  src: string;
  alt: string;
  onLoad: (src: string) => void;
  isLoaded: boolean;
  observerRef: React.MutableRefObject<IntersectionObserver | null>;
  index: number;
}
export const GalleryImage = memo(
  ({ src, alt, onLoad, isLoaded, observerRef, index }: GalleryImageProps) => {
    const imgRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
      if (imgRef.current && observerRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    }, []);

    // Calculate a dynamic height for masonry effect
    const aspectRatio =
      index % 3 === 0
        ? "aspect-[3/4]"
        : index % 5 === 0
          ? "aspect-[4/5]"
          : "aspect-square";
    return (
      <div
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${aspectRatio} 
          transform transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:shadow-2xl`}
        style={{
          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
        }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader className="h-4 w-4 animate-spin text-indigo-600" />
          </div>
        )}
        <img
          ref={imgRef}
          data-src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 
            ${isLoaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm"}`}
          onLoad={() => onLoad(src)}
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 
          group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    );
  },
);
GalleryImage.displayName = "GalleryImage";
