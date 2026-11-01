// Generates SCRIPT.md (the 15-minute talk) from the speaker notes in src/slides.js, so the script and the site never drift apart.
import { writeFileSync } from 'node:fs'
import { slides, CHAPTERS } from '../src/slides.js'
import { totalSeconds } from '../src/timing.js'

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
const words = (t) => t.replace(/\[step\]/g, '').trim().split(/\s+/).length
let at = 0, lastCh = -1
const out = [
  '# TyoKina case study: 15-minute presenter script',
  '',
  `Planned running time **${mmss(totalSeconds)}** across **${slides.length} slides**. Press **P** on the site for presenter mode (notes, timer, pace against these timestamps), **G** for the overview.`,
  '',
  '`[step]` marks a key press that reveals the next beat on the same slide. Spoken pace is about 140 words a minute; the word count per slide is a check on that.',
  '',
]
for (const [i, s] of slides.entries()) {
  if (s.ch !== lastCh) { out.push(`## ${CHAPTERS[s.ch]}`, ''); lastCh = s.ch }
  const w = words(s.notes)
  out.push(`### ${String(i + 1).padStart(2, '0')} · ${s.title}  \`${mmss(at)}\` · ${s.t}s · ${w} words`, '', s.notes.replace(/\s*\[step\]\s*/g, '\n\n**[step]** '), '')
  at += s.t
}
out.push('---', '', '## If you run long', '', 'Cut, in this order: *Four themes* (12), *Concepts to features* (20), *Information architecture* (22), *Business model* (29). Each is about 20 to 25 seconds and none is needed for the story to land.', '',
  '## If you run short', '', 'Linger on the *Research Hub* slide (26): step through all five questions and let the phone scroll. It is the most convincing minute of the talk.', '')
writeFileSync(new URL('../SCRIPT.md', import.meta.url), out.join('\n'))
console.log('total', mmss(totalSeconds), 'slides', slides.length)
const heavy = slides.map((s, i) => [i + 1, s.title, s.t, words(s.notes), Math.round(words(s.notes) / (s.t / 60))]).filter(([, , t, w, wpm]) => t > 5 && wpm > 200)
console.log('fast slides (>200 wpm):', JSON.stringify(heavy))
