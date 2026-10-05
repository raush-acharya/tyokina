import { catalog, data, sourceUrl, type CatalogItem } from '../data'
import { useApp, type HubTab, type PriceRange } from '../state'
import { autoGrid, blockClass } from '../lib/theme'
import { affLabel } from '../components/Sheets'
import { Icon } from '../components/Icon'
import { PriorityFit } from '../components/Priorities'
import { BackLink, Num, ProductShot, arrowNav, cx } from '../components/ui'
import { nb, npr } from '../lib/format'

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
  const { s, go } = useApp()
  const item = catalog[s.pid] ?? catalog.xm5
  const back = () => go(s.prev === 'hub' ? 'home' : s.prev)
  return item.full ? <FullHub back={back} /> : <PreviewHub item={item} back={back} />
}

function FullHub({ back }: { back: () => void }) {
  const { s, set, go, toast } = useApp()
  const priceNow = Number(p.price.replace(/,/g, ''))
  const priceWas = Number(p.was.replace(/,/g, ''))
  const pctOff = Math.round((1 - priceNow / priceWas) * 100)

  return (
    <main className="page" data-screen-label="Research Hub">
      <BackLink onClick={back}>Back</BackLink>
      <div className="hub-hero">
        <div className="hub-hero__text">
          <h1 className="display display--product">{nb(p.name)}</h1>
          <div className="hub-hero__meta">
            <span>{p.brand} · {p.cat}</span>
            <span className="row" style={{ gap: 4 }}><Icon name="star" size={16} filled /> <Num>{p.rating}</Num> from <Num>{p.ratings}</Num> ratings</span>
          </div>
          <div className="price-line">
            <Num className="price-line__now">रू {p.price}</Num>
            <Num className="price-line__was"><span className="sr-only">was </span>रू {p.was}</Num>
            <span className="tag tag--teal"><Icon name="down" size={14} />{pctOff}% below its 12-month high</span>
          </div>
        </div>
        <ProductShot />
      </div>
      <div className="row">
        <button type="button" className="btn btn--dark" onClick={() => set({ sheet: 'retail' })}>See prices</button>
        <button type="button" className="btn btn--amber" onClick={() => go('decide')}>Ready to decide?</button>
        <button type="button" className="btn btn--outline" onClick={() => go('compare')}>Compare</button>
        <button type="button" className="btn btn--quiet" aria-pressed={s.saved} onClick={() => {
          set({ saved: !s.saved })
          toast(s.saved ? 'Removed from Saved' : 'Saved to “Travel gear 2026”')
        }}>{s.saved ? <><Icon name="check" size={18} />Saved</> : <><Icon name="bookmark" size={18} />Save</>}</button>
      </div>
      <PriorityFit pid="xm5" category="Headphones" />

      <div className="chapter-bar">
        <div className="chapters" role="tablist" aria-label="Research questions" onKeyDown={arrowNav}>
          {CHAPTERS.map(([k, q]) => (
            <button key={k} type="button" role="tab" id={'tab-' + k} aria-selected={s.tab === k} aria-controls="hub-panel" tabIndex={s.tab === k ? 0 : -1}
              className={cx('chapter', s.tab === k && 'is-on')} onClick={() => set({ tab: k })}>{q}</button>
          ))}
        </div>
      </div>

      <div id="hub-panel" role="tabpanel" aria-labelledby={'tab-' + s.tab} className="stack">
        {s.tab === 'summary' && <Summary />}
        {s.tab === 'evidence' && <Evidence />}
        {s.tab === 'ownership' && <Ownership />}
        {s.tab === 'pricing' && <Pricing />}
        {s.tab === 'community' && <HubCommunity />}
      </div>
    </main>
  )
}

/** Products without full research in this preview: show what we know, honestly. */
function PreviewHub({ item, back }: { item: CatalogItem; back: () => void }) {
  const { go, openProduct, toast } = useApp()
  const sameCat = item.cat === 'Headphones'
  return (
    <main className="page" data-screen-label="Research Hub">
      <BackLink onClick={back}>Back</BackLink>
      <div className="hub-hero">
        <div className="hub-hero__text">
          <h1 className="display display--product">{nb(item.name)}</h1>
          <div className="hub-hero__meta"><span>{item.brand} · {item.cat}</span></div>
          {item.price && <div className="price-line"><Num className="price-line__now">रू {item.price}</Num></div>}
        </div>
        <ProductShot />
      </div>
      <PriorityFit pid={item.id} category={item.cat} />
      <section className="panel panel--navy on-dark stack" style={{ marginTop: 16 }}>
        <h2 className="h2">We’re still building this research</h2>
        <p className="lede" style={{ color: 'var(--on-dark)' }}>
          {item.score ? <>Early evidence score <Num>{item.score}</Num>, based on {item.note.toLowerCase()}. </> : <>{item.note}. </>}
          A full summary, sources, ownership data and price history will appear here once enough independent evidence is in.
        </p>
        <div className="row">
          <button type="button" className="btn btn--amber" onClick={() => toast(`We’ll tell you when the ${item.name} research is ready`)}>Notify me when it’s ready</button>
          {sameCat
            ? <button type="button" className="btn btn--outline" onClick={() => go('compare')}>Compare headphones</button>
            : <button type="button" className="btn btn--outline" onClick={() => openProduct('xm5')}>See a finished example</button>}
        </div>
      </section>
    </main>
  )
}

