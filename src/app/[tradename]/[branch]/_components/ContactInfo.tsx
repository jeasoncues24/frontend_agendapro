import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, Instagram } from "lucide-react";

interface ContactInfoProps {
  logoUrl: string;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  instagram?: string;
  address: string;
}

export default function ContactInfo({ logoUrl, name, rating, reviews, description, instagram, address }: ContactInfoProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
      <div className="flex items-start gap-4">
        <Image
          src={logoUrl}
          alt={name}
          width={64}
          height={64}
          className="rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">{name}</span>
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener">
                <Instagram className="w-6 h-6 text-gray-400" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-base font-bold text-gray-800">{rating}</span>
            <a href="#reseñas" className="text-sm text-gray-500 underline ml-1">(Ver {reviews} reseñas)</a>
          </div>
          <div className="text-gray-700 text-sm mt-2">
            {showFullDesc ? description : description.slice(0, 80) + (description.length > 80 ? '...' : '')}
            {description.length > 80 && (
              <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-blue-600 font-semibold ml-1">
                {showFullDesc ? 'Ver menos' : 'Leer más'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 px-1 py-3 border-t">
        <MapPin className="w-5 h-5 text-[#33C955]" />
        <span className="font-semibold text-gray-800">{address}</span>
      </div>
    </div>
  );
}