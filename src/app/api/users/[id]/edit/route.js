import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireRole } from "@/lib/auth-guard";

export async function PUT(req, { params }) {
  const { session, denied } = await requireRole(req, "PUT", "/api/users");
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name: body.name, role: body.role, status: body.status },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}