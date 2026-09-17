import { useState } from 'react';
import {
    X,
    Key,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Cpu,
    Globe,
    Sparkles,
    Loader2
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, GEMINI_MODELS } from '../constants/schema';
import { testGeminiApiKey } from '../services/geminiService';

export default function SettingsModal({
    isOpen,
    onClose,
    settings,
    onSaveSettings
}) {
    const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
    const [model, setModel] = useState(settings.geminiModel || 'gemini-2.5-flash');
    const [language, setLanguage] = useState(settings.language || 'id-ID');
    const [showKey, setShowKey] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [savedSuccess, setSavedSuccess] = useState(false);

    if (!isOpen) return null;

    const handleTestKey = async () => {
        if (!apiKey.trim()) {
            setTestResult({ success: false, message: 'Harap masukkan API Key terlebih dahulu.' });
            return;
        }

        setTesting(true);
        setTestResult(null);

        const result = await testGeminiApiKey(apiKey.trim(), model);
        setTesting(false);
        setTestResult(result);
    };

    const handleSave = () => {
        const updated = {
            ...settings,
            geminiApiKey: apiKey.trim(),
            geminiModel: model,
            language: language
        };

        onSaveSettings(updated);
        setSavedSuccess(true);
        setTimeout(() => {
            setSavedSuccess(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg glass rounded-2xl shadow-2xl animate-fade-in flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                                Pengaturan Gemini AI
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                Konfigurasi model AI & Speech Recognition
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-5">
                    {/* Gemini API Key */}
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm font-semibold text-[var(--color-text-primary)]">
                            <span className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-[var(--color-accent-primary)]" />
                                Google Gemini API Key
                            </span>
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-primary)] hover:underline"
                            >
                                Dapatkan Kunci Gratis
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setTestResult(null);
                                }}
                                placeholder="AIzaSy..."
                                className="input-field pr-10 font-mono text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                            >
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Kunci API disimpan hanya di browser lokal Anda (Local Storage) dan tidak pernah dikirim ke pihak luar.
                        </p>

                        {/* Test Button & Status */}
                        <div className="flex items-center gap-3 pt-1">
                            <button
                                type="button"
                                onClick={handleTestKey}
                                disabled={testing || !apiKey.trim()}
                                className="text-xs py-1.5 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Tes Koneksi Kunci
                            </button>

                            {testResult && (
                                <div className={`text-xs flex items-center gap-1.5 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                    {testResult.success ? (
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                    )}
                                    <span>{testResult.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                            <Cpu className="w-4 h-4 text-[var(--color-accent-primary)]" />
                            Model Gemini
                        </label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="input-field text-sm cursor-pointer"
                        >
                            {GEMINI_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Gemini 2.5 Flash memberikan respons sangat cepat dengan penalaran ringkasan rapat yang mendalam.
                        </p>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                            <Globe className="w-4 h-4 text-[var(--color-accent-primary)]" />
                            Bahasa Pengenalan Suara
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field text-sm cursor-pointer"
                        >
                            {SUPPORTED_LANGUAGES.map((l) => (
                                <option key={l.code} value={l.code}>
                                    {l.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="btn-secondary text-sm py-2 px-4"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className={`text-sm py-2 px-5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                            savedSuccess
                                ? 'bg-green-600 text-white'
                                : 'btn-primary'
                        }`}
                    >
                        {savedSuccess ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Tersimpan!
                            </>
                        ) : (
                            'Simpan Pengaturan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
