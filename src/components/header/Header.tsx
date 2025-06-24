'use client';

import { Bell, CircleHelp, LogOut, Search, Settings, Eye, CircleUser, Store } from 'lucide-react'
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
        <>
            <style jsx>{`
                .header-shadow {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                }
                
                .button-hover {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .button-hover:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
                }
                
                .avatar-glow {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .avatar-glow:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
                }
                
                .dropdown-appear {
                    animation: dropdownAppear 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes dropdownAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .popover-smooth {
                    animation: popoverSmooth 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes popoverSmooth {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .breadcrumb-link {
                    transition: all 0.2s ease-in-out;
                }
                
                .breadcrumb-link:hover {
                    color: #3b82f6;
                    transform: translateX(2px);
                }
                
                .separator-fade {
                    transition: opacity 0.3s ease-in-out;
                }
                
                .view-page-button {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                }
                
                .view-page-button:hover {
                    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
                }
                
                .help-button {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .help-button:hover {
                    background-color: rgba(59, 130, 246, 0.1);
                    transform: scale(1.05);
                }
                
                .dropdown-item {
                    transition: all 0.15s ease-in-out;
                }
                
                .dropdown-item:hover {
                    background-color: rgba(59, 130, 246, 0.05);
                    transform: translateX(4px);
                }
            `}</style>
            
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 header-shadow bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1 button-hover hover:bg-gray-100 rounded-md" />
                    <Separator orientation="vertical" className="mr-2 h-4 separator-fade" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#" className="breadcrumb-link font-semibold text-black">
                                    {branch?.name || 'Seleccionar sucursal'}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block separator-fade" />
                            <BreadcrumbItem className="hidden md:block">
                                <div className="flex items-center gap-2">
                                    {branch && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 px-2 view-page-button border-gray-200 text-black font-semibold"
                                            onClick={() => window.open(`/${slugify(company)}/${slugify(branch.name)}`, '_blank')}
                                        >
                                            <Store className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110 text-gray-500" />
                                            Ver tienda
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

                <div className="flex items-center gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="help-button rounded-full shadow-4xl"
                            >
                                <CircleHelp className="h-8 w-8 text-black" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-gray-900 text-white text-sm font-medium p-3 rounded-xl shadow-xl border-0 w-48 popover-smooth">
                            <div className="flex items-start gap-2">
                                <CircleHelp className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                                <p className="leading-relaxed">
                                    Puedes enviarnos un mensaje para resolver tus dudas.
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex justify-start gap-4 items-center">
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0 rounded-full" onClick={() => setDropdownOpen(true)}>
                                    <Avatar className="h-10 w-10 cursor-pointer avatar-glow">
                                        <AvatarFallback className="font-semibold bg-gradient-to-br from-green-100 to-green-200 text-green-600 border-2 border-green-300 shadow-sm">
                                            {isUser?.charAt(0).toUpperCase() || ''}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[280px] mt-4 rounded-xl shadow-xl border-gray-200 dropdown-appear" align="end">
                                <DropdownMenuLabel className="p-4">
                                    <div className="flex justify-start gap-3 items-center">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="font-semibold bg-gradient-to-br from-green-100 to-green-200 text-green-600 border-2 border-green-300 text-lg">
                                                {isUser?.charAt(0).toUpperCase() || ''}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none text-gray-900">{isUser}</p>
                                            <p className="text-xs text-gray-500 leading-none">{isEmail}</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-100" />
                                <DropdownMenuItem className="cursor-pointer text-gray-600 font-medium p-3 dropdown-item rounded-lg mx-1">
                                    <CircleUser size={18} className="text-gray-500 mr-3" /> 
                                    Cuenta
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-gray-600 font-medium p-3 dropdown-item rounded-lg mx-1 mb-1" onClick={handleLogout}>
                                    <PiSignOutBold size={18} className="text-gray-500 mr-3" /> 
                                    Salir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </>
    )
}

export default HeaderComponent