import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
  const { session, denied } = await requireRole(req, "GET", "/api/users");
  if (denied) return denied;

  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}