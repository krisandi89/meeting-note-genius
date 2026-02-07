/**
 * Custom hook for Web Speech API with auto-restart, pause/resume, and mark functionality
 * Supports bilingual mode (Indonesian + English) with language alternation
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// Bilingual languages to alternate between
const BILINGUAL_LANGUAGES = ['id-ID', 'en-US'];

export function useSpeechRecognition(language = 'bilingual') {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [currentInterim, setCurrentInterim] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const [error, setError] = useState('');

    const recognitionRef = useRef(null);
    const shouldRecordRef = useRef(false);
    const pausedAtRef = useRef(null);
    const startTimeRef = useRef(null);
    const pauseDurationRef = useRef(0);
    const languageIndexRef = useRef(0); // For bilingual alternation
    const noSpeechCountRef = useRef(0); // Track consecutive no-speech events

    // Get current language for recognition
    const getCurrentLanguage = useCallback(() => {
        if (language === 'bilingual') {
            return BILINGUAL_LANGUAGES[languageIndexRef.current % BILINGUAL_LANGUAGES.length];
        }
        return language;
    }, [language]);

    // Alternate to next language (for bilingual mode)
    const alternateLanguage = useCallback(() => {
        if (language === 'bilingual') {
            languageIndexRef.current = (languageIndexRef.current + 1) % BILINGUAL_LANGUAGES.length;
        }
    }, [language]);

    // Check browser support
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
            setError('Browser Anda tidak mendukung fitur Speech-to-Text. Gunakan Google Chrome atau Edge.');
        }

        return () => {
            shouldRecordRef.current = false;
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, []);

    // Get current timestamp accounting for pause duration
    const getCurrentTime = useCallback(() => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, []);

    // Initialize recognition with current language
    const initRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        const currentLang = getCurrentLanguage();
        recognition.lang = currentLang;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            noSpeechCountRef.current = 0; // Reset no-speech counter on successful result

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const text = event.results[i][0].transcript;
                    const confidence = event.results[i][0].confidence;

                    // If confidence is low and bilingual mode, try alternating language
                    if (language === 'bilingual' && confidence < 0.5) {
                        alternateLanguage();
                    }

                    setTranscript(prev => [...prev, {
                        id: Date.now(),
                        time: getCurrentTime(),
                        text: text,
                        type: 'speech'
                    }]);
                    setCurrentInterim('');
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setCurrentInterim(interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Akses mikrofon ditolak. Mohon izinkan browser mengakses mikrofon Anda.');
                shouldRecordRef.current = false;
                setIsRecording(false);
                setIsPaused(false);
            } else if (event.error === 'network') {
                setError('Koneksi internet bermasalah. Periksa koneksi Anda.');
            } else if (event.error === 'no-speech') {
                // In bilingual mode, alternate language after consecutive no-speech
                noSpeechCountRef.current++;
                if (language === 'bilingual' && noSpeechCountRef.current >= 2) {
                    alternateLanguage();
                    noSpeechCountRef.current = 0;
                }
            }
            // For 'no-speech' or other errors, let onend handle restart
        };

        recognition.onend = () => {
            // AUTO-RESTART LOGIC: If user intends to record (didn't press stop), restart
            if (shouldRecordRef.current && !isPaused) {
                try {
                    setTimeout(() => {
                        if (shouldRecordRef.current) {
                            // Create new recognition with possibly alternated language
                            const newRecognition = initRecognition();
                            recognitionRef.current = newRecognition;
                            newRecognition.start();
                        }
                    }, 100);
                } catch (e) {
                    console.log("Attempting to restart recognition...");
                }
            } else if (!shouldRecordRef.current) {
                setIsRecording(false);
            }
        };

        return recognition;
    }, [language, getCurrentLanguage, alternateLanguage, getCurrentTime, isPaused]);

    // Start recording
    const start = useCallback(() => {
        setError('');

        if (!isSupported) {
            setError('Speech recognition tidak didukung di browser ini.');
            return;
        }

        shouldRecordRef.current = true;
        setIsRecording(true);
        setIsPaused(false);
        startTimeRef.current = Date.now();
        pauseDurationRef.current = 0;

        const recognition = initRecognition();
        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (e) {
            setError('Gagal memulai rekaman: ' + e.message);
            setIsRecording(false);
            shouldRecordRef.current = false;
        }
    }, [isSupported, initRecognition]);

    // Stop recording completely
    const stop = useCallback(() => {
        shouldRecordRef.current = false;
        setIsRecording(false);
        setIsPaused(false);
        setCurrentInterim('');

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }
    }, []);

    // Pause recording (stops recognition but keeps state)
    const pause = useCallback(() => {
        if (!isRecording || isPaused) return;

        setIsPaused(true);
        pausedAtRef.current = Date.now();

        if (recognitionRef.current) {
            // Temporarily set shouldRecordRef to false to prevent auto-restart
            shouldRecordRef.current = false;
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }

        // Add a pause marker to transcript
        setTranscript(prev => [...prev, {
            id: Date.now(),
            time: getCurrentTime(),
            text: '⏸️ Rekaman dijeda',
            type: 'system'
        }]);
    }, [isRecording, isPaused, getCurrentTime]);

    // Resume recording
    const resume = useCallback(() => {
        if (!isPaused) return;

        // Calculate pause duration
        if (pausedAtRef.current) {
            pauseDurationRef.current += Date.now() - pausedAtRef.current;
            pausedAtRef.current = null;
        }

        setIsPaused(false);
        shouldRecordRef.current = true;

        // Add resume marker
        setTranscript(prev => [...prev, {
            id: Date.now(),
            time: getCurrentTime(),
            text: '▶️ Rekaman dilanjutkan',
            type: 'system'
        }]);

        // Restart recognition
        const recognition = initRecognition();
        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (e) {
            setError('Gagal melanjutkan rekaman: ' + e.message);
        }
    }, [isPaused, getCurrentTime, initRecognition]);

    // Add a mark/bookmark to the transcript
    const addMark = useCallback((label = 'Penanda') => {
        setTranscript(prev => [...prev, {
            id: Date.now(),
            time: getCurrentTime(),
            label: label,
            type: 'mark'
        }]);
    }, [getCurrentTime]);

    // Clear transcript
    const clearTranscript = useCallback(() => {
        setTranscript([]);
        setCurrentInterim('');
    }, []);

    // Import transcript from text
    const importTranscript = useCallback((text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const imported = lines.map((line, i) => ({
            id: Date.now() + i,
            time: '--:--',
            text: line.trim(),
            type: 'imported'
        }));
        setTranscript(imported);
    }, []);

    return {
        isRecording,
        isPaused,
        transcript,
        currentInterim,
        isSupported,
        error,
        start,
        stop,
        pause,
        resume,
        addMark,
        clearTranscript,
        importTranscript,
        setError
    };
}
