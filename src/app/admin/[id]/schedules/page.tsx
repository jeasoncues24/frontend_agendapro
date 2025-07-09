"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, X, Check, Pencil } from "lucide-react"
import { FaTrash } from "react-icons/fa"
import { HiPencil } from "react-icons/hi2";
import { useShift } from "@/hooks/useShift";
import { useParams, useSearchParams } from "next/navigation"
import { useBranchStore } from "@/store/branchStore"
import cookies from "js-cookie"
import { Skeleton } from "@/components/ui/skeleton";
import { customToast } from "@/components/ui/custom-toast";

interface TimeSlot {
  id: string
  open: string
  close: string
  isEditing: boolean
}

interface DaySchedule {
  slots: TimeSlot[]
}


export default function ScheduleManager() {
  const params = useParams();
  const companyId = params.id as string;
  const searchParams = useSearchParams();
  const branchIdFormUrl = searchParams?.get('branch');
  const [establishmentId, setEstablishmentId] = useState<string | undefined>(undefined);
  const { selectedBranch } = useBranchStore();

  useEffect(() => {

      const user = cookies.get('user');
      if ( user ) {
          if ( selectedBranch ) {
              setEstablishmentId(selectedBranch)
          }
      }

  }, [selectedBranch]);
 
  const { shift, isLoading, error } = useShift(establishmentId!);

  useEffect(() => {
    if (error) {
      customToast.error({
        title: "Error al cargar turnos",
        description: error,
      });
    }
  }, [error]);

  const daysOfWeek = [
    { key: 1, label: "Lunes", stateKey: "lunes" },
    { key: 2, label: "Martes", stateKey: "martes" },
    { key: 3, label: "Miércoles", stateKey: "miercoles" },
    { key: 4, label: "Jueves", stateKey: "jueves" },
    { key: 5, label: "Viernes", stateKey: "viernes" },
    { key: 6, label: "Sábado", stateKey: "sabado" },
    { key: 7, label: "Domingo", stateKey: "domingo" },
  ];

  // Estado local editable
  const [regularSchedule, setRegularSchedule] = useState<Record<string, DaySchedule>>({
    lunes: { slots: [] },
    martes: { slots: [] },
    miercoles: { slots: [] },
    jueves: { slots: [] },
    viernes: { slots: [] },
    sabado: { slots: [] },
    domingo: { slots: [] },
  });

  // Sincroniza los turnos del backend al estado local editable
  useEffect(() => {
    if (!shift || !Array.isArray(shift)) return;
    const newSchedule: Record<string, DaySchedule> = {
      lunes: { slots: [] },
      martes: { slots: [] },
      miercoles: { slots: [] },
      jueves: { slots: [] },
      viernes: { slots: [] },
      sabado: { slots: [] },
      domingo: { slots: [] },
    };
    shift.forEach((s: any) => {
      const day = daysOfWeek.find(d => d.key === s.day_of_week)?.stateKey;
      if (day) {
        newSchedule[day].slots.push({
          id: s.id,
          open: s.start_time.slice(0,5),
          close: s.end_time.slice(0,5),
          isEditing: false,
        });
      }
    });
    setRegularSchedule(newSchedule);
  }, [shift]);

  const [activeTab, setActiveTab] = useState("regulares")

  const timeOptions = [
    "00:00",
    "06:00",
    "07:00",
    "08:00",
    "08:15",
    "08:30",
    "09:00",
    "10:00",
    "10:45",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "16:45",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  const updateSchedule = (day: string, slotId: string, field: "open" | "close", value: string) => {
    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const toggleEdit = (day: string, slotId: string) => {
    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, isEditing: !slot.isEditing } : slot)),
      },
    }))
  }

  
  const confirmEdit = (day: string, slotId: string) => {
    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, isEditing: false } : slot)),
      },
    }))
  }

 

  const cancelEdit = (day: string, slotId: string) => {
    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, isEditing: false } : slot)),
      },
    }))
  }


  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: `${day}-${Date.now()}`,
      open: "09:00",
      close: "17:00",
      isEditing: true,
    }

    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, newSlot],
      },
    }))
  }

  const deleteTimeSlot = (day: string, slotId: string) => {
    setRegularSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((slot) => slot.id !== slotId),
      },
    }))
  }

 

  return (
    <div className="max-w-full p-8 bg-gray-100  font-inter">

      <div className="mb-8">
         <h1 className="text-4xl font-bold">Horarios</h1>
      </div>
      <div className="">
        <div className="flex space-x-8 border-b border-gray-200 bg-white pt-4">
          <button
            className="pb-3 px-4 text-md font-medium border-b-2 transition-all duration-300 ease-in-out text-blue-500 border-blue-600"
          >
            Regulares
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2 mt-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      )}
      {activeTab === "regulares" && !isLoading && !error && (
        <div className="space-y-6 p-4 bg-white">
          <div className="grid grid-cols-[250px_120px_120px_min-content] gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-6 ">
            <div>DÍA</div>
            <div>ABRE</div>
            <div>CIERRA</div>
            <div></div>
          </div>
          {daysOfWeek.map(({ stateKey, label }) => (
            <div key={stateKey} className="space-y-2">
              {regularSchedule[stateKey].slots.map((slot, slotIndex) => (
                <div
                  key={slot.id}
                  className={`grid grid-cols-[250px_120px_120px_min-content] gap-1 items-center py-3 px-1 -mx-1 edit-transition row-highlight border-b border-gray-100 ${
                    slot.isEditing ? "row-editing" : ""
                  }`}
                >
                  <div className="font-medium text-gray-800">{slotIndex === 0 ? label : ""}</div>

                  <Select
                    value={slot.open}
                    onValueChange={(value) => updateSchedule(stateKey, slot.id, "open", value)}
                    disabled={!slot.isEditing}
                  >
                    <SelectTrigger
                      className={`border-0 h-10 text-sm transition-all duration-200 ${
                        slot.isEditing
                          ? "bg-white ring-2 ring-blue-500 ring-opacity-20 hover:bg-gray-50"
                          : "bg-gray-300 text-gray-800 font-semibold cursor-not-allowed"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={slot.close}
                    onValueChange={(value) => updateSchedule(stateKey, slot.id, "close", value)}
                    disabled={!slot.isEditing}
                  >
                    <SelectTrigger
                      className={`border-0 h-10 text-sm transition-all duration-200 ${
                        slot.isEditing
                          ? "bg-white ring-2 ring-blue-500 ring-opacity-20 hover:bg-gray-50"
                          : "bg-gray-300 text-gray-800 font-semibold cursor-not-allowed"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-3">
                    {slot.isEditing ? (
                      <div className="flex items-center gap-3 button-appear">
                        <button
                          onClick={() => cancelEdit(stateKey, slot.id)}
                          className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        <button
                          onClick={() => confirmEdit(stateKey, slot.id)}
                          className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleEdit(stateKey, slot.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                        >
                          <HiPencil className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => deleteTimeSlot(stateKey, slot.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                        >
                          <FaTrash className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                        </button>
                      </div>
                    )}

                    {slotIndex === 0 && (
                      <button
                        onClick={() => addTimeSlot(stateKey)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-500 text-sm font-medium transition-all duration-200 hover:scale-105 w-48"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
                          <Plus className="h-3 w-3 text-white" />
                        </div>
                        Agregar turno
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {regularSchedule[stateKey].slots.length === 0 && (
                <div className="text-gray-400 pl-2">No hay turnos</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
