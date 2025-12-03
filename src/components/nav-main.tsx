"use client";

import { type LucideIcon, BarChart, ActivitySquare, ClipboardList, Cog } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Map icon names to Lucide components
const iconsMap: Record<string, LucideIcon> = {
  "Dashboard": BarChart,
  "Real-time Monitoring": ActivitySquare,
  "Sensor Logs": ClipboardList,
  "Maintenance": Cog,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    iconName?: string; // Only pass the name from server
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;
          const Icon = item.iconName ? iconsMap[item.iconName] : undefined;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={isActive ? "bg-gray-500 text-white" : ""}
              >
                <a href={item.url} className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
