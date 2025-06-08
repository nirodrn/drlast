
import { useParams, Link } from 'react-router-dom';
import { Heart, Video, Activity, Users } from 'lucide-react';

const services = {
  'primary-care': {
    title: 'Primary Care',
    description: 'Comprehensive medical care for patients of all ages.',
    icon: Heart,
    features: ['Annual Physical Exams', 'Preventive Care', 'Chronic Disease Management', 'Health Screenings'],
    fullDescription: `Our primary care services provide comprehensive healthcare for patients of all ages. 
    We focus on preventive care, routine check-ups, and managing chronic conditions to help you maintain 
    optimal health. Our experienced physicians work closely with you to develop personalized care plans 
    that address your specific health needs and goals.`,
    benefits: [
      'Continuous, comprehensive care',
      'Preventive health services',
      'Chronic disease management',
      'Health education and counseling',
      'Coordination with specialists'
    ]
  },
  'telemedicine': {
    title: 'Telemedicine',
    description: 'Virtual healthcare consultations from home.',
    icon: Video,
    features: ['Video Consultations', '24/7 Availability', 'Prescription Renewals', 'Follow-up Care'],
    fullDescription: `Access quality healthcare from the comfort of your home through our telemedicine 
    services. Connect with healthcare providers via secure video consultations for various medical needs, 
    from routine check-ups to prescription renewals. Our platform ensures convenient, timely care while 
    maintaining the highest standards of medical practice.`,
    benefits: [
      'Convenient access to care',
      'Reduced travel time',
      'Flexible scheduling',
      'Secure platform',
      'Quick prescription renewals'
    ]
  },
  'urgent-care': {
    title: 'Urgent Care',
    description: 'Immediate care for non-emergency conditions.',
    icon: Activity,
    features: ['Walk-in Services', 'Minor Injury Treatment', 'Lab Services', 'X-ray Services'],
    fullDescription: `Our urgent care facility provides immediate medical attention for non-emergency 
    conditions. We offer comprehensive services including treatment for minor injuries, illnesses, and 
    diagnostic testing. Our team of healthcare professionals is equipped to handle various urgent medical 
    needs efficiently and effectively.`,
    benefits: [
      'No appointment necessary',
      'Extended hours',
      'On-site diagnostic services',
      'Shorter wait times than ER',
      'Cost-effective care'
    ]
  },
  'specialist-referrals': {
    title: 'Specialist Referrals',
    description: 'Coordinated care with trusted specialists.',
    icon: Users,
    features: ['Network of Specialists', 'Coordinated Care', 'Electronic Records', 'Follow-up Management'],
    fullDescription: `Our specialist referral service connects you with expert healthcare providers 
    across various medical specialties. We coordinate your care seamlessly, ensuring effective 
    communication between your primary care physician and specialists. Our extensive network includes 
    highly qualified professionals in various medical fields.`,
    benefits: [
      'Access to expert specialists',
      'Coordinated care approach',
      'Seamless communication',
      'Comprehensive medical records',
      'Follow-up care management'
    ]
  }
};

function ServiceDetail() {
  const { id } = useParams();
  const service = services[id as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Link to="/medical-services" className="text-blue-600 hover:text-blue-800">
            Return to Medical Services
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/medical-services" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Medical Services
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-8">
            <div className="flex items-center mb-4">
              <ServiceIcon className="h-12 w-12 mr-4" />
              <h1 className="text-3xl font-bold">{service.title}</h1>
            </div>
            <p className="text-xl">{service.description}</p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 mb-8">{service.fullDescription}</p>

              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold mb-4">Benefits</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="h-2 w-2 bg-blue-600 rounded-full mr-3"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Schedule an Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;