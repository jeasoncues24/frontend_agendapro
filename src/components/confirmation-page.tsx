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
  bookingData: any
  onBookAnother: () => void
  customerData?: { name: string; email: string; phone: string } | null
  branchUbication?: string
  branchName?: string
}

// Función para formatear fecha y hora en español
function formatFechaHora(fechaISO: string, hora: string) {
  if (!fechaISO) return "Fecha no disponible";
  const date = new Date(fechaISO);
  if (isNaN(date.getTime())) return "Fecha no disponible";
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  return `${diaSemana} ${dia} ${mes} - ${hora}`;
}

export default function ConfirmationPage({ bookingData, onBookAnother, customerData, branchUbication, branchName }: ConfirmationPageProps) {
  const customerName = customerData?.name || bookingData.customerName;
  const customerEmail = customerData?.email || bookingData.customerEmail;
  const branchTitle = branchName || "Peluquería de Jeason Arturo";
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-4 py-12 mt-32">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleCheck className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Gracias {customerName} por agendar en {branchTitle}!
          </h1>
        </div>


        <div className="text-center mb-8">
          <p className="text-gray-600 mb-6">Enviamos la información de tu reserva a {customerEmail}</p>
          <Button onClick={onBookAnother} className="bg-gray-800 h-16 rounded-full hover:bg-gray-900">
            Agendar otra cita
          </Button>
        </div>

      </div>
    </div>
  )
}
