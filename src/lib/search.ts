import { catalog, data } from '../data'

const products = Object.values(catalog)
const haystack = (p: (typeof products)[number]) => (p.brand + ' ' + p.name + ' ' + p.cat).toLowerCase()

/** Words people might search for, used to correct typos. */
const vocab = [...new Set(
  [...products.flatMap(p => haystack(p).split(/[\s"]+/)), ...data.guides.flatMap(g => g.tag.toLowerCase().split(' '))]
    .filter(w => w.length >= 3),
)]

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}

function match(q: string) {
  return {
    products: products.filter(p => q.split(/\s+/).every(w => haystack(p).includes(w))),
    guides: data.guides.map((g, i) => ({ ...g, i })).filter(g => q.split(/\s+/).every(w => (g.t + ' ' + g.tag).toLowerCase().includes(w))),
  }
}

/**
 * Searches products and guides. When nothing matches, retries with each word
 * swapped for the closest known word (one or two typos), and says so.
 */
export function search(raw: string) {
  const q = raw.trim().toLowerCase()
  const exact = match(q)
  if (exact.products.length + exact.guides.length > 0) return { ...exact, corrected: null as string | null }
  const fixed = q.split(/\s+/).map(w => {
    if (w.length < 3) return w
    let best = w, bestD = Math.max(1, Math.floor(w.length / 4)) + 1
    for (const v of vocab) { const dd = distance(w, v); if (dd < bestD) { best = v; bestD = dd } }
    return best
  }).join(' ')
  if (fixed === q) return { ...exact, corrected: null }
  const retry = match(fixed)
  return retry.products.length + retry.guides.length ? { ...retry, corrected: fixed } : { ...exact, corrected: null }
}
