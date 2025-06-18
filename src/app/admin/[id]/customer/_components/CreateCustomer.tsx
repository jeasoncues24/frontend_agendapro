"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export default function CreateCustomerComponent() {
    

    const configureMethod = (id: string) => {
        console.log(`Configurando método: ${id}`)
    }

    return (
        <div className="max-w-6xl mx-auto p-6  min-h-screen">
            <div className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos básicos</h2>
                    <p className="text-sm text-gray-600">Agregue los datos básicos del cliente, si es que no existe el cliente, agregue un nombre, correo y número de celular para crearlo en la sucursal ingresada.</p>
                </div>

                <div className="col-span-9">
                    <Card className="bg-white rounded-sm">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="nombres" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Nombre *
                                        </Label>
                                        <Input
                                            id="nombres"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Email *
                                        </Label>
                                        <Input
                                            id="email"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                      
                                <div>
                                    <Label htmlFor="idtelefonoentificacion" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Telefono *
                                    </Label>
                                    <Input
                                        id="telefono"
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
