# Weekly AI Dataset Re-verification — 2026-11-23

Scope: all 37 entries in `data/laws.json`. No edits were made to the dataset this
week (see "Why no edits" below). `python3 test_engine.py` passes: 23/23.

## Environment limitation (read this first)

This run's sandbox network policy blocks direct outbound HTTP to external hosts
(`curl` → 403 from the egress proxy on every one of the 37 source URLs tested;
`WebFetch` → DNS resolution failure). **No literal HTTP status check was
possible this week.** All verification below was done via `WebSearch`
(Anthropic's hosted search, which is not subject to the same sandbox network
policy) — i.e., checking whether a URL/topic is indexed and searching for
reported changes, not confirming a live 200/301/404. Every finding below is
marked with this caveat implicitly; treat "OK" as "no search-visible evidence
of a problem," not "HTTP 200 confirmed."

## (a) Dead or redirected source links

No entry showed search-visible signs of a broken or redirected source URL
(404 patterns, "moved" notices, or a different canonical page displacing the
cited one). **Confidence: low-medium**, given the above limitation — this is
not equivalent to a direct status-code check. Recommend re-running with
`curl` once the environment's network allowlist can include these ~35 distinct
government/standards-body hosts, or running this check from an environment
with open network access.

## (b) Entries with stale tier/date/penalty content

