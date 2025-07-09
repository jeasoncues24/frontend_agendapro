"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={`
                    w-full flex items-center gap-3 py-3 px-4 rounded-none transition-all duration-200
                    border-l-4
                    ${item.isActive
                      ? "bg-orange-50 border-orange-500 text-orange-600 font-semibold"
                      : "border-transparent text-gray-700 font-medium hover:text-orange-600 hover:bg-orange-50 hover:border-orange-500"
                    }
                  `}
                >
                  <Link href={item.url} className="w-full flex items-center">
                    {item.icon && (
                      <item.icon
                        className={`
                          w-5 h-5 transition-colors duration-200
                          ${item.isActive ? "text-orange-600" : "text-gray-500 group-hover/collapsible:text-orange-500"}
                        `}
                      />
                    )}
                    <span className={`flex-1 text-left text-sm ${item.isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}`}>{item.title}</span>
                    {item.items && (
                      <ChevronRight
                        className={`
                          w-4 h-4 ml-auto transition-all duration-200
                          group-data-[state=open]/collapsible:rotate-90
                          ${item.isActive ? "text-orange-600" : "text-gray-400 group-hover/collapsible:text-orange-500"}
                        `}
                      />
                    )}
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-0 px-0 pl-0 border-l-0">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                          className={`
                          pl-8 py-3 transition-colors duration-200 rounded-none
                          ${subItem.isActive
                              ? "bg-orange-50 text-orange-600 font-semibold "
                              : "text-gray-600 hover:text-orange-500 hover:bg-orange-50 border-l-4 border-transparent hover:border-orange-500 font-medium hover:font-medium"
                            }
                        `}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
