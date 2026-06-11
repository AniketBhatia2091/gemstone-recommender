/**
 * Vercel Serverless Function — Gemstone Recommendation API
 * POST /api/recommend
 *
 * Accepts astrological profile data and returns a personalized
 * Vedic gemstone recommendation via Google Gemini 1.5 Flash.
 *
 * Runtime: Node.js 18
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const TIMEOUT_MS = 10000;

/**
 * Constructs the Vedic astrology prompt for Gemini.
 * Duplicated from src/utils/buildPrompt.js because Vercel serverless
 * functions cannot import from the src/ directory.
 */
function buildPrompt({ rashi, lagna, currentIssue, dominantPlanet, dob }) {
  const rashiSanskrit = {
    Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna',
    Cancer: 'Karka', Leo: 'Simha', Virgo: 'Kanya',
    Libra: 'Tula', Scorpio: 'Vrishchika', Sagittarius: 'Dhanu',
    Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena',
  };

  const issueLabels = {
    career: 'Career & Success (Karma Kshetra)',
    health: 'Health & Vitality (Aarogya)',
    relationships: 'Relationships & Love (Prem/Vivah)',
    wealth: 'Wealth & Prosperity (Dhana Yoga)',
    mental_peace: 'Mental Peace & Clarity (Manah Shanti)',
    protection: 'Protection from Negative Energies (Raksha)',
    spiritual: 'Spiritual Growth & Moksha',
    education: 'Education & Intelligence (Vidya/Buddhi)',
  };

  const optionalContext = [];
  if (dominantPlanet) {
    optionalContext.push(`- Dominant Planet (Prabhu Graha): ${dominantPlanet}`);
  }
  if (dob) {
    optionalContext.push(`- Date of Birth (Janma Tithi): ${dob}`);
  }
  const optionalSection = optionalContext.length > 0
    ? `\n${optionalContext.join('\n')}`
    : '';

  return `You are a Vedic astrology gemstone consultant with 30 years of experience in the Parashari system of Jyotish. You recommend ONLY from the classical Navaratna system (the 9 sacred gemstones associated with the 9 Grahas). You follow Brihat Parashara Hora Shastra as your primary reference.

Your task is to recommend a single gemstone for the following individual based on their astrological profile.

## Client Profile
- Rashi (Moon Sign / Janma Rashi): ${rashi} (${rashiSanskrit[rashi] || rashi})
- Lagna (Ascendant / Udaya Lagna): ${lagna} (${rashiSanskrit[lagna] || lagna})
- Primary Concern (Iccha): ${issueLabels[currentIssue] || currentIssue}${optionalSection}

## Analysis Instructions
Before making your recommendation, you MUST perform the following analysis steps:

1. **Lagna Lord Analysis**: Identify the lord(s) of the client's Lagna. Determine which Grahas are natural benefics and natural malefics for this specific Lagna.
2. **Issue-Graha Mapping**: Identify which Graha most directly governs the stated concern. For example: career/authority → Surya/Shani; wealth → Guru/Budh; relationships → Shukra/Chandra; health → Surya/Mangal; mental peace → Chandra/Budh; protection → Rahu/Ketu; spiritual → Ketu/Guru; education → Budh/Guru.
3. **Cross-Reference**: Check if the recommended Graha's gemstone is classically safe for the client's Rashi AND Lagna. If the gemstone for the most relevant Graha is contraindicated for their Lagna, choose the next best option.
4. **Final Selection**: Recommend the gemstone that satisfies the maximum number of criteria (Lagna compatibility + Rashi compatibility + issue relevance).

## Confidence Score Rubric
Assign a confidence score based on the following:
- 90-100: Rashi + Lagna + issue all point to the same gemstone classically
- 70-89: Two of three criteria match strongly
- 50-69: One criterion matches, others are neutral
- Below 50: Conflicting signals — recommend with strong caution note

## Output Format
Return ONLY a valid JSON object. No markdown fences. No preamble. No explanation outside the JSON.

Use this exact schema:
{
  "gemstone": "string (English name)",
  "hindi_name": "string",
  "sanskrit_name": "string",
  "planet": "string (English planet name)",
  "graha": "string (Sanskrit name)",
  "reason": "string (2-3 sentences using Vedic terminology naturally, explaining why this gemstone suits the client)",
  "vedic_logic": "string (1 sentence explaining the classical Parashari rule applied)",
  "benefits": ["string", "string", "string", "string"] (exactly 4 items),
  "wearing_instructions": {
    "metal": "string",
    "finger": "string",
    "day": "string",
    "time": "string",
    "activation_ritual": "string (describe the Pran Pratishtha process)"
  },
  "mantra": "string (activation mantra)",
  "beej_mantra": "string",
  "caution": "string",
  "weight_ratti": "string (recommended weight range in ratti)",
  "upratna": "string (substitute gemstone name)",
  "upratna_note": "string (brief note on substitute effectiveness)",
  "confidence_score": number (0-100),
  "confidence_reasoning": "string (1 sentence explaining the score)"
}

## Few-Shot Example

**Input**: Rashi: Sagittarius (Dhanu), Lagna: Leo (Simha), Issue: Wealth & Prosperity

**Output**:
{
  "gemstone": "Yellow Sapphire",
  "hindi_name": "Pukhraj",
  "sanskrit_name": "Pushparaga",
  "planet": "Jupiter",
  "graha": "Guru",
  "reason": "For Simha Lagna, Guru (Jupiter) is the lord of the 5th house (Purva Punya) and 8th house, making it a strong benefic connected to fortune and hidden wealth. With Dhanu Rashi, Jupiter is the Rashi lord itself, creating a powerful alignment. Jupiter directly governs Dhana Yoga and is the natural karaka for wealth and prosperity.",
  "vedic_logic": "As per Parashari principles, the 5th lord is a natural benefic for any Lagna, and Jupiter as the Rashi lord in Dhanu further amplifies the recommendation for Pukhraj.",
  "benefits": [
    "Activates Dhana Yoga for wealth accumulation",
    "Enhances wisdom in financial decision-making",
    "Brings opportunities through mentors and teachers",
    "Strengthens the 5th house of Purva Punya (past-life merit)"
  ],
  "wearing_instructions": {
    "metal": "Gold",
    "finger": "Index finger of right hand",
    "day": "Thursday",
    "time": "Morning, during Guru Hora",
    "activation_ritual": "Perform Pran Pratishtha by washing the ring in raw milk, then Ganga jal. Place on a yellow cloth, light a ghee diya, offer yellow flowers, and chant the mantra 108 times. Wear during Guru Hora on a Thursday morning."
  },
  "mantra": "Om Graam Greem Graum Sah Gurave Namah",
  "beej_mantra": "Om Brim Brihaspataye Namah",
  "caution": "Yellow Sapphire is generally safe for Simha Lagna. However, if Jupiter is combust (within 11 degrees of Sun) or debilitated in Makara in the natal chart, consult an experienced Jyotish before wearing.",
  "weight_ratti": "3-5 ratti",
  "upratna": "Citrine (Sunela)",
  "upratna_note": "Citrine provides approximately 30-40% of Pukhraj's effects at a significantly lower cost — suitable for students or budget-conscious seekers.",
  "confidence_score": 92,
  "confidence_reasoning": "Rashi lord (Jupiter), Lagna benefic (5th lord Jupiter), and issue (wealth/Dhana) all converge on Jupiter's gemstone Pukhraj."
}

Now analyze the client profile above and provide your recommendation.`;
}

