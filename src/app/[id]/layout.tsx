'use client'

import { AppSidebar } from "@/components/app-sidebar"
import HeaderComponent from "@/components/header/Header"
import { CustomToaster } from "@/components/ui/custom-toast"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'

export default function AppAgendaPro({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBranchManagementRoute = pathname.includes('/branch-management');

  return (
    <>
      <SidebarProvider>
        {!isBranchManagementRoute && <AppSidebar className="fixed" />}
        <SidebarInset>
          <CustomToaster />
          { !isBranchManagementRoute && <HeaderComponent /> }
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
