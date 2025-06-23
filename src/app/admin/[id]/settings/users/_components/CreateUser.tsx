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

export default function CreateUserComponent() {

    return (
        <div className="max-w-6xl mx-auto p-6  min-h-screen">
            <div className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Datos básicos</h2>
                    <p className="text-sm text-gray-600">Agregue los datos básicos del usuario, si es que no existe el usuario, agregue un correo y contraseña para crearlo en la sucursal ingresada.</p>
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
                                        <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Apellidos *
                                        </Label>
                                        <Input
                                            id="apellidos"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Rol *</Label>
                                        <Select
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Administrador">Administrador</SelectItem>
                                                <SelectItem value="Staff">Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="identificacion" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Identificación *
                                        </Label>
                                        <Input
                                            id="identificacion"
                                            className="w-full"
                                        />
                                    </div>

                                    
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

                                <div>
                                    <Label htmlFor="contrasena" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Contraseña *
                                    </Label>
                                    <Input
                                        id="contrasena"
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
