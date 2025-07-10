"use client"

import { useEffect, useState, useRef } from "react"
import { StatsCards } from "./_components/StatsCards"
import { CalendarHeader } from "./_components/CalendarHeader"
import { CalendarView } from "./_components/CalendarView"
import type { Appointment } from "./_components/CalendarView";
import { CustomNavigation } from "./_components/CustomNavigation"
import { BookingPage } from "./_components/BookingPage"
import { useParams, useSearchParams } from "next/navigation"
import { useBranchStore } from "@/store/branchStore"
import cookies from "js-cookie"
import { useQuotes } from "@/hooks/useQuotes"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useUsers";
import { useCategoriesServicesForBranch } from "@/hooks/useCategoriesServicesForBranch";
import { useService } from "@/hooks/useService";
import { useShift } from "@/hooks/useShift";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { companyService } from "@/services/company.service";
import { customToast } from "@/components/ui/custom-toast";
import { useQuotesStats } from "@/hooks/useQuotesStats";


export default function QuotesPage() {
    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const branchIdFormUrl = searchParams?.get('branch');
    const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);
    const { selectedBranch } = useBranchStore();

    const [refreshKey, setRefreshKey] = useState(0);
    const { quotes, isLoading, error } = useQuotes(establishmentId, refreshKey);
    const [currentDate, setCurrentDate] = useState(new Date());
    const { stats, loading: loadingStats, error: errorStats } = useQuotesStats(establishmentId, formatDateToYYYYMMDD(currentDate));

    // Notificación visual cuando llega una nueva reserva
    const [prevCount, setPrevCount] = useState(0);
    const firstLoad = useRef(true);
    useEffect(() => {
      if (isLoading) return;
      if (firstLoad.current) {
        setPrevCount(quotes.length);
        firstLoad.current = false;
        return;
      }
      if (quotes.length > prevCount) {
        customToast.success({
          title: "¡Nueva reserva!",
          description: "Ha llegado una nueva reserva a tu sucursal.",
        });
        setRefreshKey(k => k + 1); // Fuerza la recarga solo cuando llega una nueva reserva
      }
      setPrevCount(quotes.length);
    }, [quotes, isLoading]);

    // Onboarding Wizard State
    const { users, isLoading: loadingUsers } = useUsers(companyId, establishmentId);
    const { data: categories, loading: loadingCategories } = useCategoriesServicesForBranch(establishmentId || "");
    const { services, isLoading: loadingServices } = useService(companyId, establishmentId);
    const { shift, isLoading: loadingShifts } = useShift(establishmentId || "");
    const [showDialog, setShowDialog] = useState(false);
    const [showSheet, setShowSheet] = useState(false);
    const [wasDialogOpened, setWasDialogOpened] = useState(false);
    const [hasLogo, setHasLogo] = useState<boolean>(false);
    const [loadingLogo, setLoadingLogo] = useState<boolean>(true);

    useEffect(() => {
        async function fetchLogo() {
            if (companyId) {
                setLoadingLogo(true);
                try {
                    const company = await companyService.getCompanyById(companyId);
                    setHasLogo(!!company.logo_path);
                } catch (e) {
                    setHasLogo(false);
                } finally {
                    setLoadingLogo(false);
                }
            } else {
                setLoadingLogo(false);
            }
        }
        fetchLogo();
    }, [companyId]);

    const isLoadingOnboarding = loadingUsers || loadingCategories || loadingServices || loadingShifts || loadingLogo;

    useEffect(() => {
        if (isLoadingOnboarding) return;
        const hasPending = (
            (Array.isArray(users) && users.length === 0) ||
            (Array.isArray(categories) && categories.length === 0) ||
            (Array.isArray(services) && services.length === 0) ||
            (Array.isArray(shift) && shift.length === 0) ||
            !hasLogo
        );
        if (hasPending && !wasDialogOpened) {
            setShowDialog(true);
            setWasDialogOpened(true);
        }
        if (!hasPending) {
            setShowDialog(false);
        }
    }, [isLoadingOnboarding, users, categories, services, shift, establishmentId, hasLogo, wasDialogOpened]);

    useEffect(() => {
        async function fetchLogo() {
            if (companyId) {
                try {
                    const company = await companyService.getCompanyById(companyId);
                    setHasLogo(!!company.logo_path);
                } catch (e) {
                    setHasLogo(false);
                }
            }
        }
        fetchLogo();
    }, [companyId]);

    const steps = [
        {
            label: "Cargue el logotipo de su empresa",
            done: hasLogo,
            time: "2 minutos",
            desc: "¡Guau! Bonito logo."
        },
        {
            label: "Añade usuarios",
            done: Array.isArray(users) && users.length > 0,
            time: "3 minutos",
            desc: "Invita a tu equipo para que puedan acceder."
        },
        {
            label: "Crea categorías de servicios",
            done: Array.isArray(categories) && categories.length > 0,
            time: "2 minutos",
            desc: "Organiza tus servicios en categorías."
        },
        {
            label: "Agrega servicios",
            done: Array.isArray(services) && services.length > 0,
            time: "5 minutos",
            desc: "Crea los servicios que ofrecerás."
        },
        {
            label: "Añade tus horarios de trabajo",
            done: Array.isArray(shift) && shift.length > 0,
            time: "2 minutos",
            desc: "Configura los turnos de atención."
        },
    ];

    const progress = Math.round((steps.filter(s => s.done).length / steps.length) * 100);

    const appointments = quotes;
    const [activeView, setActiveView] = useState<"calendario" | "listado">("calendario")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showBooking, setShowBooking] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // useEffect(() => {
    //   if (selectedAppointment && quotes.length > 0) {
    //     const updated = quotes.find(q => q.id === selectedAppointment.id);
    //     if (updated) {
    //       setSelectedAppointment(updated);
    //     } else {
    //       setSelectedAppointment(null); // Si la cita ya no existe, cierra el panel
    //     }
    //   }
    // }, [quotes]);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date)
        setShowBooking(true)
    }


    const handleBackToCalendar = () => {
        setShowBooking(false)
        setSelectedDate(null)
    }

    useEffect(() => {

        const user = cookies.get('user');
        if (user) {
            if (selectedBranch) {
                setEstablishmentId(selectedBranch)
            }
        }

    }, [selectedBranch]);

    if (showBooking && selectedDate) {
        return <BookingPage selectedDate={selectedDate} onBack={handleBackToCalendar} establishmentId={establishmentId!} />
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Dialog inicial con diseño atractivo */}
            {!isLoadingOnboarding && (
                <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
                    <DialogContent showCloseButton={true} className="bg-transparent border-none shadow-none p-0 max-w-3xl">
                        <DialogTitle className="sr-only">Configura tu empresa y agenda como un pro</DialogTitle>
                        <div
                            className="flex items-center justify-between rounded-2xl px-8 py-6"
                            style={{
                                background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
                                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)"
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-2xl font-bold text-gray-900 mb-1">Configura tu empresa y agenda como un pro</div>
                                <div className="text-sm text-gray-800 max-w-md">
                                    Termina la configuración inicial para desbloquear todas las funciones y brindar la mejor experiencia a tus clientes.
                                </div>
                            </div>
                            <div className="flex items-center ml-8">
                                <button
                                    className="bg-orange-500 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-md shadow transition-all text-base cursor-pointer"
                                    onClick={() => { setShowSheet(true); setShowDialog(false); }}
                                >
                                    Configurar
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Configuración previa de la empresa */}
            <Sheet open={showSheet} onOpenChange={setShowSheet}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-lg"
                >
                    <SheetHeader>
                        <SheetTitle>Configuración inicial</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <div className="bg-black text-white rounded-lg p-4 flex items-center justify-between my-4">
                            <div>
                                <div className="font-semibold text-lg">¡Tu negocio tiene buena pinta!</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <svg width="48" height="48" viewBox="0 0 48 48">
                                    <circle cx="24" cy="24" r="20" stroke="#fff" strokeWidth="4" fill="none" opacity="0.2" />
                                    <circle cx="24" cy="24" r="20" stroke="#ff6600" strokeWidth="4" fill="none" strokeDasharray="125.6" strokeDashoffset={125.6 - (progress / 100) * 125.6} />
                                    <text x="24" y="28" textAnchor="middle" fontSize="16" fill="#fff">{progress}%</text>
                                </svg>
                            </div>
                        </div>
                        <div className="mb-2 text-gray-700 font-semibold">Pasos para terminar</div>
                        <div className="space-y-2 mb-6">
                            {steps.map((step, idx) => (
                                <div key={idx} className={`flex items-center justify-between rounded-lg px-4 py-3 border ${step.done ? 'bg-white border-gray-200' : 'bg-gray-100 border-dashed border-gray-300'}`}>
                                    <div className="flex items-center gap-2">
                                        {step.done ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-400" />}
                                        <div>
                                            <div className="font-medium">{step.label}</div>
                                            <div className="text-xs text-gray-500">{step.desc}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {step.done && <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-500 font-semibold">Hecho</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
           
            <div className="px-8 py-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Mis citas</h1>

                <CustomNavigation activeView={activeView} onViewChange={setActiveView} />

                {activeView === "calendario" ? (
                    <div className="space-y-6">
                        {error || errorStats ? (
                            <div className="text-red-500">Error al cargar datos. {error?.toString() || errorStats?.toString()}</div>
                        ) : isLoading || loadingStats || !stats ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-5">
                                    <Skeleton className="h-24 w-84" />
                                    <Skeleton className="h-24 w-84" />
                                    <Skeleton className="h-24 w-84" />
                                    <Skeleton className="h-24 w-84" />
                                    <Skeleton className="h-24 w-84" />
                                </div>
                                <Skeleton className="h-12 w-1/2" />
                                <Skeleton className="h-96 w-full" />
                            </div>
                        ) : (
                            <StatsCards stats={stats} />
                        )}
                        {isLoading ? (
                            <Skeleton className="h-12 w-1/2" />
                        ) : (
                            <CalendarHeader currentDate={currentDate} onDateChange={setCurrentDate} />
                        )}
                        {isLoading ? (
                            <Skeleton className="h-96 w-full" />
                        ) : (
                            <CalendarView
                                currentDate={currentDate}
                                appointments={appointments}
                                onDayClick={handleDayClick}
                                selectedAppointment={selectedAppointment}
                                setSelectedAppointment={setSelectedAppointment}
                            />
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border p-8 text-center">
                        <p className="text-gray-500">Vista de listado general - Por implementar</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function formatDateToYYYYMMDD(date: Date) {
  return date.toISOString().split('T')[0];
}
