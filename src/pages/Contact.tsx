import React, { useEffect, useRef, useState, RefCallback } from 'react';
import { Phone, MapPin, Clock, AlertTriangle, Calendar, Mail } from "lucide-react";

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

    return [setNode, entry];
};

const Contact: React.FC = () => {
    const [setAnimateRef] = useIntersectionObserver({ threshold: 0.1 });
    const [setContactRef] = useIntersectionObserver({ threshold: 0.2 });
    const [setWarningRef] = useIntersectionObserver({ threshold: 0.2 });
    const [setMapRef] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        ref={setAnimateRef}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Get In <span className="text-blue-600">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Ready to begin your journey? We're here to help you every step of the way. 
                            Contact us today to schedule your consultation.
                        </p>
                    </div>
                </div>
            </section>

            {/* CRITICAL WARNING SECTION - Prominently displayed */}
            <section className="py-16 bg-red-50 border-l-4 border-red-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        ref={setWarningRef}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-red-100 rounded-full">
                                <AlertTriangle className="h-16 w-16 text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-red-800 mb-6">
                            DO NOT VISIT WITHOUT APPOINTMENT
                        </h2>
                        <p className="text-xl text-red-700 max-w-3xl mx-auto leading-relaxed mb-8">
                            Please contact us before visiting our location. All visits require prior appointments to ensure proper care and safety protocols.
                        </p>
                        
                        {/* Additional Warning Card */}
                        <div className="max-w-2xl mx-auto bg-red-100 border-2 border-red-300 rounded-xl p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Calendar className="h-8 w-8 text-red-600 mr-3" />
                                <h3 className="text-xl font-bold text-red-800">Appointment Required</h3>
                            </div>
                            <p className="text-red-700 font-medium">
                                No walk-ins accepted. Please call us to schedule your appointment before visiting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        ref={setContactRef}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How Can We Help You?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose the best way to reach us. We're committed to providing you with exceptional service.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                        {/* Aesthetic Inquiries */}
                        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-emerald-500">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Aesthetic Inquiries</h3>
                                <p className="text-gray-600 mb-6">For cosmetic treatments and aesthetic consultations</p>
                                <a
                                    href="tel:416-449-0936"
                                    className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    416-449-0936
                                </a>
                            </div>
                        </div>

                        {/* Medical Inquiries */}
                        <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Medical Inquiries</h3>
                                <p className="text-gray-600 mb-6">For medical services and health consultations</p>
                                <a
                                    href="tel:416-342-0670"
                                    className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    416-342-0670
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
                        <p className="text-xl mb-8 opacity-90">
                            Book your consultation today and take the first step towards your transformation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/book-appointment"
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                            >
                                Book Appointment
                            </a>
                            <a
                                href="/cosmetic-services"
                                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                            >
                                View Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location & Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        ref={setMapRef}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Find Us
                        </h2>
                        <p className="text-lg text-gray-600">
                            Located in the heart of Toronto for your convenience
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-5 gap-0">
                            {/* Location Details */}
                            <div className="md:col-span-2 p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8">Location Details</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                                            <p className="text-gray-600">
                                                1265 York Mills Rd, Unit F1-1<br />
                                                Toronto, ON M3A 1Z4
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                                            <p className="text-gray-600">
                                                Aesthetic: 416-449-0936<br />
                                                Medical: 416-342-0670
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                                            <p className="text-gray-600">
                                                By appointment only<br />
                                                Please call to schedule
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Weekend Appointments</h4>
                                            <p className="text-gray-600">
                                                Email: <a href="mailto:INQUIREPMC@GMAIL.COM" className="text-blue-600 hover:text-blue-700">INQUIREPMC@GMAIL.COM</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-amber-800">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="font-medium text-sm">Please book appointment first</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="md:col-span-3 h-[400px] md:h-[600px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.8234567890123!2d-79.32706230474648!3d43.76041789604095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d2645af41409%3A0xd97a338978c452c5!2sParkwood%20Medical%20Centre!5e0!3m2!1sen!2slk!4v1749399775297!5m2!1sen!2slk"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Parkwood Medical Centre Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;