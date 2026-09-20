#!/usr/bin/env python3
"""Regression tests for the AI-only applicability engine. Run: python3 test_engine.py"""
import sys
import eval as E

laws, questions = E.load()
by_id = {l["id"]: l for l in laws}

ALLOWED_CATS = {"us_fed", "us_state", "intl", "fw"}
ALLOWED_TYPES = {"comprehensive", "sectoral", "transparency", "data_adm", "framework"}
PRUNED = {"CFAA", "CIRCIA", "SEC_CYBER", "CMMC", "GLBA", "FERPA", "BREACH_NOTIF",
          "NY_DFS", "NY_SHIELD", "NIS2", "NIST_CSF", "ISO_27001", "CIS_V8",
          "HITRUST", "NIST_PRIVACY", "ISO_27701", "SOC2"}


def tier(law_id, answers):
    return E.tier_for(by_id[law_id], E.apply_defaults(answers, questions))


def surfaced(answers):
    return E.evaluate(laws, answers, questions)


def flat(answers):
    return {i for ids in surfaced(answers).values() for i in ids}


TESTS = []


def test(name):
    def deco(fn):
        TESTS.append((name, fn))
        return fn
    return deco


# ─── Kept-entry regressions ─────────────────────────────────────────────────
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
    base = {"geography": ["eu"], "sector": "tech_saas", "data_types": ["consumer_pii"]}
    assert tier("EU_AI_ACT", {**base, "ai_use": ["profiling"]}) == "applies"
    assert tier("EU_AI_ACT", {**base, "ai_use": ["no_ai"]}) == "none"

@test("FTC5 enforcement text reflects AMG Capital limit")
def _():
    assert "AMG" in by_id["FTC5"]["enf"]

@test("FTC5 is a baseline law surfaced for every business")
def _():
    a = {"sector": "other", "geography": ["us_other"],
         "data_types": ["none_sensitive"], "ai_use": ["chatbot"]}
    assert tier("FTC5", a) == "baseline"

@test("UK entry reflects DUAA 2025 (permission-first)")
def _():
    assert "22A" in " ".join(by_id["UK_GDPR"]["ai"])

@test("Utah is watch-tier and reflects 2025 narrowing")
def _():
    assert by_id["UT_UAIPA"]["pri"] == "watch"
    assert "narrowed" in by_id["UT_UAIPA"]["ai"][0].lower()

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

@test("TN ELVIS is geography-gated — does not fire for a non-Tennessee business")
def _():
    a = {"geography": ["south_korea", "eu"], "ai_use": ["gen_content"],
         "sector": "media", "data_types": ["consumer_pii"]}
    assert tier("TN_ELVIS", a) == "none"


# ─── AI-only scope: pruned non-AI entries are gone ──────────────────────────
@test("Non-AI cyber/privacy entries were pruned from the dataset")
def _():
    for pid in PRUNED:
        assert pid not in by_id, f"{pid} should have been pruned in the AI-only rebuild"


# ─── New worldwide AI entries ───────────────────────────────────────────────
@test("Texas TRAIGA applies for TX + any AI use")
def _():
    a = {"geography": ["us_tx"], "ai_use": ["chatbot"], "sector": "other",
         "data_types": ["consumer_pii"]}
    assert tier("TX_TRAIGA", a) == "applies"

@test("South Korea AI Basic Act flags verify for KR + AI")
def _():
    a = {"geography": ["south_korea"], "ai_use": ["gen_content"], "sector": "tech_saas",
         "data_types": ["consumer_pii"]}
    assert tier("KR_AI_BASIC", a) == "verify"

@test("China AI rules flag verify for China + AI, absent without AI")
def _():
    base = {"geography": ["china"], "sector": "tech_saas", "data_types": ["consumer_pii"]}
    assert tier("CN_AI", {**base, "ai_use": ["gen_content"]}) == "verify"
    assert tier("CN_AI", {**base, "ai_use": ["no_ai"]}) == "none"

@test("California SB 53 is frontier-only: watch with model training, else none")
def _():
    base = {"geography": ["us_ca"], "sector": "tech_saas", "data_types": ["consumer_pii"]}
    assert tier("CA_SB53", {**base, "ai_use": ["llm_training"]}) == "watch"
    assert tier("CA_SB53", {**base, "ai_use": ["chatbot"]}) == "none"

@test("OECD AI Principles are a recommended framework for AI users")
def _():
    a = {"geography": ["us_other"], "ai_use": ["chatbot"], "sector": "other",
         "data_types": ["consumer_pii"]}
    assert tier("OECD_AI", a) == "recommend"


# ─── Mandatory / default logic ──────────────────────────────────────────────
@test("PCI DSS stays out when payment default (no) applies")
def _():
    a = {"sector": "retail", "geography": ["us_ca"],
         "data_types": ["consumer_pii"], "ai_use": ["chatbot"]}
    assert "PCI_DSS" not in flat(a)

@test("No-AI business: AI laws and frameworks drop out")
def _():
    a = {"sector": "other", "geography": ["us_other", "us_tx", "eu", "china"],
         "data_types": ["consumer_pii"], "ai_use": ["no_ai"]}
    f = flat(a)
    for aid in ("NIST_AI_RMF", "ISO_42001", "OECD_AI", "SG_MODEL_AI", "EU_AI_ACT",
                "TX_TRAIGA", "CN_AI", "CO_ADMT"):
        assert aid not in f, f"{aid} should not surface for a no-AI business"


# ─── Data integrity ─────────────────────────────────────────────────────────
@test("Every law has a source URL")
def _():
    for l in laws:
        assert l.get("source", "").startswith("http"), f"{l['id']} is missing a source URL"

@test("Every law uses a valid category and type")
def _():
    for l in laws:
        assert l["cat"] in ALLOWED_CATS, f"{l['id']} has bad cat {l['cat']}"
        assert l["type"] in ALLOWED_TYPES, f"{l['id']} has bad type {l['type']}"


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
