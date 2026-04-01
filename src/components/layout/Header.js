"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center mx-auto lg:px-6">
      {/* floating glass container */}
      <div
        className="
        container

        flex
        items-center
        justify-between
        px-6
        py-3
        rounded-2xl
        backdrop-blur-md
        border
        shadow-md
        bg-white/70
        border-black/10
        text-black
        dark:bg-white/10
        dark:border-white/20
        dark:text-white
      "
      >
        {/* logo */}
        <Link
          href="/"
          className="
            text-xl
            font-semibold
            tracking-tight
            transition-opacity

            hover:opacity-70
          "
        >
          QMS
        </Link>

        {/* right controls */}
        <div className="flex items-center gap-4">
          {/* theme toggle wrapper */}
       
          <ThemeToggle />
          

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    rounded-full
                    border
                    p-0.5
                    transition

                    border-black/10
                    bg-black/5

                    hover:bg-black/10

                    dark:border-white/30
                    dark:bg-white/10
                    dark:hover:bg-white/20
                  "
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || ""} />

                    <AvatarFallback
                      className="
                        text-sm
                        font-medium

                        bg-black/10
                        text-black

                        dark:bg-white/20
                        dark:text-white
                      "
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="
                  mt-3
                  w-60
                  rounded-xl
                  backdrop-blur-xl
                  border
                  shadow-lg
                  p-2
                  bg-white/90
                  border-black/10
                  text-black

                  dark:bg-black/80
                  dark:border-white/10
                  dark:text-white
                "
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{user.name}</span>

                    <span
                      className="
                      text-xs
                      text-black/60
                      dark:text-white/60
                    "
                    >
                      {user.email}
                    </span>

                    <span
                      className="
                      mt-1
                      text-xs
                      px-2
                      py-0.5
                      rounded-full
                      w-fit

                      bg-black/5
                      border
                      border-black/10

                      dark:bg-white/10
                      dark:border-white/10
                    "
                    >
                      {user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4 opacity-70" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4 opacity-70" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="
                    cursor-pointer
                    text-red-500
                    hover:bg-red-500/10
                  "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="
                rounded-full
                px-5

                bg-black
                text-white

                hover:bg-white/40

                dark:bg-white
                dark:text-black
                dark:hover:bg-white/40
              "
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
