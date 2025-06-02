import { useEffect, useState, useCallback } from 'react';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { GalleryGrid } from './GalleryGrid';
import { GalleryModal } from './GalleryModal';
import { ChevronDown, ImageIcon } from 'lucide-react';
import ImageCache from '../components/ImageCache';

interface TreatmentGallery {
  images: string[];
}

export default function Gallery() {
    const [categories, setCategories] = useState<string[]>([]);
    const [galleryData, setGalleryData] = useState<Record<string, TreatmentGallery>>({});
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<number>(6);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const treatmentsRef = ref(database, 'treatments');
                const snapshot = await get(treatmentsRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setGalleryData(data);
                    setCategories(Object.keys(data));

                    // Start preloading images in the background
                    const allImages = Object.values(data).flatMap(
                        (treatment: any) => treatment.images || []
                    );

                    // Preload first batch immediately
                    const firstBatch = allImages.slice(0, 8);
                    await ImageCache.preloadImages(firstBatch);
                    setLoadedImages(new Set(firstBatch));

                    // Preload remaining images in chunks
                    const remainingImages = allImages.slice(8);
                    for (let i = 0; i < remainingImages.length; i += 4) {
                        const chunk = remainingImages.slice(i, i + 4);
                        await ImageCache.preloadImages(chunk);
                        setLoadedImages(prev => new Set([...prev, ...chunk]));
                    }
                }
            } catch (error) {
                console.error('Error fetching gallery data:', error);
            }
        };

        fetchGalleryData();
    }, []);

    const loadMore = () => {
        const newVisibleCount = Math.min(visibleCategories + 6, categories.length);
        setVisibleCategories(newVisibleCount);
    };

    const filteredCategories = activeFilter
        ? categories.filter((cat) => cat === activeFilter)
        : categories;

    const handleImageClick = useCallback((image: string, category: string) => {
        setSelectedImage(image);
        setSelectedCategory(category);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedImage(null);
        setSelectedCategory(null);
    }, []);

    const handleNavigate = useCallback(
        (image: string) => {
            setSelectedImage(image);
        },
        []
    );

    const handleImageLoad = (image: string) => {
        setLoadedImages(prev => new Set(prev).add(image));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="relative h-[40vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-indigo-500/90" />
                <div className="absolute inset-0">
                    <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118')] bg-cover bg-center opacity-20" />
                </div>
                <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
                        Treatment Gallery
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl text-center">
                        Explore our collection of transformative aesthetic treatments
                    </p>
                </div>
            </div>
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                activeFilter === null
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Treatments
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeFilter === category
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid gap-12">
                    {filteredCategories.slice(0, visibleCategories).map((category) => (
                        <div key={category} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {category}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <ImageIcon className="w-5 h-5" />
                                    <span>{galleryData[category]?.images?.length || 0} images</span>
                                </div>
                            </div>
                            <GalleryGrid
                                images={galleryData[category]?.images || []}
                                loadedImages={loadedImages}
                                onImageClick={(image) => handleImageClick(image, category)}
                                onImageLoad={handleImageLoad}
                            />
                        </div>
                    ))}
                </div>
                {visibleCategories < filteredCategories.length && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={loadMore}
                            className="group relative px-8 py-4 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 shadow-md"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Load More
                                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                )}
            </div>
            {selectedImage && selectedCategory && (
                <GalleryModal
                    images={galleryData[selectedCategory]?.images || []}
                    currentImage={selectedImage}
                    treatmentName={selectedCategory}
                    onClose={handleCloseModal}
                    onNavigate={handleNavigate}
                />
            )}
        </div>
    );
}