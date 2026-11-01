import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import './styles.css'
import './extra.css'
import { slides, CHAPTERS } from './slides.js'
import { totalSeconds } from './timing.js'

gsap.registerPlugin(SplitText)

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const BG = { paper: '#FAFAF7', ink: '#0C0E1A', navy: '#1B2D6E', amber: '#F59E0B' }

const stage = $('#stage')
const curtain = $('#curtain')

/* ── build ─────────────────────────────────────────────── */
const els = slides.map((s, i) => {
  const el = document.createElement('section')
  el.className = 'slide'
  el.dataset.id = s.id
  el.setAttribute('aria-label', `${i + 1}. ${s.title}`)
  el.innerHTML = s.html
  stage.appendChild(el)
  return el
})

const ticksEl = $('#ticks')
CHAPTERS.forEach((name, c) => {
  const t = document.createElement('button')
  t.className = 'tick'; t.type = 'button'; t.title = name; t.setAttribute('aria-label', `Jump to ${name}`)
  t.innerHTML = '<i></i>'
  t.addEventListener('click', () => go(slides.findIndex((s) => s.ch === c)))
  ticksEl.appendChild(t)
})
const tickFills = $$('.tick i', ticksEl)

let idx = -1
let step = 0
let trans = null // the running transition timeline, if any
let enterTl = null
const splits = new Map()
const cumulative = slides.reduce((a, s, i) => (a.push((a[i - 1] ?? 0) + (i ? slides[i - 1].t : 0)), a), [])

/* ── live app iframes ─────────────────────────────────── */
function mountLive(el) {
  $$('[data-live]', el).forEach((host) => {
    if (host.querySelector('iframe')) return
    const f = document.createElement('iframe')
    f.className = 'live__frame'
    f.title = 'The TyoKina app, live: you can use it'
    f.loading = 'eager'
    f.src = `app/index.html#/${host.dataset.live}`
    host.appendChild(f)
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight
      if (!w) return
      const k = w / 390
      f.style.width = '390px'; f.style.height = `${h / k}px`; f.style.transform = `scale(${k})`
    }
    fit()
    f.addEventListener('load', () => {
      fit()
      try { f.contentWindow.addEventListener('keydown', onKey) } catch { /* cross-origin: ignore */ }
      // the app renders just after load: then open the right question, or let the screen drift down like someone reading it
      setTimeout(() => {
        if (host.dataset.tab) liveGo(host, host.dataset.tab)
        else if (host.dataset.drift) drift(f, +host.dataset.drift)
      }, 600)
    })
    host._fit = fit
  })
}
function unmountLive(el) { $$('[data-live] iframe', el).forEach((f) => f.remove()) }
addEventListener('resize', () => { if (idx >= 0) $$('[data-live]', els[idx]).forEach((h) => h._fit?.()) })

window.__liveGo = (host, tab) => liveGo(host, tab)
function liveGo(host, tab) {
  const f = host?.querySelector('iframe')
  const d = f?.contentDocument
  if (!d) return
  d.getElementById(`tab-${tab}`)?.click()
  // bring the question tabs to the top, at once, so the chosen answer is what you see (then it's yours to scroll)
  requestAnimationFrame(() => {
    const bar = d.querySelector('.chapters')
    const y = bar ? bar.getBoundingClientRect().top + f.contentWindow.scrollY - 76 : 0
    f.contentWindow.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
  })
}

