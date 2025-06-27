"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { logout } from "@/actions/auth/logout"

interface Branch {
    value: string;
    label: string;
    name?: string;
    ubication?: string;
}

interface BranchSelectorProps {
  userRole?: number
  branches?: Branch[]
  onAddBranch?: () => void
  onSelectBranch?: (branch: Branch) => void
}

export default function BranchSelector({
  userRole = 3,
  branches = [],
  onAddBranch,
  onSelectBranch,
}: BranchSelectorProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [availableBranches, setAvailableBranches] = useState<Branch[]>(branches)
  const router = useRouter()
  useEffect(() => {
    setIsAdmin(userRole === 2)
  }, [userRole])

  useEffect(() => {
      setAvailableBranches(branches)
  }, [branches])

  const handleAddBranch = () => {
    if (onAddBranch) {
      onAddBranch()
    } else {
      router.push("/branch-management/new")
    }
  }

  const handleSelectBranch = (branch: Branch) => {
    if (onSelectBranch) {
      onSelectBranch(branch)
    } 
  }

  if (!isAdmin) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Acceso restringido. Solo los administradores pueden gestionar sucursales.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-3xl font-bold text-center mb-8">¿Qué sucursal deseas gestionar?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {/* Tarjeta para agregar sucursal */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Card
              className="cursor-pointer border-2 border-dashed border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all h-full min-h-[140px] flex items-stretch"
              onClick={handleAddBranch}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-3">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1">Crear sucursal</h3>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tarjetas de sucursales */}
          {availableBranches.map((branch) => (
            <motion.div
              key={branch.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all h-full min-h-[140px] flex items-stretch"
                onClick={() => handleSelectBranch(branch)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-3">
                    <Image 
                      src="/images/logo_store.webp"
                      alt="Store"
                      height={28}
                      width={28}
                    />
                  </div>
                  <h3 className="font-semibold text-base text-gray-900 mb-1">{branch.name}</h3>
                  <p className="text-xs text-gray-400 font-medium">{branch.ubication || 'Sucursal'}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Botón de cerrar sesión */}
        <div className="flex flex-col items-center mt-8">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-base font-medium py-2 px-4 rounded transition-colors cursor-pointer"
            onClick={() => logout()} // Descomenta y define logout si tienes la función
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9m4 5v1a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Cerrar sesión
          </button>
        </div>
      </motion.div>
    </div>
  )
}
