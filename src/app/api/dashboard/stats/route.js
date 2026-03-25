import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Question from "@/models/Question";
import Collection from "@/models/Collection";
import Exam from "@/models/Exam";
import Subject from "@/models/Subject";
import ReviewerPermission from "@/models/ReviewerPermission";
import WriterPermission from "@/models/WriterPermission";

export const revalidate = 300; // Disable caching for real-time stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    if (session.user.role === "REVIEWER") {
      const permissions = await ReviewerPermission.find({ reviewer: session.user.id }).lean();
      const totalBoards = permissions.length;
      const totalExams = permissions.reduce((acc, p) => acc + (p.exams ? p.exams.length : 0), 0);
      
      return NextResponse.json({
        role: "REVIEWER",
        totalBoards,
        totalExams
      });
    }

    if (session.user.role === "CONTENT_WRITER") {
      const permissions = await WriterPermission.find({ writer: session.user.id }).lean();
      const totalBoards = permissions.length;
      const totalExams = permissions.reduce((acc, p) => acc + (p.exams ? p.exams.length : 0), 0);
      
      return NextResponse.json({
        role: "CONTENT_WRITER",
        totalBoards,
        totalExams
      });
    }

    const [qCount, cCount, eCount, sCount, recentQ, recentC] = await Promise.all([
      Question.countDocuments(),
      Collection.countDocuments(),
      Exam.countDocuments(),
      Subject.countDocuments(),
      Question.find().sort({ createdAt: -1 }).limit(5).lean(),
      Collection.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      role: session.user.role,
      totalQuestions: qCount,
      totalCollections: cCount,
      totalExams: eCount,
      totalSubjects: sCount,
      recentQuestions: recentQ,
      recentCollections: recentC
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}