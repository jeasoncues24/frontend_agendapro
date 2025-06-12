"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Trash, Trash2 } from "lucide-react"
import Image from "next/image"

interface PaymentMethod {
  id: string
  name: string
  icon: string
  color: string
  configured: boolean
  enabled: boolean
  image: string
}

export default function PaymentConfigComponent() {
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
      {/* Pago QR Section */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Pago QR</h2>
          <p className="text-sm text-gray-600">Aquí puedes agregar o editar tus datos de tipo QR</p>
        </div>

        <div className="col-span-9">
          <Card className="bg-white rounded-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-base mb-6 text-gray-900">Medios de pago para recibir el pago con código QR o Efectivo.</h3>

              <div className="space-y-4">
                {qrMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full ${method.color} flex items-center justify-center text-white text-sm font-bold`}
                      >
                        <Image src={`/images/payment/${method.image}`} alt={method.image} width={100} height={100}/>
                      </div>
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>

                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => configureMethod(method.id)}
                        className="text-gray-700 border-gray-300"
                      >
                        Configurar
                      </Button>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 min-w-[80px]">
                          {method.enabled ? "Activado" : "Desactivado"}
                        </span>
                        <Switch
                          checked={method.enabled}
                          onCheckedChange={() => toggleMethod(method.id)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMethod(method.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2"
                      >
                        <Trash className="h-4 w-4 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Button variant="outline" className="text-gray-700 hover:bg-gray-50 font-normal">
                    Agregar método de pago
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Pago Bancarios</h2>
          <p className="text-sm text-gray-600">Aquí podrás agregar métodos de pagos de bancos.</p>
        </div>

        <div className="col-span-9">
          <Card className="bg-white rounded-sm">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-6">No hay métodos de pago</p>
                <Button variant="outline" className="text-gray-700 hover:bg-gray-50 font-normal">
                  Agregar método de pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
