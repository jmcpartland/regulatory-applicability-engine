// Regression tests for the AI-only applicability engine — ported from test_engine.py.
// Keep this file's assertions in lockstep with the Python original.
import { describe, expect, it } from 'vitest'
import { laws, lawById, questions } from './data'
import { applyDefaults, evaluate, tierFor } from './engine'
import type { Answers } from './types'

const ALLOWED_CATS = new Set(['us_fed', 'us_state', 'intl', 'fw'])
const ALLOWED_TYPES = new Set(['comprehensive', 'sectoral', 'transparency', 'data_adm', 'framework'])
const PRUNED = [
  'CFAA', 'CIRCIA', 'SEC_CYBER', 'CMMC', 'GLBA', 'FERPA', 'BREACH_NOTIF',
  'NY_DFS', 'NY_SHIELD', 'NIS2', 'NIST_CSF', 'ISO_27001', 'CIS_V8',
  'HITRUST', 'NIST_PRIVACY', 'ISO_27701', 'SOC2',
]

function tier(lawId: string, answers: Answers) {
  return tierFor(lawById[lawId], applyDefaults(answers, questions))
}

function flat(answers: Answers): Set<string> {
  return new Set(Object.values(evaluate(laws, answers, questions)).flat())
}

describe('kept-entry regressions', () => {
  it("CO SB26-189 is pending (2027), never 'applies'", () => {
    expect(tier('CO_ADMT', { geography: ['us_co'], ai_use: ['hiring'], sector: 'other', data_types: ['employee'] })).toBe('pending')
  })

  it('Repealed SB24-205 is not present as its own entry', () => {
    expect(lawById['CO_SB205']).toBeUndefined()
    expect(lawById['SB24_205']).toBeUndefined()
  })

  it('TX TDPSA excluded for employee-only processing', () => {
    expect(
      tier('TX_TDPSA', { geography: ['us_tx'], processing_context: 'employees', data_types: ['employee'], ai_use: ['no_ai'], sector: 'other' }),
    ).toBe('none')
  })

  it('TX TDPSA flags (verify) for consumer processing', () => {
    expect(
      tier('TX_TDPSA', { geography: ['us_tx'], processing_context: 'consumers', data_types: ['consumer_pii'], ai_use: ['no_ai'], sector: 'other' }),
    ).toBe('verify')
  })

  it('EU AI Act applies with AI, absent without', () => {
    const base: Answers = { geography: ['eu'], sector: 'tech_saas', data_types: ['consumer_pii'] }
    expect(tier('EU_AI_ACT', { ...base, ai_use: ['profiling'] })).toBe('applies')
    expect(tier('EU_AI_ACT', { ...base, ai_use: ['no_ai'] })).toBe('none')
  })

  it('FTC5 enforcement text reflects AMG Capital limit', () => {
    expect(lawById['FTC5'].enf).toContain('AMG')
  })

  it('FTC5 is a baseline law surfaced for every business', () => {
    expect(tier('FTC5', { sector: 'other', geography: ['us_other'], data_types: ['none_sensitive'], ai_use: ['chatbot'] })).toBe('baseline')
  })

  it('UK entry reflects DUAA 2025 (permission-first)', () => {
    expect(lawById['UK_GDPR'].ai.join(' ')).toContain('22A')
  })

  it('Utah is watch-tier and reflects 2025 narrowing', () => {
    expect(lawById['UT_UAIPA'].pri).toBe('watch')
    expect(lawById['UT_UAIPA'].ai[0].toLowerCase()).toContain('narrowed')
  })

  it('Illinois HB3773 applies for IL + AI hiring', () => {
    expect(tier('IL_HB3773', { geography: ['us_il'], ai_use: ['hiring'], sector: 'other', data_types: ['employee'] })).toBe('applies')
  })

  it('Tennessee ELVIS applies for voice/likeness AI', () => {
    expect(tier('TN_ELVIS', { geography: ['us_tn'], ai_use: ['voice_likeness'], sector: 'media', data_types: ['consumer_pii'] })).toBe('applies')
  })

  it('Connecticut CTDPA flags verify (2026 sensitive-data trigger)', () => {
    expect(tier('CT_CTDPA', { geography: ['us_ct'], ai_use: ['no_ai'], sector: 'other', data_types: ['consumer_pii'] })).toBe('verify')
  })

  it('TN ELVIS is geography-gated — does not fire for a non-Tennessee business', () => {
    expect(tier('TN_ELVIS', { geography: ['south_korea', 'eu'], ai_use: ['gen_content'], sector: 'media', data_types: ['consumer_pii'] })).toBe('none')
  })
})

