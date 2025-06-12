"use client"

import * as React from "react"
import {
  Album,
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  CalendarCheck,
  ChartNoAxesCombined,
  CircleUserRound,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  LayoutDashboard,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareActivity,
  SquareTerminal,
  Store,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  user: {
    name: "Arturo Cueva Espinoza",
    email: "jeasoncues@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: CalendarCheck,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Agenda",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Citas",
          url: "#",
        },
        {
          title: "Calendario",
          url: "#",
        }
      ],
    },
    {
      title: "Ventas",
      url: "sale",
      icon: Store
    },
    {
      title: "Servicios",
      url: "services",
      icon: SquareActivity
    },
    {
      title: "Productos",
      url: "products",
      icon: Album
    },
    {
      title: "Clientes",
      url: "customer",
      icon: CircleUserRound
    },
    {
      title: "Reportes",
      url: "reports",
      icon: ChartNoAxesCombined
    },
    
    {
      title: "Configuración",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Empresa",
          url: "#"
        },
        {
          title: "Sucursales",
          url: "#"
        },
        {
          title: "Usuarios",
          url: "#"
        }, 
        {
          title: "Métodos de Pago",
          url: "#"
        }
      ]
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  const navMainItems = data.navMain.map((item) => {
    const isActive = item.url === pathname
    const isParentActive = item.items?.some((subItem) => subItem.url === pathname)

    return {
      ...item,
      isActive: isActive || isParentActive,
      items: item.items?.map((subItem) => ({
        ...subItem,
        isActive: subItem.url === pathname,
      })),
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {state === 'expanded' && (
          <Card className="bg-gray-50 shadow-none border-none">
            <CardContent className="p-4 flex flex-col items-center text-center">
              
              <p className="font-semibold text-sm mb-2">¡Nuevas características disponibles!</p>
              <p className="text-xs text-gray-500 mb-4">Echa un vistazo a la vista del panel.</p>
              <Image src="https://antsroute.com/wp-content/uploads/antsroute-software-sitio-reservas-1.jpg" alt="Woman smiling" width={200} height={100} className="rounded-md mb-4" />
              <div className="flex text-xs space-x-2">
                <a href="#" className="text-gray-500 hover:underline">Descartar</a>
                <a href="#" className="text-green-500 hover:underline">¿Qué hay de nuevo?</a>
              </div>
            </CardContent>
          </Card>
        )}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