function Cite({ n }: { n: number }) {
  const { openHubTab } = useApp()
  return <button type="button" className="cite" aria-label={`Source ${n}: ${data.sources[n - 1]?.outlet}`} onClick={() => openHubTab('evidence', n)}>{n}</button>
}

const CONSENSUS = {
  agree: { label: 'Sources agree', tag: 'tag--teal' },
  split: { label: 'Sources disagree', tag: 'tag--amber' },
  limited: { label: 'Limited evidence', tag: 'tag--neutral' },
} as const

function Summary() {
  const { go, toast } = useApp()
  return (
    <>
      <section className="panel panel--navy on-dark score-panel__grid">
        <div>
          <div className="label">Evidence score</div>
          <div className="score-panel__score">{p.score}</div>
          <p className="muted">Based on {p.basis}</p>
          <button type="button" className="link" onClick={() => go('how')}>How is this scored?</button>
        </div>
        <div>
          <h2 className="h4">AI summary</h2>
          <p className="small muted">Written only from the cited sources. Tap a number to read it.</p>
          <p className="score-panel__summary">
            {p.summary.map((seg, i) => (
              <span key={i}>{seg.t}{'c' in seg && seg.c?.map(n => <Cite key={n} n={n} />)}</span>
            ))}
          </p>
          <button type="button" className="link link--quiet" onClick={() => toast('Thanks. A reviewer will check this summary against its sources.')}>
            <Icon name="flag" size={16} />Spot an error? Flag it
          </button>
        </div>
      </section>
      <section className="card">
        <h2 className="h3">Where sources agree, and where they don’t</h2>
        <div className="consensus">
          {p.consensus.map(c => {
            const k = CONSENSUS[c.kind as keyof typeof CONSENSUS]
            return (
              <div key={c.t} className="consensus__item">
                <span className={'tag ' + k.tag} style={{ alignSelf: 'flex-start' }}>{k.label}</span>
                <div className="consensus__t">{c.t}</div>
                <div className="small muted">{c.agree}</div>
              </div>
            )
          })}
        </div>
      </section>
      <div style={autoGrid(340, 16)}>
        <section className="panel panel--mint">
          <h2 className="h3">What works well</h2>
          <ul className="divided" style={{ marginTop: 8 }}>
            {p.works.map(w => <li key={w.t} className="list-row"><span>{w.t}</span><Num className="list-row__cite">[{w.c}]</Num></li>)}
          </ul>
        </section>
        <section className="panel panel--cream">
          <h2 className="h3">Trade-offs</h2>
          <ul className="divided" style={{ marginTop: 8 }}>
            {p.tradeoffs.map(w => <li key={w.t} className="list-row"><span>{w.t}</span><Num className="list-row__cite">[{w.c}]</Num></li>)}
          </ul>
          <h3 className="h4" style={{ marginTop: 20 }}>Best for</h3>
          <div className="pill-row" style={{ marginTop: 10 }}>{p.bestFor.map(b => <span key={b}>{b}</span>)}</div>
        </section>
      </div>
    </>
  )
}

