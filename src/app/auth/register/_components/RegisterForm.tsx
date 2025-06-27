"use client"

// import { registerUser } from "@/actions/auth/register"
import clsx from "clsx"
import { useState } from "react"
import { useForm } from "react-hook-form"
// import toast from "react-hot-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Hotel, UtensilsCrossed } from "lucide-react"
import { customToast } from "@/components/ui/custom-toast"
import { registerUser } from "@/actions/auth/register"

type FormInputs = {
  user_name: string
  email_company: string
  password: string
  bussines_name: string
  trade_name: string
  ruc: string
  contact: string
  number_company: string
  city: number
  district: number
  provincia: number
  direction: string
  status: number
  migration: number
  type_company_id: number
}

export const RegisterForm = (planId: any) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<FormInputs>()
  const [step, setStep] = useState(1)

  // Observar el valor actual de type_company_id
  const currentTypeCompanyId = watch("type_company_id")

  const onSubmit = async (data: FormInputs) => {
    setErrorMessage("")
    setIsLoading(true)
    const {
      user_name,
      email_company,
      password,
      bussines_name,
      trade_name,
      ruc,
      contact,
      number_company,
      city,
      district,
      provincia,
      direction,
      status,
      migration,
      type_company_id
    } = data


    // // Server action
    const resp = await registerUser(
      user_name,
      email_company,
      password,
      bussines_name,
      trade_name,
      ruc,
      number_company,
      city,
      district,
      provincia,
      direction,
      status,
      type_company_id,
      planId.planId,
    )

    if (!resp.ok) {
        customToast.error({
            title: "Error al crear empresa",
            description: `${resp.message}`,
        })
      setIsLoading(false)
      return
    }

    // toast.success(resp.message)
    customToast.success({
        title: "Operación exitosa",
        description: `${resp.message}`,
    })
    window.location.replace(`/confirmed/company`)
  }

  const nextStep = async () => {
    // Si estamos en el paso 4 y no se ha seleccionado un tipo de empresa
    if (step === 4 && !selectedBusinessType && !currentTypeCompanyId) {
    //   toast.error("Por favor selecciona un tipo de empresa")
      return
    }

    setStep((prevStep) => prevStep + 1)
  }

  const prevStep = () => setStep((prevStep) => prevStep - 1)

  const handleBusinessTypeSelect = (typeId: number) => {
    setSelectedBusinessType(typeId)
    setValue("type_company_id", typeId)
  }

  // Mapeo de tipos de empresa a nombres más descriptivos
  const businessTypeNames = {
    1: "Hotel",
    2: "Hostal",
    3: "Bungalows",
    4: "Hotel con Restaurante",
    5: "Motel",
    6: "Hotel con Venta Rápida POS",
  }

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <label htmlFor="user">Nombre de usuario </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.user_name },
                )}
                type="text"
                required
                {...register("user_name", { required: true })}
              />

              <label htmlFor="email">Correo electrónico </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.email_company },
                )}
                type="email"
                required
                {...register("email_company", { required: true, pattern: /^\S+@\S+$/i })}
              />

              <label htmlFor="password">Contraseña </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.password },
                )}
                type="password"
                required
                {...register("password", { required: true })}
              />

              <button
                type="button"
                className="bg-[#25B562] border-[#25B562] text-white p-2 rounded mt-4 w-full cursor-pointer"
                onClick={nextStep}
              >
                Siguiente
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label htmlFor="ruc">RUC </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.ruc },
                )}
                type="text"
                {...register("ruc", { required: true })}
              />

              <label htmlFor="bussines_name">Razón social </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.bussines_name },
                )}
                type="text"
                {...register("bussines_name", { required: true })}
              />

              <label htmlFor="trade_name">Nombre comercial </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.trade_name },
                )}
                type="text"
                {...register("trade_name", { required: true })}
              />

              <div className="flex justify-between mt-4">
                <button type="button" className="bg-gray-300 text-white p-2 rounded w-36 cursor-pointer" onClick={prevStep}>
                  Anterior
                </button>
                <button
                  type="button"
                  className="bg-[#25B562] border-[#25B562] text-white p-2 rounded w-36 cursor-pointer"
                  onClick={nextStep}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>

              <label htmlFor="number_contact">Número de contacto </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.number_company },
                )}
                type="text"
                {...register("number_company", { required: true })}
              />

              <label htmlFor="city">Ciudad </label>
              <select
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.city },
                )}
                {...register("city", { required: true })}
              >
                <option value="1">Piura</option>
              </select>

              <label htmlFor="district">Distrito </label>
              <select
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.district },
                )}
                {...register("district", { required: true })}
              >
                <option value="1">Piura</option>
              </select>

              <div className="flex justify-between mt-4">
                <button type="button" className="bg-gray-300 text-white p-2 rounded w-36 cursor-pointer" onClick={prevStep}>
                  Anterior
                </button>
                <button
                  type="button"
                  className="bg-[#25B562] border-[#25B562] text-white p-2 rounded w-36 cursor-pointer"
                  onClick={nextStep}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              

              <label htmlFor="provincia">Provincia </label>
              <select
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.provincia },
                )}
                {...register("provincia", { required: true })}
              >
                <option value="1">Piura</option>
              </select>

              <label htmlFor="direction">Dirección </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 border rounded focus:outline-none mb-4",
                  { "border-red-500": errors.direction },
                )}
                type="text"
                {...register("direction", { required: true })}
              />

              <label className="block text-sm font-medium leading-6 text-gray-700 mb-2">Tipo de empresa</label>

              {/* Campo oculto para almacenar el valor seleccionado */}
              <input type="hidden" {...register("type_company_id", { required: true })} />

              {/* Selección visual de tipo de empresa */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => handleBusinessTypeSelect(1)}
                  className={clsx("cursor-pointer", {
                    "ring-2 ring-[#25B562] rounded-lg": currentTypeCompanyId === 1,
                  })}
                >
                  <Card className="h-full hover:border-[#25B562]/50 hover:shadow-md transition-all rounded-lg">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Hotel className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="font-medium text-center text-sm">PELUQUERIA</h3>
                    </CardContent>
                  </Card>
                </div>

                <div
                  onClick={() => handleBusinessTypeSelect(2)}
                  className={clsx("cursor-pointer", {
                    "ring-2 ring-[#25B562] rounded-lg": currentTypeCompanyId === 2,
                  })}
                >
                  <Card className="h-full hover:border-[#25B562]/50 hover:shadow-md transition-all rounded-lg">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Building className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="font-medium text-center text-sm">BARBERIA</h3>
                    </CardContent>
                  </Card>
                </div>

                <div
                  onClick={() => handleBusinessTypeSelect(3)}
                  className={clsx("cursor-pointer", {
                    "ring-2 ring-[#25B562] rounded-lg":  currentTypeCompanyId === 3,
                  })}
                >
                  <Card className="h-full hover:border-[#25B562]/50 hover:shadow-md transition-all rounded-lg">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <Building className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="font-medium text-center text-sm">SPA</h3>
                    </CardContent>
                  </Card>
                </div>

                <div
                  onClick={() => handleBusinessTypeSelect(4)}
                  className={clsx("cursor-pointer", {
                    "ring-2 ring-[#25B562] rounded-lg": currentTypeCompanyId === 4,
                  })}
                >
                  <Card className="h-full hover:border-[#25B562]/50 hover:shadow-md transition-all rounded-lg">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <div className="relative">
                          <Hotel className="w-8 h-8 text-slate-600" />
                        </div>
                      </div>
                      <h3 className="font-medium text-center text-sm">SALON DE BELLEZA</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button type="button" className="bg-gray-300 text-white p-2 rounded w-40 cursor-pointer" onClick={prevStep}>
                  Anterior
                </button>
                <button
                  type="submit"
                  className="bg-[#25B562] border-[#25B562] text-white p-2 rounded w-40 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>

              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
