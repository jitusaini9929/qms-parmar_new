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
  SidebarFooter,
} from "@/components/ui/sidebar";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";

const menuSections = {
  ADMIN: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", icon: "BarChart", url: "/dashboard" },
      ]
    },
    {
      label: "Management",
      items: [
        { title: "Users", icon: "Users", url: "/dashboard/users" },
        { title: "Boards", icon: "Building", url: "/dashboard/boards" },
        { title: "Exams", icon: "GraduationCap", url: "/dashboard/exams" },
        { title: "Subjects", icon: "BookOpen", url: "/dashboard/subjects" },
        { title: "Topics", icon: "BookMarked", url: "/dashboard/topics" },
      ]
    },
    {
      label: "Content",
      items: [
        { title: "Questions", icon: "HelpCircle", url: "/dashboard/questions" },
        { title: "Collections", icon: "Layers", url: "/dashboard/collections" },
      ]
    }
  ],
  REVIEWER: [
    {
      label: "Review",
      items: [
        { title: "Question Review", icon: "ClipboardCheck", url: "/dashboard/review" },
      ]
    }
  ],
  CONTENT_WRITER: [
    {
      label: "Content",
      items: [
        { title: "Rejected Questions", icon: "PenLine", url: "/dashboard/writer" },
        { title: "Questions", icon: "HelpCircle", url: "/dashboard/questions" },
        { title: "Collections", icon: "Layers", url: "/dashboard/collections" },
      ]
    }
  ]
};

export function BaseSidebar({ title, items, iconName }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const HeaderIcon = LucideIcons[iconName] || LucideIcons.Shield;

  const handleLinkClick = () => {
    if (isMobile) {
      setTimeout(() => setOpenMobile(false), 150);
    }
  };

  const role = items?.[0]?.title === "Question Review" 
    ? "REVIEWER" 
    : items?.[0]?.title === "Rejected Questions" 
      ? "CONTENT_WRITER" 
      : "ADMIN";

  const sections = menuSections[role] || menuSections.ADMIN;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50"
    >
      <SidebarHeader className="h-[60px] flex items-center justify-center border-b border-border/50 px-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
            <HeaderIcon className="size-4.5" />
          </div>
          <div className="grid flex-1 text-left">
            <span className="truncate text-sm font-bold tracking-tight">QMS</span>
            <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="p-0 gap-6">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="px-2 mb-2 group-data-[collapsible=icon]:hidden">
                <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest">
                  {section.label}
                </span>
              </div>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const ItemIcon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={`
                          relative overflow-hidden
                          h-9 px-3 rounded-lg
                          transition-all duration-200
                          [&>svg]:size-4
                          group-data-[collapsible=icon]:justify-center
                          ${isActive 
                            ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium'
                          }
                        `}
                      >
                        <Link
                          href={item.url}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3"
                        >
                          <ItemIcon className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground/70'}`} />
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full group-data-[collapsible=icon]:hidden" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/40">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            Q
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">QMS v1.0</p>
            <p className="text-[10px] text-muted-foreground">Question Manager</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
