/**
 * Robust JSON parser with cleanup for Gemini responses
 */

// Attempt to extract JSON from text that might have markdown fences or extra text
export function cleanJsonString(text) {
    if (!text) return text;

    let cleaned = text.trim();

    // Remove markdown code fences
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');

    // Try to find JSON object in the text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }

    return cleaned;
}

// Parse JSON with multiple fallback strategies
export function parseJsonSafely(text) {
    if (!text) {
        return { success: false, error: "Empty response", data: null };
    }

    // Strategy 1: Direct parse
    try {
        const data = JSON.parse(text);
        return { success: true, data, error: null };
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 2: Clean and parse
    try {
        const cleaned = cleanJsonString(text);
        const data = JSON.parse(cleaned);
        return { success: true, data, error: null };
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 3: Try to fix common issues
    try {
        let fixed = cleanJsonString(text);
        // Fix trailing commas
        fixed = fixed.replace(/,\s*}/g, '}');
        fixed = fixed.replace(/,\s*]/g, ']');
        // Fix unquoted keys
        fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

        const data = JSON.parse(fixed);
        return { success: true, data, error: null };
    } catch (e) {
        return {
            success: false,
            error: `Failed to parse JSON: ${e.message}`,
            data: null,
            rawText: text
        };
    }
}

// Validate parsed data against expected schema
export function validateMeetingSummary(data) {
    const requiredFields = [
        'executive_summary',
        'key_points',
        'action_items'
    ];

    const missingFields = requiredFields.filter(field => !(field in data));

    if (missingFields.length > 0) {
        return {
            valid: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
        };
    }

    // Ensure arrays are arrays
    const arrayFields = ['key_points', 'decisions', 'action_items', 'risks_blockers', 'next_steps', 'open_questions'];
    for (const field of arrayFields) {
        if (data[field] && !Array.isArray(data[field])) {
            data[field] = [data[field]];
        }
        if (!data[field]) {
            data[field] = [];
        }
    }

    // Ensure meta exists
    if (!data.meta) {
        data.meta = {
            meeting_title: "",
            date: new Date().toLocaleDateString('id-ID'),
            participants: [],
            language: "id",
            tags: []
        };
    }

    return { valid: true, data };
}
