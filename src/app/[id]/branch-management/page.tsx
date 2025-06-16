"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BranchSelector from "./_components/branch-selector"
import { useBranches } from "@/hooks/useBranchCompany";

const mockUserData = {
  role: "admin",
}


interface Props {
  params: {
    id: string
  }
}

export default function BranchesPage({ params }: Props) {

  const { id } = params
  const [userRole, setUserRole] = useState<string>("loading")
  const { branches, isLoading, error } = useBranches(id);
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setUserRole(mockUserData.role)
    }, 500)
  }, [])

  const handleAddBranch = () => {
    router.push(`/${id}/branch-management/new`)
  }

  const handleSelectBranch = (branch: { value: string }) => {
    router.push(`/${id}/accommodate?branch=${branch.value}`)
  }

  if (userRole === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <BranchSelector
        userRole={userRole}
        branches={branches}
        onAddBranch={handleAddBranch}
        onSelectBranch={handleSelectBranch}
      />
    </div>
  )
}