export default async function handler(req, res) {
  // CORS headers — set on every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Body parsing and validation
  const { rashi, lagna, currentIssue, dominantPlanet, dob } = req.body || {};

  if (!rashi || !lagna || !currentIssue) {
    return res.status(400).json({
      error: 'Missing required fields: rashi, lagna, currentIssue',
    });
  }

  // Build the prompt
  const prompt = buildPrompt({ rashi, lagna, currentIssue, dominantPlanet, dob });

  // Gemini API key check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    return res.status(502).json({
      error: 'AI service not configured',
      fallback: true,
    });
  }

  try {
    // Fetch with timeout using Promise.race
    const fetchPromise = fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)
    );

    const geminiResponse = await Promise.race([fetchPromise, timeoutPromise]);

    // Check Gemini response status
    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text().catch(() => 'Unknown error');
      console.error('Gemini API error:', geminiResponse.status, errorBody);
      return res.status(502).json({
        error: 'AI service unavailable',
        fallback: true,
      });
    }

    const geminiData = await geminiResponse.json();

    // Extract the text response
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Gemini returned empty response');
      return res.status(502).json({
        error: 'AI service returned empty response',
        fallback: true,
      });
    }

    // Parse the JSON response
    let recommendation;
    try {
      recommendation = JSON.parse(text);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', parseErr.message);
      return res.status(502).json({
        error: 'AI service returned invalid format',
        fallback: true,
      });
    }

    // Validate the parsed response
    if (!recommendation?.gemstone) {
      console.error('Gemini response missing gemstone field');
      return res.status(502).json({
        error: 'AI service returned incomplete data',
        fallback: true,
      });
    }

    // Add source tag and return
    recommendation.source = 'ai';
    return res.status(200).json(recommendation);

  } catch (err) {
    // Handle timeout specifically
    if (err.message === 'TIMEOUT') {
      console.error('Gemini API request timed out');
      return res.status(504).json({
        error: 'Request timeout',
        fallback: true,
      });
    }

    // Handle network errors
    console.error('Network error calling Gemini:', err.message);
    return res.status(502).json({
      error: 'AI service unavailable',
      fallback: true,
    });
  }
}
