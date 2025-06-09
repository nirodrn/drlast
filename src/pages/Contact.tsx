import React, { useEffect, useRef, useState, RefCallback } from 'react';
import { Phone, MapPin,  ChevronDown, DivideIcon as LucideIcon } from "lucide-react";

// AnimatedIcon component for a subtle hover effect on icons
interface AnimatedIconProps {
    icon: typeof LucideIcon;
    className?: string;
}
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ icon: IconComponent, className }) => {
    return (
        <IconComponent className={`transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[-5deg] ${className || ''}`} />
    );
};

// Custom hook to detect if an element is in viewport
type IntersectionObserverHook = [
    RefCallback<Element>,
    IntersectionObserverEntry | null
];

const useIntersectionObserver = (
    options?: IntersectionObserverInit
): IntersectionObserverHook => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<Element | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(([entry]) => setEntry(entry), options);

        const { current: currentObserver } = observer;
        if (node && currentObserver) currentObserver.observe(node);

        return () => {
            if (currentObserver) currentObserver.disconnect();
        };
    }, [node, options]);

    // setNode can be used as a ref callback
    return [setNode, entry];
};


// Contact component with a creative and animated design
const Contact: React.FC = () => {
    // Intersection observer for fade-in animations
    const [setAnimateRef, animateEntry] = useIntersectionObserver({ threshold: 0.1 });
    const [setCard1Ref, card1Entry] = useIntersectionObserver({ threshold: 0.2 });
    const [setCard2Ref, card2Entry] = useIntersectionObserver({ threshold: 0.2 });
    const [setCard3Ref, card3Entry] = useIntersectionObserver({ threshold: 0.2 });
    const [setMapContainerRef, mapContainerEntry] = useIntersectionObserver({ threshold: 0.2 });

    const contactInfo = [
        {
            icon: Phone,
            title: "Aesthetic Inquiries",
            details: <a href="tel:416-449-0936\" className="hover:underline">416-449-0936</a>,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            ref: setCard1Ref,
            entry: card1Entry,
        },
        {
            icon: Phone,
            title: "Medical Inquiries",
            details: <a href="tel:416-342-0670" className="hover:underline">416-342-0670</a>,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            ref: setCard2Ref,
            entry: card2Entry,
        },
        {
            icon: MapPin,
            title: "Email Us",
            details: (
                <a href="mailto:Info@drdanielesthetixs.com" className="hover:underline">
                    Info@drdanielesthetixs.com
                </a>
            ),
            bgColor: "bg-sky-50",
            iconColor: "text-sky-600",
            ref: setCard3Ref,
            entry: card3Entry,
        },
    ];

    // Style for animated entry
    const getAnimationStyle = (entry: IntersectionObserverEntry | null, delay = 0) => ({
        opacity: entry?.isIntersecting ? 1 : 0,
        transform: entry?.isIntersecting ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
    });

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-sky-100 font-sans overflow-x-hidden">
            {/* Header Section with Animation */}
            <header
                className="relative h-[50vh] sm:h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
            >
                {/* Animated background shapes */}
                <div className="absolute inset-0 z-0 opacity-50">
                    <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-rose-300 rounded-full filter blur-2xl animate-pulse-slow"></div>
                    <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-teal-300 rounded-full filter blur-2xl animate-pulse-slower"></div>
                    <div className="absolute top-[20%] left-[30%] w-48 h-48 bg-indigo-300 rounded-lg filter blur-xl animate-pulse-slowest transform rotate-45"></div>
                </div>

                <div className="relative z-10">
                    <h1
                        className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-800 mb-6 drop-shadow-md transition-all duration-700 ease-out"
                        style={getAnimationStyle(animateEntry)}
                        ref={setAnimateRef}
                    >
                        Get In <span className="text-sky-600">Touch</span>
                    </h1>
                    <p
                        className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 transition-all duration-700 ease-out delay-200"
                        style={getAnimationStyle(animateEntry, 200)}
                    >
                        We're excited to connect with you! Whether you have questions, need support, or want to schedule a consultation, our team is ready to assist.
                    </p>
                    <a
                        href="#contact-details"
                        className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out delay-400"
                        style={getAnimationStyle(animateEntry, 400)}
                    >
                        Contact Details <ChevronDown className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Contact Information Section - Redesigned */}
            <section id="contact-details" className="max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:px-8">
                <div className="text-center mb-16">
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-slate-700 mb-4 transition-all duration-500 ease-out"
                        style={getAnimationStyle(card1Entry)} // Use first card's entry for section title
                    >
                        How Can We Help?
                    </h2>
                    <p
                        className="text-lg text-slate-500 max-w-xl mx-auto transition-all duration-500 ease-out delay-100"
                        style={getAnimationStyle(card1Entry, 100)}
                    >
                        Find the best way to reach us below.
                    </p>
                </div>

                {/* Contact Info Cards with Animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contactInfo.map((item, index) => (
                        <div
                            key={item.title}
                            ref={item.ref}
                            style={getAnimationStyle(item.entry, index * 100)}
                            className={`group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-t-4 ${item.bgColor.replace('bg-', 'border-')}`}
                        >
                            <div className="flex items-start">
                                <div className={`p-3 rounded-lg ${item.bgColor} mr-5`}>
                                    <AnimatedIcon icon={item.icon} className={`w-7 h-7 ${item.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-semibold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors duration-300`}>
                                        {item.title}
                                    </h3>
                                    <div className="text-slate-600 text-sm">{item.details}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Section with Animation */}
            <section className="py-16 sm:py-24 bg-slate-100">
                <div className="max-w-6xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-700 mb-4">
                            Do Not Visit Unless Advised
                        </h2>
                        <p className="text-lg text-slate-600">
                            Please contact us before visiting our location
                        </p>
                    </div>
                    <div
                        ref={setMapContainerRef}
                        style={getAnimationStyle(mapContainerEntry)}
                        className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 ease-out"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d180.09995378155293!2d-79.32706230474648!3d43.76041789604095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x89d4d2645af41409%3A0xd97a338978c452c5!2s1265%20York%20Mills%20Rd%20Unit%20F1-1%2C%20Toronto%2C%20ON%20M3A%201Z4%2C%20Canada!3m2!1d43.760424799999996!2d-79.3269523!5e0!3m2!1sen!2slk!4v1749399775297!5m2!1sen!2slk"
                            className="w-full h-[450px] border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Clinic Location"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* CSS for background shape animations */}
            <style>
                {`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.05); }
                }
                @keyframes pulse-slower {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.03); }
                }
                @keyframes pulse-slowest {
                    0%, 100% { opacity: 0.4; transform: scale(1) rotate(45deg); }
                    50% { opacity: 0.7; transform: scale(1.02) rotate(50deg); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite ease-in-out;
                }
                .animate-pulse-slower {
                    animation: pulse-slower 10s infinite ease-in-out;
                }
                .animate-pulse-slowest {
                    animation: pulse-slowest 12s infinite ease-in-out;
                }
                `}
            </style>
        </main>
    );
};

export default Contact;