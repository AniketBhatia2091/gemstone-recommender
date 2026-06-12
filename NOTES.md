# Project Notes

## Tech stack rationale

Chose **Vite** over Create React App because CRA is officially deprecated by the React team and has significantly slower build times due to its Webpack-based toolchain — Vite uses native ESM in development and esbuild for production bundling, giving sub-second HMR. Chose **Vercel Serverless Functions** over Express because there's no server to maintain, the API key stays server-side without any proxy configuration, and it auto-scales on the free tier. Chose **Gemini 1.5 Flash** over OpenAI GPT because Gemini's native `response_mime_type: "application/json"` in `generationConfig` eliminates the need for post-processing JSON from markdown-wrapped responses, and the free tier is sufficient for a demo without requiring payment setup.

## Assumptions

1. **User knows their Rashi and Lagna** — a real version would compute these from exact birth time and city using a Vedic ephemeris API (e.g. Prokerala, Astrosage). This requires a paid API and was out of scope for a 48-hour build. The form labels include Sanskrit terms to help users who know their chart in Hindi.

2. **The AI recommendation is for reference only** — not a substitute for a consultation with a certified Jyotish acharya. This disclaimer is prominently displayed on both pages.

3. **Gemini free tier is sufficient for demo purposes** — a production version would need rate limiting (e.g. per-IP throttling via Vercel Edge Config), usage monitoring, and possibly a paid Gemini tier for higher throughput.

4. **All 9 navaratna gemstone data is sourced from classical texts** — primarily Brihat Parashara Hora Shastra (BPHS) for rashi-graha assignments and gemstone-planet correspondences, cross-referenced with standard Vedic astrology resources for wearing instructions, mantras, and caution notes.

5. **Shopify as the commerce layer** — Assumed Shopify as the commerce layer based on Humara Pandit's actual storefront architecture (confirmed from their website URL structure and job description). The current buy buttons use static search URLs as a placeholder. In a production integration, these would use the Shopify Storefront API to fetch live product IDs and inventory status per navaratna SKU, ensuring accurate pricing and availability for items ranging from ₹199 (Panch Mukhi Rudraksha) to ₹1,75,000+ (premium gemstones).

6. **Confidence score as a data-team metric** — The confidence score (0–100 with a defined rubric) was designed to be loggable and trackable over time — not just a UI element. In a production system backed by Humara Pandit's data infrastructure (Zoho Analytics, as listed in their JD), the distribution of confidence scores across rashi/issue combinations would reveal which input combinations the AI is least certain about, guiding future training data collection for Tejas.

## Known limitations

1. **No kundali (birth chart) calculation** — this would require exact birth time (hour, minute) and geographic coordinates, plus a Vedic ephemeris API to compute planetary positions. The current approach uses Rashi + Lagna as proxies, which is the standard simplified approach used by many practicing astrologers for initial recommendations.

2. **Confidence score is heuristic** — it is based on how many of rashi/lagna/issue criteria match the gemstone classically, not on a full chart analysis. A production version with kundali input could compute a more accurate confidence score based on actual planetary positions, aspects, and dashas.

3. **Diamond (Heera) and Blue Sapphire (Neelam) are powerful but potentially dangerous if worn incorrectly** — the app includes strong caution copy for these gemstones, but a production version should require astrologer sign-off before recommending them. Humara Pandit's astrologer network could provide this verification layer.

## Future improvements

1. **Nakshatra & Kundali Calculator** — Auto-compute rashi/lagna from exact DOB + birth city using a Vedic ephemeris API, removing the need for users to know their Jyotish details.

2. **Astrologer Override Dashboard** — Since Humara Pandit works with a network of astrologers, build a dashboard where an astrologer can review AI recommendations, override them, and add personal notes before the client sees the result.

3. **WhatsApp Integration** — Humara Pandit already uses WhatsApp for customer communication. Build a webhook endpoint that accepts a WhatsApp message with the user's rashi and issue, calls the same `/api/recommend` function, and replies with a formatted recommendation.
