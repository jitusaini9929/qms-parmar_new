// languages.js

// 1️⃣ Single source of truth
export const LANGUAGES = {
  ENGLISH: "en",
  HINDI: "hi",
};

// 2️⃣ All valid language codes (for Mongoose / validation)
export const LANGUAGE_CODES = Object.values(LANGUAGES);

// 3️⃣ Utility: SNAKE_CASE → Title Case
const toTitleCase = (key) =>
  key
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());

// 4️⃣ Auto-generated options (Dropdowns / Tabs / UI)
export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(
  ([key, code]) => ({
    code,
    label: toTitleCase(key),
  })
);

// 5️⃣ Fast lookup map: code → label
export const LANGUAGE_LABEL = Object.fromEntries(
  LANGUAGE_OPTIONS.map(({ code, label }) => [code, label])
);

// 6️⃣ Helper function (optional)
export const getLanguageLabel = (code) =>
  LANGUAGE_LABEL[code] ?? "Unknown";
