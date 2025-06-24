"use client";

import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RegisterForm } from "../_components/RegisterForm";



export default function RegisterBusinessPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  const planId = planParam ? parseInt(planParam) : null


  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">AgendaYa</span>
            <span className="text-sm text-gray-500 font-medium">cloud</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Paso 2 de 3</span>
            <span></span>
          </div>
          <Progress value={66} className="h-2" />
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/auth/register">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">Crear empresa</h1>
          <p className="text-muted-foreground">Completa tus datos para crear tu cuenta</p>
        </div>

        {/* Registration Form */}
        <RegisterForm planId={planId}/>
      </div>
    </div>
  )
}
