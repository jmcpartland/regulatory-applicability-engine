# Weekly AI dataset re-verification — 2026-10-26

Automated re-verification of `data/laws.json` (v2.0, 37 entries). Checked: dead
links, currency of tier/effective-date/penalty claims, and gaps (new binding
AI laws worldwide in the last ~2-4 weeks). `python3 test_engine.py` passes
(23/23) before and after this PR's one mechanical edit.

**Tooling note:** this session's outbound network policy blocks direct
`curl`/raw TCP to all external hosts (403 policy denial on every CONNECT,
confirmed via the proxy status endpoint — not a dead-link signal), and the
`WebFetch` tool returned DNS-resolution failures for all URLs including
`https://example.com` (a broken tool in this environment, not a per-host
block). The dead-link check below was therefore done indirectly via web
search (does the exact URL/path turn up in a search index, do other pages
cite it as current) rather than true HTTP status codes. Confidence is marked
accordingly — treat anything below "high" as needing a manual click-through.

## (a) Source-link health (indirect check — see tooling note)

No link was confirmed dead via an actual HTTP error. A handful could not be
confirmed live either, and a couple show signs of having moved. No URL edits
are included in this PR since none of these reached "confirmed 301 to a
stable new URL" — all need a human to click through.

| id | url | signal | confidence |
|---|---|---|---|
| **SG_MODEL_AI** | pdpc.gov.sg/.../2020/01/model-ai-governance-framework | PDPC's own announcement of this framework was found at a *different* path (`/News-and-Events/Announcements/2020/01/...`) — possible stale path | medium |
| **UAE_AI** | digitaldubai.ae | Not returned by search at all; Dubai's current AI consumer presence surfaced at `dubai.ae`/`chat.dubai.ae` instead | low-medium |
| **PCI_DSS** | pcisecuritystandards.org/standards/pci-dss/ | Exact page not found; one source describes a recent site restructure | low |
| **IL_HB3773** | ilga.gov/.../10300HB3773enr.htm | This exact bill-number path could not be located at all by search (only near-miss numbers) | low — needs direct manual check, this is the one most worth a human eyeballing |
| **UNESCO_AI** | unesco.org/en/artificial-intelligence/recommendation-ethics | No unesco.org page returned at all, only third-party summaries | low |
| COPPA, CT_CTDPA, TN_ELVIS, STATE_CHATBOT | (various) | Not independently returned by search, but no sign of a moved/dead page either — likely just search-index gaps | n/a |
| Remaining ~26 entries | — | Either the exact URL was returned by search, or a strong secondary citation uses the same path | medium-high |

**Recommendation:** re-run this check once `WebFetch` is working, or with
direct curl access to these hosts, to get real HTTP status codes.

## (b) Stale tier / effective-date / penalty findings

| id | finding | confidence | source |
|---|---|---|---|
| **CT_AI_SB5 / IL_AI_SB315** | *(see gap section — not existing entries, net-new laws)* | — | — |
| **NY_RAISE** | Signed Dec 19, 2025, but a later chapter amendment (S8828/A9449, ~Mar 27, 2026) reset wording and reportedly re-codified the law as GBL Art. 44-B §§1420-1429, with penalties reported at $1M/$3M (vs. an earlier $10M/$30M figure one source cites for the original bill). The dataset's conclusion (pending, effective Jan 1, 2027) is still correct, but citing only bill "S6953" is outdated — should cite the enacted chapter. | medium (sources disagree on exact penalty figures) | https://www.mofo.com/pdf/resources/insights/260105-new-york-enacts-the-raise-act-regulating-frontier-ai-models |
| **IL_HB3773** | The entry's bullet "IDHR to issue implementing rules... (draft rules issued Dec 2025)" is stale: IDHR reportedly published proposed rules later in 2026 and then **withdrew them** (~June 2, 2026) after comments; no final/refiled rules confirmed as of Oct 2026. The law itself is in force (confirmed), just without final implementing rules. | medium | https://www.brightdefense.com/news/illinois-ai-hiring-law-takes-effect-without-final-employer-rules/ |
| **VN_AI_LAW** | tier_reason/ai bullets say implementing decrees are "still developing" / "still being issued" without naming one — but Decree No. 142/2026/ND-CP (first implementing decree, high/medium/low risk classification) issued Apr 30, 2026, effective May 1, 2026. Worth naming the decree explicitly. | medium-high | https://www.tilleke.com/insights/vietnam-takes-major-step-in-ai-governance-with-new-guiding-decree/ |
| **TW_AI_BASIC** | tier_reason/ai bullets describe MODA's risk-classification framework as "forthcoming" — MODA published "AI Risk Classification Framework v1.0" (two-tier: high-risk/non-high-risk) on Jul 7, 2026. Still guidance-only with no direct private-sector obligations, so the **watch tier is still correct**, but the "forthcoming" wording is stale. | medium | https://www.leeandli.com/EN/NewslettersDetail/7661.htm |
| **CN_AI** | Two new binding CAC instruments postdate this entry: (1) CAC/NDRC/MIIT "Implementation Opinion" on intelligent agents (issued May 8, 2026 — filing/testing/human-override duties); (2) finalized rules on human-like interactive/companion AI (mandatory CAC security assessment at 1M+ registered users, ~Jun 2026). Entry should be expanded to cover these. | medium | https://digitalpolicyalert.org/event/39795-... , https://triviumchina.com/2026/06/05/cac-pursues-small-fast-flexible-approach-to-ai-regulation/ |
| **COE_AI_CONVENTION** | Dataset says "not yet in force" — but the EU formally ratified May 15, 2026 and one secondary source (babl.ai) claims the convention entered into force Nov 1, 2025 (needing 5 ratifications). Not independently confirmed against the CoE Treaty Office's own status page. If true, "not yet in force" is stale, though the "watch" tier likely stays right either way (it binds states, not businesses). | medium — needs direct Treaty Office confirmation | https://www.coe.int/web/artificial-intelligence/-/european-union-ratifies-the-council-of-europe-framework-convention-on-artificial-intelligence |
| **EU_AI_ACT** | Digital Omnibus deferral dates (Annex III → Dec 2, 2027; Annex I → Aug 2, 2028) **confirmed accurate** via Reg. (EU) 2026/1744, in force Jul 27, 2026. One single-sourced, unconfirmed claim: Article 5's prohibited-practices list reportedly grew from 8 to 10 items with new bans/marking duties effective Dec 2, 2026 — not yet reflected in the entry; worth a line if corroborated by a second source. | high (omnibus dates) / low (Art. 5 expansion claim) | https://www.mondaq.com/eu-digital-omnibus-on-ai-enters-into-force/1825722 |
| **TX_TRAIGA** | **Fixed in this PR** — "act" field said "...before Jan 1, 2026," which has now passed (law took effect on schedule, confirmed, no other changes). Rewrote to present tense. Purely cosmetic, no legal-content change. | high | https://www.klgates.com/thought-leadership/Pared-Back-Version-of-the-Texas-Responsible-Artificial-Intelligence-Governance-Act-Signed-Into-Law-6-24-2025 |

