import gemstones from '../data/gemstones.json';

/**
 * Returns a fallback gemstone recommendation using local data
 * when the AI service is unavailable.
 *
 * Priority logic:
 * 1. Find gemstones where rashi_recommended includes user's rashi
 * 2. Among those, prefer ones where lagna_recommended includes their lagna
 * 3. Among those, prefer ones where issues_addressed semantically matches currentIssue
 * 4. If no match, return Yellow Sapphire (universal benefic)
 *
 * @param {Object} params
 * @param {string} params.rashi - User's Moon sign
 * @param {string} params.lagna - User's Ascendant sign
 * @param {string} params.currentIssue - Life area of concern
 * @returns {Object} Recommendation matching the AI response schema
 */
export function getFallback({ rashi, lagna, currentIssue }) {
  const issueKeywords = {
    career: ['career', 'leadership', 'authority', 'recognition', 'stagnation'],
    health: ['health', 'vitality', 'energy', 'stamina', 'physical', 'blood', 'immune'],
    relationships: ['relationship', 'love', 'marriage', 'marital', 'romantic', 'partner', 'charm'],
    wealth: ['wealth', 'prosperity', 'financial', 'money', 'fortune', 'business'],
    mental_peace: ['mental', 'peace', 'anxiety', 'sleep', 'calm', 'emotional', 'clarity', 'mind'],
    protection: ['protection', 'evil', 'negative', 'hidden', 'enemies', 'sudden'],
    spiritual: ['spiritual', 'moksha', 'meditation', 'sadhana', 'intuition', 'psychic'],
    education: ['education', 'intelligence', 'learning', 'analytical', 'communication', 'intellect'],
  };

  const keywords = issueKeywords[currentIssue] || [currentIssue];

  // Step 1: Filter by rashi compatibility
  let candidates = gemstones.filter(
    (g) => g.rashi_recommended.includes(rashi)
  );

  // Step 2: Prefer lagna compatibility
  const lagnaMatches = candidates.filter(
    (g) => g.lagna_recommended.includes(lagna)
  );
  if (lagnaMatches.length > 0) {
    candidates = lagnaMatches;
  }

  // Step 3: Prefer issue match
  const issueMatches = candidates.filter((g) =>
    g.issues_addressed.some((issue) =>
      keywords.some((kw) => issue.toLowerCase().includes(kw))
    )
  );
  if (issueMatches.length > 0) {
    candidates = issueMatches;
  }

  // Step 4: Default to Yellow Sapphire if no candidates
  const selected =
    candidates.length > 0
      ? candidates[0]
      : gemstones.find((g) => g.id === 'yellow-sapphire') || gemstones[4];

  return mapToResponseSchema(selected);
}

/**
 * Maps a gemstone data entry to the AI response schema format
 * @param {Object} gem - Gemstone from gemstones.json
 * @returns {Object} Formatted response
 */
function mapToResponseSchema(gem) {
  return {
    gemstone: gem.name,
    hindi_name: gem.hindi_name,
    sanskrit_name: gem.sanskrit_name,
    planet: gem.planet,
    graha: gem.graha,
    reason: `Based on classical Vedic astrology, ${gem.name} (${gem.hindi_name}) is the sacred gemstone of ${gem.graha} (${gem.planet}). ${gem.graha_quality}`,
    vedic_logic: `As per Parashari principles, ${gem.name} strengthens ${gem.graha} — ${gem.dosha_addressed.slice(0, 2).join(' and ')} are the primary indications for this gemstone.`,
    benefits: gem.benefits.slice(0, 4),
    wearing_instructions: {
      metal: gem.wearing_metal,
      finger: gem.wearing_finger,
      day: gem.wearing_day,
      time: gem.wearing_time,
      activation_ritual: `Perform Pran Pratishtha: wash the ${gem.wearing_metal.toLowerCase()} ring in raw milk, then Ganga jal. Place on a clean cloth, light a ghee diya, and chant the mantra 108 times. Wear on ${gem.wearing_day} during ${gem.wearing_time}.`,
    },
    mantra: gem.activation_mantra,
    beej_mantra: gem.beej_mantra,
    caution: gem.caution,
    weight_ratti: gem.recommended_weight_ratti,
    upratna: gem.upratna,
    upratna_note: gem.upratna_note,
    confidence_score: 60,
    confidence_reasoning: 'Based on classical Vedic rashi compatibility (AI unavailable)',
    source: 'fallback',
  };
}
