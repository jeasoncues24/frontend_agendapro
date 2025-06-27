import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductForSale } from "@/hooks/useProductsForSale";
import { Button } from "@/components/ui/button";

interface ModalDetalleServicioProps {
    servicio: ProductForSale;
    onClose: () => void;
    onAddToCart: (servicio: ProductForSale, cantidad: number) => void;
}

const ModalDetalleServicio: React.FC<ModalDetalleServicioProps> = ({ servicio, onClose, onAddToCart }) => {
    const [cantidad, setCantidad] = useState(1);
    const tieneDescuento = servicio.price < 50; 
    const precioOriginal = tieneDescuento ? servicio.price + 15 : servicio.price;
    const porcentajeDescuento = tieneDescuento ? Math.round(100 - (servicio.price / precioOriginal) * 100) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className={`
                    bg-white shadow-xl
                    fixed bottom-0 left-0 right-0
                    rounded-t-2xl
                    w-full max-w-none
                    mx-auto
                    md:relative md:bottom-auto md:left-auto md:right-auto md:rounded-2xl md:w-full md:max-w-md
                    overflow-hidden
                `}
                style={{ maxHeight: '85vh' }}
            >
                <div className="flex items-center justify-between p-4">
                    <button onClick={onClose} className="bg-gray-100 rounded-full p-2">
                        <X className="w-6 h-6 text-black" />
                    </button>
                    {/* Puedes agregar aquí botones de compartir/favoritos si lo deseas */}
                </div>
                <div className="relative w-full h-90">
                    <Image
                        src={servicio.image ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${servicio.image}` : "/images/banner-salon.webp"}
                        alt={servicio.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-5 pb-18 md:pb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold">S/{servicio.price.toFixed(2)}</span>
                        {tieneDescuento && (
                            <>
                                <span className="bg-yellow-300 text-black font-bold px-2 py-1 rounded text-sm">-{porcentajeDescuento}%</span>
                                <span className="line-through text-gray-400 ml-1">S/{precioOriginal.toFixed(2)}</span>
                            </>
                        )}
                    </div>
                    <div className="text-lg font-semibold mb-1">{servicio.name}</div>
                    <div className="text-gray-500 text-sm mb-4">{servicio.duration} hora(s)</div>
                    <div className="hidden md:flex items-center justify-between mt-6">
                        <div className="flex items-center border rounded-full px-2 py-1 bg-gray-50">
                            <button
                                className="text-2xl px-2"
                                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-medium text-lg">{cantidad}</span>
                            <button
                                className="text-2xl px-2"
                                onClick={() => setCantidad((c) => c + 1)}
                            >
                                +
                            </button>
                        </div>
                        <Button
                            className="bg-[#33C955] hover:bg-[#28a745] text-white rounded-full px-8 py-4 shadow-lg flex flex-col items-center justify-center min-h-[56px]"
                            onClick={() => onAddToCart(servicio, cantidad)}
                        >
                            <span className="text-base leading-tight">Agregar</span>
                            <span className="text-lg font-bold leading-tight">S/{(servicio.price * cantidad).toFixed(2)}</span>
                        </Button>
                    </div>
                </div>
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 shadow-2xl backdrop-blur-md z-40">
                    <div className="flex items-center justify-between py-3 px-4">
                        <div className="flex items-center justify-center min-h-[56px] border border-gray-100 rounded-full px-2 py-1 bg-white w-36">
                            <button
                                className="text-2xl px-2"
                                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-medium text-lg">{cantidad}</span>
                            <button
                                className="text-2xl px-2"
                                onClick={() => setCantidad((c) => c + 1)}
                            >
                                +
                            </button>
                        </div>
                        <Button
                            className="bg-[#34C85A] hover:bg-[#34C85A] text-white rounded-full px-8 py-4 shadow-lg flex flex-col items-center justify-center min-h-[56px] w-48"
                            onClick={() => onAddToCart(servicio, cantidad)}
                        >
                            <span className="text-lg leading-tight font-bold">Agregar</span>
                            <span className="text-lg leading-tight">S/{(servicio.price * cantidad).toFixed(2)}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalDetalleServicio; 