"use client"

import * as React from "react"
import {
  Album,
  Calendar,
  CalendarCheck,
  CalendarFold,
  ChartNoAxesCombined,
  CircleUserRound,
  Clock3,
  Frame,
  LayoutDashboard,
  Map,
  PieChart,
  Settings,
  SquareActivity,
  Store,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
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
import { usePathname, useParams } from "next/navigation"

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
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Agenda",
      url: "quotes",
      icon: Calendar,
    },
    // {
    //   title: "Ventas",
    //   url: "sale",
    //   icon: Store
    // },
    {
      title: "Servicios",
      url: "#",
      icon: SquareActivity,
      items: [
        {
          title: "Categoria de servicios",
          url: "category-services"
        },
        {
          title: "Servicios",
          url: "services-for-clients"
        }
      ]
    },
    // {
    //   title: "Productos",
    //   url: "products",
    //   icon: Album
    // },
    {
      title: "Clientes",
      url: "customer",
      icon: CircleUserRound
    },
    {
      title: "Horarios",
      url: "schedules",
      icon: CalendarFold
    },
    {
      title: "Reportes",
      url: "reports",
      icon: ChartNoAxesCombined
    },
    {
      title: "Estado de tu local",
      url: "opening-times",
      icon: Clock3
    },
    {
      title: "Mi sucursal",
      url: "opening-times",
      icon: Store
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Empresa",
          url: "settings/company"
        },
        {
          title: "Sucursales",
          url: "settings/establishment"
        },
        {
          title: "Especialidades",
          url: "settings/speciality"
        },
        {
          title: "Usuarios",
          url: "settings/users"
        }, 
        {
          title: "Métodos de Pago",
          url: "settings/payment"
        }
      ]
    },
   
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const params = useParams()

  const companyId = params.id as string 

  const { state } = useSidebar()

  const navMainItems = data.navMain.map((item) => {
    const fullItemUrl = item.url.startsWith("#") ? item.url : `/admin/${companyId}/${item.url}`
    // const isActive = item.url === pathname
    // const isParentActive = item.items?.some((subItem) => subItem.url === pathname)
    const isActive = fullItemUrl === pathname
    const isParentActive = item.items?.some((subItem) => {
      const fullSubUrl = subItem.url.startsWith("#") ? subItem.url : `/admin/${companyId}/${subItem.url}`
      return fullSubUrl === pathname
    })

    return {
      ...item,
      url: fullItemUrl,
      isActive: isActive || isParentActive,
      items: item.items?.map((subItem) => {
        const fullSubUrl = subItem.url.startsWith("#") ? subItem.url : `/admin/${companyId}/${subItem.url}`
        return {
          ...subItem,
          url: fullSubUrl,
          isActive: pathname === fullSubUrl,
        }
      }),
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        {/* {state === 'expanded' && (
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
        )} */}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
