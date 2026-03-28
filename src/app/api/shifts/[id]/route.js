import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
  const { session, denied } = await requireRole(req, "GET", "/api/shifts");
  if (denied) return denied;

  const { id } = await params;
  await connectDB();
  const shift = await Shift.findById(id).populate("exam");
  return NextResponse.json(shift);
}

export async function PUT(req, { params }) {
  const { session, denied } = await requireRole(req, "PUT", "/api/shifts");
  if (denied) return denied;

  const body = await req.json();
  const { id } = await params;
  await connectDB();
  const updated = await Shift.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}