import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Topic from "@/models/Topic";
import Subject from "@/models/Subject";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 60; // 1-minute cache

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const topic = await Topic.findById(id)
      .populate("subject", "_id subjectName status")
      .populate("parent", "_id topicName status")
      .populate("createdBy", "name");
      
    if (!topic) return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    return NextResponse.json(topic);
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const updatedTopic = await Topic.findByIdAndUpdate(id, body, { new: true });
    
    revalidatePath("/dashboard/topics");
    revalidatePath(`/dashboard/topics/${id}`);
    
    return NextResponse.json(updatedTopic);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}