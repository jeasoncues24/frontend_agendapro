import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Professional } from "@/types/booking";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfessionalSelectionProps {
  service: any;
  date: string;
  time: string;
  professionals: Professional[];
  onSelect: (professional: Professional | null) => void;
  onBack: () => void;
  branchName?: string;
  logoUrl?: string;
  cart?: any[];
  quantity?: number;
}

export default function ProfessionalSelection({
  professionals,
  onSelect,
  onBack,
  branchName = "Sucursal",
  logoUrl = "/placeholder.svg",
  cart,
  service,
  quantity = 1,
}: ProfessionalSelectionProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [open, setOpen] = useState(false);
  // Calcular total de servicios
  const totalServicios = cart ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : quantity;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-100 relative">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">Reservar servicio</h1>
        <span className="w-8" />
      </header>

      {/* Accordion resumen de servicios */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <button
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-3 focus:outline-none"
            onClick={() => setOpen((v) => !v)}
            style={{ minHeight: 64 }}
          >
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={branchName}
              height={48}
              width={48}
              className="rounded-full bg-white border border-gray-100 object-cover"
            />
            <div className="flex-1 text-left">
              <div className="text-lg font-bold text-gray-900 leading-tight">{branchName}</div>
              <div className="text-sm text-gray-400">{totalServicios} Servicio{totalServicios > 1 ? "s" : ""}</div>
            </div>
            <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
          {open && (
            <div className="bg-gray-50 rounded-b-2xl px-4 py-2">
              {(cart && cart.length > 0 ? cart : [{ service, quantity }]).map((item, idx) => (
                <div key={item.service.id} className="flex items-center justify-between py-2 text-base border-b last:border-b-0 border-gray-100">
                  <span className="text-gray-900">{item.service.name}</span>
                  <span className="text-gray-500 font-semibold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Selecciona el/los profesionales para tus servicios</h2>
          <div className="space-y-4">
            {professionals.length === 0 ? (
              <div className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl">
                No hay profesionales disponibles para este horario.
              </div>
            ) : (
              professionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => setSelectedProfessional(pro)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition
                    ${selectedProfessional?.id === pro.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}
                  `}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
                    {pro.user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">{pro.user.name}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="h-16 rounded-full px-8 flex-1" onClick={onBack}>Anterior</Button>
          <Button
            className="bg-green-500 h-16 text-white rounded-full px-8 flex-1"
            disabled={!selectedProfessional}
            onClick={() => onSelect(selectedProfessional)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
} 