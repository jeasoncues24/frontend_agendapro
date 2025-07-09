"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

interface ServiceSelectorProps {
  selectedService: any
  onServiceSelect: (service: any) => void
}

const services = [
  {
    id: "corte-hombre",
    name: "Corte Caballero",
    price: 35,
    duration: "30 min",
    description: "Corte moderno con acabado profesional",
    popular: true,
    rating: 4.9,
  },
  {
    id: "corte-mujer",
    name: "Corte y Peinado Dama",
    price: 55,
    duration: "45 min",
    description: "Corte personalizado con peinado incluido",
    popular: true,
    rating: 4.8,
  },
  {
    id: "tinte",
    name: "Coloración Completa",
    price: 120,
    duration: "120 min",
    description: "Tinte profesional con tratamiento nutritivo",
    popular: false,
    rating: 4.7,
  },
  {
    id: "barba",
    name: "Arreglo de Barba",
    price: 25,
    duration: "20 min",
    description: "Perfilado y arreglo profesional de barba",
    popular: false,
    rating: 4.9,
  },
  {
    id: "manicure",
    name: "Manicure Spa",
    price: 40,
    duration: "45 min",
    description: "Manicure completo con tratamiento hidratante",
    popular: true,
    rating: 4.8,
  },
  {
    id: "pedicure",
    name: "Pedicure Premium",
    price: 60,
    duration: "60 min",
    description: "Pedicure completo con exfoliación y masaje",
    popular: false,
    rating: 4.6,
  },
]

export function ServiceSelector({ selectedService, onServiceSelect }: ServiceSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedService?.id === service.id
              ? "ring-2 ring-orange-500 border-orange-200 bg-orange-50"
              : "hover:border-orange-200"
          }`}
          onClick={() => onServiceSelect(service)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{service.name}</h3>
                  {service.popular && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {service.rating}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">S/. {service.price}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
