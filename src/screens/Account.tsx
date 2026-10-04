import { data } from '../data'
import { autoGrid, palette, stageBg, swatch } from '../lib/theme'
import { useApp, type AppState } from '../state'
import { BackLink, ChipRow, Kicker, cx } from '../components/ui'

export function Saved() {
  const { s, set, go } = useApp()
  const goHub = () => go('hub', { tab: 'summary' })
  const cols = data.collections.filter(c => s.stageF === 'All' || c.stage === s.stageF)
  return (
    <main className="page" data-screen-label="Saved">
      <h1 className="display">Still<br />thinking.</h1>
      <p className="saved-lede">3 collections · 12 products · 2 price alerts</p>
      <div className="mt-28">
        <ChipRow label="Filter by research stage" options={['All', 'Deep research', 'Comparing', 'Saved']} value={s.stageF} onChange={v => set({ stageF: v })} />
      </div>
      <div style={autoGrid(300, 16)} className="mt-20">
        {cols.map(c => (
          <button key={c.name} type="button" className="collection" onClick={goHub}>
            <div className="collection__top"><span className="stage-tag" style={{ background: stageBg[c.stage] }}>{c.stage}</span><span className="mono-12 muted">{c.updated}</span></div>
            <div><div className="collection__name">{c.name}</div><div className="collection__n">{c.n} products</div></div>
          </button>
        ))}
      </div>
      <div style={autoGrid(360, 16)} className="mt-16">
        <div className="saved-block saved-block--amber">
          <h2 className="saved-block__title">Watching prices</h2>
          {data.alerts.map(a => (
            <div key={a.name} className="alert-row"><span className="alert-row__name">{a.name}</span><span className="alert-row__nums">रू {a.now} → रू {a.target}</span></div>
          ))}
        </div>
        <div className="saved-block saved-block--lav">
          <h2 className="saved-block__title">Research history</h2>
          {data.history.map(h => (
            <button key={h.t} type="button" className="history-row" onClick={goHub}><span className="history-row__t">{h.t}</span><span className="history-row__d">{h.d}</span></button>
          ))}
        </div>
      </div>
    </main>
  )
}

const TOGGLES: [keyof AppState['priv'], string][] = [
  ['pub', 'Show my reviews publicly'],
  ['anon', 'Share anonymised data for insight reports'],
  ['checkins', 'Ownership check-ins at 3, 6, 12 months'],
]

export function Profile() {
  const { s, set, go } = useApp()
  const u = data.user
  return (
    <main className="page page--960" data-screen-label="Profile">
      <section className="profile-card">
        <div className="profile-card__id">
          <span className="profile-card__avatar">{u.initials}</span>
          <div><div className="profile-card__name">{u.name}</div><div className="profile-card__since">{u.since} · {u.region}</div></div>
        </div>
        <div className="profile-stats">
          <div><div className="profile-stats__v">{u.rep}</div><div className="profile-stats__k">Helpful votes</div></div>
          <div><div className="profile-stats__v">{u.reviews}</div><div className="profile-stats__k">Reviews</div></div>
          <div><div className="profile-stats__v">{u.answers}</div><div className="profile-stats__k">Answers</div></div>
        </div>
        <div className="profile-badges">{u.badges.map(b => <span key={b}>{b}</span>)}</div>
      </section>
      <div className="settings">
        <div className="settings__row"><span className="settings__t">Region & currency</span><span className="settings__v">Nepal · रू NPR</span></div>
        {TOGGLES.map(([k, t]) => (
          <button key={k} type="button" role="switch" aria-checked={s.priv[k]} className="settings__row settings__row--btn"
            onClick={() => set({ priv: { ...s.priv, [k]: !s.priv[k] } })}>
            <span className="settings__t">{t}</span>
            <span className={cx('switch', s.priv[k] && 'is-on')} aria-hidden><span /></span>
          </button>
        ))}
        <button type="button" className="settings__row settings__row--btn" onClick={() => go('how')}><span className="settings__t">How TyoKina works</span><span className="settings__arrow">→</span></button>
        <button type="button" className="settings__row settings__row--btn settings__row--last" onClick={() => go('notes')}><span className="settings__t">Notifications</span><span className="settings__arrow">→</span></button>
      </div>
      <div className="center mt-20"><button type="button" className="sign-out">Sign out</button></div>
    </main>
  )
}

