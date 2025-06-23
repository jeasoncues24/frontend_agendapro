'use client';

import { Bell, CircleHelp, LogOut, Search, Settings, Eye, CircleUser } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
import { useEffect, useState } from "react"
import cookies from "js-cookie"
import { usePathname, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Branch } from "@/types/branch";
import { slugify } from "@/lib/utils";
import { logout } from "@/actions/auth/logout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { PiSignOutBold } from "react-icons/pi";
import { useBranchStore } from "@/store/branchStore";

function HeaderComponent() {
    const [branch, setBranch] = useState<Branch | null>(null);
    const [company, setCompany] = useState<string>("");
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [isEmail, setIsEmail] = useState("")
    const [isUser, setIsUser] = useState("");


    useEffect(() => {
        const user = cookies.get("user");
        if (user) {
          const data = JSON.parse(user ?? "");
          const userBranch = data.company?.firstEstablishment || null;
          const companyIdForUser = data.company?.trade_name || "";
          setCompany(companyIdForUser)
          setBranch(userBranch);
          setIsUser(data.name);
          setIsEmail(data.email)
        }
       
    }, [pathname, searchParams]);

 
    const handleLogout = async () => {
        const { clearBranch } = useBranchStore.getState();
        clearBranch();

        await logout()
        setDropdownOpen(false)
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
                                    {branch?.name || 'Seleccionar sucursal'}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem className="hidden md:block">
                            <div className="flex items-center gap-2">
                              
                                {branch && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => window.open(`/${slugify(company)}/${slugify(branch.name)}`, '_blank')}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Ver página
                                    </Button>
                                )}
                            </div>
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

               
                <div className="flex justify-start gap-4 items-center">
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0" onClick={() => setDropdownOpen(true)}>
                                <Avatar className="h-10 w-10 cursor-pointer ">
                                    <AvatarFallback className="font-semibold bg-[#DCFCE7] text-green-500 border border-green-300">{isUser?.charAt(0).toUpperCase() || ''}</AvatarFallback>
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
                            <DropdownMenuItem className="cursor-pointer text-gray-500 font-semibold" >
                            <CircleUser size={20} className="text-gray-500 mr-2" /> Cuenta
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-gray-500 font-semibold" onClick={handleLogout}>
                            <PiSignOutBold size={20} className="text-gray-500 mr-2" /> Salir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div>

                

            </div>
            
        </header>
    )
}

export default HeaderComponent