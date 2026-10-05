import { useEffect, useRef, useState } from 'react'
import { catalog, data, xm5Meets, type Spec } from '../data'
import { strongestIdx } from '../lib/compare'
import { blockClass } from '../lib/theme'
import { useApp } from '../state'
import { Icon } from '../components/Icon'
import { ProductPhoto } from '../components/ProductPhoto'
import { Num, cx } from '../components/ui'
import { nb } from '../lib/format'

/** Plain-language help for spec terms buyers may not know. */
const SPEC_INFO: Record<string, string> = {
  'Noise cancellation': 'Lab score out of 10 for how much outside noise is blocked. Higher is quieter.',
  'Battery': 'Hours of playback with noise cancellation on, from lab tests.',
  'Folds flat': 'Whether the ear cups fold so the headphones lie flat in a bag.',
  'Multipoint': 'Stays connected to two devices at once, like your laptop and phone.',
  'Hi-res audio': 'LDAC sends more audio detail over Bluetooth. It works with most Android phones, not iPhones.',
  'Reliability (1 yr+)': 'How owners rate the product after a year of use, out of 5.',
  'Top issue': 'The problem owners report most often after a year.',
  'Verified owners': 'Owners who linked a receipt or retailer order.',
  'Vs 12-month high': 'How far today’s price is below the highest price of the last year.',
  'Evidence score': 'How much independent evidence backs the product, out of 10.',
  'Warranty in Nepal': 'Warranty from authorised dealers. Grey imports usually have none.',
}

