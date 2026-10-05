import { useApp, type Screen } from '../state'
import { Icon, type IconName } from './Icon'
import { cx } from './ui'

const UNREAD = 3

export function Header() {
  const { go } = useApp()
  return (
    <header className="site-header">
      <button type="button" className="logo" onClick={() => go('home')} aria-label="TyoKina, home">
        tyo<span className="accent">kina?</span>
      </button>
      <div className="site-header__actions">
        <button type="button" className="header-pill" onClick={() => go('how')}>How it works</button>
        <button type="button" className="bell" onClick={() => go('notes')} aria-label={`Notifications, ${UNREAD} new`}>
          <Icon name="bell" size={20} />
          <span className="bell__count num" aria-hidden>{UNREAD}</span>
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

const NAV: [string, Screen, IconName][] = [
  ['Home', 'home', 'home'], ['Compare', 'compare', 'compare'], ['Community', 'community', 'people'],
  ['Saved', 'saved', 'bookmark'], ['Profile', 'profile', 'user'],
]

export function BottomNav() {
  const { s, go } = useApp()
  return (
    <nav aria-label="Main" className="bottom-nav">
      {NAV.map(([label, k, icon]) => {
        const on = TAB_OF[s.screen] === k
        return (
          <button key={k} type="button" className={cx('bottom-nav__item', on && 'is-on')} aria-current={on ? 'page' : undefined} onClick={() => go(k)}>
            <Icon name={icon} size={20} />{label}
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
      {s.toast && <div className="toast"><Icon name="check" size={18} />{s.toast}</div>}
    </div>
  )
}
