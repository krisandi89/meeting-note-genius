import { useState, useEffect } from 'react';
import Header from './components/Header';
import RecorderPanel from './components/RecorderPanel';
import CopyToAIPanel from './components/CopyToAIPanel';
import HelpModal from './components/HelpModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTheme } from './hooks/useTheme';

// Simplified settings for offline mode
const DEFAULT_SETTINGS = {
  language: 'id-ID'
};

export default function App() {
  // Theme
  const { theme, cycleTheme } = useTheme();

  // Settings (simplified - only language)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('meeting_genius_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return { ...DEFAULT_SETTINGS, language: parsed.language || 'id-ID' };
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // UI State
  const [showHelp, setShowHelp] = useState(false);

  // Speech Recognition Hook
  const {
    isRecording,
    isPaused,
    transcript,
    currentInterim,
    isSupported,
    error: speechError,
    start,
    stop,
    pause,
    resume,
    addMark,
    clearTranscript,
    importTranscript
  } = useSpeechRecognition(settings.language);

  // Save transcript to localStorage when it changes
  useEffect(() => {
    if (transcript.length > 0) {
      localStorage.setItem('last_transcript', JSON.stringify({
        date: new Date().toISOString(),
        transcript
      }));
    }
  }, [transcript]);

  // Clear all data
  const handleClearAll = () => {
    clearTranscript();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Header */}
      <Header
        isRecording={isRecording}
        isPaused={isPaused}
        theme={theme}
        cycleTheme={cycleTheme}
        onHelpClick={() => setShowHelp(true)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {/* Left Column: Recorder */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 min-h-[500px]">
              <RecorderPanel
                isRecording={isRecording}
                isPaused={isPaused}
                transcript={transcript}
                currentInterim={currentInterim}
                isSupported={isSupported}
                error={speechError}
                onStart={start}
                onStop={stop}
                onPause={pause}
                onResume={resume}
                onAddMark={addMark}
                onClearTranscript={handleClearAll}
                onImportTranscript={importTranscript}
              />
            </div>
          </div>

          {/* Right Column: Copy to AI */}
          <div className="min-h-[500px]">
            <CopyToAIPanel transcript={transcript} />
          </div>
        </div>
      </main>
    </div>
  );
}
