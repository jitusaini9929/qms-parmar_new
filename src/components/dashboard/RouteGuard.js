"use client";

import { usePathname } from "next/navigation";
import { checkPageAccess } from "@/lib/page-access";
import { ShieldAlert } from "lucide-react";

export default function RouteGuard({ role, children }) {
  const pathname = usePathname();

  // Check if the user's role can access this page
  const hasAccess = checkPageAccess(pathname, role);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-center text-muted-foreground max-w-md">
          You do not have the necessary permissions to access this section of the
          application.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
