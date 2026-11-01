// WCAG contrast audit of every text element on every slide (against its nearest solid background).
//   node scripts/contrast.mjs [url]
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:5174/'
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto(base + '#/1')
await page.waitForTimeout(1500)
const total = await page.evaluate(() => document.querySelectorAll('.slide').length)
const bad = []
for (let n = 1; n <= total; n++) {
  await page.evaluate((k) => { location.hash = '#/' + k }, n)
  await page.waitForTimeout(1500)
  const found = await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 } }
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b) }
    const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 })
    const bodyBg = parse(getComputedStyle(document.body).backgroundColor)
    const slide = document.querySelector('.slide.is-on')
    const out = []
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT)
    const seen = new Set()
    while (walker.nextNode()) {
      const t = walker.currentNode
      if (!t.textContent.trim()) continue
      const el = t.parentElement
      if (seen.has(el) || el.closest('iframe, .live, svg, .artifact')) continue
      seen.add(el)
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) continue
      let layers = [], p = el
      while (p && p !== document.documentElement) { const b = parse(getComputedStyle(p).backgroundColor); if (b && b.a > 0) { layers.push(b); if (b.a >= 1) break } p = p.parentElement }
      let bg = layers.length && layers[layers.length - 1].a >= 1 ? layers.pop() : bodyBg
      while (layers.length) bg = over(layers.pop(), bg)
      const fg0 = parse(cs.color); const fg = over({ ...fg0, a: fg0.a * (parseFloat(cs.opacity) || 1) }, bg)
      const L1 = lum(fg), L2 = lum(bg), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05)
      const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5
      if (ratio < need) out.push({ text: t.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), need, color: cs.color, size: Math.round(size) })
    }
    return out
  })
  const title = await page.title()
  if (found.length) bad.push({ n, title, found })
}
for (const b of bad) { console.log(`\nslide ${b.n} · ${b.title}`); for (const f of b.found.slice(0, 8)) console.log(`  ${f.ratio} < ${f.need}  "${f.text}"  ${f.color} ${f.size}px`) }
console.log(bad.length ? `\n${bad.length} slides with contrast issues` : 'no contrast issues')
await browser.close()
