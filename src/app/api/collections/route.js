import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Question from "@/models/Question";
import Exam from "@/models/Exam";
import Subject from "@/models/Subject";
import { requireRole } from "@/lib/auth-guard";

/**
 * GET: Fetch collections with advanced multi-parameter filtering
 */
export async function GET(req) {
  const { session, denied } = await requireRole(req, "GET", "/api/collections");
  if (denied) return denied;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    // Advanced Filters
    const exam = searchParams.get("exam");
    const board = searchParams.get("board");
    const shift = searchParams.get("shift");
    const subject = searchParams.get("subject");
    const topic = searchParams.get("topic");
    const tags = searchParams.get("tags");

    const query = { isActive: true };

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    // Validate and add ObjectIDs to query
    const ids = { exam, board, shift, subject, topic };
    for (const [key, value] of Object.entries(ids)) {
      if (value && mongoose.Types.ObjectId.isValid(value)) {
        query[key] = value;
      }
    }

    if (tags) {
      query.tags = { $all: tags.split(",").map((t) => t.trim()) };
    }

    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      Collection.find(query)
        .populate("exam", "examName")
        .populate("subject", "subjectName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Collection.countDocuments(query),
    ]);

    const collectionsWithQuestionCount = await Promise.all(
      collections.map(async (col) => {
        const questionIds = (col.questions || []).filter((qid) =>
          mongoose.Types.ObjectId.isValid(qid)
        );
        const questionCount = questionIds.length
          ? await Question.countDocuments({ _id: { $in: questionIds } })
          : 0;

        return {
          ...col,
          questionRefCount: questionIds.length,
          questionCount,
          missingQuestionCount: Math.max(questionIds.length - questionCount, 0),
        };
      })
    );

    return NextResponse.json(
      {
        collections: collectionsWithQuestionCount,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

/**
 * POST: Create a new Collection with Hierarchy Validation
 */
export async function POST(req) {
  const { session, denied } = await requireRole(req, "POST", "/api/collections");
  if (denied) return denied;

  try {
    await connectDB();
    const body = await req.json();

    // List of fields that are ObjectIds
    const hierarchyFields = ["exam", "board", "shift", "subject", "topic"];

    // Clean the body: If a field is an empty string, delete it
    hierarchyFields.forEach((field) => {
      if (body[field] === "") {
        delete body[field];
      }
    });

    // Now validate only if the field actually exists
    for (const field of hierarchyFields) {
      if (body[field] && !mongoose.Types.ObjectId.isValid(body[field])) {
        return NextResponse.json(
          { message: `Invalid ID format for ${field}` },
          { status: 400 }
        );
      }
    }

    const newCollection = await Collection.create(body);
    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    // Handle Duplicate Key Errors (Title/Slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A collection with this title or slug already exists." },
        { status: 400 }
      );
    }

    console.error("COLLECTION_POST_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
