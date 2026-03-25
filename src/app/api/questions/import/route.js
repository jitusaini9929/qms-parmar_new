import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Question from "@/models/Question";
import Collection from "@/models/Collection";
import Shift from "@/models/Shift";
import Topic from "@/models/Topic";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";

/* -------------------------------------------------
   Utils + Canonical Cache
------------------------------------------------- */

const isObjectId = (v) => mongoose.Types.ObjectId.isValid(v);

const normalizeKey = (v = "") =>
  slugify(v.toString().trim().toLowerCase(), { lower: true });

const escapeRegex = (v = "") => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cache = new Map();

const cached = async (key, fn) => {
  if (cache.has(key)) return cache.get(key);
  const val = await fn();
  cache.set(key, val);
  return val;
};

const normalizeDate = (v) => {
  if (!v) return null;
  const [d, m, y] = v.split("/");
  return `${y}-${m}-${d}`;
};

const normalizeTimeMixed = (v) => {
  if (!v) return {};

  const to24 = (t) => {
    const [time, meridian] = t.trim().split(" ");
    let [h, m] = time.split(":");
    h = parseInt(h, 10);

    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;

    return `${h.toString().padStart(2, "0")}:${m}`;
  };

  if (v.includes("-")) {
    const [start, end] = v.split("-").map((s) => s.trim());
    return { startTime: to24(start), endTime: to24(end) };
  }

  return { startTime: to24(v), endTime: null };
};

/* -------------------------------------------------
   Resolvers
------------------------------------------------- */

// Exam (optional, strict)
async function resolveExam(examInput) {
  console.log("ExamInput 1:", examInput);

  if (!examInput || examInput.trim() === "none") return null;

  console.log("ExamInput 2:", examInput);

  const key = `exam:${normalizeKey(examInput)}`;

  return cached(key, async () => {
    const escaped = escapeRegex(examInput.trim());
    console.log("Escaped", escaped);
    const exam = isObjectId(examInput)
      ? await Exam.findById(examInput)
      : await Exam.findOne({
          $or: [
            { name: new RegExp(`^${escaped}$`, "i") },
            { slug: new RegExp(`^${escaped}$`, "i") },
          ],
        });
    console.log("Exam", exam);
    if (!exam) throw new Error("Exam not found. Create exam first.");
    return exam._id;
  });
}

// Subject (NO DUPLICATES)
async function resolveSubject(subjectInput, userId) {
  if (!subjectInput) return null;
  if (isObjectId(subjectInput)) return subjectInput;

  const key = `subject:${normalizeKey(subjectInput)}`;

  return cached(key, async () => {
    const escaped = escapeRegex(subjectInput.trim());

    let subject = await Subject.findOne({
      $or: [
        { subjectName: new RegExp(`^${escaped}$`, "i") },
        { subjectSlug: new RegExp(`^${escaped}$`, "i") },
      ],
    });

    if (!subject) {
      subject = await Subject.create({
        subjectName: subjectInput.trim(),
        subjectSlug: normalizeKey(subjectInput),
        createdBy: userId,
      });
    }

    return subject._id;
  });
}

// Topic (subject-scoped, NO DUPLICATES)
async function resolveTopic(topicInput, subjectId, userId) {
  if (!topicInput || !subjectId) return null;
  if (isObjectId(topicInput)) return topicInput;

  const slug = normalizeKey(topicInput);
  const key = `topic:${subjectId}:${slug}`;

  return cached(key, async () => {
    const escaped = escapeRegex(topicInput.trim());

    let topic = await Topic.findOne({
      subject: subjectId,
      $or: [
        { topicName: new RegExp(`^${escaped}$`, "i") },
        { topicSlug: new RegExp(`^${escaped}$`, "i") },
      ],
    });

    if (topic) return topic._id;

    try {
      topic = await Topic.create({
        topicName: topicInput.trim(),
        topicSlug: slug,
        subject: subjectId,
        createdBy: userId,
      });
      return topic._id;
    } catch (err) {
      // 🔥 Handle duplicate key race condition
      if (err.code === 11000) {
        const existing = await Topic.findOne({ topicSlug: slug });
        if (existing) return existing._id;
      }
      throw err;
    }
  });
}

// Shift (only if exam exists)
async function resolveShift(shiftInput, examId, userId) {
  if (!shiftInput || !examId) return null;
  if (isObjectId(shiftInput)) return shiftInput;

  const { shiftName, date, startTime, endTime } = shiftInput;
  if (!shiftName || !date || !startTime) return null;

  const key = `shift:${examId}:${normalizeKey(shiftName)}:${date}`;

  return cached(key, async () => {
    let shift = await Shift.findOne({
      exam: examId,
      shiftName: new RegExp(`^${escapeRegex(shiftName)}$`, "i"),
      date,
    });

    if (!shift) {
      shift = await Shift.create({
        exam: examId,
        shiftName: shiftName.trim(),
        date,
        startTime,
        endTime: endTime || null,
        createdBy: userId,
      });
    }

    return shift._id;
  });
}

