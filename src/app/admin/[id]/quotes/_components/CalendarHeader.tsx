"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter, X, Download } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarHeader({ currentDate, onDateChange }: CalendarHeaderProps) {
  const monthNames = [
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

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-lg font-medium min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>

          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-600 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Más filtros
          </Button>

          <Button variant="ghost" className="text-gray-600">
            <X className="w-4 h-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      </div>

      <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent hover:text-orange-600">
        <Download className="w-4 h-4 mr-2" />
        Descargar
      </Button>
    </div>
  )
}
