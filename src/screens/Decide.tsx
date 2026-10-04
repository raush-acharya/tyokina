import { data, xm5Meets } from '../data'
import { autoGrid } from '../lib/theme'
import { useApp } from '../state'
import { BackLink, Kicker, cx } from '../components/ui'

const OUTCOMES = { buy: 'You chose a retailer.', wait: 'Saved with a price alert.', skip: 'You decided not to buy — a good outcome too.' }
const segs = (v: number) => [0, 1, 2, 3, 4].map(i => i < v ? (v < 2 ? '#F59E0B' : '#10B981') : '#E2E6F3')

export function Decide() {
  const { s, set, go, toast } = useApp()
  const p = data.product
  return (
    <main className="page page--960" data-screen-label="Decision check">
      <BackLink onClick={() => go('hub', { tab: 'summary' })}>← Back to Research Hub</BackLink>
      <h1 className="display display--decide">Ready to<br />decide<span className="q-amber">?</span></h1>
      <p className="decide-lede">{p.brand} {p.name} · रू {p.price} — a check of the evidence, and what's still unknown.</p>

      <div className="prio-panel">
        <Kicker className="kicker--amber">AGAINST YOUR PRIORITIES</Kicker>
        {s.prios.map(t => {
          const met = xm5Meets[t]
          return (
            <div key={t} className="prio-check">
              <span className="prio-check__icon" style={{ background: met ? '#00BFA5' : '#F87171' }} aria-hidden>{met ? '✓' : '×'}</span>
              <span className="prio-check__t">{t}</span>
              <span className="prio-check__note">{met ? 'Met' : 'Not met'}</span>
            </div>
          )
        })}
        {s.prios.length === 0 && <div className="prio-panel__empty">No priorities set yet.</div>}
        <button type="button" className="inline-link inline-link--amber" onClick={() => go('home')}>Edit priorities</button>
      </div>

      <div style={autoGrid(280, 16)} className="mt-16">
        <div className="outline-card outline-card--28">
          <div className="coverage__head"><h2 className="card-title">Evidence coverage</h2><span className="tag tag--mint">STRONG</span></div>
          {data.decision.coverage.map(c => (
            <div key={c.k} className="coverage__row">
              <div className="coverage__labels"><span>{c.k}</span><span className="mono-12 muted">{c.d}</span></div>
              <div className="coverage__segs" role="meter" aria-valuenow={c.v} aria-valuemin={0} aria-valuemax={5} aria-label={c.k}>
                {segs(c.v).map((bg, i) => <span key={i} style={{ background: bg }} />)}
              </div>
            </div>
          ))}
        </div>
        <div className="uncertain">
          <h2 className="card-title">Still uncertain</h2>
          {data.decision.uncertain.map(u => <div key={u} className="uncertain__item">{u}</div>)}
          <h2 className="card-title mt-12">Price timing</h2>
          <div className="uncertain__timing">{data.decision.timing}</div>
        </div>
      </div>

      {!s.outcome ? (
        <>
          <div style={autoGrid(280, 12)} className="mt-24">
            <button type="button" className="decide-btn" onClick={() => set({ sheet: 'retail' })}>Choose a retailer</button>
            <button type="button" className="decide-btn" onClick={() => set({ sheet: 'alert' })}>Save & set price alert</button>
          </div>
          <div className="center mt-12"><button type="button" className="inline-link inline-link--16" onClick={() => set({ outcome: 'skip' })}>I've decided not to buy</button></div>
        </>
      ) : (
        <div className="outcome">
          <div className="outcome__text">{OUTCOMES[s.outcome]}</div>
          <div className="outcome__q" id="conf-q">How confident do you feel about this decision?</div>
          <div className="conf" role="radiogroup" aria-labelledby="conf-q">
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <button key={n} type="button" role="radio" aria-checked={s.conf === n} className={cx('conf__opt', s.conf === n && 'is-on')}
                onClick={() => { set({ conf: n }); toast('Thanks — this helps us measure confident decisions.') }}>{n}</button>
            ))}
          </div>
          <div className="conf__scale"><span>Not at all</span><span>Completely</span></div>
          <button type="button" className="inline-link inline-link--15" onClick={() => set({ outcome: null, conf: 0 })}>Change my decision</button>
        </div>
      )}
      <p className="decide-foot">Waiting is a valid answer. Your research is saved.</p>
    </main>
  )
}
