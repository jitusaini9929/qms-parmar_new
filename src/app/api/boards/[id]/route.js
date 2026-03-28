import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export const revalidate = 60; // Revalidate every 60 seconds

// GET a single board
export async function GET(req, { params }) {
  const { session, denied } = await requireRole(req, "GET", "/api/boards");
  if (denied) return denied;

  const { id } = await params;
  try {
    await connectDB();
    const board = await Board.findById(id).populate("createdBy", "name");

    if (!board) return NextResponse.json({ message: "Board not found" }, { status: 404 });
    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE a board
export async function PUT(req, { params }) {
  const { session, denied } = await requireRole(req, "PUT", "/api/boards");
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { 
        boardName: body.boardName, 
        boardShortName: body.boardShortName, 
        status: body.status,
        description: body.description 
      },
      { new: true }
    );
    revalidatePath("/dashboard/boards");
    if (!updatedBoard) return NextResponse.json({ message: "Board not found" }, { status: 404 });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}