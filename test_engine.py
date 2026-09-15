#!/usr/bin/env python3
"""Regression tests for the applicability engine. Run: python3 test_engine.py"""
import sys
import eval as E

laws, questions = E.load()
by_id = {l["id"]: l for l in laws}


def tier(law_id, answers):
    return E.tier_for(by_id[law_id], E.apply_defaults(answers, questions))


def surfaced(answers):
    return E.evaluate(laws, answers, questions)


TESTS = []


def test(name):
    def deco(fn):
        TESTS.append((name, fn))
        return fn
    return deco


# ─── Correction regressions ─────────────────────────────────────────────────
@test("CO SB26-189 is pending (2027), never 'applies'")
def _():
    a = {"geography": ["us_co"], "ai_use": ["hiring"], "sector": "other",
         "data_types": ["employee"]}
    assert tier("CO_ADMT", a) == "pending"

@test("Repealed SB24-205 is not present as its own entry")
def _():
    assert "CO_SB205" not in by_id and "SB24_205" not in by_id

@test("TX TDPSA excluded for employee-only processing")
def _():
    a = {"geography": ["us_tx"], "processing_context": "employees",
         "data_types": ["employee"], "ai_use": ["no_ai"], "sector": "other"}
    assert tier("TX_TDPSA", a) == "none"

@test("TX TDPSA flags (verify) for consumer processing")
def _():
    a = {"geography": ["us_tx"], "processing_context": "consumers",
         "data_types": ["consumer_pii"], "ai_use": ["no_ai"], "sector": "other"}
    assert tier("TX_TDPSA", a) == "verify"

@test("EU AI Act applies with AI, absent without")
def _():
    base = {"geography": ["eu"], "sector": "tech_saas",
            "data_types": ["consumer_pii"]}
    assert tier("EU_AI_ACT", {**base, "ai_use": ["profiling"]}) == "applies"
    assert tier("EU_AI_ACT", {**base, "ai_use": ["no_ai"]}) == "none"

@test("FTC5 enforcement text reflects AMG Capital limit")
def _():
    assert "AMG" in by_id["FTC5"]["enf"]

@test("NIS2 is verify (member-state transposition), not a flat applies")
def _():
    a = {"geography": ["eu"], "sector": "finance", "size": "mid",
         "data_types": ["financial"], "ai_use": ["no_ai"]}
    assert tier("NIS2", a) == "verify"

@test("UK entry reflects DUAA 2025 (permission-first)")
def _():
    assert "22A" in " ".join(by_id["UK_GDPR"]["ai"])

@test("Utah is watch-tier and reflects 2025 narrowing")
def _():
    assert by_id["UT_UAIPA"]["pri"] == "watch"
    assert "narrowed" in by_id["UT_UAIPA"]["ai"][0].lower()

@test("ISO 27001 entry is the 2022 edition")
def _():
    assert "2022" in by_id["ISO_27001"]["name"]

# ─── New-entry regressions ──────────────────────────────────────────────────
@test("Illinois HB3773 applies for IL + AI hiring")
def _():
    a = {"geography": ["us_il"], "ai_use": ["hiring"], "sector": "other",
         "data_types": ["employee"]}
    assert tier("IL_HB3773", a) == "applies"

@test("Tennessee ELVIS applies for voice/likeness AI")
def _():
    a = {"geography": ["us_tn"], "ai_use": ["voice_likeness"], "sector": "media",
         "data_types": ["consumer_pii"]}
    assert tier("TN_ELVIS", a) == "applies"

@test("Connecticut CTDPA flags verify (2026 sensitive-data trigger)")
def _():
    a = {"geography": ["us_ct"], "ai_use": ["no_ai"], "sector": "other",
         "data_types": ["consumer_pii"]}
    assert tier("CT_CTDPA", a) == "verify"

# ─── Mandatory / default logic ──────────────────────────────────────────────
@test("Optional questions skipped -> defaults applied, no verify-flood")
def _():
    a = {"sector": "retail", "geography": ["us_ca"],
         "data_types": ["consumer_pii"], "ai_use": ["chatbot"]}
    g = surfaced(a)
    # PCI/SEC/CMMC must NOT appear (optional defaults keep them out)
    flat = {i for ids in g.values() for i in ids}
    assert "PCI_DSS" not in flat, "PCI should be absent with payment_cards default=no"
    assert "SEC_CYBER" not in flat, "SEC absent with public_company default=neither"
    assert "CMMC" not in flat, "CMMC absent with public_company default=neither"

@test("Baseline laws surface for everyone")
def _():
    a = {"sector": "other", "geography": ["us_other"],
         "data_types": ["none_sensitive"], "ai_use": ["no_ai"]}
    flat = {i for ids in surfaced(a).values() for i in ids}
    assert "FTC5" in flat and "CFAA" in flat

@test("No-AI business: AI frameworks and AI laws drop out")
def _():
    a = {"sector": "other", "geography": ["us_other"],
         "data_types": ["consumer_pii"], "ai_use": ["no_ai"]}
    flat = {i for ids in surfaced(a).values() for i in ids}
    for aid in ("NIST_AI_RMF", "ISO_42001", "EU_AI_ACT", "CO_ADMT", "IL_HB3773"):
        assert aid not in flat, f"{aid} should not surface for a no-AI business"

# ─── Data integrity ─────────────────────────────────────────────────────────
@test("Every law has a source URL")
def _():
    for l in laws:
        assert l.get("source", "").startswith("http"), f"{l['id']} is missing a valid source URL"


def main():
    passed = failed = 0
    for name, fn in TESTS:
        try:
            fn()
            print(f"PASS  {name}")
            passed += 1
        except AssertionError as e:
            print(f"FAIL  {name}  -> {e}")
            failed += 1
        except Exception as e:
            print(f"ERROR {name}  -> {type(e).__name__}: {e}")
            failed += 1
    print(f"\n{passed} passed, {failed} failed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
