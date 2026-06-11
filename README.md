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

1. **Nakshatra & Kundali Calculator** — Auto-compute rashi/lagna from exact DOB + birth city using a Vedic ephemeris API (e.g. Prokerala), removing the need for users to know their Jyotish details. This would dramatically increase accessibility for non-astrology-aware users.

2. **Astrologer Override Dashboard** — Since Humara Pandit works with a network of astrologers, build a simple dashboard where an astrologer can review AI recommendations, override them, and add personal notes before the client sees the result. This maintains the human-in-the-loop trust that is central to Humara Pandit's value proposition.

3. **WhatsApp Integration** — Humara Pandit already uses WhatsApp for customer communication (per the job description). Build a webhook endpoint that accepts a WhatsApp message with the user's rashi and issue, calls the same `/api/recommend` function, and replies with a formatted recommendation — no app install required. This aligns with Humara Pandit's existing customer acquisition channel.
