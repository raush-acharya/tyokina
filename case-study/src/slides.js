/* Every slide: theme, 3D scene (see scene.js), speaker notes (the 15-minute script), planned seconds.
   Copy follows the Figma case-study deck.
   Nothing here claims research that was not run. */

import { asIsFlow, toBeFlow, decisionFlow, hubFlow } from './flows.js'

export const CHAPTERS = ['Brief', 'Empathize', 'Define', 'Ideate', 'Prototype', 'Test', 'Reflect']

/* a phone showing the real, running app (an iframe the viewer can use) */
const live = (route, { cls = '', label = '', tab = '', drift = '' } = {}) =>
  `<div class="phone phone--live ${cls}"><div class="phone__bezel"><div class="phone__screen"><div class="live" data-live="${route}" ${tab ? `data-tab="${tab}"` : ''} ${drift ? `data-drift="${drift}"` : ''} aria-label="${label}"></div></div></div></div>`

/* a diagram or photo from the Figma file: click to zoom; tall ones drift down on their own */
const art = (src, { cap = '', auto = false, cls = '', alt = '', style = '', trim = false } = {}) =>
  `<figure class="artifact ${trim ? 'artifact--trim' : ''} ${cls}" data-zoom="figma/${src}" data-alt="${alt}" ${auto ? 'data-autoscroll' : ''} ${style ? `style="${style}"` : ''}><img src="figma/${src}" alt="${alt}" />${cap ? `<figcaption class="artifact__cap">${cap}</figcaption>` : ''}</figure>`

const section = (n, word, line) => `
  <div class="wrap section">
    <p class="section__n" data-in>${n} / 05</p>
    <h2 class="section__word" data-split>${word}<span class="accent">.</span></h2>
    <p class="lead" data-in>${line}</p>
  </div>`

const hmwCard = (n, topic, q) => `<li><span class="tag">${n} · ${topic}</span><b>${q}</b></li>`

/* a flowchart (SVG, laid out with dagre) in a panel that drifts down its length */
const flowPanel = (label, cls, chart) => `<div class="stack" style="gap:.6rem;min-height:0"><span class="pill ${cls}">${label}</span><div class="flow-scroll" data-autoscroll>${chart}</div></div>`

/* sticky-note clusters from the affinity diagram, with the real notes */
const AFF = {
  trust: ['Trust & transparency', 'b', ['Show where every claim originates', 'Explain why a source is considered trustworthy', 'Display confidence levels for AI-generated insights', 'Acknowledge uncertainty instead of forcing conclusions', 'Show supporting evidence before conclusions', 'Clearly indicate sponsored or affiliate content'], 'Trust is built through transparency, evidence, and explainability, not by asking users to blindly trust AI.'],
  principles: ['Product principles', 'e', ['Transparency over persuasion', 'Evidence over popularity', 'Confidence over conversion', 'Honest uncertainty', 'Empower informed decisions', 'Build trust through consistency'], 'These principles shape every interaction and ensure the platform remains aligned with its mission of trustworthy decision support.'],
  effort: ['Research efficiency', 't', ['Bring research from multiple websites into one place', 'Summarize the most important information first', 'Highlight only decision-relevant information', 'Reduce context switching between websites', 'Help users continue research where they left off', 'Make research feel structured rather than overwhelming'], 'Users don’t want less information, they want less unnecessary effort.'],
  organise: ['Information organisation', 'l', ['Group related evidence by topic', 'Separate facts from opinions', 'Organize evidence by user needs rather than source', 'Use a clear information hierarchy', 'Categorize expert reviews, benchmarks, and owner experiences', 'Reduce visual clutter'], 'Well-organized information reduces cognitive load and makes research more approachable.'],
  community: ['Community knowledge', 'a', ['Encourage long-term owners to contribute reviews', 'Reward high-quality community contributions', 'Allow owners to update reviews over time', 'Connect experienced owners with new buyers', 'Surface community-validated insights', 'Maintain high standards for community content'], 'Community knowledge becomes more valuable when it is trustworthy, recognized, and continuously maintained.'],
  ownership: ['Long-term ownership', 'p', ['Surface long-term owner experiences', 'Highlight recurring failures', 'Show repairability and service experiences', 'Explain total cost of ownership', 'Show “Would you buy it again?” responses', 'Compare software support over time'], 'Buyers care about how a product performs over years, not just during the first week.'],
  decision: ['Decision support', 'p', ['Highlight meaningful differences between products', 'Explain trade-offs rather than declaring winners', 'Show when enough evidence exists to make a decision', 'Reduce analysis paralysis', 'Normalize choosing between equally good products', 'Focus on finding the right product rather than the best product'], 'The objective is not to recommend products, it is to support confident decisions.'],
  pricing: ['Pricing & value', 'a', ['Show historical pricing trends', 'Explain whether the current price is fair', 'Help users decide whether to buy now or wait', 'Explain product lifecycle timing', 'Compare value instead of price alone', 'Reduce post-purchase price regret'], 'Users seek confidence that they’re making a smart financial decision, not simply finding the lowest price.'],
}
const affPanel = (key) => { const [title, tone, notes, insight] = AFF[key]; return `<section class="aff"><h3 class="aff__title">${title}</h3><div class="aff__notes">${notes.map((n, i) => `<p class="sticky sticky--${tone}" style="--tilt:${[-1.2, .8, -.6, 1.1, -.9, .6][i]}deg">${n}</p>`).join('')}</div><p class="aff__insight"><span class="tag">Key insight</span>${insight}</p></section>` }
const affGroup = (area, keys) => `<div class="aff-group"><p class="aff__area"><span class="pill pill--amber">${area}</span></p><div class="aff-pair">${keys.map(affPanel).join('')}</div></div>`

