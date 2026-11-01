import dagre from '@dagrejs/dagre'

/* A small flowchart renderer: dagre lays the graph out, we draw it as an SVG in the site's own style.
   Node kinds: start, end, step, bad (a pain point), good (a gain), q (a decision, drawn as a diamond). */

const C = {
  ink: '#0C0E1A', muted: '#4A5273', line: '#D6DBF0', edge: '#8B94BC',
  navy: '#1B2D6E', amber: '#F59E0B', amberTint: '#FEF3C7', amberLine: '#F2C35B',
  redTint: '#FDE2E2', redLine: '#F2B0B0', red: '#B91C1C',
  tealTint: '#D9F7F2', tealLine: '#92E0D3', teal: '#00695C', yes: '#00695C', no: '#B91C1C',
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrap(text, max) {
  const words = String(text).split(' ')
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  return lines
}

function measure(n) {
  const w = n.w ?? 236
  if (n.kind === 'start' || n.kind === 'end') return { width: 150, height: 42, lines: [n.title], sub: [] }
  if (n.kind === 'q') {
    const lines = wrap(n.title, 16)
    return { width: 228, height: Math.max(108, lines.length * 20 + 70), lines, sub: [] }
  }
  const lines = wrap(n.title, Math.floor((w - 28) / 8.2))
  const paras = n.sub ? (Array.isArray(n.sub) ? n.sub : [n.sub]) : []
  const sub = paras.flatMap((p) => wrap(p, Math.floor((w - 28) / 6.7)).map((t) => ({ t, flag: /^[⚠✓]/.test(p) })))
  return { width: w, height: 24 + lines.length * 19 + (sub.length ? 6 + sub.length * 16 : 0), lines, sub }
}

function roundedPath(pts, r = 12) {
  if (pts.length < 3) return 'M' + pts.map((p) => `${p.x},${p.y}`).join(' L')
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1]
    const d1 = Math.hypot(p1.x - p0.x, p1.y - p0.y), d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const k = Math.min(r, d1 / 2, d2 / 2)
    const a = { x: p1.x + ((p0.x - p1.x) / d1) * k, y: p1.y + ((p0.y - p1.y) / d1) * k }
    const b = { x: p1.x + ((p2.x - p1.x) / d2) * k, y: p1.y + ((p2.y - p1.y) / d2) * k }
    d += ` L${a.x},${a.y} Q${p1.x},${p1.y} ${b.x},${b.y}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last.x},${last.y}`
}


function dedupe(pts) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const p = out[out.length - 1], q = pts[i]
    if (Math.abs(p.x - q.x) < 0.5 && Math.abs(p.y - q.y) < 0.5) continue
    const a = out[out.length - 2]
    if (a && ((Math.abs(a.x - p.x) < 0.5 && Math.abs(p.x - q.x) < 0.5) || (Math.abs(a.y - p.y) < 0.5 && Math.abs(p.y - q.y) < 0.5))) out[out.length - 1] = q
    else out.push(q)
  }
  return out
}

// right-angle routing: decisions leave from a side vertex like a classic flowchart; everything else drops straight down with an elbow
function route(ed, src, dst, isQ, hasNote) {
  const below = dst.y > src.y + src.height / 2
  if (below && isQ && !hasNote) {
    const dx = dst.x - src.x
    if (Math.abs(dx) > 6) {
      const sx = src.x + Math.sign(dx) * src.width / 2
      return { pts: dedupe([{ x: sx, y: src.y }, { x: dst.x, y: src.y }, { x: dst.x, y: dst.y - dst.height / 2 }]), label: { x: dst.x, y: src.y + 26 } }
    }
    return { pts: [{ x: src.x, y: src.y + src.height / 2 }, { x: dst.x, y: dst.y - dst.height / 2 }], label: { x: src.x, y: src.y + src.height / 2 + 16 } }
  }
  if (below && ed.points.length <= 3) {
    const y0 = src.y + src.height / 2, y1 = dst.y - dst.height / 2, mid = (y0 + y1) / 2
    return { pts: dedupe([{ x: src.x, y: y0 }, { x: src.x, y: mid }, { x: dst.x, y: mid }, { x: dst.x, y: y1 }]), label: { x: dst.x, y: y1 - 22 } }
  }
  // longer or looping edges: follow dagre's route, squared off
  const pts = [ed.points[0]]
  for (let i = 1; i < ed.points.length; i++) {
    const p = ed.points[i - 1], q = ed.points[i]
    if (Math.abs(p.x - q.x) < 1) pts.push(q)
    else { const m = (p.y + q.y) / 2; pts.push({ x: p.x, y: m }, { x: q.x, y: m }, q) }
  }
  const mid = ed.points[Math.floor(ed.points.length / 2)]
  return { pts: dedupe(pts), label: { x: mid.x, y: mid.y } }
}

