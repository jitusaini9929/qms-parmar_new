import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift"; // Ensure you have a Shift model
import Exam from "@/models/Exam";

/**
 * GET: Fetch all shifts for a specific Exam ID
 * Endpoint: /api/exams/[id]/shifts
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Exam ID is required" }, { status: 400 });
    }

    await connectDB();

    // Find shifts where the 'exam' reference matches the ID in the URL
    const shifts = await Shift.find({ exam: id }).populate("exam", "examName").sort({ date: -1 });;

    return NextResponse.json({ shifts }, { status: 200 });
  } catch (error) {
    console.error("GET_EXAM_SHIFTS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch shifts for this exam" },
      { status: 500 }
    );
  }
}