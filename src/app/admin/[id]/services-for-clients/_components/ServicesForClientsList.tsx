"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search } from "lucide-react";

export default function ServicesForClientsList({ companyId, establishmentId }: { companyId: string, establishmentId?: string }) {
    return (
        <div className="max-w-full mx-auto p-6 bg-white min-h-screen">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Servicios</h1>
                    <p className="text-gray-600">Aquí puedes ver los servicios de la sucursal.</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </Button>
                    <Button className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Crear servicio</span>
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por nombre"
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
    )
}