#!/bin/bash

# MeetingGenius Pro - Start Script
# Double-click this file to start the development server

cd "$(dirname "$0")"

echo "🚀 Starting MeetingGenius Pro..."
echo ""

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
