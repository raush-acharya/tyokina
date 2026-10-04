# Chat

_Started 2026-10-04 03:24 UTC_

---

## User

Continuing from "Figma design review".

## Assistant

We've been redesigning TyoKina, a product-research companion for high-value purchases, as a responsive clickable prototype in three directions. You chose **C – Questions**, which frames the Research Hub around five buyer questions instead of tabs, with bold typography and no forced winners.

I built C v2 from the PRD, covering all 28 functional requirements: Home with search and pick-up cards, a five-question Research Hub with tappable citations, Evidence flagging affiliate sources, Pricing with buy-timing signals, Compare hiding identical specs, Decision check with confidence ratings, Community with verified-owner badges, price alerts, Notifications, Saved collections, and Profile. Prices use Nepali formatting (रू, grouped 1,45,000), tap targets are 44px+, and citations link directly to sources.

I then separated the action buttons from the question tabs with a dark rule and "Research it in five questions" label. The tabs became a numbered segmented bar (01–05) so they read as navigation, not buttons.

I added a Tweaks panel with three expressive controls: **Mood** (Loud/Ink/Paper) recolours the entire palette across cards; **Hub layout** (Chapters/Long-form) switches between tabbed sections and one scrolling page; **Voice** (Questions/Plain labels) toggles between buyer questions and standard labels.

Just now, I fixed Raush's spacing issue on "Compare 2 selected" (words now 6px apart) and highlighted the best value in each Compare row with an amber pill and ★, with a "Best in that row" key—though this slightly bends the "no winners" principle.

Product photos are still placeholder stripes. The next step is your call on whether the per-row highlights feel right for the product's values.

[files: TyoKina C v2.dc.html, tyokina-c-data.js]

