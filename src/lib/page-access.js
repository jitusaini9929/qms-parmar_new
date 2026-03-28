import { PAGE_ACCESS } from "@/enums/role";

// ─────────────────────────────────────────────
// Page-Level Access Check  (used in RouteGuard client component)
// Returns true if the role is allowed to view the page.
// This file is safe for client components — no server-only imports.
// ─────────────────────────────────────────────

export function checkPageAccess(pathname, role) {
  if (!role || !pathname) return false;

  // Find the first matching rule (most specific first, order matters in PAGE_ACCESS)
  const rule = PAGE_ACCESS.find((r) => pathname.startsWith(r.path));

  // If no rule matches, deny by default (fail-closed)
  if (!rule) return false;

  return rule.roles.includes(role);
}
