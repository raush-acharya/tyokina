import { data, type NoteKind } from '../data'
import { useApp } from '../state'
import { Chip, ChipRow, cx } from '../components/ui'

const KIND_COLOR = { Review: '#00695C', 'Q&A': '#1B2D6E', Discussion: '#92400E' } as const
const FEED_LABEL: Record<string, string> = { All: 'All', Review: 'Reviews', Discussion: 'Discussions', 'Q&A': 'Q&A' }

export function Community() {
  const { s, set, go } = useApp()
  const feed = data.feed.map((f, i) => ({ ...f, idx: i })).filter(f => s.feedF === 'All' || f.kind === s.feedF)
  return (
    <main className="page" data-screen-label="Community">
      <div className="title-row">
        <h1 className="display">Owners,<br />not <span className="q-amber-dk">ambassadors.</span></h1>
        <button type="button" className="pill-btn pill-btn--dark pill-btn--52" onClick={() => go('review', { rDone: false })}>Share your experience</button>
      </div>
      <div className="mt-28">
        <ChipRow label="Filter posts" options={['All', 'Review', 'Discussion', 'Q&A']} value={s.feedF} onChange={v => set({ feedF: v })} labelOf={v => FEED_LABEL[v]} />
      </div>
      <div className="community-layout">
        <div className="feed">
          {feed.map(f => {
            const voted = s.voted.includes(f.idx)
            return (
              <article key={f.idx} className="post">
                <div className="post__head">
                  <span className="avatar avatar--44">{f.i}</span>
                  <div className="post__who"><div className="post__name">{f.name}</div><div className="mono-12" style={{ color: KIND_COLOR[f.kind] }}>{f.meta}</div></div>
                  <span className="post__kind">{f.kind}</span>
                </div>
                <div className="post__on">On <button type="button" className="post__product" onClick={() => go('hub', { tab: 'summary' })}>{f.product}</button></div>
                <h2 className="post__title">{f.title}</h2>
                <p className="post__text">{f.text}</p>
                <div className="post__actions">
                  <button type="button" aria-pressed={voted} className={cx('vote', voted && 'is-on')}
                    onClick={() => set({ voted: voted ? s.voted.filter(x => x !== f.idx) : [...s.voted, f.idx] })}>
                    ▲ Helpful · <span className="mono">{f.helpful + (voted ? 1 : 0)}</span>
                  </button>
                  <button type="button" className="reply">Reply</button>
                </div>
              </article>
            )
          })}
        </div>
        <aside className="community-aside">
          <div className="contributors">
            <h2 className="card-title">Top contributors</h2>
            {data.contributors.map(c => (
              <div key={c.name} className="contributor">
                <span className="avatar avatar--40 avatar--ink">{c.i}</span>
                <div className="contributor__who"><div className="contributor__name">{c.name}</div><div className="contributor__area">{c.area}</div></div>
                <span className="mono contributor__rep">{c.rep}</span>
              </div>
            ))}
          </div>
          <div className="verify-note"><h2>How verification works</h2>Owners link a receipt or retailer order. Verified reviews show how long they've owned the product, and get check-ins at 3, 6 and 12 months.</div>
        </aside>
      </div>
    </main>
  )
}

const NOTE_FILTER: Record<NoteKind, string> = { Price: 'Price', Reply: 'Replies', Update: 'Updates', 'Check-in': 'Check-ins', Community: 'Community' }

