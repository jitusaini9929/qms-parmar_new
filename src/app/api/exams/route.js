import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Exam from "@/models/Exam";
import Board from "@/models/Board";
import { requireRole } from "@/lib/auth-guard";

export const revalidate = 60; // 1-minute cache

export async function GET(req) {
  // Content Writers need to read exams for question filter dropdowns
  const { session, denied } = await requireRole(req, "GET", "/api/exams");
  if (denied) return denied;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = {};
  if (searchParams.get("publishedOnly") === "true") {
    query.status = "PUBLISHED";
  }
  let exams = await Exam.find(query).populate("board", "boardShortName boardName status").sort({ createdAt: -1 });
  // Exclude exams whose board is INACTIVE
  exams = exams.filter((e) => !e.board || e.board.status !== "INACTIVE");
  return NextResponse.json({ exams });
}

export async function POST(req) {
  const { session, denied } = await requireRole(req, "POST", "/api/exams");
  if (denied) return denied;

  try {
    const body = await req.json();
    await connectDB();

    // Validate that board is active
    if (body.board) {
      const board = await Board.findById(body.board);
      if (!board) return NextResponse.json({ message: "Board not found" }, { status: 400 });
      if (board.status === "INACTIVE") {
        return NextResponse.json({ message: "Cannot create exam under an inactive board" }, { status: 400 });
      }
    }

    const newExam = await Exam.create({ ...body, createdBy: session.user.id });
    revalidatePath("/dashboard/exams");
    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}