"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Settings, Bell, Shield } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardNavbar({ portalName = "QMS" }) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const roleColors = {
    ADMIN: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    REVIEWER: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    CONTENT_WRITER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 transition-[width,height] ease-linear">
      {/* --- LEFT SIDE --- */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg hover:bg-muted/80 transition-colors" />
        <Separator orientation="vertical" className="mr-1 h-5" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center shadow-sm">
            <Shield className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none tracking-tight">
              {portalName}
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              {user?.role?.replace(/_/g, ' ') || ''}
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 relative"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>
        
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-1.5 h-auto hover:bg-muted/50 transition-all rounded-xl">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold leading-none">
                    {user.name}
                  </p>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide mt-1 px-2 py-0.5 rounded-md border ${roleColors[user.role] || 'bg-muted text-muted-foreground'}`}>
                    {user.role?.replace(/_/g, ' ')}
                  </span>
                </div>
                <Avatar className="h-9 w-9 border-2 border-border/50 shadow-sm">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-[11px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl shadow-xl border-border/60 p-2">
              <DropdownMenuLabel className="p-3 mb-1">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border/50">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/profile")} 
                className="cursor-pointer rounded-lg py-2.5 gap-2"
              >
                <User className="h-4 w-4 text-muted-foreground" /> 
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/settings")} 
                className="cursor-pointer rounded-lg py-2.5 gap-2"
              >
                <Settings className="h-4 w-4 text-muted-foreground" /> 
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2.5 gap-2"
              >
                <LogOut className="h-4 w-4" /> 
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </header>
  );
}