export function Compare() {
  const { s, set, go, openProduct, toast } = useApp()
  const [info, setInfo] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [addQ, setAddQ] = useState('')
  const [stuck, setStuck] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const cols = s.cmp.map(id => data.compare.find(c => c.id === id)!).filter(Boolean)
  const colIdx = cols.map(c => data.compare.indexOf(c))
  const gridCols = { gridTemplateColumns: `repeat(${cols.length},minmax(0,1fr))` }
  const tableVars = { '--n': cols.length } as React.CSSProperties
  const sameCount = data.specs.filter(x => x.same).length

  // Rows tied to the buyer's headphone priorities are marked and listed first in their group.
  const mine = new Set((s.prios.Headphones ?? []).map(p => xm5Meets[p]?.spec).filter(Boolean))
  const groups: { g: string; rows: Spec[] }[] = []
  for (const sp of data.specs) {
    if (sp.same && !s.showSame) continue
    let g = groups.find(x => x.g === sp.g)
    if (!g) groups.push(g = { g: sp.g, rows: [] })
    g.rows.push(sp)
  }
  for (const g of groups) g.rows.sort((a, b) => Number(mine.has(b.k)) - Number(mine.has(a.k)))

  // Keep product names in view once the column headers scroll away.
  useEffect(() => {
    const onScroll = () => {
      const head = headRef.current?.getBoundingClientRect(), table = tableRef.current?.getBoundingClientRect()
      setStuck(!!head && !!table && head.bottom < 0 && table.bottom > 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const syncBar = () => { if (barRef.current && scrollRef.current) barRef.current.scrollLeft = scrollRef.current.scrollLeft }

  // Same-category candidates for the add picker; only some have comparison data yet.
  const ql = addQ.trim().toLowerCase()
  const candidates = Object.values(catalog)
    .filter(c => c.cat === 'Headphones' && !s.cmp.includes(c.id))
    .filter(c => (c.brand + ' ' + c.name).toLowerCase().includes(ql))

  return (
    <main className="page" data-screen-label="Compare">
      <div className="page-head">
        <h1 className="display">Which one<br />suits <span className="accent">you?</span></h1>
        <p className="lede">No winners and no “recommended”. Each one suits a different buyer, so we only show where they differ.</p>
      </div>

      <div className="cmp-sticky" aria-hidden>
        <div ref={barRef} className={cx('cmp-sticky__bar', stuck && 'is-on')}>
          <div className="compare-table" style={tableVars}>
            <div className="compare-row compare-row--mini">
              <span />
              <div className="compare-cells" style={gridCols}>
                {cols.map((c, k) => <span key={c.id} className={blockClass(k) + ' cmp-mini'}>{c.brand} {nb(c.name)}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="compare-scroll" ref={scrollRef} onScroll={syncBar}>
        <div className="compare-table" role="table" aria-label="Product comparison" style={tableVars} ref={tableRef}>
          <div className="compare-row compare-row--head" role="row" ref={headRef}>
            <span role="columnheader" className="label" style={{ justifyContent: 'flex-end' }}>Spec</span>
            <div className="compare-cells" style={gridCols}>
              {cols.map((c, k) => (
                <div key={c.id} role="columnheader" className={blockClass(k) + ' cmp-col'}>
                  <div className="cmp-col__top">
                    <span>{c.brand}</span>
                    <button type="button" aria-label={`Remove ${c.name}`} className="cmp-col__remove"
                      onClick={() => cols.length > 2 ? set({ cmp: s.cmp.filter(x => x !== c.id) }) : toast('Compare needs at least 2 products')}><Icon name="close" size={18} /></button>
                  </div>
                  <div className="cmp-col__name">{nb(c.name)}</div>
                  <div className="cmp-col__fit">Suits {c.fit.charAt(0).toLowerCase() + c.fit.slice(1)}</div>
                  <button type="button" className="link" onClick={() => openProduct(c.id)}>Open research<Icon name="arrowRight" size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {groups.map(gr => (
            <div key={gr.g} role="rowgroup">
              <div role="row"><div role="rowheader" className="compare-group">{gr.g}</div></div>
              {gr.rows.map(r => {
                const vals = colIdx.map(i => r.v[i])
                const strongest = strongestIdx(r.k, vals)
                const help = SPEC_INFO[r.k]
                return (
                  <div key={r.k} className="compare-row" role="row">
                    <span role="rowheader" className="compare-row__k">
                      <span className="compare-row__label">
                        {r.k}
                        {help && (
                          <button type="button" className="info-btn" aria-expanded={info === r.k} aria-label={`What does ${r.k} mean?`}
                            onClick={() => setInfo(info === r.k ? null : r.k)}><Icon name="info" size={16} /></button>
                        )}
                      </span>
                      {mine.has(r.k) && <span className="yours">Your priority</span>}
                      {info === r.k && <span className="spec-help small">{help}</span>}
                    </span>
                    <div className="compare-cells" style={gridCols}>
                      {vals.map((v, j) => (
                        <span key={j} role="cell" className={cx('cmp-cell num', j === strongest && 'is-strongest')}>
                          {v}{j === strongest && <span className="sr-only"> (strongest here)</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="compare-tools">
        <span className="legend"><span className="legend__swatch" aria-hidden />Strongest in that row</span>
        <button type="button" className="pill-btn" onClick={() => set({ showSame: !s.showSame })}>
          {s.showSame ? 'Hide identical specs' : `Show ${sameCount} identical specs`}
        </button>
        {cols.length < 3 && (
          <button type="button" className="pill-btn" style={{ borderStyle: 'dashed' }} aria-expanded={adding} onClick={() => { setAdding(!adding); setAddQ('') }}>
            <Icon name="plus" size={18} />Add a product
          </button>
        )}
      </div>

      {adding && cols.length < 3 && (
        <section className="card adder" aria-labelledby="add-h">
          <div className="section-head" style={{ alignItems: 'center' }}>
            <h2 id="add-h" className="h4">Add headphones to compare</h2>
            <button type="button" className="icon-btn" aria-label="Close" onClick={() => setAdding(false)}><Icon name="close" /></button>
          </div>
          <label className="sr-only" htmlFor="add-q">Search headphones</label>
          <input id="add-q" className="adder__input" value={addQ} onChange={e => setAddQ(e.target.value)} placeholder="Search headphones" autoFocus />
          <ul className="divided">
            {candidates.map(c => {
              const ready = data.compare.some(x => x.id === c.id)
              return (
                <li key={c.id}>
                  <button type="button" className="adder__row" disabled={!ready}
                    onClick={() => { set({ cmp: [...s.cmp, c.id] }); setAdding(false); toast(`Added ${c.brand} ${c.name}`) }}>
                    <ProductPhoto pid={c.id} name={`${c.brand} ${c.name}`} size="sm" />
                    <span className="adder__name"><b>{c.brand} {nb(c.name)}</b><span className="small muted">{ready ? <>रू <Num>{c.price}</Num></> : 'No comparison data yet'}</span></span>
                    {ready && <Icon name="plus" />}
                  </button>
                </li>
              )
            })}
            {candidates.length === 0 && <li className="small muted" style={{ padding: '12px 0' }}>No other headphones match “{addQ.trim()}”.</li>}
          </ul>
        </section>
      )}

      <section className="panel panel--navy on-dark section">
        <h2 className="h3">The trade-offs in plain words</h2>
        <p className="score-panel__summary" style={{ marginTop: 0 }}>{data.tradeSummary}</p>
      </section>
      <div className="center" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn--dark btn--lg" onClick={() => go('decide')}>Leaning Sony? Check the evidence<Icon name="arrowRight" /></button>
      </div>
    </main>
  )
}
