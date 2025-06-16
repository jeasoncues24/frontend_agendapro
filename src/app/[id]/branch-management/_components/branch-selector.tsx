"use client"

import { useState, useEffect } from "react"
import { Building2, Plus, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Branch {
    value: string;
    label: string;
    name?: string;
    ubication?: string;
}


interface BranchSelectorProps {
  userRole?: string
  branches?: Branch[]
  onAddBranch?: () => void
  onSelectBranch?: (branch: Branch) => void
}

export default function BranchSelector({
  userRole = "user",
  branches = [],
  onAddBranch,
  onSelectBranch,
}: BranchSelectorProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [availableBranches, setAvailableBranches] = useState<Branch[]>(branches)
  const router = useRouter()
  useEffect(() => {
    setIsAdmin(userRole === "admin")
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
        <h2 className="text-2xl font-semibold text-center mb-6">¿Qué sucursal deseas gestionar?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableBranches.map((branch) => (
            <motion.div
              key={branch.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="cursor-pointer hover:border-[#4589FF]/50 hover:shadow-md transition-all"
                onClick={() => handleSelectBranch(branch)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <Building2 className="h-8 w-8 mb-4 text-gray-500" />
                  <h3 className="font-medium text-md mb-1">{branch.name}</h3>
                  <p className="text-xs text-gray-500">{branch.ubication}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Card
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white transition-colors h-full"
              onClick={handleAddBranch}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="rounded-full bg-blue-400 p-3 mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-md">Agregar sucursal</h3>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
