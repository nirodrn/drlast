import {
  Award,
  Heart,
  Shield,
  Target,
  User,
  FileText,
} from "lucide-react";

export function About() {
  return (
    <div className="bg-white w-full overflow-hidden">
      {/* Hero Section with Modern Design */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16"> {/* Changed from py-32 to py-16 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute transform rotate-45 -right-20 -top-20 w-80 h-80 bg-blue-100 rounded-full"></div>
          <div className="absolute -left-20 top-40 w-60 h-60 bg-blue-50 rounded-full"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Who We Are
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-3xl mx-auto">
              With more than 25 years of experience in Medicine, Dr. Daniel has
              earned immense trust and respect among medical and aesthetic
              clients across Canada and around the world.
            </p>
          </div>
        </div>
      </div>
      {/* Vision & Philosophy Section with Modern Cards */}
      <div className="py-16 bg-white relative"> {/* Changed from py-24 to py-16 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Our Vision & Philosophy
            </h2>
            <p className="text-lg text-blue-600 font-medium">
              Find Your Unique You
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: "Our Philosophy",
                description:
                  'We believe that we can boost your confidence by creating a difference with your imperfections as close to your "NATURAL YOU" — with a subtle touch, without exaggeration!',
              },
              {
                icon: Target,
                title: "Our Focus",
                description:
                  "To collaborate with you on a professional treatment plan so you'll be confident with the best version of yourself.",
              },
              {
                icon: Shield,
                title: "Our Aim",
                description:
                  "To give you a great positive experience because we believe in building a foundation of trust, providing professional, unbiased information based on available resources.",
              },
              {
                icon: Award,
                title: "Our Success",
                description:
                  "Is dependent on the trust that you give in allowing us to be part of your life-changing journey to boosting your confidence.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl rotate-45 group-hover:rotate-[135deg] transition-transform duration-300"></div>
                  <item.icon className="w-8 h-8 text-white absolute top-2 left-2" />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* About Dr. Daniel Section with Modern Layout */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-14 relative overflow-hidden"> {/* Changed from py-24 to py-16 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute transform -rotate-45 -left-40 top-20 w-96 h-96 bg-blue-100 rounded-full"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-blue-600 rounded-2xl rotate-45 mb-6">
                <User  className="w-8 h-8 text-white -rotate-45" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                About Dr. Daniel
              </h2>
              <div className="relative w-64 h-64 mx-auto mb-12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-blue-400 animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-100"></div>
                <div className="absolute -inset-4 rounded-full border-2 border-blue-200 opacity-50"></div>
                <div className="absolute -inset-8 rounded-full border-2 border-blue-100 opacity-30"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden group transform transition-transform duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img
                    src="https://i.ibb.co/cSVwK5F0/IMG-6669.jpg"
                    alt="Dr. Daniel"
                    className="w-full h-full object-cover object-center rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6 text-gray-600 bg-white rounded-3xl p-8 shadow-lg">
              {[
                "It's the trust that was built through his treatment outcomes where he carefully applied his ample knowledge, skills, expertise, and passion to elevate the quality of life empowering his clients.",
                "It's the respect that was earned as he gives his all to listen, care, and develop good understanding with his clients.",
                "His hunger for more knowledge and passion to deliver only the best care is manifested with the countless amount of aesthetic training, qualifications, and certifications Dr.Daniel had accomplished.",
                "As a Physician, Dr. Daniel approaches each and every client with a unique Psychosomatic, Anatomical, physiological and cultural sensitivity, prioritizing safety, patient education and providing autonomy to patients with an emphasis on preventative medicine in regard to preserving their natural beauty.",
                "Dr. Daniel desires to give safe and effective treatments with superb results with the hope of helping the clients gain their confidence.",
              ].map((text, index) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed hover:text-blue-600 transition-colors duration-300"
                >
                  {text}
                </p>
              ))}
              <p className="text-lg font-semibold text-center mt-6 text-blue-600">
                It's never too late to find the unique you!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Certifications Section with Modern List */}
      <div className="bg-white py-14"> {/* Changed from py-24 to py-14 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-blue-600 rounded-2xl rotate-45 mb-6">
              <Award className="w-8 h-8 text-white -rotate-45" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Certifications and Memberships
            </h2>
            <p className="text-lg text-blue-600 font-medium">
              Dr. Shevanta Daniel
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-3xl p-8">
              {[
                "Dr. Shevanta Daniel MD CCFP FCFP",
                "Certified Specialist, College of Family Physicians of Canada",
                "Fellow, College of Family Physicians of Canada",
                "Member, Ontario Medical Association",
                "Licensed, College of Physicians and Surgeons of Ontario",
                "Member, Canadian Medical Protective Association",
                "Board Certified Aesthetic Physician CBAM",
                "Member IMCAS",
                "Member CAMA",
              ].map((cert, index) => (
                <div
                  key={index}
                  className="group flex items-center p-4 hover:bg-white rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="p-2 bg-blue-600 rounded-lg mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                    {cert}
                  </span>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* General Information Section with Modern Cards */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-11 mb-12"> {/* mb-12 for spacing */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-blue-600 rounded-2xl rotate-45 mb-6">
                <FileText className="w-8 h-8 text-white -rotate-45" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                General Information
              </h2>
            </div>
            <div className="space-y-6 text-gray-600">
              {[
                "All information on this website are provided for general informational purposes only. This site does not provide actual professional advice. Reliance on any information provided on this website is solely at your own risk.",
                "This website authorizes you to view general information on the site solely for your personal, noncommercial use. Any other use of the material is strictly prohibited without our prior written permission.",
                "Dr. Daniel Esthetixs does not own all images featured on the website. All rights belong to its rightful owner/owners. No copyright infringement intended.",
              ].map((text, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-lg leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}