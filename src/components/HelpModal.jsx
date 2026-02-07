import { X, Mic, Copy, HelpCircle, Bookmark, ExternalLink } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl glass rounded-2xl shadow-2xl animate-fade-in max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-[var(--color-accent-primary)]" />
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                            Panduan Penggunaan
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                       hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]
                       transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Getting Started */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Cara Menggunakan
                        </h3>
                        <ol className="space-y-3 text-[var(--color-text-primary)]">
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">1</span>
                                <div>
                                    <p className="font-medium">Mulai Merekam</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Klik "Mulai Meeting" dan izinkan akses mikrofon. Transkripsi akan berjalan otomatis.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">2</span>
                                <div>
                                    <p className="font-medium">Tandai Momen Penting</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Gunakan tombol "Tandai" untuk menandai bagian penting seperti keputusan atau action items.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">3</span>
                                <div>
                                    <p className="font-medium">Stop & Copy ke AI</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Setelah selesai, klik "Copy to AI" untuk menyalin transkrip beserta prompt ke clipboard.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">4</span>
                                <div>
                                    <p className="font-medium">Paste ke AI</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Buka Gemini atau ChatGPT, paste, dan dapatkan ringkasan dalam format Markdown profesional.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </section>

                    {/* Features */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Fitur Utama
                        </h3>
                        <div className="grid gap-3">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Mic className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Rekaman Langsung</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Transkripsi real-time dengan Web Speech API (gratis). Pause/Resume kapan saja.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Bookmark className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Tandai Momen</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Klik "Tandai" untuk menandai bagian penting seperti "Diskusi Budget"
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Copy className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Copy to AI</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Salin transkrip + prompt siap pakai untuk Gemini/ChatGPT
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <ExternalLink className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Output Markdown</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Hasil ringkasan dalam format .md siap copy ke Obsidian atau Notion
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Privacy */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Privasi & Keamanan
                        </h3>
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <ul className="space-y-2 text-sm text-[var(--color-text-primary)]">
                                <li>✓ <strong>100% Offline</strong> - Tidak ada API key yang diperlukan</li>
                                <li>✓ <strong>Tidak ada audio yang disimpan</strong> - hanya teks transkrip</li>
                                <li>✓ <strong>Semua data di browser</strong> - tidak ada server pihak ketiga</li>
                                <li>✓ <strong>Anda yang kontrol</strong> - pilih sendiri mau paste ke AI mana</li>
                            </ul>
                        </div>
                    </section>

                    {/* Tips */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                            <li>💡 Gunakan Chrome atau Edge untuk hasil transkripsi terbaik</li>
                            <li>💡 Bicara dengan jelas dan dekat dengan mikrofon</li>
                            <li>💡 Tandai momen penting saat ada keputusan atau action item</li>
                            <li>💡 Gunakan "Copy Raw" jika ingin menyalin tanpa prompt</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--color-border)] text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        MeetingGenius v2.0 • Offline Meeting Transcriber
                    </p>
                </div>
            </div>
        </div>
    );
}
