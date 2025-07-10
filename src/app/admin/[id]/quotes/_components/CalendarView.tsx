import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { CalendarDays, User, Phone, MessageCircle, CreditCard, MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pencil, RefreshCw, Copy, UserX, XCircle } from "lucide-react";

export interface Appointment {
  id: number
  date: string
  type: string
  amount: number
  status: string
  client_name?: string
  time?: string
  client_id?: string
  client?: { id: string; name: string }
  observation?: string;
  channel?: string;
  createdAt?: string;
}

interface CalendarViewProps {
  currentDate: Date
  appointments: Appointment[]
  onDayClick?: (date: Date) => void
  selectedAppointment: Appointment | null
  setSelectedAppointment: (a: Appointment | null) => void
}

export function CalendarView({ currentDate, appointments, onDayClick, selectedAppointment, setSelectedAppointment }: CalendarViewProps) {
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  // Obtener el primer día del mes y cuántos días tiene
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Ajustar el primer día de la semana (0 = domingo, 1 = lunes, etc.)
  let firstDayWeekday = firstDayOfMonth.getDay()
  firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1 // Convertir domingo (0) a 6

  // Obtener días del mes anterior para completar la primera semana
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
  const daysFromPrevMonth = firstDayWeekday

  // Crear array de días para mostrar
  const calendarDays = []

  // Días del mes anterior
  for (let i = daysFromPrevMonth; i > 0; i--) {
    calendarDays.push({
      day: prevMonth.getDate() - i + 1,
      isCurrentMonth: false,
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i + 1),
    })
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
    })
  }

  // Días del siguiente mes para completar la última semana
  const remainingDays = 42 - calendarDays.length // 6 semanas × 7 días
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day),
    })
  }

  // Cambiar para retornar todas las reservas de un día
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateString);
  };

  const formatCurrency = (amount: number) => {
    return `S/. ${amount.toFixed(2)}`
  }

  // Highlight para nuevas reservas
  const prevAppointmentIds = useRef<Set<number>>(new Set());
  const [highlightedIds, setHighlightedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const currentIds = new Set(appointments.map(a => a.id));
    const prevIds = prevAppointmentIds.current;
    const newIds = new Set<number>();
    appointments.forEach(a => {
      if (!prevIds.has(a.id)) {
        newIds.add(a.id);
      }
    });
    if (newIds.size > 0) {
      setHighlightedIds(new Set([...highlightedIds, ...newIds]));
      setTimeout(() => {
        setHighlightedIds(ids => {
          const updated = new Set(ids);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 2000); // 2 segundos de highlight
    }
    prevAppointmentIds.current = currentIds;
  }, [appointments]);

  return (
    <div>
      <div className="p-6">
        {/* Header de días de la semana */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((calendarDay, index) => {
            const appointmentsForDay = getAppointmentsForDate(calendarDay.date)
            const isToday = calendarDay.date.toDateString() === new Date().toDateString()

            // Color de la franja según estado
            const getStatusColor = (status?: string) => {
              switch (status) {
                case 'PENDIENTE':
                  return 'bg-yellow-100 text-yellow-800 border-yellow-300';
                case 'CONFIRMADO':
                  return 'bg-blue-100 text-blue-700 border-blue-300';
                case 'CANCELADO':
                  return 'bg-red-100 text-red-700 border-red-300';
                default:
                  return 'bg-pink-100 text-pink-700 border-pink-300';
              }
            };

            return (
              <div
                key={index}
                onClick={() => calendarDay.isCurrentMonth && onDayClick?.(calendarDay.date)}
                className={`min-h-[120px] border rounded-lg p-2 relative transition-all duration-200 flex flex-col justify-between ${
                  calendarDay.isCurrentMonth
                    ? "bg-white border-gray-200 cursor-pointer hover:border-orange-300 hover:shadow-md"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium ${
                      calendarDay.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${isToday ? "bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
                  >
                    {calendarDay.day}
                  </span>
                </div>

                {/* Franja de reservas en la parte inferior, una por cada reserva */}
                {appointmentsForDay.length > 0 && (
                  <div className="absolute left-2 right-2 bottom-2 flex flex-col gap-1">
                    {appointmentsForDay.map((appointment) => (
                      <Tooltip key={appointment.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-full rounded-md px-2 py-1 text-xs font-semibold border flex items-center gap-1 cursor-pointer shadow-sm ${getStatusColor(appointment.status)} ${highlightedIds.has(appointment.id) ? 'bg-green-100 animate-pulse' : ''}`}
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                            }}
                          >
                            <span className="font-mono text-[11px]">{appointment.time}</span>
                            <span className="truncate">{appointment.client?.name || 'Cliente Generico'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={8}>
                          <div className="text-xs text-left">
                            <div><b>Cliente:</b> {appointment.client?.name || 'Cliente Generico'}</div>
                            <div><b>Hora:</b> {appointment.time}</div>
                            <div><b>Estado:</b> {appointment.status}</div>
                            {appointment.observation && <div><b>Obs.:</b> {appointment.observation}</div>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {/* Sheet lateral para detalles de cita */}
      <Sheet open={!!selectedAppointment} onOpenChange={open => { if (!open) setSelectedAppointment(null); }}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetTitle className="sr-only">Detalle de la cita</SheetTitle>
          {selectedAppointment && (
            <div className="p-0">
              {/* Header y total */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div className="text-xl font-bold text-gray-900">Resumen de la cita</div>
                {selectedAppointment.amount > 0 && (
                  <div className="text-lg font-medium text-gray-500">{formatCurrency(selectedAppointment.amount)}</div>
                )}
              </div>
              <div className="px-6 pb-4">
                {/* Estado y fecha/hora */}
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-gray-400" />
                  <span className="text-base font-medium text-gray-700">
                    {selectedAppointment.time} {selectedAppointment.date ? `- ${selectedAppointment.date}` : ""}
                  </span>
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedAppointment.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-600' :
                    selectedAppointment.status === 'CONFIRMADO' ? 'bg-pink-100 text-pink-600' :
                    selectedAppointment.status === 'CANCELADO' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {/* Cliente */}
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-600">{selectedAppointment.client?.name || 'Cliente Generico'}</span>
                </div>
                <Separator />
                {/* Comentario */}
                <div className="mb-2 mt-4">
                  <div className="text-xs text-gray-500">Comentario</div>
                  <div className="text-gray-900 text-sm font-medium">{selectedAppointment.observation || '—'}</div>
                </div>
                {/* Canal */}
                <div className="mb-2">
                  <div className="text-xs text-gray-500">Canal</div>
                  <div className="text-gray-900 text-sm font-medium">{selectedAppointment.channel || '—'}</div>
                </div>
                {/* Fecha de creación */}
                {selectedAppointment.createdAt && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Creado el</div>
                    <div className="text-gray-900 text-sm font-medium">{new Date(selectedAppointment.createdAt).toLocaleString()}</div>
                  </div>
                )}
                {/* Acciones */}
                <div className="flex gap-2 mt-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 h-12">
                        <MoreHorizontal className="w-4 h-4" />
                        Más acciones
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2" /> Edita
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="w-4 h-4 mr-2" /> Reprogramar
                      </DropdownMenuItem>
                     
                      <DropdownMenuItem className="text-red-600 bg-red-50">
                        <UserX className="w-4 h-4 mr-2" /> Ausencia
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="w-4 h-4 mr-2" /> Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 h-12">
                    <CreditCard className="w-4 h-4" />
                    Pagar
                  </button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
