import React from "react";
import { ArrowRight } from "lucide-react";
interface ServiceCardProps {
  name: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}
export const ServiceCard = ({
  name,
  description,
  image,
  icon,
}: ServiceCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-blue-600">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <button className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
