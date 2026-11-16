# Weekly AI Dataset Re-verification — 2026-11-16

Scope: `data/laws.json` (37 entries). No legal-content edits applied to the dataset this
run — every finding below needs human judgment, so all of it is a recommendation, not
a change. See **Blocker** for why the dead-link check didn't run.

## Sanity check

`python3 test_engine.py` → **23 passed, 0 failed.** Dataset is well-formed.

## Blocker: dead-link check did not run (confidence: n/a — environment limitation)

Step 2 of this routine (`curl` HTTP-status check on all 37 `source` URLs) could not execute.
This session's cloud environment ("Default") has network access set to **limited, with no
allowed hosts** — every outbound request to a government/legislature/standards-body domain
fails before it leaves the container. `WebSearch` still works (it doesn't go through the
container's network), which is how the currency and gap checks below were done, but direct
URL fetches (`curl`, `WebFetch`) do not.

I tried to request the 34 hostnames this dataset currently cites be added to the environment's
allowlist, but the approval card requires a live user and this is an unattended scheduled run —
the request was automatically refused with no change made.

**Action needed from a person:** either approve a network-allowlist change (re-run this task
with "Run now" and approve when prompted), or widen the "Default" environment's network access
in session settings, so next week's run can complete the actual dead-link check. Until then,
treat all `source` URLs as unverified for reachability (content/currency was still checked via
search where possible — see below).

## Currency check — entries that look stale or need added nuance

| ID | Finding | Confidence |
|---|---|---|
| **NY_RAISE** | `source` still points to the original S6953 bill page. The bill was signed Dec 19, 2025 as S6953B/A6453B, then reportedly amended again by a chapter amendment Gov. Hochul signed ~Mar 27, 2026 (companion bills, possibly A9449/S8828). Could not confirm the final chapter-law number — the dataset's own `source` field should be updated once it is. Jan 1, 2027 effective date is not contradicted. | low |
| **UT_UAIPA** | A further 2026-session bill, **HB 320 (Office of AI Policy Amendments)**, was signed Mar 18, 2026, effective ~May 6, 2026. Not reflected in the dataset (currently cites only 2025 SB 226/SB 332). Scope of HB 320 is unclear from available sources — may be mostly governance-office structure rather than consumer-disclosure substance. Needs a read of the actual text before deciding if `ai`/`tier_reason` need a change. | low |
| **IL_HB3773** | `ai` bullet says IDHR "draft rules issued Dec 2025." IDHR actually published formal proposed rules **May 15, 2026**, then **withdrew/postponed them Jun 2, 2026** with no new timeline announced. The dataset's rule-status line is now outdated. | medium |
| **STATE_CHATBOT** | This cluster has grown well past CA/UT. Recommend adding: **Washington HB 2225** (signed Mar 24, 2026, eff. Jan 1, 2027, private right of action), **Oregon SB 1546**, **Connecticut PA 26-15** (eff. Oct 1, 2026), **Nebraska LB 525** (eff. Jul 1, 2027), plus reported enactments in Georgia/Iowa/Rhode Island/Idaho (unverified in detail). Also: California's chatbot-disclosure law is specifically **SB 243** (eff. Jan 1, 2026) — distinct from AB 2013, which the dataset currently cites under a different entry — worth naming explicitly instead of just "California." | medium |
| **CO_ADMT** | Add nuance, no tier change: AG released revised draft rules Oct 6, 2026 (hearing Oct 26, 2026, outcome unconfirmed); AG Weiser has signaled non-enforcement pending rulemaking, and a pending federal suit (xAI injunction motion) has reportedly stayed enforcement in the interim. Jan 1, 2027 effective date still holds. | medium |
| **TX_TRAIGA** | Add nuance, no tier change: confirmed effective Jan 1, 2026 as scheduled. Not yet in the dataset: a mandatory 60-day AG notice-and-cure period before suit, and the AG must stand up a public complaint portal by Sep 1, 2026. No enforcement actions found yet. | medium |
| **CT_CTDPA** | Add nuance: core July 1, 2026 amendments (35K threshold, LLM-training disclosure, no-threshold sensitive-data/sale triggers) confirmed in effect. Additionally: some provisions reportedly phase in **Oct 1, 2026** via a further amendment (SB 4 as amended by HB 5222); profiling-impact-assessment duties apply only to processing created/generated on/after **Aug 1, 2026**; data-broker obligations phase in 2027–2031. None of this contradicts the current `verify` tier. | medium |
| **VN_AI_LAW** | `tier_reason` says "implementing decrees are still developing." They're not anymore — a batch of implementing decrees (risk classification, design, data protection, cybersecurity, user rights, business registration, sandbox) were adopted and took effect **May 1, 2026**. Wording should move from "still developing" to "decrees now in effect — see [specific decree] for your risk tier's obligations." | medium |
| **TW_AI_BASIC** | `act` field says to "watch MODA's risk-classification framework" as not-yet-issued. MODA published **v1.0 of the AI Risk Classification Framework on July 7, 2026**. The Basic Act itself still imposes no direct private-sector obligations, so `watch` tier is probably still right, but the framework being "not yet issued" is now false. | medium-high |
| **UAE_AI** | Could not independently confirm a standalone "Dubai AI Act" distinct from DIFC Regulation 10 — searches only surfaced DIFC Reg 10 (personal-data processing by autonomous/semi-autonomous systems, compliance-mandatory since Jan 1, 2026, matching the dataset). The "Dubai AI Act effective Mar 2026" claim may be a naming or sourcing issue worth a manual check directly against digitaldubai.ae once the dead-link check can run. | low |
| **COE_AI_CONVENTION** | Could not verify current ratification count or confirm/deny entry-into-force beyond the EU's own ratification. The dataset's "not yet in force" claim was not disproven, but also not freshly confirmed — recommend checking treaty.coe.int directly next time URL fetches work. | low |
| **EU_AI_ACT** | Core claims confirmed accurate (Digital Omnibus deferrals to Dec 2, 2027 / Aug 2, 2028 exactly as stated; Article 50 transparency did take effect Aug 2, 2026 as scheduled, not deferred). Missing from the `ai` bullets: the Omnibus also added a prohibition on AI-generated non-consensual intimate imagery/CSAM, with a transitional grace period to Dec 2, 2026 — worth adding as a bullet. | medium-high |
| **PIPEDA** | Bill C-27/AIDA is confirmed dead (died on the Order Paper at prorogation, Jan 6, 2025) — the dataset's "proposed / pending" framing should be updated to reflect that it's dead, not just pending. A new successor bill, **Bill C-36** (Protecting Privacy and Consumer Data Act, tabled Jun 15, 2026), would replace PIPEDA with new automated-decision-making rules; worth tracking but not yet enacted. | low-medium |

**Confirmed accurate, no action:** CA_SB53, CA_AB2013 (took effect Jan 1, 2026 as scheduled; no
amendments found — note the AB 853/Aug 2026 delay reported elsewhere applies to a *different*
law, CA's SB 942 AI Transparency Act, not AB 2013), TN_ELVIS, KR_AI_BASIC, JP_AI_ACT, CN_AI (core
framing — see gap check for one new rule in this cluster), UK_GDPR (DUAA Articles 22A–22D
confirmed commenced Feb 5, 2026 via SI 2026/82).

## Gap check — candidate new entries

| Candidate | Jurisdiction | What it does | Status | Fit | Source | Confidence |
|---|---|---|---|---|---|---|
| **Illinois AI Safety Measures Act** (SB 315 / Public Act 104-0538) | US / Illinois | Third state (after CA SB 53, NY RAISE) to regulate frontier AI — requires independent third-party annual safety audits of large frontier developers (models >10^26 ops, developer+affiliates >$500M revenue). Distinct from the already-dataset'd IL_HB3773 (AI-in-employment). | Signed Jul 6, 2026; general provisions eff. Jan 1, 2027; audit duty starts Jan 1, 2028. | AI-native comprehensive law, parallel to CA_SB53/NY_RAISE | https://www.skadden.com/insights/publications/2026/07/illinois-enacts-ai-safety-law-becoming-first-state | **high** |
| China **Anthropomorphic AI Measures** | China | New binding CAC rule specifically for human-like/companion AI — would join the existing CN_AI cluster rather than stand alone. | Released Apr 10, 2026; effective Jul 15, 2026. | Binding CAC AI rule, same category as CN_AI's existing components | china-briefing.com, bakerbotts.com coverage | medium |
| Canada **Bill C-36** (Protecting Privacy and Consumer Data Act) | Canada | Would replace PIPEDA with new automated-decision-making rules. | Tabled Jun 15, 2026 — **not yet enacted.** | Not a gap yet — flagging for next cycle's watch list, not a new entry today | canadianlawyermag.com | low-medium |

No other new binding AI law or major voluntary framework was found enacted in roughly the last
2–4 weeks (since ~late October 2026) that fits the AI-only scope. Checked and still correctly
excluded (still TODO-list / not yet enacted): US federal AI preemption push (EO 14365 pressure,
no new statute), Brazil PL 2338 (still pending in the Chamber of Deputies), Australia mandatory
guardrails (announced Nov 10, 2026, legislation not yet introduced), UK, Turkey, Switzerland,
India draft/strategy items. Two low-confidence, likely-too-thin-to-add items worth a look next
cycle: an OECD AI value-chain due-diligence guidance (~Sep 2026) and a multi-government AI
safety/security declaration signed Nov 9, 2026.

## Mechanical fixes applied this PR

**None.** No `source` URL could be confirmed as a stable 301 redirect (the dead-link check
didn't run — see Blocker), and no entry's `tier_override: "pending"` has an effective date that
has demonstrably passed as of 2026-11-16 (the earliest pending dates, CO_ADMT and NY_RAISE, are
both Jan 1, 2027 — still in the future). Every finding above needs wording/legal judgment, so
all of it stays a recommendation for a human pass, per this routine's safety rule.
