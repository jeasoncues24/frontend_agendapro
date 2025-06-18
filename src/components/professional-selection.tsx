"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Calendar, Clock, User, DollarSign, Edit } from "lucide-react"

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface Professional {
  id: string
  name: string
  initials: string
}

interface ProfessionalSelectionProps {
  service: Service
  date: string
  time: string
  professionals: Professional[]
  onSelect: (professional: Professional | null) => void
  onBack: () => void
}

export default function ProfessionalSelection({
  service,
  date,
  time,
  professionals,
  onSelect,
  onBack,
}: ProfessionalSelectionProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)

  const handleProfessionalSelect = (professional: Professional | null) => {
    setSelectedProfessional(professional)
    onSelect(professional)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white rounded-full" />
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Peluquería de Jeason Arturo</h1>
              <p className="text-sm text-gray-500">Sucursal 1</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <span className="text-sm font-medium">Fecha y hora</span>
            </div>
            <div className="w-8 h-px bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                2
              </div>
              <span className="text-sm font-medium">Profesional</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs font-medium">
                3
              </div>
              <span className="text-sm text-gray-400">Datos de contacto</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professional Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Selecciona el/los profesionales para tus servicios</h2>

            <div className="space-y-4">
              {/* First Available Professional */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProfessionalSelect(professionals[0])}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                      A
                    </div>
                    <div>
                      <h3 className="font-medium">Primer profesional disponible</h3>
                      <p className="text-sm text-gray-500">17 de junio de 2025 11:00 am</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Professionals */}
              {professionals.map((professional) => (
                <Card
                  key={professional.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProfessionalSelect(professional)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                        {professional.initials}
                      </div>
                      <div>
                        <h3 className="font-medium">{professional.name}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={onBack}>
                Anterior
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-900" disabled={!selectedProfessional}>
                Siguiente
              </Button>
            </div>
          </div>

          {/* Service Summary */}
          <div>
            <h3 className="font-medium mb-4">Información de tus servicios</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <h4 className="font-medium">{service.name}</h4>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>S/{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>11:00 am a 11:30 am</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Jeason Arturo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
