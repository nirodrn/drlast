// src/pages/GalleryModal.tsx
import  { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface GalleryModalProps {
    images: string[];
    currentImage: string;
    treatmentName: string;
    onClose: () => void;
    onNavigate: (image: string) => void;
}

export function GalleryModal({
    images,
    currentImage,
    treatmentName,
    onClose,
    onNavigate,
}: GalleryModalProps) {
    const currentIndex = images.indexOf(currentImage);
    const [isLoading, setIsLoading] = useState(true);
    const [containerSize, setContainerSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setContainerSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsLoading(true); // Set loading to true when currentImage changes
        const img = new Image();
        img.src = currentImage;
        img.onload = () => setIsLoading(false);
        img.onerror = () => {
            console.error("Failed to load image:", currentImage);
            setIsLoading(false);
        };
    }, [currentImage]);

    const navigate = useCallback(
        (direction: 'prev' | 'next') => {
            const newIndex =
                direction === 'prev'
                    ? (currentIndex - 1 + images.length) % images.length
                    : (currentIndex + 1) % images.length;
            if (newIndex >= 0 && newIndex < images.length) { // added check
                onNavigate(images[newIndex]);
            }
        },
        [currentIndex, images, onNavigate]
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                navigate('prev');
            } else if (e.key === 'ArrowRight') {
                navigate('next');
            }
        },
        [onClose, navigate]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="absolute top-4 right-4">
                <button
                    onClick={onClose}
                    className="text-white bg-transparent hover:bg-white hover:text-black rounded-full p-2"

                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div
                className="relative h-full flex items-center justify-center p-4"

            >
                <div
                    className="relative w-full h-full flex items-center justify-center"

                >
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}

                    <img
                        src={currentImage}
                        alt={`${treatmentName} treatment`}
                        className={`
              max-w-full max-h-full
              transition-opacity duration-300
              ${isLoading ? 'opacity-0' : 'opacity-100'}
              object-contain
            `}
                        style={{
                            width: containerSize.width * 0.9,
                            height: containerSize.height * 0.85,
                            objectFit: 'contain',
                        }}

                    />

                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent modal from closing
                            navigate('prev');
                        }}
                        disabled={isLoading}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent modal from closing
                            navigate('next');
                        }}
                        disabled={isLoading}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
}
