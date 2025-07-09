"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Calendar, Clock, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

interface CartItem {
  service: Service
  quantity: number
}

interface Shift {
  id: string
  establishment_id: string
  day_of_week: number // 1=lunes, 7=domingo
  start_time: string // 'HH:MM'
  end_time: string // 'HH:MM'
  interval_minutes: number
  is_available: boolean
  status: number
  createdAt: string
  updatedAt: string
}

interface DateTimeSelectionProps {
  service: Service
  onSelect: (date: string, time: string) => void
  onBack: () => void
  companyName?: string
  branchName?: string
  logoUrl?: string
  branchUbication?: string
  quantity?: number // cantidad del servicio
  cart?: CartItem[] // lista de servicios y cantidades
  shifts?: Shift[] // turnos disponibles
}


const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getNext7Days() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      label:
        i === 0
          ? "Hoy"
          : i === 1
          ? "Mañana"
          : `${weekDays[date.getDay()]} ${date.getDate()}`,
      value: date,
    })
  }
  return days
}

export default function DateTimeSelection({
  service,
  onSelect,
  onBack,
  companyName = "Peluquería de Jeason Arturo",
  branchName = "Sucursal 1",
  logoUrl = "/placeholder.svg",
  branchUbication = "",
  quantity = 1,
  cart,
  shifts = [],
}: DateTimeSelectionProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const days = getNext7Days()

  // Calcular total de servicios
  const totalServicios = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : quantity
  // Acordeón simple
  const [open, setOpen] = useState(false)

  // Calcular horarios disponibles para el día seleccionado
  function getDayOfWeek(date: Date) {
    const jsDay = date.getDay(); // 0=domingo, 6=sábado
    return jsDay === 0 ? 7 : jsDay;
  }
  const selectedDayOfWeek = getDayOfWeek(selectedDay);
  const todaysShifts = shifts.filter(shift => shift.day_of_week === selectedDayOfWeek);
  // Logs de depuración
  console.log('shifts prop:', shifts);
  console.log('selectedDay:', selectedDay, 'selectedDayOfWeek:', selectedDayOfWeek, 'todaysShifts:', todaysShifts);
  function getAvailableTimes() {
    const now = new Date();
    // Comparar solo año, mes y día para evitar problemas de zona horaria/hora
    const isToday =
      selectedDay.getFullYear() === now.getFullYear() &&
      selectedDay.getMonth() === now.getMonth() &&
      selectedDay.getDate() === now.getDate();
    let times: string[] = [];
    for (const shift of todaysShifts) {
      let [startHour, startMinute] = shift.start_time.split(":").map(Number);
      let [endHour, endMinute] = shift.end_time.split(":").map(Number);
      let interval = shift.interval_minutes && shift.interval_minutes > 0 ? shift.interval_minutes : 60;
      let current = new Date(selectedDay);
      current.setHours(startHour, startMinute, 0, 0);
      let end = new Date(selectedDay);
      end.setHours(endHour, endMinute, 0, 0);
      while (current <= end) {
        // Si es hoy, no mostrar horas pasadas
        if (!isToday || current > now) {
          const hh = current.getHours().toString().padStart(2, "0");
          const mm = current.getMinutes().toString().padStart(2, "0");
          times.push(`${hh}:${mm}`);
        }
        current.setMinutes(current.getMinutes() + interval);
      }
    }
    // Eliminar duplicados y ordenar
    return Array.from(new Set(times)).sort();
  }
  const availableTimes = getAvailableTimes();

  const handleContinue = () => {
    if (selectedDay && selectedTime) {
      // Formato: "2025-06-17" y hora
      const dateString = selectedDay.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      onSelect(dateString, selectedTime)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-gray-100 relative">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">Reservar servicio</h1>
        <span className="w-8" />
      </header>

      {/* Accordion resumen de servicios */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl shadow-sm border border-gray-200 bg-white">
          <button
            className="w-full flex items-center gap-4 rounded-2xl px-4 py-3 focus:outline-none"
            onClick={() => setOpen((v) => !v)}
            style={{ minHeight: 64 }}
          >
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={branchName}
              height={48}
              width={48}
              className="rounded-full bg-white border border-gray-100 object-cover"
            />
            <div className="flex-1 text-left">
              <div className="text-lg font-bold text-gray-900 leading-tight">{branchName}</div>
              <div className="text-sm text-gray-400">{totalServicios} Servicio{totalServicios > 1 ? "s" : ""}</div>
            </div>
            <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
          {open && (
            <div className="bg-gray-50 rounded-b-2xl px-4 py-2">
              {(cart && cart.length > 0 ? cart : [{ service, quantity }]).map((item, idx) => (
                <div key={item.service.id} className="flex items-center justify-between py-2 text-base border-b last:border-b-0 border-gray-100">
                  <span className="text-gray-900">{item.service.name}</span>
                  <span className="text-gray-500 font-semibold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pt-4 pb-32 max-w-lg mx-auto w-full">

        {/* Selección de día */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Selecciona el día</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <Button
                key={d.label}
                variant={selectedDay?.toDateString() === d.value.toDateString() ? "default" : "outline"}
                className={`rounded-full px-4 py-2 whitespace-nowrap ${selectedDay?.toDateString() === d.value.toDateString() ? "bg-gray-900 text-white" : ""}`}
                onClick={() => {
                  setSelectedDay(d.value)
                  setSelectedTime(null)
                }}
              >
                {d.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Selección de hora */}
        <div className="mb-8">
          <div className="text-sm font-medium mb-2">Selecciona la hora</div>
          {availableTimes.length === 0 ? (
            <div className="text-center text-gray-500 py-4 border rounded bg-gray-50">
              No hay horarios disponibles para este día.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`rounded-full px-4 py-2 ${selectedTime === time ? "bg-gray-900 text-white" : ""}`}
                  onClick={() => setSelectedTime(time)}
                  disabled={!selectedDay}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
     
      </div>

      {/* Botón fijo */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-10">
        <Button
          className="w-full h-16 text-base font-semibold rounded-full bg-green-500 hover:bg-green-600"
          disabled={!selectedDay || !selectedTime}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
