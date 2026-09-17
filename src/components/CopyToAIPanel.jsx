import { useState } from 'react';
import {
    Copy,
    CheckCircle,
    FileText,
    Sparkles,
    Loader2,
    Download,
    RefreshCw,
    AlertCircle,
    Settings,
    Layers
} from 'lucide-react';
import { generateMeetingNotes } from '../services/geminiService';

const AI_PROMPT = `Berikut adalah transkrip meeting saya. Tolong buatkan ringkasan dalam format Markdown (.md) yang profesional dan bisa langsung di-copy ke Obsidian atau Notion.

Format yang diinginkan:
# [Judul Meeting - buat berdasarkan konteks]
**Tanggal:** [tanggal hari ini atau yang disebutkan]

## 📋 Ringkasan Eksekutif
[2-3 kalimat ringkasan utama]

## 💬 Poin-poin Diskusi Utama
- [poin 1]
- [poin 2]
- dst...

## ✅ Keputusan yang Diambil
- [keputusan 1]
- [keputusan 2]
- dst...

## 📌 Action Items
| No | Task | PIC | Deadline | Status |
|----|------|-----|----------|--------|
| 1 | [task] | [nama] | [deadline] | ⬜ Open |

## ⚠️ Risiko & Blocker
- [jika ada]

## 🔜 Langkah Selanjutnya
1. [langkah 1]
2. [langkah 2]

## ❓ Pertanyaan Terbuka
- [jika ada pertanyaan yang belum terjawab]

---

TRANSKRIP MEETING:
`;

