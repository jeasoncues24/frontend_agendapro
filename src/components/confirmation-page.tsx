"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, User, CircleCheck } from "lucide-react"

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

interface BookingData {
  service: Service
  date: string
  time: string
  professional: Professional | null
  customerName: string
  customerEmail: string
}

interface ConfirmationPageProps {
  bookingData: BookingData
  onBookAnother: () => void
}

export default function ConfirmationPage({ bookingData, onBookAnother }: ConfirmationPageProps) {
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
            <h1 className="text-xl font-semibold text-gray-900">Peluquería de Jeason Arturo</h1>
          </div>
          <Button variant="ghost" className="text-gray-600">
            Iniciar sesión
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleCheck className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Gracias {bookingData.customerName} por agendar en Peluquería de Jeason Arturo!
          </h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Servicio</p>
                <p className="text-gray-600">{bookingData.service.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Fecha y hora</p>
                <p className="text-gray-600">Martes 17 Junio - 11:00 am</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Duración</p>
                <p className="text-gray-600">{bookingData.service.duration} Minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Ubicación</p>
                <p className="text-gray-600">Sucursal 1, Oficina 101,...</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Precio</p>
                <p className="text-gray-600">S/{bookingData.service.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <p className="text-gray-600 mb-6">Enviamos la información de tu reserva a {bookingData.customerEmail}</p>
          <Button onClick={onBookAnother} className="bg-gray-800 hover:bg-gray-900">
            Agendar otra cita
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center leading-relaxed">
          Recuerda que tu compra solo es válida para los servicios y horarios, para los cuales realizaste la reserva.
          Cualquier cambio o cancelación es exclusiva responsabilidad de Peluquería de Jeason Arturo. AgendaPro, actúa
          solamente como intermediario en la gestión y procesamiento del pago de la reserva.
        </div>

        
      </div>
    </div>
  )
}