| Entry | Issue | Confidence | Source |
|---|---|---|---|
| **CCPA** | AI bullet says ADMT regs "finalized 2024." Actually: CPPA's ADMT/cybersecurity-audit/risk-assessment regs were OAL-approved Sept 2025, took effect Jan 1 2026; ADMT-specific compliance not required until Jan 1 2027. The "2024" is inaccurate. | Medium | [cppa.ca.gov announcement](https://cppa.ca.gov/announcements/2025/20250923.html), Mayer Brown Jan 27 2026 alert |
| **NY_RAISE** | Source URL points to the original Dec 19, 2025 bill page (nysenate.gov/legislation/bills/2025/S6953), but the enacted text is a chapter amendment (S6953B/A6453B) signed Mar 27, 2026. Effective date (Jan 1, 2027) is still correct; only the source link is outdated. | Medium | Wiley, Davis Polk client alerts (exact chaptered-bill URL not independently confirmed — needs manual lookup before editing) |
| **CA_AB2013** | No dataset change needed — law remains in force — but there is live litigation (*xAI v. Bonta*) challenging it; preliminary injunction denied Mar 4, 2026, appeal pending at the 9th Circuit as of Jul 2026. Worth noting for awareness. | Low (informational only) | Law360, IAPP coverage |
| **UT_UAIPA** | Possible companion law: Utah HB 438 "Companion Chatbot Safety Act" (2026 session) reportedly passed both chambers with effective dates in 05/06/2026 and 08/01/2026, but enactment (governor's signature/chapter number) could not be confirmed via search. If enacted, this sits alongside UT_UAIPA and is relevant to STATE_CHATBOT. **Needs direct confirmation at le.utah.gov before any dataset change.** | Medium (unconfirmed enactment) | Utah legislature bill tracker (not independently fetched) |
| **TN_ELVIS / STATE_CHATBOT** | Tennessee SB 1700 ("CHAT Act") passed both chambers (90-0 / 31-0, ~May 2026) but sources conflict on whether the final text is binding chatbot-safety rules or was amended down to a TACIR study mandate. Likely **not** a new binding law — low priority, recommend verifying before any addition. | Low | Conflicting legislative-tracker summaries |
| **PIPEDA** | tier_reason cites "proposed AIDA / Bill C-27," but C-27 died at prorogation (Jan 6, 2025) and the Canadian government has confirmed AI provisions will not return in that form. A new bill, C-36 (tabled Jun 15, 2026), is privacy-only with no AIDA equivalent. The dataset's AI-bullet language referencing C-27/AIDA is now stale and should be revised or removed in a future content pass. | High | [IAPP](https://iapp.org/news/a/what-2026-may-bring-for-canadas-privacy-reform-efforts), [DLA Piper](https://www.dlapiper.com/en/insights/publications/2026/06/canada-tables-bill-c36-the-protecting-privacy-and-consumer-data-act) |
| **VN_AI_LAW** | tier_reason says "implementing decrees are still developing." A core implementing decree now exists: Decree 142/2026/ND-CP (effective May 1, 2026) plus Decision 33/2026/QĐ-TTg setting the high-risk AI list (transition to Mar/Sep 2027). The "still developing" framing is partly outdated. | Medium | [Tilleke & Gibbins](https://www.tilleke.com/insights/vietnam-takes-major-step-in-ai-governance-with-new-guiding-decree) |
| **TW_AI_BASIC** | MODA published the AI Risk Classification Framework v1.0 on Jul 7, 2026 — it currently binds government agencies only, not the private sector, so the entry's "watch" tier and overall thrust remain correct, but tier_reason's "forthcoming framework" language should note the framework now exists (without private-sector obligations yet). | Medium-high | [IAPP](https://iapp.org/news/a/taiwan-s-ai-risk-classification-framework-a-different-path) |
| **CN_AI** | `year` field ("2022–2025") omits two 2026 instruments: the Humanised AI Interactive Services Measures (effective Jul 15, 2026) and CAC/NDRC/MIIT AI Agent guidelines (May 8, 2026). Recommend extending the range to "2022–2026" and adding a bullet once confirmed against primary CAC text. | Medium | [China Briefing](https://www.china-briefing.com/news/china-ai-regulations-2026-enforcement-guidance-compliance/) |
| **UAE_AI** | Two date/naming concerns: (1) no source actually names a "Dubai AI Act" with a Mar 2026 effective date — this citation could not be corroborated and may be a misattribution; (2) DIFC Regulation 10 has reportedly been in force since Sept 1, 2023, not "enforced Jan 2026" as the entry implies; 2026 DIFC amendments/AI Adequacy Protocol are still in consultation, not adopted. **Recommend a legal-review pass on this entry's name and dates** — this is a judgment call, not a mechanical fix. | Medium | [CMS Law](https://cms.law/en/are/legal-updates/navigating-ai-in-the-uae-a-financial-services-perspective), [Clyde & Co](https://www.clydeco.com/en/insights/2026/01/regulation-10-of-the-difc-data-protection-law) |
| **PCI_DSS** | Entry name/bullets say "v4.0"; the current published standard is v4.0.1 (Jun 2024), with a v5.0 RFC period that ran through Jul 2026 (not yet finalized). Minor version-string staleness. | Medium | [PCI SSC blog](https://blog.pcisecuritystandards.org/just-published-pci-dss-v4-0-1) |
| **EU_AI_ACT** | Annex III deferral (Dec 2, 2027) and Annex I deferral (Aug 2, 2028) via the Digital Omnibus are confirmed. Low-confidence open question: sources disagree on whether Article 50(2) GPAI watermarking (Aug 2, 2026) was also pushed back — worth confirming against the Official Journal text directly. | Low | [Cooley](https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/), [FPF](https://fpf.org/blog/the-ai-act-implementation-timeline-what-changes-under-the-ai-omnibus) |
| **COE_AI_CONVENTION** | Current ratification count / in-force status could not be confirmed either way via search (entry says "not yet in force, needs 5 ratifications"). Recommend checking the Council of Europe treaty office page directly. | Low | — |

All other entries (HIPAA, COPPA, FTC5, TX_TDPSA, CO_CPA, CO_ADMT, VA_VCDPA,
OTHER_STATES, CT_CTDPA, IL_HB3773, TX_TRAIGA, CA_SB53, STATE_CHATBOT, GDPR,
UK_GDPR, KR_AI_BASIC, JP_AI_ACT, NIST_AI_RMF, ISO_42001, OECD_AI, ISO_23894,
G7_HIROSHIMA, UNESCO_AI, SG_MODEL_AI) showed no search-confirmed material
drift this week.

Neither of the dataset's two `pending`-tier entries (CO_ADMT, NY_RAISE) has
reached its effective date yet — both are gated to Jan 1, 2027 — so no
pending→applies flip is due.

## (c) Candidate new laws / gaps

| Candidate | What | Confidence | Source |
|---|---|---|---|
| **Pennsylvania Act 99 of 2026** (AI Deceptive Advertising Act) | Signed Oct 22, 2026, effective Dec 21, 2026. Requires disclosure when AI-generated/modified ad content creates a "false consumer perception" (knowing/reckless/willful standard; text-only ads exempt). Fits the dataset's transparency/deepfake-disclosure category, parallel to TN_ELVIS. Candidate for its own new `us_state` entry (not a clean fold-in to STATE_CHATBOT, which is scoped to chatbot disclosure specifically). | Medium-high | [Consumer Finance Monitor](https://www.consumerfinancemonitor.com/2026/11/02/pennsylvania-enacts-artificial-intelligence-deceptive-advertising-act-new-disclosure-requirements-for-ai-generated-advertising/) |
| **California SB 1000 / SB 1111** | Amendments (signed ~Sept 30, 2026) to California's AI-transparency regime: SB 1000 reportedly drops the 1M-user threshold for covered GenAI systems; SB 1111 covers digital replicas. Overlaps existing CA_AB2013/STATE_CHATBOT entries — this is a **currency item for those entries**, not a clean new entry. Sources conflicted on exact scope; needs a dedicated read of the enrolled bill text. | Medium | [gov.ca.gov](https://www.gov.ca.gov/2026/09/30/californias-nation-leading-ai-framework-just-got-stronger/) |
| **India — IT (Intermediary Guidelines) Amendment Rules 2026** | Notified Feb 10, 2026, effective Feb 20, 2026. Binding: defines "synthetically generated information" (deepfakes), mandates labeling by platforms/tool providers, shortens unlawful-content takedown to 3 hours. India currently has **no entry at all** in the 37-law dataset despite this binding, in-force AI-labeling regime. Strongest candidate for a genuinely new `intl` entry. | Medium-high | [Hogan Lovells](https://www.hoganlovells.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content) |
| **Utah HB 438** (Companion Chatbot Safety Act) | See UT_UAIPA row above — same item, listed here as a possible new-entry candidate pending enactment confirmation. | Medium (unconfirmed) | Utah legislature tracker |

No credible binding AI law or major voluntary framework was found enacted in
the strict last-2-weeks window (~Nov 9–23, 2026) globally. Brazil's PL
2338/2023 remains stalled in committee (not enacted, out of scope). Australia
was not searched in depth this pass.

## Why no edits were made this week

The task allows two categories of safe mechanical fix: (1) replacing a
source URL that now permanently redirects, and (2) flipping a `pending`
tier_override to `null` once its effective date has passed. Neither applies
this week:

1. **No redirect could be verified** — the sandbox's network policy blocked
   every direct HTTP check (see "Environment limitation" above), so no URL
   change meets the "demonstrably verified" bar for a mechanical edit.
2. **No pending-tier date has passed** — the dataset's only two
   `pending`-tier entries (CO_ADMT, NY_RAISE) are both gated to January 1,
   2027, which has not yet arrived.

Every other finding above involves wording/judgment calls (an inaccurate
regulation-finalization year, a stale implementing-decree characterization,
a possibly-misattributed law name, a version-string update, a brand-new
jurisdiction to add) that the task scope reserves for human legal review
rather than automated editing.

`python3 test_engine.py`: **23 passed, 0 failed** (re-confirmed after this
review; no dataset changes were made).
