#!/usr/bin/env python3
"""
Applicability engine evaluator.

Resolves each law's trigger against a user's answers using tri-state logic
(True / False / None-for-unknown) and assigns a tier. Mirrors the logic that
will run client-side in the React app, so behavior here is the contract.

Usage:
    python3 eval.py                 # run built-in personas
    python3 eval.py --list          # list laws and default tiers
"""
import json
import sys
from pathlib import Path

DATA = Path(__file__).parent / "data"

# Tier precedence when a law could land in more than one (higher = surfaced first)
TIER_RANK = {
    "baseline": 6,
    "applies": 5,
    "pending": 4,
    "verify": 3,
    "recommend": 2,
    "watch": 1,
    "none": 0,
}


def load():
    with open(DATA / "laws.json") as f:
        laws = json.load(f)["laws"]
    with open(DATA / "questions.json") as f:
        questions = json.load(f)["questions"]
    return laws, questions


def apply_defaults(answers, questions):
    """
    Fill in defaults for unanswered OPTIONAL questions. Mandatory questions are
    gated by the UI (form cannot submit without them), so if one is missing here
    it stays unknown and its dependent laws fall to 'verify' — a signal that the
    input was incomplete. Returns a new dict; does not mutate the input.
    """
    filled = dict(answers)
    for q in questions:
        if q["id"] in filled and filled[q["id"]] is not None:
            continue
        if not q.get("mandatory", False) and "default" in q:
            filled[q["id"]] = q["default"]
    return filled


def answer_set(answers, qid):
    """Return the user's answer(s) for a question as a set, or None if unanswered."""
    if qid not in answers:
        return None
    val = answers[qid]
    if val is None:
        return None
    if isinstance(val, list):
        return set(val)
    return {val}


def resolve(node, answers):
    """
    Tri-state resolve of a trigger node.
    Returns True (matches), False (explicitly does not match), or None (unknown).
    """
    if node.get("always"):
        return True

    if "q" in node:
        got = answer_set(answers, node["q"])
        if got is None:
            return None  # question unanswered -> unknown
        return len(got & set(node.get("in", []))) > 0

    if "any" in node:
        results = [resolve(c, answers) for c in node["any"]]
        if any(r is True for r in results):
            return True
        if any(r is None for r in results):
            return None
        return False

    if "all" in node:
        results = [resolve(c, answers) for c in node["all"]]
        if any(r is False for r in results):
            return False
        if any(r is None for r in results):
            return None
        return True

    if "not" in node:
        inner = resolve(node["not"], answers)
        if inner is None:
            return None
        return not inner

    return None


def tier_for(law, answers):
    """Assign a tier to a law given the user's answers."""
    match = resolve(law["trigger"], answers)

    # Baseline laws (always-true trigger) — but a voluntary framework marked
    # recommend stays recommend even though its trigger is always-true.
    if law["trigger"].get("always") and match is True:
        override = law.get("tier_override")
        if override in ("recommend",):
            return "recommend"
        return "baseline"

    if match is False:
        return "none"

    if match is None:
        # Trigger depends on an unanswered question — treat as verify (flag it),
        # but only if at least one branch could plausibly fire. We surface these
        # so the advisor reviews rather than silently dropping them.
        return "verify"

    # match is True — apply any tier override
    override = law.get("tier_override")
    if override:
        return override

    # per-answer override map (e.g. PCI reduced scope via third-party processor)
    omap = law.get("tier_override_map")
    if omap:
        for qid_answers in answers.values():
            vals = qid_answers if isinstance(qid_answers, list) else [qid_answers]
            for v in vals:
                if v in omap:
                    return omap[v]

    return "applies"


def evaluate(laws, answers, questions=None):
    """Return laws grouped by tier. Applies optional-question defaults first."""
    if questions is not None:
        answers = apply_defaults(answers, questions)
    grouped = {}
    for law in laws:
        t = tier_for(law, answers)
        if t == "none":
            continue
        grouped.setdefault(t, []).append(law["id"])
    return grouped


