# MeetingGenius Pro v2.5

**AI-Powered Live Meeting Transcription & Instant Notes Generator**

![MeetingGenius Pro](https://img.shields.io/badge/Version-2.5.0-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Vite](https://img.shields.io/badge/Vite-7-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC) ![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-orange)

MeetingGenius Pro adalah aplikasi web modern untuk merekam, mentranskripsikan pembicaraan rapat secara *real-time*, dan langsung menghasilkan **Notulen Rapat Lengkap (Meeting Minutes)** terstruktur profesional menggunakan model kecerdasan buatan terbaru **Google Gemini 2.5 Flash** (dengan API gratis dari Google AI Studio).

---

## 🚀 Fitur Utama

- 🎙️ **Transkripsi Suara Real-time** - Pengenalan suara langsung menggunakan Web Speech API dengan auto-reconnect dan deteksi suara terus-menerus.
- 🌐 **Pemilih Bahasa Rapat Cepat** - Ganti bahasa rapat langsung dari Header (🇮🇩 Bahasa Indonesia `id-ID`, 🇺🇸 English `en-US`, atau 🌐 Bilingual `ID + EN`).
- ⏸️ **Jeda & Lanjutkan (Pause/Resume)** - Kontrol rekaman rapat tanpa kehilangan konteks transkrip.
- 🔖 **Penanda Momen (Bookmark)** - Beri tanda pada momen krusial (misal: *"Diskusi Anggaran"*, *"Keputusan Direksi"*), yang otomatis dijadikan fokus prioritas oleh AI.
- ⚡ **Notulen Langsung dengan Gemini 2.5 Flash** - Buat notulen rapat komprehensif langsung di dalam aplikasi dalam hitungan detik tanpa perlu membuka aplikasi lain.
- 📋 **Dual Mode (Otomatis & Salin Manual)** - Tersedia tab **Gemini Flash** (otomatis via API) serta tab **Salin Manual** (prompt siap pakai untuk ChatGPT / Claude).
- 📥 **Ekspor & Unduh Mudah** - Salin format Markdown siap pakai untuk Notion/Obsidian atau unduh langsung sebagai file `.md` dan `.txt`.
- 🔒 **Privasi Terjamin & 100% Client-Side** - Kunci API dan transkrip disimpan lokal di memori peramban Anda (`localStorage`), tidak ada perantara backend server.
- 🌙 **Tema Gelap / Terang / Sistem** - Antarmuka modern *glassmorphism* yang nyaman di mata dengan pendeteksi otomatis preferensi OS.
- 🍏 **Peluncur Cepat macOS (`start.command`)** - Cukup klik dua kali file `start.command` untuk langsung menjalankan server dan membuka peramban otomatis.

---

## 📋 Struktur Notulen yang Dihasilkan

AI menyusun notulen rapat secara mendalam dengan format Markdown profesional:
1. **Judul Rapat Spesifik & Tanggal Pelaksanaan**
2. **Ringkasan Eksekutif** (2-3 paragraf intisari rapat)
3. **Poin-poin Diskusi Utama** (Terinci dengan topik dan argumen)
4. **Keputusan yang Disepakati** (Kebijakan dan hasil final)
5. **Tabel Action Items** (No, Tugas, PIC / Penanggung Jawab, Deadline, Prioritas, Status)
6. **Risiko & Hambatan (Risks & Blockers)**
7. **Pertanyaan Terbuka & Langkah Selanjutnya**

---

## ⚡ Panduan Cepat (Quick Start)

### 1. Dapatkan Gemini API Key Gratis
1. Kunjungi [Google AI Studio (aistudio.google.com/apikey)](https://aistudio.google.com/apikey).
2. Buat API Key gratis (Free Tier).
3. Salin API Key Anda.

### 2. Jalankan Aplikasi
Di macOS:
- Cukup **klik dua kali** file `start.command` di folder proyek ini.

Atau melalui Terminal:
```bash
# Pasang dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka peramban di `http://localhost:5173` (Gunakan **Google Chrome** atau **Microsoft Edge** untuk performa Web Speech API terbaik).

### 3. Masukkan API Key di Aplikasi
1. Klik tombol **⚙️ Pengaturan** di bagian kanan atas (Header).
2. Tempelkan Google Gemini API Key Anda.
3. Klik **"Tes Koneksi Kunci"** untuk memastikan API aktif.
4. Klik **"Simpan Pengaturan"**.

### 4. Mulai Rapat & Generate Notulen
1. Pilih bahasa rapat di Header (`🇮🇩 ID` atau `🇺🇸 EN`).
2. Klik tombol **"Mulai Meeting"** dan izinkan akses mikrofon.
3. Gunakan tombol **"Tandai"** jika ada keputusan atau topik penting.
4. Klik **"Stop"** setelah rapat selesai.
5. Di panel kanan, klik **"✨ Buat Notulen (Gemini Flash 2.5)"**.
6. Notulen akan langsung tersusun rapi! Anda bisa klik **"Salin Notulen (.md)"** atau **"Unduh File .md"**.

---

## 🌐 Kompatibilitas Peramban (Browser Support)

| Peramban | Status Web Speech API | Rekomendasi |
|---|---|---|
| **Google Chrome** | ✅ Mendukung Penuh | ⭐️ Sangat Direkomendasikan |
| **Microsoft Edge** | ✅ Mendukung Penuh | ⭐️ Sangat Direkomendasikan |
| **Brave / Opera** | ✅ Mendukung (Chromium) | Direkomendasikan |
| **Mozilla Firefox** | ⚠️ Terbatas | Gunakan fitur "Impor Transkrip Manual" |
| **Apple Safari** | ⚠️ Terbatas | Gunakan fitur "Impor Transkrip Manual" |

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`) + Custom Glassmorphism CSS
- **Icons:** Lucide React
- **AI Engine:** Google Gemini 2.5 Flash REST API (Direct client-to-API via Google AI Studio)
- **Speech Engine:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)

---

## 📜 Skrip Proyek

```bash
# Menjalankan dev server
npm run dev

# Memeriksa kualitas kode & ESLint (0 errors)
npm run lint

# Membangun versi produksi
npm run build

# Meninjau build produksi lokal
npm run preview
```

---

## 📄 Lisensi

MIT License
