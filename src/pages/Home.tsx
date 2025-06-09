import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    ArrowRight,
    Star,
    
} from "lucide-react";

const services = [
    { id: 'prp-hair', name: 'PRP Hair', description: 'Stimulate natural hair growth and combat thinning using Platelet-Rich Plasma.', time: '30-60 mins', image: 'https://i.ibb.co/pv9TShcc/PRP-hair.jpg', route: '/cosmetic-services' },
    { id: 'prp-face', name: 'PRP Face (Vampire Facial)', description: 'Rejuvenate skin texture and tone with PRP therapy for a radiant, youthful look.', time: '30-60 mins', image: 'https://i.ibb.co/cK0bt3yf/PRP-face.jpg', route: '/cosmetic-services' },
    { id: 'botox-wrinkles', name: 'Botox for Wrinkles', description: 'Smooth out wrinkles and fine lines for a refreshed, youthful appearance.', time: '30-60 mins', image: 'https://i.ibb.co/Kzm1rvFS/botox-wrinkles.jpg', route: '/cosmetic-services' },
    { id: 'botox-hyperhidrosis', name: 'Botox for Hyperhidrosis', description: 'Say goodbye to excessive sweating with Botox, providing dryness and confidence.', time: '30-60 mins', image: 'https://i.ibb.co/VYxnQZFR/botox-hyperhidrosis.jpg', route: '/cosmetic-services' },
    { id: 'non-surgical-butt-lift', name: 'Non-Surgical Butt Lift', description: 'Enhance your figure with a non-invasive butt lift procedure.', time: '30-60 mins', image: 'https://i.ibb.co/WWYjqBh8/non-surgical-butt-lift.jpg', route: '/cosmetic-services' },
    { id: 'lip-fillers', name: 'Lip Fillers', description: 'Achieve fuller, natural-looking lips effortlessly.', time: '30-60 mins', image: 'https://i.ibb.co/Txdtgx42/lip-fillers.jpg', route: '/cosmetic-services' },
    { id: 'chin-fillers', name: 'Chin Fillers', description: 'Define your chin for a balanced and enhanced profile.', time: '30-60 mins', image: 'https://i.ibb.co/7Jfc5xH1/chin-fillers.jpg', route: '/cosmetic-services' },
    { id: 'facial-fillers', name: 'Facial Fillers', description: 'Restore volume, smooth wrinkles, and contour your face.', time: '30-60 mins', image: 'https://i.ibb.co/twhDr6K6/Facial-Filler.jpg', route: '/cosmetic-services' },
    { id: 'male-genital-rejuvenation', name: 'Male Genital Rejuvenation', description: 'Enhance aesthetics and functionality with non-invasive treatments.', time: '30-60 mins', image: 'https://i.ibb.co/rRXYyQvX/male-genital-rejuvenation.png', route: '/cosmetic-services' },
    { id: 'female-genital-rejuvenation', name: 'Female Genital Rejuvenation', description: 'Rejuvenate and restore comfort with advanced non-surgical care.', time: '30-60 mins', image: 'https://i.ibb.co/LXR41C91/female-genital-rejuvenation.jpg', route: '/cosmetic-services' },
    { id: 'collagen-induction-therapy', name: 'Collagen Induction Therapy', description: 'Boost collagen for firmer, more youthful skin.', time: '30-60 mins', image: 'https://i.ibb.co/p6fQmrZB/collagen-induction-therapy.jpg', route: '/cosmetic-services' },
    { id: 'skin-rejuvenation', name: 'Skin Rejuvenation', description: 'Reclaim youthful, radiant skin with advanced facial treatments.', time: '30-60 mins', image: 'https://i.ibb.co/JwpJ5QP7/skin-rejuvenation.jpg', route: '/cosmetic-services' },
    { id: 'radiesse-therapy', name: 'Bio-Stimulator Therapy with Radiesse', description: 'Non-surgical treatment for facial rejuvenation.', time: '30-60 mins', image: 'https://i.ibb.co/LXZBGS5q/radiesse-therapy.jpg', route: '/cosmetic-services' },
    { id: 'chemical-peel', name: 'Chemical Peel', description: 'Rejuvenate your skin for a healthier, glowing complexion.', time: '30-60 mins', image: 'https://i.ibb.co/3yf0pnry/chemical-peel.jpg', route: '/cosmetic-services' },
];

const randomTreatment = services[Math.floor(Math.random() * services.length)];

