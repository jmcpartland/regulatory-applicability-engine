// Regression tests for the applicability engine — ported from test_engine.py.
// Keep this file's 16 assertions in lockstep with the Python original.
import { describe, expect, it } from 'vitest'
import { laws, lawById, questions } from './data'
import { applyDefaults, evaluate, tierFor } from './engine'
import type { Answers } from './types'

function tier(lawId: string, answers: Answers) {
  return tierFor(lawById[lawId], applyDefaults(answers, questions))
}

function surfaced(answers: Answers) {
  return evaluate(laws, answers, questions)
}

function flatten(grouped: ReturnType<typeof surfaced>): Set<string> {
  return new Set(Object.values(grouped).flat())
}

describe('applicability engine regressions', () => {
  it("CO SB26-189 is pending (2027), never 'applies'", () => {
    const a: Answers = {
      geography: ['us_co'],
      ai_use: ['hiring'],
      sector: 'other',
      data_types: ['employee'],
    }
    expect(tier('CO_ADMT', a)).toBe('pending')
  })

  it('Repealed SB24-205 is not present as its own entry', () => {
    expect(lawById['CO_SB205']).toBeUndefined()
    expect(lawById['SB24_205']).toBeUndefined()
  })

  it('TX TDPSA excluded for employee-only processing', () => {
    const a: Answers = {
      geography: ['us_tx'],
      processing_context: 'employees',
      data_types: ['employee'],
      ai_use: ['no_ai'],
      sector: 'other',
    }
    expect(tier('TX_TDPSA', a)).toBe('none')
  })

  it('TX TDPSA flags (verify) for consumer processing', () => {
    const a: Answers = {
      geography: ['us_tx'],
      processing_context: 'consumers',
      data_types: ['consumer_pii'],
      ai_use: ['no_ai'],
      sector: 'other',
    }
    expect(tier('TX_TDPSA', a)).toBe('verify')
  })

  it('EU AI Act applies with AI, absent without', () => {
    const base: Answers = {
      geography: ['eu'],
      sector: 'tech_saas',
      data_types: ['consumer_pii'],
    }
    expect(tier('EU_AI_ACT', { ...base, ai_use: ['profiling'] })).toBe('applies')
    expect(tier('EU_AI_ACT', { ...base, ai_use: ['no_ai'] })).toBe('none')
  })

  it('FTC5 enforcement text reflects AMG Capital limit', () => {
    expect(lawById['FTC5'].enf).toContain('AMG')
  })

  it('NIS2 is verify (member-state transposition), not a flat applies', () => {
    const a: Answers = {
      geography: ['eu'],
      sector: 'finance',
      size: 'mid',
      data_types: ['financial'],
      ai_use: ['no_ai'],
    }
    expect(tier('NIS2', a)).toBe('verify')
  })

  it('UK entry reflects DUAA 2025 (permission-first)', () => {
    expect(lawById['UK_GDPR'].ai.join(' ')).toContain('22A')
  })

  it('Utah is watch-tier and reflects 2025 narrowing', () => {
    expect(lawById['UT_UAIPA'].pri).toBe('watch')
    expect(lawById['UT_UAIPA'].ai[0].toLowerCase()).toContain('narrowed')
  })

  it('ISO 27001 entry is the 2022 edition', () => {
    expect(lawById['ISO_27001'].name).toContain('2022')
  })

  it('Illinois HB3773 applies for IL + AI hiring', () => {
    const a: Answers = {
      geography: ['us_il'],
      ai_use: ['hiring'],
      sector: 'other',
      data_types: ['employee'],
    }
    expect(tier('IL_HB3773', a)).toBe('applies')
  })

  it('Tennessee ELVIS applies for voice/likeness AI', () => {
    const a: Answers = {
      geography: ['us_tn'],
      ai_use: ['voice_likeness'],
      sector: 'media',
      data_types: ['consumer_pii'],
    }
    expect(tier('TN_ELVIS', a)).toBe('applies')
  })

  it('Connecticut CTDPA flags verify (2026 sensitive-data trigger)', () => {
    const a: Answers = {
      geography: ['us_ct'],
      ai_use: ['no_ai'],
      sector: 'other',
      data_types: ['consumer_pii'],
    }
    expect(tier('CT_CTDPA', a)).toBe('verify')
  })

  it('Optional questions skipped -> defaults applied, no verify-flood', () => {
    const a: Answers = {
      sector: 'retail',
      geography: ['us_ca'],
      data_types: ['consumer_pii'],
      ai_use: ['chatbot'],
    }
    const flat = flatten(surfaced(a))
    expect(flat.has('PCI_DSS')).toBe(false)
    expect(flat.has('SEC_CYBER')).toBe(false)
    expect(flat.has('CMMC')).toBe(false)
  })

  it('Baseline laws surface for everyone', () => {
    const a: Answers = {
      sector: 'other',
      geography: ['us_other'],
      data_types: ['none_sensitive'],
      ai_use: ['no_ai'],
    }
    const flat = flatten(surfaced(a))
    expect(flat.has('FTC5')).toBe(true)
    expect(flat.has('CFAA')).toBe(true)
  })

  it('No-AI business: AI frameworks and AI laws drop out', () => {
    const a: Answers = {
      sector: 'other',
      geography: ['us_other'],
      data_types: ['consumer_pii'],
      ai_use: ['no_ai'],
    }
    const flat = flatten(surfaced(a))
    for (const aid of ['NIST_AI_RMF', 'ISO_42001', 'EU_AI_ACT', 'CO_ADMT', 'IL_HB3773']) {
      expect(flat.has(aid)).toBe(false)
    }
  })
})

describe('data integrity', () => {
  it('every law has a source URL', () => {
    for (const law of laws) {
      expect(law.source, `${law.id} is missing a valid source URL`).toMatch(/^https?:\/\//)
    }
  })
})
