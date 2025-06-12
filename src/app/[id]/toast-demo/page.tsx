"use client"

import { Button } from "@/components/ui/button"
import { customToast } from "@/components/ui/custom-toast"


export default function ToastDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Demo de Toast con Sonner</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button
          onClick={() =>
            customToast.error({
              title: "Error al iniciar sesión",
              description: "Invalid login credentials",
            })
          }
          variant="outline"
          className="w-full"
        >
          Mostrar Toast de Error 1
        </Button>

        <Button
          onClick={() =>
            customToast.error({
              title: "Error al iniciar sesión",
              description: "Por favor verifica tus credenciales e intenta nuevamente.",
            })
          }
          variant="outline"
          className="w-full"
        >
          Mostrar Toast de Error 2
        </Button>

        <Button
          onClick={() =>
            customToast.success({
              title: "Operación exitosa",
              description: "Los cambios han sido guardados correctamente.",
            })
          }
          variant="outline"
          className="w-full"
        >
          Mostrar Toast de Éxito
        </Button>

        <Button
          onClick={() =>
            customToast.warning({
              title: "Advertencia",
              description: "Tu sesión expirará en 5 minutos.",
            })
          }
          variant="outline"
          className="w-full"
        >
          Mostrar Toast de Advertencia
        </Button>

        <Button
          onClick={() =>
            customToast.info({
              title: "Información",
              description: "Hay actualizaciones disponibles para tu cuenta.",
            })
          }
          variant="outline"
          className="w-full"
        >
          Mostrar Toast de Información
        </Button>
      </div>
    </div>
  )
}
