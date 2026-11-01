import { slides } from './slides.js'

/* Planned seconds per slide = time to say the notes at ~2.5 words a second (150 wpm), plus room for
   whatever the presenter does on that slide (stepping, using the live app, zooming a diagram).
   Dividers are 3s beats. */
const DEMO = { hub: 14, compare: 8, personas: 5, learned: 6, journey: 3, more: 4, affinity: 3, ideas: 2, sketch: 2, asis: 2, flows: 2, ia: 2, mood: 2, system: 2, business: 2, problem: 3, cover: 2 }

for (const s of slides) {
  const words = s.notes.replace(/\[step\]/g, '').trim().split(/\s+/).length
  s.words = words
  s.t = s.divider ? 3 : Math.max(8, Math.round(words / 2.5 + (DEMO[s.id] || 0) + 1))
}

export const totalSeconds = slides.reduce((a, s) => a + s.t, 0)
