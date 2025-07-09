"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Clock } from "lucide-react"

interface ProfessionalSelectorProps {
  selectedProfessional: any
  onProfessionalSelect: (professional: any) => void
  selectedService?: any
}

const professionals = [
  {
    id: "maria",
    name: "María González",
    specialty: "Estilista Senior",
    rating: 4.9,
    reviews: 127,
    experience: "8 años",
    avatar: "/placeholder.svg?height=60&width=60",
    specialties: ["corte-mujer", "tinte", "pedicure"],
    available: true,
    nextSlot: "9:00 AM",
  },
  {
    id: "carlos",
    name: "Carlos Ruiz",
    specialty: "Barbero Master",
    rating: 4.8,
    reviews: 89,
    experience: "6 años",
    avatar: "/placeholder.svg?height=60&width=60",
    specialties: ["corte-hombre", "barba"],
    available: true,
    nextSlot: "10:30 AM",
  },
  {
    id: "ana",
    name: "Ana Martínez",
    specialty: "Colorista Experta",
    rating: 4.9,
    reviews: 156,
    experience: "10 años",
    avatar: "/placeholder.svg?height=60&width=60",
    specialties: ["tinte", "corte-mujer"],
    available: true,
    nextSlot: "11:00 AM",
  },
  {
    id: "luis",
    name: "Luis Fernández",
    specialty: "Estilista Integral",
    rating: 4.7,
    reviews: 73,
    experience: "4 años",
    avatar: "/placeholder.svg?height=60&width=60",
    specialties: ["corte-hombre", "corte-mujer", "manicure"],
    available: false,
    nextSlot: "2:00 PM",
  },
]

export function ProfessionalSelector({
  selectedProfessional,
  onProfessionalSelect,
  selectedService,
}: ProfessionalSelectorProps) {
  const filteredProfessionals = selectedService
    ? professionals.filter((prof) => prof.specialties.includes(selectedService.id))
    : professionals

  return (
    <div className="space-y-4">
      {filteredProfessionals.map((professional) => (
        <Card
          key={professional.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedProfessional?.id === professional.id
              ? "ring-2 ring-orange-500 border-orange-200 bg-orange-50"
              : "hover:border-orange-200"
          } ${!professional.available ? "opacity-60" : ""}`}
          onClick={() => professional.available && onProfessionalSelect(professional)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm">{professional.name}</h3>
                  <div className="flex items-center gap-2">
                    {professional.available ? (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        Ocupado
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-2">{professional.specialty}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {professional.rating} ({professional.reviews})
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {professional.experience}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Próximo disponible: {professional.nextSlot}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
