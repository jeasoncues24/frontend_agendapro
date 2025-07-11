"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CalendarDays, CreditCard, Plus, Clock, User, Scissors, X, ChevronRight, CalendarX, CheckCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import ReservationSummary from "./ReservationSummary"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useActiveServices } from "@/hooks/useService"
import { useShiftsQuotes } from "@/hooks/useShift"
import { useAvailableProfessionals } from "@/hooks/useAvailableProfessionals"
import { customToast } from "@/components/ui/custom-toast"
import { useCustomerSearch } from "@/hooks/useCustomerSearch"
import { createCustomer } from "@/services/customer.service"
import { useCreateCustomer } from "@/hooks/useCustomer"
import { useActiveCustomers } from "@/hooks/useCustomer"
import { useCreateQuote } from "@/hooks/useQuotes"
import { useRouter } from "next/navigation"

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  professional: string;
  cantidad?: number;
}

interface SelectedClient {
  initials?: string;
  name: string;
  phone?: string;
  email?: string;
  language?: string;
}

interface BookingPageProps {
  selectedDate: Date
  onBack: () => void
  establishmentId: string
}

export function ClientSelector({ selectedClient, setSelectedClient, establishmentId, customers, loadingCustomers }: {
  selectedClient: SelectedClient | null,
  setSelectedClient: (c: SelectedClient | null) => void,
  establishmentId: string,
  customers: any[],
  loadingCustomers: boolean
}) {
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  // Estado y handlers para el formulario de cliente
  const [clientForm, setClientForm] = useState({
    nombre: '',
    email: '',
    phone: ''
  });

  const { create, loading } = useCreateCustomer();

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { nombre, email, phone } = clientForm;
    if (!nombre.trim() || !email.trim() || !phone.trim()) {
      customToast.error({
        title: 'Campos obligatorios',
        description: 'Por favor completa nombre, correo y teléfono.'
      });
      return;
    }
    try {
      const res = await create({
        name: nombre,
        email,
        phone,
        establishment_id: establishmentId
      });
      customToast.success({
        title: 'Cliente creado',
        description: res.message || 'Se guardó correctamente al cliente.'
      });
      setSelectedClient({
        initials: nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'CL',
        name: nombre,
        phone,
        email,
        language: 'es-ES',
      });
      setIsCreateClientOpen(false);
    } catch (err: any) {
      customToast.error({
        title: 'Error al crear cliente',
        description: err.message || 'No se pudo guardar el cliente.'
      });
    }
  };

  const filteredCustomers = customers.filter((client) => {
    const q = search.toLowerCase();
    return (
      client.name?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q) ||
      client.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-gray-900">Cliente</span>
        <Button
          variant="outline"
          className="text-orange-600 border-orange-50 font-semibold text-xs hover:text-orange-500 hover:bg-orange-50 hover:border-orange-50"
          onClick={() => setIsCreateClientOpen(true)}
          type="button"
        >
          Crear nuevo
        </Button>
      </div>
      {!selectedClient ? (
        <div className="relative" ref={selectRef}>
          <div
            className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 cursor-pointer select-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 flex-1">No seleccionado (Anónimo)</span>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-90' : ''}`} />
          </div>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white border rounded-xl shadow-lg z-10">
              <div className="px-4 pt-3 pb-1">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              {loadingCustomers ? (
                <div className="px-4 py-3 text-gray-500">Cargando clientes...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="px-4 py-3 text-gray-500">No hay coincidencias</div>
              ) : (
                filteredCustomers.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setSelectedClient(client);
                      setDropdownOpen(false);
                      setSearch("");
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {client.initials || (client.name && client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()) || 'CL'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.phone}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-md">
              {selectedClient.name.charAt(0) || "AC"}
            </div>
            <div>
              <div className="text-xs text-gray-400">Cliente</div>
              <div className="font-semibold text-gray-900">{selectedClient.name}</div>
            </div>
            <button
              className="ml-auto text-gray-400 hover:text-red-500"
              onClick={() => setSelectedClient(null)}
            >
              ×
            </button>
          </div>
          <hr className="my-2" />
         
          <div className="flex flex-col sm:flex-row gap-4 text-sm mt-2">
            <div>
              <div className="text-gray-400">Teléfono</div>
              <div className="text-green-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {selectedClient.phone}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Correo electrónico</div>
              <div className="font-semibold">{selectedClient.email}</div>
            </div>
          </div>
        </div>
      )}
      {/* Sheet para crear cliente */}
      <Sheet open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
        <SheetContent side="right" className="w-full max-w-md sm:max-w-lg h-full">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-left text-xl">Crear nuevo cliente</SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-4">
            <form className="space-y-4" onSubmit={handleCreateClientSubmit}>
              {/* Nombre (floating label) */}
              <div className="relative">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={clientForm.nombre}
                  onChange={handleClientInputChange}
                  className="block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                  placeholder=" "
                  required
                />
                <label htmlFor="nombre"
                  className="absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                  peer-placeholder-shown:text-base
                  peer-focus:top-1.5 peer-focus:text-blue-600"
                >
                  Nombre
                </label>
              </div>
              {/* Email (floating label) */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={clientForm.email}
                  onChange={handleClientInputChange}
                  className="block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                  placeholder=" "
                  required
                />
                <label htmlFor="email"
                  className="absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                  peer-placeholder-shown:text-base
                  peer-focus:top-1.5 peer-focus:text-blue-600"
                >
                  Correo electrónico
                </label>
              </div>
              {/* Teléfono (floating label) */}
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={clientForm.phone}
                  onChange={handleClientInputChange}
                  className="block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600"
                  placeholder=" "
                  required
                />
                <label htmlFor="phone"
                  className="absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                  peer-placeholder-shown:text-base
                  peer-focus:top-1.5 peer-focus:text-blue-600"
                >
                  Teléfono
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4 h-12 cursor-pointer">Guardar cliente</button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function BookingPage({ selectedDate, onBack, establishmentId }: BookingPageProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([])
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  // 1. Agregar estado para la hora de inicio única
  const [startTime, setStartTime] = useState("");
  const [showTimeChangeWarning, setShowTimeChangeWarning] = useState(false);
  // 2. Eliminar 'time' de currentService y Service, y ajustar lógica de agregar servicio
  const [currentService, setCurrentService] = useState({
    name: "",
    price: 0,
    duration: "",
    professional: "",
  })
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isDateValid, setIsDateValid] = useState(true)
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { results: customerResults, loading: loadingCustomers } = useCustomerSearch(searchQuery)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const [comment, setComment] = useState("");
  const [channel, setChannel] = useState("telefono");

  // Obtener servicios activos de la sucursal
  const { services: activeServices, isLoading: isLoadingServices, error: errorServices } = useActiveServices(establishmentId)
  const { shifts, isLoading: isLoadingShifts, error: errorShifts } = useShiftsQuotes(establishmentId)

  // Obtener el día de la semana (1=lunes, 7=domingo)
  const getDayOfWeek = (date: Date) => {
    const jsDay = date.getDay(); // 0=domingo, 6=sábado
    return jsDay === 0 ? 7 : jsDay;
  };
  const selectedDayOfWeek = getDayOfWeek(selectedDate);
  // Filtrar turnos del día seleccionado
  const todaysShifts = shifts.filter(shift => shift.day_of_week === selectedDayOfWeek);

  // Generar horas disponibles según interval_minutes o 60 min por defecto
  const getAvailableTimes = () => {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    let times: string[] = [];
    for (const shift of todaysShifts) {
      let [startHour, startMinute] = shift.start_time.split(":").map(Number);
      let [endHour, endMinute] = shift.end_time.split(":").map(Number);
      let interval = shift.interval_minutes && shift.interval_minutes > 0 ? shift.interval_minutes : 60;
      let current = new Date(selectedDate);
      current.setHours(startHour, startMinute, 0, 0);
      let end = new Date(selectedDate);
      end.setHours(endHour, endMinute, 0, 0);
      while (current <= end) {
        // Si es hoy, no mostrar horas pasadas
        if (!isToday || current > now) {
          times.push(current.toTimeString().slice(0, 5)); // 'HH:MM'
        }
        current.setMinutes(current.getMinutes() + interval);
      }
    }
    // Eliminar duplicados y ordenar
    return Array.from(new Set(times)).sort();
  };
  const availableTimes = getAvailableTimes();

  // Obtener el id del servicio seleccionado
  const selectedService = activeServices.find((s: any) => s.name === currentService.name);
  const selectedServiceId = selectedService ? selectedService.id : "";
  // Preparar fecha y hora para el hook
  const selectedDateStr = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
  const selectedTime = startTime;
  // Hook para profesionales disponibles
  const { professionals, isLoading: isLoadingProfs, error: errorProfs } = useAvailableProfessionals(
    establishmentId,
    selectedServiceId,
    selectedDateStr,
    selectedTime
  );

  // Confirmación al intentar recargar/cerrar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "¿Estás seguro de cancelar la operación? Se perderán los datos ingresados."
      return e.returnValue
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Validar que la fecha seleccionada no sea anterior a hoy
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día

    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    if (selectedDateOnly < today) {
      setIsDateValid(false);
      customToast.warning({
        title: "Fecha no válida",
        description: "No puedes seleccionar una fecha anterior a hoy."
      });
    } else {
      setIsDateValid(true);
    }
  }, [selectedDate]);

  // Handler para botón volver
  const handleBack = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = () => {
    setShowCancelDialog(false)
    onBack()
  }

  const cancelDialog = () => {
    setShowCancelDialog(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Formato largo para la fecha: Hoy, 4 de jul de 2025
  const formatDateLong = (date: Date) => {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();
    return `Hoy, ${dia} de ${mes} de ${anio}`;
  };

  const handleServiceSelect = (serviceName: string) => {
    if (!isDateValid) return; // Bloquear si la fecha no es válida
    const service = activeServices.find((s: any) => s.name === serviceName)
    if (service) {
      setCurrentService({
        ...currentService,
        name: service.name,
        price: service.price,
        duration: service.duration,
      })
    }
  }

  // 3. Al seleccionar hora de inicio, advertir si ya hay servicios agregados
  const handleStartTimeChange = (value: string) => {
    if (services.length > 0) {
      setShowTimeChangeWarning(true);
    } else {
      setStartTime(value);
    }
  };

  const confirmTimeChange = (value: string) => {
    setStartTime(value);
    setServices([]); // Limpiar servicios si cambia la hora de inicio
    setShowTimeChangeWarning(false);
  };

  // 4. Calcular horarios estimados de servicios
  const getServiceTimes = () => {
    let times: { start: string; end: string }[] = [];
    if (!startTime) return times;
    let [hour, minute] = startTime.split(":").map(Number);
    let current = new Date(selectedDate);
    current.setHours(hour, minute, 0, 0);
    for (const service of services) {
      const start = new Date(current);
      const duration = Number(service.duration) || 1;
      current.setMinutes(current.getMinutes() + duration * 60);
      const end = new Date(current);
      times.push({
        start: start.toTimeString().slice(0, 5),
        end: end.toTimeString().slice(0, 5),
      });
    }
    return times;
  };

  // 5. Ajustar handleAddService para no requerir hora, solo profesional y servicio
  const handleAddService = () => {
    if (!isDateValid) return;
    if (currentService.name && currentService.professional) {
      const selectedService = activeServices.find((s: any) => s.name === currentService.name);
      const selectedServiceId = selectedService ? selectedService.id : Date.now().toString();
      const newService: Service = {
        id: selectedServiceId,
        ...currentService,
        cantidad: 1,
      };
      setServices([...services, newService]);
      setCurrentService({ name: "", price: 0, duration: "", professional: "" });
      setIsAddServiceOpen(false);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    if (!isDateValid) return; // Bloquear si la fecha no es válida
    setServices(services.filter((s) => s.id !== serviceId))
  }

  const totalAmount = services.reduce((sum, service) => sum + service.price, 0)
  const isServiceComplete = currentService.name && currentService.professional

  const { customers: activeCustomers, loading: loadingActiveCustomers } = useActiveCustomers(establishmentId);

  const { create: createQuote, loading: loadingCreateQuote } = useCreateQuote();

  // 6. Ajustar handleSaveQuote para enviar solo la hora de inicio
  const handleSaveQuote = async () => {
    if (!selectedClient) {
      customToast.error({ title: 'Cliente requerido', description: 'Selecciona un cliente para la cita.' });
      return;
    }
    if (services.length === 0) {
      customToast.error({ title: 'Servicio requerido', description: 'Agrega al menos un servicio.' });
      return;
    }
    if (!startTime) {
      customToast.error({ title: 'Hora de inicio requerida', description: 'Selecciona la hora de inicio de la cita.' });
      return;
    }
    try {
      const clientId = (selectedClient as any)?.id || (selectedClient as any)?._id || (selectedClient as any)?.id_cliente;
      const data = {
        date: selectedDate.toISOString(),
        time: startTime,
        client: selectedClient, // objeto completo para compatibilidad
        client_id: clientId, // id explícito para el backend
        services,
        comment,
        channel,
        establishment_id: establishmentId,
      };
      console.log(data)
      return
      await createQuote(data);
      customToast.success({ title: 'Cita registrada', description: 'La cita se guardó correctamente.' });
      setServices([]);
      setSelectedClient(null);
      setComment("");
      setChannel("telefono");
      setCurrentService({ name: "", price: 0, duration: "", professional: "" });
      setStartTime("");
      router.back();
    } catch (err: any) {
      customToast.error({ title: 'Error al guardar', description: err.message || 'No se pudo guardar la cita.' });
    }
  };

  // Si la fecha no es válida, mostrar mensaje de error
  if (!isDateValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Header consistente */}
        <div className="bg-white border-b border-red-100">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="p-2 border-orange-500 rounded-lg hover:bg-orange-50 bg-transparent"
              >
                <ChevronLeft className="w-8 h-8 text-orange-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Nueva reserva</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              {/* Imagen decorativa */}
              <div className="relative mb-6">
                <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4 ">
                  <CalendarX className="w-10 h-10 text-gray-500" />
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-4 ">
                <p className="text-gray-600 leading-relaxed">
                  No puedes crear reservas para fechas pasadas.
                  Por favor, selecciona una fecha actual o futura.
                </p>

                {/* Información adicional */}
                <div className="bg-yellow-50 rounded-lg p-4 mt-6 border border-yellow-100">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Consejo</span>
                  </div>
                  <p className="text-yellow-600 text-sm mt-1 text-start">
                    Las reservas solo están disponibles para fechas actuales y futuras.
                  </p>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="mt-8 text-center">
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-10"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Volver al calendario
                </Button>
              </div>

              {/* Footer decorativo */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Selecciona una fecha válida para continuar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="p-2 border-orange-500 rounded-lg hover:bg-orange-50 bg-transparent"
            >
              <ChevronLeft className="w-8 h-8 text-orange-600" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Nueva reserva</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-2">
        {/* Header Info */}
        <div className="flex items-center gap-4 mb-6 mt-4">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-6 h-6" />
            <span className="text-md font-medium">{formatDate(selectedDate)}</span>
          </div>
          <Badge variant="secondary" className="bg-[#E7F4FF] text-blue-500 hover:bg-blue-50 p-1">
            <span className="bg-blue-400 rounded-full p-1"></span>
            Abierta
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Services */}
          <div className="xl:col-span-2 space-y-6">
            {/* Services Section */}
            <div className="rounded-xl p-6 bg-white">
              <div className="pb-4">
                <div className="flex items-center gap-2 text-lg font-bold">Servicios</div>
                <p className="text-sm text-gray-600">Añade los servicios que deseas recibir</p>
              </div>

              <div className="space-y-4">
                {/* Added Services */}
                {services.map((service, idx) => {
                  const serviceTimes = getServiceTimes();
                  const timeLabel = serviceTimes[idx]
                    ? `${serviceTimes[idx].start} - ${serviceTimes[idx].end}`
                    : "";
                  return (
                    <div key={service.id + service.professional} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {service.name}{service.cantidad && service.cantidad > 1 ? ` x${service.cantidad}` : ""}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {timeLabel} - {service.cantidad || 1}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {service.professional}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-blue-600">{service.price.toFixed(2)} PEN</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}

                {/* Add Service Button */}
                <button
                  onClick={() => setIsAddServiceOpen(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600"
                >
                  <Plus className="w-5 h-5" />
                  Añadir servicio
                </button>
              </div>
            </div>

            {/* Selección de cliente tipo select */}
            <ClientSelector
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              establishmentId={establishmentId}
              customers={activeCustomers}
              loadingCustomers={loadingActiveCustomers}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <ReservationSummary
              selectedDate={selectedDate}
              services={services}
              totalAmount={totalAmount}
              comment={comment}
              setComment={setComment}
              channel={channel}
              setChannel={setChannel}
              onSave={handleSaveQuote}
              loadingSave={loadingCreateQuote}
            />
          </div>
        </div>
      </div>

      {/* Add Service Sheet */}
      <Sheet open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <SheetContent side="right" className="w-full max-w-md sm:max-w-lg h-full z-[9999]">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-left text-xl">Añadir servicio</SheetTitle>
          </SheetHeader>

          <div className="mt-4 h-full pb-20 px-4">
            {/* Service Selection */}
            <div className="space-y-4">
              <div className="relative mb-4">
                <select
                  name="category_id"
                  value={currentService.name}
                  onChange={e => handleServiceSelect(e.target.value)}
                  className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600`}
                >
                  <option value="">Selecciona un servicio</option>
                  {isLoadingServices ? (
                    <option disabled>Cargando servicios...</option>
                  ) : errorServices ? (
                    <option disabled>Error al cargar servicios</option>
                  ) : (
                    activeServices.map((cat: any) => (
                      <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                    ))
                  )}
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
                  htmlFor="category_id"
                  className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                  peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                  ${currentService.name ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                >
                  Servicio
                </label>
              </div>
            </div>

            {currentService.name && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex h-12">
                      <div className="relative">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={currentService.price.toFixed(2)}
                          readOnly
                          className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                          placeholder=" "
                        />
                        <label htmlFor="price"
                          className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                            peer-placeholder-shownpeer-placeholder-shown:text-base
                            peer-focus:top-1.5 peer-focus:tpeer-focus:text-blue-600
                            ${currentService.price ? 'top-1.5 text-sm text-blue-600' : ''}`}
                        >
                          Precio
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={currentService.duration}
                        readOnly
                        className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600 focus:border-blue-600`}
                        placeholder=" "
                      />
                      <label htmlFor="duration"
                        className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                          peer-placeholder-shownpeer-placeholder-shown:text-base
                          peer-focus:top-1.5 peer-focus:tpeer-focus:text-blue-600
                          ${currentService.duration ? 'top-1.5 text-sm text-blue-600' : ''}`}
                      >
                        Duración
                      </label>
                    </div>
                  </div>
                </div>

                {/* Date and Time Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mt-8">
                    <h3 className="text-base font-medium text-gray-500">{formatDateLong(selectedDate)}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Abierta
                    </Badge>
                  </div>

                  <div className="space-y-3 mt-4 px-0">
                    {availableTimes.length === 0 ? (
                      <div className="text-center text-gray-500 py-4 border rounded bg-gray-50">
                        No hay horarios disponibles para este día.
                      </div>
                    ) : (
                      <div className="relative mb-4">
                        <select
                          name="time"
                          value={startTime}
                          onChange={e => handleStartTimeChange(e.target.value)}
                          className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600`}
                        >
                          <option value="">Selecciona una hora</option>
                          {isLoadingShifts ? (
                            <option disabled>Cargando horarios...</option>
                          ) : errorShifts ? (
                            <option disabled>Error al cargar horarios</option>
                          ) : (
                            availableTimes.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))
                          )}
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
                          htmlFor="time"
                          className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                            peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                            ${startTime ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                        >
                          Hora de inicio
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Solo mostrar el select de profesionales si hay hora seleccionada */}
                  {startTime && (
                    <div className="space-y-3 mt-4 px-0">
                      <div className="relative mb-4">
                        <select
                          name="professional"
                          value={currentService.professional || ""}
                          onChange={e => setCurrentService({ ...currentService, professional: e.target.value })}
                          className={`block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 transition peer border-gray-200 focus:ring-blue-600`}
                        >
                          <option value="">Selecciona un profesional</option>
                          {isLoadingProfs ? (
                            <option disabled>Cargando profesionales...</option>
                          ) : errorProfs ? (
                            <option disabled>Error al cargar profesionales</option>
                          ) : (
                            professionals.map((prof: any) => (
                              <option key={prof.id} value={prof.name}>{prof.name}</option>
                            ))
                          )}
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
                          htmlFor="professional"
                          className={`absolute left-4 top-1.5 text-gray-400 text-base pointer-events-none transition-all
                            peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-600
                            ${currentService.professional ? 'top-1.5 text-sm text-blue-600' : 'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base'}`}
                        >
                          Profesional
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
            <Button
              onClick={handleAddService}
              disabled={!isServiceComplete || availableTimes.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium"
            >
              Añade
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar reserva?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500">¿Estás seguro de cancelar la operación? Se perderán los datos ingresados.</p>
          <DialogFooter>
            <Button className="h-10 border-red-500 text-red-500 hover:text-red-500  cursor-pointer" variant="outline" onClick={cancelDialog}>No, continuar</Button>
            <Button className="h-10 cursor-pointer" variant="destructive" onClick={confirmCancel}>Sí, cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de advertencia si showTimeChangeWarning es true */}
      {showTimeChangeWarning && (
        <Dialog open={showTimeChangeWarning} onOpenChange={setShowTimeChangeWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Advertencia de cambio de hora</DialogTitle>
            </DialogHeader>
            <p className="text-gray-500">
              Has seleccionado una nueva hora de inicio de cita.
              Esto significa que todos los servicios agregados hasta ahora
              se reajustarán para comenzar en esta nueva hora.
              ¿Estás seguro de que deseas continuar?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTimeChangeWarning(false)}>No, volver atrás</Button>
              <Button variant="destructive" onClick={() => confirmTimeChange(startTime)}>Sí, continuar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
