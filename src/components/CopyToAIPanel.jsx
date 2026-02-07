import { useState } from 'react';
import { Copy, CheckCircle, FileText } from 'lucide-react';

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

export default function CopyToAIPanel({ transcript }) {
    const [copied, setCopied] = useState(false);

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

    // Copy transcript + prompt to clipboard
    const handleCopyToAI = async () => {
        const transcriptText = formatTranscript();
        const fullContent = AI_PROMPT + transcriptText;

        try {
            await navigator.clipboard.writeText(fullContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Copy only raw transcript (no prompt)
    const handleCopyRaw = async () => {
        const transcriptText = formatTranscript();
        try {
            await navigator.clipboard.writeText(transcriptText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const hasTranscript = transcript && transcript.length > 0;
    const wordCount = hasTranscript
        ? transcript.filter(t => t.type !== 'mark' && t.type !== 'system')
            .reduce((acc, t) => acc + (t.text?.split(' ').length || 0), 0)
        : 0;

    return (
        <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--color-accent-primary)]" />
                    <h2 className="font-semibold text-[var(--color-text-primary)]">Copy to AI</h2>
                </div>
                {hasTranscript && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                        ~{wordCount} kata
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {!hasTranscript ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-4">
                            <Copy className="w-10 h-10 text-[var(--color-text-secondary)] opacity-40" />
                        </div>
                        <p className="text-[var(--color-text-secondary)]">
                            Belum ada transkrip
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                            Rekam meeting terlebih dahulu, lalu copy ke AI untuk diringkas
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Info Box */}
                        <div className="p-4 rounded-xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20">
                            <p className="text-sm text-[var(--color-text-primary)]">
                                <span className="font-semibold">📋 Siap di-copy!</span>
                                <br />
                                <span className="text-[var(--color-text-secondary)]">
                                    Transkrip akan di-copy bersama prompt untuk menghasilkan ringkasan dalam format Markdown profesional.
                                </span>
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                                Preview Transkrip:
                            </h3>
                            <div className="p-3 rounded-lg bg-[var(--color-bg-tertiary)] max-h-48 overflow-y-auto">
                                <pre className="text-xs text-[var(--color-text-primary)] whitespace-pre-wrap font-mono">
                                    {formatTranscript().slice(0, 500)}
                                    {formatTranscript().length > 500 && '...'}
                                </pre>
                            </div>
                        </div>

                        {/* Prompt Preview */}
                        <details className="group">
                            <summary className="text-xs text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-accent-primary)]">
                                Lihat prompt yang akan di-copy →
                            </summary>
                            <div className="mt-2 p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                                <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
                                    {AI_PROMPT.slice(0, 400)}...
                                </pre>
                            </div>
                        </details>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] space-y-3">
                {/* Main Copy Button */}
                <button
                    onClick={handleCopyToAI}
                    disabled={!hasTranscript}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all
                        ${copied
                            ? 'bg-green-500 text-white'
                            : 'btn-primary'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {copied ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Berhasil di-copy! Paste ke AI →
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5" />
                            📋 Copy to AI (+ Prompt)
                        </>
                    )}
                </button>

                {/* Secondary Actions */}
                <button
                    onClick={handleCopyRaw}
                    disabled={!hasTranscript}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm
                        btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Copy className="w-4 h-4" />
                    Copy Raw (tanpa prompt)
                </button>
            </div>
        </div>
    );
}