export function Notifications() {
  const { s, set, go, openHubTab } = useApp()
  const notes = data.notifications.filter(n => s.noteF === 'All' || NOTE_FILTER[n.k] === s.noteF)
  return (
    <main className="page page--860" data-screen-label="Notifications">
      <h1 className="display display--notes">What<br />changed<span className="q-amber">?</span></h1>
      <div className="mt-28">
        <ChipRow label="Filter notifications" options={['All', 'Price', 'Replies', 'Updates', 'Check-ins']} value={s.noteF} onChange={v => set({ noteF: v })} />
      </div>
      <div className="mt-20">
        {notes.map(n => (
          <button key={n.t} type="button" className="note" onClick={() => n.go === 'hub' ? openHubTab('pricing') : go(n.go, n.go === 'review' ? { rDone: false } : {})}>
            <span className="note__dot" style={{ background: n.k === 'Check-in' ? '#00BFA5' : n.k === 'Price' ? '#F59E0B' : '#1B2D6E' }} aria-hidden />
            <div className="note__body">
              <div className="note__k">{n.k}</div>
              <div className="note__t">{n.t}</div>
              <div className="note__d">{n.d}</div>
            </div>
            <span className="note__time">{n.time}</span>
          </button>
        ))}
      </div>
    </main>
  )
}

const STAR_LABEL = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
const CHANGE_CHIPS = ['Battery', 'Comfort', 'Build & wear', 'Software', 'Sound', 'Nothing changed']

export function Review() {
  const { s, set, go } = useApp()
  if (s.rDone) {
    return (
      <main className="page page--820" data-screen-label="Review update">
        <div className="thanks">
          <div className="mono-12 ls-1">REVIEW UPDATED · 6 MONTHS</div>
          <div className="thanks__title">Thank you, {data.user.name.split(' ')[0]}.</div>
          <p className="thanks__text">Buyers researching the XM4 will now see your 6-month update. You earned +15 reputation.</p>
          <div className="thanks__tags"><span className="thanks__tag thanks__tag--dark">✓ Verified owner · 6 months</span><span className="thanks__tag">Next check-in at 12 months</span></div>
        </div>
        <div className="btn-row mt-16">
          <button type="button" className="pill-btn pill-btn--outline pill-btn--52" onClick={() => go('community')}>Back to Community</button>
          <button type="button" className="pill-btn pill-btn--outline pill-btn--52" onClick={() => go('profile')}>See my contributions</button>
        </div>
      </main>
    )
  }
  return (
    <main className="page page--820" data-screen-label="Review update">
      <span className="tag tag--mint tag--lg">6-MONTH CHECK-IN · SONY WH-1000XM4</span>
      <h1 className="display display--review">Six months in.<br />Still happy?</h1>
      <p className="review-lede">24 people found your first review helpful. A quick update keeps it trustworthy.</p>

      <fieldset className="field mt-32">
        <legend className="field__label">Your rating now</legend>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" className="star" aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={n <= s.stars}
              style={{ color: n <= s.stars ? '#F59E0B' : '#E2E6F3' }} onClick={() => set({ stars: n })}>★</button>
          ))}
          <span className="stars__label">{STAR_LABEL[s.stars]}</span>
        </div>
      </fieldset>

      <fieldset className="field mt-28">
        <legend className="field__label">What changed?</legend>
        <div className="chip-row mt-12">
          {CHANGE_CHIPS.map(t => {
            const on = s.rChips.includes(t)
            return <Chip key={t} on={on} onClick={() => set({ rChips: on ? s.rChips.filter(x => x !== t) : [...s.rChips, t] })}>{t}</Chip>
          })}
        </div>
      </fieldset>

      <div className="field mt-28">
        <label className="field__label" htmlFor="review-text">Tell others</label>
        <textarea id="review-text" className="review-text" rows={5} value={s.rText} onChange={e => set({ rText: e.target.value })}
          placeholder="Battery still lasts about 26 hours. Pads are starting to flatten…" />
      </div>

      <fieldset className="field mt-24">
        <legend className="field__label">Would you buy it again?</legend>
        <div className="chip-row mt-12">
          {['Yes', 'With caveats', 'No'].map(t => <Chip key={t} on={s.rRec === t} className="chip--lg" onClick={() => set({ rRec: t })}>{t}</Chip>)}
        </div>
      </fieldset>

      <button type="button" className="block-cta mt-32" onClick={() => { set({ rDone: true }); window.scrollTo(0, 0) }}>Update my review</button>
      <p className="review-foot">Your original review stays visible with a dated update.</p>
    </main>
  )
}
