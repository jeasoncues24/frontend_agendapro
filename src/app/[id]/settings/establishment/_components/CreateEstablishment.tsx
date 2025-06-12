"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
    id: string
    name: string
    icon: string
    color: string
    configured: boolean
    enabled: boolean
    image: string
}

export default function CreateEstablishmentComponent() {
    const [qrMethods, setQrMethods] = useState<PaymentMethod[]>([
        {
            id: "efectivo",
            name: "EFECTIVO",
            icon: "Y",
            color: "bg-purple-600",
            configured: false,
            enabled: false,
            image: "1732551363967-493808512.png"
        },
        {
            id: "yape",
            name: "YAPE",
            icon: "P",
            color: "bg-blue-500",
            configured: false,
            enabled: false,
            image: "1732552185381-384602505.png"
        },
        {
            id: "plin",
            name: "PLIN",
            icon: "T",
            color: "bg-pink-500",
            configured: false,
            enabled: false,
            image: "1732568695903-373179425.png"
        },
    ])

    const toggleMethod = (id: string) => {
        setQrMethods((methods) =>
            methods.map((method) => (method.id === id ? { ...method, enabled: !method.enabled } : method)),
        )
    }

    const deleteMethod = (id: string) => {
        setQrMethods((methods) => methods.filter((method) => method.id !== id))
    }

    const configureMethod = (id: string) => {
        console.log(`Configurando método: ${id}`)
    }

    return (
        <div className="max-w-6xl mx-auto p-6  min-h-screen">
            <div className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos básicos</h2>
                    <p className="text-sm text-gray-600">Agregue los datos de la sucursal, si es que no existe la sucursal, agregue un nombre y ubicación para crearlo.</p>
                </div>

                <div className="col-span-9">
                    <Card className="bg-white rounded-sm">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                               
                                <div>
                                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Nombre *
                                    </Label>
                                    <Input
                                        id="nombre"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ubicacion" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Ubicación *
                                    </Label>
                                    <Input
                                        id="ubicacion"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end">
                <Button className="bg-[#25B562] hover:bg-teal-700 text-white px-8">
                Guardar
                </Button>
            </div>
        </div>
    )
}
