"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, Calendar, Clock, DollarSign } from "lucide-react"

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface DateTimeSelectionProps {
  service: Service
  onSelect: (date: string, time: string) => void
  onBack: () => void
}

const timeSlots = {
  morning: ["9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"],
  afternoon: [
    "12:00 pm",
    "12:30 pm",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
    "5:00 pm",
    "5:30 pm",
  ],
  evening: ["6:00 pm", "6:30 pm", "7:00 pm", "7:30 pm"],
}

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export default function DateTimeSelection({ service, onSelect, onBack }: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(17)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(5) // June (0-indexed)

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      onSelect(`17 de junio de 2025`, time)
    }
  }

  const generateCalendarDays = () => {
    const days = []
    const startDay = 16 // Starting from 16th
    for (let i = 0; i < 15; i++) {
      days.push(startDay + i)
    }
    return days
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date and Time Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Selecciona fecha y hora de tu servicio</h2>

            {/* Calendar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{months[currentMonth]}</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-500">Otras fechas disponibles</span>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day, index) => (
                  <Button
                    key={day}
                    variant={selectedDate === day ? "default" : "ghost"}
                    className={`h-10 ${selectedDate === day ? "bg-gray-800 text-white" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Mañana</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {timeSlots.morning.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={selectedTime === time ? "bg-gray-800 text-white" : ""}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Tarde</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {timeSlots.afternoon.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={selectedTime === time ? "bg-gray-800 text-white" : ""}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Noche</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {timeSlots.evening.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={selectedTime === time ? "bg-gray-800 text-white" : ""}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Summary */}
          <div>
            <h3 className="font-medium mb-4">Información de tus servicios</h3>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">{service.name}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>S/{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>17 de junio de 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
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
