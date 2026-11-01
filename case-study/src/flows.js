import { flowchart } from './flow.js'

/* The four flowcharts, with the steps, branches and loops from the Figma flow diagrams. */
const n = (id, kind, title, sub, extra = {}) => ({ id, kind, title, sub, ...extra })
const e = (from, to, label) => ({ from, to, label })

export const asIsFlow = flowchart({
  label: 'As-is flow: how a buyer researches and buys a high-value product today',
  nodes: [
    n('s', 'start', 'Start'),
    n('a', 'step', 'Identify Need for High-Value Purchase'),
    n('b', 'bad', 'Conduct Broad Research', ['Google Search · YouTube Reviews · Top 10 Articles · Retail Websites', '⚠ Fragmented across 4+ platforms, multiple tabs & searches']),
    n('c', 'step', 'Shortlist Potential Products'),
    n('d', 'bad', 'Search Community Opinions', ['Reddit · Forums · Facebook Groups · Discord', '⚠ Unverified, anonymous opinions — hard to know who to trust']),
    n('q1', 'q', 'Need Technical Verification?'),
    n('f', 'bad', 'Visit Expert Review Sites', ['RTINGS · Notebookcheck · Tom’s Hardware · TechRadar', '⚠ Must visit multiple specialized sites separately']),
    n('g', 'step', 'Verify Reliability & Long-Term Ownership'),
    n('q2', 'q', 'Is Information Consistent & Trustworthy?', '', { note: '⚠ Conflicting info → decision fatigue → re-research loops' }),
    n('i', 'step', 'Search More Sources'),
    n('j', 'step', 'Compare Conflicting Opinions'),
    n('k', 'step', 'Verify Again'),
    n('l', 'bad', 'Compare Prices Across Retailers', '⚠ Manual price tracking across many retailer websites'),
    n('q3', 'q', 'Satisfied With Price?', '', { note: '⚠ No alerts — must manually recheck prices repeatedly' }),
    n('w', 'step', 'Wait for Sale'),
    n('x', 'step', 'Check Price Again'),
    n('p', 'step', 'Purchase Product'),
    n('m', 'step', 'Monitor Price Drops & Return Window'),
    n('q4', 'q', 'Want to Share Experience?'),
    n('t', 'step', 'Leave Review on Platform(s)'),
    n('z', 'end', 'End'),
  ],
  edges: [
    e('s', 'a'), e('a', 'b'), e('b', 'c'), e('c', 'd'), e('d', 'q1'),
    e('q1', 'f', 'Yes'), e('q1', 'g', 'No'), e('f', 'g'), e('g', 'q2'),
    e('q2', 'l', 'Yes'), e('q2', 'i', 'No'), e('i', 'j'), e('j', 'k'), e('k', 'q2'),
    e('l', 'q3'), e('q3', 'p', 'Yes'), e('q3', 'w', 'No'), e('w', 'x'), e('x', 'q3'),
    e('p', 'm'), e('m', 'q4'), e('q4', 't', 'Yes'), e('q4', 'z', 'No'), e('t', 'z'),
  ],
})

