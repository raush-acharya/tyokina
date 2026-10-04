window.TK = {
  user: { name: "Kumar Nepal", initials: "KN", since: "Member since Jan 2024", products: 47, reviews: 12, helpful: 284 },
  product: {
    id: "xm5", brand: "Sony", cat: "Over-ear headphones", name: "WH-1000XM5",
    price: "37,000", was: "46,000", drop: "−20%", rating: "4.7", ratings: "2,847",
    score: "8.9", experts: 4, owners: "2,847",
    summary: "The best active noise cancellation in consumer headphones, with exceptional audio and a 30-hour battery. The redesign drops the folding hinge — a real trade-off for travellers — but ANC and sound remain best-in-class at this price.",
    works: ["Best-in-class active noise cancellation", "30-hour battery, 3-min quick charge", "LDAC for hi-res wireless audio", "Comfortable for 4+ hour sessions", "Multipoint — two devices at once"],
    tradeoffs: ["No longer folds flat — less travel-friendly", "Mostly plastic build feels less premium", "Touch controls occasionally unreliable", "Only a 1-year warranty"],
    bestFor: ["Remote workers", "Frequent flyers", "Audiophiles", "WFH focus"]
  },
  sources: [
    { outlet: "The Verge", title: "Sony WH-1000XM5 review: still the best", score: "9/10", trust: 92, date: "Jun 2022", quote: "The XM5 refines the formula with better ANC and a cleaner design, though losing the folding hinge is a meaningful trade-off for frequent travellers." },
    { outlet: "RTINGS.com", title: "WH-1000XM5 Headphones Review", score: "8.5/10", trust: 97, date: "Jun 2022", quote: "Measured ANC performance ranks among the best tested. Bass is well-extended and treble stays balanced at any volume." },
    { outlet: "What Hi-Fi?", title: "Sony WH-1000XM5 review", score: "5/5", trust: 88, date: "Jul 2022", quote: "Outstanding noise cancellation, excellent sound and impressive battery life make these a clear top pick at their price." },
    { outlet: "Tom's Guide", title: "Sony WH-1000XM5 Review", score: "Editor's Choice", trust: 85, date: "Jun 2022", quote: "Sony's flagship sets the gold standard for noise-cancelling performance and overall audio quality in the ₨40,000 range." }
  ],
  ownership: {
    reliability: "4.2", repair: "3", warranty: "1 yr",
    issues: [{ t: "Headband padding wear", n: 18, sev: "watch" }, { t: "Firmware update bugs", n: 9, sev: "fixed" }, { t: "Ear cushion peeling", n: 6, sev: "watch" }],
    owners: [
      { i: "BT", name: "Bikash T.", time: "Owned 2 years", text: "Still going strong after two years of daily use. Ear pads wore at 18 months but Sony replaced them under warranty. ANC still genuinely impresses me." },
      { i: "PK", name: "Prerana K.", time: "Owned 18 months", text: "Battery has slightly degraded but still gets me through a full workday. A firmware update at month 12 briefly broke touch controls — fixed a week later." }
    ]
  },
  retailers: [
    { name: "Daraz", price: "37,000", n: 37000, stock: "In stock", best: true },
    { name: "HamroBazar", price: "37,500", n: 37500, stock: "In stock" },
    { name: "SastoDeal", price: "38,000", n: 38000, stock: "In stock" },
    { name: "Hukut", price: "39,000", n: 39000, stock: "2 left" }
  ],
  history: [46, 45.5, 44, 44, 42.5, 43, 41, 40, 41, 39.5, 38, 37],
  months: ["O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S"],
  community: [
    { i: "RM", name: "Rajan M.", badge: "Verified owner", time: "6 months", title: "Transformed my open-plan office", text: "I bought these to survive a noisy open-plan office and they completely changed my workday. Calls are clear and the ANC handles keyboards and chatter.", helpful: 162, kind: "Review" },
    { i: "AR", name: "Ayesha R.", badge: "Verified owner", time: "1 year", title: "Nearly perfect — just wish they folded", text: "Sound and ANC are genuinely impressive. My only real complaint is that they don't fold like the XM4. I travel often and needed a bigger case.", helpful: 89, kind: "Review" },
    { i: "DC", name: "Dipesh C.", badge: "Q&A", time: "3 days ago", title: "XM5 vs QC45 for 10-hour flights?", text: "Comfort on long flights is my #1 priority — sound quality second. Fly KTM–London four times a year. Which would you pick?", helpful: 22, kind: "Q&A" }
  ],
  compare: [
    { id: "xm5", brand: "Sony", name: "WH-1000XM5", price: "37,000", tag: "Top ANC" },
    { id: "qc45", brand: "Bose", name: "QuietComfort 45", price: "32,500", tag: "Lightest" },
    { id: "apm", brand: "Apple", name: "AirPods Max", price: "59,500", tag: "Best build" }
  ],
  specs: [
    { k: "Price", v: ["₨ 37,000", "₨ 32,500", "₨ 59,500"], w: 1 },
    { k: "ANC rating", v: ["9.4", "8.8", "8.9"], w: 0 },
    { k: "Battery", v: ["30 h", "24 h", "20 h"], w: 0 },
    { k: "Weight", v: ["250 g", "238 g", "385 g"], w: 1 },
    { k: "Folds flat", v: ["No", "Yes", "No"], w: 1 },
    { k: "Multipoint", v: ["Yes", "No", "No"], w: 0 },
    { k: "Hi-res audio", v: ["LDAC", "—", "—"], w: 0 },
    { k: "Evidence score", v: ["8.9", "8.5", "8.3"], w: 0 }
  ],
  tradeSummary: "Sony leads on ANC, battery and hi-res audio. Bose is lighter, folds flat and costs ₨4,500 less. AirPods Max suits iPhone users who value build over battery life.",
  decision: {
    coverage: [{ k: "Expert reviews", d: "4 independent sources", v: 4 }, { k: "Owner reports (6+ mo)", d: "312 verified owners", v: 5 }, { k: "Lab benchmarks", d: "2 labs", v: 4 }, { k: "Reliability, past 2 yrs", d: "Limited data", v: 1 }],
    priorities: [{ t: "Strong noise cancellation", ok: true }, { t: "All-day battery", ok: true }, { t: "Folds flat for travel", ok: false }],
    uncertain: "18 owners report headband padding wear after a year. Sony hasn't confirmed a fix.",
    timing: "₨9,000 below its 12-month high. Prices usually dip again during Dashain sales."
  },
  trending: [
    { brand: "Sony", name: "WH-1000XM5", cat: "Headphones", price: "37,000", score: "8.9", note: "−20% vs 12-mo high" },
    { brand: "Apple", name: "MacBook Air M3", cat: "Laptops", price: "145,000", score: "9.1", note: "28 new owner reports" },
    { brand: "LG", name: "C4 OLED 65\"", cat: "TVs", price: "211,000", score: "8.7", note: "Price watch" },
    { brand: "Logitech", name: "MX Master 3S", cat: "Accessories", price: "14,500", score: "9.0", note: "Community pick" }
  ],
  collections: [
    { name: "Home office upgrade", n: 4, updated: "2 days ago", items: ["WH-1000XM5", "LG 27UK850", "MX Keys"] },
    { name: "Travel gear 2026", n: 3, updated: "1 week ago", items: ["WH-1000XM5", "Peak Design Bag", "Anker 737"] },
    { name: "Gaming setup", n: 5, updated: "3 weeks ago", items: ["ROG Swift PG279", "Logitech G Pro X2"] }
  ],
  alerts: [{ name: "Sony WH-1000XM5", target: "35,000", now: "37,000" }, { name: "MacBook Air M3", target: "135,000", now: "145,000" }],
  categories: [{ n: "Headphones", c: "138" }, { n: "Laptops", c: "214" }, { n: "Phones", c: "176" }, { n: "TVs", c: "82" }, { n: "Cameras", c: "64" }, { n: "Appliances", c: "245" }],
  notifications: [
    { k: "Price drop", t: "WH-1000XM5 dropped ₨6,000", d: "Now ₨37,000 — lowest in 12 months", time: "2h" },
    { k: "Reply", t: "Prerana K. answered your question", d: "“Battery is still above 25 hours after 18 months…”", time: "5h" },
    { k: "Update", t: "New long-term report", d: "LG C4 OLED — 3 owners after 18 months", time: "1d" }
  ]
};
