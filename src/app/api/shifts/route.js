import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shift from "@/models/Shift";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
// This tells Next.js to cache this route and revalidate every 60 seconds
export const revalidate = 60;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const examId = searchParams.get("examId");
    const search = searchParams.get("search");

    // Build the query object
    const query = { };

    if (examId) {
      // --- VALIDATION START ---
      if (!mongoose.Types.ObjectId.isValid(examId)) {
        return NextResponse.json(
          { message: "Invalid Exam ID." },
          { status: 400 }
        );
      }
      // --- VALIDATION END ---

      query.exam = examId;
    }

    if (search) {
      query.shiftName = { $regex: search, $options: "i" };
    }

    const shifts = await Shift.find(query)
      .populate("exam", "examName")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ shifts }, { status: 200 });
  } catch (error) {
    console.error("GET_SHIFTS_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    await connectDB();
    const newShift = await Shift.create({
      ...body,
      createdBy: session.user.id,
    });
    revalidatePath("/api/shifts");
    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