// a slow, gentle read-through of a live screen; any touch, wheel or key from the viewer stops it
function drift(f, frac) {
  const w = f.contentWindow, d = f.contentDocument
  if (!w || !d || reduced) return
  const max = Math.max(0, d.documentElement.scrollHeight - w.innerHeight)
  if (!max) return
  const o = { y: 0 }
  const tw = gsap.to(o, { y: max * frac, duration: 8 + frac * 8, ease: 'sine.inOut', delay: 2.4, onUpdate: () => w.scrollTo(0, o.y) })
  const stop = () => tw.kill()
  ;['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => w.addEventListener(ev, stop, { once: true, passive: true }))
}

/* ── enter animation ──────────────────────────────────── */
function padMasks(sp) {
  const masks = sp.masks || sp.lines.map((l) => l.parentElement)
  masks.forEach((m) => { if (!m) return; m.style.paddingBlock = '.16em'; m.style.marginBlock = '-.16em'; m.style.paddingInline = '.1em'; m.style.marginInline = '-.1em' })
}

function enter(i, { instant = false, revealAll = false, fast = false } = {}) {
  const def = slides[i], el = els[i]
  splits.get(i)?.forEach((sp) => sp.revert())
  const list = []
  const tl = gsap.timeline({ delay: instant ? 0 : 0.02 })
  enterTl = tl

  $$('[data-split]', el).forEach((h) => {
    const sp = SplitText.create(h, { type: 'lines', mask: 'lines', linesClass: 'line' })
    padMasks(sp)
    list.push(sp)
    tl.from(sp.lines, { yPercent: 118, duration: 0.85, stagger: 0.08, ease: 'power4.out' }, 0)
  })
  splits.set(i, list)

  const ins = $$('[data-in]', el)
  if (ins.length) tl.from(ins, { y: 36, opacity: 0, duration: 0.7, stagger: { each: 0.055, from: 'start' }, ease: 'power3.out' }, 0.15)

  $$('[data-count]', el).forEach((c) => {
    const to = +c.dataset.count, o = { v: 0 }
    tl.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { c.textContent = Math.round(o.v) } }, 0.2)
  })

  const line = $('[data-line]', el)
  if (line) tl.from(line, { scaleX: 0, duration: 1.3, ease: 'power3.inOut' }, 0.3)

  // tall diagrams drift down their length, and stop the moment the viewer scrolls or touches them
  $$('[data-autoscroll]', el).forEach((box, k) => {
    const run = () => {
      const max = box.scrollHeight - box.clientHeight
      box.scrollTop = 0
      if (max <= 4 || reduced) return
      const tw = gsap.to(box, { scrollTop: max, duration: Math.min(16, 5 + max / 220), ease: 'sine.inOut', delay: 1.2 + k * .3 })
      const stop = () => tw.kill()
      box.addEventListener('wheel', stop, { once: true, passive: true })
      box.addEventListener('pointerdown', stop, { once: true })
    }
    const img = $('img', box)
    if (!img || img.complete) run(); else img.addEventListener('load', run, { once: true })
  })

  mountLive(el)
  def.onEnter?.(el, tl, gsap)

  const stepEls = $$('[data-step]', el)
  gsap.set(stepEls, { opacity: 0, y: 24, pointerEvents: 'none' })
  step = 0
  if (revealAll) { for (let n = 1; n <= (def.steps || 0); n++) reveal(n, true) }
  def.onStep?.(el, revealAll ? def.steps : 0, true)

  if (reduced) tl.timeScale(30)
  else if (fast) tl.timeScale(1.8)
  return tl
}

function reveal(n, now = false) {
  const def = slides[idx] ?? {}
  const el = els[idx]
  $$(`[data-step="${n}"]`, el).forEach((e) => gsap.to(e, { opacity: 1, y: 0, pointerEvents: 'auto', duration: now ? 0 : 0.6, ease: 'power3.out' }))
  step = Math.max(step, n)
  def.onStep?.(el, n, now)
}
function hide(n) {
  const el = els[idx]
  $$(`[data-step="${n}"]`, el).forEach((e) => gsap.to(e, { opacity: 0, y: 24, pointerEvents: 'none', duration: 0.3 }))
  step = n - 1
  slides[idx].onStep?.(el, step)
}

/* ── HUD ── */
function hud(i) {
  const def = slides[i]
  $('#chapter').textContent = CHAPTERS[def.ch]
  $('#count').textContent = `${String(i + 1).padStart(2, '0')} / ${slides.length}`
  CHAPTERS.forEach((_, c) => {
    const inCh = slides.map((s, k) => [s, k]).filter(([s]) => s.ch === c)
    const done = c < def.ch ? 1 : c > def.ch ? 0 : (inCh.findIndex(([, k]) => k === i) + 1) / inCh.length
    gsap.to(tickFills[c], { scaleX: done, duration: 0.5, ease: 'power2.out' })
  })
  document.title = `${def.title} · TyoKina case study`
  $('#notes').textContent = def.notes.replace(/\s*\[step\]\s*/g, '  ▸  ')
  updatePace()
}

