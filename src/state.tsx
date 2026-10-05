import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type Screen =
  | 'home' | 'hub' | 'compare' | 'decide' | 'community' | 'notes' | 'review'
  | 'saved' | 'profile' | 'how' | 'explore' | 'guide'
export type HubTab = 'summary' | 'evidence' | 'ownership' | 'pricing' | 'community'
export type Sheet = 'retail' | 'alert' | null
export type Outcome = 'buy' | 'wait' | 'skip' | null
export type PriceRange = 'Weekly' | 'Monthly' | 'Yearly'

const SCREENS: Screen[] = ['home', 'hub', 'compare', 'decide', 'community', 'notes', 'review', 'saved', 'profile', 'how', 'explore', 'guide']

export interface AppState {
  screen: Screen
  prev: Screen
  tab: HubTab
  /** Citation number whose source is highlighted on the Evidence tab (0 = none). */
  hl: number
  saved: boolean
  q: string
  /** Product shown in the Research Hub (a catalog id). */
  pid: string
  /** Buyer priorities, saved separately for each category. */
  prios: Record<string, string[]>
  sheet: Sheet
  retail: string
  alertT: number
  alertSet: boolean
  toast: string
  cmp: string[]
  showSame: boolean
  outcome: Outcome
  conf: number
  /** Time span shown on the Pricing chart. */
  range: PriceRange
  feedF: string
  voted: number[]
  noteF: string
  stageF: string
  guide: number
  picks: number[]
  stars: number
  rChips: string[]
  rText: string
  rRec: string
  rDone: boolean
  priv: { pub: boolean; anon: boolean; checkins: boolean }
  /** Research questions the buyer has opened, per product. */
  readTabs: Record<string, HubTab[]>
  /** Searches that led somewhere, newest first. */
  recent: string[]
  /** Price alert: any drop, or only below the target price. */
  alertMode: 'drop' | 'below'
  /** Questions the buyer has asked owners. */
  questions: string[]
  /** Arrived from a price-drop notification (Decision check shows what changed). */
  fromAlert: boolean
}

function screenFromHash(): Screen | null {
  const h = window.location.hash.replace(/^#\/?/, '') as Screen
  return SCREENS.includes(h) ? h : null
}

const initial = (): AppState => ({
  screen: screenFromHash() ?? 'home', prev: 'home', tab: 'summary', hl: 0, saved: false, q: '', pid: 'xm5',
  prios: { Headphones: ['Strong noise cancellation', 'All-day battery', 'Folds flat for travel'] },
  sheet: null, retail: 'Daraz', alertT: 35000, alertSet: false, toast: '',
  cmp: ['xm5', 'qc45', 'apm'], showSame: false, outcome: null, conf: 0, range: 'Yearly',
  feedF: 'All', voted: [], noteF: 'All', stageF: 'All', guide: 0, picks: [0, 1],
  stars: 4, rChips: ['Battery'], rText: '', rRec: 'Yes', rDone: false,
  priv: { pub: true, anon: false, checkins: true },
  readTabs: { xm5: ['summary', 'evidence'] }, recent: ['macbook air', 'oled tv'], alertMode: 'below', questions: [], fromAlert: false,
})

interface AppApi {
  s: AppState
  set: (patch: Partial<AppState>) => void
  go: (screen: Screen, extra?: Partial<AppState>) => void
  openHubTab: (tab: HubTab, highlight?: number) => void
  /** Open a product's Research Hub at its summary. */
  openProduct: (pid: string, tab?: HubTab) => void
  toast: (msg: string) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(initial)
  const toastTimer = useRef<number>(undefined)
  const hlTimer = useRef<number>(undefined)

  const set = useCallback((patch: Partial<AppState>) => setS(prev => ({ ...prev, ...patch })), [])

  const go = useCallback((screen: Screen, extra?: Partial<AppState>) => {
    setS(prev => ({ ...prev, prev: prev.screen, screen, sheet: null, fromAlert: false, ...extra }))
    window.scrollTo(0, 0)
  }, [])

  // Question tabs only exist for the fully researched product (the XM5), so this always opens it.
  const openHubTab = useCallback((tab: HubTab, highlight = 0) => {
    if (!highlight) window.scrollTo(0, 0)
    setS(prev => ({ ...prev, prev: prev.screen === 'hub' ? prev.prev : prev.screen, screen: 'hub', pid: 'xm5', tab, hl: highlight, sheet: null }))
    window.clearTimeout(hlTimer.current)
    if (highlight) {
      requestAnimationFrame(() => document.getElementById('source-' + highlight)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      hlTimer.current = window.setTimeout(() => setS(prev => ({ ...prev, hl: 0 })), 2200)
    }
  }, [])

  const openProduct = useCallback((pid: string, tab: HubTab = 'summary') => go('hub', { pid, tab, hl: 0 }), [go])

  const toast = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current)
    setS(prev => ({ ...prev, toast: msg }))
    toastTimer.current = window.setTimeout(() => setS(prev => ({ ...prev, toast: '' })), 2600)
  }, [])

  // Keep the URL hash in step with the screen so browser back/forward work.
  useEffect(() => {
    if (screenFromHash() !== s.screen || !window.location.hash) {
      const url = '#/' + s.screen
      try {
        if (window.location.hash) history.pushState(null, '', url)
        else history.replaceState(null, '', url)
      } catch {
        // Sandboxed frames can refuse history updates; navigation still works in-app.
      }
    }
  }, [s.screen])

  useEffect(() => {
    const onPop = () => {
      const screen = screenFromHash()
      if (screen) setS(prev => ({ ...prev, prev: prev.screen, screen, sheet: null }))
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.clearTimeout(toastTimer.current)
      window.clearTimeout(hlTimer.current)
    }
  }, [])

  const api = useMemo(() => ({ s, set, go, openHubTab, openProduct, toast }), [s, set, go, openHubTab, openProduct, toast])
  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
