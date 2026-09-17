// App Settings & Constants

export const DEFAULT_SETTINGS = {
    language: "id-ID",
    geminiApiKey: "",
    geminiModel: "gemini-2.5-flash"
};

// Supported languages for speech recognition
export const SUPPORTED_LANGUAGES = [
    { code: "id-ID", name: "🇮🇩 ID", label: "Bahasa Indonesia" },
    { code: "en-US", name: "🇺🇸 EN", label: "English (US)" },
    { code: "bilingual", name: "🌐 ID+EN", label: "Bilingual (ID + EN)" }
];

// Supported Gemini AI models
export const GEMINI_MODELS = [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Rekomendasi)", fallback: "gemini-2.0-flash" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", fallback: "gemini-1.5-flash" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", fallback: null }
];
