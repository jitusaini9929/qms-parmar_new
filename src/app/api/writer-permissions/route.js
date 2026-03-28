import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import WriterPermission from "@/models/WriterPermission";
import Board from "@/models/Board";
import Exam from "@/models/Exam";

// GET: Fetch permissions for a specific writer
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const writerId = searchParams.get("writerId") || session.user.id;

    const permissions = await WriterPermission.find({ writer: writerId })
      .populate("board", "boardName boardShortName status")
      .populate("exams", "examName examYear")
      .lean();

    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error("GET_WRITER_PERMISSIONS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}

// PUT: Bulk-update permissions for a writer
// Body: { writerId, permissions: [{ board: "boardId", exams: ["examId1", "examId2"] }] }
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { writerId, permissions } = body;

    if (!writerId || !Array.isArray(permissions)) {
      return NextResponse.json(
        { message: "writerId and permissions array are required" },
        { status: 400 }
      );
    }

    // Delete all existing permissions for this writer
    await WriterPermission.deleteMany({ writer: writerId });

    // Create new permission documents
    const docs = permissions
      .filter((p) => p.board && p.exams?.length > 0)
      .map((p) => ({
        writer: writerId,
        board: p.board,
        exams: p.exams,
      }));

    if (docs.length > 0) {
      await WriterPermission.insertMany(docs);
    }

    // Fetch updated permissions to return
    const updated = await WriterPermission.find({ writer: writerId })
      .populate("board", "boardName boardShortName status")
      .populate("exams", "examName examYear")
      .lean();

    return NextResponse.json(
      { message: "Permissions updated", permissions: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT_WRITER_PERMISSIONS_ERROR", error);
    return NextResponse.json(
      { message: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
