import { Mail, Calendar, Clock, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define a simple cn function.
const cn = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};

function MedicalServices() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    }

    checkIsDesktop();

    const handleResize = () => {
      checkIsDesktop();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Use isDesktop to conditionally apply styles or logic, if needed.
  const sameDayClinicStyle = isDesktop
    ? "flex-grow"
    : "w-full";

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-r from-blue-400 to-cyan-300 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/70 to-cyan-300/70"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Parkwood Medical Centre</h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-light">
            Your Health, Our Priority
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Passion is to Make You Feel Better!
            </h2>
            <div className="w-20 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
              At <span className="font-semibold text-blue-600">Parkwood Medical Centre</span>,
              we're committed to providing you and your loved ones with exceptional care in a
              compassionate and friendly atmosphere with the Clinic's unique ambiance.
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
              We believe that our patients deserve the <em>best care</em>, and we make an
              effort to make sure you always feel <strong>welcome and at ease</strong>.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Visit us today and see how we can help you or your loved ones.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-16 max-w-3xl mx-auto items-center">
            <div className={cn("bg-blue-50 p-6 rounded-xl text-center flex-grow shadow-md", sameDayClinicStyle)}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">SAME DAY CLINIC</h3>
              <p className="text-gray-700">
                Visit us for same-day appointments. We offer quick and efficient care
                tailored to your needs. No need for long wait times!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              To See the Doctor, Send Your Request
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 mb-8">
              Email us at{' '}
              <a
                href="mailto:inquirepmc@gmail.com"
                className="text-cyan-600 font-semibold hover:underline transition duration-300"
              >
                inquirepmc@gmail.com
              </a>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Request Details Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:shadow-xl hover:scale-105">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                To See The Doctor, Send Your Request
              </h4>

              <div className="text-center">
                <p className="text-base text-gray-800 mb-6">
                  Send your request to the following email:
                </p>
                <p className="text-base text-blue-600 font-semibold mb-6">
                  <a href="mailto:inquirepmc@gmail.com">inquirepmc@gmail.com</a>
                </p>

                <p className="text-base text-gray-700 mb-4">
                  Provide your details in the following format:
                </p>

                <div className="bg-blue-50 p-6 rounded-lg shadow-md space-y-4 mx-auto max-w-xl">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">First & Last Name:</span>
                    <span className="text-gray-800">John Smith</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Date of Birth:</span>
                    <span className="text-gray-800">01/15/1985</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Reason:</span>
                    <span className="text-gray-800">Annual check-up</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Phone Number:</span>
                    <span className="text-gray-800">(416) 555-1234</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:shadow-xl hover:scale-105">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                Important Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Contact within 24-48 hours</h4>
                    <p className="text-gray-600">We'll reach out to confirm your appointment details</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Do not visit unless contacted</h4>
                    <p className="text-gray-600">
                      Please wait for our confirmation before coming to the clinic
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Arrive 20 minutes before appointment</h4>
                    <p className="text-gray-600">This allows time for preparation and check-in</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Saturday Appointments</h4>
                    <p className="text-gray-600">Please arrive 20 minutes prior to your time slot</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consult Your Doctor In-Person Section (Restored here) */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition duration-300 hover:shadow-xl hover:scale-105">
              <h3 className="text-2xl font-semibold text-white mb-6 w-full text-center">
                Consult Your Doctor In-Person
              </h3>
              <div className="mt-8 w-full max-w-[400px]">
                <a
                  href="https://parkwoodmc.kai-oscar.com/kaiemr/app/components/onlinebooking/#!/appointmentInfo"
                  className="inline-block bg-white text-purple-700 px-8 py-3 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 hover:text-white transition duration-300 shadow-md hover:shadow-lg w-full text-center"
                >
                  Book In-Person Visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className={cn(
        "bg-gradient-to-br from-blue-50 to-cyan-50 py-20",
        "flex items-center justify-center w-full"
      )}>
        <div className={cn(
          "max-w-7xl mx-auto px-6 w-full",
          "md:flex md:flex-row md:items-start md:gap-8"
        )}>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 border-l-8 border-blue-400 md:flex-grow w-full">
            {/* Heading and divider INSIDE the panel */}
            <div className="w-full mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 tracking-tight text-center md:text-left">
                Visit Us
              </h2>
              <div className="w-24 h-1 bg-cyan-400 mx-auto md:ml-0 mb-8 rounded"></div>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Location</h3>
              <address className="not-italic text-gray-700 text-lg leading-relaxed mb-4">
                Parkwoods Village Plaza, 1265 York Mills Rd, Unit F1-1<br />
                Toronto, ON M3A 1Z4
              </address>
              <div className="flex items-center mt-2">
                <Phone className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-gray-800 text-lg font-medium">416-342-0670</span>
              </div>
            </div>
            <div className="flex-grow w-full mt-8 md:mt-0">
              <iframe
                title="Parkwood Medical Centre Location"
                src="https://www.google.com/maps?q=1265+York+Mills+Rd,+Toronto,+ON+M3A+1Z4&output=embed"
                className="w-full h-64 rounded-xl border-0 shadow-md"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedicalServices;

