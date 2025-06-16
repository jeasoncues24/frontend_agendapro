"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BranchSelector from "./_components/branch-selector"
import { useBranches } from "@/hooks/useBranchCompany";
import { LoaderCircle } from "lucide-react";

const mockUserData = {
  role: 2,
}


interface Props {
  params: Promise<{
    id: string;
  }>
}

export default function BranchesPage({ params }: Props) {

  const { id } = React.use(params);
  const [userRole, setUserRole] = useState<number>(0)
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

  if (userRole === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <LoaderCircle className="h-8 w-8 text-gray-500"/>
        </div>
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
