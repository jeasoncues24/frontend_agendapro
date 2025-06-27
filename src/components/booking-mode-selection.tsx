"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Clock } from "lucide-react"

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface BookingModeSelectionProps {
  cart: { service: Service; quantity: number }[]
  onSelect: (mode: "together" | "separate") => void
  onBack: () => void
}

export default function BookingModeSelection({ cart, onSelect, onBack }: BookingModeSelectionProps) {
  const expandedServices = cart.flatMap((item) =>
    Array(item.quantity)
      .fill(null)
      .map(() => item.service),
  )

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Elige como quieres agendar tus servicios</h2>

            <div className="text-center mb-8">
              <p className="text-gray-600">Selecciona una opción</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agendar uno tras otro */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-gray-300"
                onClick={() => onSelect("together")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-12 bg-green-500 rounded relative">
                      <div className="absolute top-1 left-1 w-14 h-2 bg-green-600 rounded"></div>
                      <div className="absolute top-4 left-1 w-14 h-2 bg-green-600 rounded"></div>
                      <div className="absolute top-7 left-1 w-14 h-2 bg-green-600 rounded"></div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Agendar uno tras otro</h3>
                  <p className="text-sm text-gray-600 mb-2">Realiza todos tus servicios el mismo día.</p>
                  <p className="text-sm font-medium text-gray-800">Se realizarán seguidos, uno tras otro.</p>
                </CardContent>
              </Card>

              {/* Agendar por separado */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-gray-300"
                onClick={() => onSelect("separate")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="relative">
                      <div className="w-8 h-6 bg-green-500 rounded mr-2 inline-block"></div>
                      <div className="w-8 h-6 bg-blue-500 rounded inline-block"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full absolute -bottom-1 -right-1"></div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Agendar por separado</h3>
                  <p className="text-sm text-gray-600">
                    Selecciona fecha, hora y profesionales para <strong>cada uno de tus servicios</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mt-8">
              <Button className="bg-gray-800 hover:bg-gray-900" disabled>
                Siguiente
              </Button>
            </div>
          </div>

          {/* Service Summary */}
          <div>
            <h3 className="font-medium mb-4">Información de tus servicios</h3>
            <div className="space-y-3">
              {expandedServices.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <h4 className="font-medium mb-2">{service.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