function show(i, opts = {}) {
  if (idx >= 0) { els[idx].classList.remove('is-on'); unmountLive(els[idx]) }
  enterTl?.kill()
  idx = i
  els[i].classList.add('is-on')
  document.body.dataset.theme = slides[i].theme
  history.replaceState(null, '', `#/${i + 1}`)
  hud(i)
  return enter(i, opts)
}

/* ── navigation: fast, and always interruptible ────────── */
function settle() {
  // finish any transition instantly so the next input acts on a stable slide
  if (!trans) return
  trans.progress(1)
  trans = null
  gsap.set(curtain, { clipPath: 'inset(100% 0 0 0)' })
}

function go(to, back = false) {
  if (to < 0 || to >= slides.length) return
  if (to === idx && !trans) return
  const rapid = !!trans
  settle()
  if (idx < 0) { show(to, { instant: true }); return }
  if (to === idx) return
  const next = slides[to], cur = slides[idx]
  const wipe = !rapid && !reduced && (cur.theme !== next.theme || cur.ch !== next.ch)
  if (rapid || reduced) { show(to, { revealAll: back, fast: true }); return }

  if (wipe) {
    curtain.style.background = BG[next.theme]
    trans = gsap.timeline({ onComplete: () => { trans = null } })
    trans.set(curtain, { clipPath: back ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)' })
      .to(curtain, { clipPath: 'inset(0% 0 0% 0)', duration: 0.3, ease: 'power3.inOut' })
      .add(() => { show(to, { revealAll: back, fast: true }) })
      .to(curtain, { clipPath: back ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)', duration: 0.38, ease: 'power3.inOut' }, '+=0.02')
  } else {
    trans = gsap.timeline({ onComplete: () => { trans = null } })
    trans.to(els[idx], { opacity: 0, y: back ? 18 : -18, duration: 0.14, ease: 'power2.in' })
      .add(() => { gsap.set(els[idx], { opacity: 1, y: 0 }); show(to, { revealAll: back, fast: true }) })
  }
}

const next = () => {
  settle()
  const def = slides[idx]
  if (def.steps && step < def.steps) reveal(step + 1)
  else go(idx + 1)
}
const prev = () => {
  settle()
  if (step > 0) hide(step)
  else go(idx - 1, true)
}

/* ── input ────────────────────────────────────────────── */
function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  if (!lightbox.hidden) { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') { closeLightbox(); e.preventDefault() } return }
  const k = e.key
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); closeOverview(); next() }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev() }
  else if (k === 'ArrowDown' && ov.hidden) { e.preventDefault(); next() }
  else if (k === 'ArrowUp' && ov.hidden) { e.preventDefault(); prev() }
  else if (k === 'Home') go(0, true)
  else if (k === 'End') go(slides.length - 1)
  else if (k === 'g' || k === 'G') toggleOverview()
  else if (k === 'p' || k === 'P') togglePresenter()
  else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()
  else if (k === 'Escape') closeOverview()
}
addEventListener('keydown', onKey)
$('#next').addEventListener('click', next)
$('#prev').addEventListener('click', prev)

let wheelLock = 0
addEventListener('wheel', (e) => {
  if (!ov.hidden || !lightbox.hidden) return
  // let diagrams and the live app scroll themselves
  if (e.target.closest?.('[data-autoscroll], .live, .scroller')) return
  const now = performance.now()
  if (now < wheelLock || Math.abs(e.deltaY) < 24) return
  wheelLock = now + 700
  e.deltaY > 0 ? next() : prev()
}, { passive: true })
let tx = 0, ty = 0
addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY }, { passive: true })
addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev()
}, { passive: true })
addEventListener('hashchange', () => { const n = parseInt(location.hash.replace('#/', ''), 10) - 1; if (!isNaN(n) && n !== idx) go(n, n < idx) })

/* ── controls: shown on the first slide for a moment, then out of the way ── */
const ui = document.body
ui.classList.add('ui-on')
let uiTimer = setTimeout(() => ui.classList.remove('ui-on'), 7000)
const zone = $('#ui-zone')
zone.addEventListener('pointerenter', () => { clearTimeout(uiTimer); ui.classList.add('ui-on') })
zone.addEventListener('pointerleave', () => { uiTimer = setTimeout(() => ui.classList.remove('ui-on'), 1200) })

