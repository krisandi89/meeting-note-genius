# MeetingGenius Pro

AI-Powered Meeting Recording & Summarization App

![MeetingGenius Pro](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![Vite](https://img.shields.io/badge/Vite-5-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## Features

- 🎙️ **Live Transcription** - Real-time speech-to-text using Web Speech API
- ⏸️ **Pause/Resume** - Control recording flow without losing context
- 🔖 **Mark Moments** - Bookmark important discussion points with custom labels
- 📄 **PDF References** - Upload documents for AI context
- 🖼️ **Image Support** - Include images in multimodal AI analysis
- 🤖 **Gemini AI Summary** - Generate professional meeting notes
- 📋 **Notion/Docs Export** - Copy-paste friendly output formats
- 🌙 **Dark/Light Theme** - System preference detection

## Quick Start

### 1. Get API Key
Visit [Google AI Studio](https://aistudio.google.com/apikey) and create a free Gemini API key.

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173` (use Chrome or Edge for best results)

### 4. Configure
1. Click the ⚙️ Settings icon
2. Paste your Gemini API key
3. Click Save

### 5. Start Recording
1. Click "Mulai Rapat" to begin
2. Speak in Indonesian (default) or change language in settings
3. Use "Tandai" to mark important moments
4. Click "Stop" when finished
5. Click "Generate" to create AI summary

## Output Format

The AI generates structured meeting notes with:
- **Executive Summary** - Brief overview
- **Key Discussion Points** - Main topics covered
- **Decisions** - What was decided
- **Action Items** - Tasks with owner, due date, priority
- **Risks & Blockers** - Potential issues
- **Next Steps** - Follow-up actions
- **Open Questions** - Unresolved items

## Export Options

- **Copy JSON** - Raw structured data
- **Copy for Notion** - Markdown with tables
- **Copy for Google Docs** - Plain text format

## Privacy

- ❌ No audio recording or storage
- ✅ Transcript stays in browser memory
- ✅ API key stored in sessionStorage (cleared on browser close)
- ✅ Optional local storage for summaries only

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full support |
| Edge | ✅ Full support |
| Firefox | ⚠️ Limited (manual transcript import) |
| Safari | ⚠️ Limited (manual transcript import) |

## Tech Stack

- React 18 + Vite
- Tailwind CSS 4
- Lucide React Icons
- PDF.js for document extraction
- Google Gemini API

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## License

MIT
