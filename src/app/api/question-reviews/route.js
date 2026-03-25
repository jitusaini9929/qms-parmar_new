import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import QuestionReview from "@/models/QuestionReview";
import Question from "@/models/Question";
import ReviewerPermission from "@/models/ReviewerPermission";

// GET: Fetch questions for review (supports pagination, filtering by exam)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId");
    const status = searchParams.get("status") || "PENDING";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 1;
    const skip = (page - 1) * limit;

    if (!examId) {
      return NextResponse.json(
        { message: "examId is required" },
        { status: 400 }
      );
    }

    // Verify reviewer has access to this exam
    if (session.user.role === "REVIEWER") {
      const hasAccess = await ReviewerPermission.findOne({
        reviewer: session.user.id,
        exams: examId,
      });
      if (!hasAccess) {
        return NextResponse.json(
          { message: "No access to this exam" },
          { status: 403 }
        );
      }
    }

    // Build question query
    const questionQuery = { exam: examId, isActive: true };

    // Get all questions for this exam
    const allQuestionIds = await Question.find(questionQuery)
      .select("_id")
      .lean();
    const questionIds = allQuestionIds.map((q) => q._id);

    // Ensure QuestionReview records exist for all questions (create PENDING ones if missing)
    const existingReviews = await QuestionReview.find({
      question: { $in: questionIds },
    })
      .select("question")
      .lean();
    const reviewedQuestionIds = new Set(
      existingReviews.map((r) => r.question.toString())
    );

    const missingReviews = questionIds
      .filter((id) => !reviewedQuestionIds.has(id.toString()))
      .map((id) => ({ question: id, status: "PENDING" }));

    if (missingReviews.length > 0) {
      await QuestionReview.insertMany(missingReviews, { ordered: false }).catch(
        () => {}
      );
    }

    // Now query reviews with the desired status
    const reviewQuery = {
      question: { $in: questionIds },
    };
    if (status !== "ALL") {
      reviewQuery.status = status;
    }

    const [reviews, total] = await Promise.all([
      QuestionReview.find(reviewQuery)
        .populate({
          path: "question",
          populate: [
            { path: "exam", select: "examName" },
            { path: "shift", select: "shiftName" },
            { path: "subject", select: "subjectName" },
            { path: "topic", select: "topicName" },
          ],
        })
        .populate("reviewedBy", "name")
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      QuestionReview.countDocuments(reviewQuery),
    ]);

    return NextResponse.json(
      {
        reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_QUESTION_REVIEWS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT: Submit a review (approve/reject a question)
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { questionId, status, comments } = body;

    if (!questionId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "questionId and valid status (APPROVED/REJECTED) required" },
        { status: 400 }
      );
    }

    if (status === "REJECTED" && !comments?.trim()) {
      return NextResponse.json(
        { message: "Comments are required when rejecting a question" },
        { status: 400 }
      );
    }

    const review = await QuestionReview.findOneAndUpdate(
      { question: questionId },
      {
        status,
        comments: comments || "",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: `Question ${status.toLowerCase()}`, review },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT_QUESTION_REVIEW_ERROR", error);
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
