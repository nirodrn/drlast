import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
// import { cn } from "@/lib/utils" // Utility for combining class names - REMOVED

interface Treatment {
    name: string;
    pageName: string;
}

interface TreatmentData {
    treatmentName: string;
    tagline: string;
}

interface TreatmentImages {
    images: string[];
}

// Simple utility function (inlined)
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function CosmeticServices() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [treatmentDetails, setTreatmentDetails] = useState<Record<string, TreatmentData>>({});
    const [treatmentImages, setTreatmentImages] = useState<Record<string, TreatmentImages>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                // Fetch treatments catalog
                const treatmentsRef = ref(database, 'treatmentscato');
                const treatmentsSnapshot = await get(treatmentsRef);
                if (treatmentsSnapshot.exists()) {
                    const treatmentsData = Object.values(treatmentsSnapshot.val()) as Treatment[];
                    const sortedTreatments = treatmentsData
                        .filter(t => t.pageName)
                        .sort((a, b) => a.name.localeCompare(b.name));
                    setTreatments(sortedTreatments);

                    // Fetch treatment details and images
                    const detailsPromises = sortedTreatments.map(async (treatment) => {
                        if (!treatment.pageName) return null;

                        const detailsRef = ref(database, `treatmentPages/${treatment.pageName}`);
                        const imagesRef = ref(database, `treatments/${treatment.name}/images`);

                        const [detailsSnapshot, imagesSnapshot] = await Promise.all([
                            get(detailsRef),
                            get(imagesRef)
                        ]);

                        if (detailsSnapshot.exists()) {
                            setTreatmentDetails(prev => ({
                                ...prev,
                                [treatment.pageName]: detailsSnapshot.val()
                            }));
                        }

                        if (imagesSnapshot.exists()) {
                            setTreatmentImages(prev => ({
                                ...prev,
                                [treatment.pageName]: { images: imagesSnapshot.val() }
                            }));
                        }
                    });

                    await Promise.all(detailsPromises.filter(Boolean));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching treatments:', error);
                setLoading(false);
            }
        };

        fetchTreatments();
    }, []);

    const filteredTreatments = treatments.filter(treatment => {
        const details = treatmentDetails[treatment.pageName];
        if (!details) return false;

        const searchString = `${details.treatmentName} ${details.tagline}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Cosmetic Services
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto">
                        Enhance your natural beauty with our range of professional cosmetic treatments.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mt-8 max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search treatments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {filteredTreatments.length === 0 && searchTerm && (
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-medium text-gray-900">No treatments found</h3>
                        <p className="mt-2 text-gray-600">Try adjusting your search terms</p>
                    </div>
                )}

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTreatments.map((treatment) => {
                        const details = treatmentDetails[treatment.pageName];
                        const images = treatmentImages[treatment.pageName]?.images || [];
                        const firstImage = images[0] || 'https://via.placeholder.com/400x300';

                        if (!details || !treatment.pageName) return null;

                        return (
                            <motion.div
                                key={treatment.pageName}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <Link to={`/treatments/${treatment.pageName}`}>
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img
                                            src={firstImage}
                                            alt={details.treatmentName}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                                <div className="p-6">
                                    <Link to={`/treatments/${treatment.pageName}`}>
                                        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                            {details.treatmentName}
                                        </h3>
                                    </Link>
                                    <p className="mt-2 text-gray-600 line-clamp-2">{details.tagline}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link
                                            to={`/treatments/${treatment.pageName}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                                        >
                                            Learn More
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to="/book-appointment"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                {/* Medical Services Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "w-full py-16 md:py-24 text-center",
                        "bg-gradient-to-br from-blue-100 to-purple-100",
                        "rounded-xl shadow-2xl",
                        "overflow-hidden relative",
                        "mt-12 md:mt-20"
                    )}
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Our Medical Services
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
                            Explore our comprehensive range of medical services, delivered with expertise and compassion.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link
                                to="/medical-services"
                                className={cn(
                                    "inline-flex items-center justify-center",
                                    "px-8 py-3 rounded-full",
                                    "bg-indigo-600 text-white",
                                    "shadow-xl hover:shadow-indigo-500/50",
                                    "hover:bg-indigo-700",
                                    "transition-all duration-300",
                                    "text-lg font-semibold",
                                    "border-2 border-indigo-500/50"
                                )}
                            >
                                Learn More About Our Medical Services
                                <ArrowRight className="ml-3 w-6 h-6" />
                            </Link>
                        </motion.div>

                        {/* Abstract Animated Background (No Image) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                            <svg className="absolute w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style={{ stopColor: "rgba(56, 189, 248, 0.3)" }} />
                                        <stop offset="100%" style={{ stopColor: "rgba(167, 139, 250, 0.3)" }} />
                                    </linearGradient>
                                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style={{ stopColor: "rgba(244, 114, 182, 0.3)" }} />
                                        <stop offset="100%" style={{ stopColor: "rgba(252, 211, 77, 0.3)" }} />
                                    </linearGradient>
                                </defs>
                                <motion.circle
                                    cx="200" cy="100" r="50" fill="url(#gradient1)"
                                    initial={{ opacity: 0, scale: 0, x: -100, y: -50 }}
                                    animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                                    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                />
                                <motion.ellipse
                                    cx="600" cy="400" rx="80" ry="30" fill="url(#gradient2)"
                                    initial={{ opacity: 0, scale: 0, x: 100, y: 50 }}
                                    animate={{ opacity: 0.5, scale: 1, x: 0, y: 0 }}
                                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                />
                                <motion.path
                                    d="M100 300 C 150 200, 250 400, 300 350" stroke="rgba(100, 100, 255, 0.2)" strokeWidth="3" fill="none"
                                    initial={{ pathLength: 0, opacity: 0, x: -50, y: 50 }}
                                    animate={{ pathLength: 1, opacity: 0.4, x: 0, y: 0 }}
                                    transition={{
                                        duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut",
                                        delay: 1
                                    }}
                                />
                                <motion.rect
                                    x="450" y="150" width="60" height="60" fill="rgba(255, 255, 255, 0.1)"
                                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                                    animate={{ opacity: 0.4, scale: 1, rotate: 360 }}
                                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                                />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