// Typing effect component
const TypingEffect = () => {
    const phrases = [
        "Discover Your True Beauty",
        "Experience Professional Medical Services", 
        "Reveal Your Inner Glow",
        "Discover Confidence Through Care",
        "Experience Advanced Medical Services",
        "Trusted Beauty and Medical Expertise",
        "Elevate Your Look, Safely and Professionally",
        "Where Beauty Meets Medical Excellence"
    ];

    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex];
        
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (currentText.length < currentPhrase.length) {
                    setCurrentText(currentPhrase.substring(0, currentText.length + 1));
                    setTypingSpeed(100);
                } else {
                    // Pause before deleting
                    setTypingSpeed(2000);
                    setIsDeleting(true);
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(currentPhrase.substring(0, currentText.length - 1));
                    setTypingSpeed(50);
                } else {
                    // Move to next phrase
                    setIsDeleting(false);
                    setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                    setTypingSpeed(500);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentPhraseIndex, typingSpeed, phrases]);

    return (
        <span className="text-blue-600">
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

// Welcome Popup Component
const WelcomePopup = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-center max-w-md mx-4 shadow-2xl animate-slideIn">
                <h2 className="text-white text-2xl font-bold mb-4 text-shadow">
                    Welcome to Dr. Daniel Esthetixs!
                </h2>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                    Discover our Aesthetic and medical services all in one brand new web site
                </p>
                <button
                    onClick={onClose}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                    Explore Now
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);

    useEffect(() => {
        // Show popup after a short delay when component mounts
        const timer = setTimeout(() => {
            const popupShown = sessionStorage.getItem('welcomePopupShown');
            if (!popupShown) {
                setShowWelcomePopup(true);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleClosePopup = () => {
        setShowWelcomePopup(false);
        sessionStorage.setItem('welcomePopupShown', 'true');
    };

    const fadeIn = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        transition: {
            duration: 0.6,
        },
    };

    return (
        <div className="flex flex-col">
            {/* Welcome Popup */}
            <WelcomePopup isVisible={showWelcomePopup} onClose={handleClosePopup} />

            {/* Hero Section */}
            <section className="relative min-h-screen bg-blue-50">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://i.ibb.co/zh0Xq08x/Dr-daniel-banner.jpg"
                        alt="Daniel Esthetixs Clinic"
                        className="w-full h-full object-cover object-[80%_center] sm:object-[70%_center]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/70 via-blue-100/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 min-h-screen flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                        {/* Left Content */}
                        <motion.div className="text-blue-900" {...fadeIn}>
                            <motion.div
                                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6"
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src="https://i.ibb.co/Xf2nWRwT/Dr-logo-1.png"
                                    alt="Dr. Daniel Esthetixs Logo"
                                    className="w-6 h-6 mr-2 rounded-full"
                                />
                                <span className="text-sm font-medium text-blue-900">
                                    Welcome to Dr. Daniel Esthetixs
                                </span>
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-3 leading-tight">
                                <TypingEffect />
                            </h1>
                            <p className="text-lg md:text-xl text-blue-800 mb-8 max-w-xl">
                                Experience the perfect blend of advanced cosmetic treatments and
                                medical expertise at Dr.Daniel Esthetixs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        to="/cosmetic-services"
                                        className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        Explore Services
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        to="/concerns"
                                        className="w-full sm:w-auto px-8 py-4 rounded-lg bg-transparent text-blue-900 font-semibold hover:text-white transition-all flex items-center justify-center border-2 border-[#75c2f0] shadow-sm hover:shadow-[0_5px_10px_0_rgba(0,150,255,0.3)] hover:bg-gradient-to-b from-[#80d0f4] to-[#2a8fa6] hover:border-[#2a8fa6]"
                                    >
                                        Concerns
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Treatment Highlights - COMMENTED OUT */}
                        {/* 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    title: "Botox & Fillers",
                                    description: "Premium injectables for natural enhancement",
                                    icon: Syringe,
                                },
                                {
                                    title: "Lip Fillers",
                                    description: "Achieve fuller, natural-looking lips effortlessly.",
                                    icon: Heart,
                                },
                                {
                                    title: "Skin Rejuvenation",
                                    description: "Advanced skin renewal procedures",
                                    icon: Zap,
                                },
                                {
                                    title: "PRP Treatments",
                                    description: "Natural regenerative solutions",
                                    icon: Star,
                                },
                            ].map((card, index) => {
                                const Icon = card.icon;
                                return (
                                    <Link to="/cosmetic-services" key={index}>
                                        <motion.div
                                            className="p-6 rounded-xl bg-white/80 hover:bg-blue-50/80 transition-all cursor-pointer border border-blue-100 shadow-md backdrop-blur-md"
                                            whileHover={{ scale: 1.03 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Icon className="w-8 h-8 text-blue-600 mb-4" />
                                            <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                                {card.title}
                                            </h3>
                                            <p className="text-blue-700 text-sm">{card.description}</p>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                        */}
                    </div>
                </div>
            </section>

            {/* Main Services Sections */}
            <section className="py-20 bg-blue-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Cosmetic Services */}
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-blue-900 mb-4">
                                Cosmetic Services
                            </h2>
                            <p className="text-blue-700 mb-6">
                                Transform your appearance with our premium aesthetic treatments.
                                Experience the latest in beauty enhancement technology.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {["Botox & Fillers", "PRP Treatments", "Body Contouring", "Skin Rejuvenation"].map((service, index) => (
                                    <li key={index} className="flex items-center gap-3 text-blue-800">
                                        <Star className="w-5 h-5 text-blue-900" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/cosmetic-services"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors"
                            >
                                Explore Cosmetic Services
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </motion.div>
                        {/* Right Treatment Highlight - Random Treatment */}
                        <motion.div
                            className="p-6 rounded-xl bg-blue-100 hover:bg-blue-200 transition-all cursor-pointer border border-blue-200 shadow-lg"
                            whileHover={{ scale: 1.03 }}
                        >
                            <img
                                src={randomTreatment.image}
                                alt={randomTreatment.name}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-blue-900 mb-2">{randomTreatment.name}</h3>
                            <p className="text-blue-800 text-sm">{randomTreatment.description}</p>
                            <p className="text-blue-700 text-sm mt-2">Duration: {randomTreatment.time}</p>
                            <Link
                                to={randomTreatment.route}
                                className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-colors text-sm font-semibold shadow-md"
                            >
                                View Treatment <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-100 to-blue-300">
                <motion.div
                    className="container mx-auto px-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
                        Begin Your Journey at Dr. Daniel Esthetixs
                    </h2>
                    <p className="text-xl text-blue-800 mb-8 max-w-2xl mx-auto">
                        Book your consultation and discover how we can help you achieve your
                        aesthetic goals.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/cosmetic-services"
                            className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg"
                        >
                            Explore Our Services
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out;
                }
                
                .text-shadow {
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}