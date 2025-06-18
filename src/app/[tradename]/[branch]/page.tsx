"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Trash2, Minus, Plus } from "lucide-react"
import DateTimeSelection from "@/components/date-time-selection"
import ProfessionalSelection from "@/components/professional-selection"
import ConfirmationPage from "@/components/confirmation-page"
import BookingModeSelection from "@/components/booking-mode-selection"
import MultiServiceFlow from "@/components/multi-service-flow"
import HeaderTradeName from "./_components/HeaderTradeName"
import ContactInfo from "./_components/ContactInfo"
import CollaboratorComponent from "./_components/Collaborator"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Service {
  id: string
  name: string
  duration: number
  price: number
  categoryId: string
}

interface Category {
  id: string
  name: string
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

const services: Service[] = [
  { id: "1", name: "Corte de Cabello", duration: 30, price: 50, categoryId: "1" },
  { id: "2", name: "Uñas", duration: 20, price: 100, categoryId: "2" },
  { id: "3", name: "Manicura Básica", duration: 30, price: 25, categoryId: "2" },
  { id: "4", name: "Pedicura Spa", duration: 60, price: 45, categoryId: "2" },
  { id: "5", name: "Masaje Relajante", duration: 60, price: 70, categoryId: "3" },
  { id: "6", name: "Limpieza Facial", duration: 45, price: 60, categoryId: "4" },
]

const categories: Category[] = [
  { id: "1", name: "Cabello" },
  { id: "2", name: "Uñas" },
  { id: "3", name: "Masajes" },
  { id: "4", name: "Facial" },
]

const professionals: Professional[] = [
  { id: "1", name: "Jeason Arturo", initials: "JA" },
  { id: "2", name: "Leonardo Gutierrez", initials: "LG" },
]

// URL de imagen para color-thief
const imageURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/images/banner-salon.webp"
    : "https://tudominio.com/images/banner-salon.webp" // <-- cambia esto por tu dominio real en producción

export default function SalonBooking() {
  const [currentStep, setCurrentStep] = useState<
    "home" | "booking-mode" | "multi-service" | "datetime" | "professional" | "confirmation"
  >("home")

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: services[0],
    date: "",
    time: "",
    professional: null,
    customerName: "Jessica Palacios",
    customerEmail: "jeasoncues@gmail.com",
  })

  const [cart, setCart] = useState<{ service: Service; quantity: number }[]>([])
  const [bookingMode, setBookingMode] = useState<"together" | "separate" | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id)

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.service.id === service.id)
      if (existingItem) {
        return prev.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { service, quantity: 1 }]
    })
  }

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prev) => prev.filter((item) => item.service.id !== serviceId))
    } else {
      setCart((prev) =>
        prev.map((item) => (item.service.id === serviceId ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId))
  }

  const getTotalPrice = () => cart.reduce((total, item) => total + item.service.price * item.quantity, 0)
  const getTotalServices = () => cart.reduce((total, item) => total + item.quantity, 0)

  const handleProceedToBooking = () => {
    const totalServices = getTotalServices()
    if (totalServices > 0) {
      if (totalServices > 1) {
        setCurrentStep("booking-mode")
      } else {
        setBookingData((prev) => ({ ...prev, service: cart[0].service }))
        setCurrentStep("datetime")
      }
    } else {
      console.log("Cart is empty, cannot proceed to booking.");
    }
  }

  const handleBookingModeSelect = (mode: "together" | "separate") => {
    setBookingMode(mode)
    if (mode === "separate") {
      setCurrentStep("multi-service")
    } else {
      setBookingData((prev) => ({ ...prev, service: cart[0].service }))
      setCurrentStep("datetime")
    }
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setBookingData((prev) => ({ ...prev, service }))
    setCurrentStep("datetime")
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData((prev) => ({ ...prev, date, time }))
    setCurrentStep("professional")
  }

  const handleProfessionalSelect = (professional: Professional | null) => {
    setBookingData((prev) => ({ ...prev, professional }))
    setCurrentStep("confirmation")
  }

  const handleBack = () => {
    if (currentStep === "booking-mode") setCurrentStep("home")
    else if (currentStep === "multi-service") setCurrentStep("booking-mode")
    else if (currentStep === "datetime") {
      if (bookingMode) setCurrentStep("booking-mode")
      else setCurrentStep("home")
    } else if (currentStep === "professional") setCurrentStep("datetime")
    else if (currentStep === "confirmation") setCurrentStep("professional")
  }

  const handleBookAnother = () => {
    setCurrentStep("home")
    setSelectedService(null)
    setBookingMode(null)
    setCart([])
    setBookingData((prev) => ({
      ...prev,
      date: "",
      time: "",
      professional: null,
    }))
  }

  // Debugging useEffect to monitor currentStep
  useEffect(() => {
    console.log("currentStep changed to:", currentStep);
  }, [currentStep]);

  if (currentStep === "booking-mode") {
    return <BookingModeSelection cart={cart} onSelect={handleBookingModeSelect} onBack={handleBack} />
  }

  if (currentStep === "multi-service") {
    return (
      <MultiServiceFlow cart={cart} professionals={professionals} onComplete={handleBookAnother} onBack={handleBack} />
    )
  }

  if (currentStep === "datetime") {
    console.log("Attempting to render DateTimeSelection. Booking Data Service:", bookingData.service);
    return <DateTimeSelection service={bookingData.service} onSelect={handleDateTimeSelect} onBack={handleBack} />
  }

  if (currentStep === "professional") {
    return (
      <ProfessionalSelection
        service={bookingData.service}
        date={bookingData.date}
        time={bookingData.time}
        professionals={professionals}
        onSelect={handleProfessionalSelect}
        onBack={handleBack}
      />
    )
  }

  if (currentStep === "confirmation") {
    return <ConfirmationPage bookingData={bookingData} onBookAnother={handleBookAnother} />
  }

  console.log("SalonBooking rendering, currentStep:", currentStep);

  return (
    <div
      className="min-h-screen bg-gray-50"
    >
      <HeaderTradeName />

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Hero */}
          <div className="w-full h-64 rounded-lg mb-6 relative overflow-hidden">
            <Image
              src="/images/banner-salon.webp"
              alt="Banner Salon"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Business Info */}
          <Card className="mb-6 p-4">
            <CardContent className="p-0 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    ))}
                </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Peluquería de Jeason Arturo</h2>
            </CardContent>
          </Card>

          {/* Servicios */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
            </div>

            <Tabs defaultValue={selectedCategory} className="w-full" onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-4">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services
                      .filter((service) => service.categoryId === category.id)
                      .map((service) => {
                        const cartItem = cart.find((item) => item.service.id === service.id)
                        const quantity = cartItem?.quantity || 0

                        return (
                          <Card key={service.id} className="relative border shadow-sm rounded-lg">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <CardDescription className="text-gray-500">{service.duration} min</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-semibold">S/{service.price}</span>
                                {quantity === 0 ? (
                                  <Button onClick={() => addToCart(service)} className="bg-gray-800 hover:bg-gray-900">
                                    Agendar servicio
                                  </Button>
                                ) : null}
                              </div>

                              {quantity > 0 && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(service.id, quantity - 1)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(service.id, quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                    onClick={() => removeFromCart(service.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <ContactInfo />
          <CollaboratorComponent professional={professionals} />
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[600px]">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{getTotalServices()} servicios seleccionados</p>
                  <p className="text-2xl font-bold text-gray-900">S/{getTotalPrice()}</p>
                </div>
                <Button onClick={handleProceedToBooking} className="bg-gray-800 hover:bg-gray-900 px-8">
                  Agendar ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