const FILL = {
  start: [C.navy, C.navy], end: [C.ink, C.ink], step: ['#FFFFFF', C.line],
  bad: [C.redTint, C.redLine], good: [C.tealTint, C.tealLine], q: [C.amberTint, C.amberLine],
}

export function flowchart({ nodes, edges, label = '' }) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', nodesep: 36, ranksep: 44, edgesep: 20, marginx: 24, marginy: 24 })
  g.setDefaultEdgeLabel(() => ({}))
  const meta = {}
  for (const n of nodes) { const m = measure(n); meta[n.id] = { ...n, ...m }; g.setNode(n.id, { width: m.width, height: m.height }) }
  for (const e of edges) g.setEdge(e.from, e.to, e.label ? { label: e.label, width: 38, height: 18, labelpos: 'c' } : {})
  dagre.layout(g)
  const gw = g.graph()
  const hasNote = nodes.some((n) => n.note)
  const W = Math.ceil(gw.width + (hasNote ? 168 : 0)), H = Math.ceil(gw.height)

  let out = ''
  // edges first, so nodes sit on top
  const labels = []
  for (const e of g.edges()) {
    const ed = g.edge(e)
    const r = route(ed, g.node(e.v), g.node(e.w), meta[e.v].kind === 'q', !!meta[e.v].note)
    out += `<path d="${roundedPath(r.pts, 14)}" fill="none" stroke="${C.edge}" stroke-width="2" marker-end="url(#fl-arrow)"/>`
    const lab = edges.find((x) => x.from === e.v && x.to === e.w)?.label
    if (lab) labels.push({ lab, ...r.label })
  }
  for (const l of labels) {
    const col = l.lab === 'Yes' ? C.yes : C.no
    out += `<rect x="${l.x - 19}" y="${l.y - 10}" width="38" height="20" rx="10" fill="#fff" stroke="${col}" stroke-opacity=".55"/><text x="${l.x}" y="${l.y + 4.5}" text-anchor="middle" font-size="12" font-weight="700" fill="${col}">${esc(l.lab)}</text>`
  }
  for (const id of g.nodes()) {
    const n = g.node(id), m = meta[id]
    const { x, y, width: w, height: h } = n
    const [fill, stroke] = FILL[m.kind]
    if (m.kind === 'q') {
      out += `<polygon points="${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
      const top = y - ((m.lines.length - 1) * 19) / 2 + 5
      m.lines.forEach((l, i) => { out += `<text x="${x}" y="${top + i * 19}" text-anchor="middle" font-size="14.5" font-weight="700" fill="${C.ink}">${esc(l)}</text>` })
      if (m.note) {
        const nl = wrap(m.note, 21), nh = nl.length * 15 + 16
        const nx = x + w / 2 + 10, ny = y - nh / 2
        const bad = m.noteKind !== 'good'
        out += `<rect x="${nx}" y="${ny}" width="154" height="${nh}" rx="10" fill="${bad ? C.redTint : C.tealTint}" stroke="${bad ? C.redLine : C.tealLine}"/>`
        nl.forEach((l, i) => { out += `<text x="${nx + 10}" y="${ny + 19 + i * 15}" font-size="12" fill="${bad ? C.red : C.teal}">${esc(l)}</text>` })
      }
    } else if (m.kind === 'start' || m.kind === 'end') {
      out += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`
      out += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" letter-spacing=".06em" fill="#fff">${esc(m.title.toUpperCase())}</text>`
    } else {
      out += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`
      let ty = y - h / 2 + 24
      m.lines.forEach((l, i) => { out += `<text x="${x}" y="${ty + i * 19}" text-anchor="middle" font-size="15" font-weight="600" fill="${C.ink}">${esc(l)}</text>` })
      ty += (m.lines.length - 1) * 19 + 19
      const sc = m.kind === 'bad' ? C.red : m.kind === 'good' ? C.teal : C.muted
      m.sub.forEach((l, i) => { out += `<text x="${x}" y="${ty + i * 16}" text-anchor="middle" font-size="12.5" fill="${l.flag ? sc : C.muted}">${esc(l.t)}</text>` })
    }
  }
  return `<svg class="flowchart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}" font-family="Outfit, 'Segoe UI', sans-serif"><defs><marker id="fl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="${C.edge}"/></marker></defs>${out}</svg>`
}
