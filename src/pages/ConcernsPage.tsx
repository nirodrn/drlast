import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


interface Concern {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  treatments: string[];
}

const ConcernsPage: React.FC = () => {
  const [expandedConcern, setExpandedConcern] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/book-appointment');  
  };
  const concerns: Concern[] = [
    {
      id: 1,
      title: "Acne / Pimples",
      shortDescription: "Clogged pores cause inflammation, breakouts, and visible skin imperfections.",
      fullDescription: "Acne and pimples occur when hair follicles become clogged with oil, dead skin cells, and bacteria. This leads to inflammation, redness, and visible spots that may be painful or itchy. Common triggers include hormonal changes, stress, and dietary factors.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products"]
    },
    {
      id: 2,
      title: "Scarring",
      shortDescription: "Healed injuries leave uneven textures, discoloration, or depressions on skin.",
      fullDescription: "Scars are formed as the skin heals after an injury, surgery, or severe acne. Depending on the cause, they may appear as raised, sunken, or discolored patches. Scarring can disrupt the skin's smoothness and even tone, affecting confidence.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Surgical excisions"]
    },
    {
      id: 3,
      title: "Acne / Pimple Related Scarring",
      shortDescription: "Severe acne leaves pits, marks, and uneven skin texture.",
      fullDescription: "When severe acne heals, it can leave scars that create depressions, discoloration, or uneven skin texture. These scars often become more visible over time and may require advanced treatments to restore the skin's smoothness and radiance.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Surgical excisions"]
    },
    {
      id: 4,
      title: "Aging Skin",
      shortDescription: "Wrinkles, sagging, and dullness result from reduced collagen and elasticity.",
      fullDescription: "As we age, collagen and elastin production slows down, causing the skin to lose firmness and elasticity. Wrinkles, fine lines, and sagging become more noticeable, and the skin may appear dull and tired due to reduced cell renewal.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Bio stimulators", "HA fillers"]
    },
    {
      id: 5,
      title: "Skin Appearance / Texture",
      shortDescription: "Uneven texture and dullness arise from dryness or dead skin buildup.",
      fullDescription: "Uneven skin texture and dullness result from a buildup of dead skin cells, dehydration, or scarring. The skin may feel rough, appear patchy, or lack its natural glow, impacting overall radiance and smoothness.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Bio stimulators", "HA fillers"]
    },
    {
      id: 6,
      title: "Skin Darkness / Discoloration",
      shortDescription: "Hyperpigmentation results from sun damage, hormones, or inflammatory responses.",
      fullDescription: "Skin discoloration, such as dark spots or uneven tone, occurs due to excessive melanin production. Factors like sun exposure, hormonal changes, or post-inflammatory pigmentation can contribute to this, dulling the skin's appearance.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Bio stimulators", "HA fillers"]
    },
    {
      id: 7,
      title: "Under Eye Hollows",
      shortDescription: "Sunken under-eyes create a tired appearance due to aging or genetics.",
      fullDescription: "Hollows under the eyes create a sunken or shadowed appearance, often linked to aging, genetics, or volume loss. This can make the face look fatigued or older than it is, even with adequate rest.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "Bio stimulators", "HA fillers"]
    },
    {
      id: 8,
      title: "Under Eye Dark Circles",
      shortDescription: "Dark circles occur from pigmentation, poor circulation, or thin under-eye skin.",
      fullDescription: "Dark circles are caused by thin skin, poor blood circulation, or pigmentation around the eyes. This concern can result from fatigue, genetics, or allergies, and it often makes the face look tired and aged.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "HA fillers"]
    },
    {
      id: 9,
      title: "Double Chin / Turkey Neck",
      shortDescription: "Sagging skin or excess fat disrupts chin and neck contours.",
      fullDescription: "Excess fat or loose skin under the chin and neck leads to the appearance of a double chin or turkey neck. Aging, weight gain, or genetics are common causes, and this concern can obscure the natural contours of the jawline.",
      treatments: ["Deoxycholic Acid", "Bio stimulators", "Thread lift"]
    },
    {
      id: 10,
      title: "Excessive Sweating",
      shortDescription: "Hyperhidrosis causes abnormal sweating, affecting confidence and daily activities.",
      fullDescription: "Hyperhidrosis, or excessive sweating, causes discomfort and embarrassment, particularly in the underarms, hands, and feet. It can interfere with daily activities and impact confidence, often unrelated to heat or exercise.",
      treatments: ["Botox (Neuromodulator)"]
    },
    {
      id: 11,
      title: "Face Shape",
      shortDescription: "Uneven contours or volume loss impact the face's aesthetic symmetry.",
      fullDescription: "An imbalanced or undefined face shape can result from aging, fat distribution, or genetics. Concerns may include asymmetry, sagging, or lack of contour, affecting overall facial harmony and aesthetics.",
      treatments: ["Microneedling", "Microneedling with PRP", "HA fillers", "Bio stimulators"]
    },
    {
      id: 12,
      title: "Facial Slimming",
      shortDescription: "Excess fullness obscures jawline contours and facial harmony.",
      fullDescription: "Excess fullness or fat on the face can obscure natural contours and jawline definition. This concern often affects confidence and facial proportions, regardless of body weight or size.",
      treatments: ["Microneedling", "HA fillers", "Neuromodulators"]
    },
    {
      id: 13,
      title: "Hair Loss",
      shortDescription: "Thinning or balding due to genetics, aging, or hormonal imbalance affects appearance.",
      fullDescription: "Hair thinning or baldness can result from genetics, hormonal imbalances, stress, or medical conditions. It can significantly affect self-esteem and appearance, with noticeable changes to hair density over time.",
      treatments: ["PRP Hair treatments", "Hair mesotherapy", "Hair exosomes"]
    },
    {
      id: 14,
      title: "Neck Lines / Laxity",
      shortDescription: "Wrinkles and sagging in the neck result from aging and collagen loss.",
      fullDescription: "Wrinkles and sagging skin around the neck develop due to aging, loss of collagen, or repeated movements. These lines can prematurely age the appearance, creating a concern for many individuals.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "HA fillers", "Bio stimulators", "Thread lift"]
    },
    {
      id: 15,
      title: "Face / Forehead Wrinkles",
      shortDescription: "Fine lines develop from aging, repeated expressions, and reduced elasticity.",
      fullDescription: "Dynamic wrinkles on the face and forehead appear due to repetitive expressions and collagen loss. These fine lines deepen over time, becoming a visible sign of aging that many wish to address.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "HA fillers", "Bio stimulators", "Thread lift"]
    },
    {
      id: 16,
      title: "Skin Wrinkling on Hands",
      shortDescription: "Wrinkles on hands arise from aging, sun exposure, or dehydration.",
      fullDescription: "The skin on hands becomes thinner and more prone to wrinkles due to aging, sun exposure, or dehydration. This often results in a loss of smoothness and youthful appearance.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "HA fillers", "Bio stimulators"]
    },
    {
      id: 17,
      title: "Nasolabial Folds",
      shortDescription: "Deep lines near the nose and mouth become pronounced with age.",
      fullDescription: "These deep lines run from the nose to the mouth and become more pronounced with aging or volume loss in the cheeks. They create an aged appearance and are a common concern for many individuals.",
      treatments: ["Microneedling", "Microneedling with PRP", "Chemical Peels", "Medical grade skin care products", "HA fillers", "Bio stimulators", "Thread lift"]
    },
    {
      id: 18,
      title: "Short Chin",
      shortDescription: "A recessed chin disrupts facial balance and aesthetic harmony.",
      fullDescription: "A recessed or short chin can disrupt facial balance and harmony, making the face appear smaller or less defined. This concern often impacts the profile and overall appearance.",
      treatments: ["HA fillers", "Bio stimulators"]
    },
    {
      id: 19,
      title: "Nose Shape",
      shortDescription: "Asymmetry or bumps in the nose affect facial proportions.",
      fullDescription: "Irregularities in nose shape, such as bumps, asymmetry, or lack of definition, can affect the facial balance. These concerns may be hereditary or due to trauma, leading individuals to seek corrective options.",
      treatments: ["Microneedling/ Microneedling with PRP", "Neuromodulators", "Chemical Peels", "Medical grade skin care products", "HA fillers", "Bio stimulators", "Thread lift"]
    },
    {
      id: 20,
      title: "Lack of Male Genital Performance",
      shortDescription: "Reduced function affects confidence and satisfaction.",
      fullDescription: "Age, stress, or medical issues can lead to decreased male genital performance, impacting confidence and satisfaction. Treatments aim to restore function, improve circulation, and enhance overall performance.",
      treatments: ["Book your consultation to explore options (P SHOT)"]
    },
    {
      id: 21,
      title: "Lack of Female Sexual Performance",
      shortDescription: "Aging or hormonal changes affect satisfaction.",
      fullDescription: "Aging, hormonal changes, or childbirth may affect female sexual performance, leading to decreased satisfaction or comfort. Treatments focus on improving sensitivity, hydration, and confidence.",
      treatments: ["Book your consultation to explore options (O SHOT)"]
    },
    {
      id: 22,
      title: "Female Stress Urinary Incontinence",
      shortDescription: "Weak pelvic muscles cause leakage.",
      fullDescription: "Weak pelvic muscles or aging may lead to involuntary urine leakage during physical activity, sneezing, or laughing. Treatments target muscle strengthening and improved bladder control for a better quality of life.",
      treatments: ["Book your consultation to explore options (O SHOT)"]
    },
    {
      id: 23,
      title: "Male Genital Rejuvenation",
      shortDescription: "Enhances performance, aesthetics, and confidence.",
      fullDescription: "Concerns about aesthetics, size, or performance often drive individuals to seek rejuvenation. Treatments aim to enhance appearance, sensitivity, and overall confidence.",
      treatments: ["Book your consultation to explore options (P SHOT)"]
    },
    {
      id: 24,
      title: "Female Genital Rejuvenation",
      shortDescription: "Restores function, appearance, and confidence.",
      fullDescription: "Changes in appearance, tightness, or sensitivity due to childbirth or aging may affect confidence and comfort. Treatments focus on restoring function, aesthetics, and overall satisfaction.",
      treatments: ["Book your consultation to explore options (O SHOT)"]
    },
    {
      id: 25,
      title: "Hip Dips",
      shortDescription: "Indentations on hips disrupt curves.",
      fullDescription: "Indentations on the sides of hips disrupt the natural curves, affecting body proportions. This concern often leads individuals to seek solutions for a smoother, more balanced silhouette.",
      treatments: ["HA fillers", "Bio stimulators (Non-surgical butt lift with Sculptra)"]
    },
    {
      id: 26,
      title: "Lack of Buttock Volume",
      shortDescription: "Flat buttocks disrupt contours.",
      fullDescription: "Flat or uneven buttocks due to genetics, aging, or weight fluctuations impact the body's overall contour. Treatments focus on enhancing volume and achieving a natural, shapely appearance.",
      treatments: ["HA fillers", "Bio stimulators (Non-surgical butt lift with Sculptra)"]
    }
  ];

  const categories = [
    "all",
    "facial",
    "body",
    "intimate",
    "skin"
  ];

  const toggleConcern = (id: number) => {
    setExpandedConcern(expandedConcern === id ? null : id);
  };

  // Function to categorize concerns
  const getConcernCategory = (concern: Concern): string => {
    const facialTerms = ['face', 'chin', 'nose', 'eye', 'wrinkle', 'nasolabial', 'facial'];
    const bodyTerms = ['buttock', 'hip', 'hand', 'neck', 'sweating'];
    const intimateTerms = ['genital', 'sexual', 'urinary', 'male', 'female', 'p shot', 'o shot'];
    const skinTerms = ['skin', 'acne', 'pimple', 'scar', 'aging', 'texture', 'discoloration', 'dark'];

    const title = concern.title.toLowerCase();
    const desc = concern.fullDescription.toLowerCase();

    if (facialTerms.some(term => title.includes(term) || desc.includes(term))) return 'facial';
    if (bodyTerms.some(term => title.includes(term) || desc.includes(term))) return 'body';
    if (intimateTerms.some(term => title.includes(term) || desc.includes(term))) return 'intimate';
    if (skinTerms.some(term => title.includes(term) || desc.includes(term))) return 'skin';
    
    return 'all';
  };

  // Filter concerns based on search and category
  const filteredConcerns = concerns.filter(concern => {
    const matchesSearch = 
      concern.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      concern.fullDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      getConcernCategory(concern) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-800">Skin & Body Concerns</h1>
        <p className="text-center text-gray-600 mb-10">
          Explore our comprehensive range of treatments for your specific concerns at DrDaniel Esthetixs
        </p>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search concerns..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Concerns List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredConcerns.length > 0 ? (
            filteredConcerns.map((concern) => (
              <div 
                key={concern.id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-5 cursor-pointer flex justify-between items-center bg-gradient-to-r from-blue-50 to-white"
                  onClick={() => toggleConcern(concern.id)}
                >
                  <h3 className="text-xl font-semibold text-blue-800">{concern.title}</h3>
                  <div className="text-blue-600">
                    {expandedConcern === concern.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                
                {/* Short description always visible */}
                <div className="px-5 py-2 border-t border-gray-100 bg-white">
                  <p className="text-gray-600">{concern.shortDescription}</p>
                </div>
                
                {/* Expanded content */}
                {expandedConcern === concern.id && (
                  <div className="px-5 pt-3 pb-5 bg-white border-t border-gray-100">
                    <div className="mb-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">About This Concern:</h4>
                      <p className="text-gray-600">{concern.fullDescription}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-2">Treatment Options at DrDaniel Esthetixs:</h4>
                      <ul className="list-disc list-inside text-gray-600 ml-2">
                        {concern.treatments.map((treatment, index) => (
                          <li key={index} className="mb-1">{treatment}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-5">
                      <button  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                onClick={handleNavigate}
                      
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 col-span-full">
              <p className="text-lg text-gray-600">No concerns match your search criteria.</p>
              <p className="mt-2 text-blue-600 cursor-pointer" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Reset filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConcernsPage;