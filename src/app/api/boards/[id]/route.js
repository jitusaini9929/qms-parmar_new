import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const revalidate = 60; // Revalidate every 60 seconds
// GET a single board
export async function GET(req, { params }) {
  const { id } = await params;
  console.log("Fetching board with ID:", id);
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
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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