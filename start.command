#!/bin/bash

# MeetingGenius Pro - Start Script
# Double-click this file to start the development server & Local AI

cd "$(dirname "$0")"

echo "🚀 Starting MeetingGenius Pro..."
echo ""

# Ensure Ollama local AI service is running
if command -v ollama >/dev/null 2>&1; then
    if ! curl -s http://localhost:11434/api/version >/dev/null 2>&1; then
        echo "💻 Starting Ollama Local AI service..."
        export OLLAMA_ORIGINS="*"
        launchctl setenv OLLAMA_ORIGINS "*" 2>/dev/null || true
        brew services start ollama 2>/dev/null || (ollama serve >/dev/null 2>&1 &)
        sleep 2
    else
        echo "✅ Ollama Local AI service is already running on port 11434."
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✨ Opening browser at http://localhost:5173"
echo ""

# Open browser after a short delay
(sleep 2 && open http://localhost:5173) &

# Start the dev server
npm run dev
