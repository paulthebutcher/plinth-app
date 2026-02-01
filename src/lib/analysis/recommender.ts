import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { Option } from '@/lib/analysis/option-composer'
import type { OptionScore } from '@/lib/analysis/option-scorer'
import type { EvidenceMapping } from '@/lib/analysis/evidence-mapper'

export interface Recommendation {
  primaryOptionId: string
  primaryConfidence: number
  primaryRationale: string
  hedgeOptionId?: string
  hedgeCondition?: string
  decisionChangers: DecisionChanger[]
  monitorTriggers: MonitorTrigger[]
}

export interface DecisionChanger {
  condition: string
  wouldFavor: string
  likelihood: 'low' | 'medium' | 'high'
}

export interface MonitorTrigger {
  signal: string
  source: string
  threshold: string
  frequency: 'daily' | 'weekly' | 'monthly'
}

const recommendationSchema = z.object({
  primaryOptionId: z.string().min(1),
  primaryConfidence: z.number().min(0).max(100),
  primaryRationale: z.string().min(1),
  hedgeOptionId: z.string().optional(),
  hedgeCondition: z.string().optional(),
  decisionChangers: z.array(
    z.object({
      condition: z.string().min(1),
      wouldFavor: z.string().min(1),
      likelihood: z.enum(['low', 'medium', 'high']),
    })
  ).min(3).max(5),
  monitorTriggers: z.array(
    z.object({
      signal: z.string().min(1),
      source: z.string().min(1),
      threshold: z.string().min(1),
      frequency: z.enum(['daily', 'weekly', 'monthly']),
    })
  ).min(3).max(5),
})

const buildPrompt = (
  options: Option[],
  scores: OptionScore[],
  mappings: EvidenceMapping[]
) => {
  const scoreByOption = new Map(scores.map((score) => [score.optionId, score]))
  const mappingByOption = mappings.reduce<Record<string, EvidenceMapping[]>>((acc, mapping) => {
    acc[mapping.optionId] = acc[mapping.optionId] ?? []
    acc[mapping.optionId].push(mapping)
    return acc
  }, {})

  const optionSummaries = options.map((option) => {
    const score = scoreByOption.get(option.id)
    const mappingSummary = (mappingByOption[option.id] ?? [])
      .slice(0, 6)
      .map((mapping) => `- ${mapping.relationship} (${mapping.impactLevel}): ${mapping.relevanceExplanation}`)
      .join('\n')

    return [
      `Option ${option.id}: ${option.title}`,
      `Summary: ${option.summary}`,
      `Score: ${score?.totalScore ?? 'n/a'} (${score?.scoreRationale ?? 'n/a'})`,
      'Evidence summary:',
      mappingSummary || 'No mappings',
    ].join('\n')
  })

  return [
    'Based on this analysis:',
    'Options with scores:',
    optionSummaries.join('\n\n'),
    '',
    'Generate a recommendation:',
    '',
    'Primary option: Which option do you recommend and why?',
    'Confidence: How confident (0-100) and what drives uncertainty?',
    'Hedge: Is there a second-best option to consider? Under what conditions?',
    'Decision changers: What 3-5 future events would change this recommendation?',
    'Monitor triggers: What signals should be tracked post-decision?',
    '',
    'Be specific and actionable.',
  ].join('\n')
}

export async function generateRecommendation(
  options: Option[],
  scores: OptionScore[],
  mappings: EvidenceMapping[]
): Promise<Recommendation> {
  const { data } = await completeJSON(
    buildPrompt(options, scores, mappings),
    recommendationSchema,
    { model: 'gpt-4o' }
  )

  return data
}
