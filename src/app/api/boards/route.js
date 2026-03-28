import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

// This tells Next.js to cache this route and revalidate every 60 seconds
export const revalidate = 60;

export async function POST(req) {
  const { session, denied } = await requireRole(req, "POST", "/api/boards");
  if (denied) return denied;

  try {
    const body = await req.json();
    const { boardName, boardShortName, boardSlug, description } = body;

    await connectDB();

    const newBoard = await Board.create({
      boardName,
      boardShortName,
      boardSlug,
      description,
      createdBy: session.user.id,
    });
    revalidatePath("/api/boards");
    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { session, denied } = await requireRole(req, "GET", "/api/boards");
  if (denied) return denied;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = {};
    if (searchParams.get("activeOnly") === "true") {
      query.status = "ACTIVE";
    }
    const boards = await Board.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ boards });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching boards" },
      { status: 500 }
    );
  }
}
