// Visual check: opens the site in headless Edge, jumps to slides and saves screenshots.
//   node scripts/check.mjs <outDir> 1 3 5-9 [--wait=3500] [--press=ArrowRight,ArrowRight]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const out = args[0]
const wait = +(args.find((a) => a.startsWith('--wait='))?.split('=')[1] ?? 3500)
const press = (args.find((a) => a.startsWith('--press='))?.split('=')[1] ?? '').split(',').filter(Boolean)
const base = args.find((a) => a.startsWith('--url='))?.split('=')[1] ?? 'http://localhost:5174/'
const nums = args.slice(1).filter((a) => !a.startsWith('--')).flatMap((a) => { const [x, y] = a.split('-').map(Number); return y ? Array.from({ length: y - x + 1 }, (_, i) => x + i) : [x] })
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()) })
await page.goto(base + '#/' + (nums[0] ?? 1))
await page.waitForTimeout(wait)
for (const n of nums) {
  await page.evaluate((k) => { location.hash = '#/' + k }, n)
  await page.waitForTimeout(wait)
  for (const k of press) { await page.keyboard.press(k); await page.waitForTimeout(900) }
  await page.screenshot({ path: `${out}/s${String(n).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 })
  console.log('shot', n, await page.title())
}
console.log('errors:', JSON.stringify(errors.slice(0, 6)))
await browser.close()
