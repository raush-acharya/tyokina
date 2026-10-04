/** Formats a number with Nepali digit grouping, e.g. 145000 → "1,45,000". */
export function npr(n: number): string {
  const s = String(Math.round(n))
  if (s.length <= 3) return s
  const last = s.slice(-3)
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last
}
