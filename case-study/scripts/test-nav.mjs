// Behaviour checks in headless Edge: rapid navigation, stepping, live app control, controls auto-hide.
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:5174/'
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
const hash = () => page.evaluate(() => location.hash)
const ok = (name, cond, extra = '') => console.log(cond ? 'PASS' : 'FAIL', name, extra)

await page.goto(base + '#/1')
await page.waitForTimeout(1500)
ok('controls visible at the start', await page.evaluate(() => document.body.classList.contains('ui-on')))

// rapid forward presses must all register, without waiting for transitions
for (let i = 0; i < 5; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40) }
await page.waitForTimeout(1500)
ok('5 rapid → presses land on slide 6', (await hash()) === '#/6', await hash())

for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(40) }
await page.waitForTimeout(1500)
ok('3 rapid ← presses land on slide 3', (await hash()) === '#/3', await hash())

// time for a slide change to appear (wipe transition: new slide shows at the curtain midpoint)
const t0 = Date.now()
await page.keyboard.press('ArrowRight')
await page.waitForFunction(() => location.hash === '#/4')
ok('slide change is quick', Date.now() - t0 < 700, `${Date.now() - t0}ms`)

// jump to any slide at once from the overview
await page.keyboard.press('g')
await page.click('.ov[data-i="29"]')
await page.waitForTimeout(1200)
ok('overview jumps to slide 30 (hub)', (await hash()) === '#/30', await hash())

// controls hide after the first seconds
await page.waitForTimeout(6500)
ok('controls hidden after a while', !(await page.evaluate(() => document.body.classList.contains('ui-on'))))

// live app on the hub slide follows the steps
await page.waitForSelector('[data-id=hub] iframe')
await page.waitForTimeout(1200)
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(900)
const tab = await page.evaluate(() => document.querySelector('[data-id=hub] iframe')?.contentDocument?.querySelector('#tab-evidence')?.getAttribute('aria-selected'))
ok('step 1 opens "Who says so?" in the live app', tab === 'true', String(tab))
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500)
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500)
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900)
const last = await page.evaluate(() => document.querySelector('[data-id=hub] iframe')?.contentDocument?.querySelector('#tab-community')?.getAttribute('aria-selected'))
ok('step 4 opens "What do owners say?"', last === 'true', String(last))
await page.screenshot({ path: process.argv[3] ?? 'hub-owners.jpg', type: 'jpeg', quality: 70 })

// arrow keys still work while the live app has focus
await page.evaluate(() => document.querySelector('[data-id=hub] iframe').contentWindow.focus())
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(1500)
ok('arrow key works with the app focused', (await hash()) === '#/31', await hash())

console.log('page errors:', JSON.stringify(errors))
await browser.close()
