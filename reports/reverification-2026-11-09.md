# Weekly AI dataset re-verification — 2026-11-09

Automated weekly check of `data/laws.json` (37 entries). Sanity check (`python3 test_engine.py`) passes 23/23 — dataset is well-formed. **No data edits were applied this run** — every candidate fix below needs legal/editorial judgment (new entry, trigger-grammar change, or a disputed secondary source) rather than qualifying as a safe mechanical fix (confirmed permanent URL redirect, or a `pending` tier whose effective date has demonstrably passed). The two current `pending` entries (CO_ADMT, NY_RAISE) both have effective dates of **Jan 1, 2027** — still in the future as of today, so neither flips tier.

**Methodology note:** this session's network policy blocks direct `curl`/`WebFetch` to external hosts (government/standards sites are not on the allowlist), so the dead-link check below was done via WebSearch-based verification rather than true HTTP status codes. Treat `COULD_NOT_VERIFY` as "not independently confirmed," not "likely broken."

## (a) Dead or redirected source links

| id | status | confidence | note |
|---|---|---|---|
| NY_RAISE | **suspect stale/redirect** | medium | Bill was amended/renumbered (S6953‑B/A6453‑B) and signed Dec 19, 2025. The bare `nysenate.gov/.../S6953` URL likely shows an earlier bill version rather than the enacted/chapter-amended text. Recommend repointing to the enacted chapter once its number is confirmed. |
| UAE_AI | **suspect dead** | low | `digitaldubai.ae` did not surface in any search pass. All current UAE AI coverage centers on DIFC Regulation 10 instead. Doesn't confirm the Dubai AI Act doesn't exist, but the source link itself could not be corroborated — recommend a manual check. |
| HIPAA, TX_TDPSA, CO_CPA, CO_ADMT, VA_VCDPA, OTHER_STATES, UT_UAIPA, TX_TRAIGA, CA_SB53, CA_AB2013, STATE_CHATBOT, GDPR, UK_GDPR, EU_AI_ACT, KR_AI_BASIC, VN_AI_LAW, JP_AI_ACT, TW_AI_BASIC, COE_AI_CONVENTION, NIST_AI_RMF, OECD_AI, ISO_23894, G7_HIROSHIMA | OK | high/medium | Confirmed live and on-topic via search. |
| COPPA, FTC5, CCPA, CT_CTDPA, IL_HB3773, TN_ELVIS, PIPEDA, CN_AI, ISO_42001, PCI_DSS, UNESCO_AI, SG_MODEL_AI | could not verify | medium/low | Not directly indexed by search; no dead-link evidence found either. Mostly government/standards-body pages that search doesn't surface well. |

## (b) Entries with stale tier/date/penalty/implementation detail

