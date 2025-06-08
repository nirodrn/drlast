import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { Phone, ChevronDown, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TreatmentData {
  treatmentName: string;
  tagline: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sideEffects: {
    common: string[];
    rare: string[];
  };
  treatmentProcess: {
    preTreatmentCare: string[];
    postTreatmentCare: string[];
  };
  contact: {
    phone: string;
    notes: string[];
  };
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      className="border-b border-gray-200"
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(249, 250, 251, 0.5)" : "transparent" }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="w-full py-6 text-left flex items-center justify-between focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-blue-500" />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-6 px-4">
          <div className="text-gray-600 space-y-2 whitespace-pre-line">{answer}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ImageModalProps {
  image: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-transparent hover:bg-white hover:text-black rounded-full p-2 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-6 h-6" />
      </motion.button>
      <motion.img
        src={image}
        alt="Full Size"
        className="max-w-full max-h-full object-contain rounded-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
    </motion.div>
  );
};

export const TreatmentPage: React.FC = () => {
  const { treatmentId } = useParams<{ treatmentId: string }>();
  const [treatmentData, setTreatmentData] = useState<TreatmentData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        if (!treatmentId) return;

        const treatmentsCatoRef = ref(database, 'treatmentscato');
        const treatmentsCatoSnapshot = await get(treatmentsCatoRef);
        
        if (!treatmentsCatoSnapshot.exists()) return;

        const treatmentsCatoData = treatmentsCatoSnapshot.val();
        const treatmentEntry = Object.values(treatmentsCatoData).find(
          (t: any) => t.pageName === treatmentId
        ) as { name: string; pageName: string } | undefined;

        if (!treatmentEntry) return;

        const treatmentRef = ref(database, `treatmentPages/${treatmentId}`);
        const treatmentSnapshot = await get(treatmentRef);
        
        if (treatmentSnapshot.exists()) {
          setTreatmentData(treatmentSnapshot.val());
        }

        const imagesRef = ref(database, `treatments/${treatmentEntry.name}/images`);
        const imagesSnapshot = await get(imagesRef);
        
        if (imagesSnapshot.exists()) {
          setImages(imagesSnapshot.val());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching treatment data:', error);
        setLoading(false);
      }
    };

    fetchTreatmentData();
  }, [treatmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!treatmentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Treatment not found</h2>
          <p className="mt-2 text-gray-600">The requested treatment could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {treatmentData.treatmentName}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {treatmentData.tagline}
          </motion.p>
        </div>
      </motion.section>

      {/* Gallery Section */}
      {images.length > 0 && (
        <motion.section 
          className="py-16 px-4 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Treatment Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <motion.div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
                    whileHover={{ opacity: 1 }}
                  >
                    <span className="text-white">View Image</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* FAQ Section */}
      <motion.section 
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {treatmentData.faqs && Array.isArray(treatmentData.faqs) && treatmentData.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Side Effects Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Side Effects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Common Side Effects</h3>
              <ul className="space-y-2">
                {treatmentData.sideEffects?.common && Array.isArray(treatmentData.sideEffects.common) && treatmentData.sideEffects.common.map((effect, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
                    <span>{effect}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-4">Rare Side Effects</h3>
              <ul className="space-y-2">
                {treatmentData.sideEffects?.rare && Array.isArray(treatmentData.sideEffects.rare) && treatmentData.sideEffects.rare.map((effect, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full"></span>
                    <span>{effect}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Treatment Process Section */}
      <motion.section 
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Treatment Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-4">Pre-Treatment Care</h3>
              <ul className="space-y-2">
                {treatmentData.treatmentProcess?.preTreatmentCare && Array.isArray(treatmentData.treatmentProcess.preTreatmentCare) && treatmentData.treatmentProcess.preTreatmentCare.map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-4">Post-Treatment Care</h3>
              <ul className="space-y-2">
                {treatmentData.treatmentProcess?.postTreatmentCare && Array.isArray(treatmentData.treatmentProcess.postTreatmentCare) && treatmentData.treatmentProcess.postTreatmentCare.map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg text-center"
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 15 }}
            >
              <Phone className="w-8 h-8 text-blue-600" />
            </motion.div>
            <p className="text-lg mb-4">For appointments and inquiries:</p>
            <motion.a
              href={`tel:${treatmentData.contact?.phone}`}
              className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              {treatmentData.contact?.phone}
              <ArrowRight className="w-6 h-6" />
            </motion.a>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
              <ul className="space-y-2 text-left">
                {treatmentData.contact?.notes && Array.isArray(treatmentData.contact.notes) && treatmentData.contact.notes.map((note, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full"></span>
                    <span>{note}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default TreatmentPage;