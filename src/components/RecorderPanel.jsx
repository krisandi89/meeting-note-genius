import { useState, useRef, useEffect } from 'react';
import {
    Mic,
    Square,
    Pause,
    Play,
    Bookmark,
    Copy,
    Trash2,
    Download,
    FileText,
    AlertTriangle
} from 'lucide-react';
import SoundWave from './SoundWave';

export default function RecorderPanel({
    isRecording,
    isPaused,
    transcript,
    currentInterim,
    isSupported,
    error,
    onStart,
    onStop,
    onPause,
    onResume,
    onAddMark,
    onClearTranscript,
    onImportTranscript
}) {
    const [showMarkInput, setShowMarkInput] = useState(false);
    const [markLabel, setMarkLabel] = useState('');
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const transcriptEndRef = useRef(null);

    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript, currentInterim]);

    const handleAddMark = () => {
        if (markLabel.trim()) {
            onAddMark(markLabel.trim());
            setMarkLabel('');
            setShowMarkInput(false);
        }
    };

    const handleImport = () => {
        if (importText.trim()) {
            onImportTranscript(importText);
            setImportText('');
            setShowImport(false);
        }
    };

    const copyTranscript = () => {
        const text = transcript
            .map(item => {
                if (item.type === 'mark') return `\n--- MARK: ${item.label} --- [${item.time}]\n`;
                if (item.type === 'system') return `[${item.time}] ${item.text}`;
                return `[${item.time}] ${item.text}`;
            })
            .join('\n');
        navigator.clipboard.writeText(text);
    };

    const downloadTranscript = () => {
        const text = transcript
            .map(item => {
                if (item.type === 'mark') return `\n--- MARK: ${item.label} --- [${item.time}]\n`;
                return `[${item.time}] ${item.text}`;
            })
            .join('\n');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearAll = () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua transkrip?')) {
            onClearTranscript();
        }
    };

    return (
        <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--color-accent-primary)]" />
                    <h2 className="font-semibold text-[var(--color-text-primary)]">Transkrip Langsung</h2>
                    {isRecording && (
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold
                            ${isPaused
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-red-400 animate-recording'}`} />
                            {isPaused ? 'PAUSED' : 'REC'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={copyTranscript}
                        disabled={transcript.length === 0}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                       hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-tertiary)]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Salin Transkrip"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={downloadTranscript}
                        disabled={transcript.length === 0}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                       hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-bg-tertiary)]
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Download Transkrip"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClearAll}
                        disabled={transcript.length === 0}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                       hover:text-red-400 hover:bg-red-500/10
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Hapus Semua"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Browser Not Supported Warning */}
            {!isSupported && (
                <div className="mx-4 mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-400">Browser Tidak Didukung</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                Web Speech API tidak tersedia. Gunakan Chrome atau Edge, atau impor transkrip secara manual.
                            </p>
                            <button
                                onClick={() => setShowImport(true)}
                                className="mt-2 text-xs font-medium text-[var(--color-accent-primary)] hover:underline"
                            >
                                Impor Transkrip Manual →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transcript Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Recording Animation */}
                {isRecording && transcript.length === 0 && !currentInterim && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div className={`sound-wave-large ${isPaused ? 'paused' : ''}`}>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mt-4">
                            {isPaused ? 'Rekaman dijeda...' : 'Mendengarkan...'}
                        </p>
                    </div>
                )}

                {transcript.length === 0 && !isRecording && !showImport && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-4">
                            <Mic className="w-10 h-10 text-[var(--color-text-secondary)] opacity-40" />
                        </div>
                        <p className="text-[var(--color-text-secondary)]">
                            Tekan tombol Mulai untuk merekam meeting
                        </p>
                        {!isSupported && (
                            <button
                                onClick={() => setShowImport(true)}
                                className="mt-4 text-sm text-[var(--color-accent-primary)] hover:underline"
                            >
                                atau impor transkrip manual
                            </button>
                        )}
                    </div>
                )}

                {/* Import Modal */}
                {showImport && (
                    <div className="p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Impor Transkrip</h3>
                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Tempel transkrip meeting di sini..."
                            className="input-field h-40 resize-none"
                        />
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => setShowImport(false)} className="btn-secondary text-sm">
                                Batal
                            </button>
                            <button onClick={handleImport} className="btn-primary text-sm">
                                Impor
                            </button>
                        </div>
                    </div>
                )}

                {/* Transcript Items */}
                {transcript.map((item) => (
                    <div
                        key={item.id}
                        className={`animate-fade-in ${item.type === 'mark'
                            ? 'text-center py-2'
                            : item.type === 'system'
                                ? 'text-center py-1'
                                : 'flex gap-3'
                            }`}
                    >
                        {item.type === 'mark' ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20
                            text-[var(--color-accent-primary)]">
                                <Bookmark className="w-4 h-4" />
                                <span className="font-semibold text-sm">{item.label}</span>
                                <span className="text-xs opacity-60">{item.time}</span>
                            </div>
                        ) : item.type === 'system' ? (
                            <span className="text-xs text-[var(--color-text-secondary)] italic">
                                {item.text}
                            </span>
                        ) : (
                            <>
                                <span className="text-xs font-mono text-[var(--color-text-secondary)] shrink-0 pt-0.5 select-none">
                                    {item.time}
                                </span>
                                <p className="text-[var(--color-text-primary)] leading-relaxed">
                                    {item.text}
                                </p>
                            </>
                        )}
                    </div>
                ))}

                {/* Interim Result */}
                {currentInterim && (
                    <div className="flex gap-3 animate-pulse">
                        <span className="text-xs font-mono text-[var(--color-text-secondary)] shrink-0 pt-0.5">
                            ...
                        </span>
                        <p className="text-[var(--color-text-secondary)] italic">
                            {currentInterim}
                        </p>
                    </div>
                )}

                <div ref={transcriptEndRef} />
            </div>

            {/* Mark Input Modal */}
            {showMarkInput && (
                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={markLabel}
                            onChange={(e) => setMarkLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMark()}
                            placeholder="Nama penanda (contoh: Diskusi Budget)"
                            className="input-field flex-1"
                            autoFocus
                        />
                        <button onClick={handleAddMark} className="btn-primary">
                            Tambah
                        </button>
                        <button onClick={() => setShowMarkInput(false)} className="btn-secondary">
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="flex items-center justify-center gap-3">
                    {!isRecording ? (
                        <button
                            onClick={onStart}
                            disabled={!isSupported}
                            className="flex items-center gap-2 btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Mic className="w-5 h-5" />
                            Mulai Meeting
                        </button>
                    ) : (
                        <>
                            {isPaused ? (
                                <button
                                    onClick={onResume}
                                    className="flex items-center gap-2 btn-primary px-5 py-2.5"
                                >
                                    <Play className="w-5 h-5" />
                                    Lanjut
                                </button>
                            ) : (
                                <button
                                    onClick={onPause}
                                    className="flex items-center gap-2 btn-secondary px-5 py-2.5"
                                >
                                    <Pause className="w-5 h-5" />
                                    Jeda
                                </button>
                            )}

                            <button
                                onClick={() => setShowMarkInput(true)}
                                className="flex items-center gap-2 btn-secondary px-5 py-2.5"
                                title="Tandai Momen"
                            >
                                <Bookmark className="w-5 h-5" />
                                <span className="hidden sm:inline">Tandai</span>
                            </button>

                            <button
                                onClick={onStop}
                                className="flex items-center gap-2 btn-danger px-5 py-2.5"
                            >
                                <Square className="w-5 h-5 fill-current" />
                                Stop
                            </button>
                        </>
                    )}
                </div>

                {error && (
                    <p className="text-center text-sm text-red-400 mt-3">{error}</p>
                )}
            </div>
        </div>
    );
}
