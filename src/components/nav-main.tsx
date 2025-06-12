"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
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
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link
                  href={item.url}
                  className={
                    item.isActive
                      ? "w-full bg-green-100 text-green-500"
                      : "w-full hover:bg-green-100 hover:text-green-500"
                  }
                >
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive} className="w-full hover:bg-green-50">
                    {item.icon && (
                      <item.icon
                        className={item.isActive ? "text-green-500 w-5 h-5" : "group-hover/collapsible:text-green-500 w-5 h-5 text-gray-600"}
                      />
                    )}
                    <span className="hover:text-green-500 text-md text-gray-600 font-medium">{item.title}</span>
                    {item.items && (
                      <ChevronRight
                        className={
                          `ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-600 ` +
                          (item.isActive ? "text-green-500" : "group-hover/collapsible:text-green-500")
                        }
                      />
                    )}
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.isActive}
                        className={
                          subItem.isActive
                            ? "bg-green-100 text-green-500"
                            : "hover:bg-green-100 hover:text-green-500"
                        }
                      >
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
