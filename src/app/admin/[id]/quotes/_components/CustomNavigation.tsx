"use client"

import { Button } from "@/components/ui/button"
import { Calendar, List } from "lucide-react"

interface CustomNavigationProps {
  activeView: "calendario" | "listado"
  onViewChange: (view: "calendario" | "listado") => void
}

export function CustomNavigation({ activeView, onViewChange }: CustomNavigationProps) {
  return (
    <div className="flex items-center gap-6 mb-6">
      <Button
        variant="ghost"
        onClick={() => onViewChange("calendario")}
        className={`flex items-center gap-2 px-0 py-2 h-auto font-medium relative hover:bg-transparent text-md ${
          activeView === "calendario" ? "text-black" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Calendario
        {activeView === "calendario" && (
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Button>

      <Button
        variant="ghost"
        onClick={() => onViewChange("listado")}
        className={`flex items-center gap-2 px-0 py-2 h-auto font-medium relative hover:bg-transparent text-md ${
          activeView === "listado" ? "text-black" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List className="w-4 h-4" />
        Listado general
        {activeView === "listado" && (
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Button>
    </div>
  )
}
