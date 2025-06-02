import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { FaTiktok, FaInstagram, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start text-left">
          {/* Logo Section */}
          <div className="flex justify-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <Link to="/" className="relative block">
                <img 
                  src="https://i.ibb.co/ccc6KPv2/footerlogo.png" 
                  alt="Dr. Daniel Esthetixs Logo" 
                  className="w-32 md:w-40 transition-transform duration-300 transform hover:scale-105"
                />
              </Link>
            </div>
          </div>

          {/* Dr. Daniel Esthetixs */}
          <div className="text-left">
            <h3 className="text-gray-900 text-lg font-semibold mb-4 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Dr. Daniel Esthetixs
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/login" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  About Dr. Shevanta Daniel
                </Link>
              </li>
              <li>
                <Link 
                  to="/concerns" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  Concerns
                </Link>
              </li>
            </ul>
          </div>

          {/* Esthetixs Services */}
          <div className="text-left">
            <h3 className="text-gray-900 text-lg font-semibold mb-4 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Esthetixs Services
              </span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/cosmetic-services" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  Cosmetic Treatments
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/book-appointment" 
                  className="hover:text-blue-600 transition-colors duration-200 inline-block"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-left">
            <h3 className="text-gray-900 text-lg font-semibold mb-4 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Contact Us
              </span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
                <a 
                  href="tel:416-449-0936" 
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  416-449-0936
                </a>
              </li>
              <li className="flex items-center group">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/?q=1265+York+Mills+Rd,+F1-1,+Toronto,+ON+M3A+1Z4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  1265 York Mills Rd, F1-1,<br className="hidden sm:inline" /> Toronto, ON M3A 1Z4
                </a>
              </li>
              {/* Social Media Links */}
              <li className="flex items-center space-x-4">
                <a 
                  href="https://www.tiktok.com/@drshevantadaniel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaTiktok className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.instagram.com/drshevantadaniel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.facebook.com/drdaniel.esthetixs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaFacebook className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Dr. Daniel Esthetixs & Parkwood Medical Centre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;