"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Trash2, Minus, Plus, Loader2, Instagram, Star, MapPin, Home, Tag, Heart, User, LucideBadgePercent, Share2, LucideTrash } from "lucide-react"
import DateTimeSelection from "@/components/date-time-selection"
import ProfessionalSelection from "@/components/professional-selection"
import ConfirmationPage from "@/components/confirmation-page"
import BookingModeSelection from "@/components/booking-mode-selection"
import MultiServiceFlow from "@/components/multi-service-flow"
import HeaderTradeName from "./_components/HeaderTradeName"
import ContactInfo from "./_components/ContactInfo"
import CollaboratorComponent from "./_components/Collaborator"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useBranchData } from "@/hooks/useBranchData"
import EmptyBranchPage from "./_components/EmptyBranch"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategoriesServicesForBranch } from "@/hooks/useCategoriesServicesForBranch"
import { RiDiscountPercentFill } from "react-icons/ri";
import SplashScreen from "@/components/splash-screen"
import { useThemeColor } from "@/hooks/useThemeColor"
import { useProductsForSale, ProductForSale } from "@/hooks/useProductsForSale"
import ModalDetalleServicio from "@/components/ModalDetalleServicio"
import { LuTrash } from "react-icons/lu";
import { FaPlus } from "react-icons/fa"