//Shift (only if exam exists)
async function resolveShiftFromQuestion(question, examId, userId) {
  if (!examId || !question) return null;

  const examDate = normalizeDate(question["exam-date"]);
  const { startTime, endTime } = normalizeTimeMixed(question["exam-time"]);

  if (!examDate || !startTime) return null;

  const key = `shift:${examId}:${examDate}:${startTime}`;

  return cached(key, async () => {
    // 1️⃣ Exact match
    let shift = await Shift.findOne({
      exam: examId,
      date: examDate,
      startTime,
      endTime: endTime || null,
    });

    if (shift) return shift._id;

    // 2️⃣ Upgrade existing shift (endTime came later)
    shift = await Shift.findOne({
      exam: examId,
      date: examDate,
      startTime,
      endTime: null,
    });

    if (shift && endTime) {
      shift.endTime = endTime;
      await shift.save();
      return shift._id;
    }

    // 3️⃣ Create new shift
    const count = await Shift.countDocuments({ exam: examId, date: examDate });

    shift = await Shift.create({
      exam: examId,
      shiftName: `Shift-${count + 1}`,
      date: examDate,
      startTime,
      endTime: endTime || null,
      createdBy: userId,
    });

    return shift._id;
  });
}

/* -------------------------------------------------
   API
------------------------------------------------- */

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { questions = [], hierarchy = {}, collection } = await req.json();
    if (!questions.length)
      return NextResponse.json(
        { message: "No questions provided" },
        { status: 400 }
      );

    await connectDB();
    const userId = session.user.id;

    /* ---------- Resolve hierarchy FIRST ---------- */

    const hierarchyExamId = await resolveExam(hierarchy.exam);
    console.log("HierarchyExamId", hierarchyExamId);
    const hierarchyShiftId = hierarchyExamId
      ? await resolveShift(hierarchy.shift, hierarchyExamId, userId)
      : null;
    console.log("HierarchyShiftId", hierarchyShiftId);
    const hierarchySubjectId = await resolveSubject(hierarchy.subject, userId);
    console.log("HierarchySubjectId", hierarchySubjectId);

    const hierarchyTopicId = await resolveTopic(
      hierarchy.topic,
      hierarchySubjectId,
      userId
    );
    console.log("HierarchyTopicId", hierarchyTopicId);

    /* ---------- Questions ---------- */

    const docs = [];
    let qNo = 1;
    for (const q of questions) {
      console.log("Question Number", qNo++);

      const subjectId =
        hierarchySubjectId ??
        (q.subject ? await resolveSubject(q.subject, userId) : null);
      //console.log("Subject Id", subjectId);

      const topicId =
        hierarchyTopicId ??
        (q.topic ? await resolveTopic(q.topic, subjectId, userId) : null);
      //console.log("Topic Id", topicId);

      const shiftId =
        hierarchyShiftId ??
        (hierarchyExamId
          ? await resolveShiftFromQuestion(q, hierarchyExamId, userId)
          : null);
      console.log("Shift Id", shiftId);

      //const availableLanguages = Array.isArray(q.content) ? q.content.map((c) => c?.language).filter(Boolean) : q.content?.language ? [q.content.language]: [];

      const availableLanguages =
        q.content && typeof q.content === "object"
          ? Object.keys(q.content)
          : [];

      //console.log("Available Language", JSON.stringify(availableLanguages, null, 2));

      docs.push({
        ...q,
        exam: hierarchyExamId,
        shift: shiftId,
        subject: subjectId,
        topic: topicId,
        availableLanguages,
        createdBy: userId,
        isActive: true,
      });
    }
    // console.log("data before save: ", JSON.stringify(docs, null, 2));

    //const saved = await Question.insertMany(docs, { ordered: false });

    //console.log("saved",JSON.stringify(saved));

    let saved = [];

    try {
      saved = await Question.insertMany(docs, { ordered: false });

      // saved = await Promise.all(
      //   docs.map(async (doc) => {
      //     const que = new Question(doc);
      //     return await que.save();
      //   })
      // );

      // rawResult mode
      // saved = saved.insertedDocs || [];
    } catch (err) {
      console.error("InsertMany error (expected with duplicates)");

      // 🔥 THIS IS THE KEY PART
      if (err.result?.insertedDocs) {
        saved = err.result.insertedDocs;
      } else if (err.writeErrors) {
        console.log("Duplicate errors:", err.writeErrors.length);
        saved = err.insertedDocs || [];
      } else {
        throw err; // real failure
      }
    }

    console.log("saved", JSON.stringify(saved));

    if (collection?.title && saved.length) {
      const body = {
        title: collection.title,
        category: "PRACTICE_SET",
        exam: hierarchyExamId,
        shift: hierarchyShiftId,
        subject: hierarchySubjectId,
        topic: hierarchyTopicId,
        questions: saved.map((q) => q._id),
        createdBy: userId,
      };

      try {
        await Collection.create({ ...body });
      } catch (err) {
        if (err.code === 11000) {
          console.log("Collection with this title already exists.");
          const istStamp = () => {
            const d = new Date(Date.now());
            return (
              d.getFullYear() +
              String(d.getMonth() + 1).padStart(2, "0") +
              String(d.getDate()).padStart(2, "0") +
              String(d.getHours()).padStart(2, "0") +
              String(d.getMinutes()).padStart(2, "0") +
              String(d.getSeconds()).padStart(2, "0")
            );
          };

          body.title = `${collection.title}-${istStamp()}`;

          await Collection.create({ ...body });
          console.log("Collection created with new title:", body.title);
        } else {
          console.error("Error creating collection:", err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: saved.length,
      noDuplicateSubjects: true,
      noDuplicateTopics: true,
    });
  } catch (err) {
    console.error("IMPORT_ERROR", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
