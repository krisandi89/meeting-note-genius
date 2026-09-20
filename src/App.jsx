import { useState, useEffect } from 'react';
import Header from './components/Header';
import RecorderPanel from './components/RecorderPanel';
import CopyToAIPanel from './components/CopyToAIPanel';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTheme } from './hooks/useTheme';
import { DEFAULT_SETTINGS } from './constants/schema';

export default function App() {
  // Theme
  const { theme, cycleTheme } = useTheme();

  // Settings (Language, Gemini API Key, Gemini Model)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('meeting_genius_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed
        };
      } catch {
        // Use defaults if corrupted
      }
    }
    return DEFAULT_SETTINGS;
  });

  // UI State
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  // Handle saving new settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('meeting_genius_settings', JSON.stringify(newSettings));
  };

  // Handle quick language switch from header
  const handleLanguageChange = (newLanguage) => {
    const updated = { ...settings, language: newLanguage };
    handleSaveSettings(updated);
  };

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
        language={settings.language}
        onLanguageChange={handleLanguageChange}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
        aiProvider={settings.aiProvider}
        ollamaModel={settings.ollamaModel}
        hasApiKey={Boolean(settings.geminiApiKey)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
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

          {/* Right Column: AI Notulen & Copy Panel */}
          <div className="min-h-[500px]">
            <CopyToAIPanel
              transcript={transcript}
              aiProvider={settings.aiProvider}
              apiKey={settings.geminiApiKey}
              geminiModel={settings.geminiModel}
              ollamaEndpoint={settings.ollamaEndpoint}
              ollamaModel={settings.ollamaModel}
              language={settings.language}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
