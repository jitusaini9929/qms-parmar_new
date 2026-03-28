import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";
import User from "@/models/User";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
  const { session, denied } = await requireRole(req, "GET", "/api/subjects");
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectDB();
    const subject = await Subject.findById(id).populate("createdBy", "name");
    if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { session, denied } = await requireRole(req, "PUT", "/api/subjects");
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const updatedSubject = await Subject.findByIdAndUpdate(id, body, { new: true });
    
    revalidatePath("/dashboard/subjects");
    revalidatePath(`/dashboard/subjects/${id}`);
    
    return NextResponse.json(updatedSubject);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}