import type { AppState, HubTab } from '../state'

/** The Research Hub's five buyer questions, in reading order. */
export const CHAPTERS: [HubTab, string][] = [
  ['summary', 'Is it good?'],
  ['evidence', 'Who says so?'],
  ['ownership', 'Will it last?'],
  ['pricing', 'Is now the time?'],
  ['community', 'What do owners say?'],
]

/** How far the buyer has got with a product's research, from the questions they've opened. */
export function researchProgress(s: AppState, pid: string) {
  const read = s.readTabs[pid] ?? []
  const next = CHAPTERS.find(([k]) => !read.includes(k))
  const done = CHAPTERS.length - (next ? CHAPTERS.filter(([k]) => !read.includes(k)).length : 0)
  const parts = [next ? `${done} of ${CHAPTERS.length} questions read · Next: ${next[1]}` : 'All questions read · Ready to decide']
  if (pid === 'xm5' && s.alertSet) parts.push('Alert set')
  return { pct: Math.round((done / CHAPTERS.length) * 100), step: parts.join(' · '), next: next?.[0] ?? 'summary', done }
}
