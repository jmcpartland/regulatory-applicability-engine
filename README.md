# Compliance Check — Build Handoff

(Internal/technical names — repo, folder, npm package, Cloudflare Pages project, and the
`regulatory.mcpartland.ai` subdomain — are unchanged; only the user-facing display name changed.)

Free lead-magnet tool for the Fractional CISO / AI Security Advisor practice.
Takes 8 questions about an SMB and returns which privacy / cyber / AI regulations
apply and why. **Client-side only, static bundle, no backend.**
Target deploy: `tools.mcpartland.ai` (Cloudflare Pages via CNAME).

## Current state (as of 2026-09-13)

The **data layer, engine logic (Python + TypeScript), and React UI are all
built and tested.** Every law/framework now also carries a `source` URL to its
official text, and cards are collapsible (closed by default) across both the
results view and a new full-library browse view.

```
data/
├── laws.json           37 entries, machine-readable trigger logic + source URL
└── questions.json      8 questions (4 mandatory + 4 optional w/ defaults)
eval.py                 tri-state trigger resolver + tier assignment (Python — the contract)
test_engine.py          17 regression tests — ALL PASSING
src/
├── engine/
│   ├── types.ts         shared types (Law, Question, TriggerNode, Tier, ...)
│   ├── data.ts           imports data/*.json directly, typed
│   ├── engine.ts         TS port of eval.py (resolve/applyDefaults/tierFor/evaluate)
│   └── engine.test.ts    the same 17 regressions, ported to vitest — ALL PASSING
├── components/
│   ├── QuestionForm.tsx           single-page form, mandatory questions gate submission
│   ├── ResultsView.tsx            assessment results grouped by tier, all closed by default
│   ├── LibraryView.tsx            browse all 37 entries grouped by category, no assessment needed
│   ├── LawCard.tsx                collapsible card — styling reused from privacy_cyber_laws_reference.jsx
│   ├── ExpandCollapseControls.tsx "Expand all / Collapse all" used on both list views
│   └── NavBar.tsx                 switches between Assessment and Library views
├── lib/
│   ├── meta.ts           tier/category/severity/domain color + label metadata
│   └── useOpenSet.ts     shared open/closed-card state for the two list views
└── App.tsx               view (assessment/library) + form <-> results state
README.md                 this file
```

Run the Python tests before and after any change to the data or logic:
```
python3 test_engine.py     # expect: 17 passed, 0 failed
python3 eval.py            # runs built-in personas, prints grouped results
```

Run the TS/React side:
```
npm install
npm run dev                # start the app at localhost:5173
npm test                   # vitest — expect: 17 passed, 0 failed
npm run build               # production static bundle -> dist/
```

### Card contents (closed vs. open)

Each law/framework card is designed to answer, at a glance, "does this affect
my business and how urgent is it" (business owner) without opening it, and
"where do I go to implement/read the actual requirement" (engineer/advisor)
once opened:

- **Closed** — name + acronym, category badge (US Federal/State/Intl/AI/Framework),
  domain badge (Privacy/Cybersecurity/AI/Multi-domain), severity badge
  (Critical/Important/Watch — see below for a caveat on voluntary frameworks),
  year, and a one-line SMB-relevance teaser.
