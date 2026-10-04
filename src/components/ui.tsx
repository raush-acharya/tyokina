import type { ButtonHTMLAttributes, ReactNode } from 'react'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

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

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('kicker', className)}>{children}</div>
}

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button type="button" className="back-link" onClick={onClick}>{children}</button>
}

export function ProductShot({ label = 'product shot' }: { label?: string }) {
  return <div className="product-shot" role="img" aria-label="Product photo placeholder"><span>{label}</span></div>
}

export { cx }