/* ── overview ─────────────────────────────────────────── */
const ov = $('#overview')
ov.innerHTML = `<div class="overview__grid">${slides.map((s, i) => `<button class="ov" data-i="${i}"><span>${String(i + 1).padStart(2, '0')} · ${CHAPTERS[s.ch]} · ${s.t}s</span><b>${s.title}</b></button>`).join('')}</div>`
ov.addEventListener('click', (e) => { const b = e.target.closest('.ov'); if (b) { closeOverview(); go(+b.dataset.i, +b.dataset.i < idx) } else if (e.target === ov) closeOverview() })
function toggleOverview() { ov.hidden ? openOverview() : closeOverview() }
function openOverview() { ov.hidden = false; $$('.ov', ov).forEach((b, i) => b.classList.toggle('is-on', i === idx)); $('.ov.is-on', ov)?.focus() }
function closeOverview() { ov.hidden = true }

/* ── lightbox: click any diagram to read it properly ──── */
const lightbox = $('#lightbox')
const lbImg = $('#lightbox img')
function openLightbox(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lightbox.hidden = false; lightbox.scrollTop = 0 }
function closeLightbox() { lightbox.hidden = true; lbImg.removeAttribute('src'); lbImg.hidden = false; $$('.lightbox__svg', lightbox).forEach((n) => n.remove()) }
// flowcharts open large, as the SVG itself (crisp at any size)
function openFlow(svg) {
  const box = document.createElement('div')
  box.className = 'lightbox__svg'
  box.appendChild(svg.cloneNode(true))
  lbImg.hidden = true
  lightbox.appendChild(box)
  lightbox.hidden = false
  lightbox.scrollTop = 0
}
stage.addEventListener('click', (e) => {
  const a = e.target.closest('[data-zoom]')
  if (a) { openLightbox(a.dataset.zoom, a.dataset.alt); return }
  const fc = e.target.closest('.flow-scroll')
  if (fc) { openFlow(fc.querySelector('svg')); return }
  // the list beside a live phone doubles as its remote control
  const item = e.target.closest('.step-item')
  const def = slides[idx]
  if (item && def?.onStep) {
    const n = [...item.parentElement.children].indexOf(item)
    step = n
    def.onStep(els[idx], n, false)
  }
})
lightbox.addEventListener('click', closeLightbox)

/* ── presenter: notes + pace against a 15-minute budget ── */
const pres = $('#presenter')
let t0 = null, tickTimer = null
const mmss = (s) => `${String(Math.floor(Math.abs(s) / 60)).padStart(2, '0')}:${String(Math.floor(Math.abs(s) % 60)).padStart(2, '0')}`
$('#budget').textContent = `/ ${mmss(totalSeconds)} planned`
function updatePace() {
  if (pres.hidden || t0 === null) return
  const el = (performance.now() - t0) / 1000
  $('#timer').textContent = mmss(el)
  const diff = el - cumulative[idx]
  $('#pace').textContent = Math.abs(diff) < 15 ? 'On pace' : diff > 0 ? `${mmss(diff)} behind` : `${mmss(diff)} ahead`
  $('#pace').style.color = diff > 45 ? '#fca5a5' : diff < -45 ? '#5eead4' : '#fff'
}
function togglePresenter() {
  pres.hidden = !pres.hidden
  if (!pres.hidden) { t0 ??= performance.now(); tickTimer = setInterval(updatePace, 500); updatePace() }
  else clearInterval(tickTimer)
}
$('#timer-reset').addEventListener('click', () => { t0 = performance.now(); updatePace() })
if (new URLSearchParams(location.search).has('present')) togglePresenter()

/* ── start ────────────────────────────────────────────── */
const start = Math.min(Math.max((parseInt(location.hash.replace('#/', ''), 10) || 1) - 1, 0), slides.length - 1)
if (start > 0) { ui.classList.remove('ui-on'); clearTimeout(uiTimer) }
document.fonts.ready.then(() => show(start, { instant: true }))
