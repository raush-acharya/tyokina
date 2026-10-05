import { data, xm5Meets, type Spec } from '../data'
import { strongestIdx } from '../lib/compare'
import { blockClass } from '../lib/theme'
import { useApp } from '../state'
import { Icon } from '../components/Icon'
import { cx } from '../components/ui'
import { nb } from '../lib/format'

export function Compare() {
  const { s, set, go, openProduct, toast } = useApp()
  const cols = s.cmp.map(id => data.compare.find(c => c.id === id)!).filter(Boolean)
  const colIdx = cols.map(c => data.compare.indexOf(c))
  const gridCols = { gridTemplateColumns: `repeat(${cols.length},minmax(0,1fr))` }
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

  return (
    <main className="page" data-screen-label="Compare">
      <div className="page-head">
        <h1 className="display">Which one<br />suits <span className="accent">you?</span></h1>
        <p className="lede">No winners and no “recommended”. Each one suits a different buyer, so we only show where they differ.</p>
      </div>

      <div className="compare-scroll">
        <div className="compare-table" role="table" aria-label="Product comparison" style={{ '--n': cols.length } as React.CSSProperties}>
          <div className="compare-row compare-row--head" role="row">
            <span role="columnheader" className="label" style={{ alignSelf: 'end' }}>Spec</span>
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
                return (
                  <div key={r.k} className="compare-row" role="row">
                    <span role="rowheader" className="compare-row__k">{r.k}{mine.has(r.k) && <span className="yours">Your priority</span>}</span>
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
          <button type="button" className="pill-btn" style={{ borderStyle: 'dashed' }} onClick={() => set({ cmp: data.compare.map(c => c.id) })}><Icon name="plus" size={18} />Add a product</button>
        )}
      </div>

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
