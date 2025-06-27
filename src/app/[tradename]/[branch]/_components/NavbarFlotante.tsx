import { Heart, Tag, User } from "lucide-react";
import { AiFillHome } from "react-icons/ai";

export default function NavbarFlotante() {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md  z-40">
            <div className="flex justify-around py-3 px-4">
              <button className="flex flex-col items-center gap-1 px-4 py-2 transition-colors">
                <AiFillHome className="w-6 h-6 text-[#FF4420]" />
                <span className="text-xs font-medium text-[#FF4420]">Inicio</span>
              </button>
              <button className="flex flex-col items-center gap-1 px-4 py-2 transition-colors">
                <Tag className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">Ofertas</span>
              </button>
              <button className="flex flex-col items-center gap-1 px-4 py-2 transition-colors">
                <Heart className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">Favoritos</span>
              </button>
              <button className="flex flex-col items-center gap-1 px-4 py-2 transition-colors">
                <User className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">Cuenta</span>
              </button>
            </div>
        </div>
    )
}