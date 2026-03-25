import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// This tells Next.js to cache this route and revalidate every 60 seconds
export const revalidate = 60;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { boardName, boardShortName, boardSlug, description } = body;

    await connectDB();

    const newBoard = await Board.create({
      boardName,
      boardShortName,
      boardSlug,
      description,
      createdBy: session.user.id, // Assuming id is in session
    });
    revalidatePath("/api/boards");
    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const boards = await Board.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ boards });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching boards" },
      { status: 500 }
    );
  }
}
