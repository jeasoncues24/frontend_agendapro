"use client"

import cookies from "js-cookie"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaBars, FaStore } from "react-icons/fa"
import { FiHelpCircle } from "react-icons/fi"
import { PiSignOutBold } from "react-icons/pi"
import * as React from "react"
import { Check, ChevronsUpDown, CircleUser } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useBranches } from "@/hooks/useBranchCompany"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { logout } from "@/actions/auth/logout"
import { useBranchStore } from "@/store/branchStore"

interface Props {
  id: string
}

export const HeaderAdmin = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isUser, setIsUser] = useState("")
  const [isRol, setIsRol] = useState("")

  const [loaded, setLoaded] = useState<boolean>(false)

  const [isClient, setIsClient] = useState(false)

  const [showTour, setShowTour] = useState(false)
  const [isEmail, setIsEmail] = useState("")

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [uri, setUri] = React.useState("")
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const user = cookies.get("user")
    let branchFromUrl = searchParams.get("branch")
    if (user) {
      const data = JSON.parse(user ?? "")
      const userBranch = data.company?.firstBranch || null
      const userRole = data.role
      if (userRole !== "admin" && userBranch) {
        setValue(userBranch.id)
        if (!branchFromUrl) {
          router.replace(`${pathname}?branch=${userBranch.id}`)
        }
      } else {
        if (branchFromUrl) {
          setValue(branchFromUrl)
        } else if (userBranch) {
          setValue(userBranch.id)
        }
      }
      setIsUser(data.name)
      setIsRol(userRole)
      setIsEmail(data.email)
      const lastSegment = pathname.split("/").pop()
      setUri(lastSegment ? lastSegment : "")
    }
    setLoaded(true)
    setIsClient(true)
    const hasSeenTour = localStorage.getItem("hasSeenTour")
    if (!hasSeenTour) {
      setShowTour(true)
    }
  }, [pathname, searchParams])

  

  const handleBranchChange = (branchId: string) => {
    setValue(branchId)
    setOpen(false)

    const route = process.env.NEXT_PUBLIC_FRONTEND
    const url = pathname

    router.replace(`${route}${url}?branch=${branchId}`)
  }

  const handleAccount = () => {
    setAccountModalOpen(true)
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    const { clearBranch } = useBranchStore.getState();
    clearBranch();

    await logout()
    setDropdownOpen(false)
  }

  return (
    <>
     
      <nav className="flex px-5 justify-between items-center w-full bg-white border border-b border-gray-200">
        <div className="flex items-center">
          <Link href="#">
            <span className="font-bold text-black text-1xl logo flex items-center">
                {" "}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">AgendaPro</span>
                        <span className="text-sm text-gray-500 font-medium">cloud</span>
                    </div>
                </div>
              
            </span>
          </Link>
        </div>

        <div className="flex items-center">
          
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="m-2 p-2 rounded-md transition-all font-bold hover:text-[#010B51] help-button"
              >
                <FiHelpCircle size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-[#111827]  text-white text-sm font-medium p-2 rounded-xl shadow-lg border w-40">
              Puedes escribirnos y resolver tus dudas.
            </PopoverContent>
          </Popover>

          {!loaded ? (
            <div className="animate-pulse rounded-full bg-gray-300 p-2 w-10 h-10"></div>
          ) : (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0" onClick={() => setDropdownOpen(true)}>
                  <Avatar className="h-10 w-10 cursor-pointer user-avatar">
                    <AvatarFallback className="font-semibold bg-[#DCFCE7] text-green-500 border border-green-300 ">{isUser?.charAt(0).toUpperCase() || ''}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[280px] mt-2 rounded-md" align="end">
                <DropdownMenuLabel>
                  <div className="flex justify-start gap-4 items-center">
                    <Avatar className="h-10 w-10 cursor-pointer ">
                      <AvatarFallback className="font-semibold bg-[#DCFCE7] text-green-500 border border-green-300">{isUser?.charAt(0).toUpperCase() || ''}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{isUser}</p>
                      <p className="text-xs text-gray-500 leading-none ">{isEmail}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-gray-500 font-semibold" onClick={handleAccount}>
                  <CircleUser size={20} className="text-gray-500 mr-2" /> Cuenta
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-gray-500 font-semibold" onClick={handleLogout}>
                  <PiSignOutBold size={20} className="text-gray-500 mr-2" /> Salir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {/* <AccountModal
        open={accountModalOpen}
        onOpenChange={(open) => {
          setAccountModalOpen(open)
          if (!open) {
            setDropdownOpen(false)
          }
        }}
      /> */}
    </>
  )
}

