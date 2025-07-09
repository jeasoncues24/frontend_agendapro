"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TimeSlotSelectorProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
}

const timeSlots = [
  { time: "09:00", available: true, popular: false },
  { time: "09:30", available: true, popular: true },
  { time: "10:00", available: true, popular: true },
  { time: "10:30", available: true, popular: false },
  { time: "11:00", available: false, popular: false },
  { time: "11:30", available: true, popular: true },
  { time: "12:00", available: true, popular: false },
  { time: "12:30", available: false, popular: false },
  { time: "14:00", available: true, popular: false },
  { time: "14:30", available: true, popular: true },
  { time: "15:00", available: true, popular: true },
  { time: "15:30", available: true, popular: false },
  { time: "16:00", available: true, popular: false },
  { time: "16:30", available: false, popular: false },
  { time: "17:00", available: true, popular: false },
  { time: "17:30", available: true, popular: false },
  { time: "18:00", available: true, popular: false },
  { time: "18:30", available: true, popular: false },
]

export function TimeSlotSelector({ selectedTime, onTimeSelect }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Popular</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>No disponible</span>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {timeSlots.map((slot) => (
          <div key={slot.time} className="relative">
            <Button
              variant={selectedTime === slot.time ? "default" : "outline"}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`w-full text-sm h-12 relative ${
                selectedTime === slot.time
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : slot.available
                    ? "hover:border-orange-300 hover:bg-orange-50"
                    : "opacity-50 cursor-not-allowed"
              } ${slot.popular && slot.available ? "border-orange-200 bg-orange-50" : ""}`}
            >
              {slot.time}
            </Button>
            {slot.popular && slot.available && (
              <Badge className="absolute -top-2 -right-2 text-xs bg-orange-600 hover:bg-orange-600 px-1 py-0">★</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