- **Open** — adds **Why this tier** (only when `tier_reason` is set — explains
  *why* something landed in "verify" or "pending" instead of a flat "applies,"
  e.g. PCI DSS: "Direct processing = full scope; third-party processor =
  reduced scope (SAQ), confirm the SAQ type."), Scope, full SMB relevance, AI
  implications (bulleted, technical — CFR/Article/Requirement/Control numbers
  where they exist), Enforcement (who enforces + penalties), Recommended
  action (a concrete next step), and a **Source** link to the official
  statute/regulator page/standards-body page for that entry.

### Content-quality pass (2026-09-14)

A full read-through of all 37 entries surfaced two real gaps, both now fixed:

1. **`act` (and several `smb`/`enf`/`ai` fields) were written in advisor voice,
   not reader voice** — e.g. GLBA's action was *"Include AI risk assessment in
   every GLBA Safeguards compliance **engagement**"* and NIST AI RMF's SMB
   relevance was *"The backbone of **the advisory practice**."* This dataset
   originated as an internal advisor cheat sheet; when it became a public
   self-service tool, ~15 fields across 12 entries still addressed a
   hypothetical advisor talking about "their clients" rather than the SMB
   owner actually reading the result. All were rewritten to speak directly to
   the reader in second person (e.g. *"Make sure your GLBA Safeguards Rule
   risk assessment explicitly covers the AI systems that touch customer
   financial data."*). `tier_override`/`tier_override_map`/`trigger` logic
   was untouched — only prose fields changed, verified by the full
   17/17 regression pass on both sides after every batch of edits.
2. **`tier_reason` existed in the data (18 of 37 entries) but was never
   rendered.** Now shown as a "Why this tier" callout when present.

Also fixed: voluntary frameworks (`tier_override: "recommend"`, e.g. NIST AI
RMF, ISO 27001, SOC 2) were displaying a "Critical"/red severity badge and a
red "Enforcement" section right next to enforcement text reading *"Voluntary —
no penalties."* `pri` now renders as a neutral "High/Medium/Low priority"
badge and a slate "Enforcement (voluntary)" section specifically for
`recommend`-tier entries, so red is reserved for entries with real legal
exposure (`src/lib/meta.ts`'s `priBadge()`).

**Deliberately not added:** a "how much effort/cost to comply" rating per
entry — that's the practice owner's professional judgment call, not a fact to
look up or infer, so it wasn't fabricated here.

## Architecture

**Trigger grammar** (in `laws.json`, each law has a `trigger`):
- `{ "always": true }` — baseline, applies to everyone
- `{ "q": "geography", "in": ["us_ca"] }` — TRUE if user's answer intersects the list
- `{ "any": [...] }` / `{ "all": [...] }` / `{ "not": {...} }` — boolean composition
- `tier_override` — force a tier (e.g. `pending`, `recommend`, `verify`)
- `tier_override_map` — per-answer tier (e.g. PCI: `yes_processor` → `verify`)

**Tri-state resolution:** each trigger resolves to TRUE / FALSE / None(unknown).
Tiers: `baseline`, `applies`, `pending`, `verify`, `recommend`, `watch`.

**Mandatory vs optional questions:** `sector`, `geography`, `data_types`,
`ai_use` are mandatory (they gate coverage). The other four are optional and
carry a `default` — the engine fills those in via `apply_defaults()` so a
skipped optional question refines rather than floods the result. **The UI must
enforce that the 4 mandatory questions are answered before showing results.**

## Next tasks (in Claude Code)

1. ~~Port the engine to JS/TS.~~ Done — `src/engine/engine.ts` mirrors `eval.py`.
2. ~~Build the React UI.~~ Done — single-page form (see Open decisions), results
   grouped by tier, card styling per below.
3. ~~Port the tests.~~ Done — `src/engine/engine.test.ts`, 16/16 passing under vitest.
4. **Email-gate the PDF export, not the results** (per earlier product decision).
   Results visible; email captures to download a branded PDF. Not started —
   no PDF generation or email capture exists yet.
5. ~~Add the "runs entirely in your browser, stores nothing" line~~ Done — shown
   on both the form and results screens.
6. **Ship as a static bundle → Cloudflare Pages.** `npm run build` produces a
   working `dist/` (verified); the actual CNAME/Pages deploy hasn't been done.

## Open decisions

- **37 grouped entries vs. 59 discrete.** Currently 37 (30 original + 3 new
  state laws, with overlapping items grouped e.g. `OTHER_STATES`). Prior session
  counted 59 by splitting variants. Recommend deciding after seeing the 37-entry
  UI — 37 clean discriminating entries may be better UX for a lead magnet. Note
  `data/laws.json`'s own `meta.entry_count` still says 59 — stale, worth fixing
  when this is decided.
- **One-page form vs. step wizard** — decided as one-page for this build (all 8
  questions on a single scrollable page, mandatory ones marked and gating the
  submit button) to minimize drop-off for a lead magnet. Revisit if analytics
  show otherwise once it's live.
- **`privacy_cyber_laws_reference.jsx` doesn't exist in this project** — only a
  Word-doc export of it does (`~/Downloads/privacy_cyber_laws_reference.docx`).
  The card styling in `src/components/LawCard.tsx` was reverse-engineered from
  that document's formatting (it's a straight Tailwind palette: category accent
  colors on section headers/left borders, a fixed red Enforcement row, a
  category-colored Key Action row). If the actual `.jsx` turns up, worth a
  pass to true it up against the original.

## Corrections baked into the data (verified this session)

CO SB24-205 repealed → SB26-189 (pending 2027) · EU AI Act high-risk deferred to
Dec 2027 · TX TDPSA employment/B2B carve-out · GDPR "bias amendment" was a
proposal (not a law — not in dataset) · FTC remedies limited by AMG Capital 2021
· Utah 2025 narrowed disclosure (watch tier) · NIS2 = Directive, per-member-state
(verify) · UK DUAA 2025 permission-first ADM · ISO 27001:2022 (2013 expired) ·
+ 3 new entries: TN ELVIS, CT CTDPA PA25-113, IL HB3773.

## Source URL provenance (added 2026-09-13)

Every entry's `source` field was researched via live web search/fetch, not
guessed — see the commit/session history for the full research trail. Most
resolve directly to the official statute, regulator page, or standards body.
A few are worth double-checking on a periodic data-refresh pass since they
were flagged as lower-confidence at research time (site blocked automated
verification, or the citation is inherently unstable):
- **HIPAA, ISO_27001, ISO_27701, ISO_42001** — hhs.gov/iso.org block automated
  fetch; URLs match the standard citation pattern but weren't visually confirmed.
- **TX_TDPSA, IL_HB3773, CT_CTDPA** — government legislature sites hit bot
  detection or TLS errors during verification; confirmed via search snippets only.
- **UT_UAIPA** — Utah's code site version-pins by amendment date, so there's no
  single stable "current" URL; linked to the chapter landing page.
- **TN_ELVIS** — linked to the enrolled bill PDF (capitol.tn.gov) rather than a
  codified statute page since Tennessee has no free statute portal; the
  codified citation is Tenn. Code Ann. § 47-25-1101 et seq. if a better link
  turns up.
- **HITRUST, SOC2, PCI_DSS, ISO standards** — these are licensed/paywalled
  frameworks; linked to each standards body's own official overview/catalogue
  page since no free full-text exists.
