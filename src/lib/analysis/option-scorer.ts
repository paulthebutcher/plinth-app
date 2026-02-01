import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { Option } from '@/lib/analysis/option-composer'
import type { EvidenceMapping } from '@/lib/analysis/evidence-mapper'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'

export interface OptionScore {
  optionId: string
  factors: {
    evidenceStrength: number
    evidenceRecency: number
    sourceReliability: number
    corroboration: number
    constraintFit: number
    assumptionRisk: number
  }
  totalScore: number
  scoreRationale: string
}

const factorSchema = z.object({
  evidenceStrength: z.number().min(0).max(100),
  evidenceRecency: z.number().min(0).max(100),
  sourceReliability: z.number().min(0).max(100),
  corroboration: z.number().min(0).max(100),
  constraintFit: z.number().min(0).max(100),
  assumptionRisk: z.number().min(0).max(100),
  scoreRationale: z.string().min(1),
})

const weights = {
  evidenceStrength: 0.25,
  evidenceRecency: 0.15,
  sourceReliability: 0.15,
  corroboration: 0.15,
  constraintFit: 0.15,
  assumptionRisk: 0.15,
} as const

const buildPrompt = (option: Option, evidence: EvidenceCard[], mappings: EvidenceMapping[]) => {
  const mappingLines = mappings.map((mapping) => {
    const card = evidence.find((item) => item.id === mapping.evidenceId)
    return [
      `- [${mapping.evidenceId}] ${card?.claim ?? 'Unknown claim'}`,
      `  Relationship: ${mapping.relationship}`,
      `  Impact: ${mapping.impactLevel}`,
    ].join('\n')
  })

  return [
    'You are scoring a strategic option using transparent factors.',
    `Option: ${option.title}`,
    `Summary: ${option.summary}`,
    '',
    'Evidence mappings:',
    ...mappingLines,
    '',
    'Score each factor from 0-100 and explain each in plain language.',
    'Provide scores for:',
    '- evidenceStrength (25%)',
    '- evidenceRecency (15%)',
    '- sourceReliability (15%)',
    '- corroboration (15%)',
    '- constraintFit (15%)',
    '- assumptionRisk (15%)',
    '',
    'Return JSON with factor scores and scoreRationale describing each factor.',
  ].join('\n')
}

const computeTotal = (factors: OptionScore['factors']) =>
  Math.round(
    factors.evidenceStrength * weights.evidenceStrength +
      factors.evidenceRecency * weights.evidenceRecency +
      factors.sourceReliability * weights.sourceReliability +
      factors.corroboration * weights.corroboration +
      factors.constraintFit * weights.constraintFit +
      factors.assumptionRisk * weights.assumptionRisk
  )

export async function scoreOptions(
  options: Option[],
  mappings: EvidenceMapping[],
  evidence: EvidenceCard[]
): Promise<OptionScore[]> {
  const scores = await Promise.all(
    options.map(async (option) => {
      const optionMappings = mappings.filter((mapping) => mapping.optionId === option.id)
      const { data } = await completeJSON(
        buildPrompt(option, evidence, optionMappings),
        factorSchema,
        { model: 'gpt-4o-mini' }
      )

      const factors = {
        evidenceStrength: data.evidenceStrength,
        evidenceRecency: data.evidenceRecency,
        sourceReliability: data.sourceReliability,
        corroboration: data.corroboration,
        constraintFit: data.constraintFit,
        assumptionRisk: data.assumptionRisk,
      }

      return {
        optionId: option.id,
        factors,
        totalScore: computeTotal(factors),
        scoreRationale: data.scoreRationale,
      }
    })
  )

  const distribution = scores.map((score) => score.totalScore)
  console.info('Option score distribution', { scores: distribution })

  return scores
}
