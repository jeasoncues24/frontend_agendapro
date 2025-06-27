"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Calendar, Clock, MapPin, DollarSign, User, CheckCircle, Trash2, CheckCircle2, CircleCheck } from "lucide-react"

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

interface BookedService {
  service: Service
  date: string
  time: string
  professional: Professional
}

interface MultiServiceFlowProps {
  cart: { service: Service; quantity: number }[]
  professionals: Professional[]
  onComplete: () => void
  onBack: () => void
}

export default function MultiServiceFlow({ cart, professionals, onComplete, onBack }: MultiServiceFlowProps) {
  const [currentStep, setCurrentStep] = useState<"professional" | "processing" | "datetime" | "confirmation">(
    "professional",
  )
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [bookedServices, setBookedServices] = useState<BookedService[]>([])
  const [currentBooking, setCurrentBooking] = useState<Partial<BookedService>>({})

  // Expandir servicios del carrito
  const expandedServices = cart.flatMap((item) =>
    Array(item.quantity)
      .fill(null)
      .map(() => item.service),
  )

  const currentService = expandedServices[currentServiceIndex]

  const handleProfessionalSelect = (professional: Professional) => {
    setCurrentBooking({ service: currentService, professional })
    setCurrentStep("processing")

    // Simular procesamiento
    setTimeout(() => {
      setCurrentStep("datetime")
    }, 2000)
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    const newBooking: BookedService = {
      service: currentService,
      date,
      time,
      professional: currentBooking.professional!,
    }

    setBookedServices((prev) => [...prev, newBooking])

    if (currentServiceIndex < expandedServices.length - 1) {
      // Ir al siguiente servicio
      setCurrentServiceIndex((prev) => prev + 1)
      setCurrentBooking({})
      setCurrentStep("professional")
    } else {
      // Todos los servicios completados
      setCurrentStep("confirmation")
    }
  }

  const removeBookedService = (index: number) => {
    setBookedServices((prev) => prev.filter((_, i) => i !== index))
  }

  const getTotalPrice = () => {
    return bookedServices.reduce((total, booking) => total + booking.service.price, 0)
  }

  if (currentStep === "professional") {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  1
                </div>
                <span className="text-sm font-medium">Profesional</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs font-medium">
                  2
                </div>
                <span className="text-sm text-gray-400">Fecha y hora</span>
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
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Selecciona el/los profesionales para tus servicios</h2>

              <div className="space-y-4">
                {expandedServices.map((service, index) => (
                  <Card key={index} className={index === currentServiceIndex ? "border-2 border-gray-800" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-500">
                              {index < currentServiceIndex
                                ? "Completado"
                                : index === currentServiceIndex
                                  ? "Primer profesional disponible"
                                  : "Pendiente"}
                            </p>
                          </div>
                        </div>
                        {index === currentServiceIndex && (
                          <Button variant="link" className="text-blue-600">
                            Cambiar profesional
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={onBack}>
                  Anterior
                </Button>
                <Button
                  className="bg-gray-800 hover:bg-gray-900"
                  onClick={() => handleProfessionalSelect(professionals[0])}
                >
                  Siguiente
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Información de tus servicios</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{expandedServices.map((s) => s.name).join(", ")}</p>
                {expandedServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{service.name}: Primer profesional disponible</span>
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  Cambiar modalidad de reserva
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  1
                </div>
                <span className="text-sm font-medium">Fecha y hora</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs font-medium">
                  2
                </div>
                <span className="text-sm text-gray-400">Profesional</span>
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

          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
              <Calendar className="w-full h-full" />
            </div>
            <p className="text-gray-600 text-lg">
              ¿Nos esperas un poco? estamos analizando las mejores opciones para ti...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "datetime") {
    return (
      <div className="min-h-screen bg-gray-50">
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
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Selecciona fecha y hora de tu servicio</h2>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Junio</h3>
                <div className="grid grid-cols-7 gap-2">
                  {["Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {[17, 18, 19, 20, 21, 22, 23].map((date) => (
                    <Button
                      key={date}
                      variant={date === 17 ? "default" : "ghost"}
                      className={`h-10 ${date === 17 ? "bg-gray-800 text-white" : ""}`}
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Mañana</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {["9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"].map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateTimeSelect("17 de junio de 2025", time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentStep("professional")}>
                  Anterior
                </Button>
                <Button className="bg-gray-800 hover:bg-gray-900" disabled>
                  Siguiente
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Información de tus servicios</h3>
              <div className="space-y-3">
                {expandedServices.map((service, index) => (
                  <Card key={index} className={index === currentServiceIndex ? "border-2 border-gray-800" : ""}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>S/{service.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} min</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50">
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

        <div className="max-w-4xl mx-auto p-4 py-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CircleCheck className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Gracias Jessica Palacios por agendar en Peluquería de Jeason Arturo!
            </h1>
          </div>

          {/* Services Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            {bookedServices.map((booking, index) => (
              <Card key={index} className="min-w-80 flex-shrink-0">
                <CardContent className="p-6">
                  <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium mb-4">
                    Servicio {index + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-4">{booking.service.name}</h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Fecha y hora</p>
                        <p className="text-gray-600">
                          {booking.date} {booking.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Duración</p>
                        <p className="text-gray-600">{booking.service.duration} Minutos</p>
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
                        <p className="text-gray-600">S/{booking.service.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">Enviamos la información de tu reserva a jeasoncues@gmail.com</p>
            <p className="text-lg font-semibold text-gray-900 mb-6">
              El total de tus servicios es: <span className="text-2xl font-bold">S/{getTotalPrice()}</span>
            </p>
            <Button onClick={onComplete} className="bg-gray-800 hover:bg-gray-900">
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

  return null
}
