// Crops exported Figma slides down to just the artwork (drops kickers, titles and footers).
//   node scripts/crop.mjs
import { chromium } from 'playwright-core'
import { writeFileSync, readFileSync } from 'node:fs'

const jobs = [
  // [source, output, x, y, w, h]  (source is a 1920x1080 slide export)
  ['public/figma/moodboard.png', 'public/figma/moodboard-clean.png', 100, 410, 1780, 480],
  ['public/figma/bmc.png', 'public/figma/bmc-clean.png', 112, 322, 1696, 676],
]
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
const page = await browser.newPage()
for (const [src, out, x, y, w, h] of jobs) {
  const b64 = readFileSync(src).toString('base64')
  const data = await page.evaluate(async ({ b64, x, y, w, h }) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode()
    const c = document.createElement('canvas'); c.width = w; c.height = h
    c.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h)
    return c.toDataURL('image/png').split(',')[1]
  }, { b64, x, y, w, h })
  writeFileSync(out, Buffer.from(data, 'base64'))
  console.log('wrote', out, w + 'x' + h)
}
await browser.close()
