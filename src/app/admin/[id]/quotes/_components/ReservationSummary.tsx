"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Add Service type for props
interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  professional: string;
  cantidad?: number;
}

interface ReservationSummaryProps {
  selectedDate: Date;
  services: Service[];
  totalAmount: number;
  comment: string;
  setComment: (c: string) => void;
  channel: string;
  setChannel: (c: string) => void;
  onSave: () => void;
  loadingSave?: boolean;
}

export default function ReservationSummary({ selectedDate, services, totalAmount, comment, setComment, channel, setChannel, onSave, loadingSave }: ReservationSummaryProps) {
  const [selectedStatus, setSelectedStatus] = useState("nuevo")

  const getStatusDisplay = () => {
    switch (selectedStatus) {
      case "nuevo":
        return { text: "+ Nuevo", color: "bg-[#D1F1FE] border-[#D1F1FE] text-[#3BC5FB] hover:bg-[#D1F1FE] hover:text-[#3BC5FB]" }
      case "confirmado":
        return { text: "Confirmado", color: "bg-[#FDD0E3] border-[#FDD0E3] text-[#F4056C] hover:bg-[#FDD0E3]  hover:text-[#F4056C]" }
      case "en-curso":
        return { text: "En curso", color: "bg-[#FFEFCF] text-[#FFB700] border-[#FFEFCF] hover:bg-[#FFEFCF] hover:text-[#FFB700] hover:border-[#FFEFCF]" }
      default:
        return { text: "+ Nuevo", color: "bg-cyan-500 text-white" }
    }
  }

  const statusDisplay = getStatusDisplay()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl p-4 space-y-6 bg-white">
        <div>
          <h2 className="text-lg font-semibold">Resumen</h2>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total por reserva</span>
          <span className="font-semibold">{totalAmount.toFixed(2)} PEN</span>
        </div>

        {/* Date and Status Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          {/* Calendar Icon */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Date */}
          <div className="text-center">
            <div className="font-medium text-sm mb-2">
              {formatDate(selectedDate)}
            </div>

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={`${statusDisplay.color} hover:opacity-80 text-xs`}>
                  {statusDisplay.text}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-40">
                <DropdownMenuItem onClick={() => setSelectedStatus("nuevo")} className="text-cyan-500">
                   Nuevo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("confirmado")} className="text-pink-500">
                  Confirmado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("en-curso")} className="text-[#FFB700]">
                  En curso
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder=" "
              className="min-h-[80px] text-sm resize-none block w-full px-4 pt-6 pb-2 text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer focus:ring-blue-600 focus:border-blue-600"
            />
            <label
              className={`absolute left-4 text-gray-400 text-base pointer-events-none transition-all
                ${comment
                  ? 'top-1.5 text-sm text-blue-600'
                  : 'peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600 top-4'}
              `}
            >
              Comentario
            </label>
          </div>
          <p className="text-xs text-gray-500">Esta nota es privada y no será visible para los clientes.</p>
        </div>

        {/* Channel Selection */}
        <div className="space-y-2">
          <div className="relative mb-4">
            <select
              name="channel"
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600`}
            >
              <option value="telefono">Por teléfono</option>
              <option value="online">En línea</option>
              <option value="presencial">Presencial</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
            <label
              htmlFor="channel"
              className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600`}
            >
              Canal
            </label>
          </div>
        </div>

        {/* Created By */}
        <div className="space-y-1">
          {/* <div className="text-sm font-medium">Cliente</div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 h-10 bg-blue-500 hover:bg-blue-500 text-white cursor-pointer" onClick={onSave} disabled={loadingSave}>
            {loadingSave ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button className="flex-1 h-10 bg-gray-900 hover:bg-gray-900 text-white cursor-pointer">Pago</Button>
        </div>
      </div>
    </div>
  )
}
