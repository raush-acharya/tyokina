import type { CSSProperties } from 'react'

/** Colour-block surfaces, defined as tokens in styles.css. Each pairs a fill with its text colour. */
export type Block = 'navy' | 'teal' | 'ink' | 'amber'
export const blocks: readonly Block[] = ['navy', 'teal', 'ink', 'amber']

/** Class for a colour-block surface; cycles through the palette by index. */
export const blockClass = (i: number) => 'block block--' + blocks[i % blocks.length]

/** Research-stage tag colours. */
export const stageClass: Record<string, string> = {
  'Deep research': 'tag--teal',
  'Comparing': 'tag--amber',
  'Saved': 'tag--neutral',
}

/** Style for an auto-fit grid whose columns are at least `min` px wide. */
export const autoGrid = (min: number, gap?: number | string): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`,
  ...(gap !== undefined ? { gap } : {}),
})
