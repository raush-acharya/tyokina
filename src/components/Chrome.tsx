import { useApp, type Screen } from '../state'
import { cx } from './ui'

const UNREAD = 3

export function Header() {
  const { go } = useApp()
  return (
    <header className="site-header">
      <button type="button" className="logo" onClick={() => go('home')} aria-label="TyoKina home">
        tyo<span>kina?</span>
      </button>
      <div className="site-header__actions">
        <button type="button" className="header-pill" onClick={() => go('how')}>How it works</button>
        <button type="button" className="bell" onClick={() => go('notes')} aria-label={`Notifications, ${UNREAD} unread`}>
          <span className="bell__icon" aria-hidden />
          <span className="bell__count" aria-hidden>{UNREAD}</span>
        </button>
      </div>
    </header>
  )
}

const TAB_OF: Record<Screen, Screen | ''> = {
  home: 'home', hub: 'home', explore: 'home', guide: 'home', decide: 'home',
  compare: 'compare', community: 'community', review: 'community',
  saved: 'saved', profile: 'profile', how: 'profile', notes: '',
}

const NAV: [string, Screen][] = [['Home', 'home'], ['Compare', 'compare'], ['Community', 'community'], ['Saved', 'saved'], ['Profile', 'profile']]

export function BottomNav() {
  const { s, go } = useApp()
  return (
    <nav aria-label="Main" className="bottom-nav">
      {NAV.map(([label, k]) => {
        const on = TAB_OF[s.screen] === k
        return (
          <button key={k} type="button" className={cx('bottom-nav__item', on && 'is-on')} aria-current={on ? 'page' : undefined} onClick={() => go(k)}>
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export function Toast() {
  const { s } = useApp()
  return (
    <div aria-live="polite" role="status">
      {s.toast && <div className="toast">{s.toast}</div>}
    </div>
  )
}
