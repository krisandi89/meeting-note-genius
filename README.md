# MeetingGenius Pro v3.0

**AI-Powered Live Meeting Transcription & Instant Notes Generator (Hybrid: Gemini Flash & Ollama Local AI)**

![MeetingGenius Pro](https://img.shields.io/badge/Version-3.0.0-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Vite](https://img.shields.io/badge/Vite-7-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC) ![Ollama](https://img.shields.io/badge/Local_AI-Ollama_Qwen2.5-emerald) ![Gemini](https://img.shields.io/badge/Cloud_AI-Gemini_2.5_Flash-orange)

MeetingGenius Pro adalah aplikasi web modern untuk merekam, mentranskripsikan pembicaraan rapat secara *real-time*, dan langsung menghasilkan **Notulen Rapat Lengkap (Meeting Minutes)** terstruktur profesional. Aplikasi ini mendukung arsitektur **Hybrid Dual-Engine**:
1. 💻 **Ollama Local AI (MacBook M2)**: 100% offline, privat, tanpa internet, langsung diproses oleh chip Apple Silicon M2 Anda menggunakan model **Qwen 2.5 (3B)**.
2. 🌐 **Google Gemini 2.5 Flash (Cloud)**: Respons instan berbasis cloud dengan Google AI Studio API gratis.

---

## 🚀 Fitur Unggulan

- 🎙️ **Transkripsi Suara Real-time** - Web Speech API lokal dengan auto-reconnect, deteksi jeda, dan penanda momen (*bookmark*).
- 🌐 **Pemilih Bahasa Rapat Cepat** - Ganti bahasa rapat langsung dari Header (🇮🇩 Bahasa Indonesia `id-ID`, 🇺🇸 English `en-US`, atau 🌐 Bilingual `ID + EN`).
- 💻 **Ollama Local AI (MacBook M2)** - Jalankan notulen rapat secara offline dan 100% privat menggunakan model **Qwen 2.5 3B** (paling fasih Bahasa Indonesia untuk model ringkas).
- 🌐 **Google Gemini 2.5 Flash** - Buat notulen rapat instan via Google AI Studio API gratis.
- 🔄 **Pengganti Engine Fleksibel** - Pilih bebas antara mode Local M2 atau Cloud Gemini di menu Pengaturan (⚙️).
- 📋 **Dual Mode UI** - Tab otomatis (Gemini / Ollama) dan Tab salin manual (prompt siap tempel ke ChatGPT / Claude).
- 📥 **Ekspor Mudah** - Salin format Markdown siap pakai untuk Notion/Obsidian atau unduh langsung berkas `.md`.
- 🔒 **Privasi Mutlak** - Kunci API dan transkrip disimpan lokal di browser Anda (`localStorage`), tidak ada perantara backend server.
- 🌙 **Tema Gelap / Terang / Sistem** - Antarmuka modern *glassmorphism* yang responsif.
- 🍏 **Peluncur Otomatis macOS (`start.command`)** - Klik dua kali file `start.command` untuk langsung menjalankan service Ollama, server Vite, dan membuka browser otomatis.

---

## 📋 Format Notulen yang Dihasilkan

AI menyusun notulen secara mendalam dan terstruktur:
1. **Judul Rapat Spesifik & Tanggal Pelaksanaan**
2. **Ringkasan Eksekutif** (2-3 paragraf intisari rapat)
3. **Poin-poin Diskusi Utama** (Terinci dengan topik dan argumen)
4. **Keputusan yang Disepakati** (Kebijakan dan hasil final)
5. **Tabel Action Items** (No, Tugas, PIC / Penanggung Jawab, Deadline, Prioritas, Status)
6. **Risiko & Hambatan (Risks & Blockers)**
7. **Pertanyaan Terbuka & Langkah Selanjutnya**

---

## ⚡ Panduan Setup Ollama Local AI (MacBook M2)

Untuk menjalankan AI secara lokal di MacBook Anda:

### 1. Install & Jalankan Ollama
Ollama sudah terpasang di Mac melalui Homebrew:
```bash
# Jalankan service Ollama di latar belakang
brew services start ollama
```

### 2. Download Model Rekomendasi (Qwen 2.5 3B)
```bash
# Unduh model yang paling fasih Bahasa Indonesia (~2.0 GB)
ollama pull qwen2.5:3b
```

### 3. Izinkan Koneksi Web App (CORS)
Agar browser dan web app Vercel (`https://meeting-genius-seven.vercel.app/`) dapat memanggil Ollama di laptop Anda:
```bash
launchctl setenv OLLAMA_ORIGINS "*"
```

---

## ⚡ Panduan Setup Google Gemini Flash (Cloud)

1. Kunjungi [Google AI Studio (aistudio.google.com/apikey)](https://aistudio.google.com/apikey).
2. Buat API Key gratis.
3. Di web app, klik menu **⚙️ Pengaturan**, pilih **Google Gemini (Cloud)**, tempelkan API Key, lalu klik **Simpan Pengaturan**.

---

## 💻 Menjalankan Aplikasi Secara Lokal

Cukup **klik dua kali** file `start.command` di folder proyek ini (script ini otomatis menyalakan Ollama dan server web).

Atau via Terminal:
```bash
npm install
npm run dev
```

Buka peramban di `http://localhost:5173` (Gunakan **Google Chrome** atau **Microsoft Edge**).

---

## 🌐 Akses Online (Vercel)

Aplikasi juga dapat diakses langsung via web di:
👉 **[https://meeting-genius-seven.vercel.app/](https://meeting-genius-seven.vercel.app/)**

*Catatan: Saat menggunakan Ollama Local AI melalui web Vercel, pastikan Ollama di MacBook Anda sedang berjalan.*

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Local AI:** Ollama API (`qwen2.5:3b`) running on Apple Silicon Metal GPU
- **Cloud AI:** Google Gemini 2.5 Flash REST API
- **Speech Engine:** Web Speech API

---

## 📄 Lisensi

MIT License
