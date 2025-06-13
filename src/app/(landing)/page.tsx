"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  Star,
  Sparkles,
  Smartphone,
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl font-bold text-[#25B361]">AgendaPro</span>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 text-sm font-medium text-white bg-[#00AF7A] rounded-md hover:bg-[#25B361] transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
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
                  <span className="text-[#25B361]">
                    simplificar
                  </span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="absolute bottom-0 left-0 h-1 bg-[#25B361] rounded-full"
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
                        <div className="w-12 h-12 bg-[#25B361] rounded-full flex items-center justify-center mx-auto mb-2">
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
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
