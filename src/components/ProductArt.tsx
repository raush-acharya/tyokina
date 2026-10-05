import type { ReactElement } from 'react'
import { cx } from './ui'

/*
 * Category illustrations, drawn in the app's own palette. They stand in for product
 * photography until licensed images are available, and are labelled as illustrations.
 * All drawings share a 200×140 canvas, 6px ink outlines and one amber detail.
 */
const INK = 'var(--ink)', AMBER = 'var(--amber)', PAPER = 'var(--paper)', SURFACE = 'var(--surface)'
const stroke = { stroke: INK, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const ART: Record<string, ReactElement> = {
  Headphones: (
    <g>
      <path d="M58 84V70a42 42 0 0 1 84 0v14" fill="none" {...stroke} />
      <rect x="44" y="72" width="30" height="46" rx="14" fill={INK} />
      <rect x="126" y="72" width="30" height="46" rx="14" fill={INK} />
      <rect x="52" y="82" width="14" height="26" rx="7" fill={AMBER} />
      <rect x="134" y="82" width="14" height="26" rx="7" fill={AMBER} />
    </g>
  ),
  Laptops: (
    <g>
      <rect x="52" y="24" width="96" height="66" rx="8" fill={SURFACE} {...stroke} />
      <rect x="64" y="36" width="72" height="42" rx="3" fill={AMBER} />
      <path d="M34 104h132l-10 14H44z" fill={INK} {...stroke} />
    </g>
  ),
  TVs: (
    <g>
      <rect x="28" y="20" width="144" height="86" rx="6" fill={INK} />
      <rect x="38" y="30" width="124" height="66" rx="2" fill={AMBER} />
      <path d="M38 96l40-30 26 18 22-14 36 26z" fill={INK} opacity="0.25" />
      <path d="M82 106l-8 16M118 106l8 16M64 122h72" fill="none" {...stroke} />
    </g>
  ),
  Phones: (
    <g>
      <rect x="72" y="12" width="56" height="116" rx="14" fill={INK} />
      <rect x="79" y="22" width="42" height="94" rx="7" fill={AMBER} />
      <rect x="92" y="16" width="16" height="4" rx="2" fill={PAPER} />
    </g>
  ),
  Accessories: (
    <g>
      <path d="M100 18c26 0 40 22 40 52s-14 54-40 54-40-24-40-54 14-52 40-52z" fill={INK} />
      <path d="M100 22v40" fill="none" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />
      <rect x="95" y="34" width="10" height="20" rx="5" fill={AMBER} />
    </g>
  ),
  Appliances: (
    <g>
      <path d="M128 16l-44 92" fill="none" {...stroke} />
      <circle cx="122" cy="42" r="16" fill={AMBER} {...stroke} />
      <rect x="54" y="104" width="62" height="20" rx="10" fill={INK} />
      <rect x="132" y="10" width="20" height="12" rx="6" fill={INK} transform="rotate(25 142 16)" />
    </g>
  ),
}

/** Illustration for a product's category, on a soft tinted ground. */
export function ProductArt({ category, size = 'lg', label }: { category: string; size?: 'lg' | 'sm'; label?: string }) {
  return (
    <figure className={cx('art', 'art--' + size)} aria-label={`${label ?? category} illustration`} role="img">
      <svg viewBox="0 0 200 140" aria-hidden focusable="false">{ART[category] ?? ART.Headphones}</svg>
      {size === 'lg' && <figcaption className="small muted">Illustration · product photos coming soon</figcaption>}
    </figure>
  )
}
