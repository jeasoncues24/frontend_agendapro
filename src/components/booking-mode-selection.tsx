"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Clock } from "lucide-react"
import Image from "next/image"

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
  logoUrl?: string
  branchName?: string
  branchUbication?: string
}

export default function BookingModeSelection({ cart, onSelect, onBack, logoUrl = "/placeholder.svg", branchName = "Sucursal", branchUbication = "" }: BookingModeSelectionProps) {
  const expandedServices = cart.flatMap((item) =>
    Array(item.quantity)
      .fill(null)
      .map(() => item.service),
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-100 relative">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">Agendar servicios</h1>
        <span className="w-8" /> 
      </header>

      {/* Bloque visual de sucursal */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-6">
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={branchName}
            height={60}
            width={60}
            className="mb-2 rounded-xl shadow-2xl"
          />
          <div className="flex-1">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{branchName}</h1>
              {branchUbication && <p className="text-gray text-xs">{branchUbication}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-32 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Elige cómo quieres agendar tus servicios</h2>
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
                <div className="w-20 h-20 mx-auto mb-4 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-10 bg-green-500 rounded relative">
                    <div className="absolute top-1 left-1 w-10 h-2 bg-green-600 rounded"></div>
                    <div className="absolute top-4 left-1 w-10 h-2 bg-green-600 rounded"></div>
                    <div className="absolute top-7 left-1 w-10 h-2 bg-green-600 rounded"></div>
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
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <div className="w-6 h-5 bg-green-500 rounded mr-2 inline-block"></div>
                    <div className="w-6 h-5 bg-blue-500 rounded inline-block"></div>
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
        </div>
        {/* Service Summary */}
        <div className="md:col-span-1">
          <h3 className="font-medium mb-4">Tus servicios</h3>
          <div className="space-y-3">
            {expandedServices.map((service, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-3">
                  <h4 className="font-medium mb-2">{service.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-1">S/{service.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
