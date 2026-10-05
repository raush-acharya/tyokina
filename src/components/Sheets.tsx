import { useEffect, useRef, type ReactNode } from 'react'
import { catalog, data } from '../data'
import { npr } from '../lib/format'
import { useApp } from '../state'
import { Icon } from './Icon'
import { Chip, Num, arrowNav, cx } from './ui'

/** Modal sheet: holds focus inside while open and returns it to the opener on close. */
function Sheet({ title, width, onClose, children }: { title: string; width: number; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close.current()
      if (e.key !== 'Tab' || !ref.current) return
      const items = [...ref.current.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]),a[href],input,textarea')]
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [])
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div ref={ref} className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" style={{ width: `min(${width}px,100%)` }} onClick={e => e.stopPropagation()}>
        <div className="sheet__head">
          <h2 id="sheet-title" className="h3">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const affLabel = (aff: boolean) => aff ? 'Affiliate link: we earn a commission' : 'No affiliate relationship'

function RetailerSheet() {
  const { s, set, toast } = useApp()
  return (
    <Sheet title="Choose a retailer" width={560} onClose={() => set({ sheet: null })}>
      <p className="small muted">Sorted by price. TyoKina doesn't sell anything; you'll finish on the retailer's site.</p>
      <div role="radiogroup" aria-label="Retailer" onKeyDown={arrowNav}>
        {data.retailers.map(r => {
          const on = s.retail === r.name
          return (
            <button key={r.name} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              className={cx('retail-option', on && 'is-on')} onClick={() => set({ retail: r.name })}>
              <div>
                <div className="h4">{r.name}</div>
                <div className="small muted">{r.stock} · {affLabel(r.aff)}</div>
              </div>
              <Num className="retail-option__price">रू {r.price}</Num>
            </button>
          )
        })}
      </div>
      <p className="disclosure">We earn a commission from some retailers. It never changes the order, the scores or the evidence you see.</p>
      <button type="button" className="block-cta" onClick={() => {
        set({ sheet: null, outcome: s.screen === 'decide' ? 'buy' : s.outcome })
        toast('Opening ' + s.retail + ' in a new tab')
      }}>Continue to {s.retail}<Icon name="external" size={18} /></button>
    </Sheet>
  )
}

const ALERT_PRESETS: [number, string][] = [[35500, 'All-time low · रू 35,500'], [35000, 'रू 35,000'], [36000, 'रू 36,000']]

function AlertSheet() {
  const { s, set, toast } = useApp()
  const p = catalog[s.pid] ?? catalog.xm5
  return (
    <Sheet title="Save and set a price alert" width={520} onClose={() => set({ sheet: null })}>
      <p className="small muted">{p.brand} {p.name} · today <Num>रू {p.price}</Num></p>
      <div className="stepper">
        <button type="button" className="stepper__btn" aria-label="Lower by रू 500" onClick={() => set({ alertT: Math.max(30000, s.alertT - 500) })}><Icon name="minus" /></button>
        <div className="stepper__value">
          <div className="label">Alert me at</div>
          <Num className="stepper__num"><span aria-live="polite">रू {npr(s.alertT)}</span></Num>
        </div>
        <button type="button" className="stepper__btn" aria-label="Raise by रू 500" onClick={() => set({ alertT: Math.min(37000, s.alertT + 500) })}><Icon name="plus" /></button>
      </div>
      <div className="chip-row">
        {ALERT_PRESETS.map(([v, t]) => <Chip key={v} on={s.alertT === v} onClick={() => set({ alertT: v })}>{t}</Chip>)}
      </div>
      <button type="button" className="block-cta" onClick={() => {
        set({ sheet: null, alertSet: true, saved: true, outcome: s.screen === 'decide' ? 'wait' : s.outcome })
        toast('Saved. We’ll alert you at रू ' + npr(s.alertT))
      }}>Save to “Travel gear 2026” and set alert</button>
      <p className="small muted" style={{ textAlign: 'center' }}>It's fine to wait. Your research is saved.</p>
    </Sheet>
  )
}

export function Sheets() {
  const { s } = useApp()
  if (s.sheet === 'retail') return <RetailerSheet />
  if (s.sheet === 'alert') return <AlertSheet />
  return null
}
