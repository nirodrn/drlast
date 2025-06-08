import { useState, useEffect } from 'react';
import { Mail, Clock, Phone, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MedicalServices() {
  const [showBookingButton, setShowBookingButton] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowBookingButton(scrollPosition > 500);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isDesktop) {
    // ...do something for desktop
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Parkwood Medical Centre
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Exceptional Healthcare, Compassionate Service
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#important-info"
                className="px-8 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center"
              >
                Important Information <ChevronDown className="ml-2 h-5 w-5" />
              </a>
              
              <a
                href="#contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center"
              >
                Contact Us <ChevronDown className="ml-2 h-5 w-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <a
                href="https://www.google.com/search?client=ms-android-samsung-rvo1&sca_esv=f6bc877b3d7fa12d&hl=en-CA&cs=0&sxsrf=AE3TifNtYpV560Iw2JCZtCHC5PTBSZyJXg%3A1748873800363&kgmid=%2Fg%2F11dymr5048&q=Parkwood%20Medical%20Centre.%20Online%20Sign%20in.%20Do%20Not%20Visit%20Unless%20Advised&shndl=30&shem=apc15v2%2Cnpsc2&source=sh%2Fx%2Floc%2Fact%2Fm4%2F2#ebo=0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
              >
                <Clock className="h-8 w-8 text-blue-300 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Find Our Opening Times</h3>
                <p className="text-blue-100">Click to view our current hours</p>
                <p className="text-blue-100">and availability</p>
              </a>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="h-8 w-8 text-blue-300 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Contact</h3>
                <p className="text-blue-100">Tel: 416-342-0670</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <MapPin className="h-8 w-8 text-blue-300 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Location</h3>
                <p className="text-blue-100">1265 York Mills Rd, Unit F1-1</p>
                <p className="text-blue-100">Toronto, ON M3A 1Z4</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Information Section */}
      <section id="important-info" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Important Information for Your Appointment
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 rounded-xl p-8"
            >
              <Clock className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Arrival Time</h3>
              <p className="text-lg text-gray-700 mb-4">
                TO ELIMINATE WAIT TIMES AND TO PREPARE YOU FOR THE DOCTOR, PLEASE ARRIVE 20 MINUTES PRIOR TO THE TIME SLOT BOOKED.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 rounded-xl p-8"
            >
              <Mail className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Weekend Appointments</h3>
              <p className="text-lg text-gray-700 mb-4">
                For weekend appointments, please email:
              </p>
              <a
                href="mailto:INQUIREPMC@GMAIL.COM"
                className="text-blue-600 font-bold text-xl hover:text-blue-700 transition-colors"
              >
                INQUIREPMC@GMAIL.COM
              </a>
            </motion.div>
          </div>

          {/* Online Booking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center mb-20"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ready to Book Your Appointment?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Schedule your visit instantly through our secure online portal.
            </p>
            <a
              href="https://parkwoodmc.kai-oscar.com/kaiemr/app/components/onlinebooking/#!/appointmentInfo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              Book Online Now <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </a>
          </motion.div>

          {/* Our Commitment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Commitment to You
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 mb-6">
                Our passion is to make you feel better! At Parkwood Medical Centre, we're committed to providing you and your loved ones with exceptional care in a compassionate and friendly atmosphere with the Clinic's unique ambiance.
              </p>
              <p className="text-xl text-gray-700">
                We believe that our patients deserve the best care, and we make an effort to make sure you always feel welcome and at ease. Visit us today and see how we can help you or your loved ones.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-500 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        Parkwoods Village Plaza<br />
                        1265 York Mills Rd, Unit F1-1<br />
                        Toronto, ON M3A 1Z4
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-500 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Contact</h3>
                      <p className="text-gray-600">
                        Tel: 416-342-0670
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[400px] md:h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2881.598559759909!2d-79.32950902498543!3d43.760432445490586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d2645af41409%3A0xcc5e3c2bd903a8d4!2sDr.%20Shevanta%20Daniel!5e0!3m2!1sen!2slk!4v1734867885982!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Parkwood Medical Centre Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Booking Button */}
      <AnimatePresence>
        {showBookingButton && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <a
              href="https://parkwoodmc.kai-oscar.com/kaiemr/app/components/onlinebooking/#!/appointmentInfo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center"
            >
              Book Your Appointment <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MedicalServices;