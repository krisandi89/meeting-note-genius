import { Mic, HelpCircle, Settings, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SoundWave from './SoundWave';
import { SUPPORTED_LANGUAGES } from '../constants/schema';

export default function Header({
    isRecording,
    isPaused,
    theme,
    cycleTheme,
    onHelpClick,
    language,
    onLanguageChange,
    onSettingsClick,
    hasApiKey
}) {
    return (
        <header className="glass sticky top-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between gap-2">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="gradient-primary p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                    <Mic className="text-white w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        MeetingGenius Pro
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] hidden sm:block">
                        AI Meeting Transcriber & Notulen
                    </p>
                </div>
            </div>

            {/* Middle: Recording State Indicator */}
            {isRecording && (
                <div className="flex items-center gap-2">
                    <SoundWave isActive={isRecording} isPaused={isPaused} />
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                          ${isPaused
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        <span className={`w-2 h-2 rounded-full recording-pulse ${isPaused ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {isPaused ? 'PAUSED' : 'REC'}
                    </div>
                </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
                {/* Language Selector Dropdown */}
                <div className="relative flex items-center">
                    <div className="flex items-center gap-1.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)] transition-all">
                        <Globe className="w-3.5 h-3.5 text-[var(--color-accent-primary)] shrink-0" />
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            disabled={isRecording}
                            className="bg-transparent text-xs font-medium cursor-pointer focus:outline-none pr-1"
                            title="Pilih Bahasa Rapat"
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <option
                                    key={lang.code}
                                    value={lang.code}
                                    className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                                >
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Settings Button */}
                <button
                    onClick={onSettingsClick}
                    className="relative p-2 rounded-lg text-[var(--color-text-secondary)] 
                   hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]
                   transition-all"
                    title="Pengaturan Gemini AI"
                    aria-label="Pengaturan"
                >
                    <Settings className="w-5 h-5" />
                    {hasApiKey && (
                        <span
                            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[var(--color-bg-primary)]"
                            title="Gemini API Key Aktif"
                        />
                    )}
                </button>

                {/* Theme Toggle */}
                <ThemeToggle theme={theme} cycleTheme={cycleTheme} />

                {/* Help Button */}
                <button
                    onClick={onHelpClick}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] 
                   hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]
                   transition-all"
                    title="Panduan Penggunaan"
                    aria-label="Bantuan"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
