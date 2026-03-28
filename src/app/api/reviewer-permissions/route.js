import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import ReviewerPermission from "@/models/ReviewerPermission";
import Board from "@/models/Board";
import Exam from "@/models/Exam";

// GET: Fetch permissions for a specific reviewer
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const reviewerId = searchParams.get("reviewerId") || session.user.id;

    const permissions = await ReviewerPermission.find({ reviewer: reviewerId })
      .populate("board", "boardName boardShortName status")
      .populate("exams", "examName examYear")
      .lean();

    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error("GET_REVIEWER_PERMISSIONS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}

// PUT: Bulk-update permissions for a reviewer
// Body: { reviewerId, permissions: [{ board: "boardId", exams: ["examId1", "examId2"] }] }
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { reviewerId, permissions } = body;

    if (!reviewerId || !Array.isArray(permissions)) {
      return NextResponse.json(
        { message: "reviewerId and permissions array are required" },
        { status: 400 }
      );
    }

    // Delete all existing permissions for this reviewer
    await ReviewerPermission.deleteMany({ reviewer: reviewerId });

    // Create new permission documents
    const docs = permissions
      .filter((p) => p.board && p.exams?.length > 0)
      .map((p) => ({
        reviewer: reviewerId,
        board: p.board,
        exams: p.exams,
      }));

    if (docs.length > 0) {
      await ReviewerPermission.insertMany(docs);
    }

    // Fetch updated permissions to return
    const updated = await ReviewerPermission.find({ reviewer: reviewerId })
      .populate("board", "boardName boardShortName status")
      .populate("exams", "examName examYear")
      .lean();

    return NextResponse.json(
      { message: "Permissions updated", permissions: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT_REVIEWER_PERMISSIONS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
