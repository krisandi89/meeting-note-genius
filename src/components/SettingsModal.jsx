import { useState, useEffect } from 'react';
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
    Loader2,
    Terminal,
    Server,
    HardDrive
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, GEMINI_MODELS, OLLAMA_MODELS } from '../constants/schema';
import { testGeminiApiKey } from '../services/geminiService';
import { testOllamaConnection } from '../services/ollamaService';

export default function SettingsModal({
    isOpen,
    onClose,
    settings,
    onSaveSettings
}) {
    const [aiProvider, setAiProvider] = useState(settings.aiProvider || 'gemini');
    const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
    const [geminiModel, setGeminiModel] = useState(settings.geminiModel || 'gemini-2.5-flash');
    const [ollamaEndpoint, setOllamaEndpoint] = useState(settings.ollamaEndpoint || 'http://localhost:11434');
    const [ollamaModel, setOllamaModel] = useState(settings.ollamaModel || 'qwen2.5:3b');
    const [availableLocalModels, setAvailableLocalModels] = useState([]);
    const [language, setLanguage] = useState(settings.language || 'id-ID');
    const [showKey, setShowKey] = useState(false);

    const [testingGemini, setTestingGemini] = useState(false);
    const [geminiTestResult, setGeminiTestResult] = useState(null);

    const [testingOllama, setTestingOllama] = useState(false);
    const [ollamaTestResult, setOllamaTestResult] = useState(null);

    const [savedSuccess, setSavedSuccess] = useState(false);

    // Auto-detect local models when opening modal
    useEffect(() => {
        if (isOpen && aiProvider === 'ollama') {
            testOllamaConnection(ollamaEndpoint).then(res => {
                if (res.success && res.models.length > 0) {
                    setAvailableLocalModels(res.models);
                }
            });
        }
    }, [isOpen, aiProvider, ollamaEndpoint]);

    if (!isOpen) return null;

    const handleTestGemini = async () => {
        if (!apiKey.trim()) {
            setGeminiTestResult({ success: false, message: 'Harap masukkan API Key terlebih dahulu.' });
            return;
        }

        setTestingGemini(true);
        setGeminiTestResult(null);

        const result = await testGeminiApiKey(apiKey.trim(), geminiModel);
        setTestingGemini(false);
        setGeminiTestResult(result);
    };

    const handleTestOllama = async () => {
        setTestingOllama(true);
        setOllamaTestResult(null);

        const result = await testOllamaConnection(ollamaEndpoint);
        setTestingOllama(false);
        setOllamaTestResult(result);
        if (result.success && result.models.length > 0) {
            setAvailableLocalModels(result.models);
        }
    };

    const handleSave = () => {
        const updated = {
            ...settings,
            aiProvider,
            geminiApiKey: apiKey.trim(),
            geminiModel,
            ollamaEndpoint: ollamaEndpoint.trim(),
            ollamaModel,
            language
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
                                Pengaturan AI & Aplikasi
                            </h2>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                Pilih mesin AI (Cloud Gemini / Local Ollama) & konfigurasi suara
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
                    {/* Provider Selector Switch */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                            Mesin AI untuk Pembuatan Notulen:
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                            <button
                                type="button"
                                onClick={() => setAiProvider('gemini')}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    aiProvider === 'gemini'
                                        ? 'bg-[var(--color-accent-primary)] text-white shadow'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                🌐 Google Gemini (Cloud)
                            </button>
                            <button
                                type="button"
                                onClick={() => setAiProvider('ollama')}
                                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    aiProvider === 'ollama'
                                        ? 'bg-[var(--color-accent-primary)] text-white shadow'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                <HardDrive className="w-4 h-4" />
                                💻 Ollama Local (M2)
                            </button>
                        </div>
                    </div>

                    {/* PROVIDER 1: GEMINI CLOUD SETTINGS */}
                    {aiProvider === 'gemini' && (
                        <div className="space-y-4 p-4 rounded-xl bg-[var(--color-bg-tertiary)]/50 border border-[var(--color-border)] animate-fade-in">
                            {/* Gemini API Key */}
                            <div className="space-y-2">
                                <label className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-primary)]">
                                    <span className="flex items-center gap-1.5">
                                        <Key className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
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
                                            setGeminiTestResult(null);
                                        }}
                                        placeholder="AIzaSy..."
                                        className="input-field pr-10 font-mono text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                    >
                                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleTestGemini}
                                        disabled={testingGemini || !apiKey.trim()}
                                        className="text-xs py-1 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {testingGemini && <Loader2 className="w-3 h-3 animate-spin" />}
                                        Tes Koneksi
                                    </button>

                                    {geminiTestResult && (
                                        <div className={`text-xs flex items-center gap-1 ${geminiTestResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                            {geminiTestResult.success ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            )}
                                            <span className="truncate max-w-[200px]">{geminiTestResult.message}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Gemini Model */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                                    <Cpu className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                                    Model Gemini
                                </label>
                                <select
                                    value={geminiModel}
                                    onChange={(e) => setGeminiModel(e.target.value)}
                                    className="input-field text-xs cursor-pointer"
                                >
                                    {GEMINI_MODELS.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* PROVIDER 2: OLLAMA LOCAL SETTINGS */}
                    {aiProvider === 'ollama' && (
                        <div className="space-y-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 animate-fade-in">
                            <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg">
                                <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">100% Offline & Privat di MacBook M2</p>
                                    <p className="text-[var(--color-text-secondary)] mt-0.5">
                                        Data transkrip diproses langsung di chip M2 laptop Anda tanpa melewati server luar.
                                    </p>
                                </div>
                            </div>

                            {/* Ollama Endpoint */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                                    Alamat Ollama Local
                                </label>
                                <input
                                    type="text"
                                    value={ollamaEndpoint}
                                    onChange={(e) => {
                                        setOllamaEndpoint(e.target.value);
                                        setOllamaTestResult(null);
                                    }}
                                    placeholder="http://localhost:11434"
                                    className="input-field font-mono text-xs"
                                />
                            </div>

                            {/* Ollama Model Selection */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                    Model Lokal (Rekomendasi M2: Qwen 2.5 3B)
                                </label>
                                <select
                                    value={ollamaModel}
                                    onChange={(e) => setOllamaModel(e.target.value)}
                                    className="input-field text-xs cursor-pointer font-mono"
                                >
                                    {OLLAMA_MODELS.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} ({m.size})
                                        </option>
                                    ))}
                                    {availableLocalModels
                                        .filter(m => !OLLAMA_MODELS.some(om => om.id === m))
                                        .map(m => (
                                            <option key={m} value={m}>
                                                {m} (Terdeteksi di Mac)
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Test Connection Button */}
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={handleTestOllama}
                                    disabled={testingOllama}
                                    className="text-xs py-1 px-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {testingOllama && <Loader2 className="w-3 h-3 animate-spin" />}
                                    Tes Koneksi Ollama
                                </button>

                                {ollamaTestResult && (
                                    <div className={`text-xs flex items-center gap-1 ${ollamaTestResult.success ? 'text-green-400' : 'text-amber-400'}`}>
                                        {ollamaTestResult.success ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        )}
                                        <span className="truncate max-w-[220px]">{ollamaTestResult.message}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quick terminal hint */}
                            <div className="text-[11px] text-[var(--color-text-secondary)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                                <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                                    <Terminal className="w-3 h-3 text-emerald-400" />
                                    Tips Menjalankan Ollama di Mac:
                                </p>
                                <p>• Download model di Terminal: <code className="px-1 py-0.5 rounded bg-[var(--color-bg-primary)] font-mono text-emerald-300">ollama pull qwen2.5:3b</code></p>
                                <p>• Izin CORS dari Vercel: <code className="px-1 py-0.5 rounded bg-[var(--color-bg-primary)] font-mono text-emerald-300">launchctl setenv OLLAMA_ORIGINS "*"</code></p>
                            </div>
                        </div>
                    )}

                    {/* Language Selection */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
                            <Globe className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                            Bahasa Transkripsi Suara
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field text-xs cursor-pointer"
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
                        className="btn-secondary text-xs py-2 px-4"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className={`text-xs py-2 px-5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
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
