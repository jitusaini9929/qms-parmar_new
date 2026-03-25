import mongoose from "mongoose";
import { LANGUAGE_CODES, LANGUAGES } from "@/enums/language";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * The standard structure for every language entry.
 */
const LanguageContentSchema = new mongoose.Schema({
  passage: { type: String, trim: true },
  text: { type: String, required: true, trim: true },
  solution: { type: String, trim: true },
  description: { type: String, trim: true },
  options: [{
    text: { type: String, required: true, trim: true },
    correctOption: { type: Boolean, default: false, required: true}
  }],
  correctOption: { type: mongoose.Schema.Types.ObjectId}
}, { _id: false });

const QuestionSchema = new mongoose.Schema(
  {
    code: { 
      type: String, 
    },

    // --- ROOT LOGICAL CORE ---
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam"},
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic"},
    
    // Inside your QuestionSchema
    tags: [{ type: String, trim: true }],
    // --- DYNAMIC CONTENT MAP ---
    // This allows question.content.set('mr', { ... })
    content: {
      type: Map,
      of: LanguageContentSchema,
      default: {}
    },

    // --- MANIFEST ---
    availableLanguages: [{
      type: String,
      enum: LANGUAGE_CODES
    }],

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ---------------- DYNAMIC VALIDATION & SYNC ----------------

QuestionSchema.pre("save", async function () {
  try {
    const langsFound = [];
    
    // Iterate through the Map entries (e.g., 'en', 'hi', 'mr')
    for (let [langCode, data] of this.content) {
      // Validate that the language code is allowed in our Enum
      if (!LANGUAGE_CODES.includes(langCode)) {
        throw new Error(`Language code '${langCode}' is not supported in the system enum.`);
      }

      if (data.text) {
        langsFound.push(langCode);

        // Sync correctOption ID for this specific language block
        const correct = data.options.find(o => o.correctOption);
        if (correct) {
          console.log(correct);
          data.correctOption = correct._id;
          console.log("Correct option: ", data.correctOption);
        }
      }
    }

    

    // Automatically update the manifest of available languages
    this.availableLanguages = langsFound;
  } catch (err) {
    throw err;
  }
});

QuestionSchema.plugin(mongooseLeanVirtuals);

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);