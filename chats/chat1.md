# Figma design review

_Started 2026-10-03 08:21 UTC_

---

## User

https://www.figma.com/design/B0uvmxOMm5ppNPJoznSzyA/TyoKina?node-id=341-2&p=f&t=PCXoFo07JpErzC1F-11

go through this to understand the product and the design system, and redesign the screens properly, a high quality and user friendly app with high class design. like awwards winners, or 21st.dev worthy, you know, surprise me with the design.

## Assistant



## Assistant

I can't open Figma links directly — the file is behind Figma's login. To understand TyoKina, I need the design in another form.

_[tool: ask_user]_

_[tool: tool_search_tool_bm25]_

_[tool: list_files]_

_[tool: web_search]_

I still can't see TyoKina. The Figma file needs a login, the project is empty, and a web search turned up nothing about the product.

To redesign it, I need one of these:
- **The .fig file**: in Figma, go to File → Save local copy, then upload it here.
- **Screenshots**: export the screens as PNGs and drop them in.
- **A short description**: what TyoKina does, who it's for, and which screens matter most. I'll design it from scratch.

If you'd like me to start now without any of this, say so and I'll pick a concept myself, though it may not match your product.

## User

Answered — platform: Responsive web; screens: All in the file; fidelity: Total reinvention; variations: 3 directions; interactive: Clickable prototype

## Assistant



## User

Answered — Asked Claude to decide; product: A product-research companion for people making high-value purchases — built to replace twenty open tabs with one trustworthy decision workspace.; fig_file: Hi-fi screens · revised (source for slides).png, 01 · Cover.png, 02 · Project overview.png; audience: Consumers

## Assistant

_[tool: ask_user]_

_[tool: fig_read]_

_[tool: fig_read]_

No components, so no DS import needed — just understanding screens.

_[tool: fig_ls]_

_[tool: fig_screenshot]_

_[tool: fig_screenshot]_

_[tool: fig_read]_

_[tool: fig_screenshot]_

_[tool: fig_screenshot]_

_[tool: fig_screenshot]_

_[tool: fig_screenshot]_

_[tool: fig_screenshot]_

_[tool: fig_grep]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: grep]_

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I've built three directions for TyoKina as responsive, clickable prototypes. All three cover the core path: Home → Research Hub (Summary, Evidence, Ownership, Pricing, Community) → Compare → Decision check → Saved. They use the case study's own content: the XM5 / QC45 / AirPods Max comparison, Nepali retailers, and the six product principles.

- **A – Dossier**: warm paper background with large serif headlines, like a magazine. Each product reads as a case file with a big evidence score. It also has Explore and Notifications.
- **B – Instrument**: a dark workspace with a sidebar, bento-style grid and a quick search you open with ⌘K. Compare draws small bars for each spec. It also has Explore and Inbox.
- **C – Questions**: bold, colourful type with no tabs. The hub is a set of buyer questions ("Will it last?", "Is now the time?"). The priorities you pick on Home carry through to the Decision check, and Compare reads "pick this if you…" with no forced winner.

A is open now and still being checked; B and C haven't been opened in a preview yet.

- **Product photos:** they weren't in the Figma export, so striped placeholders sit where they go.
- **Not built:** the Figma file has no reusable components, so there was nothing to import as a design system.

Pick a direction and I'll fill in the rest of its screens (Profile, a full Community tab, and Explore and Notifications for C) and refine it.

## User

I kindof like option c: Questions. go through the product requirement document thoroughly once, before doing anything else.

## Assistant

_[tool: list_files]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now Saved, Profile, How it works, Explore, Guide.

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I've built **TyoKina C v2** from the PRD, covering all 28 functional requirements as a responsive clickable prototype. The original C file is unchanged. It's open for you now and still being checked.

- **Navigation:** five bottom tabs (Home, Compare, Community, Saved, Profile). Notifications and "How it works" open from the header.
- **Home:** search across products and guides, pick-up-where-you-left-off cards showing research stage, a price-drop block, your priorities, trending research and Explore.
- **Research Hub:** organised as five buyer questions.
  - The AI summary has tappable citation numbers that jump to the matching source on the Evidence tab and highlight it.
  - The Summary tab shows where sources agree, disagree or have limited evidence, plus a link to flag an error.
  - The Evidence tab marks affiliate and sponsored sources.
  - The Pricing tab shows the all-time low and high and a "good time to buy" signal.
