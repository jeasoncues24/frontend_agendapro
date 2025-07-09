import Image from "next/image";
import { User } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  lastName?: string;
  initials: string;
  photoUrl?: string;
}

export default function CollaboratorComponent({ professional }: { professional: Professional[] }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-5 h-5 text-gray-500" />
        <span className="font-bold text-base">Profesionales</span>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {professional.map((pro) => (
          <div key={pro.id} className="flex flex-col items-center min-w-[80px]">
            {pro.photoUrl ? (
              <Image
                src={pro.photoUrl}
                alt={pro.name}
                width={56}
                height={56}
                className="rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 shadow border-2 border-white mb-2">
                {pro.initials}
              </div>
            )}
            <span className="text-xs text-gray-900 text-center font-medium">{pro.name}</span>
            {pro.lastName && <span className="text-xs text-gray-500 text-center">{pro.lastName}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}