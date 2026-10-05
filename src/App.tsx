import { AppProvider, useApp, type Screen } from './state'
import { BottomNav, Header, Toast } from './components/Chrome'
import { Sheets } from './components/Sheets'
import { Home } from './screens/Home'
import { Hub } from './screens/Hub'
import { Compare } from './screens/Compare'
import { Decide } from './screens/Decide'
import { Community, Notifications, Review } from './screens/Social'
import { Explore, Guide, How, Profile, Saved } from './screens/Account'

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  home: Home, hub: Hub, compare: Compare, decide: Decide, community: Community, notes: Notifications,
  review: Review, saved: Saved, profile: Profile, how: How, explore: Explore, guide: Guide,
}

function Shell() {
  const { s } = useApp()
  const Current = SCREENS[s.screen]
  return (
    <div className="app" lang="en">
      {/* Focus the content directly; a #main hash would read as a screen change. */}
      <a className="skip-link" href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <Header />
      <div id="main" tabIndex={-1} key={s.screen}><Current /></div>
      <Sheets />
      <Toast />
      <BottomNav />
    </div>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