interface Service {
  id: string
  name: string
  duration: number
  price: number
  categoryId: string
  image?: string
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

// Función para mapear ProductForSale a Service
function mapProductToService(product: ProductForSale): Service {
  return {
    id: product.id,
    name: product.name,
    duration: product.duration,
    price: product.price,
    categoryId: product.category_id,
    image: product.image,
  };
}

export default function SalonBooking() {
  const params = useParams();
  const tradename = params.tradename as string;
  const branch = params.branch as string;

  const { data: branchData, loading: branchLoading } = useBranchData(tradename, branch);
  const branchId = branchData?.branch.id;
  const { data: categoriesData, loading, error } = useCategoriesServicesForBranch(branchId || "");
  const [showSplash, setShowSplash] = useState(true)

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
  useThemeColor("#000000", !showSplash)

  const [cart, setCart] = useState<{ service: Service; quantity: number }[]>([])
  const [bookingMode, setBookingMode] = useState<"together" | "separate" | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const sucursalId = branchData?.branch.id || "";
  const categoryId = selectedCategory === "all" ? "" : selectedCategory;
  const { products, loading: loadingProducts, error: errorProducts } = useProductsForSale(sucursalId, categoryId);

  const [modalServicio, setModalServicio] = useState<{ open: boolean, servicio: ProductForSale | null }>({ open: false, servicio: null });

  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: ProductForSale) => {
    const service = mapProductToService(product);
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

  if (currentStep === "booking-mode") {
    return <BookingModeSelection cart={cart} onSelect={handleBookingModeSelect} onBack={handleBack} />
  }

  if (currentStep === "multi-service") {
    return (
      <MultiServiceFlow cart={cart} professionals={professionals} onComplete={handleBookAnother} onBack={handleBack} />
    )
  }

  if (currentStep === "datetime") {
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

  if (branchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin mx-2" /> Cargando...
      </div>
    )
  };

  if (!branchData) {
    return (
      <EmptyBranchPage />
    );
  }

  const bannerUrl = branchData.branch.banner_path
    ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${branchData.branch.banner_path}`
    : "/images/banner-salon.webp";
  const logoUrl = branchData.company.logo_path
    ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${branchData.company.logo_path}`
    : ""

  console.log("categoriesData en render:", categoriesData);

  return (
    <div
      className="min-h-screen"
    >
      {/* Fullscreen Handler */}
      {/* <FullscreenHandler /> */}
      {showSplash ? (
        <SplashScreen
          key="splash"
          onComplete={() => setShowSplash(false)}
          logoUrl={logoUrl}
          companyName={branchData.company.trade_name}
        />
      ) : (
        <>

          {/* <HeaderTradeName /> */}

          <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Banner superior tipo hero */}
              <div className="relative w-full h-44 pt-8">
                {/* Imagen banner */}
                <Image
                  src={bannerUrl}
                  alt={branchData.branch.name}
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10 mt-4" style={{ paddingTop: 'env(safe-area-inset-top, 2rem)' }}>
                  <button className="bg-white/80 rounded-full p-2 shadow">
                    <X className="w-5 h-5 text-black" />
                  </button>
                  <div className="flex gap-2">
                    <button className="bg-white/80 rounded-full p-2 shadow">
                      <Share2 className="w-5 h-5 text-black" />
                    </button>
                    <button className="bg-white/80 rounded-full p-2 shadow">
                      <Heart className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Business Info */}
              <div className="bg-white">
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <Image
                      src={logoUrl}
                      alt={branchData.branch.name}
                      height={60}
                      width={60}
                      className="mb-2 rounded-xl shadow-2xl"
                    />

                    <div className="flex-1">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">{branchData.branch.name}</h1>
                        <p className="text-gray text-xs">{branchData.branch.ubication}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 px-6">
                {/* Tabs */}
                <div className="w-full flex bg-gray-100 rounded-full p-1">
                  <button className="flex-1 py-2 rounded-full bg-white font-semibold text-gray-900 shadow text-sm">Domicilio</button>
                  <button className="flex-1 py-2 rounded-full text-gray-500 text-sm">En tienda</button>
                </div>
                {/* Banner promo */}
                <div className="w-full bg-[#DCE9FC] rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <span className="material-icons text-blue-500"><RiDiscountPercentFill className="h-10 w-8" /> </span>
                  </div>
                  <div>
                    <div className="text-blue-900 font-semibold text-sm">Hasta 71% OFF imperdible</div>
                    <div className="text-xs text-blue-800">Disfruta este descuento en tu pedido y recíbelo en minutos.</div>
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="mb-8 px-2 mt-4">
                {/* Nueva barra de categorías tipo tabs con scroll */}
                {!branchData?.branch.id ? (
                  <div className="text-gray-400 px-4 py-2">Cargando sucursal...</div>
                ) : loading ? (
                  <div className="text-gray-400 px-4 py-2">Cargando categorías...</div>
                ) : error ? (
                  <div className="text-red-500 px-4 py-2">Error: {error}</div>
                ) : categoriesData && categoriesData.length > 0 ? (
                  <div className="overflow-x-auto scrollbar-hide">
                    <ul className="flex gap-6 border-b border-gray-200 mb-4">
                      <li>
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className={`pb-2 px-1 text-base whitespace-nowrap transition-all ${selectedCategory === "all" ? "font-bold text-gray-900 border-b-4 border-black" : "font-normal text-gray-400"}`}
                        >
                          Todas
                        </button>
                      </li>
                      {categoriesData.map((category: any) => (
                        <li key={category.id}>
                          <button
                            onClick={() => setSelectedCategory(category.id)}
                            className={`pb-2 px-1 text-base whitespace-nowrap transition-all ${selectedCategory === category.id ? "font-bold text-gray-900 border-b-4 border-black" : "font-normal text-gray-400"}`}
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-gray-400 px-4 py-2">No hay categorías</div>
                )}

                <div className="overflow-x-auto scrollbar-hide py-2 mt-4">
                  <div className="flex flex-row gap-4 min-w-max">
                    {loadingProducts ? (
                      <div className="text-gray-400 px-4 py-2">Cargando servicios...</div>
                    ) : errorProducts ? (
                      <div className="text-red-500 px-4 py-2">{errorProducts}</div>
                    ) : products.length === 0 ? (
                      <div className="text-gray-400 px-4 py-2">No hay servicios</div>
                    ) : (
                      products.map((service) => {
                        const cartItem = cart.find((item) => item.service.id === service.id)
                        const quantity = cartItem?.quantity || 0
                        return (
                          <div
                            key={service.id}
                            className="relative border-none bg-white"
                            style={{ minWidth: 130, maxWidth: 130 }}
                          >
                            <div className="relative w-full h-32">
                              <Image
                                src={service.image ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${service.image}` : "/images/banner-salon.webp"}
                                alt={service.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                              {quantity === 0 ? (
                                <button
                                  onClick={() => setModalServicio({ open: true, servicio: service })}
                                  className="absolute -top-2 -right-2 bg-[#33C955] rounded-full p-1.5 shadow-lg hover:bg-[#33C955] transition flex items-center justify-center"
                                  style={{ zIndex: 2 }}
                                >
                                  <Plus className="w-6 h-6 text-white" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setModalServicio({ open: true, servicio: service })}
                                  className="absolute -top-2 -right-2 bg-[#33C955] rounded-full p-1.5 shadow-lg hover:bg-[#33C955] transition"
                                  style={{ zIndex: 2 }}
                                >
                                  <span className="text-white p-2">{quantity}</span>
                                </button>
                              )}
                            </div>
                            <div className="p-3 flex flex-col items-start">
                              <span className="text-md font-bold">S/{service.price.toFixed(2)}</span>
                              <span className="text-sm">{service.name}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {branchLoading ? (
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ) : (
                <ContactInfo {...branchData} />
              )}
              <CollaboratorComponent professional={professionals} />
            </div>
          </div>

          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md z-40 shadow-2xl border-t border-gray-100">
              <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{getTotalServices()} servicio{getTotalServices() > 1 ? 's' : ''}</span>
                    <span className="text-2xl font-bold text-gray-900">S/{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCart(true)}
                  className="bg-[#33C955] hover:bg-[#28a745] text-white text-lg font-bold rounded-full px-8 py-3 shadow-xl h-14"
                >
                  Ir a agendar
                </Button>
              </div>
            </div>
          )}

        </>
      )}

      {modalServicio.open && modalServicio.servicio && (
        <ModalDetalleServicio
          servicio={modalServicio.servicio}
          onClose={() => setModalServicio({ open: false, servicio: null })}
          onAddToCart={(servicio, cantidad) => {
            const service = mapProductToService(servicio);
            setCart((prev) => {
              const existingItem = prev.find((item) => item.service.id === service.id);
              if (existingItem) {
                return prev.map((item) =>
                  item.service.id === service.id
                    ? { ...item, quantity: item.quantity + cantidad }
                    : item
                );
              }
              return [...prev, { service, quantity: cantidad }];
            });
            setModalServicio({ open: false, servicio: null });
          }}
        />
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/30 flex flex-col items-center justify-end md:justify-center">
          <div className="bg-white shadow-xl fixed bottom-0 left-0 right-0 rounded-t-2xl w-full max-w-none mx-auto md:relative md:bottom-auto md-left-auto md:right-auto md:rounded-2xl md:w-full md:max-w-md overflow-hidden h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="text-lg font-bold">Tu carrito</span>
              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-100 rounded-full px-4 py-1 text-sm font-semibold text-gray-700"
                  onClick={() => setCart([])}
                >
                  Vaciar
                </button>
                <button
                  className="bg-gray-100 rounded-full p-2"
                  onClick={() => setShowCart(false)}
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            {/* Lista de servicios */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-12">Tu canasta está vacía</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={item.service.id} className="flex items-center gap-3 py-4 border-b last:border-b-0">
                    <div className="w-14 h-14 rounded-xl relative overflow-hidden flex items-center justify-center">
                      {/* Imagen de fondo con blur */}
                      <Image
                        src={item.service.image ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${item.service.image}` : "/images/banner-salon.webp"}
                        alt={item.service.name}
                        fill
                        className="object-cover blur-sm scale-110 opacity-60"
                        style={{ zIndex: 1 }}
                      />
                      {/* Imagen principal centrada */}
                      <Image
                        src={item.service.image ? `${process.env.NEXT_PUBLIC_ROUTE_UPLOADS_DEV}${item.service.image}` : "/images/banner-salon.webp"}
                        alt={item.service.name}
                        width={40}
                        height={40}
                        className="object-contain rounded-lg z-10"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base truncate">{item.service.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">S/{item.service.price.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">{item.service.duration} hora(s)</div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center border rounded-full px-2 py-1 bg-gray-50 justify-center gap-1">
                        {item.quantity === 1 ? (
                          <button
                            className="flex items-center justify-center w-8 h-8 text-black hover:text-red-500 transition"
                            onClick={() => removeFromCart(item.service.id)}
                          >
                            <LuTrash className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            className="flex items-center justify-center w-8 h-8 text-xl"
                            onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                          >
                            -
                          </button>
                        )}
                        <span className="w-6 text-center font-medium text-base">{item.quantity}</span>
                        <button
                          className="flex items-center justify-center w-8 h-8 text-black transition"
                          onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                        >
                          <FaPlus className="w-3 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t bg-white px-4 py-4 sticky bottom-0 z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-700">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">S/{getTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                  className="bg-[#33C955] hover:bg-[#28a745] text-white text-lg font-bold rounded-full px-10 py-5 shadow-lg h-16 flex items-center justify-center"
                  style={{ minWidth: '160px' }}
                  onClick={() => {/* Aquí puedes poner la lógica para continuar con el pedido */ }}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
