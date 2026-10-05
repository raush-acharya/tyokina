import { catalog, data } from '../data'
import { useApp } from '../state'
import { blockClass, stageClass } from '../lib/theme'
import { Icon } from '../components/Icon'
import { Num } from '../components/ui'
import { nb } from '../lib/format'

const POPULAR = ['Headphones', 'Laptops', 'Phones', 'TVs']

export function Home() {
  const { s, set, go, openProduct, openHubTab } = useApp()
  const ql = s.q.trim().toLowerCase()

  const products = Object.values(catalog).filter(p => (p.brand + ' ' + p.name + ' ' + p.cat).toLowerCase().includes(ql))
  const guides = data.guides.map((g, i) => ({ ...g, i })).filter(g => (g.t + ' ' + g.tag).toLowerCase().includes(ql))

  return (
    <main className="page" data-screen-label="Home">
      <div className="home-hero">
        <h1 className="display">What are<br />you buying<span className="accent">?</span></h1>
        <form className="search" role="search" onSubmit={e => e.preventDefault()}>
          <input value={s.q} onChange={e => set({ q: e.target.value })} placeholder="Search products, brands or guides" aria-label="Search products, brands or guides" />
          {/* One type="button" control: a submit button that re-renders mid-click would resubmit the form. */}
          <button type="button" className="search__btn" aria-label={ql ? 'Clear search' : 'Search'}
            onClick={() => ql ? set({ q: '' }) : document.querySelector<HTMLInputElement>('.search input')?.focus()}>
            <Icon name={ql ? 'close' : 'search'} size={22} />
          </button>
        </form>
        {!ql && (
          <div className="suggest">
            <span className="small muted">Popular:</span>
            {POPULAR.map(c => <button key={c} type="button" className="chip" onClick={() => set({ q: c })}>{c}</button>)}
          </div>
        )}
      </div>

      {ql ? (
        <div className="results" aria-live="polite">
          {products.length + guides.length === 0 ? (
            <div className="empty">
              <h2 className="h4">No products or guides match “{s.q.trim()}”</h2>
              <p className="muted">Check the spelling, try a brand or a category, or browse what we cover.</p>
              <div className="chip-row">
                {POPULAR.map(c => <button key={c} type="button" className="chip" onClick={() => set({ q: c })}>{c}</button>)}
                <button type="button" className="chip" onClick={() => go('explore')}>All categories</button>
              </div>
            </div>
          ) : (
            <>
              {products.length > 0 && (
                <section className="results__group" aria-label="Products">
                  <h2 className="label">Products · <Num>{products.length}</Num></h2>
                  {products.map(r => (
                    <button key={r.id} type="button" className="result-row" onClick={() => openProduct(r.id)}>
                      <div>
                        <div className="result-row__name">{r.brand} {nb(r.name)}</div>
                        <div className="result-row__meta">{r.cat} · {r.note}</div>
                      </div>
                      <div className="result-row__nums">
                        {r.price && <Num>रू {r.price}</Num>}
                        {r.score && <div className="result-row__score">Evidence <Num>{r.score}</Num></div>}
                      </div>
                    </button>
                  ))}
                </section>
              )}
              {guides.length > 0 && (
                <section className="results__group" aria-label="Buying guides">
                  <h2 className="label">Buying guides</h2>
                  {guides.map(g => (
                    <button key={g.t} type="button" className="result-row" onClick={() => go('guide', { guide: g.i })}>
                      <div>
                        <div className="result-row__name">{g.t}</div>
                        <div className="result-row__meta">{g.meta}</div>
                      </div>
                      <Icon name="arrowRight" />
                    </button>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <section className="section" aria-labelledby="continue-h">
            <h2 id="continue-h" className="h3">Pick up where you left off</h2>
            <div className="grid" style={{ '--min': '320px' } as React.CSSProperties}>
              {data.continueR.map((c, i) => (
                <button key={c.name} type="button" className="continue-card lift" onClick={() => i === 0 ? openHubTab('pricing') : openProduct(c.id)}>
                  <div className="continue-card__top">
                    <span className={'tag ' + stageClass[c.stage]}>{c.stage}</span>
                    <Icon name="arrowRight" />
                  </div>
                  <div className="continue-card__name">{nb(c.name)}</div>
                  <div className="stack" style={{ gap: 8 }}>
                    <div className="progress" role="progressbar" aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.name}: research ${c.pct}% done`}>
                      <div className="progress__fill" style={{ width: c.pct + '%' }} />
                    </div>
                    <div className="small muted">{c.step}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="section panel panel--amber" aria-labelledby="drops-h">
            <div className="section-head">
              <h2 id="drops-h" className="h2">Price drops worth knowing</h2>
              <span className="small">Compared with each product’s last 12 months</span>
            </div>
            <div className="grid" style={{ '--min': '240px', gap: 12 } as React.CSSProperties}>
              {data.drops.map(d => (
                <button key={d.name} type="button" className="drop-card" onClick={() => openProduct(d.id)}>
                  <div className="drop-card__name">{nb(d.name)}</div>
                  <div className="drop-card__nums"><Num className="drop-card__price">रू {d.price}</Num><span className="drop-card__delta"><Num>{d.d}</Num></span></div>
                  <div className="small muted">{d.note}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="section" aria-labelledby="trend-h">
            <div className="section-head">
              <h2 id="trend-h" className="h2">Trending research</h2>
              <button type="button" className="link" onClick={() => go('explore')}>Explore categories and guides<Icon name="arrowRight" size={18} /></button>
            </div>
            <div className="grid" style={{ '--min': '250px' } as React.CSSProperties}>
              {data.trending.map((t, i) => (
                <button key={t.name} type="button" className={blockClass(i) + ' trend-card lift'} onClick={() => openProduct(t.id)}>
                  <div className="trend-card__top"><span>{t.cat}</span><Num>रू {t.price}</Num></div>
                  <div>
                    <div className="trend-card__score">{t.score}<small>evidence score</small></div>
                    <div className="trend-card__name">{t.brand} {nb(t.name)}</div>
                    <div className="small">{t.note}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}
