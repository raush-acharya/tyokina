# TyoKina case study (presentation site)

A live, one-section-at-a-time presentation built with GSAP. It tells the process behind TyoKina, and shows your real work: the Figma diagrams, sketches and sticky notes, plus the **running app** inside the phones.

```
npm install
npm run dev        # http://localhost:5173 (or the next free port)
npm run build      # static site in dist/ (relative paths: works from any folder)
npm run script     # regenerate SCRIPT.md from the speaker notes in src/slides.js
```

## Presenting

| Key | Action |
| --- | --- |
| `→` `Space` `PageDown` | next beat (reveals the next step on a slide, then the next slide) |
| `←` `PageUp` | previous beat |
| `G` | slide overview, click any slide to jump |
| click a chapter bar | jump to that chapter |
| `P` | presenter mode: speaker notes, timer, pace against the plan |
| `F` | fullscreen |
| click a diagram | zoom it |

Controls show on the first slide for a few seconds, then hide; hover the bottom-right corner to bring them back. `?present` opens presenter mode on load. `#/12` jumps to slide 12. Navigation never waits for a transition: press as fast as you like.

## Where things live

- `src/slides.js`: every slide (copy, layout, theme, speaker notes)
- `src/timing.js`: planned seconds per slide, derived from the notes (150 wpm) plus time for demos
- `src/main.js`: the slide engine (interruptible GSAP transitions, SplitText headlines, steps, live-app iframes, lightbox, presenter mode)
- `src/flow.js`, `src/flows.js`: the flowcharts (dagre layout, drawn as SVG) and their steps
- `public/app/`: a build of the TyoKina app (from `../`), shown live inside the phones. Rebuild it with `cd .. && npx vite build --base=./ --outDir case-study/public/app --emptyOutDir`
- `public/figma/`: diagrams, sketches and sticky notes exported from the Figma file
- `SCRIPT.md`: the 15-minute talk, generated from the notes

## Dev checks (headless Edge)

```
node scripts/check.mjs <outDir> 1 5-9      # screenshots of chosen slides
node scripts/test-nav.mjs                  # rapid navigation, steps, live app control, auto-hiding controls
```

The content comes from the Figma deck ("TyoKina — Case Study v2") and the app repo. Research that has not been run (interviews, usability tests) is shown as planned.

More checks: `node scripts/contrast.mjs` (WCAG audit of every text element), `node scripts/test-drift.mjs` (live phones drift and the hub follows the question), `node scripts/crop.mjs` (trims exported Figma slides down to the artwork).
