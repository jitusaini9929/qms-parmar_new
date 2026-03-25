"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Settings, Bell } from "lucide-react";

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

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 sticky top-0 z-10 transition-[width,height] ease-linear">
      {/* --- LEFT SIDE --- */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
          {portalName}
        </h2>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-1 h-auto hover:bg-accent transition-all">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-primary font-bold uppercase mt-1">
                    {user.role}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[11px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
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