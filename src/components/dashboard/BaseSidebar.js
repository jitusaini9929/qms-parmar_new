"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

export function BaseSidebar({ title, items, iconName }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  // Header icon (dynamic)
  const HeaderIcon = LucideIcons[iconName] || LucideIcons.Shield;

  // Function to handle link clicks
  const handleLinkClick = () => {
    if (isMobile) {
      // Small delay ensures the click ripple is seen before the drawer closes
      setTimeout(() => setOpenMobile(false), 150);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
    >
      {/* --- HEADER --- */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeaderIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">QMS</span>
            <span className="truncate text-xs">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      {/* --- CONTENT --- */}
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => {
              const ItemIcon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`
                      transition-colors
                      text-slate-700 dark:text-slate-300
                      hover:bg-slate-100 dark:hover:bg-slate-900
                      data-[active=true]:bg-blue-50
                      dark:data-[active=true]:bg-blue-950
                    `}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-2"
                      onClick={handleLinkClick}
                    >
                      <ItemIcon
                        className={
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400"
                        }
                      />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