export default function CopyToAIPanel({
    transcript,
    apiKey,
    model = 'gemini-2.5-flash',
    language = 'id-ID',
    onOpenSettings
}) {
    const [activeTab, setActiveTab] = useState('gemini'); // 'gemini' | 'manual'
    const [generating, setGenerating] = useState(false);
    const [notes, setNotes] = useState('');
    const [usedModel, setUsedModel] = useState('');
    const [error, setError] = useState('');
    const [copiedNotes, setCopiedNotes] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedRaw, setCopiedRaw] = useState(false);

    // Format transcript to plain text
    const formatTranscript = () => {
        if (!transcript || transcript.length === 0) return '';

        return transcript
            .map(item => {
                if (item.type === 'mark') return `\n--- MARK: ${item.label} --- [${item.time}]\n`;
                if (item.type === 'system') return `[${item.time}] ${item.text}`;
                return `[${item.time}] ${item.text}`;
            })
            .join('\n');
    };

    const hasTranscript = transcript && transcript.length > 0;
    const wordCount = hasTranscript
        ? transcript.filter(t => t.type !== 'mark' && t.type !== 'system')
            .reduce((acc, t) => acc + (t.text?.split(' ').length || 0), 0)
        : 0;

    // Generate notulen with Gemini Flash
    const handleGenerateNotes = async () => {
        if (!hasTranscript) return;
        if (!apiKey) {
            onOpenSettings?.();
            return;
        }

        setGenerating(true);
        setError('');

        try {
            const result = await generateMeetingNotes({
                transcript,
                apiKey,
                model,
                language
            });

            setNotes(result.text);
            setUsedModel(result.modelUsed);
        } catch (err) {
            setError(err.message || 'Gagal membuat notulen rapat.');
        } finally {
            setGenerating(false);
        }
    };

    // Copy generated notes
    const handleCopyNotes = async () => {
        if (!notes) return;
        try {
            await navigator.clipboard.writeText(notes);
            setCopiedNotes(true);
            setTimeout(() => setCopiedNotes(false), 2500);
        } catch (err) {
            console.error('Failed to copy notes:', err);
        }
    };

    // Download notes as .md file
    const handleDownloadNotes = () => {
        if (!notes) return;
        const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Notulen_${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Copy transcript + prompt to clipboard (manual tab)
    const handleCopyToAI = async () => {
        const transcriptText = formatTranscript();
        const fullContent = AI_PROMPT + transcriptText;

        try {
            await navigator.clipboard.writeText(fullContent);
            setCopiedPrompt(true);
            setTimeout(() => setCopiedPrompt(false), 3000);
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    };

    // Copy only raw transcript (no prompt)
    const handleCopyRaw = async () => {
        const transcriptText = formatTranscript();
        try {
            await navigator.clipboard.writeText(transcriptText);
            setCopiedRaw(true);
            setTimeout(() => setCopiedRaw(false), 2000);
        } catch (err) {
            console.error('Failed to copy raw:', err);
        }
    };

    return (
        <div className="flex flex-col h-full glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {/* Header with Tabs */}
            <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('gemini')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'gemini'
                                ? 'bg-[var(--color-accent-primary)] text-white shadow-sm'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Gemini Flash 2.5
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === 'manual'
                                ? 'bg-[var(--color-accent-primary)] text-white shadow-sm'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                        }`}
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Salin Manual
                    </button>
                </div>

                {hasTranscript && (
                    <span className="text-xs text-[var(--color-text-secondary)] pr-1 font-mono">
                        ~{wordCount} kata
                    </span>
                )}
            </div>

            {/* TAB 1: GEMINI FLASH 2.5 DIRECT NOTULEN */}
            {activeTab === 'gemini' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* If no transcript yet */}
                        {!hasTranscript && (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-3">
                                    <Sparkles className="w-8 h-8 text-[var(--color-accent-primary)] opacity-40" />
                                </div>
                                <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                                    Belum Ada Transkrip Rapat
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 max-w-xs">
                                    Mulai rekam rapat Anda di panel kiri atau impor transkrip teks untuk membuat notulen otomatis.
                                </p>
                            </div>
                        )}

                        {/* If has transcript but no API Key */}
                        {hasTranscript && !apiKey && !notes && (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3">
                                <div className="flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-amber-300">
                                            Google Gemini API Key Diperlukan
                                        </p>
                                        <p className="text-[var(--color-text-secondary)] mt-1">
                                            Masukkan API Key gratis dari Google AI Studio untuk membuat notulen rapat langsung di dalam aplikasi.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onOpenSettings}
                                    className="w-full py-2 px-3 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                    Atur Gemini API Key Sekarang
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs flex items-start gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Gagal Menghasilkan Notulen</p>
                                    <p className="mt-0.5 opacity-90">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {generating && (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 animate-fade-in">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-[var(--color-accent-primary)]/20 border-t-[var(--color-accent-primary)] animate-spin" />
                                    <Sparkles className="w-6 h-6 text-[var(--color-accent-primary)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                                        Gemini Flash sedang menyusun notulen...
                                    </p>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                        Menganalisis poin diskusi, keputusan, dan action items
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Generated Notes Display */}
                        {notes && !generating && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] pb-1 border-b border-[var(--color-border)]">
                                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Notulen Selesai Dibuat ({usedModel || model})
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] overflow-x-auto text-[var(--color-text-primary)]">
                                    <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed">
                                        {notes}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Prompt ready placeholder if not yet generated */}
                        {hasTranscript && !notes && !generating && apiKey && (
                            <div className="p-4 rounded-xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 space-y-2">
                                <p className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[var(--color-accent-primary)]" />
                                    Siap Diringkas dengan Gemini Flash
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                    Transkrip siap dianalisis. Klik tombol di bawah untuk menghasilkan notulen rapat lengkap dengan Ringkasan Eksekutif, Poin Diskusi, Keputusan, dan Tabel Action Items.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] space-y-2.5">
                        {!notes ? (
                            <button
                                onClick={handleGenerateNotes}
                                disabled={!hasTranscript || generating}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyusun Notulen...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        ✨ Buat Notulen (Gemini Flash 2.5)
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={handleCopyNotes}
                                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
                                            copiedNotes
                                                ? 'bg-emerald-600 text-white'
                                                : 'btn-primary'
                                        }`}
                                    >
                                        {copiedNotes ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Berhasil Disalin!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Salin Notulen (.md)
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleDownloadNotes}
                                        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs btn-secondary"
                                    >
                                        <Download className="w-4 h-4" />
                                        Unduh File .md
                                    </button>
                                </div>

                                <button
                                    onClick={handleGenerateNotes}
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                                    Generate Ulang Notulen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: MANUAL COPY TO EXTERNAL AI */}
            {activeTab === 'manual' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {!hasTranscript ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-3">
                                    <Copy className="w-8 h-8 text-[var(--color-text-secondary)] opacity-40" />
                                </div>
                                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                    Belum Ada Transkrip
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                    Rekam meeting terlebih dahulu, lalu salin ke ChatGPT atau Claude.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3.5 rounded-xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 text-xs">
                                    <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                                        <Layers className="w-4 h-4 text-[var(--color-accent-primary)]" />
                                        Salin Transkrip + Prompt
                                    </p>
                                    <p className="text-[var(--color-text-secondary)] mt-1">
                                        Salin teks transkrip bersama instruksi prompt profesional untuk ditempelkan secara mandiri ke ChatGPT, Gemini Web, atau Claude.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-semibold text-[var(--color-text-secondary)]">
                                        Preview Transkrip:
                                    </h3>
                                    <div className="p-3 rounded-lg bg-[var(--color-bg-tertiary)] max-h-44 overflow-y-auto">
                                        <pre className="text-xs text-[var(--color-text-primary)] whitespace-pre-wrap font-mono">
                                            {formatTranscript().slice(0, 500)}
                                            {formatTranscript().length > 500 && '...'}
                                        </pre>
                                    </div>
                                </div>

                                <details className="group">
                                    <summary className="text-xs text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-accent-primary)]">
                                        Lihat format prompt yang disertakan →
                                    </summary>
                                    <div className="mt-2 p-3 rounded-lg bg-[var(--color-bg-tertiary)] max-h-36 overflow-y-auto">
                                        <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
                                            {AI_PROMPT.slice(0, 400)}...
                                        </pre>
                                    </div>
                                </details>
                            </div>
                        )}
                    </div>

                    {/* Manual Tab Actions */}
                    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] space-y-2">
                        <button
                            onClick={handleCopyToAI}
                            disabled={!hasTranscript}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                                copiedPrompt
                                    ? 'bg-emerald-600 text-white'
                                    : 'btn-primary'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {copiedPrompt ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Berhasil Disalin! Paste ke AI →
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    📋 Copy to AI (+ Prompt)
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleCopyRaw}
                            disabled={!hasTranscript}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copiedRaw ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    Teks Mentah Disalin
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4" />
                                    Salin Teks Mentah Saja
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
