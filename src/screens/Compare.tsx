import { data, type Spec } from '../data'
import { strongestIdx } from '../lib/compare'
import { palette, swatch } from '../lib/theme'
import { useApp } from '../state'
import { cx } from '../components/ui'

export function Compare() {
  const { s, set, go, toast } = useApp()
  const cols = s.cmp.map(id => data.compare.find(c => c.id === id)!).filter(Boolean)
  const colIdx = cols.map(c => data.compare.indexOf(c))
  const gridCols = { gridTemplateColumns: `repeat(${cols.length},minmax(0,1fr))` }
  const sameCount = data.specs.filter(x => x.same).length

  const groups: { g: string; rows: Spec[] }[] = []
  for (const sp of data.specs) {
    if (sp.same && !s.showSame) continue
    let g = groups.find(x => x.g === sp.g)
    if (!g) groups.push(g = { g: sp.g, rows: [] })
    g.rows.push(sp)
  }

  return (
    <main className="page" data-screen-label="Compare">
      <h1 className="display">Which one<br />suits <span className="q-amber-dk">you?</span></h1>
      <p className="compare-lede">No winners, no “recommended”. Each one suits a different buyer — only the differences are shown.</p>

      <div className="compare-scroll">
        <div className="compare-table" role="table" aria-label="Product comparison">
          <div className="compare-row compare-row--head" role="row">
            <span role="columnheader" />
            <div className="compare-cells" style={gridCols}>
              {cols.map((c, k) => (
                <div key={c.id} role="columnheader" className="cmp-col" style={swatch(palette[k])}>
                  <div className="cmp-col__top">
                    <span>{c.brand}</span>
                    <button type="button" aria-label={`Remove ${c.name}`} className="cmp-col__remove"
                      style={{ borderColor: k === 1 ? 'rgba(12,14,26,0.2)' : 'rgba(255,255,255,0.22)' }}
                      onClick={() => cols.length > 2 ? set({ cmp: s.cmp.filter(x => x !== c.id) }) : toast('Compare needs at least 2 products')}>×</button>
                  </div>
                  <div className="cmp-col__name">{c.name}</div>
                  <div className="cmp-col__fit">Suits: {c.fit}</div>
                  <button type="button" className="cmp-col__open" onClick={() => go('hub', { tab: 'summary' })}>Open Research Hub →</button>
                </div>
              ))}
            </div>
          </div>

          {groups.map(gr => (
            <div key={gr.g} role="rowgroup">
              <div className="kicker kicker--dark compare-group">{gr.g.toUpperCase()}</div>
              {gr.rows.map(r => {
                const vals = colIdx.map(i => r.v[i])
                const strongest = strongestIdx(r.k, vals)
                return (
                  <div key={r.k} className="compare-row" role="row">
                    <span role="rowheader" className="compare-row__k">{r.k}</span>
                    <div className="compare-cells" style={gridCols}>
                      {vals.map((v, j) => (
                        <span key={j} role="cell" className={cx('cmp-cell', j === strongest && 'is-strongest')}>
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
        <span className="strongest-key"><span className="strongest-key__swatch" aria-hidden />Strongest here</span>
        <button type="button" className="tool-pill" onClick={() => set({ showSame: !s.showSame })}>
          {s.showSame ? 'Hide identical specs' : `Show ${sameCount} identical specs`}
        </button>
        {cols.length < 3 && (
          <button type="button" className="tool-pill tool-pill--dashed" onClick={() => set({ cmp: data.compare.map(c => c.id) })}>+ Add a product</button>
        )}
      </div>

      <section className="trade-panel">
        <div className="kicker kicker--amber">TRADE-OFFS IN PLAIN LANGUAGE</div>
        <p>{data.tradeSummary}</p>
      </section>
      <div className="center mt-28">
        <button type="button" className="pill-btn pill-btn--dark pill-btn--xl" onClick={() => go('decide')}>Leaning Sony? Check the evidence →</button>
      </div>
    </main>
  )
}
