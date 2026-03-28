import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { API_ACCESS } from "@/enums/role";

// ─────────────────────────────────────────────
// API Route Guard
// Usage in any API route:
//
//   import { requireRole } from "@/lib/auth-guard";
//   export async function GET(req) {
//     const { session, denied } = await requireRole(req, "GET", "/api/boards");
//     if (denied) return denied;
//     // ... proceed with session.user
//   }
// ─────────────────────────────────────────────

export async function requireRole(req, method, routePath) {
  const session = await getServerSession(authOptions);

  // 1. Not logged in at all
  if (!session) {
    return {
      session: null,
      denied: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user?.role;

  // 2. Find the matching access rule
  //    We check for rules that match the routePath prefix.
  //    More specific paths (/api/users/profile) should be checked before broader (/api/users).
  const rule = API_ACCESS.find(
    (r) =>
      routePath.startsWith(r.path) &&
      (r.method === "ALL" || r.method === method)
  );

  // 3. If no rule is found, default to deny (fail-closed)
  if (!rule) {
    return {
      session,
      denied: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  // 4. Check if the user's role is in the allowed list
  if (!rule.roles.includes(role)) {
    return {
      session,
      denied: NextResponse.json(
        { message: "Forbidden: insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  // 5. Authorized — return session, no error
  return { session, denied: null };
}