describe('AI-only scope', () => {
  it('non-AI cyber/privacy entries were pruned from the dataset', () => {
    for (const pid of PRUNED) {
      expect(lawById[pid], `${pid} should have been pruned`).toBeUndefined()
    }
  })
})

describe('new worldwide AI entries', () => {
  it('Texas TRAIGA applies for TX + any AI use', () => {
    expect(tier('TX_TRAIGA', { geography: ['us_tx'], ai_use: ['chatbot'], sector: 'other', data_types: ['consumer_pii'] })).toBe('applies')
  })

  it('South Korea AI Basic Act flags verify for KR + AI', () => {
    expect(tier('KR_AI_BASIC', { geography: ['south_korea'], ai_use: ['gen_content'], sector: 'tech_saas', data_types: ['consumer_pii'] })).toBe('verify')
  })

  it('China AI rules flag verify for China + AI, absent without AI', () => {
    const base: Answers = { geography: ['china'], sector: 'tech_saas', data_types: ['consumer_pii'] }
    expect(tier('CN_AI', { ...base, ai_use: ['gen_content'] })).toBe('verify')
    expect(tier('CN_AI', { ...base, ai_use: ['no_ai'] })).toBe('none')
  })

  it('California SB 53 is frontier-only: watch with model training, else none', () => {
    const base: Answers = { geography: ['us_ca'], sector: 'tech_saas', data_types: ['consumer_pii'] }
    expect(tier('CA_SB53', { ...base, ai_use: ['llm_training'] })).toBe('watch')
    expect(tier('CA_SB53', { ...base, ai_use: ['chatbot'] })).toBe('none')
  })

  it('OECD AI Principles are a recommended framework for AI users', () => {
    expect(tier('OECD_AI', { geography: ['us_other'], ai_use: ['chatbot'], sector: 'other', data_types: ['consumer_pii'] })).toBe('recommend')
  })
})

describe('mandatory / default logic', () => {
  it('PCI DSS stays out when payment default (no) applies', () => {
    expect(flat({ sector: 'retail', geography: ['us_ca'], data_types: ['consumer_pii'], ai_use: ['chatbot'] }).has('PCI_DSS')).toBe(false)
  })

  it('No-AI business: AI laws and frameworks drop out', () => {
    const f = flat({ sector: 'other', geography: ['us_other', 'us_tx', 'eu', 'china'], data_types: ['consumer_pii'], ai_use: ['no_ai'] })
    for (const aid of ['NIST_AI_RMF', 'ISO_42001', 'OECD_AI', 'SG_MODEL_AI', 'EU_AI_ACT', 'TX_TRAIGA', 'CN_AI', 'CO_ADMT']) {
      expect(f.has(aid), `${aid} should not surface for a no-AI business`).toBe(false)
    }
  })
})

describe('data integrity', () => {
  it('every law has a source URL', () => {
    for (const law of laws) {
      expect(law.source, `${law.id} is missing a source URL`).toMatch(/^https?:\/\//)
    }
  })

  it('every law uses a valid category and type', () => {
    for (const law of laws) {
      expect(ALLOWED_CATS.has(law.cat), `${law.id} has bad cat ${law.cat}`).toBe(true)
      expect(ALLOWED_TYPES.has(law.type), `${law.id} has bad type ${law.type}`).toBe(true)
    }
  })
})
