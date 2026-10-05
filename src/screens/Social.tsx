import { useState } from 'react'
import { data, type NoteKind } from '../data'
import { useApp } from '../state'
import { Icon } from '../components/Icon'
import { Chip, ChipRow, Num, arrowNav, cx } from '../components/ui'

const FEED_LABEL: Record<string, string> = { All: 'All', Review: 'Reviews', Discussion: 'Discussions', 'Q&A': 'Questions' }

export function Community() {
  const { s, set, go, openProduct, toast } = useApp()
  const [replying, setReplying] = useState<number | null>(null)
  const [reply, setReply] = useState('')
  const feed = data.feed.map((f, i) => ({ ...f, idx: i })).filter(f => s.feedF === 'All' || f.kind === s.feedF)
  return (
    <main className="page" data-screen-label="Community">
      <div className="page-head page-head--row">
        <h1 className="display">Owners,<br />not <span className="accent">ambassadors.</span></h1>
        <button type="button" className="btn btn--dark" onClick={() => go('review', { rDone: false })}>Share your experience</button>
      </div>
      <ChipRow label="Filter posts" options={['All', 'Review', 'Discussion', 'Q&A']} value={s.feedF} onChange={v => set({ feedF: v })} labelOf={v => FEED_LABEL[v]} />
      <div className="community-layout">
        <div className="feed">
          {feed.map(f => {
            const voted = s.voted.includes(f.idx)
            const verified = f.meta.startsWith('Verified')
            return (
              <article key={f.idx} className="card post">
                <div className="post__head">
                  <span className="avatar avatar--44" aria-hidden>{f.i}</span>
                  <div className="post__who">
                    <div className="post__name">{f.name}</div>
                    <div className="post__meta">{verified ? <span className="verified"><Icon name="shield" size={14} />{f.meta}</span> : f.meta}</div>
                  </div>
                  <span className="tag tag--neutral">{FEED_LABEL[f.kind].replace(/s$/, '')}</span>
                </div>
                <div className="post__on">On <button type="button" className="link" onClick={() => openProduct(f.pid)}>{f.product}</button></div>
                <h2 className="h3">{f.title}</h2>
                <p className="muted">{f.text}</p>
                <div className="post__actions">
                  <button type="button" aria-pressed={voted} className={cx('pill-btn', voted && 'is-on')}
                    onClick={() => set({ voted: voted ? s.voted.filter(x => x !== f.idx) : [...s.voted, f.idx] })}>
                    <Icon name="thumb" size={16} />Helpful · <Num>{f.helpful + (voted ? 1 : 0)}</Num>
                  </button>
                  <button type="button" className="pill-btn pill-btn--quiet" aria-expanded={replying === f.idx} onClick={() => { setReplying(replying === f.idx ? null : f.idx); setReply('') }}>Reply</button>
                </div>
                {replying === f.idx && (
                  <form className="reply-box" onSubmit={e => { e.preventDefault(); if (!reply.trim()) return; setReplying(null); toast('Reply posted') }}>
                    <label className="sr-only" htmlFor={'reply-' + f.idx}>Reply to {f.name}</label>
                    <textarea id={'reply-' + f.idx} className="textarea" rows={3} value={reply} onChange={e => setReply(e.target.value)} placeholder={`Reply to ${f.name.split(' ')[0]}…`} autoFocus />
                    <div className="row">
                      <button type="submit" className="btn btn--dark" disabled={!reply.trim()} style={{ opacity: reply.trim() ? 1 : 0.5 }}>Post reply</button>
                      <button type="button" className="btn btn--quiet" onClick={() => setReplying(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </article>
            )
          })}
        </div>
        <aside className="community-aside">
          <section className="block block--teal">
            <h2 className="h3">Top contributors</h2>
            <ul className="divided divided--soft" style={{ marginTop: 8 }}>
              {data.contributors.map(c => (
                <li key={c.name} className="contributor">
                  <span className="avatar avatar--44 avatar--ink" aria-hidden>{c.i}</span>
                  <div className="contributor__who"><div style={{ fontWeight: 600 }}>{c.name}</div><div className="small">{c.area}</div></div>
                  <span className="small"><Num>{c.rep}</Num> helpful</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel panel--tint stack" style={{ padding: 24, gap: 8 }}>
            <h2 className="h4">How verification works</h2>
            <p className="small">Owners link a receipt or retailer order. Verified reviews show how long they’ve owned the product, and get check-ins at 3, 6 and 12 months.</p>
          </section>
        </aside>
      </div>
    </main>
  )
}

const NOTE_FILTER: Record<NoteKind, string> = { Price: 'Prices', Reply: 'Replies', Update: 'Updates', 'Check-in': 'Check-ins', Community: 'Community' }
const DOT: Record<NoteKind, string> = { Price: 'price', 'Check-in': 'checkin', Reply: 'other', Update: 'other', Community: 'other' }

export function Notifications() {
  const { s, set, go, openProduct } = useApp()
  const notes = data.notifications.filter(n => s.noteF === 'All' || NOTE_FILTER[n.k] === s.noteF)
  return (
    <main className="page page--read" data-screen-label="Notifications">
      <div className="page-head">
        <h1 className="display">What<br />changed<span className="accent">?</span></h1>
      </div>
      <ChipRow label="Filter notifications" options={['All', 'Prices', 'Replies', 'Updates', 'Check-ins', 'Community']} value={s.noteF} onChange={v => set({ noteF: v })} />
      <ul className="divided">
        {notes.map(n => (
          <li key={n.t}>
            <button type="button" className="note" onClick={() => n.k === 'Price' ? go('decide', { fromAlert: true }) : n.go === 'hub' ? openProduct(n.pid ?? 'xm5') : go(n.go, n.go === 'review' ? { rDone: false } : {})}>
              <span className={'note__dot note__dot--' + DOT[n.k]} aria-hidden />
              <div className="note__body">
                <span className="small muted">{n.k}</span>
                <span className="note__t">{n.t}</span>
                <span className="muted">{n.d}</span>
              </div>
              <span className="small muted"><Num>{n.time}</Num><span className="sr-only"> ago</span></span>
            </button>
          </li>
        ))}
        {notes.length === 0 && <li className="empty" style={{ marginTop: 16 }}><p>Nothing here yet.</p></li>}
      </ul>
    </main>
  )
}

const STAR_LABEL = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
const CHANGE_CHIPS = ['Battery', 'Comfort', 'Build and wear', 'Software', 'Sound', 'Nothing changed']

export function Review() {
  const { s, set, go } = useApp()
  if (s.rDone) {
    return (
      <main className="page page--read" data-screen-label="Review update">
        <section className="panel panel--teal stack" style={{ animation: 'rise .4s var(--ease)' }}>
          <h1 className="display display--sm">Thank you, {data.user.name.split(' ')[0]}.</h1>
          <p className="lede" style={{ color: 'var(--ink)' }}>Buyers researching the XM4 will now see your 6-month update. You earned <Num>+15</Num> reputation.</p>
          <div className="row">
            <span className="tag" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '8px 14px' }}><Icon name="shield" size={16} />Verified owner · 6 months</span>
            <span className="tag" style={{ background: 'var(--paper)', padding: '8px 14px' }}>Next check-in at 12 months</span>
          </div>
        </section>
        <div className="row">
          <button type="button" className="btn btn--outline" onClick={() => go('community')}>Back to Community</button>
          <button type="button" className="btn btn--outline" onClick={() => go('profile')}>See my contributions</button>
        </div>
      </main>
    )
  }
  return (
    <main className="page page--read" data-screen-label="Review update">
      <div className="page-head">
        <span className="tag tag--teal" style={{ alignSelf: 'flex-start' }}>6-month check-in · Sony WH-1000XM4</span>
        <h1 className="display display--sm">Six months in.<br />Still happy?</h1>
        <p className="lede"><Num>24</Num> people found your first review helpful. A quick update keeps it trustworthy.</p>
      </div>

      <fieldset className="field">
        <legend className="field__label">Your rating now</legend>
        <div className="stars" role="radiogroup" aria-label="Rating" onKeyDown={arrowNav}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" role="radio" aria-checked={s.stars === n} tabIndex={s.stars === n ? 0 : -1}
              aria-label={`${n} star${n > 1 ? 's' : ''}, ${STAR_LABEL[n]}`} className={cx('star', n <= s.stars && 'is-on')} onClick={() => set({ stars: n })}>
              <Icon name="star" size={34} filled />
            </button>
          ))}
          <span style={{ marginLeft: 8 }}>{STAR_LABEL[s.stars]}</span>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">What changed?</legend>
        <div className="chip-row">
          {CHANGE_CHIPS.map(t => {
            const on = s.rChips.includes(t)
            return <Chip key={t} on={on} onClick={() => set({ rChips: on ? s.rChips.filter(x => x !== t) : [...s.rChips, t] })}>{t}</Chip>
          })}
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="review-text">Tell others</label>
        <textarea id="review-text" className="textarea" rows={5} value={s.rText} onChange={e => set({ rText: e.target.value })}
          placeholder="Battery still lasts about 26 hours. The pads are starting to flatten…" />
      </div>

      <fieldset className="field">
        <legend className="field__label">Would you buy it again?</legend>
        <div className="chip-row">
          {['Yes', 'With caveats', 'No'].map(t => <Chip key={t} on={s.rRec === t} className="chip--lg" onClick={() => set({ rRec: t })}>{t}</Chip>)}
        </div>
      </fieldset>

      <button type="button" className="block-cta" style={{ marginTop: 16 }} onClick={() => { set({ rDone: true }); window.scrollTo(0, 0) }}>Update my review</button>
      <p className="small muted" style={{ textAlign: 'center' }}>Your original review stays visible, with a dated update.</p>
    </main>
  )
}

