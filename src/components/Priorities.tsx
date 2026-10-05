import { useState } from 'react'
import { priorityOptions, xm5Meets } from '../data'
import { useApp } from '../state'
import { Icon } from './Icon'
import { Chip, cx } from './ui'

const MAX = 3

/** [adjective, singular] forms for copy, e.g. “headphone priorities”, “every pair of headphones”. */
const NOUNS: Record<string, [string, string]> = {
  Headphones: ['headphone', 'pair of headphones'], Laptops: ['laptop', 'laptop'], Phones: ['phone', 'phone'], TVs: ['TV', 'TV'],
}

/** Whether the product meets a priority: true / false, or undefined when we can't check it yet. */
export function meets(pid: string, priority: string): boolean | undefined {
  return pid === 'xm5' ? xm5Meets[priority]?.met : undefined
}

/** The current category's priorities, plus a toggle that respects the 3-priority cap. */
export function usePriorities(category: string) {
  const { s, set, toast } = useApp()
  const chosen = s.prios[category] ?? []
  const toggle = (p: string) => {
    const on = chosen.includes(p)
    if (!on && chosen.length >= MAX) return toast(`Pick up to ${MAX}. Remove one first.`)
    set({ prios: { ...s.prios, [category]: on ? chosen.filter(x => x !== p) : [...chosen, p] } })
  }
  return { chosen, options: priorityOptions[category] ?? [], toggle }
}

/**
 * Asks what matters for this category, in context, then shows how the
 * product fits. Used on the Research Hub; the Decision check reuses the editor.
 */
export function PriorityFit({ pid, category }: { pid: string; category: string }) {
  const { chosen, options } = usePriorities(category)
  // Start in the picker when nothing is chosen yet, and stay there until Done.
  const [editing, setEditing] = useState(chosen.length === 0)
  if (!options.length) return null
  const [adj, one] = NOUNS[category] ?? [category.toLowerCase(), category.toLowerCase()]
  const metCount = chosen.filter(p => meets(pid, p)).length
  const asking = editing

  return (
    <section className="fit" aria-labelledby="fit-title">
      <div className="fit__head">
        <h2 id="fit-title" className="h4">
          {asking ? `What matters most to you in ${category === 'TVs' ? 'a TV' : category.toLowerCase()}?` : `Meets ${metCount} of your ${chosen.length} ${adj} priorities`}
        </h2>
        {chosen.length > 0 && (
          <button type="button" className="link link--quiet" onClick={() => setEditing(!editing)} aria-expanded={editing}>
            {editing ? 'Done' : 'Edit'}
          </button>
        )}
      </div>
      {asking ? (
        <>
          <p className="small muted">Pick up to {MAX}. We’ll check every {one} you research against them.</p>
          <PriorityEditor category={category} />
        </>
      ) : (
        <ul className="fit__chips">
          {chosen.map(p => <li key={p}><FitChip pid={pid} p={p} /></li>)}
        </ul>
      )}
    </section>
  )
}

export function FitChip({ pid, p }: { pid: string; p: string }) {
  const m = meets(pid, p)
  return (
    <span className={cx('fit-chip', m === true && 'fit-chip--met', m === false && 'fit-chip--miss', m === undefined && 'fit-chip--open')}>
      <Icon name={m === true ? 'check' : m === false ? 'close' : 'minus'} size={18} />
      {p}
      <span className="sr-only">{m === true ? ' (met)' : m === false ? ' (not met)' : ' (not checked yet)'}</span>
    </span>
  )
}

export function PriorityEditor({ category }: { category: string }) {
  const { chosen, options, toggle } = usePriorities(category)
  return (
    <div className="chip-row" role="group" aria-label={`Your ${category.toLowerCase()} priorities`}>
      {options.map(o => (
        <Chip key={o} on={chosen.includes(o)} onClick={() => toggle(o)}>
          {chosen.includes(o) && <Icon name="check" size={16} />}{o}
        </Chip>
      ))}
    </div>
  )
}
