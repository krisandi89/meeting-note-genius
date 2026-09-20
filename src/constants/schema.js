// App Settings & Constants

export const DEFAULT_SETTINGS = {
    language: "id-ID",
    aiProvider: "gemini", // 'gemini' | 'ollama'
    geminiApiKey: "",
    geminiModel: "gemini-2.5-flash",
    ollamaEndpoint: "http://localhost:11434",
    ollamaModel: "qwen2.5:3b"
};

// Supported languages for speech recognition
export const SUPPORTED_LANGUAGES = [
    { code: "id-ID", name: "🇮🇩 ID", label: "Bahasa Indonesia" },
    { code: "en-US", name: "🇺🇸 EN", label: "English (US)" },
    { code: "bilingual", name: "🌐 ID+EN", label: "Bilingual (ID + EN)" }
];

// Supported Gemini AI models
export const GEMINI_MODELS = [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Rekomendasi Cloud)", fallback: "gemini-2.0-flash" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", fallback: "gemini-1.5-flash" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", fallback: null }
];

// Supported Ollama local models (optimized for MacBook Air M2 8GB)
export const OLLAMA_MODELS = [
    { id: "qwen2.5:3b", name: "Qwen 2.5 3B (Paling Fasih Indo - Rekomendasi M2)", size: "2.0 GB" },
    { id: "llama3.2:3b", name: "Llama 3.2 3B (Meta AI Ringan)", size: "2.0 GB" },
    { id: "gemma2:2b", name: "Gemma 2 2B (Google Super Ringkas)", size: "1.6 GB" }
];
