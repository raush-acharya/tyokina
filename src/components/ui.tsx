import type { ButtonHTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { Icon } from './Icon'

export const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/** Pill-shaped toggle used for filters and choices. */
export function Chip({ on, className, ...rest }: { on: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" aria-pressed={on} className={cx('chip', on && 'is-on', className)} {...rest} />
}

export function ChipRow<T extends string>({ options, value, onChange, label, labelOf }: {
  options: T[]
  value: T
  onChange: (v: T) => void
  label: string
  labelOf?: (v: T) => string
}) {
  return (
    <div className="chip-row" role="group" aria-label={label}>
      {options.map(o => <Chip key={o} on={o === value} onClick={() => onChange(o)}>{labelOf ? labelOf(o) : o}</Chip>)}
    </div>
  )
}

/**
 * Arrow-key handler for a tablist or radiogroup: moves focus and selection
 * to the previous/next/first/last item, per the ARIA authoring practices.
 */
export function arrowNav(e: KeyboardEvent<HTMLElement>) {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
  if (!keys.includes(e.key)) return
  const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[role=tab],[role=radio]')]
  const i = items.indexOf(document.activeElement as HTMLElement)
  if (i < 0) return
  e.preventDefault()
  const n = items.length
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1
    : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n : (i + 1) % n
  items[next].focus()
  items[next].click()
}

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button type="button" className="back-link" onClick={onClick}><Icon name="arrowLeft" size={18} />{children}</button>
}

export function ProductShot({ label = 'Product photo coming soon' }: { label?: string }) {
  return <div className="product-shot" role="img" aria-label="Product photo placeholder"><span>{label}</span></div>
}

/** A price or other figure, set in the numeric face. */
export function Num({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('num', className)}>{children}</span>
}
