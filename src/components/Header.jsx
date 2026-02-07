import { Mic, HelpCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SoundWave from './SoundWave';

export default function Header({
    isRecording,
    isPaused,
    theme,
    cycleTheme,
    onHelpClick
}) {
    return (
        <header className="glass sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
                <div className="gradient-primary p-2.5 rounded-xl shadow-lg">
                    <Mic className="text-white w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        MeetingGenius
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] hidden sm:block">
                        Offline Meeting Transcriber
                    </p>
                </div>
            </div>

            {/* Recording State Indicator */}
            <div className="flex items-center gap-4">
                {isRecording && (
                    <div className="flex items-center gap-2">
                        <SoundWave isActive={isRecording} isPaused={isPaused} />
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
                              ${isPaused
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            <span className={`w-2.5 h-2.5 rounded-full recording-pulse ${isPaused ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            {isPaused ? 'PAUSED' : 'REC'}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <ThemeToggle theme={theme} cycleTheme={cycleTheme} />

                    <button
                        onClick={onHelpClick}
                        className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                       hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]
                       transition-all"
                        title="Bantuan"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