**Confirmed current, no action needed:** CO_ADMT (SB 26-189, signed May 14
2026, on track for Jan 1, 2027), CA_SB53, CA_AB2013 (both took effect Jan 1,
2026 as scheduled, no amendments), Utah UAIPA (a narrow 2026 HB 320 touches
only the state Office of AI Policy's internal duties, not the consumer
disclosure rules this entry describes), Tennessee ELVIS Act (no amendments
or notable litigation found), South Korea AI Basic Act (grace-period framing
still roughly right), Japan AI Promotion Act (non-binding guidance update,
doesn't change "watch" tier), Connecticut CTDPA/PA 25-113 (July 1, 2026
changes confirmed in force).

## (c) Gap check — candidate new entries

Two already-enacted, binding, AI-specific state laws are missing from the
dataset entirely. Neither is a drafting-stage bill — both are signed law,
and the first is already partly in force:

1. **Connecticut AI Responsibility and Transparency Act (SB 5 / Public Act
   26-15)** — a *separate* new CT AI statute (distinct from the existing
   CT_CTDPA privacy-law entry). Covers frontier-developer duties, automated
   employment decision tools (AEDTs), companion chatbots, synthetic-content
   provenance, and "AI is not a defense" anti-discrimination language.
   Signed May 27, 2026. First wave (AEDT framework, developer/deployer
   duties) took effect **Oct 1, 2026 — already in force today**. Frontier
   internal-reporting duty Jan 1, 2027; consumer-notice duties and
   synthetic-content labeling Oct 1, 2027.
   Confidence: medium (law-firm/advocacy summaries, not yet checked against
   the official CT General Assembly enacted text).
   Sources: https://www.shipmangoodwin.com/insights/ai-bill-passes-general-assembly-broad-workforce-bill-follows.html ,
   https://fpf.org/blog/sb-5-in-five-what-to-know-about-connecticuts-new-ai-law/

2. **Illinois Artificial Intelligence Safety Measures Act (SB 315)** — a
   frontier-AI safety law, distinct from the existing IL_HB3773 (AI in
   employment) entry. Governance/risk-management rules, transparency
   reports, 72-hr/24-hr incident reporting, and mandatory annual independent
   third-party audits for "large frontier developers" (>$500M revenue or
   >10^26 FLOPs training) — reportedly a first among US states. Signed Jul
   6, 2026; effective Jan 1, 2027 (audit/framework duties phase to Jan 1,
   2028). AG enforcement, penalties reported up to $1M (first violation) /
   $3M (subsequent).
   Confidence: medium-high (consistent across multiple law-firm sources
   with specific statutory detail).
   Sources: https://www.skadden.com/insights/publications/2026/07/illinois-enacts-ai-safety-law-becoming-first-state ,
   https://www.gtlaw.com/en/insights/2026/7/illinois-enacts-artificial-intelligence-safety-measures-act

No new binding law was found enacted specifically within the last 2-4 weeks
(a New Jersey AI compute-tax bill was only introduced Oct 19, 2026, not
enacted — out of scope). Both candidates above predate the strict 2-week
window but are clear, currently-relevant gaps worth prioritizing for the
next content pass, since drafting accurate `trigger`/`ai`/`tier` fields for
them needs legal judgment and is left for a maintainer rather than made
mechanically here.

## Summary of changes in this PR

- `data/laws.json`: bumped `meta.generated` to 2026-10-26; reworded
  `TX_TRAIGA.act` from forward-looking ("before Jan 1, 2026") to present
  tense, now that the date has passed. No tier, trigger, or legal-content
  changes. `test_engine.py` passes 23/23 before and after.
- This report.

Everything else above (stale wording in NY_RAISE/IL_HB3773/VN_AI_LAW/
TW_AI_BASIC/CN_AI/COE_AI_CONVENTION/EU_AI_ACT, the two candidate new CT/IL
entries, and the five lower-confidence source links) needs a maintainer's
legal judgment and is left as a recommendation, not an edit.
