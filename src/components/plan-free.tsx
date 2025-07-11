import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';


function LogoWithSkeleton({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full">
            {!loaded && (
                <div className="absolute inset-0 w-full h-full bg-gray-100 animate-pulse rounded-xl" />
            )}
            <img
                src={src}
                alt={alt}
                className="object-cover w-full h-full transition-opacity duration-300 rounded-xl"
                style={{ opacity: loaded ? 1 : 0 }}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

export default function PlanFreeComponent() {
    return (
        <div className="mt-32 flex items-center justify-center  px-2 py-8">
            <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
                {/* Columna izquierda */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">AgendaYa</span>
                            <span className="text-sm text-gray-500 font-medium">cloud</span>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Desbloquea mas funcionalidades</h2>
                    <p className="text-gray-700 mb-5">
                        <span className="font-semibold">Actualice a Premium ahora</span> para desbloquear búsquedas avanzadas, encontrar más empresas y tomadores de decisiones.
                    </p>
                    <ul className="mb-8 space-y-2">
                        <li className="flex items-center gap-2 text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="font-medium">Reserva</span> tus citas ilimitadas.</li>
                        <li className="flex items-center gap-2 text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="font-medium">Módulo de ventas</span> para vender tus productos.</li>
                        <li className="flex items-center gap-2 text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="font-medium">+2</span> sucursales.</li>
                        <li className="flex items-center gap-2 text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="font-medium">+5</span> colaboradores.</li>
                    </ul>
                    <button className="bg-[#0a2540] hover:bg-[#183153] text-white font-semibold rounded-lg px-6 py-3 text-base shadow transition-all flex items-center gap-2 w-fit">
                        Actualizar a Premium <span className="ml-1">☆</span>
                    </button>
                </div>
                {/* Columna derecha: grid de logos/fotos */}
                <div className="flex-1 relative min-h-[400px]">
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src="/images/subscription/logo4.jpg"
                            alt="logo"
                            fill
                            className="object-cover w-full h-full rounded-3xl"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[#eaf6fb] via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}