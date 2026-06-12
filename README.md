# Gemstone Recommender — Humara Pandit Assignment

> [Live Demo](https://gemstone-recommender.vercel.app) · Built for Humara Pandit Tech Intern Assignment · June 2026

A production-quality Vedic gemstone recommendation engine that brings Humara Pandit's mission — building India's first Remedy Infrastructure Platform — into a personalized, AI-powered product experience. Users input their Rashi (Moon Sign), Lagna (Ascendant), and life concern, and receive a deeply researched navaratna recommendation grounded in Parashari Jyotish principles.

## Setup (3 steps)

```bash
git clone <repo-url> && cd gemstone-recommender && npm install
cp .env.example .env
# Add your Gemini API key (free at https://aistudio.google.com/app/apikey)
npm run dev
# Open http://localhost:5173
```

## What it does

A user selects their Rashi (Moon Sign), Lagna (Ascendant), primary life concern, and optionally their dominant planet and date of birth. On submit, the app calls a Vercel serverless function that constructs a domain-specific Vedic astrology prompt — including lagna lord analysis, issue-graha mapping, and cross-referencing — and sends it to Google Gemini 1.5 Flash with `response_mime_type: "application/json"` for structured output.

The result is rendered as a polished product card showing the recommended gemstone, its Sanskrit and Hindi names, the ruling graha, detailed wearing instructions (metal, finger, day, time, activation ritual), sacred mantras with a copy button, an affordable upratna (substitute) option, a confidence score with visual bar, and a caution block where applicable. If the AI service fails for any reason, the app silently falls back to a local classical database of all 9 navaratnas, ensuring the user always gets a recommendation.

## Architecture

```
┌────────────┐     POST /api/recommend     ┌──────────────────┐     REST API     ┌─────────────────┐
│  React UI  │ ──────────────────────────── │  Vercel Function │ ────────────── │  Gemini 1.5     │
│  (Vite)    │                              │  (Node.js 18)    │                │  Flash          │
└────────────┘                              └──────────────────┘                └─────────────────┘
       │                                           │
       │ fallback on error                         │ if AI fails: 502/504
       ▼                                           │
┌────────────┐                                     │
│ gemstones  │ ◄───────────────────────────────────
│ .json      │   client-side fallback lookup
└────────────┘
```

## Architecture decisions

| Decision | Rationale |
|----------|----------|
| **React 18 + Vite 5** over CRA | CRA is deprecated. Vite gives sub-second HMR, native ESM, and faster builds. |
| **Tailwind CSS v3** (no component libs) | Full design control, zero runtime CSS-in-JS overhead, tree-shaken output. Custom design language matching Humara Pandit's brand. |
| **Vercel Serverless** over Express | No server to maintain. Auto-scaling. Free tier. API key stays server-side. |
| **Gemini 1.5 Flash** over GPT-4 | Free tier for prototyping. Native `response_mime_type: "application/json"` eliminates parsing hacks. 0.3 temperature for consistency. |
| **Raw fetch** over AI SDKs | Zero dependency weight. Full control over request/response. Transparent error handling. |

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React 18 + Vite 5 | Modern, fast, industry standard |
| Styling | Tailwind CSS v3 | Utility-first, zero runtime, custom design |
| Routing | React Router v6 | createBrowserRouter with type-safe navigation |
| Animations | Pure CSS @keyframes | No bundle cost, GPU-accelerated |
| Backend | Vercel Serverless (Node.js 18) | Serverless, auto-scaling, API key protection |
| AI | Google Gemini 1.5 Flash (REST) | Free tier, structured JSON output, low latency |
| Fallback | Local gemstones.json | 9 navaratnas with complete classical data |

## What I'd build next

**1. Tejas API integration for full Kundli input**
Currently the app takes Rashi and Lagna as manual inputs because most users don't know their full birth chart. The next version would integrate with Humara Pandit's Tejas AI astrologer — passing exact birth date, time, and city to compute the full Kundli, then using the actual planetary positions (not user-reported Rashi) to make a more precise recommendation. The /api/recommend endpoint is designed to accept this without any frontend change — only the prompt construction in buildPrompt.js would need extending.

**2. Shopify Storefront API for live product sync**
The current buy buttons use static search URLs (e.g. humarapandit.com/search?q=natural-ruby-manik). In production, these would be replaced with Shopify Storefront API calls that fetch the live product ID, real-time price, and inventory status for each navaratna SKU. This ensures the buy button always shows the correct price and never links to an out-of-stock product — important for high-value items like Blue Sapphire or Diamond where price and availability change frequently.

**3. AskPandit deep link for mobile users**
On mobile, instead of linking to the Play Store listing, detect if AskPandit is installed (via a custom URI scheme) and deep link directly into the app's Kundli screen pre-filled with the user's Rashi. If not installed, fall back to the Play Store. This creates a seamless handoff between the web recommendation experience and Humara Pandit's native app — turning a web visitor into an AskPandit user.
