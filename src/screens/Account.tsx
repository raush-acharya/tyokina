import { useState } from 'react'
import { data } from '../data'
import { blockClass, stageClass } from '../lib/theme'
import { npr } from '../lib/format'
import { useApp, type AppState } from '../state'
import { Icon } from '../components/Icon'
import { BackLink, ChipRow, Num, cx } from '../components/ui'
import { ProductPhoto } from '../components/ProductPhoto'

export function Saved() {
  const { s, set, go, openProduct } = useApp()
  const cols = data.collections.filter(c => s.stageF === 'All' || c.stage === s.stageF)
  const products = data.collections.reduce((n, c) => n + c.n, 0)
  const alerts = data.alerts.map(a => a.pid === 'xm5' && s.alertSet ? { ...a, target: npr(s.alertT) } : a)
  const openCollection = (stage: string) => stage === 'Comparing' ? go('compare') : stage === 'Deep research' ? openProduct('xm5') : go('explore')
  return (
    <main className="page" data-screen-label="Saved">
      <div className="page-head">
        <h1 className="display">Still<br />thinking<span className="accent">.</span></h1>
        <p className="lede"><Num>{data.collections.length}</Num> collections · <Num>{products}</Num> products · <Num>{alerts.length}</Num> price alerts</p>
      </div>
      <ChipRow label="Filter by research stage" options={['All', 'Deep research', 'Comparing', 'Saved']} value={s.stageF} onChange={v => set({ stageF: v })} />
      <div className="grid" style={{ '--min': '300px' } as React.CSSProperties}>
        {cols.map(c => (
          <button key={c.name} type="button" className="card collection lift" onClick={() => openCollection(c.stage)}>
            <div className="collection__top"><span className={'tag ' + stageClass[c.stage]}>{c.stage}</span><span className="small muted">Updated {c.updated}</span></div>
            <div><div className="collection__name">{c.name}</div><div className="muted"><Num>{c.n}</Num> products</div></div>
          </button>
        ))}
      </div>
      <div className="grid" style={{ '--min': '360px' } as React.CSSProperties}>
        <section className="panel panel--amber">
          <h2 className="h3">Watching prices</h2>
          <ul className="divided divided--soft" style={{ marginTop: 8 }}>
            {alerts.map(a => (
              <li key={a.name}>
                <button type="button" className="data-row" onClick={() => openProduct(a.pid, 'pricing')}>
                  <span className="data-row__t">{a.name}</span>
                  <span className="small">Now <Num>रू {a.now}</Num> · alert at <Num>रू {a.target}</Num></span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel panel--tint">
          <h2 className="h3">Research history</h2>
          <ul className="divided" style={{ marginTop: 8 }}>
            {data.history.map(h => (
              <li key={h.t}>
                <button type="button" className="data-row" onClick={() => 'pid' in h && h.pid ? openProduct(h.pid) : go('guide', { guide: 0 })}>
                  <span className="data-row__t">{h.t}</span><span className="small muted">{h.d}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

const TOGGLES: [keyof AppState['priv'], string][] = [
  ['pub', 'Show my reviews publicly'],
  ['anon', 'Share anonymised data for insight reports'],
  ['checkins', 'Ownership check-ins at 3, 6 and 12 months'],
]

export function Profile() {
  const { s, set, go, toast } = useApp()
  const [confirm, setConfirm] = useState(false)
  const u = data.user
  return (
    <main className="page page--narrow" data-screen-label="Profile">
      <section className="panel panel--navy on-dark">
        <div className="profile-id">
          <span className="profile-avatar" aria-hidden>{u.initials}</span>
          <div className="stack" style={{ gap: 4 }}>
            <h1 className="display display--sm">{u.name}</h1>
            <p className="muted">{u.since} · {u.region}</p>
          </div>
        </div>
        <dl className="profile-stats">
          {[[u.rep, 'Helpful votes'], [u.reviews, 'Reviews'], [u.answers, 'Answers']].map(([v, k]) => (
            <div key={k}><dd className="profile-stats__v" style={{ margin: 0 }}>{v}</dd><dt className="small muted">{k}</dt></div>
          ))}
        </dl>
        <ul className="profile-badges">{u.badges.map(b => <li key={b}><span>{b}</span></li>)}</ul>
      </section>
      <section className="card settings divided" aria-label="Settings">
        <div className="settings__row"><span>Region and currency</span><span className="muted">Nepal · रू NPR</span></div>
        {TOGGLES.map(([k, t]) => (
          <button key={k} type="button" role="switch" aria-checked={s.priv[k]} className="settings__row"
            onClick={() => set({ priv: { ...s.priv, [k]: !s.priv[k] } })}>
            <span>{t}</span>
            <span className={cx('switch', s.priv[k] && 'is-on')} aria-hidden><span /></span>
          </button>
        ))}
        <button type="button" className="settings__row" onClick={() => go('how')}><span>How TyoKina works</span><Icon name="arrowRight" /></button>
        <button type="button" className="settings__row" onClick={() => go('notes')}><span>Notifications</span><Icon name="arrowRight" /></button>
      </section>
      {confirm ? (
        <div className="confirm" role="alertdialog" aria-labelledby="signout-q">
          <p id="signout-q">Sign out of TyoKina? Your research stays saved to your account.</p>
          <div className="row">
            <button type="button" className="btn btn--dark" onClick={() => { setConfirm(false); toast('Signed out. This preview keeps you signed in.') }}>Sign out</button>
            <button type="button" className="btn btn--quiet" onClick={() => setConfirm(false)} autoFocus>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="center"><button type="button" className="link danger" onClick={() => setConfirm(true)}>Sign out</button></div>
      )}
    </main>
  )
}

export function How() {
  return (
    <main className="page page--narrow" data-screen-label="How TyoKina works">
      <div className="page-head">
        <h1 className="display">Buy that?<br /><span className="accent">Why that?</span></h1>
        <p className="small muted">From Nepali त्यो (“that”) and किन / किन्न (“why” / “to buy”).</p>
        <p className="lede">TyoKina helps you answer both: which product, and the evidence behind it. Here’s exactly how.</p>
      </div>
      <div>
        {data.how.map(h => (
          <div key={h.t} className="how-row">
            <h2 className="h3">{h.t}</h2>
            <p>{h.d}</p>
          </div>
        ))}
      </div>
      <section className="panel panel--ink on-dark">
        <h2 className="h3">What we’ll never do</h2>
        <ul className="never">
          {['Sell sponsored placements', 'Let affiliate deals change scores', 'Declare a forced winner', 'Hide what we don’t know'].map(t => (
            <li key={t}><Icon name="close" size={18} />{t}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export function Explore() {
  const { set, go } = useApp()
  const openCategory = (cat: string) => {
    const g = data.guides.findIndex(x => x.tag === cat)
    if (g >= 0) go('guide', { guide: g })
    else go('home', { q: cat })
  }
  return (
    <main className="page" data-screen-label="Explore">
      <div className="page-head">
        <h1 className="display">Start with<br />a <span className="accent">category.</span></h1>
      </div>
      <div className="grid" style={{ '--min': '220px', gap: 12 } as React.CSSProperties}>
        {data.categories.map((c, i) => (
          <button key={c.n} type="button" className={blockClass(i) + ' cat-card lift'} onClick={() => openCategory(c.n)}>
            <span className="small"><Num>{c.c}</Num> products</span><span className="cat-card__n">{c.n}</span>
          </button>
        ))}
      </div>
      <section className="section">
        <div className="stack" style={{ gap: 4 }}>
          <h2 className="h2">Buying guides</h2>
          <p className="muted">Built from evidence. Every guide says how it’s funded.</p>
        </div>
        <div>
          {data.guides.map((g, i) => (
            <button key={g.t} type="button" className="guide-row" onClick={() => { set({ q: '' }); go('guide', { guide: i }) }}>
              <div><span className="tag tag--amber">{g.tag}</span><div className="guide-row__t">{g.t}</div></div>
              <div className="small muted" style={{ lineHeight: 1.6 }}>{g.meta}<br />{g.fund}</div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export function Guide() {
  const { s, set, go, openProduct, toast } = useApp()
  const g = data.guides[s.guide]
  const isHeadphones = g.tag === 'Headphones'
  return (
    <main className="page page--narrow" data-screen-label="Buying guide">
      <BackLink onClick={() => go('explore')}>Explore</BackLink>
      <div className="page-head">
        <h1 className="display display--sm">{g.t}</h1>
        <div className="row" style={{ gap: 8 }}>
          <span className="tag tag--amber">{g.tag}</span>
          <span className="tag tag--neutral">{g.meta}</span>
          <span className="tag tag--neutral">Funding: {g.fund}</span>
        </div>
      </div>
      {isHeadphones ? (
        <>
          <p className="lede" style={{ color: 'var(--ink)' }}>We shortlisted products with at least 3 independent expert reviews and 50+ verified owners. Pick 2 or 3 to compare side by side.</p>
          <div className="stack" style={{ gap: 12 }}>
            {data.compare.map((c, i) => {
              const on = s.picks.includes(i)
              return (
                <div key={c.id} className="card guide-product">
                  <button type="button" aria-pressed={on} aria-label={`Add ${c.brand} ${c.name} to the comparison`} className={cx('pick', on && 'is-on')}
                    onClick={() => set({ picks: on ? s.picks.filter(x => x !== i) : [...s.picks, i] })}><Icon name={on ? 'check' : 'plus'} /></button>
                  <ProductPhoto pid={c.id} name={`${c.brand} ${c.name}`} size="sm" />
                  <div className="guide-product__body">
                    <span className="small muted">{c.brand} · <Num>रू {c.price}</Num></span>
                    <span className="h3">{c.name}</span>
                    <span className="muted">Suits {c.fit.charAt(0).toLowerCase() + c.fit.slice(1)}</span>
                  </div>
                  <button type="button" className="link" onClick={() => openProduct(c.id)}>Research<Icon name="arrowRight" size={16} /></button>
                </div>
              )
            })}
          </div>
          <button type="button" className="block-cta" onClick={() => {
            if (s.picks.length < 2) return toast('Pick 2 or 3 products to compare')
            go('compare', { cmp: [...s.picks].sort().map(i => data.compare[i].id) })
          }}>Compare <Num>{s.picks.length}</Num> selected</button>
        </>
      ) : (
        <div className="empty">
          <h2 className="h4">This guide’s shortlist is being updated</h2>
          <p className="muted">We re-check every product against new owner reports before a guide goes live again.</p>
          <div className="row"><button type="button" className="btn btn--dark" onClick={() => go('home', { q: g.tag })}>Search {g.tag.toLowerCase()} instead</button></div>
        </div>
      )}
    </main>
  )
}
