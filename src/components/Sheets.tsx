import { useEffect, type ReactNode } from 'react'
import { data } from '../data'
import { npr } from '../lib/format'
import { useApp } from '../state'
import { Chip, cx } from './ui'

function Sheet({ title, width, onClose, children }: { title: string; width: number; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} style={{ width: `min(${width}px,100%)` }} onClick={e => e.stopPropagation()}>
        <div className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close" autoFocus>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const affLabel = (aff: boolean) => aff ? 'Affiliate link · we earn a commission' : 'No affiliate relationship'

function RetailerSheet() {
  const { s, set, toast } = useApp()
  const close = () => set({ sheet: null })
  return (
    <Sheet title="Choose a retailer" width={560} onClose={close}>
      <p className="sheet__lede">Sorted by price. TyoKina doesn't sell anything — you'll finish on the retailer's site.</p>
      <div role="radiogroup" aria-label="Retailer">
        {data.retailers.map(r => (
          <button key={r.name} type="button" role="radio" aria-checked={s.retail === r.name}
            className={cx('retail-option', s.retail === r.name && 'is-on')} onClick={() => set({ retail: r.name })}>
            <div>
              <div className="retail-option__name">{r.name}</div>
              <div className="retail-option__stock">{r.stock}</div>
              <div className="retail-option__aff">{affLabel(r.aff)}</div>
            </div>
            <span className="retail-option__price">रू {r.price}</span>
          </button>
        ))}
      </div>
      <div className="disclosure">Affiliate disclosure: we earn a commission from some retailers. It never changes order, scores or the evidence you see.</div>
      <button type="button" className="sheet__cta" onClick={() => {
        set({ sheet: null, outcome: s.screen === 'decide' ? 'buy' : s.outcome })
        toast('Opening ' + s.retail + ' in a new tab…')
      }}>Continue to {s.retail} ↗</button>
    </Sheet>
  )
}

const ALERT_PRESETS: [number, string][] = [[35500, 'All-time low · 35,500'], [35000, '35,000'], [36000, '36,000']]

function AlertSheet() {
  const { s, set, toast } = useApp()
  const close = () => set({ sheet: null })
  return (
    <Sheet title="Save & set price alert" width={520} onClose={close}>
      <p className="sheet__lede sheet__lede--alert">{data.product.brand} {data.product.name} · today रू {data.product.price}</p>
      <div className="stepper">
        <button type="button" className="stepper__btn" aria-label="Lower by रू 500" onClick={() => set({ alertT: Math.max(30000, s.alertT - 500) })}>−</button>
        <div className="stepper__value">
          <div className="stepper__label">ALERT ME AT</div>
          <div className="stepper__num" aria-live="polite">रू {npr(s.alertT)}</div>
        </div>
        <button type="button" className="stepper__btn" aria-label="Raise by रू 500" onClick={() => set({ alertT: Math.min(37000, s.alertT + 500) })}>+</button>
      </div>
      <div className="chip-row chip-row--tight">
        {ALERT_PRESETS.map(([v, t]) => <Chip key={v} on={s.alertT === v} className="chip--sm" onClick={() => set({ alertT: v })}>रू {t}</Chip>)}
      </div>
      <button type="button" className="sheet__cta sheet__cta--alert" onClick={() => {
        set({ sheet: null, alertSet: true, saved: true, outcome: s.screen === 'decide' ? 'wait' : s.outcome })
        toast('Saved · alert set at रू ' + npr(s.alertT))
      }}>Save to “Travel gear 2026” & set alert</button>
      <p className="sheet__foot">It's fine to wait — your research is saved.</p>
    </Sheet>
  )
}

export function Sheets() {
  const { s } = useApp()
  if (s.sheet === 'retail') return <RetailerSheet />
  if (s.sheet === 'alert') return <AlertSheet />
  return null
}
