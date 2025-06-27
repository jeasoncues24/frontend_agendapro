"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, X, Check, Pencil } from "lucide-react"
import { FaTrash } from "react-icons/fa"
import { HiPencil } from "react-icons/hi2";


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
  const [activeTab, setActiveTab] = useState("regulares")
  const [regularSchedule, setRegularSchedule] = useState<Record<string, DaySchedule>>({
    lunes: {
      slots: [{ id: "lunes-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    martes: {
      slots: [{ id: "martes-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    miercoles: {
      slots: [{ id: "miercoles-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    jueves: {
      slots: [{ id: "jueves-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    viernes: {
      slots: [{ id: "viernes-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    sabado: {
      slots: [{ id: "sabado-1", open: "08:15", close: "16:45", isEditing: false }],
    },
    domingo: {
      slots: [{ id: "domingo-1", open: "08:15", close: "16:45", isEditing: false }],
    },
  })


  const days = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ]

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
          {[
            { key: "regulares", label: "Regulares" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 px-4 text-md font-medium border-b-2 transition-all duration-300 ease-in-out ${
                activeTab === key
                  ? "text-blue-500 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "regulares" && (
        <div className="space-y-6 p-4 bg-white">
          <div className="grid grid-cols-[250px_120px_120px_min-content] gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-6 ">
            <div>DÍA</div>
            <div>ABRE</div>
            <div>CIERRA</div>
            <div></div>
          </div>

          {days.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              {regularSchedule[key].slots.map((slot, slotIndex) => (
                <div
                  key={slot.id}
                  className={`grid grid-cols-[250px_120px_120px_min-content] gap-1 items-center py-3 px-1 -mx-1 edit-transition row-highlight border-b border-gray-100 ${
                    slot.isEditing ? "row-editing" : ""
                  }`}
                >
                  <div className="font-medium text-gray-800">{slotIndex === 0 ? label : ""}</div>

                  <Select
                    value={slot.open}
                    onValueChange={(value) => updateSchedule(key, slot.id, "open", value)}
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
                    onValueChange={(value) => updateSchedule(key, slot.id, "close", value)}
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
                          onClick={() => cancelEdit(key, slot.id)}
                          className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                        <button
                          onClick={() => confirmEdit(key, slot.id)}
                          className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleEdit(key, slot.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                        >
                          <HiPencil className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => deleteTimeSlot(key, slot.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                        >
                          <FaTrash className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                        </button>
                      </div>
                    )}

                    {slotIndex === 0 && (
                      <button
                        onClick={() => addTimeSlot(key)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
