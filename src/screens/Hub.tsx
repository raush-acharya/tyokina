import { data } from '../data'
import { useApp, type HubTab } from '../state'
import { autoGrid, amber, ink, swatch, teal } from '../lib/theme'
import { affLabel } from '../components/Sheets'
import { BackLink, Kicker, ProductShot, cx } from '../components/ui'
import { npr } from '../lib/format'

const p = data.product
const pr = data.pricing

const CHAPTERS: [HubTab, string][] = [
  ['summary', 'Is it good?'],
  ['evidence', 'Who says so?'],
  ['ownership', 'Will it last?'],
  ['pricing', 'Is now the time?'],
  ['community', 'What do owners say?'],
]

export function Hub() {
  const { s, set, go, toast } = useApp()
  const priceNow = Number(p.price.replace(/,/g, ''))
  const priceWas = Number(p.was.replace(/,/g, ''))
  const pctOff = Math.round((1 - priceNow / priceWas) * 100)

  return (
    <main className="page" data-screen-label="Research Hub">
      <BackLink onClick={() => go(s.prev === 'hub' ? 'home' : s.prev)}>← Back</BackLink>
      <div className="hub-hero" style={autoGrid(360, 24)}>
        <div>
          <Kicker className="kicker--dark">{p.brand.toUpperCase()} · {p.cat.toUpperCase()} · ★ {p.rating} ({p.ratings})</Kicker>
          <h1 className="display display--hub">{p.name}</h1>
          <div className="price-line">
            <span className="price-line__now">रू {p.price}</span>
            <span className="price-line__was">रू {p.was}</span>
            <span className="price-line__tag">−{pctOff}% vs 12-mo high</span>
          </div>
        </div>
        <ProductShot />
      </div>
      <div className="action-row">
        <button type="button" className="pill-btn pill-btn--dark" onClick={() => set({ sheet: 'retail' })}>See prices</button>
        <button type="button" className="pill-btn pill-btn--amber" onClick={() => go('decide')}>Ready to decide?</button>
        <button type="button" className="pill-btn pill-btn--outline" onClick={() => go('compare')}>Compare</button>
        <button type="button" className="pill-btn pill-btn--ghost" aria-pressed={s.saved} onClick={() => {
          set({ saved: !s.saved })
          toast(s.saved ? 'Removed from Saved' : 'Saved to “Travel gear 2026”')
        }}>{s.saved ? '✓ Saved' : 'Save'}</button>
      </div>

      <div className="chapter-bar">
        <Kicker className="kicker--dark chapter-bar__kicker">RESEARCH IT IN FIVE QUESTIONS</Kicker>
        <div className="chapters" role="tablist" aria-label="Research Hub sections">
          {CHAPTERS.map(([k, q], i) => (
            <button key={k} type="button" role="tab" aria-selected={s.tab === k} aria-controls="hub-panel"
              className={cx('chapter', s.tab === k && 'is-on')} onClick={() => set({ tab: k })}>
              <span className="chapter__n">0{i + 1}</span>{q}
            </button>
          ))}
        </div>
      </div>

      <div id="hub-panel" role="tabpanel">
        {s.tab === 'summary' && <Summary />}
        {s.tab === 'evidence' && <Evidence />}
        {s.tab === 'ownership' && <Ownership />}
        {s.tab === 'pricing' && <Pricing />}
        {s.tab === 'community' && <HubCommunity />}
      </div>
    </main>
  )
}

function Cite({ n }: { n: number }) {
  const { openHubTab } = useApp()
  return <button type="button" className="cite" title="Open source" aria-label={`Source ${n}`} onClick={() => openHubTab('evidence', n)}>{n}</button>
}

const CONSENSUS = {
  agree: { label: 'CONSENSUS', bg: '#D9F7F2' },
  split: { label: 'DISAGREEMENT', bg: '#FEF3C7' },
  limited: { label: 'LIMITED EVIDENCE', bg: '#EEF0F9' },
} as const

