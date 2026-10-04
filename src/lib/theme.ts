import type { CSSProperties } from 'react'

export type Swatch = readonly [bg: string, fg: string]

/** Colour-block cards cycle through these ("Loud" mood from the design). */
export const ink: Swatch = ['#1B2D6E', '#fff']
export const teal: Swatch = ['#00BFA5', '#0C0E1A']
export const dark: Swatch = ['#0C0E1A', '#FAFAF7']
export const amber: Swatch = ['#F59E0B', '#0C0E1A']
export const palette: readonly Swatch[] = [ink, teal, dark, amber]

export const swatch = ([background, color]: Swatch): CSSProperties => ({ background, color })

export const stageBg: Record<string, string> = {
  'Deep research': '#D9F7F2',
  'Comparing': '#FEF3C7',
  'Saved': '#EEF0F9',
}

/** Style for an auto-fit grid whose columns are at least `min` wide. */
export const autoGrid = (min: number, gap?: number | string): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))`,
  ...(gap !== undefined ? { gap } : {}),
})
