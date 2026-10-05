import { useState } from 'react'
import { data } from '../data'
import { useApp } from '../state'
import { Icon } from '../components/Icon'
import { PriorityEditor, meets, usePriorities } from '../components/Priorities'
import { nb } from '../lib/format'
import { BackLink, Num, arrowNav, cx } from '../components/ui'

const OUTCOMES = { buy: 'You chose a retailer.', wait: 'Saved, with a price alert.', skip: 'You decided not to buy. That’s a good outcome too.' }

export function Decide() {
  const { s, set, go, toast } = useApp()
  const p = data.product
  const { chosen } = usePriorities('Headphones')
  const [editing, setEditing] = useState(false)

  return (
    <main className="page page--narrow" data-screen-label="Decision check">
      <BackLink onClick={() => go('hub', { tab: 'summary' })}>Back to research</BackLink>
      {s.fromAlert && (
        <div className="changed" role="status">
          <Icon name="down" size={22} />
          <div className="stack" style={{ gap: 2 }}>
            <strong>The price dropped <Num>रू 6,000</Num> since you last looked.</strong>
            <span className="small">It’s now <Num>रू {p.price}</Num>, the lowest in 12 months. Your priorities and notes are as you left them.</span>
          </div>
        </div>
      )}
      <div className="page-head">
        <h1 className="display">Ready to<br />decide<span className="accent">?</span></h1>
        <p className="lede">{p.brand} {nb(p.name)} at <Num>रू {p.price}</Num>. Here’s how the evidence stacks up, and what’s still unknown.</p>
      </div>

      <section className="panel panel--ink on-dark" aria-labelledby="prio-h">
        <div className="section-head" style={{ alignItems: 'center' }}>
          <h2 id="prio-h" className="h3">Your headphone priorities</h2>
          <button type="button" className="link" aria-expanded={editing} onClick={() => setEditing(!editing)}>{editing ? 'Done' : 'Edit'}</button>
        </div>
        {editing && <div style={{ marginTop: 16 }}><PriorityEditor category="Headphones" /></div>}
        <ul className="divided divided--soft" style={{ '--block-line': 'rgba(255,255,255,0.15)', marginTop: 8 } as React.CSSProperties}>
          {chosen.map(t => {
            const met = meets('xm5', t)
            return (
              <li key={t} className="prio-check">
                <span className={'prio-check__icon prio-check__icon--' + (met ? 'met' : 'miss')} aria-hidden><Icon name={met ? 'check' : 'close'} /></span>
                <span className="prio-check__t">{t}</span>
                <span className="prio-check__note">{met ? 'Met' : 'Not met'}</span>
              </li>
            )
          })}
        </ul>
        {chosen.length === 0 && <p className="muted" style={{ marginTop: 12 }}>No priorities yet. Choose Edit to pick up to 3.</p>}
      </section>

      <div className="grid" style={{ '--min': '280px' } as React.CSSProperties}>
        <section className="card stack">
          <div className="section-head" style={{ alignItems: 'center' }}><h2 className="h3">Evidence coverage</h2><span className="tag tag--teal">Strong</span></div>
          {data.decision.coverage.map(c => (
            <div key={c.k} className="coverage__row">
              <div className="coverage__labels"><span>{c.k}</span><span className="small muted">{c.d}</span></div>
              <div className="coverage__segs" role="meter" aria-valuenow={c.v} aria-valuemin={0} aria-valuemax={5} aria-label={`${c.k}: ${c.v} of 5`}>
                {[0, 1, 2, 3, 4].map(i => <span key={i} className={i < c.v ? (c.v < 2 ? 'is-weak' : 'is-on') : ''} />)}
              </div>
            </div>
          ))}
        </section>
        <section className="panel panel--cream stack">
          <h2 className="h3">Still uncertain</h2>
          <ul className="stack" style={{ gap: 12 }}>
            {data.decision.uncertain.map(u => <li key={u} className="uncertain__item"><Icon name="flag" size={18} />{u}</li>)}
          </ul>
          <h2 className="h3" style={{ marginTop: 8 }}>Price timing</h2>
          <p>{data.decision.timing}</p>
        </section>
      </div>

      {!s.outcome ? (
        <>
          <div className="decide-actions">
            <button type="button" className="btn btn--dark btn--lg" onClick={() => set({ sheet: 'retail' })}>Choose a retailer</button>
            <button type="button" className="btn btn--dark btn--lg" onClick={() => set({ sheet: 'alert' })}>Save and set a price alert</button>
          </div>
          <div className="center"><button type="button" className="link" onClick={() => set({ outcome: 'skip' })}>I’ve decided not to buy</button></div>
        </>
      ) : (
        <section className="panel panel--mint stack" style={{ animation: 'rise .4s var(--ease)' }}>
          <h2 className="h2">{OUTCOMES[s.outcome]}</h2>
          <p id="conf-q">How confident do you feel about this decision?</p>
          <div className="conf" role="radiogroup" aria-labelledby="conf-q" onKeyDown={arrowNav}>
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <button key={n} type="button" role="radio" aria-checked={s.conf === n} tabIndex={s.conf === n || (!s.conf && n === 1) ? 0 : -1}
                className={cx('conf__opt num', s.conf === n && 'is-on')}
                onClick={() => { set({ conf: n }); toast('Thanks. This helps us measure confident decisions.') }}>{n}</button>
            ))}
          </div>
          <div className="conf__scale"><span>Not at all</span><span>Completely</span></div>
          <button type="button" className="link" style={{ alignSelf: 'flex-start' }} onClick={() => set({ outcome: null, conf: 0 })}>Change my decision</button>
        </section>
      )}
      <p className="muted" style={{ textAlign: 'center' }}>Waiting is a valid answer. Your research is saved.</p>
    </main>
  )
}
