import OpenAI from 'openai'

// ── types ─────────────────────────────────────────────────────
export interface LandingPageCreative {
    type: 'image' | 'video'
    url: string
    alt?: string
}

export interface GeneratedLandingPage {
    slug: string
    template: 'landing' | 'article'
    headline: string
    subheadline: string
    meta_description: string
    cta_text: string
    sections: Array<{
        id: string
        order: number
        heading: string
        content: string
    }>
    references: Array<{ title: string; url: string }>
    related_searches: string[]
}

// ... existing code ...



export interface GenerateLandingPageInput {
    title: string
    keyword: string
    template: 'landing' | 'article'
    creatives: LandingPageCreative[]
}

// ── helpers ───────────────────────────────────────────────────
function toSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// ── AI generation ─────────────────────────────────────────────
export async function generateLandingPageContent(
    input: GenerateLandingPageInput
): Promise<GeneratedLandingPage> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.trim().length === 0) {
        throw new Error('OPENAI_API_KEY is missing. Add it to your environment and restart the server.')
    }

    const openai = new OpenAI({ apiKey })

    const creativesDescription = input.creatives.length
        ? input.creatives
            .map((c, i) => `  ${i + 1}. ${c.type.toUpperCase()} — ${c.url}${c.alt ? ` (${c.alt})` : ''}`)
            .join('\n')
        : '  No creatives provided — generate text-only layout.'

    const baseSlug = `lp-${toSlug(input.title)}`

    // ── PROMPT STRATEGY ───────────────────────────────────────
    let prompt = ''

    if (input.template === 'article') {
        // ARTICLE PROMPT (Information, Deep Dive, Professional)
        prompt = `You are a professional content writer and subject matter expert. Write like a human.
Create a comprehensive, deep-dive article that provides immense value to the reader.

TITLE: "${input.title}"
PRIMARY KEYWORD: "${input.keyword}"
CONTEXT:
- Tone: Professional, authoritative, educational, and human-like (avoid corporate fluff).
- Goal: To inform and educate the reader thoroughly.
- Style: Magazine-quality long-form content.

USER-PROVIDED ASSETS (Integrate naturally if relevant):
${creativesDescription}

STRICT REQUIREMENTS:

1. HEADLINE: A captivating, editorial-style headline.
2. SUBHEADLINE: An intriguing deck/summary (15-25 words).
3. META DESCRIPTION: SEO-optimized summary (120-160 chars).
4. CTA TEXT: A soft call-to-action (e.g., "Learn More", "Read Related").

5. SECTIONS (MUST BE 6):
   - Section 1: "Introduction" — Hook the reader, define the problem/topic (200-300 words).
   - Section 2-5: Deep dive into specific aspects of the topic. Use varied H2 headings. (approx 200-300 words each).
     - Include actionable advice, diverse perspectives, or technical details.
   - Section 6: "Conclusion" — Summarize key takeaways (150-200 words).

   * Content Rules:
   - Use markdown for formatting (**bold**, *italics*, lists).
   - Paragraphs should be varied in length (mix of short and long).
   - Write naturally.

6. REFERENCES & 7. RELATED SEARCHES:
   - Provide 3-5 high-quality references.
   - Provide 5-8 related search terms.

OUTPUT FORMAT:
Return STRICT JSON with keys: slug, headline, subheadline, meta_description, cta_text, sections[], references[], related_searches[].

Each sections[] item has: id, order, heading, content.
`
    } else {
        // STANDARD LANDING PAGE PROMPT (Hybrid Guide/Sales Structure)
        prompt = `You are an expert copywriter and product specialist.
Create a high-value, persuasive "Buying Guide" style landing page.
The goal is to educate the user to build trust, then sell the solution/product.

TITLE: "${input.title}"
PRIMARY KEYWORD: "${input.keyword}"
CONTEXT:
- Tone: Professional, authoritative, yet persuasive and energetic.
- Format: "Ultimate Guide" style but optimized for conversion.

USER-PROVIDED CREATIVES:
${creativesDescription}

STRICT REQUIREMENTS:

1. HEADLINE: A powerful, benefit-driven headline (e.g., "The Complete Guide to...").
2. SUBHEADLINE: Intriguing summary of what the reader will gain.
3. META DESCRIPTION: 120-160 chars.
4. CTA TEXT: High interaction (e.g., "Check Price", "See Best Options").

5. SECTIONS (MUST BE 5 - MATCHING USER SCREENSHOT STRUCTURE):
   - Section 1: "Introduction" — Define the topic, why it matters, and hook the reader. (approx 200 words)
   - Section 2: "Key Features of [Keyword]" — What are the critical features to look for? Educate while selling the benefits. (approx 250 words)
   - Section 3: "Top Brands/Options" — Discuss leading solutions or categories in this space. Build authority. (approx 250 words)
   - Section 4: "Key Considerations" — Practical buying advice, things to avoid, or "How to Choose". (approx 200 words)
   - Section 5: "Conclusion" — Final verdict and strong call to action. (approx 150 words)

   * Content Styling:
   - Use bolding for key terms.
   - Use short paragraphs for readability.
   - Maintain the Dark Theme aesthetic in writing style (premium, sleek).

6. REFERENCES & 7. RELATED SEARCHES:
   - Provide 3-5 credible sources.
   - Provide 5-8 related keywords.

OUTPUT FORMAT:
Return STRICT JSON with keys: slug, headline, subheadline, meta_description, cta_text, sections[], references[], related_searches[].

Each sections[] item has: id, order, heading, content.
`
    }

    // ── call OpenAI with retry + model fallback ─────────────────
    const models = ['gpt-4o', 'gpt-4-turbo', 'gpt-4']
    let rawText = ''
    let lastErr: unknown = null

    console.log(`[AI] Generating content for: "${input.title}" (Models: ${models.join(', ')})`)

    for (let attempt = 0; attempt < 4; attempt++) {
        const model = models[Math.min(attempt, models.length - 1)]
        try {
            console.log(`[AI] Attempt ${attempt + 1}: Using model ${model}`)
            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an expert content writer. Return only valid JSON without markdown code blocks or extra commentary.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 4096,
                response_format: { type: 'json_object' },
            })

            rawText = completion.choices[0]?.message?.content || '{}'
            console.log(`[AI] Generation successful with model ${model}`)
            lastErr = null
            break
        } catch (error: any) {
            console.warn(`[AI] Attempt ${attempt + 1} failed (${model}):`, error.message)
            lastErr = new Error(`OpenAI API error: ${error.message}`)
            if (error.status === 503 || error.status === 429 || error.code === 'rate_limit_exceeded') {
                const delayMs = Math.min(4000, 500 * Math.pow(2, attempt))
                await new Promise((r) => setTimeout(r, delayMs))
                continue
            }
            break
        }
    }

    if (lastErr) {
        console.error('[AI] All generation attempts failed', lastErr)
        throw lastErr
    }

    // ── parse response ──────────────────────────────────────────
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```/i, '').replace(/```\s*$/i, '')
    const firstBrace = rawText.indexOf('{')
    const lastBrace = rawText.lastIndexOf('}')
    const jsonCandidate =
        firstBrace !== -1 && lastBrace !== -1 ? rawText.slice(firstBrace, lastBrace + 1) : rawText

    let parsed: any
    try {
        parsed = JSON.parse(jsonCandidate)
    } catch {
        try {
            parsed = JSON.parse(rawText)
        } catch {
            parsed = {}
        }
    }

    // ── normalize output ────────────────────────────────────────
    const slug = toSlug(parsed.slug || baseSlug)
    const template = input.template || 'landing'
    const headline = String(parsed.headline || input.title).slice(0, 200)
    const subheadline = String(parsed.subheadline || '').slice(0, 300)
    const meta_description = String(parsed.meta_description || '').slice(0, 160)
    const cta_text = String(parsed.cta_text || 'Learn More').slice(0, 50)

    // Normalize references
    const references = Array.isArray(parsed.references)
        ? parsed.references.map((r: any) => ({
            title: String(r.title || 'Reference'),
            url: String(r.url || '#')
        }))
        : []

    // Normalize related searches
    const related_searches = Array.isArray(parsed.related_searches)
        ? parsed.related_searches.map(String)
        : []

    let sections = Array.isArray(parsed.sections) && parsed.sections.length
        ? parsed.sections.map((s: any, idx: number) => ({
            id: String(s.id || `section-${idx}`),
            order: Number(s.order ?? idx),
            heading: String(s.heading || s.header || `Section ${idx + 1}`),
            content: String(s.content || ''),
        }))
        : [
            {
                id: 'intro',
                order: 0,
                heading: 'Introduction',
                content: `Discover everything about ${input.title}.`,
            },
            {
                id: 'conclusion',
                order: 1,
                heading: 'Conclusion',
                content: `In summary, ${input.title} offers significant value.`,
            }
        ]

    // Sort by order
    sections.sort((a: { order: number }, b: { order: number }) => a.order - b.order)

    return { slug, template, headline, subheadline, meta_description, cta_text, sections, references, related_searches }
}
