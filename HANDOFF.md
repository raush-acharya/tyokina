# TyoKina handoff

Read this first if you're picking the project up in a new chat.

## What TyoKina is

A product-research companion for high-value purchases in Nepal (prices in रू, Nepali digit grouping like 1,45,000). It replaces twenty open tabs with one decision workspace. The PRD's core principles: evidence over opinion, no forced winners, honest about what's unknown, affiliate ties always disclosed.

The app is a React 19 + Vite + TypeScript prototype that runs on demo data (`src/data.ts`), with no backend. It implements direction **C, "Questions"** from the Claude Design handoff in `project/` and `chats/`.

## Run it

```
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build
```

A published preview, a single-file build, lives at https://claude.ai/artifact/62yN8KqiJCCtUZh1HQ6N9s and is private to the owner.

## Decisions already made (don't relitigate)

- **Stack:** Vite + React + TS. Screen state lives in `src/state.tsx` and is synced to the URL hash, so back/forward work.
- **One amber:** `#F59E0B` for every accent: logo "kina?", headline question marks, active tab, amber surfaces. It's too light for small text, so small text stays ink; only big accents and fills use amber. axe flags the large amber words for contrast; that's accepted.
- **Colour tokens:** 15 tokens in `src/styles.css` `:root`. No hard-coded hex in components.
- **Compare:** no winners. The strongest value per row gets a neutral mint "Strongest in that row" pill, with no star and no "best" wording.
- **Tweaks:** the design's Mood / Hub layout / Voice controls are fixed to Loud, Chapters and Questions, and the switches were removed.
- **Priorities:** per category, at most 3, asked in context on the Research Hub, editable on the Decision check, and surfaced first in Compare ("Your priority"). Not on Home.
- **Product images:** nine AI-generated studio-style images (made with ChatGPT's image tool), one per catalog product, in `src/assets/products/*.webp` (800×800, 13–38 KB, sharp at 2x for both the 340px hero and the 64px thumbnail) and mapped in `src/photos.ts`. They are illustrations, not photos of the exact units, so the large version carries the caption "AI-generated illustration, not a photo of the exact unit" (honest-about-what-we-know). They show on the Research Hub (full and preview pages), search results, the compare picker, and the Home cards (pick up where you left off, price drops, trending). Products with no image still get a plain frame.
- **Style rules followed (Impeccable skill):** no eyebrow labels above headings, no meaningless 01/02 numbering, monospace only for numbers, an authored SVG icon set (`src/components/Icon.tsx`) instead of unicode glyphs, no coloured left borders, no nested cards.

## What's built

Home (search with typo correction, recent searches, request-a-product; live research progress; price drops; trending) · Research Hub (five question tabs that track what's been read; AI summary with citations; evidence sources; ownership; pricing with Weekly/Monthly/Yearly chart, low/typical/high meter, retailers, alerts for any drop or below a target; owner reviews plus ask-owners) · products without full research get an honest preview page · Compare (spec help, add-product picker, sticky names, stacked phone layout) · Decision check (inline priorities, coverage, uncertainty, outcomes plus confidence; a price notification reopens it with a "what changed" banner) · Community (filters, helpful votes, reply composer) · Notifications · Review update · Saved · Profile (switches, sign-out confirm) · How it works · Explore · Buying guide.

Accessibility: skip link, focus held in sheets and returned on close, arrow keys on tabs and radio groups, rem type scale, 44px targets, fits 320px to desktop with no sideways scroll.

## Known limits

- State is in memory only; a reload resets progress, questions, recents and alerts.
- Only the Sony WH-1000XM5 has full research data; the price-drop banner uses fixed figures.

## Ideas not built yet

1. Warranty and seller type per retailer (authorised dealer vs grey import, a big deal in Nepal), plus total price with delivery.
2. AI-summary trust: mark uncited sentences, and add topic chips ("Battery", "Comfort") that filter owner reviews.
3. Dark mode.
4. Swap the AI-generated images for real, credited photos (Wikimedia Commons, exact models, author + licence) once access exists (`commons.wikimedia.org`, `upload.wikimedia.org`). Keep the 800×800 square WebP convention.

## The case study (presentation site)

The `case-study/` folder is a separate Vite project: a 39-slide live presentation with a 15-minute script, using this app inside its phones. Read `case-study/HANDOFF.md`. After changing the app, run `npm run publish` in `case-study/` to refresh both hosted sites.

## Repo map

- `src/screens/`: Home, Hub, Compare, Decide, Social (Community, Notifications, Review), Account (Saved, Profile, How, Explore, Guide)
- `src/components/`: Chrome (header, nav, toast), Sheets (retailer and alert), Priorities, ProductPhoto, Icon, ui
- `src/lib/`: format (`npr`, non-breaking model names), compare (strongest per row), progress, search (typo tolerance), theme
- `project/`, `chats/`: the original Claude Design handoff bundle (reference only)
