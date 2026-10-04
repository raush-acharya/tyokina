import { data, xm5Meets } from '../data'
import { useApp } from '../state'
import { autoGrid, palette, stageBg, swatch } from '../lib/theme'
import { Kicker } from '../components/ui'

export function Home() {
  const { s, set, go, openHubTab } = useApp()
  const ql = s.q.trim().toLowerCase()
  const goHub = () => go('hub', { tab: 'summary' })

  const results = data.trending.filter(t => (t.brand + ' ' + t.name + ' ' + t.cat).toLowerCase().includes(ql))
  const guides = data.guides.map((g, i) => ({ ...g, i })).filter(g => (g.t + g.tag).toLowerCase().includes(ql))

  return (
    <main className="page page--home" data-screen-label="Home">
      <h1 className="display display--home">What are<br />you buying<span className="q-amber">?</span></h1>
      <form className="search" role="search" onSubmit={e => { e.preventDefault(); if (!ql) set({ q: 'headphones' }) }}>
        <input value={s.q} onChange={e => set({ q: e.target.value })} placeholder="Search products, brands or guides" aria-label="Search" />
        {/* One type="button" control: a submit button that re-renders mid-click would resubmit the form. */}
        <button type="button" className="search__btn" aria-label={ql ? 'Clear search' : 'Search'} onClick={() => set({ q: ql ? '' : 'headphones' })}>
          {ql ? '×' : '→'}
        </button>
      </form>

      {ql ? (
        <div className="results">
          <Kicker className="results__label">PRODUCTS · {results.length}</Kicker>
          {results.map(r => (
            <button key={r.name} type="button" className="result-row" onClick={goHub}>
              <div>
                <div className="result-row__name">{r.brand} {r.name}</div>
                <div className="result-row__meta">{r.cat} · {r.note}</div>
              </div>
              <div className="result-row__nums">
                <div className="result-row__price">रू {r.price}</div>
                <div className="result-row__score">evidence {r.score}</div>
              </div>
            </button>
          ))}
          <Kicker className="results__label results__label--guides">BUYING GUIDES</Kicker>
          {guides.map(g => (
            <button key={g.t} type="button" className="result-guide" onClick={() => go('guide', { guide: g.i })}>
              {g.t} <span>· {g.meta}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <section className="home-section home-section--48">
            <Kicker className="home-kicker">PICK UP WHERE YOU LEFT OFF</Kicker>
            <div style={autoGrid(320, 16)}>
              {data.continueR.map((c, i) => (
                <button key={c.name} type="button" className="continue-card" onClick={() => i === 0 ? openHubTab('pricing') : go('compare')}>
                  <div className="continue-card__top">
                    <span className="stage-tag" style={{ background: stageBg[c.stage] }}>{c.stage}</span>
                    <span className="continue-card__arrow" aria-hidden>→</span>
                  </div>
                  <div className="continue-card__name">{c.name}</div>
                  <div>
                    <div className="progress" role="progressbar" aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Research progress">
                      <div className="progress__fill" style={{ width: c.pct + '%' }} />
                    </div>
                    <div className="continue-card__step">{c.step}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="home-section home-section--48">
            <Kicker className="home-kicker">WHAT MATTERS MOST TO YOU? · WE CHECK EVERY PRODUCT AGAINST IT</Kicker>
            <div className="prio-row" role="group" aria-label="Your priorities">
              {Object.keys(xm5Meets).map(t => {
                const on = s.prios.includes(t)
                return (
                  <button key={t} type="button" aria-pressed={on} className={'prio' + (on ? ' is-on' : '')}
                    onClick={() => set({ prios: on ? s.prios.filter(x => x !== t) : [...s.prios, t] })}>
                    {on && '✓ '}{t}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="drops">
            <div className="block-head">
              <h2 className="block-title">Price drops worth knowing</h2>
              <span className="mono-12">VS 12-MONTH HISTORY</span>
            </div>
            <div className="drops__grid" style={autoGrid(240, 12)}>
              {data.drops.map(d => (
                <button key={d.name} type="button" className="drop-card" onClick={goHub}>
                  <div className="drop-card__name">{d.name}</div>
                  <div className="drop-card__nums"><span className="drop-card__price">रू {d.price}</span><span className="drop-card__delta">{d.d}</span></div>
                  <div className="drop-card__note">{d.note}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="home-section home-section--56">
            <div className="block-head block-head--trending">
              <h2 className="block-title">Trending research</h2>
              <button type="button" className="text-link" onClick={() => go('explore')}>Explore categories & guides →</button>
            </div>
            <div style={autoGrid(250, 16)}>
              {data.trending.map((t, i) => (
                <button key={t.name} type="button" className="trend-card" style={swatch(palette[i])} onClick={goHub}>
                  <div className="trend-card__top"><span>{t.cat}</span><span>रू {t.price}</span></div>
                  <div>
                    <div className="trend-card__score">{t.score}</div>
                    <div className="trend-card__name">{t.brand} {t.name}</div>
                    <div className="trend-card__note">{t.note}</div>
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