export const toBeFlow = flowchart({
  label: 'To-be flow: the same journey with TyoKina',
  nodes: [
    n('s', 'start', 'Start'),
    n('a', 'step', 'Identify Need for High-Value Purchase'),
    n('b', 'good', 'Open TyoKina', '✓ Single platform for entire research journey'),
    n('c', 'good', 'Search Product OR Browse Buying Guides', '✓ Curated guides replace scattered Google/YouTube searches'),
    n('d', 'step', 'Shortlist Potential Products'),
    n('e', 'good', 'Review Community Insights', ['Verified Owners · Discussions & Polls · Real Experiences', '✓ Verified owners, structured discussions & polls — trustworthy community data']),
    n('q1', 'q', 'Need Technical Verification?'),
    n('f', 'good', 'Open Research Hub', ['Expert Reviews · Benchmarks · Reliability Data · Long-Term Ownership', '✓ All expert reviews, benchmarks & reliability data in one hub — no site-hopping']),
    n('q2', 'q', 'Need More Confidence?', '', { note: '✓ Aggregated evidence reduces conflicting info — no re-research loops', noteKind: 'good' }),
    n('v', 'step', 'View Supporting Evidence'),
    n('g', 'good', 'Compare Prices', ['Multiple Retailers · Price History · Best Available Deal', '✓ Price history & best deal shown automatically — no manual comparison']),
    n('q3', 'q', 'Ready to Purchase?', '', { note: '✓ Automated price alerts replace manual rechecking — no waiting loops', noteKind: 'good' }),
    n('h', 'step', 'Save Product'),
    n('i', 'step', 'Enable Price Alert'),
    n('j', 'step', 'Continue Later'),
    n('k', 'step', 'Redirect to Retailer'),
    n('l', 'step', 'Purchase Product'),
    n('m', 'step', 'Track Price Changes (Optional)'),
    n('q4', 'q', 'Want to Share Experience?'),
    n('o', 'good', 'Submit Verified Owner Review', '✓ Structured review for verified owners — builds trust for future buyers'),
    n('p', 'step', 'Share Long-Term Experience'),
    n('z', 'end', 'End'),
  ],
  edges: [
    e('s', 'a'), e('a', 'b'), e('b', 'c'), e('c', 'd'), e('d', 'e'), e('e', 'q1'),
    e('q1', 'f', 'Yes'), e('q1', 'q2', 'No'), e('f', 'q2'),
    e('q2', 'g', 'Yes'), e('q2', 'v', 'No'), e('v', 'q2'),
    e('g', 'q3'), e('q3', 'k', 'Yes'), e('q3', 'h', 'No'), e('h', 'i'), e('i', 'j'),
    e('k', 'l'), e('l', 'm'), e('m', 'q4'),
    e('q4', 'o', 'Yes'), e('q4', 'z', 'No'), e('o', 'p'), e('p', 'z'),
  ],
})

export const decisionFlow = flowchart({
  label: 'Research Hub decision flow: product research and the confidence loop',
  nodes: [
    n('s', 'start', 'Start'),
    n('a', 'step', 'DISPLAY Home'),
    n('b', 'step', 'USER searches for a product'),
    n('q1', 'q', 'product found?'),
    n('z1', 'end', 'End'),
    n('c', 'step', 'SELECT Product'),
    n('d', 'step', 'OPEN Research Hub'),
    n('e', 'step', 'USER reviews evidence'),
    n('q2', 'q', 'comparison needed?'),
    n('f', 'step', 'OPEN Compare'),
    n('g1', 'step', 'DISPLAY Ownership Comparison', '', { w: 200 }),
    n('g2', 'step', 'DISPLAY Community Comparison', '', { w: 200 }),
    n('g3', 'step', 'DISPLAY Price Comparison', '', { w: 200 }),
    n('q3', 'q', 'user has enough confidence?'),
    n('h', 'step', 'CONTINUE Research'),
    n('i', 'step', 'RETURN to Research Hub'),
    n('j', 'step', 'USER chooses Save or Buy'),
    n('z2', 'end', 'End'),
  ],
  edges: [
    e('s', 'a'), e('a', 'b'), e('b', 'q1'), e('q1', 'z1', 'No'), e('q1', 'c', 'Yes'),
    e('c', 'd'), e('d', 'e'), e('e', 'q2'), e('q2', 'f', 'Yes'), e('q2', 'q3', 'No'),
    e('f', 'g1'), e('f', 'g2'), e('f', 'g3'), e('g1', 'q3'), e('g2', 'q3'), e('g3', 'q3'),
    e('q3', 'j', 'Yes'), e('q3', 'h', 'No'), e('h', 'i'), e('i', 'd'), e('j', 'z2'),
  ],
})

export const hubFlow = flowchart({
  label: 'Research Hub flow: price research and retailer redirect',
  nodes: [
    n('s', 'start', 'Start'),
    n('a', 'step', 'DISPLAY Home'),
    n('b', 'step', 'USER searches for a product'),
    n('q1', 'q', 'product found?'),
    n('z1', 'end', 'End'),
    n('c', 'step', 'OPEN Research Hub'),
    n('d', 'step', 'DISPLAY Price Information'),
    n('e', 'step', 'USER chooses a retailer'),
    n('q2', 'q', 'retailer selected?'),
    n('z2', 'end', 'End'),
    n('f', 'step', 'REDIRECT to Retailer'),
    n('z3', 'end', 'End'),
  ],
  edges: [
    e('s', 'a'), e('a', 'b'), e('b', 'q1'), e('q1', 'z1', 'No'), e('q1', 'c', 'Yes'),
    e('c', 'd'), e('d', 'e'), e('e', 'q2'), e('q2', 'z2', 'No'), e('q2', 'f', 'Yes'), e('f', 'z3'),
  ],
})
