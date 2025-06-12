import { AppSidebar } from "@/components/app-sidebar"
import HeaderComponent from "@/components/header/Header"
import { CustomToaster } from "@/components/ui/custom-toast"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function AppAgendaPro({ children }: { children: React.ReactNode }) { 

  return (
    <>
      <SidebarProvider>
        <AppSidebar  className="fixed"/>
        <SidebarInset>
          <CustomToaster />
          <HeaderComponent/>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
