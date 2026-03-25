import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Question from "@/models/Question";
import Exam from "@/models/Exam";
import Subject from "@/models/Subject";

/**
 * GET: Fetch a single collection with populated question details
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Collection ID" }, { status: 400 });
    }

    await connectDB();
    const collection = await Collection.findById(id)
      .populate("exam", "examName")
      .populate("subject", "subjectName")
      .populate({
        path: "questions",
        select: "code content difficulty tags", // Only fetch what's needed for summary
      })
      .lean();

    if (!collection) {
      return NextResponse.json({ message: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * PUT: Update Collection Metadata or Question List
 */
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    // --- CLEANUP LOGIC ---
    // If optional hierarchy fields are empty strings, set them to null 
    // so Mongoose doesn't try to validate "" as an ObjectId
    const optionalFields = ["exam", "board", "shift", "subject", "topic"];
    optionalFields.forEach(field => {
      if (body[field] === "") body[field] = null;
    });

    await connectDB();
    
    // We use findByIdAndUpdate with { new: true } to return the updated doc
    // and { runValidators: true } to ensure schema rules are followed.
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedCollection) {
      return NextResponse.json({ message: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCollection, { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Title/Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Remove a collection
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await connectDB();
    const deleted = await Collection.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Collection deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}