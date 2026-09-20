/**
 * Ollama Local AI Service
 * Connects directly to local Ollama instance running on MacBook (http://localhost:11434)
 */

import { formatTranscriptForAI } from './geminiService';

const DEFAULT_ENDPOINT = 'http://localhost:11434';

/**
 * Test if local Ollama server is reachable and fetch available models
 */
export async function testOllamaConnection(endpoint = DEFAULT_ENDPOINT) {
    const cleanEndpoint = endpoint.replace(/\/+$/, '');
    try {
        const response = await fetch(`${cleanEndpoint}/api/tags`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            return {
                success: false,
                models: [],
                message: `Ollama merespons dengan status error (${response.status}): ${response.statusText}`
            };
        }

        const data = await response.json();
        const models = Array.isArray(data.models) ? data.models.map(m => m.name) : [];

        return {
            success: true,
            models,
            message: models.length > 0
                ? `Terhubung ke Ollama! Ditemukan ${models.length} model lokal (${models.slice(0, 3).join(', ')}${models.length > 3 ? '...' : ''}).`
                : 'Terhubung ke Ollama, namun belum ada model yang terinstal.'
        };
    } catch {
        return {
            success: false,
            models: [],
            message: 'Tidak dapat terhubung ke Ollama di ' + cleanEndpoint + '. Pastikan Ollama sudah dijalankan di MacBook.'
        };
    }
}

/**
 * Generate meeting notes using local Ollama model (e.g. Qwen 2.5 3B)
 */
export async function generateMeetingNotesLocal({
    transcript,
    endpoint = DEFAULT_ENDPOINT,
    model = 'qwen2.5:3b',
    language = 'id-ID'
}) {
    const cleanEndpoint = endpoint.replace(/\/+$/, '');
    const formattedTranscript = formatTranscriptForAI(transcript);

    if (!formattedTranscript || formattedTranscript.trim().length === 0) {
        throw new Error('Transkrip rapat masih kosong. Lakukan perekaman terlebih dahulu.');
    }

    const langInstruction = language === 'en-US'
        ? 'Tuliskan seluruh notulen dalam Bahasa Inggris profesional.'
        : 'Tuliskan seluruh notulen dalam Bahasa Indonesia formal dan profesional.';

    const systemPrompt = `Kamu adalah Asisten Notulen Rapat AI Senior yang sangat teliti, profesional, dan berorientasi pada tindakan.
Tugas utamamu adalah menganalisis transkrip rapat berikut dan menyusun Notulen Rapat Lengkap (Meeting Minutes) yang komprehensif, akurat, dan terstruktur rapi.

Panduan Output:
${langInstruction}
- Perhatikan tanda-tanda [TANDA MOMEN PENTING: ...] dalam transkrip sebagai fokus utama atau keputusan penting.
- Jangan mengarang informasi yang tidak ada di dalam transkrip. Jika nama PIC atau deadline tidak disebutkan, tulis "Belum ditentukan" atau "-".
- Gunakan format Markdown standar yang rapi.

Format yang wajib kamu ikuti:
# 📝 Notulen Rapat: [Judul Rapat Spesifik Sesuai Konteks]
**📅 Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**⏱️ Durasi / Waktu:** Berdasarkan linimasa transkrip

---

## 📋 Ringkasan Eksekutif
[Tulis 2-3 paragraf ringkasan tingkat tinggi mengenai inti rapat, agenda utama, dan kesimpulan paling krusial]

---

## 💬 Poin-poin Diskusi Utama
- **[Topik 1]:** [Penjelasan inti pembahasan dan argumen yang muncul]
- **[Topik 2]:** [Penjelasan inti pembahasan]

---

## ✅ Keputusan yang Disepakati
- [Keputusan 1]
- [Keputusan 2]

---

## 📌 Action Items & Tindak Lanjut
| No | Tugas / Action Item | PIC (Penanggung Jawab) | Batas Waktu (Deadline) | Prioritas | Status |
|---|---|---|---|---|---|
| 1 | [Deskripsi tugas jelas] | [Nama PIC / Tim] | [Batas Waktu] | 🔴 Tinggi / 🟡 Sedang / 🟢 Rendah | ⬜ Belum Mulai |

---

## ⚠️ Risiko & Hambatan (Risks & Blockers)
- [Risiko / Hambatan jika ada]

---

## 🔜 Pertanyaan Terbuka & Langkah Selanjutnya
1. [Langkah atau pertanyaan selanjutnya]
`;

    const fullPrompt = `${systemPrompt}\n\nBerikut adalah transkrip rapat lengkap:\n---\n${formattedTranscript}\n---`;

    try {
        const response = await fetch(`${cleanEndpoint}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.2,
                    num_ctx: 8192
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error || response.statusText;

            if (response.status === 404) {
                throw new Error(`Model '${model}' belum terunduh di Ollama laptop Anda. Jalankan perintah: 'ollama pull ${model}' di Terminal.`);
            }

            throw new Error(`Ollama Error (${response.status}): ${errMsg}`);
        }

        const data = await response.json();
        const outputText = data.response;

        if (!outputText || !outputText.trim()) {
            throw new Error('Ollama tidak mengembalikan teks jawaban. Coba periksa kembali transkrip Anda.');
        }

        return {
            text: outputText.trim(),
            modelUsed: `${model} (Local MacBook M2)`,
            generatedAt: new Date().toISOString()
        };
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
            throw new Error(
                `Gagal terhubung ke Ollama di ${cleanEndpoint}. Pastikan Ollama sedang berjalan di MacBook Anda dan izin CORS diatur (launchctl setenv OLLAMA_ORIGINS "*").`
            );
        }
        throw err;
    }
}