function Summary() {
  const { go, toast } = useApp()
  return (
    <>
      <section className="score-panel">
        <div style={autoGrid(300, 'clamp(24px,4vw,56px)')} className="score-panel__grid">
          <div>
            <Kicker className="kicker--amber">EVIDENCE SCORE</Kicker>
            <div className="score-panel__score">{p.score}</div>
            <div className="score-panel__basis">Based on {p.basis}</div>
            <button type="button" className="inline-link inline-link--white" onClick={() => go('how')}>How is this scored?</button>
          </div>
          <div>
            <Kicker className="kicker--pale">AI SUMMARY · BUILT ONLY FROM CITED SOURCES</Kicker>
            <p className="score-panel__summary">
              {p.summary.map((seg, i) => (
                <span key={i}>{seg.t}{'c' in seg && seg.c?.map(n => <Cite key={n} n={n} />)}</span>
              ))}
            </p>
            <button type="button" className="inline-link inline-link--pale" onClick={() => toast('Thanks — a reviewer will check this summary against its sources.')}>Spot an error? Flag it</button>
          </div>
        </div>
      </section>
      <div className="outline-card consensus">
        <h2 className="card-title">Where sources agree — and don't</h2>
        <div style={autoGrid(240, 12)} className="consensus__grid">
          {p.consensus.map(c => {
            const k = CONSENSUS[c.kind as keyof typeof CONSENSUS]
            return (
              <div key={c.t} className="consensus__item" style={{ background: k.bg }}>
                <div className="mono-12 consensus__label">{k.label}</div>
                <div className="consensus__t">{c.t}</div>
                <div className="consensus__agree">{c.agree}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={autoGrid(340, 16)} className="mt-16">
        <div className="list-block list-block--mint">
          <h2 className="list-block__title">What works well</h2>
          {p.works.map(w => <div key={w.t} className="list-row"><span>{w.t}</span><span className="list-row__cite">[{w.c}]</span></div>)}
        </div>
        <div className="list-block list-block--cream">
          <h2 className="list-block__title">Trade-offs</h2>
          {p.tradeoffs.map(w => <div key={w.t} className="list-row"><span>{w.t}</span><span className="list-row__cite">[{w.c}]</span></div>)}
          <div className="best-for__label">Best for</div>
          <div className="best-for">{p.bestFor.map(b => <span key={b}>{b}</span>)}</div>
        </div>
      </div>
    </>
  )
}

function Evidence() {
  const { s } = useApp()
  return (
    <>
      <h2 className="section-h2">Who says so?</h2>
      <p className="section-lede">Sources are scored for independence, method and track record. Affiliate-only sites are excluded; any commercial tie is flagged.</p>
      {data.sources.map(x => {
        const w = x.trust + '%'
        const ring = x.trust > 80 ? '#10B981' : '#F59E0B'
        return (
          <article key={x.n} id={'source-' + x.n} className={cx('source', s.hl === x.n && 'is-hl')} style={autoGrid(240)}>
            <div>
              <div className="source__head"><span className="source__n">{x.n}</span><span className="source__outlet">{x.outlet}</span></div>
              <div className="source__meta">{x.score} · {x.date} · {x.fund}</div>
              {x.flag && <div className="source__flag">⚑ {x.flag}</div>}
            </div>
            <p className="source__quote">“{x.quote}” <a href="#" onClick={e => e.preventDefault()}>Read original ↗</a></p>
            <div className="trust">
              <div className="trust__ring" style={{ background: `conic-gradient(${ring} 0 ${w},#E2E6F3 ${w} 100%)` }} role="img" aria-label={`Source trust ${x.trust} of 100`}>
                <div className="trust__inner">{x.trust}</div>
              </div>
              <span className="trust__label">source<br />trust</span>
            </div>
          </article>
        )
      })}
    </>
  )
}

function Ownership() {
  const o = data.ownership
  return (
    <>
      <h2 className="section-h2 section-h2--gap">Will it last?</h2>
      <div style={autoGrid(240, 16)}>
        {o.stats.map((st, i) => (
          <div key={st.k} className="own-stat" style={swatch([teal, amber, ink][i])}>
            <div className="own-stat__v">{st.v}<span>{st.u}</span></div>
            <div className="own-stat__k">{st.k}</div>
            <div className="mono-12 own-stat__n">{st.n}</div>
          </div>
        ))}
      </div>
      <div className="outline-card mt-16">
        <h2 className="card-title">Recurring issues after 1+ year</h2>
        {o.issues.map(i => (
          <div key={i.t} className="issue">
            <span>{i.t} <span className="issue__n">· {i.n} reports</span></span>
            <span className="issue__s" style={{ background: i.s === 'Unresolved' ? '#FEF3C7' : '#D9F7F2' }}>{i.s}</span>
          </div>
        ))}
      </div>
      <div style={autoGrid(340, 16)} className="mt-16">
        {o.owners.map(ow => (
          <figure key={ow.name} className="owner-quote">
            <blockquote>“{ow.text}”</blockquote>
            <figcaption><span className="avatar avatar--36">{ow.i}</span><b>{ow.name}</b> · {ow.time} · <span className="verified">✓ Verified</span></figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}

function Pricing() {
  const { s, set } = useApp()
  const max = Math.max(...pr.history), min = 30
  const last = pr.history.length - 1
  const drop = npr((Number(pr.high.replace(/,/g, '')) - Number(p.price.replace(/,/g, ''))))
  return (
    <>
      <section className="timing-panel">
        <div className="mono-12 ls-1">IS NOW THE TIME? · SIGNAL: {pr.signal}</div>
        <div className="timing-panel__answer">Yes, mostly.</div>
        <p className="timing-panel__text">रू {drop} under its 12-month high. The all-time low was रू {pr.low} during {pr.lowWhen} — it may dip again.</p>
        <div className="bars" role="img" aria-label="Price over the last 12 months, falling from रू 46,000 to रू 37,000">
          {pr.history.map((v, i) => (
            <div key={i} className="bars__col">
              <span className="bars__bar" style={{ height: ((v - min) / (max - min)) * 100 + '%', background: i === last ? '#0C0E1A' : 'rgba(12,14,26,0.22)' }} />
              <span className="bars__m">{pr.months[i]}</span>
            </div>
          ))}
        </div>
        <div className="timing-panel__stats"><span>All-time low · रू {pr.low}</span><span>All-time high · रू {pr.high}</span><span>Today · रू {p.price}</span></div>
      </section>
      <div style={autoGrid(240, 12)} className="mt-16">
        {data.retailers.map(r => (
          <div key={r.name} className="retailer">
            <div className="retailer__name">{r.name}</div>
            <div className="retailer__price">रू {r.price}</div>
            <div className="retailer__stock">{r.stock}</div>
            <div className="mono-12 muted">{affLabel(r.aff)}</div>
            <button type="button" className="retailer__visit" onClick={() => set({ sheet: 'retail', retail: r.name })}>Visit {r.name} ↗</button>
          </div>
        ))}
      </div>
      <button type="button" className="alert-banner" onClick={() => set({ sheet: 'alert' })}>
        <div>
          <div className="alert-banner__title">{s.alertSet ? `✓ Alert set at रू ${npr(s.alertT)} — change it` : 'Not ready? Save & set a price alert'}</div>
          <div className="alert-banner__sub">We'll tell you when it hits your price. No other emails.</div>
        </div>
        <span className="alert-banner__arrow" aria-hidden>→</span>
      </button>
    </>
  )
}

function HubCommunity() {
  const { go } = useApp()
  return (
    <>
      <div className="section-head">
        <h2 className="section-h2 m-0">What do owners say?</h2>
        <button type="button" className="pill-btn pill-btn--outline pill-btn--22" onClick={() => go('review', { rDone: false })}>Own one? Write a review</button>
      </div>
      <div className="masonry">
        {data.reviews.map(c => (
          <article key={c.name} className="review-card">
            <div className="review-card__top"><span style={{ color: c.verified ? '#00695C' : '#1B2D6E' }}>{c.verified ? '✓ Verified owner' : c.kind}</span><span className="muted">{c.owned}</span></div>
            <h3 className="review-card__title">{c.title}</h3>
            <p className="review-card__text">{c.text}</p>
            <div className="review-card__foot"><span>{c.name}{c.updated && ` · ${c.updated}`}</span><span className="mono">▲ {c.helpful}</span></div>
          </article>
        ))}
      </div>
    </>
  )
}
