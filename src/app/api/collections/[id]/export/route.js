import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/models/Collection";
import Question from "@/models/Question";
import { formatCollectionForExport } from "@/lib/export-utils";
import { renderToStream } from "@react-pdf/renderer";
import { CollectionPDF } from "@/lib/CollectionPDF";
import { requireRole } from "@/lib/auth-guard";

export async function POST(req, { params }) {
  const { session, denied } = await requireRole(req, "POST", "/api/collections");
  if (denied) return denied;

  try {
    const { id } = await params;
    const config = await req.json(); // { selectedLanguages, contentMode, fileFormat }
    const { selectedLanguages } = config;
    await connectDB();

    // Create a dynamic match object
    // It checks if 'content.en' AND 'content.hi' etc. exist based on selection
    const languageMatch = {};
    selectedLanguages.forEach((lang) => {
      languageMatch[`content.${lang}`] = { $exists: true, $ne: null };
    });

    const collection = await Collection.findById(id)
      .populate({
        path: "questions",
        match: languageMatch, // Apply language filter here
      })
      .lean();

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    const exportedData = formatCollectionForExport(collection, config);

    // If fileFormat is JSON, return it directly
    if (config.fileFormat === "json") {
      return NextResponse.json(exportedData, {
        headers: {
          "Content-Disposition": `attachment; filename="${collection.slug}.json"`,
          "Content-Type": "application/json",
        },

      });
    }

    // For PDF/CSV, you would integrate a generator here
    if (config.fileFormat === "pdf") {
      // 1. Generate the stream
      const stream = await renderToStream(
        <CollectionPDF data={exportedData} config={config} />
      );

      // 2. Convert Node.js stream to Web Stream for Next.js
      const response = new NextResponse(stream);

      // 3. Set headers to force download
      response.headers.set("Content-Type", "application/pdf");
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${collection.slug}.pdf"`
      );

      return response;
    }

    return NextResponse.json(
      { message: "Format not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
