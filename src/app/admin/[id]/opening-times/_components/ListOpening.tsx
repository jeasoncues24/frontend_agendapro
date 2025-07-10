import { useState } from "react";

export default function ListOpening({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Estado de tu local</h1>
                    <div className="text-base text-blue-600 font-semibold">Sucursal Principal</div>
                </div>
            </div>
            <div className="relative min-h-screen bg-white p-8">
                {/* Estado visual en la esquina superior derecha */}
                <div className="absolute top-6 right-8 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-gray-500'}`}>{isOpen ? 'Abierto' : 'Cerrado'}</span>
                </div>

                <div className="flex flex-col gap-8 max-w-2xl ">
                    <div className="flex items-center gap-4  p-6">
                        {/* Switch */}
                        <button
                            className={`relative w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`}
                            onClick={() => setIsOpen(open => !open)}
                            aria-label={isOpen ? 'Cerrar local' : 'Abrir local'}
                        >
                            <span
                                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${isOpen ? 'translate-x-6' : ''}`}
                            ></span>
                        </button>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">Estado de tu local</span>
                            <span className="text-sm text-gray-500">{isOpen ? 'Abierto hasta las 21:30 h.' : 'Cerrado por hoy.'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}