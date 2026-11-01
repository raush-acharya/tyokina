// Live phones: do they drift (cover, compare, more), and does the hub open on the right question?
import { chromium } from 'playwright-core'
const base = process.argv[2] ?? 'http://localhost:5174/'
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const ok = (n, c, x = '') => console.log(c ? 'PASS' : 'FAIL', n, x)
const scrolls = (id) => page.evaluate((i) => [...document.querySelectorAll(`[data-id=${i}] iframe`)].map((f) => Math.round(f.contentWindow.scrollY)), id)
for (const [n, id] of [[1, 'cover'], [31, 'compare'], [32, 'more']]) {
  await page.goto(base + '#/' + n); await page.waitForTimeout(8000)
  const s = await scrolls(id)
  ok(`${id}: live screens drift down`, s.length > 0 && s.every((v) => v > 40), JSON.stringify(s))
}
await page.goto(base + '#/30'); await page.waitForTimeout(3500)
let y = (await scrolls('hub'))[0]
ok('hub opens on the questions (not the page top)', y > 300, String(y))
const sel = await page.evaluate(() => document.querySelector('[data-id=hub] iframe').contentDocument.getElementById('tab-summary').getAttribute('aria-selected'))
ok('step 0 = "Is it good?" selected', sel === 'true')
await page.click('[data-id=hub] .step-item:nth-child(3)'); await page.waitForTimeout(900)
const t3 = await page.evaluate(() => document.querySelector('[data-id=hub] iframe').contentDocument.getElementById('tab-ownership').getAttribute('aria-selected'))
ok('clicking a question in the list drives the phone', t3 === 'true')
await browser.close()