export const slides = [
  /* ───────────────────────── BRIEF ───────────────────────── */
  {
    id: 'cover', ch: 0, theme: 'ink', t: 20, title: 'Cover',
    notes: `Hi, I'm Raush. This is TyoKina, a product-research app I designed in two intense weeks, solo. I'll show you the process, not just the screens: what I did, what I found, and what I'd change.`,
    html: `
    <div class="wrap cover">
      <div>
        <h1 class="mega" data-split>tyokina<span class="accent">?</span></h1>
        <p class="lead" data-in style="margin-top:2rem">Research. Compare. Decide, with evidence.</p>
        <div class="meta" data-in>
          <span class="pill pill--amber">UI/UX Bootcamp case study</span>
          <span class="pill">Raush Acharya</span>
          <span class="pill">Solo product designer</span>
          <span class="pill">Mobile app · Nepal first</span>
        </div>
      </div>
      <div data-in style="justify-self:center">${live('hub', { cls: 'phone--tilt', label: 'TyoKina research hub', drift: '.32' })}</div>
    </div>`,
  },
  {
    id: 'name', ch: 0, theme: 'paper', t: 18, title: 'The name',
    notes: `First, the name. In Nepali, "tyo" means "that", and "kina" means both "why" and "to buy". Buy that, why that? Most tools only help with the first question. TyoKina is built around the second.`,
    html: `
    <div class="wrap stack center">
      <div class="row" style="align-items:flex-end;justify-content:center;gap:3rem;flex-wrap:wrap">
        <div class="stack" style="justify-items:center"><h2 class="mega" data-split style="font-size:clamp(5rem,13vw,13rem)">Tyo</h2><p class="mono sub" data-in style="margin-top:2.2rem">त्यो · “that”</p></div>
        <p class="display accent" data-in style="padding-bottom:3.4rem">+</p>
        <div class="stack" style="justify-items:center"><h2 class="mega" data-split style="font-size:clamp(5rem,13vw,13rem)">Kina</h2><p class="mono sub" data-in style="margin-top:2.2rem">किन / किन्न · “why” / “buy”</p></div>
      </div>
      <p class="h1" data-in style="margin-top:1rem">Buy that, why that<span class="accent">?</span></p>
      <p class="lead" data-in>Most tools only help with the first question. TyoKina is built around the second.</p>
    </div>`,
  },
  {
    id: 'problem', ch: 0, theme: 'ink', t: 34, title: 'Buying one thing shouldn’t take twenty tabs',
    notes: `Here's the problem. Before buying headphones or a laptop, people hop between marketplaces, review sites, YouTube and Reddit, and still aren't sure who to trust. I split the frustration into six things: it takes too long, it's hard to trust, it's overwhelming, you regret the price, there's no single place for it, and nowhere honest for owners to speak. Every later decision traces back to one of these.`,
    html: `
    <div class="wrap stack">
      <h2 class="display" data-split>One purchase.<br/>Twenty open tabs.<br/>Still no <span class="accent">confidence.</span></h2>
      <div class="grid g6" style="margin-top:1.2rem">
        ${[['Too much time', 'Comparing one product means visiting many websites.'], ['Hard to trust', 'Fake, biased and sponsored reviews blur what is real.'], ['Overwhelming', 'Spec-by-spec comparisons make the decision harder.'], ['Price regret', 'The price drops, or is lower elsewhere, right after you buy.'], ['No single place', 'Reviews, comparisons and prices live on different platforms.'], ['No home for honesty', 'Owners want to share real experience, but there is no trusted space.']]
          .map(([h, p], i) => `<div class="card card--solid" data-in><span class="tag">0${i + 1}</span><h3 class="h3" style="margin:.5rem 0 .4rem">${h}</h3><p class="small">${p}</p></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'glance', ch: 0, theme: 'paper', t: 28, title: 'So I gave myself a project: do the whole process, once, properly',
    notes: `Why this project? I wanted to learn product design by doing every stage, from an unclear problem to a usable direction. Two weeks, solo, my first full project. And I'll be upfront: I haven't run user interviews yet. The insights come from desk research and competitor analysis, and every persona is an assumption. Honesty about evidence is the product's first principle, so it had to be mine too.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>I wanted to learn design by doing the whole process, once, properly<span class="accent">.</span></h2>
      <div class="facts" style="margin-top:.8rem">
        ${[['Role', 'Sole product designer'], ['Timeline', '2 intensive weeks'], ['Experience', 'My first full product design project'], ['Tools', 'Figma · FigJam · Claude']]
          .map(([k, v]) => `<div class="card fact" data-in><span class="tag">${k}</span><b>${v}</b></div>`).join('')}
      </div>
      <div class="card card--amber" data-in style="display:grid;grid-template-columns:auto 1fr;gap:1.6rem;align-items:center">
        <span class="pill" style="border-color:var(--ink)">Being straight with you</span>
        <p style="font-size:1.12rem;line-height:1.4">I haven’t run user interviews yet. My insights come from desk research and competitor analysis, and the personas are proto-personas built from those assumptions. Every assumption is tagged, and paired with a plan to test it.</p>
      </div>
    </div>`,
  },
  {
    id: 'process', ch: 0, theme: 'ink', t: 25, title: 'I followed the whole design process, step by step',
    notes: `I followed the classic design-thinking path: five stages, in order, looping back whenever a later step exposed a gap. Empathize, define, ideate, prototype, test. Notice the last circle is dashed. Testing is designed but not yet run, and I'd rather show you that honestly than pretend.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Five stages, followed end to end<span class="accent">.</span></h2>
      <p class="lead" data-in>I moved through each stage in order and looped back whenever a later step exposed a gap.</p>
      <div class="stages" style="margin-top:2.6rem">
        <div class="stage-line" data-line></div>
        ${[['1', 'Empathize', 'Understand the problem', 'Primary & secondary research<br/>Competitive analysis'], ['2', 'Define', 'Frame the problem', 'Personas · journey map<br/>Pain points · POV · HMW'], ['3', 'Ideate', 'Generate ideas', 'Lots of ideas · affinity diagram<br/>NUF test'], ['4', 'Prototype', 'Design and build', 'IA · user flows · paper to lo-fi<br/>Mood board · design system · hi-fi'], ['5', 'Test', 'Plan the validation', 'Assumption plan<br/>Usability test plan<br/>(designed, not yet run)']]
          .map(([n, h, sop, l], i) => `<div class="stage ${i === 4 ? 'stage--plan' : ''}" data-in><div class="stage__dot">${n}</div><h3 class="h3">${h}</h3><span class="pill">${sop}</span><ul><li>${l.split('<br/>').join('</li><li>')}</li></ul></div>`).join('')}
      </div>
    </div>`,
  },

  /* ─────────────────────── EMPATHIZE ─────────────────────── */
  {
    id: 's-empathize', ch: 1, theme: 'amber', t: 3, title: 'Empathize', divider: true,
    notes: `Stage one. Empathize.`,
    html: section('01', 'Empathize', 'Understanding how people research high-value purchases today, and why it feels so exhausting.'),
  },
  {
    id: 'evidence', ch: 1, theme: 'paper', t: 30, title: 'What I did, and what I haven’t',
    notes: `Here's what I actually did. Secondary research: articles, forum threads, how review sites work. A competitive analysis of four platform types. And six proto-personas, merged into three. What I haven't done is primary research. I wrote an eighteen-question interview guide, ready to run, but it hasn't been run. The question behind it all: why does buying research feel so exhausting?`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>What I did, and what I haven’t<span class="accent">.</span></h2>
      <div class="grid g5" style="margin-top:1rem">
        ${[['Done', 'Secondary research', 'Articles, community threads, review-site methods and AI shopping-agent news.'], ['Done', 'Competitive analysis', 'Four platform types, compared on 8 decision-support features.'], ['Done', 'Proto-personas', 'Six assumption-based personas, merged into three.'], ['Planned', 'Primary research', 'An 18-question, semi-structured interview guide, ready for 5–6 recent buyers.'], ['Planned', 'Usability testing', 'Five task-based sessions on the prototype.']]
          .map(([s, h, p]) => `<div class="card ${s === 'Planned' ? '' : 'card--solid'}" data-in style="${s === 'Planned' ? 'border-style:dashed' : ''}"><span class="pill ${s === 'Planned' ? 'pill--dash' : 'pill--teal'}">${s}</span><h3 class="h3" style="margin:.9rem 0 .5rem">${h}</h3><p class="small">${p}</p></div>`).join('')}
      </div>
      <div class="card card--navy" data-in style="margin-top:.6rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center">
        <p class="h2">Why does buying research feel so exhausting?</p>
        <p style="color:var(--on-dark)">The research goal: find the root causes of research fatigue and distrust, and whether one trustworthy hub could remove the anxiety after buying.</p>
      </div>
    </div>`,
  },
  {
    id: 'landscape', ch: 1, theme: 'ink', t: 28, title: 'Everyone solves a slice of the problem',
    notes: `The competitive analysis was clear. AI assistants are instant, but can invent facts. Expert sites bring lab testing, but update slowly and miss local products. Communities have real owners, but are contradictory. Marketplaces have convenience, but sponsored listings. Each solves one slice, and leaves a gap the buyer fills alone.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Four kinds of platforms. Each one solves a slice<span class="accent">.</span></h2>
      <div class="grid g4" style="margin-top:1rem">
        ${[['AI assistants', 'ChatGPT · Gemini · Perplexity', 'Instant, conversational, low effort', 'Can invent facts, rarely shows sources'], ['Expert reviews', 'Wirecutter · RTINGS · Gadgetbyte Nepal', 'Lab testing, trusted methods', 'Slow to update, few local products'], ['Communities', 'Reddit · YouTube · Discord', 'Real owners, long-term experience', 'Contradictory and overwhelming'], ['Marketplaces', 'Daraz · Amazon · Flipkart', 'Convenience, pricing, checkout', 'Fake reviews, sponsored listings']]
          .map(([h, ex, s, g]) => `<div class="card card--solid" data-in><h3 class="h2">${h}</h3><p class="mono small" style="margin:.4rem 0 1.2rem">${ex}</p><span class="pill pill--teal">Good at</span><p style="margin:.5rem 0 1rem">${s}</p><span class="pill pill--red">Falls short</span><p style="margin:.5rem 0 0">${g}</p></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'findings', ch: 1, theme: 'paper', t: 24, title: 'Five things the research kept telling me',
    notes: `Five findings kept repeating. AI starts the journey, it doesn't finish it. The real journey is a relay across tools. People want confidence, not more data. Fake reviews have entered a new era. And shopping is going agentic. Click the board to see it in Figma.`,
    html: `
    <div class="wrap split" style="grid-template-columns:1.25fr .75fr">
      <div class="stack">
        <h2 class="h1" data-split>Five things the research kept telling me<span class="accent">.</span></h2>
        <ol class="rows" style="margin-top:.6rem">
          ${[['AI starts the journey, it doesn’t finish it', 'People ask AI for a shortlist, then still check it elsewhere.'], ['The real journey is a relay', 'AI → Google → Reddit → YouTube → purchase.'], ['People want confidence, not more data', 'Knowing which source to trust is the hard part.'], ['Fake reviews have entered a new era', 'AI-written reviews are hard to tell from real ones.'], ['Shopping is going agentic', 'The competition moves to trustworthy decisions.']]
            .map(([h, p], i) => `<li data-in style="grid-template-columns:2.2rem 1fr"><span class="mono" style="color:var(--navy);font-weight:500">0${i + 1}</span><span><b>${h}</b><br/><span class="small">${p}</span></span></li>`).join('')}
        </ol>
      </div>
      <div data-in>${art('findings.png', { cap: 'My research board · click to zoom', alt: 'Figma board of major research findings', style: 'aspect-ratio:2208/1922' })}</div>
    </div>`,
  },
  {
    id: 'insight', ch: 1, theme: 'navy', t: 28, title: 'The buyer ends up being the glue',
    notes: `Put those together and you get the insight that drove everything. Every platform solves one part. None solves the whole journey. Ask AI, Google it, check Reddit, watch YouTube, compare prices, then buy and hope. Today, the buyer is the glue, carrying context from tool to tool in their head. That's the job I wanted to take off their shoulders.`,
    html: `
    <div class="wrap stack center" style="margin-top:-6rem">
      <h2 class="display" data-split>Every tool does one part. The buyer is the <span class="accent">glue.</span></h2>
      <div class="relay" style="margin-top:2.6rem" data-in>
        ${['Ask AI', 'Google it', 'Check Reddit', 'Watch YouTube', 'Compare prices'].map((s) => `<span class="relay__step">${s}</span><span class="relay__arrow">→</span>`).join('')}
        <span class="relay__step relay__step--end">Buy… and hope</span>
      </div>
      <p class="lead" data-in style="margin-top:1rem">Six tools. The only thing connecting them is the buyer’s memory.</p>
    </div>`,
  },

  /* ───────────────────────── DEFINE ──────────────────────── */
  {
    id: 's-define', ch: 2, theme: 'amber', t: 3, title: 'Define', divider: true,
    notes: `Stage two. Define.`,
    html: section('02', 'Define', 'Turning research into themes, people, a journey, and a problem worth solving.'),
  },
  {
    id: 'themes', ch: 2, theme: 'paper', t: 22, title: 'Four reasons buying feels so tiring',
    notes: `I grouped the research into four themes: research fatigue, distrust of commercial content, a trust deficit, and anxiety after buying. Each is tagged desk research or assumption, so I always know which is which.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Four reasons buying feels so tiring<span class="accent">.</span></h2>
      <div class="grid g2" style="margin-top:1rem">
        ${[['Research fatigue', 'Verification has become a chore. Buyers loop between Amazon, YouTube, blogs and Reddit, and some give up.', 'Buyers spend many hours across weeks on one purchase.'], ['Distrust of commercial content', 'Sponsored posts, influencer picks and “Top 10” lists read as adverts.', 'Buyers assume affiliate money is involved.'], ['The trust deficit', 'Incentivised and AI-generated reviews have eroded trust everywhere.', 'Visible sources and verified owners would restore it.'], ['Anxiety after buying', 'Prices swing after purchase, and long-term reliability data is hard to find.', 'Price history and long-term owner data reduce regret.']]
          .map(([h, p, a]) => `<div class="card" data-in style="display:grid;gap:.7rem"><h3 class="h2">${h}</h3><p>${p}</p><p class="small"><span class="pill pill--amber">Assumption</span>&nbsp; ${a}</p></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'personas', ch: 2, theme: 'ink', t: 42, steps: 2, title: 'Meet the three people I designed for',
    notes: `I drafted six proto-personas, then merged them into three. Meet Ashna, the efficient shopper, who wants a genuine product at a fair price without losing her weekend. [step] Abesh, the evidence seeker: "show me the benchmarks". [step] And Krishna, the contributor, who shares honest reviews so others don't waste money. All three are assumptions I'd validate first.`,
    html: `
    <div class="wrap stack">
      <div class="row" style="justify-content:space-between;align-items:flex-end"><h2 class="h1" data-split>Three people, three ways of buying<span class="accent">.</span></h2>
        <button class="pill" data-zoom="figma/personas.png" data-alt="Proto-persona board" data-in style="cursor:zoom-in">See the persona board ↗</button></div>
      <div class="grid g3" style="margin-top:1rem">
        ${[['Ashna', 'The Efficient Shopper', '29 · Marketing manager · Kathmandu', '“I just want a genuine product at a fair price, without losing my weekend to research.”', 'A trustworthy summary in minutes, price history, and an alert when it’s a good time to buy.', 0],
           ['Abesh', 'The Evidence Seeker', '36 · IT consultant · Lalitpur', '“Skip the marketing pitch. Show me the benchmarks, and how it holds up after the warranty.”', 'Every claim linked to its source, benchmarks side by side, verified long-term owner reports.', 1],
           ['Krishna', 'The Community Contributor', '34 · Photographer · Pokhara', '“I share my honest experience so other people don’t waste their hard-earned money.”', 'A trusted place for verified owners, recognition for quality, and prompts to update reviews.', 2]]
          .map(([n, role, meta, q, must, i]) => `<div class="card persona ${i === 0 ? 'card--paper' : i === 1 ? 'card--navy' : 'card--amber'}" ${i ? `data-step="${i}"` : 'data-in'}>
            <div class="row" style="align-items:center"><div class="avatar" style="${i === 2 ? 'background:var(--ink);color:var(--amber)' : ''}">${n[0]}</div><div><h3 class="h2">${n}</h3><p class="small">${role}</p></div></div>
            <p class="quote">${q}</p><p class="mono small">${meta}</p>
            <div><span class="tag">What TyoKina must do</span><p style="margin-top:.35rem;font-size:.98rem">${must}</p></div>
            <span class="pill pill--dash">Proto-persona · assumption</span></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'journey', ch: 2, theme: 'paper', t: 28, steps: 1, title: 'A bad buying journey, mapped',
    notes: `To feel the problem, I made a journey map for Ashna buying headphones. Watch the line: curious, doubtful, exhausted when Reddit contradicts YouTube, a little hope, then regret when the price drops. [step] Every low point is a pain point, and each became an opportunity: a shortlist, evidence first, trust signals, price history, and alerts.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>One buyer. Five feelings. One regret<span class="accent">.</span></h2>
      <div class="card card--solid" data-in style="padding:1.4rem 2rem 1.6rem">
        <svg class="chart" viewBox="0 0 1000 220" role="img" aria-label="Emotional curve: curious, doubtful, exhausted, hopeful, regretful.">
          <line x1="0" y1="110" x2="1000" y2="110" stroke="currentColor" stroke-opacity=".16" stroke-dasharray="4 6"/>
          <path data-draw d="M100 62 C 200 64, 240 120, 300 128 S 440 170, 500 182 S 640 110, 700 100 S 840 190, 900 196" fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          ${[[100, 62, 'Curious'], [300, 128, 'Doubtful'], [500, 182, 'Exhausted'], [700, 100, 'Hopeful'], [900, 196, 'Regretful']].map(([x, y, l]) => `<g data-dot="${x}"><circle cx="${x}" cy="${y}" r="10" fill="#F59E0B" stroke="var(--solid)" stroke-width="4"/><text x="${x}" y="${y + (y > 150 ? -22 : 34)}" text-anchor="middle" font-size="20" font-weight="600">${l}</text></g>`).join('')}
        </svg>
        <div class="grid g5" style="margin-top:.4rem">
          ${[['Notice the need', 'Asks ChatGPT for the best ANC headphones under रू 40,000'], ['Shortlist', 'Watches two YouTube reviews, skims Daraz ratings'], ['Validate', 'Opens Reddit and finds conflicting opinions'], ['Decide & buy', 'Compares prices across Daraz and local shops'], ['After buying', 'Sees the price drop a week later']]
            .map(([s, d]) => `<div data-in style="display:grid;gap:.4rem;align-content:start"><b>${s}</b><p class="small">${d}</p></div>`).join('')}
        </div>
        <div class="grid g5" data-step="1" style="margin-top:.8rem;border-top:1.5px solid var(--card-line);padding-top:.8rem">
          ${['A shortlist made for me', 'Evidence-based summary first', 'Trust signals & source consensus', 'Price history + “good time to buy”', 'Price-drop alerts & return-window reminder'].map((o) => `<p class="small"><b style="color:var(--teal-ink)">Opportunity</b><br/>${o}</p>`).join('')}
        </div>
      </div>
    </div>`,
    onEnter: (el, tl, gsap) => {
      const path = el.querySelector('[data-draw]')
      if (!path) return
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      const dots = [...el.querySelectorAll('[data-dot]')]
      gsap.set(dots, { opacity: 0 })
      const total = 2.2, t0 = 0.4
      tl.to(path, { strokeDashoffset: 0, duration: total, ease: 'none' }, t0)
      // each dot appears just as the line reaches it, so the curve and the labels move together
      const xs = [100, 300, 500, 700, 900]
      dots.forEach((d, k) => {
        const f = (xs[k] - 100) / 800
        tl.fromTo(d.querySelector('circle'), { attr: { r: 0 } }, { attr: { r: 10 }, duration: .35, ease: 'back.out(2.4)' }, t0 + f * total * 0.96)
        tl.to(d, { opacity: 1, duration: .2 }, t0 + f * total * 0.96)
      })
    },
  },
  {
    id: 'pov', ch: 2, theme: 'navy', t: 28, title: 'The problem, in one sentence',
    notes: `That crystallised into a point of view, built with the five Ws. Who: buyers of high-value products. What: they need a trustworthy way to evaluate them. When: when money is at stake. Where: across Google, YouTube, Reddit and marketplaces. Why: affiliate bias, sponsored picks and fake reviews.`,
    html: `
    <div class="wrap stack">
      <h2 class="display" data-split style="font-size:clamp(2.2rem,4.3vw,5rem);line-height:1.02">Buyers of high-value products need a way to judge them that they can <span class="accent">actually trust.</span></h2>
      <div class="grid g5" style="margin-top:1.6rem">
        ${[['Who', 'People buying medium to high-value products: electronics, appliances, cameras, work gear'], ['What', 'A trustworthy, efficient way to evaluate products'], ['When', 'Money is at stake and long-term ownership matters'], ['Where', 'Google, YouTube, Reddit, marketplaces, forums, price sites'], ['Why', 'Affiliate bias, sponsored picks, fake and AI-written reviews']]
          .map(([k, v]) => `<div class="card" data-in><span class="tag">${k}</span><p style="margin-top:.5rem;font-size:.98rem;line-height:1.3">${v}</p></div>`).join('')}
      </div>
      <p class="small" data-in>Point of view (problem statement), built with the 5 Ws.</p>
    </div>`,
  },
  {
    id: 'hmw', ch: 2, theme: 'ink', t: 30, steps: 1, title: 'Ten questions I wanted to answer',
    notes: `Then I turned pain points into ten "How might we" questions. The first five: trust, fatigue, scattered evidence, long-term ownership, and real versus sponsored reviews. [step] And five more: enough evidence, price anxiety, owners contributing, explainable recommendations, and a confident decision. Their numbers follow every idea and feature after, which kept scope honest.`,
    html: `
    <div class="wrap stack">
      <div class="stack" style="gap:.4rem"><h2 class="h1" data-split>How might we<span class="accent">…</span></h2><p class="lead" data-in>Ten questions, reframed from the pain points. Each number follows every idea and feature that comes after.</p></div>
      <ul class="hmw" style="margin-top:.8rem" data-in>
        ${hmwCard('01', 'trust', 'tell what’s trustworthy without checking every source?')}
        ${hmwCard('02', 'fatigue', 'cut research time and effort, but keep confidence?')}
        ${hmwCard('03', 'fragmentation', 'bring evidence from many sources into one place?')}
        ${hmwCard('04', 'long-term', 'show how a product holds up after months, not launch day?')}
        ${hmwCard('05', 'authenticity', 'separate real owners from sponsored or AI-written reviews?')}
      </ul>
      <ul class="hmw" data-step="1">
        ${hmwCard('06', 'confidence', 'show a buyer when they have enough evidence?')}
        ${hmwCard('07', 'price anxiety', 'ease the fear of overpaying?')}
        ${hmwCard('08', 'community', 'get experienced owners to share what they know?')}
        ${hmwCard('09', 'transparency', 'make every recommendation explainable?')}
        ${hmwCard('10', 'decision', 'move from endless comparing to a confident decision?')}
      </ul>
    </div>`,
  },

  /* ───────────────────────── IDEATE ──────────────────────── */
  {
    id: 's-ideate', ch: 3, theme: 'amber', t: 3, title: 'Ideate', divider: true,
    notes: `Stage three. Ideate.`,
    html: section('03', 'Ideate', 'Lots of ideas first. Judgement later.'),
  },
  {
    id: 'ideas', ch: 3, theme: 'ink', t: 26, title: 'Lots and lots of ideas, no judging yet',
    notes: `In ideation, quantity beats quality, and nothing gets criticised. So for every question I wrote ideas on sticky notes. About three hundred. This is one board: ideas for trust and source transparency. Messy and repetitive, and that's the point.`,
    html: `
    <div class="wrap split" style="grid-template-columns:.8fr 1.2fr;gap:3.4rem">
      <div class="stack">
        <p class="big-n accent" data-count="300" style="font-size:clamp(5rem,11vw,11rem)">300</p>
        <h2 class="h1" data-split>sticky notes, and no judging<span class="accent">.</span></h2>
        <p class="lead" data-in>Quantity beats quality at this stage. So I let every How might we question produce as many ideas as it could.</p>
      </div>
      <div data-in>${art('hmw-stickies.png', { auto: true, trim: true, cap: 'Ideation board · HMW 01, trust · click to zoom', alt: 'Sticky notes of ideas for source transparency and credibility', style: 'height:62vh' })}</div>
    </div>`,
  },
  {
    id: 'affinity', ch: 3, theme: 'paper', t: 28, steps: 3, title: 'Sorting the notes until patterns showed up',
    notes: `Then the affinity diagram: grouping the sticky notes to find patterns. Eight themes came out, each with one key insight, and I grouped them into four product areas. First the trust layer: trust comes from transparency and evidence, not from asking people to blindly trust AI, and my principles came from here. [step] The research layer: people want less unnecessary effort, not less information. [step] The ownership layer: community knowledge only matters if it is trusted and kept up to date, and buyers care about years, not the first week. [step] And the decision layer: the goal isn't to recommend products, it's to support confident decisions.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Eight themes fell out of the pile<span class="accent">.</span></h2>
      <div class="aff-stack" data-in>
        ${affGroup('Trust layer', ['trust', 'principles'])}
        ${affGroup('Research layer', ['effort', 'organise'])}
        ${affGroup('Ownership layer', ['community', 'ownership'])}
        ${affGroup('Decision layer', ['decision', 'pricing'])}
      </div>
    </div>`,
    onStep: (el, n, now) => {
      el.querySelectorAll('.aff-group').forEach((g, k) => {
        const on = k === n
        g.style.opacity = on ? 1 : 0
        g.style.visibility = on ? 'visible' : 'hidden'
        g.style.transform = on ? 'none' : 'translateY(14px)'
        g.style.transition = now ? 'none' : 'opacity .35s, transform .35s'
      })
    },
  },
  {
    id: 'principles', ch: 3, theme: 'ink', t: 28, title: 'Six rules every screen has to follow',
    notes: `The clusters became six principles, which I used to judge every screen. Transparency over persuasion. Evidence over popularity. Confidence over conversion. Honest uncertainty. Empower, don't decide: no forced winners. And consistency. You'll see them settle real arguments.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Six rules every screen has to follow<span class="accent">.</span></h2>
      <div class="grid g3" style="margin-top:1rem">
        ${[['Transparency over persuasion', 'Show the evidence; never push the sale.'], ['Evidence over popularity', 'A well-sourced claim outranks a popular one.'], ['Confidence over conversion', 'Success is a confident decision, even if it is “don’t buy yet”.'], ['Honest uncertainty', 'Say what we don’t know. Never overstate certainty.'], ['Empower, don’t decide', 'Explain trade-offs; let the buyer choose. No forced winners.'], ['Consistency builds trust', 'Same structure, same rules, every product.']]
          .map(([h, p], i) => `<div class="card ${i === 2 ? 'card--amber' : i === 4 ? 'card--navy' : 'card--solid'}" data-in style="min-height:11rem;display:grid;align-content:space-between"><span class="big-n" style="font-size:2.4rem">0${i + 1}</span><div><h3 class="h2">${h}</h3><p class="sub" style="margin-top:.5rem">${p}</p></div></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'nuf', ch: 3, theme: 'paper', t: 30, title: 'Picking what to build first',
    notes: `Eight concepts, two weeks. So I ran a NUF test: score each idea on how New, Useful and Feasible it is, one to five, so fifteen is the top. Four concepts scored fourteen and became Version One. Ownership and decision support were Version Two. These are my own estimates, to revisit after interviews.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Eight ideas, a NUF test, four winners<span class="accent">.</span></h2>
      <ul class="rows nuf card card--solid" style="padding:.4rem 1.8rem">
        <li class="head"><span>Concept</span><span>New</span><span>Useful</span><span>Feasible</span><span>Total / 15</span><span>Release</span></li>
        ${[['Evidence-based product research', 5, 5, 4, 'V1'], ['Research workspace', 4, 5, 5, 'V1'], ['Trust & transparency system', 5, 5, 4, 'V1'], ['Meaningful product comparison', 4, 5, 5, 'V1'], ['Long-term ownership insights', 5, 5, 3, 'V2'], ['Decision support experience', 4, 5, 4, 'V2'], ['Verified community knowledge', 4, 5, 3, 'Later'], ['Price & value intelligence', 3, 4, 5, 'Later']]
          .map(([c, n, u, f, r]) => { const t = n + u + f; return `<li data-in><span style="font-weight:500">${c}</span><span class="num">${n}</span><span class="num">${u}</span><span class="num">${f}</span><span class="row" style="gap:.6rem;align-items:center"><span class="bar" style="flex:1"><i data-bar="${t / 15}"></i></span><b class="num">${t}</b></span><span class="pill ${r === 'V1' ? 'pill--amber' : ''}">${r}</span></li>` }).join('')}
      </ul>
      <p class="small" data-in>My own estimates, cross-checked against the research. To be revisited after interviews.</p>
    </div>`,
    onEnter: (el, tl, gsap) => {
      const bars = el.querySelectorAll('[data-bar]')
      bars.forEach((b) => gsap.set(b, { scaleX: 0 }))
      tl.to(bars, { scaleX: (i, b) => +b.dataset.bar, duration: .9, ease: 'power3.out', stagger: .07 }, 0.5)
    },
  },
  {
    id: 'features', ch: 3, theme: 'ink', t: 22, title: 'Four ideas made the cut',
    notes: `The four that scored fourteen became the heart of release one: evidence-backed research, a unified workspace, an AI decision assistant that explains trade-offs, and transparent AI. Each points back to the questions it answers.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Four ideas made the cut<span class="accent">.</span></h2>
      <div class="grid g4" style="margin-top:1rem">
        ${[['Evidence-backed research', 'Trace important claims back to sources.', 'HMW 01 · 09', '14 / 15'], ['Unified research workspace', 'The whole research journey in one place.', 'HMW 02 · 03', '14 / 15'], ['AI decision assistant', 'Explain trade-offs instead of choosing blindly.', 'HMW 06 · 10', '14 / 15'], ['Transparent, explainable AI', 'Show how each summary and conclusion was formed.', 'HMW 01 · 05 · 09', '14 / 15']]
          .map(([h, p, q, s], i) => `<div class="card ${i === 0 ? 'card--amber' : 'card--solid'}" data-in style="display:grid;gap:.8rem;align-content:start"><div class="row" style="justify-content:space-between"><span class="big-n" style="font-size:2rem">0${i + 1}</span><span class="pill mono">${s}</span></div><h3 class="h2">${h}</h3><p class="sub">${p}</p><span class="tag">${q}</span></div>`).join('')}
      </div>
    </div>`,
  },

  /* ──────────────────────── PROTOTYPE ────────────────────── */
  {
    id: 's-prototype', ch: 4, theme: 'amber', t: 3, title: 'Prototype', divider: true,
    notes: `Stage four. Prototype.`,
    html: section('04', 'Prototype', 'Structure first, then flows, then paper, then pixels, then a real app.'),
  },
  {
    id: 'ia', ch: 4, theme: 'ink', t: 22, title: 'Where everything lives',
    notes: `Structure first: the information architecture, an operational map of how the product works. Five tabs, and one shared destination, the Research Hub, reachable from everywhere so a buyer never loses their place. Click to zoom; this is the real diagram from my Figma file.`,
    html: `
    <div class="wrap split" style="grid-template-columns:.5fr 1.5fr;gap:2.4rem">
      <div class="stack">
        <h2 class="h1" data-split>Five tabs. One place everything leads to<span class="accent">.</span></h2>
        <p class="lead" data-in>The Research Hub is reachable from search, Home, Compare, Community and Saved, so buyers never lose their place.</p>
      </div>
      <div data-in>${art('ia.png', { cap: 'Information architecture · click to zoom', alt: 'Information architecture diagram of the TyoKina app', style: 'aspect-ratio:2400/1931;max-height:74vh;margin:0 auto' })}</div>
    </div>`,
  },
  {
    id: 'asis', ch: 4, theme: 'paper', t: 28, title: 'Before and after: one buyer’s journey',
    notes: `Here's the as-is flow beside the to-be flow. Today: four-plus platforms, anonymous opinions, a re-research loop, manual price checks, regret. With TyoKina: the same steps, in one place, with verified owners, a confidence check, price history, and alerts instead of rechecking. The steps stay; the friction goes.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Same steps. Much less friction<span class="accent">.</span></h2>
      <div class="grid g2" data-in style="gap:1.6rem">
        ${flowPanel('As-is · today', 'pill--red', asIsFlow)}
        ${flowPanel('To-be · with TyoKina', 'pill--teal', toBeFlow)}
      </div>
    </div>`,
  },
  {
    id: 'flows', ch: 4, theme: 'paper', t: 22, title: 'The paths through the app',
    notes: `Then user flows: the path someone takes to finish a goal. I drew six task flows plus flowcharts. Here are two. The first is the research and confidence loop: search, review the evidence, compare if needed, and if you're not confident yet, keep researching. Buying isn't the only good ending.`,
    html: `
    <div class="wrap stack">
      <div class="row" style="justify-content:space-between;align-items:flex-end;gap:2rem">
        <h2 class="h1" data-split>Buying isn’t the only good ending<span class="accent">.</span></h2>
        <p class="small" data-in style="max-width:22rem">Not enough evidence yet means going back to research, not being pushed to buy.</p>
      </div>
      <div class="grid g2" data-in style="gap:1.6rem">
        ${flowPanel('Product research & confidence loop', '', decisionFlow)}
        ${flowPanel('Price research & retailer redirect', '', hubFlow)}
      </div>
    </div>`,
  },
  {
    id: 'sketch', ch: 4, theme: 'paper', t: 28, title: 'Pen and paper first',
    notes: `Then wireframes, and I started on paper. This is my actual notebook: Home, Compare, Community and Profile, sketched by hand. Then the first digital version. Testing it against my principles changed three things: the rupee symbol, a fifth Saved tab, and a comparison that no longer picks a winner.`,
    html: `
    <div class="wrap split" style="grid-template-columns:.62fr 1.38fr;gap:3rem;align-items:center">
      <div data-in>${art('sketch.png', { cap: 'My notebook · click to zoom', alt: 'Hand-drawn paper wireframes in a notebook', cls: 'artifact--photo', style: 'transform:rotate(-2.2deg);max-height:70vh' })}</div>
      <div class="stack">
        <h2 class="h1" data-split>Pen and paper first<span class="accent">.</span></h2>
        <div class="crop" style="background-image:url(figma/sketches-lofi.png)" data-in data-zoom="figma/sketches-lofi.png" data-alt="First digital version: Home, Compare, Community, Profile" role="img" aria-label="First digital version of Home, Compare, Community and Profile"></div>
        <p class="lead" data-in>Paper wireframes, then the first digital version. Testing it against my principles changed three things: the रू symbol, a fifth Saved tab, and a comparison that stopped picking a winner.</p>
      </div>
    </div>`,
  },
  {
    id: 'mood', ch: 4, theme: 'ink', t: 24, title: 'What it should feel like',
    notes: `Before hi-fi, a mood board. The question to answer: how should the user feel? For a high-stakes purchase, I wanted calm, clear and honest. I collected references for clean product cards, readable price charts, structured reviews and honest comparison tables. The takeaways: navy for calm authority, one accent for decisions and prices, numbers in a monospace face, and lots of white space.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>How should buying feel? Calm, clear, honest<span class="accent">.</span></h2>
      <ul class="row" data-in style="flex-wrap:wrap;gap:.6rem">
        ${['Navy for calm authority', 'One accent for decisions and prices', 'Numbers in a monospace face', 'Cards with plenty of white space'].map((x) => `<li class="pill" style="font-size:.92rem;padding:.5rem 1rem">${x}</li>`).join('')}
      </ul>
      <div data-in style="margin-top:.4rem">${art('moodboard-clean.png', { cap: 'Mood board · click to zoom', alt: 'Mood board of reference apps: product cards, price chart, reviews, comparison table', style: 'aspect-ratio:1780/480;width:min(100%,calc(46vh * 3.7));margin:0 auto' })}</div>
    </div>`,
  },
  {
    id: 'system', ch: 4, theme: 'paper', t: 30, title: 'The design system',
    notes: `The design system is deliberately small: fifteen colour tokens, no hard-coded colours. Navy for authority. One amber for every accent, and small text stays ink because amber is too light to read. Outfit for words, DM Mono only for numbers, so prices and scores are easy to compare. Fewer decisions, more confidence.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>A calm system for a high-stakes decision<span class="accent">.</span></h2>
      <div class="split" style="grid-template-columns:1fr 1.15fr;gap:2.4rem;align-items:start">
        <div class="stack" data-in style="gap:1.1rem">
          <p class="lead" style="font-size:1.15rem">Fifteen colour tokens and one amber, used for every accent. Small text stays ink, because amber is too light to read. Numbers get their own typeface.</p>
          <p style="font-size:3rem;font-weight:700;letter-spacing:-.05em;line-height:1">Outfit <span class="small" style="font-size:.95rem;font-weight:400;letter-spacing:0">for words and headlines</span></p>
          <p class="mono" style="font-size:1.7rem">रू 1,45,000 · 8.9 / 10 · −20%</p>
          <p class="small">DM Mono is reserved for prices, scores, counts and dates.</p>
          <div class="row" style="flex-wrap:wrap;gap:.6rem;align-items:center">
            <span class="demo-btn demo-btn--dark">See prices</span><span class="demo-btn demo-btn--amber">Ready to decide?</span><span class="demo-btn demo-btn--outline">Compare</span>
            <span class="pill pill--teal">Strongest in that row</span><span class="pill pill--amber">Your priority</span>
          </div>
        </div>
        <div class="tokens tokens--mini" data-in>
          ${[['Paper', '#FAFAF7', '#0C0E1A'], ['Surface', '#FFFFFF', '#0C0E1A'], ['Ink', '#0C0E1A', '#FAFAF7'], ['Muted', '#4A5273', '#fff'], ['Line', '#E2E6F3', '#0C0E1A'], ['Tint', '#EEF0F9', '#0C0E1A'], ['Navy', '#1B2D6E', '#fff'], ['On dark', '#C9CEEA', '#0C0E1A'], ['Amber', '#F59E0B', '#0C0E1A'], ['Amber tint', '#FEF3C7', '#0C0E1A'], ['Teal', '#00BFA5', '#0C0E1A'], ['Teal tint', '#D9F7F2', '#0C0E1A'], ['Teal ink', '#00695C', '#fff'], ['Red', '#B91C1C', '#fff'], ['Red tint', '#FDE2E2', '#0C0E1A']].map(([n, c, f]) => `<div class="token" style="background:${c};color:${f}"><b>${n}</b>${c}</div>`).join('')}
        </div>
      </div>
    </div>`,
  },
  {
    id: 'hub', ch: 4, theme: 'navy', t: 58, steps: 4, sceneFocus: true, title: 'Try it: the Research Hub, live',
    notes: `This is the heart of the product, and it's the real app, running right here. Five questions a buyer asks. "Is it good?" An evidence score and a summary written only from cited sources. [step] "Who says so?" Every source scored, affiliate links flagged. [step] "Will it last?" Reliability, with an honest "limited evidence" label. [step] "Is it priced right?" A chart you can flip between weekly and yearly, and alerts. [step] And "What do owners say?" Verified owners, and a way to ask them questions.`,
    html: `
    <div class="wrap split split--rev" style="grid-template-columns:.8fr 1.2fr">
      <div class="phones" style="justify-content:center">${live('hub', { cls: 'phone--lg', label: 'TyoKina research hub, live', tab: 'summary' })}</div>
      <div class="stack">
        <h2 class="h1" data-split>Five questions, not five tabs<span class="accent">.</span></h2>
        <div class="step-list" data-hub>
          ${[['Is it good?', 'Evidence score 8.9 and a summary written only from cited sources.'], ['Who says so?', 'Every source scored. Affiliate links flagged. Where sources agree, and don’t.'], ['Will it last?', 'One-year reliability and recurring issues, with honest “limited evidence” labels.'], ['Is it priced right?', 'Weekly, monthly or yearly price history, a low-to-high meter, and alerts.'], ['What do owners say?', 'Verified owners, structured reviews, and a way to ask them directly.']]
            .map(([h, p], i) => `<div class="step-item ${i === 0 ? 'is-on' : ''}" data-in><b>${h}</b><span>${p}</span></div>`).join('')}
        </div>
        <p class="small" data-in>It’s the real app. Scroll it, tap it, break it.</p>
      </div>
    </div>`,
    onStep: (el, n, now) => {
      const tabs = ['summary', 'evidence', 'ownership', 'pricing', 'community']
      el.querySelectorAll('.step-item').forEach((s, k) => s.classList.toggle('is-on', k === n))
      const host = el.querySelector('[data-live]')
      if (!now) window.__liveGo?.(host, tabs[n])
    },
  },
  {
    id: 'compare', ch: 4, theme: 'paper', t: 44, title: 'Compare without crowning a winner',
    notes: `Compare is where my principles got tested. The rule: no winners. My first version starred the best in each row; I removed it. Now the strongest value gets a neutral mint pill. Your priorities float to the top. And the Decision check shows evidence coverage and open uncertainties, then lets you choose buy, wait or skip. Wait is a successful ending. Try it.`,
    html: `
    <div class="wrap split" style="grid-template-columns:.85fr 1.15fr">
      <div class="stack">
        <h2 class="h1" data-split>Compare things without crowning a winner<span class="accent">.</span></h2>
        <div class="grid g2" data-in style="margin-top:.6rem">
          <div class="feature"><span class="pill pill--teal">Strongest in that row</span><p>A neutral mint pill replaced the star and the word “best”.</p></div>
          <div class="feature"><span class="pill pill--amber">Your priority</span><p>The three things you said matter float to the top.</p></div>
          <div class="feature"><b>Spec help</b><p>Tap ⓘ for what “multipoint” or “LDAC” actually means.</p></div>
          <div class="feature"><b>Decision check</b><p>Coverage, open questions, then buy, wait or skip. “Wait” is a win.</p></div>
        </div>
      </div>
      <div class="phones">${live('compare', { label: 'Compare screen, live', drift: '.55' })}${live('decide', { label: 'Decision check, live', drift: '.4' })}</div>
    </div>`,
  },
  {
    id: 'more', ch: 4, theme: 'ink', t: 28, title: 'Things I only found by building it',
    notes: `Building it taught me things a mockup never would. Search should forgive typos. If we don't cover a product, say so. People lose their place, so the app tracks progress. A price drop should reopen your decision with a "what changed" note. And accessibility: focus, keyboard, forty-four pixel targets, from 320 pixels up.`,
    html: `
    <div class="wrap split split--rev" style="grid-template-columns:1.05fr .95fr">
      <div class="phones">${live('home', { label: 'Home screen, live', drift: '.45' })}${live('community', { label: 'Community screen, live', drift: '.45' })}</div>
      <div class="stack">
        <h2 class="h1" data-split>Things I only found by building it<span class="accent">.</span></h2>
        <div class="grid g2" style="margin-top:.4rem">
          ${[['Search should forgive typos', 'And remember what led somewhere.'], ['Say what we don’t cover', 'An honest preview, not fake research.'], ['Remember where you were', '“2 of 5 questions read”, and a resume card.'], ['A price drop reopens the story', 'The Decision check opens with “what changed”.'], ['Ask your priorities in context', 'Up to three per category, editable any time.'], ['Ask the owners', 'Questions, helpful votes, replies.'], ['Accessible by default', 'Skip link, focus return, 44px targets, 320px up.'], ['One amber, fifteen tokens', 'No hard-coded colours in components.']]
            .map(([h, p]) => `<div class="feature" data-in><b>${h}</b><p>${p}</p></div>`).join('')}
        </div>
      </div>
    </div>`,
  },
  {
    id: 'business', ch: 4, theme: 'amber', t: 22, title: 'How it makes money without selling trust',
    notes: `One last decision, a business one. If recommendations can be bought, the product dies. So revenue never changes what buyers see: no sponsored listings, no paid rankings. I removed them from my canvas because my own research says buyers distrust paid placement. Revenue: disclosed affiliate commissions, a premium tier, later anonymised insight reports.`,
    html: `
    <div class="wrap stack">
      <div class="row" style="justify-content:space-between;align-items:flex-end;gap:2rem">
        <h2 class="h1" data-split style="max-width:34rem">How it makes money without selling trust<span style="color:var(--ink)">.</span></h2>
        <div class="card" data-in style="max-width:26rem"><span class="tag">Guardrail</span><p style="margin-top:.4rem;font-size:1.02rem">No sponsored listings. No paid rankings. Affiliate commissions are disclosed and never change the order.</p></div>
      </div>
      <div data-in>${art('bmc-clean.png', { cap: 'Business model canvas · click to zoom', alt: 'Business model canvas: partners, activities, value proposition, segments, costs and revenue', style: 'aspect-ratio:1696/676;width:min(100%,calc(54vh * 2.509));margin:0 auto' })}</div>
    </div>`,
  },

  /* ───────────────────────── TEST ────────────────────────── */
  {
    id: 's-test', ch: 5, theme: 'amber', t: 3, title: 'Test', divider: true,
    notes: `Stage five. Test.`,
    html: section('05', 'Test', 'Designed and ready. Not yet run, and I want to be clear about that.'),
  },
  {
    id: 'validate', ch: 5, theme: 'paper', t: 26, title: 'How I’ll find out if I’m wrong',
    notes: `This is design validation, and I've been careful. Every key assumption has a method and a pass mark. Buyers spend many hours on one purchase: confirmed if four of six report five-plus hours. Showing sources raises trust: confirmed by an A/B test. Owners will contribute: confirmed if twenty percent start a review. Each can be proven wrong. That's the point.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>How I’ll find out if I’m wrong<span class="accent">.</span></h2>
      <ul class="rows validate card card--solid" style="padding:.2rem 1.8rem;margin-top:.6rem">
        ${[['Buyers spend many hours on one high-value purchase', '5–6 interviews, reconstruct last purchase', '4 of 6 report 5+ hours over more than a week'], ['Sponsored and “Top 10” content is distrusted', 'Interviews + card sort of sources', 'Sponsored ranked in the bottom third'], ['Showing sources increases trust in AI summaries', 'Prototype A/B, with vs. without sources', 'Higher trust rating (1–7) for the sourced version'], ['Long-term owner data is wanted but hard to find', 'Interviews + survey (30+ people)', '60%+ look for it and fail to find it'], ['Price-drop regret is common', 'Survey', '40%+ experienced it in the last year'], ['Owners will contribute if recognised', 'Contributor interviews + fake-door test', '20%+ of prompted owners start a review']]
          .map(([a, m, c]) => `<li data-in style="grid-template-columns:1.5fr 1.1fr 1.3fr"><b style="font-weight:600">${a}</b><span class="small">${m}</span><span class="pill pill--teal" style="width:auto;border-radius:.7rem">${c}</span></li>`).join('')}
      </ul>
    </div>`,
  },
  {
    id: 'usability', ch: 5, theme: 'ink', t: 20, title: 'Five tasks for the first test',
    notes: `And a usability round: five tasks, five recent buyers, think-aloud. Judge a summary. Compare two products. Decide on timing. Set an alert in under a minute. Update an old review. I'll measure success, ease, trust, and SUS, targeting seventy-plus.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>Five tasks for the first test<span class="accent">.</span></h2>
      <div class="grid g5" style="margin-top:1rem">
        ${[['Judge a summary', 'Open the Sony WH-1000XM5. Do you trust the summary, and why?', 'Names a source behind a claim'], ['Compare two products', 'Compare it with the Bose QC45. What is the main trade-off?', 'Explains a trade-off unprompted'], ['Decide on timing', 'Is now a good time to buy? What would you do?', 'Uses price history or the Decision check'], ['Save for later', 'Not ready yet. Save your research and get notified on a price drop.', 'Sets an alert in under 60 seconds'], ['Share an experience', 'You’ve owned it for 6 months. Update your review.', 'Completes the review from the notification']]
          .map(([h, t, s], i) => `<div class="card card--solid" data-in style="display:grid;gap:.7rem;align-content:start"><span class="tag">Task 0${i + 1}</span><h3 class="h3">${h}</h3><p class="small">${t}</p><p class="small"><b style="color:var(--teal)">Success:</b> ${s}</p></div>`).join('')}
      </div>
      <p class="mono small" data-in>Task success target 4 of 5 · Ease (SEQ) avg 5.5+ of 7 · Trust before vs. after Evidence tab · SUS target 70+</p>
    </div>`,
  },

  /* ──────────────────────── REFLECT ──────────────────────── */
  {
    id: 'learned', ch: 6, theme: 'navy', t: 58, steps: 3, title: 'What I learned',
    notes: `Four things I'd actually carry into the next project. One: a broad topic isn't a research question. I started with "how people buy things" and got lost; research only became useful once I wrote a goal and specific questions. [step] Two: a persona only counts if it changes the design. Ashna's regret became price alerts, Abesh's doubts became the "Will it last?" tab, Krishna's wish to be heard became verified owners. [step] Three: my own principles caught my own mistakes. I'd put a star on the best value in Compare, a "Buy now" button on the research page, and sponsored listings in my business canvas. Each broke a rule I'd written, so each came out. [step] And four: working isn't the same as validated. A real prototype made it feel finished, but nobody except me has used it. So I wrote down how I'll find out.`,
    html: `
    <div class="wrap stack">
      <h2 class="h1" data-split>What I’d carry into the next project<span class="accent">.</span></h2>
      <div class="grid g2" style="margin-top:.8rem">
        ${[
          ['A broad topic isn’t a research question', 'I started with “how people buy things” and got lost in it. Research only became useful once I’d written a goal and a few specific questions to answer.'],
          ['A persona only counts if it changes the design', 'Ashna’s regret became price alerts. Abesh’s doubts about life after the warranty became the “Will it last?” tab. Krishna’s wish to be heard became verified owners and editable reviews.'],
          ['My own principles caught my own mistakes', 'I’d put a star on the “best” value in Compare, a “Buy now” button on the research page, and sponsored listings in my business canvas. Each broke a rule I’d written, so each came out.'],
          ['Working isn’t the same as validated', 'Building a real prototype made it feel finished. But nobody except me has used it, and every persona is an assumption. So I wrote down how I’ll find out.'],
        ].map(([h, p], i) => `<div class="card ${i % 3 === 0 ? 'card--amber' : 'card--solid'}" ${i === 0 ? 'data-in' : `data-step="${i}"`} style="padding:1.7rem;display:grid;gap:.6rem;align-content:start"><span class="big-n" style="font-size:2rem">0${i + 1}</span><h3 class="h2">${h}</h3><p class="sub" style="font-size:1.02rem;line-height:1.4">${p}</p></div>`).join('')}
      </div>
    </div>`,
  },
  {
    id: 'next', ch: 6, theme: 'paper', t: 22, title: 'If I did it again',
    notes: `If I did it again: interviews before personas, test the decision check early, and confirm Nepali price data is accessible. Next in the app: warranty and seller type, because dealer versus grey import matters in Nepal, marking uncited sentences, real credited photos, and dark mode. But first, the interviews.`,
    html: `
    <div class="wrap split">
      <div class="stack">
        <h2 class="h1" data-split>If I did it again<span class="accent">.</span></h2>
        <ul class="stack" style="gap:.8rem">
          ${['Run the interviews before building personas.', 'Test the decision-check idea early.', 'Check that Nepali retailer price data is actually accessible.'].map((x) => `<li class="card card--solid" data-in style="font-size:1.2rem">${x}</li>`).join('')}
        </ul>
      </div>
      <div class="stack">
        <h2 class="h2" data-in>Next, in the app</h2>
        <ul class="stack" style="gap:.7rem">
          ${[['Warranty & seller type', 'Authorised dealer vs grey import, plus total price with delivery.'], ['Marking uncited sentences', 'In the AI summary, plus topic chips that filter reviews.'], ['Credited product photos', 'Real photos with author and licence, exact models only.'], ['Dark mode', 'Same tokens, second theme.']]
            .map(([h, p]) => `<li class="card" data-in><b>${h}</b><p class="small">${p}</p></li>`).join('')}
        </ul>
      </div>
    </div>`,
  },
  {
    id: 'thanks', ch: 6, theme: 'ink', t: 15, title: 'Thank you',
    notes: `TyoKina turns twenty open tabs into one evidence-backed decision, and it's honest about what it still needs to prove. Thank you. I'd love your questions, and your help finding people to interview.`,
    html: `
    <div class="wrap stack" style="max-width:48rem;margin-right:auto;margin-left:6%">
      <h2 class="mega" data-split style="font-size:clamp(4.5rem,11vw,11rem)">Thank you<span class="accent">.</span></h2>
      <p class="lead" data-in>TyoKina turns twenty open tabs into one evidence-backed decision, and is honest about what it still needs to prove.</p>
      <div class="row" data-in style="flex-wrap:wrap;gap:.6rem;margin-top:1rem">
        <span class="pill pill--amber">Raush Acharya</span><span class="pill">UI/UX Bootcamp 2026</span><span class="pill mono">github.com/raush-acharya/tyokina</span>
      </div>
    </div>`,
  },
]

export const totalSeconds = slides.reduce((a, s) => a + s.t, 0)
