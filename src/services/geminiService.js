/**
 * Google Gemini AI Studio API Service
 * Default: Gemini 2.5 Flash with fallback to Gemini 2.5 Flash Lite and 1.5 Flash.
 */

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Format transcript array to string for AI context
 */
export function formatTranscriptForAI(transcript) {
    if (!transcript || transcript.length === 0) return '';

    return transcript
        .map(item => {
            if (item.type === 'mark') return `\n[TANDA MOMEN PENTING: ${item.label}] [${item.time}]\n`;
            if (item.type === 'system') return `[SYSTEM: ${item.text}] [${item.time}]`;
            return `[${item.time}] ${item.text}`;
        })
        .join('\n');
}

/**
 * Test if a Gemini API key is valid
 */
export async function testGeminiApiKey(apiKey, model = 'gemini-2.5-flash') {
    if (!apiKey || !apiKey.trim()) {
        return { success: false, message: 'API Key tidak boleh kosong.' };
    }

    const testModels = [model || 'gemini-2.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
    const uniqueModels = [...new Set(testModels)];

    for (const m of uniqueModels) {
        try {
            const url = `${BASE_URL}/${m}:generateContent?key=${apiKey.trim()}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey.trim()
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Ping. Reply with: OK' }] }],
                    generationConfig: { maxOutputTokens: 10 }
                })
            });

            if (response.ok) {
                return { success: true, modelUsed: m, message: `Koneksi berhasil! Model aktif: ${m}` };
            }

            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || response.statusText;

            // Check if key itself is rejected
            if (response.status === 400 && errMsg.toLowerCase().includes('api key not valid')) {
                return { success: false, message: `API Key tidak valid: ${errMsg}` };
            }
            if (response.status === 403 || response.status === 401) {
                return { success: false, message: `API Key ditolak: ${errMsg}` };
            }

            // If 404 or model not found, continue to next model candidate
            if (response.status === 404 || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('not supported')) {
                continue;
            }

            return { success: false, message: `Error (${response.status}): ${errMsg}` };
        } catch {
            return { success: false, message: 'Gagal terhubung ke server Google AI. Periksa koneksi internet Anda.' };
        }
    }

    return { success: false, message: 'Tidak dapat menemukan model Gemini yang aktif dengan API Key ini.' };
}

/**
 * Generate comprehensive meeting notes from transcript using Gemini Flash
 */
export async function generateMeetingNotes({
    transcript,
    apiKey,
    model = 'gemini-2.5-flash',
    language = 'id-ID'
}) {
    if (!apiKey || !apiKey.trim()) {
        throw new Error('Gemini API Key belum diatur. Silakan masukkan API Key di menu Pengaturan (⚙️).');
    }

    const formattedTranscript = formatTranscriptForAI(transcript);
    if (!formattedTranscript || formattedTranscript.trim().length === 0) {
        throw new Error('Transkrip rapat masih kosong. Lakukan perekaman atau impor transkrip terlebih dahulu.');
    }

    const langInstruction = language === 'en-US'
        ? 'Tuliskan seluruh notulen dalam Bahasa Inggris profesional.'
        : 'Tuliskan seluruh notulen dalam Bahasa Indonesia formal dan profesional.';

    const systemPrompt = `Kamu adalah Asisten Notulen Rapat AI Senior yang sangat teliti, profesional, dan berorientasi pada tindakan (action-oriented).
Tugas utamamu adalah menganalisis transkrip rapat berikut dan menyusun Notulen Rapat Lengkap (Meeting Minutes) yang komprehensif, akurat, dan terstruktur rapi.

Panduan Output:
${langInstruction}
- Perhatikan tanda-tanda [TANDA MOMEN PENTING: ...] dalam transkrip sebagai fokus utama atau keputusan penting.
- Jangan mengarang informasi yang tidak ada di dalam transkrip. Jika nama PIC atau deadline tidak disebutkan, tulis "Belum ditentukan" atau "-".
- Gunakan format Markdown standar yang kompatibel dengan Notion, Obsidian, dan Google Docs.

Gunakan format struktur Markdown berikut:
# 📝 Notulen Rapat: [Buat judul rapat yang ringkas dan deskriptif berdasarkan konteks pembicaraan]
**📅 Tanggal:** ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
**⏱️ Durasi / Waktu:** Berdasarkan linimasa transkrip

---

## 📋 Ringkasan Eksekutif
[Tulis 2-3 paragraf ringkasan tingkat tinggi mengenai inti rapat, agenda utama, dan kesimpulan paling krusial]

---

## 💬 Poin-poin Diskusi Utama
[Jabarkan topik-topik diskusi utama secara terstruktur dengan sub-poin yang jelas dan mendalam]
- **[Topik 1]:** [Penjelasan inti pembahasan dan argumen yang muncul]
- **[Topik 2]:** [Penjelasan inti pembahasan]

---

## ✅ Keputusan yang Disepakati
[Daftar semua keputusan final, kebijakan, atau persetujuan yang disahkan selama rapat]
- [Keputusan 1]
- [Keputusan 2]

---

## 📌 Action Items & Tindak Lanjut
| No | Tugas / Action Item | PIC (Penanggung Jawab) | Batas Waktu (Deadline) | Prioritas | Status |
|---|---|---|---|---|---|
| 1 | [Deskripsi tugas jelas] | [Nama PIC / Tim] | [Batas Waktu] | 🔴 Tinggi / 🟡 Sedang / 🟢 Rendah | ⬜ Belum Mulai |

---

## ⚠️ Risiko & Hambatan (Risks & Blockers)
[Sebutkan risiko, kendala anggaran, teknis, atau potensi hambatan yang didiskusikan]
- [Risiko 1]

---

## 🔜 Pertanyaan Terbuka & Langkah Selanjutnya
[Pertanyaan yang belum terjawab atau hal yang perlu dijadwalkan pada pertemuan berikutnya]
1. [Langkah/Pertanyaan 1]
`;

    const userPrompt = `Berikut adalah transkrip rapat lengkap:\n\n---\n${formattedTranscript}\n---`;

    // Priority: target model (default gemini-2.5-flash), then lite, then legacy fallback
    const candidateModels = [
        model || 'gemini-2.5-flash',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-1.5-flash'
    ];
    const uniqueCandidates = [...new Set(candidateModels)];

    let lastError = null;

    for (const m of uniqueCandidates) {
        try {
            const url = `${BASE_URL}/${m}:generateContent?key=${apiKey.trim()}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey.trim()
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 8192
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData.error?.message || response.statusText;

                // If unauthorized or invalid key, fail fast
                if (response.status === 403 || response.status === 401 || (response.status === 400 && errMsg.toLowerCase().includes('api key not valid'))) {
                    throw new Error('Gemini API Key tidak valid. Silakan periksa kunci API Anda di Pengaturan.');
                }

                if (response.status === 429) {
                    throw new Error('Kuota permintaan Gemini API terlampaui (Rate limit). Mohon tunggu beberapa saat sebelum mencoba lagi.');
                }

                // If model not found or unsupported on this version, try next candidate
                if (response.status === 404 || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('not supported')) {
                    lastError = new Error(`Model ${m} tidak tersedia (${errMsg}). Mencoba model alternatif...`);
                    continue;
                }

                throw new Error(`Google AI Studio (${m}) Error [${response.status}]: ${errMsg}`);
            }

            const data = await response.json();
            const candidate = data.candidates?.[0];

            // Safely extract text parts, filtering out thoughts or empty parts
            const extractedText = candidate?.content?.parts
                ?.filter(part => !part.thought && typeof part.text === 'string')
                ?.map(part => part.text)
                ?.join('\n')
                || candidate?.content?.parts?.map(part => part.text).filter(Boolean).join('\n')
                || '';

            if (!extractedText.trim()) {
                throw new Error('Gemini tidak mengembalikan teks jawaban. Coba periksa kembali transkrip Anda.');
            }

            return {
                text: extractedText.trim(),
                modelUsed: m,
                generatedAt: new Date().toISOString()
            };
        } catch (err) {
            // Re-throw specific errors immediately
            if (
                err.message.includes('API Key tidak valid') ||
                err.message.includes('Kuota permintaan') ||
                err.message.includes('tidak mengembalikan teks')
            ) {
                throw err;
            }
            if (err.message && err.message.includes('Mencoba model alternatif')) {
                continue;
            }
            lastError = err;
        }
    }

    throw lastError || new Error('Gagal menghasilkan notulen dari Gemini API.');
}
