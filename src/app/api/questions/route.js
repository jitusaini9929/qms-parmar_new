import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Question from "@/models/Question";
import Exam from "@/models/Exam";
import Board from "@/models/Board";
import Shift from "@/models/Shift";
import Subject from "@/models/Subject";
import Topic from "@/models/Topic";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req) {
  const { session, denied } = await requireRole(req, "GET", "/api/questions");
  if (denied) return denied;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // 1. Extract Pagination Parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 2. Resolve valid exam IDs (PUBLISHED exams with ACTIVE boards only)
    const examFilter = { status: "PUBLISHED" };
    if (searchParams.get("boardId")) {
      examFilter.board = searchParams.get("boardId");
    }
    const allExams = await Exam.find(examFilter)
      .populate("board", "status")
      .lean();
    const validExamIds = allExams
      .filter((e) => !e.board || e.board.status !== "INACTIVE")
      .map((e) => e._id);

    // 3. Build Dynamic Query
    const query = { isActive: true, exam: { $in: validExamIds } };
    
    if (searchParams.get("examId")) {
      // Only allow filtering by a valid (published + active board) exam
      const requestedExamId = searchParams.get("examId");
      const isValid = validExamIds.some((id) => id.toString() === requestedExamId);
      if (isValid) {
        query.exam = requestedExamId;
      }
      // If not valid, keep the $in constraint which will naturally exclude it
    }
    if (searchParams.get("shiftId")) query.shift = searchParams.get("shiftId");
    if (searchParams.get("subjectId")) query.subject = searchParams.get("subjectId");
    if (searchParams.get("topicId")) query.topic = searchParams.get("topicId");
    
    if (searchParams.get("lang")) {
      query.availableLanguages = searchParams.get("lang");
    }

    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { "content.en.text": { $regex: search, $options: "i" } },
        { "content.hi.text": { $regex: search, $options: "i" } }
      ];
    }

    // 4. Execute Query with Pagination
    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate("exam", "examName examYear status")
        .populate("shift", "shiftLabel")
        .populate("subject", "subjectName")
        .populate("topic", "topicName")
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }),
      Question.countDocuments(query)
    ]);

    // 5. Return Data with Pagination Metadata
    return NextResponse.json({ 
      questions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("GET_QUESTIONS_ERROR", error);
    return NextResponse.json({ message: "Failed to fetch questions" }, { status: 500 });
  }
}

// POST remains mostly the same, ensure createdBy mapping is solid
export async function POST(req) {
  const { session, denied } = await requireRole(req, "POST", "/api/questions");
  if (denied) return denied;

  try {
    const body = await req.json();
    await connectDB();

    const newQuestion = await Question.create({
      ...body,
      createdBy: session.user.id,
    });

    revalidatePath("/dashboard/questions");
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("POST_QUESTION_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Failed to create question" }, 
      { status: 400 }
    );
  }
}