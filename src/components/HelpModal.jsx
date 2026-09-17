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
                                    <p className="font-medium">Pilih Bahasa & Mulai Merekam</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Pilih bahasa di Header (🇮🇩 ID, 🇺🇸 EN, atau 🌐 Bilingual), klik "Mulai Meeting", dan transkripsi suara akan berjalan real-time.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">2</span>
                                <div>
                                    <p className="font-medium">Tandai Momen Penting</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Gunakan tombol "Tandai" untuk menandai bagian penting seperti keputusan, action items, atau kendala diskusi.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">3</span>
                                <div>
                                    <p className="font-medium">Buat Notulen dengan Gemini Flash 2.5</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Klik tombol "Buat Notulen (Gemini Flash 2.5)" di panel kanan. Notulen lengkap terstruktur akan langsung muncul dalam hitungan detik.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white text-xs font-bold shrink-0">4</span>
                                <div>
                                    <p className="font-medium">Salin atau Unduh Notulen</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Salin hasil notulen dalam format Markdown untuk Notion/Obsidian, atau unduh sebagai berkas <code>.md</code>. Anda juga bisa beralih ke tab "Salin Manual" jika ingin mem-paste ke ChatGPT atau Claude.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </section>

                    {/* Features */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Fitur Unggulan
                        </h3>
                        <div className="grid gap-3">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Mic className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Transkripsi Suara Real-time</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Mendukung Web Speech API dengan auto-restart, jeda (pause/resume), dan multi-bahasa.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Bookmark className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Penanda Momen Cerdas</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Tandai topik penting agar diprioritaskan oleh AI dalam penyusunan keputusan dan action items.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <ExternalLink className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Gemini 2.5 Flash Bawaan</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Menghasilkan notulen otomatis langsung dalam web app menggunakan API gratis dari Google AI Studio.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                                <Copy className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Dual-Mode: Langsung & Salin Manual</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Bebas pilih membuat notulen langsung via Gemini API atau menyalin prompt transkrip ke ChatGPT / Claude.
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
                                <li>✓ <strong>Privasi Kunci API</strong> - Gemini API Key disimpan secara lokal di browser Anda (LocalStorage).</li>
                                <li>✓ <strong>Tidak ada audio yang disimpan ke server</strong> - hanya teks transkrip lokal di memori browser.</li>
                                <li>✓ <strong>Koneksi Langsung ke Google AI</strong> - permintaan AI dikirim langsung dari browser Anda ke Google AI Studio tanpa perantara server ketiga.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Tips */}
                    <section>
                        <h3 className="text-sm font-bold text-[var(--color-accent-primary)] uppercase tracking-wide mb-3">
                            Tips Penggunaan
                        </h3>
                        <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                            <li>💡 Gunakan browser Google Chrome atau Microsoft Edge untuk akurasi pengenalan suara terbaik.</li>
                            <li>💡 Jika belum memiliki Gemini API Key, buka menu Pengaturan (⚙️) dan klik "Dapatkan Kunci Gratis" di Google AI Studio.</li>
                            <li>💡 Bila transkrip sangat panjang, Gemini Flash 2.5 memiliki konteks token besar sehingga mampu merangkum rapat berdurasi panjang.</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--color-border)] text-center">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        MeetingGenius Pro v2.5 • AI Meeting Transcriber & Notulen
                    </p>
                </div>
            </div>
        </div>
    );
}
