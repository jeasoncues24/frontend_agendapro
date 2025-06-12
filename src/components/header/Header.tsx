'use client';

import { Bell, CircleHelp, LogOut, Search, Settings } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
import { useState } from "react"
import { Input } from "../ui/input";
// import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function HeaderComponent() {
    const [isProduction, setIsProduction] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [branch, setBranch] = useState([]);
    const router = useRouter()

    // const { data: session, status } = useSession();


    const handleSwitchChange = () => {
        if (!isProduction) {
            setIsModalOpen(true)
        } else {
            setIsProduction(false)
        }
    }

    const handleConfirmProduction = () => {
        setIsProduction(true)
        setIsModalOpen(false)
    }
    const logoutSession = async () => {
        setIsLoading(true)
        try {
            // await signOut({ redirect: false })
            router.push("/auth/login")
        } catch (error) {
            console.error("Logout failed", error)
        } finally {
            setIsLoading(false)
        }
    }

      
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                Configuración
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                Métodos de Pago
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <div className="relative w-96">
                                    {/* <SearchInput /> */}
                                </div>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="ghost" size="icon"
                        >
                            <CircleHelp className="h-8 w-8" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#111827]  text-white text-sm font-medium p-2 rounded-xl shadow-lg border w-40">
                        Puedes enviarnos un mensaje para resolver tus dudas.
                    </PopoverContent>
                </Popover>

               
                {/* { session ? (
                   <>
                    { session.user.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                            src={session.user?.image || '/placeholder.svg'}
                            alt={session.user?.name || 'User avatar'}
                            width={24}
                            height={24}
                            className="object-cover"
                        />
                        
                    </div>
                    ) : (
                       <div className="relative w-8 h-8 mx-auto rounded-full p-1 bg-[#F3729F] text-black font-semibold text-md text-center">{session.user.name?.charAt(0)}</div>
                    )}
                    <Button 
                        onClick={() => logoutSession()}
                        variant="ghost" size="icon"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                   </>
                    
                ) : ( */}
                    <div className="animate-pulse rounded-full bg-gray-300 p-2 w-6 h-6"></div>
                {/* )} */}

                

            </div>
            
        </header>
    )
}

export default HeaderComponent