export function How() {
  return (
    <main className="page page--1000" data-screen-label="How TyoKina works">
      <div className="etymology">त्यो “that” + किन / किन्न “why / buy”</div>
      <h1 className="display display--how">Buy that?<br /><span className="q-amber-dk">Why that?</span></h1>
      <p className="how-lede">TyoKina helps you answer both — which product, and the evidence behind it. Here's exactly how.</p>
      <div className="mt-40">
        {data.how.map((h, i) => (
          <div key={h.t} className="how-row" style={autoGrid(260)}>
            <div className="how-row__head"><span className="how-row__n">0{i + 1}</span><h2 className="how-row__t">{h.t}</h2></div>
            <p className="how-row__d">{h.d}</p>
          </div>
        ))}
      </div>
      <div className="never">
        <Kicker className="kicker--amber">WHAT WE'LL NEVER DO</Kicker>
        <div style={autoGrid(220, 16)} className="never__grid">
          <span>Sell sponsored placements</span><span>Let affiliate deals change scores</span><span>Declare a forced winner</span><span>Hide what we don't know</span>
        </div>
      </div>
    </main>
  )
}

export function Explore() {
  const { go } = useApp()
  return (
    <main className="page" data-screen-label="Explore">
      <h1 className="display">Start with<br />a <span className="q-amber-dk">category.</span></h1>
      <div style={autoGrid(220, 12)} className="mt-36">
        {data.categories.map((c, i) => (
          <button key={c.n} type="button" className="cat-card" style={swatch(palette[i % 4])} onClick={() => go('guide', { guide: 0 })}>
            <span className="mono-12">{c.c} products</span><span className="cat-card__n">{c.n}</span>
          </button>
        ))}
      </div>
      <h2 className="guides-title">Buying guides</h2>
      <p className="guides-lede">Built from evidence — every guide says how it's funded.</p>
      {data.guides.map((g, i) => (
        <button key={g.t} type="button" className="guide-row" style={autoGrid(280)} onClick={() => go('guide', { guide: i })}>
          <div><div className="guide-row__tag">{g.tag}</div><div className="guide-row__t">{g.t}</div></div>
          <div className="guide-row__meta">{g.meta}<br /><span className="mono">{g.fund}</span></div>
        </button>
      ))}
    </main>
  )
}

export function Guide() {
  const { s, set, go, toast } = useApp()
  const g = data.guides[s.guide]
  return (
    <main className="page page--1000" data-screen-label="Buying guide">
      <BackLink onClick={() => go('explore')}>← Explore</BackLink>
      <div className="guide-kicker">BUYING GUIDE · {g.tag}</div>
      <h1 className="display display--guide">{g.t}</h1>
      <div className="guide-tags"><span className="guide-tags__meta">{g.meta}</span><span className="guide-tags__fund">Funding: {g.fund}</span></div>
      <p className="guide-lede">We shortlisted products with at least 3 independent expert reviews and 50+ verified owners. Pick 2–3 to compare side by side.</p>
      <div className="guide-list">
        {data.compare.map((c, i) => {
          const on = s.picks.includes(i)
          return (
            <div key={c.id} className="guide-product">
              <button type="button" aria-pressed={on} aria-label={`Select ${c.name} to compare`} className={cx('pick', on && 'is-on')}
                onClick={() => set({ picks: on ? s.picks.filter(x => x !== i) : [...s.picks, i] })}>{on ? '✓' : '+'}</button>
              <div className="guide-product__body">
                <div className="mono-12 muted">{c.brand} · रू {c.price}</div>
                <div className="guide-product__name">{c.name}</div>
                <div className="guide-product__fit">Suits: {c.fit}</div>
              </div>
              <button type="button" className="text-link text-link--15" onClick={() => go('hub', { tab: 'summary' })}>Research Hub →</button>
            </div>
          )
        })}
      </div>
      <button type="button" className="block-cta mt-20" onClick={() => {
        if (s.picks.length < 2) return toast('Pick 2–3 products to compare')
        go('compare', { cmp: [...s.picks].sort().map(i => data.compare[i].id) })
      }}>Compare {s.picks.length} selected</button>
    </main>
  )
}
