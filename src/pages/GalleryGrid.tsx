// src/pages/GalleryGrid.tsx

import { ImageIcon } from 'lucide-react';

export interface GalleryGridProps {
    images: string[];
    loadedImages: Set<string>;
    onImageClick: (image: string) => void;
    onImageLoad: (image: string) => void;
}

export function GalleryGrid({
    images,
    loadedImages,
    onImageClick,
    onImageLoad,
}: GalleryGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <div
                    key={image}
                    className={`group relative overflow-hidden rounded-xl bg-transparent cursor-pointer shadow-sm hover:shadow-md transition-shadow
            ${index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
          `}
                    onClick={() => onImageClick(image)}
                >
                    {/* Gradient overlay remains the same */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    {/* Loading spinner if the image is not yet loaded */}
                    {!loadedImages.has(image) ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
                        </div>
                    ) : null}

                    {/* Image container */}
                    <div className="w-full h-0 pb-[100%] relative">
                        <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
              ${loadedImages.has(image) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              group-hover:scale-110
            `}
                            loading="lazy"
                            onLoad={() => onImageLoad(image)}
                        />
                    </div>

                    {/* Hover effect with "View Image" text */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <div className="flex items-center justify-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-sm shadow-lg">
                                <ImageIcon className="w-4 h-4" />
                                View Image
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