| id | finding | confidence | source |
|---|---|---|---|
| NY_RAISE | `tier_override: pending` and the Jan 1, 2027 effective date are still correct, but the `ai` bullets describe it as not-yet-enacted. It was actually **signed Dec 19, 2025** and chapter-amended **Mar 27, 2026** (A9449), which replaced the compute-based threshold with a **$500M revenue threshold** for covered developers and set AG penalties at **$1M (first violation) / $3M (subsequent)**. Recommend updating `ai`/`enf` prose and the source URL once the exact chapter number is confirmed. | medium-high | jdsupra.com/legalnews/new-york-laws-raise-the-bar; mondaq.com coverage of the chapter amendment |
| IL_HB3773 | Dataset says "IDHR to issue implementing rules... draft rules issued Dec 2025." IDHR actually **proposed** rules May 15, 2026, then **withdrew** them June 2, 2026 to coordinate with other agencies; no rules refiled as of the most recent confirmable date. The statute itself is unaffected (in force since Jan 1, 2026). | medium | seyfarth.com coverage of the IDHR withdrawal |
| VN_AI_LAW | Dataset says implementing decrees are "still developing." **Decree 142/2026/ND-CP** was issued Apr 30, 2026 (effective May 1, 2026), providing the first detailed three-tier risk-classification guidance, a regulatory sandbox, and foreign-provider representation requirements. The official high-risk list itself reportedly remained pending as of mid-2026. | medium-high | mondaq.com coverage of Decree 142/2026/ND-CP |
| TW_AI_BASIC | Dataset frames MODA's risk-classification framework as a future task. MODA actually released **AI Risk Classification Framework v1.0 on July 7, 2026** (effective same day). | medium | leeandli.com (secondary; MODA's own page not independently confirmed) |
| EU_AI_ACT | Dataset states Article 50 transparency/labeling "still takes effect August 2, 2026," unaffected by the Digital Omnibus. Some secondary sources say the Omnibus **also** pushed transparency/watermarking duties for systems already on the market (plus two new prohibitions) to **December 2, 2026** — contradicting that claim. Sources disagree on the exact sequence; recommend checking the final EUR-Lex consolidated text before editing. High-risk deferral dates (Annex III → Dec 2027, Annex I → Aug 2028) are confirmed correct. | medium (conflicting sources) | secureprivacy.ai, dastra.eu coverage of the Council-approved Omnibus |
| STATE_CHATBOT | The trigger's geography list (`us_ca, us_ut, us_other, us_tx, us_co, us_ny, us_il`) omits three states that enacted companion/chatbot-disclosure laws in 2026: **Washington** (HB 2225, signed Mar 24, 2026, effective Jan 1, 2027, private right of action), **Oregon** (SB 1546, enacted Mar 2026, effective Jan 1, 2027), and **Nebraska** (LB 525 Conversational AI Safety Act, enacted Apr 14, 2026, effective Jul 1, 2027). Louisiana SB 243/264 passed both chambers ~June 1, 2026 but signature is unconfirmed — don't add yet. Adding WA/OR/NE requires new geography options in `data/questions.json` too (the README already flags these as "intentionally NOT in the form yet"), so this is a tracked follow-up, not a one-line fix. | high | mondaq.com (Washington), mayerbrown.com (Oregon/Washington) |
| UT_UAIPA | Low materiality: 2026-session **HB 320** (signed Mar 18, 2026, effective May 6, 2026) and **SB 38** further reworked the testing-program/consumer-protection chapter numbering. The stated sunset date (Jul 1, 2027) is unchanged — this only affects the "as amended 2025 (SB 226, SB 332)" framing, which is now one session out of date. | medium | davispolk.com client alert |
| UAE_AI | Could not independently corroborate a "Dubai AI Act effective March 2026" as a distinct instrument — search surfaced only **DIFC Regulation 10** (in full enforcement since Jan 1, 2026) and a DIFC consultation (Consultation Paper No. 3 of 2026, closed Jul 18, 2026) proposing amendments plus a new Regulation 11, not confirmed finalized. This doesn't prove the dataset is wrong, but it couldn't be corroborated and is worth a direct check against `digitaldubai.ae`/DIFC's own publications. | low | vanta.com, gulfnews.com |
| CO_ADMT, TX_TRAIGA, CA_SB53, CA_AB2013, KR_AI_BASIC, CT_CTDPA, CN_AI | Checked — **no material staleness found.** All tiers, effective dates, and enforcement details confirmed current. | high/medium | checkr.com, iapp.org, ktslaw.com, crowell.com, mondaq.com, china-briefing.com |
| TN_ELVIS, OTHER_STATES | Not independently re-verified this pass (no incidental search hits either way). Recommend a dedicated check next cycle. | low | — |

## (c) Candidate new laws to add

| Candidate | Jurisdiction | Binding? | Enacted | Why in scope | Confidence | Source |
|---|---|---|---|---|---|---|
| **Connecticut SB 5 — AI Responsibility and Transparency Act** (+ companion HB 5222) | US state (CT) | Binding | Signed by Gov. Lamont ~May 27–Jun 2, 2026 | Comprehensive developer/deployer AI duties, companion-bot rules, employment-AI rules, frontier-model whistleblower protections, minors'-platform rules. Staggered effective dates: Oct 1, 2026 (subscriptions/whistleblower) → Oct 1, 2027 (employment) → Jan 1, 2028 (minors). **Distinct from `CT_CTDPA`**, which is the privacy statute (PA 25‑113) — this is a separate, binding, cross-sector AI law not represented anywhere in the dataset. | high | jdsupra.com/legalnews/connecticut-enacts-comprehensive-ai (corroborated by Holland & Knight, WilmerHale, Mofo, FPF) |
| **New York GBL § 396‑b — "Synthetic Performer" AI advertising disclosure** | US state (NY) | Binding | Signed Dec 11, 2025; in force since Jun 9, 2026 | Requires disclosure when ads use AI-generated synthetic performers; civil penalties $1,000 (first)/$5,000 (subsequent). Distinct from `NY_RAISE` (frontier-model safety) and from `STATE_CHATBOT` (conversational bots, not ad disclosure). | high | hunton.com coverage |

### Tranche 2 TODO backlog (README) — current status, none crossed into enacted/binding scope

- **US federal AI EO/preemption** — still EO 14365 (Dec 11, 2025), an executive order with no statutory preemptive force. Correctly excluded.
- **UK AI bill** — no government bill introduced; the Lords' AI Regulation Bill died in April 2026. Still none.
- **Brazil PL 2338** — still stuck in Chamber committee ("Aguardando Parecer"). Not law.
- **India AI Governance Guidelines** (Nov 2025) — confirmed non-binding; explicitly recommends against standalone legislation. Correctly excluded.
- **Australia mandatory AI guardrails** — still a proposal; government has pivoted toward a voluntary/sector-based approach. Still draft.
- **China national AI law** — no draft published yet; only a Cybersecurity Law AI amendment (in force Jan 1, 2026) exists, separate from the existing `CN_AI` cluster.
- **Turkey draft AI law** — still pending in the TBMM.
- **Switzerland CoE Framework Convention implementation** — still pre-consultation; draft legislation expected by end of 2026.

One unconfirmed secondary mention: a NY "AI Training Data Transparency Act" reportedly awaiting the Governor's signature per some recent coverage — worth checking signature status next cycle.
