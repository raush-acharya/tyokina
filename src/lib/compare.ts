const LOWER_IS_STRONGER = ['Price', 'Weight', 'Vs 12-month high']

/**
 * Index of the single strongest value in a compare row, or -1 when there is
 * no clear one (ties, identical values, or rows that aren't rankable).
 */
export function strongestIdx(key: string, vals: string[]): number {
  if (key === 'Top issue' || new Set(vals).size === 1) return -1
  if (vals.includes('Yes')) return vals.filter(v => v === 'Yes').length === 1 ? vals.indexOf('Yes') : -1
  if (vals.includes('LDAC')) return vals.indexOf('LDAC')
  const nums = vals.map(v => {
    const m = v.replace(/,/g, '').replace('−', '-').match(/-?\d+(\.\d+)?/)
    return m ? parseFloat(m[0]) : NaN
  })
  if (nums.some(isNaN)) return -1
  const target = LOWER_IS_STRONGER.includes(key) ? Math.min(...nums) : Math.max(...nums)
  return nums.filter(x => x === target).length === 1 ? nums.indexOf(target) : -1
}