# ─── Test personas ──────────────────────────────────────────────────────────
PERSONAS = {
    "Carlsbad dental practice (healthcare, CA, small)": {
        "sector": "healthcare",
        "geography": ["us_ca"],
        "data_types": ["health_phi", "consumer_pii"],
        "ai_use": ["chatbot", "internal_only"],
        "processing_context": "consumers",
        "size": "micro",
        "public_company": "neither",
        "payment_cards": "yes_direct",
    },
    "SaaS startup, EU+US customers, uses AI hiring": {
        "sector": "tech_saas",
        "geography": ["us_ca", "eu", "us_other"],
        "data_types": ["consumer_pii", "employee"],
        "ai_use": ["hiring", "profiling", "gen_content"],
        "processing_context": "mixed",
        "size": "small",
        "public_company": "neither",
        "payment_cards": "yes_processor",
    },
    "Texas marketing agency, no sensitive data, no AI": {
        "sector": "other",
        "geography": ["us_tx"],
        "data_types": ["consumer_pii"],
        "ai_use": ["no_ai"],
        "processing_context": "consumers",
        "size": "micro",
        "public_company": "neither",
        "payment_cards": "no",
    },
    "DoD subcontractor, public company, Colorado AI hiring": {
        "sector": "govcon",
        "geography": ["us_co"],
        "data_types": ["gov_id", "employee"],
        "ai_use": ["hiring", "consequential"],
        "processing_context": "employees",
        "size": "mid",
        "public_company": "both",
        "payment_cards": "no",
    },
    "Nashville music/media startup cloning voices, TN+CA": {
        "sector": "media",
        "geography": ["us_tn", "us_ca"],
        "data_types": ["consumer_pii", "biometric"],
        "ai_use": ["voice_likeness", "gen_content"],
        "processing_context": "consumers",
        "size": "micro",
        "public_company": "neither",
        "payment_cards": "yes_processor",
    },
    "Illinois manufacturer, HR-only data, AI in hiring": {
        "sector": "other",
        "geography": ["us_il"],
        "data_types": ["employee"],
        "ai_use": ["hiring"],
        "processing_context": "employees",
        "size": "small",
        "public_company": "neither",
        "payment_cards": "no",
    },
    "Mandatory-only (optional questions skipped — UI-realistic)": {
        # All 4 mandatory questions answered; the 4 optional ones left blank.
        # Optional defaults (consumers / micro / neither / no) fill in.
        "sector": "retail",
        "geography": ["us_ca", "us_other"],
        "data_types": ["consumer_pii"],
        "ai_use": ["chatbot"],
    },
}


def main():
    laws, questions = load()
    law_by_id = {l["id"]: l for l in laws}

    if "--list" in sys.argv:
        for l in laws:
            ov = l.get("tier_override", "")
            print(f"  {l['id']:14} {l['cat']:8} {l['type']:8} override={ov}")
        return

    order = ["baseline", "applies", "pending", "verify", "recommend", "watch"]
    labels = {
        "baseline": "BASELINE (everyone)",
        "applies": "APPLIES NOW",
        "pending": "IN SCOPE — NOT YET EFFECTIVE",
        "verify": "PROBABLE — VERIFY",
        "recommend": "RECOMMENDED FRAMEWORK",
        "watch": "WATCH",
    }

    for name, answers in PERSONAS.items():
        print("\n" + "=" * 74)
        print(name)
        print("=" * 74)
        grouped = evaluate(laws, answers, questions)
        total = sum(len(v) for v in grouped.values())
        print(f"{total} entries surfaced\n")
        for tier in order:
            ids = grouped.get(tier, [])
            if not ids:
                continue
            print(f"  [{labels[tier]}]")
            for i in ids:
                print(f"      {i:14} {law_by_id[i]['name']}")
            print()


if __name__ == "__main__":
    main()
