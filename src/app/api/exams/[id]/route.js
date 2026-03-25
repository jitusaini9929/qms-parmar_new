import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Exam from "@/models/Exam";
import Board from "@/models/Board";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 60; // 1-minute cache
export async function GET(req, { params }) {
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
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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