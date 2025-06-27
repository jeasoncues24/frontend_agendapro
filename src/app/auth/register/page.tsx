"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


interface Plan {
    id: number;
    name: string;
    price: string;
    isFree: boolean;
    isRecommended: boolean;
    features: string[];
}

export default function RegisterPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rawData, setRawData] = useState<any>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true)

                const endpoint = process.env.NODE_ENV === 'production'
                    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
                    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV


                const response = await fetch(`${endpoint}/plans`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    cache: 'no-store' 
                })

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }

                const data = await response.json()
                const dataPlanes = data.data; 
                console.log(dataPlanes)
                setRawData(dataPlanes) 

                if (!dataPlanes || dataPlanes.length === 0) {
                    throw new Error('No se encontraron planes')
                }

                const processedPlans = dataPlanes.map((plan: any) => ({
                    id: plan.id,
                    name: plan.name,
                    price: plan.price,
                    isFree: plan.free_period > 0,
                    isRecommended: parseFloat(plan.price) > 50,
                    features: [
                        plan.access_pos ? "Incluye punto de venta" : "No incluye punto de venta",
                        `Hasta ${plan.limit_branch} sucursales`,
                        `Hasta ${plan.limit_user} usuarios`,
                        plan.status === 1 ? "Soporte por chat o correo" : "Soporte por chat, correo y teléfono",
                    ]
                }))

                setPlans(processedPlans)
            } catch (err: any) {
                console.error("Error al cargar planes:", err)
                setError(err.message || "No se pudieron cargar los planes")
            } finally {
                setLoading(false)
            }
        }

        fetchPlans()
    }, [])

    if ( loading ) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <p>Cargando planes....</p>
            </div>
        )
    }

    if ( error ) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <Button onClick={() => window.location.reload()}>
                    Intentar de nuevo
                </Button>
            </div>
        )
    }

    
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Logo */}
        {/* <div className="flex justify-center mb-8">
          <Image src="/images/logo2-d9f766ab21a0af61c09fa4e3f623399ce1df94d092eeeb1f63875d3da808cd91.png" alt="Logo" width={2000} height={40} className="h-24 w-auto" />
        </div> */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">AgendaPro</span>
            <span className="text-sm text-gray-500 font-medium">cloud</span>
          </div>
        </div>

        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Paso 1 de 3</span>
            <span></span>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold mb-2">Elige un plan</h1>
          <p className="text-muted-foreground">Estás a muy pocos pasos de finalizar</p>
          <p className="text-xs text-muted-foreground mt-2">
            {plans.length} planes disponibles
          </p>
        </div>
        
        <div className={`grid gap-6 mb-10 ${
          plans.length === 1 
            ? 'grid-cols-1 max-w-md mx-auto' 
            : plans.length === 2 
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${plan.isRecommended ? "border-[#25B562] shadow-md" : ""}`}
            >
              
              {plan.isRecommended && (
                <div className="absolute top-0 right-0">
                  <Badge className="bg-[#333] text-white rounded-none rounded-bl-md px-3 py-1">
                    Recomendado
                  </Badge>
                </div>
              )}

              <CardContent className="pt-6">
                {plan.isFree && (
                  <div className="mb-2">
                    <Badge variant="outline" className="bg-[#4589FF] text-white border-[#4589FF]">
                      Prueba gratis
                    </Badge>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>

                <div className="mb-6">
                  {plan.price === "0" ? (
                    <p className="text-xl font-bold">Gratis</p>
                  ) : (
                    <>
                      {plan.isFree && <p className="text-sm">Después de tu prueba gratis</p>}
                      <p className="text-xl font-bold">
                        S/ {plan.price} <span className="text-sm font-normal">+ IGV al mes</span>
                      </p>
                    </>
                  )}
                </div>

                <Link href={`/auth/register/bussinesType?plan=${plan.id}`}>
                  <Button className="w-full bg-[#25B562] hover:bg-[#25B562]">
                    Elegir Plan
                  </Button>
                </Link>
              </CardContent>

              <CardFooter className="flex flex-col items-start pt-4 pb-6">
                <ul className="space-y-2 w-full">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-[#25B562] mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

}