- **Retailer handoff and price alerts:** choosing a retailer opens a panel with an affiliate disclosure on every link. Setting an alert lets you pick a target price with − and + buttons.
- **Compare:** no winners, stars or "recommended" labels. Identical specs are hidden behind a toggle, and there are rows for ownership, community, price and evidence. You can add or remove products (2–3).
- **Decision check:** "Choose a retailer" and "Save & set alert" carry equal weight, with an "I've decided not to buy" option. Any outcome is followed by a 1–7 confidence rating.
- **Community:** a filterable feed with verified-owner badges, helpful votes and top contributors.
- **Notifications:** filterable. The 6-month check-in leads into a review-update flow.
- **Saved:** collections filtered by research stage, price alerts and research history.
- **Profile and How TyoKina works:** contributions, badges, region and currency, privacy toggles, and the scoring and funding explainer.

Prices now use रू with Nepali grouping (e.g. 1,45,000), and tap targets are at least 44px. Product photos are still striped placeholders.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I fixed the broken citations: the summary, "works well" and trade-off lists all cited a 5th source that didn't exist. I added it as "TyoKina verified owners", an aggregate of 312 owner reports, to the Evidence tab. Tapping citation 5 now jumps to it and highlights it. The page reloads with no console errors.

## User

Apply drawing

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I separated the action buttons from the question tabs on the Research Hub. The tabs now sit 48px further down, under a dark rule and a small "Research it in five questions" label. They're also styled as one numbered segmented bar on a pale track (01–05), so they no longer look like buttons. The action buttons are unchanged, and the bar still sticks to the top while you scroll. The page loads with no console errors; I skipped the full check for this small change.

## User

Add tweakable controls to TyoKina C v2.dc.html (declare with dc_set_props, read via this.props): study this design and add a tweaks panel with two or three expressive controls that reshape the feel, not single-property pixel-pushing

## Assistant

_[tool: grep]_

_[tool: dc_html_str_replace]_

Need to close the sc-if after the chapter bar.

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

I've added three controls to the Tweaks panel; the file is open and a final check is still running.

- **Mood** (Loud / Ink / Paper): recolours the colour-block cards across the app — trending, categories, compare columns and ownership stats.
  - **Loud** is the current ink, teal and amber.
  - **Ink** is all-navy and more serious.
  - **Paper** turns them into quiet light cards.
- **Hub layout** (Chapters / Long-form): **Chapters** keeps the five-tab Research Hub. **Long-form** drops the tab bar and stacks all five sections as one scrolling page.
- **Voice** (Questions / Plain labels): switches the hub tabs between the buyer questions ("Is it good?") and standard labels (Summary, Evidence, Ownership, Pricing, Community).

Section headings inside the hub (like "Who says so?") stay as questions in both Voice modes.

## User

Address these comments from my teammates:

**Raush** (on `TyoKina C v2.dc.html` at `[data-comment-anchor="95eea2c606-div"]`):
<commented-element>react:    TyoKina C v2
dom:      body › div#dc-root › div.sc-host › div › main[screen="Buying guide"] › div.scp7[7/7]
text:     "Compare 2 selected"
children: text, span, text
selector: [data-om-id="aea8da8d:548"]</commented-element>
<teammate-comment>spacing</teammate-comment>

**Raush** (on `TyoKina C v2.dc.html` at `[data-comment-anchor="e4124a7957-main"]`):
<commented-element>react:    TyoKina C v2
dom:      body › div#dc-root › div.sc-host › div › main[screen="Compare"][2/3]
text:     "Which one suits you? No winners, no “recommended”. Each one…"
children: h1, p, div, div, section, div
selector: [data-om-id="aea8da8d:237"]</commented-element>
<teammate-comment>i think the best option in each category should be highlighted for easy visual readibility instead of calculating all the numbers</teammate-comment>

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: get_comments]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I've addressed both of Raush's comments; the page is open and a final check is still running.

- **Spacing on "Compare 2 selected":** the spaces were being dropped. The three words now sit 6px apart.
- **Highlighting the best option:** in Compare, the best value in each row now gets an amber pill and a ★, with a "Best in that row" key next to the specs toggle.
  - Lower is treated as better for price, weight and "vs 12-month high"; higher is better for the rest; "Yes" and LDAC win where only one product has them.
  - Rows with no single best get no highlight: ties, identical specs and "Top issue".

**Decision for you:** the PRD says Compare should avoid declaring winners. Highlighting the best value per row bends that a little, though there's still no overall winner. If you'd rather stay strict, I can switch it to a neutral "strongest here" marker.

