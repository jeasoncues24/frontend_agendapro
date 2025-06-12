"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  Star,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Globe,
  Check,
  CircleCheck,
} from "lucide-react"

const features = [
  { icon: Calendar, title: "Citas", color: "bg-green-100 text-green-600" },
  { icon: TrendingUp, title: "Ventas", color: "bg-green-100 text-green-600" },
  { icon: Users, title: "Clientes", color: "bg-green-100 text-green-600" },
  { icon: CreditCard, title: "Pagos", color: "bg-green-100 text-green-600" },
]

const testimonials = [
  { name: "María González", role: "Consulta general", time: "10:30", status: "confirmed" },
  { name: "Carlos Ruiz", role: "Revisión", time: "14:00", status: "pending" },
  { name: "Ana Silva", role: "Tratamiento", time: "16:30", status: "completed" },
]

export default function AgendaProLanding() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [formData, setFormData] = useState({
    businessType: "",
    employees: "",
    name: "",
    email: "",
    country: "Perú",
    phone: "",
    password: "",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <span className="text-2xl font-bold text-gray-900">AgendaPro</span>
            </motion.div>

            {/* Main */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                Empieza a{" "}
                <span className="relative">
                  <span className="text-[#00AF7A]">
                    simplificar
                  </span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="absolute bottom-0 left-0 h-1 bg-[#00AF7A] rounded-full"
                  />
                </span>{" "}
                tu día a día y haz crecer tu negocio
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Todo lo que necesitas para gestionar las principales tareas administrativas de tu negocio.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="p-4 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0 space-y-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-gray-900">{feature.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="relative"
            >
              <div className="flex justify-center space-x-4 lg:space-x-8">
                {/* Desktop Preview */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-xs"
                >
                  <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">Recordatorio</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Hoy
                      </Badge>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTestimonial}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{testimonials[currentTestimonial].name}</span>
                          <span className="text-xs text-gray-500">{testimonials[currentTestimonial].time}</span>
                        </div>
                        <p className="text-xs text-gray-600">{testimonials[currentTestimonial].role}</p>
                        <div className="flex items-center space-x-2">
                          <CircleCheck className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">Confirmado</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Mobile Preview */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: -5 }}
                  className="relative bg-black rounded-3xl p-2 max-w-[200px]"
                >
                  <div className="bg-white rounded-2xl p-4 h-80 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="w-12 h-12 bg-[#00AF7A] rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs font-medium">AgendaPro</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <p className="text-xs">Citas</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Users className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <p className="text-xs">Clientes</p>
                        </div>
                      </div>
                    </div>

                    <Button size="sm" className="w-full bg-[#00AF7A] hover:bg-[#009966]">
                      Continuar
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

           
          </motion.div>

          {/* Right Column - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="lg:sticky lg:top-8"
          >
            <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <span className="text-black font-bold text-2xl">¡CREA TU CUENTA GRATIS!</span>
                  <p className="text-black font-medium">PRUEBA GRATIS POR 7 DÍAS</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Tipo de negocio</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value: any) => setFormData({ ...formData, businessType: value })}
                      >
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Peluquería" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peluqueria">Peluquería</SelectItem>
                          <SelectItem value="spa">Spa</SelectItem>
                          <SelectItem value="clinica">Clínica</SelectItem>
                          <SelectItem value="consultorio">Consultorio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">RUC</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Razón Social</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                        className="h-10"
                      />
                    </div>

                     
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                          className="h-10 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-[#00AF7A] hover:bg-[#009966] text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>Crear cuenta</span>
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  <p className="text-center text-sm text-gray-500">
                    <a href="#" className="text-black hover:underline">
                      términos y condiciones
                    </a>
                  </p>
                </form>

                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Más de 100 negocios confían en nosotros</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