function Evidence() {
  const { s } = useApp()
  return (
    <>
      <h2 className="h2" style={{ marginTop: 16 }}>Who says so?</h2>
      <p className="lede">Sources are scored for independence, method and track record. Affiliate-only sites are excluded, and any commercial tie is flagged.</p>
      {data.sources.map(x => {
        const w = x.trust + '%'
        const ring = x.trust > 80 ? 'var(--teal)' : 'var(--amber)'
        return (
          <article key={x.n} id={'source-' + x.n} className={cx('source', s.hl === x.n && 'is-hl')}>
            <div>
              <div className="source__head"><span className="source__n">{x.n}</span><h3 className="source__outlet">{x.outlet}</h3></div>
              <div className="source__meta"><Num>{x.score}</Num> · {x.date} · {x.fund}</div>
              {x.flag && <span className="tag tag--red" style={{ marginTop: 10 }}><Icon name="flag" size={14} />{x.flag}</span>}
            </div>
            <div className="source__quote">
              <p>“{x.quote}”</p>
              <a className="link" href={sourceUrl(x.outlet)} target="_blank" rel="noreferrer">Find the original<Icon name="external" size={16} /></a>
            </div>
            <div className="trust">
              <div className="trust__ring" style={{ background: `conic-gradient(${ring} 0 ${w},var(--line) ${w} 100%)` }} role="img" aria-label={`Source trust ${x.trust} out of 100`}>
                <Num className="trust__inner">{x.trust}</Num>
              </div>
              <span className="small muted">Source trust<br />out of 100</span>
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
      <h2 className="h2" style={{ marginTop: 16 }}>Will it last?</h2>
      <div style={autoGrid(240, 16)}>
        {o.stats.map((st, i) => (
          <div key={st.k} className={blockClass([1, 3, 0][i])}>
            <div className="stat-v">{st.v}<small>{st.u}</small></div>
            <div className="stat-k">{st.k}</div>
            <div className="small">{st.n}</div>
          </div>
        ))}
      </div>
      <section className="card">
        <h3 className="h3">Recurring issues after a year or more</h3>
        <ul className="divided" style={{ marginTop: 8 }}>
          {o.issues.map(i => (
            <li key={i.t} className="issue">
              <span>{i.t} <span className="small muted">· <Num>{i.n}</Num> reports</span></span>
              <span className={'tag ' + (i.s === 'Unresolved' ? 'tag--amber' : 'tag--teal')}>{i.s}</span>
            </li>
          ))}
        </ul>
      </section>
      <div style={autoGrid(340, 16)}>
        {o.owners.map(ow => (
          <figure key={ow.name} className="panel panel--tint owner-quote">
            <blockquote>“{ow.text}”</blockquote>
            <figcaption><span className="avatar avatar--36">{ow.i}</span><b>{ow.name}</b><span className="muted">{ow.time}</span><span className="verified"><Icon name="shield" size={16} />Verified owner</span></figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}

const RANGES: Record<PriceRange, { span: string; noun: string; v: number[]; l: string[]; full: string[]; every: number }> = {
  Weekly: { span: 'the last 7 days', noun: 'this week', v: pr.week, l: pr.weekDays, full: pr.weekDays, every: 1 },
  Monthly: { span: 'the last 30 days', noun: 'this month', v: pr.month, l: pr.month.map((_, i) => i === 29 ? 'Today' : (29 - i) + 'd'), full: pr.month.map((_, i) => i === 29 ? 'today' : (29 - i) + ' days ago'), every: 5 },
  Yearly: { span: 'the last 12 months', noun: 'this year', v: pr.history, l: pr.months, full: pr.monthsFull, every: 1 },
}

/** Line chart geometry in a 0–100 box; prices are in thousands of रू. */
function chartFor(range: PriceRange) {
  const { span, noun, v, l, full, every } = RANGES[range]
  const n = v.length, hi = Math.max(...v), lo = Math.min(...v), pad = 14
  const X = (i: number) => (i / (n - 1)) * 100
  const Y = (x: number) => pad + ((hi - x) / ((hi - lo) || 1)) * (100 - pad * 2)
  const hiI = v.indexOf(hi), loI = v.lastIndexOf(lo)
  // Keep marker labels inside the chart near its left and right edges.
  const tf = (i: number) => X(i) < 12 ? 'translate(0,-50%)' : X(i) > 88 ? 'translate(-100%,-50%)' : 'translate(-50%,-50%)'
  const pts = v.map((x, i) => X(i).toFixed(2) + ',' + Y(x).toFixed(2)).join(' ')
  return {
    span, noun, pts, area: 'M0,100 L' + pts.split(' ').join(' L') + ' L100,100 Z',
    high: { x: X(hiI), y: Y(hi), v: npr(hi * 1000), l: full[hiI], tf: tf(hiI) },
    low: { x: X(loI), y: Y(lo), v: npr(lo * 1000), l: full[loI], tf: tf(loI) },
    ticks: l.map((t, i) => ({ t, x: X(i), i })).filter(t => t.i % every === 0 || t.i === n - 1),
  }
}

function Pricing() {
  const { s, set } = useApp()
  const drop = npr((Number(pr.high.replace(/,/g, '')) - Number(p.price.replace(/,/g, ''))))
  const c = chartFor(s.range)
  return (
    <>
      <section className="panel panel--amber">
        <span className="tag tag--neutral" style={{ background: 'var(--paper)' }}><Icon name="check" size={14} />{pr.signal}</span>
        <h2 className="timing__answer">Yes, mostly.</h2>
        <p className="timing__text"><Num>रू {drop}</Num> under its 12-month high. The all-time low was <Num>रू {pr.low}</Num> during {pr.lowWhen}, so it may dip again.</p>
        <div className="chart-head">
          <h3 className="h4">Price over {c.span}</h3>
          <div className="range-tabs" role="tablist" aria-label="Price range" onKeyDown={arrowNav}>
            {(['Weekly', 'Monthly', 'Yearly'] as const).map(r => (
              <button key={r} type="button" role="tab" aria-selected={s.range === r} tabIndex={s.range === r ? 0 : -1} className={cx('range-tab', s.range === r && 'is-on')} onClick={() => set({ range: r })}>{r}</button>
            ))}
          </div>
        </div>
        <div className="chart" role="img" aria-label={`Price over ${c.span}: highest रू ${c.high.v} (${c.high.l}), lowest रू ${c.low.v} (${c.low.l}), today रू ${p.price}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line x1="0" x2="100" y1={c.low.y} y2={c.low.y} className="chart__ref chart__ref--low" vectorEffect="non-scaling-stroke" />
            <line x1="0" x2="100" y1={c.high.y} y2={c.high.y} className="chart__ref chart__ref--high" vectorEffect="non-scaling-stroke" />
            <path d={c.area} className="chart__area" />
            <polyline points={c.pts} className="chart__line" vectorEffect="non-scaling-stroke" />
          </svg>
          {(['high', 'low'] as const).map(k => (
            <div key={k} aria-hidden>
              <div className={`chart__dot chart__dot--${k}`} style={{ left: c[k].x + '%', top: c[k].y + '%' }} />
              <div className={`chart__label chart__label--${k} num`} style={{ left: c[k].x + '%', top: c[k].y + '%', transform: c[k].tf }}>
                {k === 'high' ? 'High' : 'Low'} रू {c[k].v}
              </div>
            </div>
          ))}
        </div>
        <div className="chart__ticks num" aria-hidden>
          {c.ticks.map(t => <span key={t.i} style={{ left: t.x + '%' }}>{t.t}</span>)}
        </div>
        <div className="price-pills">
          <span className="price-pill price-pill--low"><Icon name="down" size={16} />Lowest {c.noun} · <Num>रू {c.low.v}</Num> · {c.low.l}</span>
          <span className="price-pill price-pill--high"><Icon name="up" size={16} />Highest {c.noun} · <Num>रू {c.high.v}</Num> · {c.high.l}</span>
          <span className="price-pill price-pill--today">Today · <Num>रू {p.price}</Num></span>
        </div>
      </section>
      <section aria-labelledby="where-h" className="stack">
        <h2 id="where-h" className="h3" style={{ marginTop: 16 }}>Where to buy</h2>
        <div style={autoGrid(240, 12)}>
          {data.retailers.map(r => (
            <div key={r.name} className="retailer">
              <h3 className="h4">{r.name}</h3>
              <Num className="retailer__price">रू {r.price}</Num>
              <div className="small muted">{r.stock}</div>
              <div className="small muted">{affLabel(r.aff)}</div>
              <button type="button" className="btn btn--outline" onClick={() => set({ sheet: 'retail', retail: r.name })}>Visit {r.name}<Icon name="external" size={16} /></button>
            </div>
          ))}
        </div>
      </section>
      <button type="button" className="alert-banner" onClick={() => set({ sheet: 'alert' })}>
        <div className="stack" style={{ gap: 4 }}>
          <div className="h4">{s.alertSet ? `Alert set at रू ${npr(s.alertT)}. Change it` : 'Not ready? Save it and set a price alert'}</div>
          <div className="small" style={{ color: 'var(--on-dark)' }}>We’ll tell you when it hits your price. No other emails.</div>
        </div>
        <Icon name="arrowRight" size={26} />
      </button>
    </>
  )
}

function HubCommunity() {
  const { go } = useApp()
  return (
    <>
      <div className="section-head" style={{ marginTop: 16, alignItems: 'center' }}>
        <h2 className="h2">What do owners say?</h2>
        <button type="button" className="btn btn--outline" onClick={() => go('review', { rDone: false })}>Own one? Write a review</button>
      </div>
      <div className="masonry">
        {data.reviews.map(c => (
          <article key={c.name} className="card review-card">
            <div className="review-card__top">
              {c.verified ? <span className="verified"><Icon name="shield" size={16} />Verified owner</span> : <span className="tag tag--neutral">{c.kind}</span>}
              <span className="muted">{c.owned}</span>
            </div>
            <h3 className="h3">{c.title}</h3>
            <p className="muted">{c.text}</p>
            <div className="review-card__foot"><span>{c.name}{c.updated && ` · ${c.updated}`}</span><span className="row" style={{ gap: 4 }}><Icon name="thumb" size={16} /><Num>{c.helpful}</Num> found helpful</span></div>
          </article>
        ))}
      </div>
    </>
  )
}
