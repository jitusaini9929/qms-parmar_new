import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Exam from "@/models/Exam";
import Board from "@/models/Board";
import { requireRole } from "@/lib/auth-guard";

export const revalidate = 60; // 1-minute cache

export async function GET(req, { params }) {
  const { session, denied } = await requireRole(req, "GET", "/api/exams");
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectDB();
    const exam = await Exam.findById(id).populate("board", "boardName boardShortName");
    if (!exam) return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { session, denied } = await requireRole(req, "PUT", "/api/exams");
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const updatedExam = await Exam.findByIdAndUpdate(id, body, { new: true });
    revalidatePath("/dashboard/exams");
    revalidatePath(`/dashboard/exams/${id}`);
    
    return NextResponse.json(updatedExam);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}