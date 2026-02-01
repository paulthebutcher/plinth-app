import { randomUUID } from 'crypto'
import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'
import type { DecisionInput } from '@/lib/analysis/query-planner'

export interface Option {
  id: string
  title: string
  summary: string
  commitsTo: string[]
  deprioritizes: string[]
  primaryUpside: string
  primaryRisk: string
  reversibility: number
  reversibilityExplanation: string
  groundedInEvidence: string[]
}

const optionSchema = z.array(
  z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    commitsTo: z.array(z.string().min(1)).min(1),
    deprioritizes: z.array(z.string().min(1)).min(1),
    primaryUpside: z.string().min(1),
    primaryRisk: z.string().min(1),
    reversibility: z.number().min(1).max(5),
    reversibilityExplanation: z.string().min(1),
    groundedInEvidence: z.array(z.string().min(1)).min(2),
  })
).min(4).max(6)

const buildPrompt = (decision: DecisionInput, evidence: EvidenceCard[]) => {
  const constraintsText = decision.constraints?.length
    ? decision.constraints.map((constraint) => `${constraint.category}: ${constraint.description}`).join('; ')
    : 'None'

  const evidenceSummary = evidence
    .map((card) => `- [${card.id}] ${card.claim}`)
    .join('\n')

  return [
    'You are generating strategic options for a business decision.',
    `Decision: ${decision.decisionFrame}`,
    `Type: ${decision.decisionType}`,
    `Constraints: ${constraintsText}`,
    'Evidence summary:',
    evidenceSummary,
    'Generate 4-6 DISTINCT strategic options. Each option must be:',
    '',
    'A clear COMMITMENT (not vague like "consider options")',
    'GROUNDED in the evidence provided',
    'MUTUALLY EXCLUSIVE from other options',
    'ACTIONABLE within the constraints',
    '',
    'For each option:',
    '',
    'title: Short, clear name',
    'summary: 2-3 sentences explaining the option',
    'commitsTo: What this option explicitly commits to (list)',
    'deprioritizes: What gets deprioritized if this is chosen (list)',
    'primaryUpside: The main benefit of this option',
    'primaryRisk: The main risk of this option',
    'reversibility: 1 (easily reversible) to 5 (irreversible)',
    'reversibilityExplanation: Why this reversibility rating',
    'groundedInEvidence: IDs of evidence cards that support this option',
    '',
    'Output as JSON array.',
  ].join('\n')
}

const normalizeTitle = (value: string) => value.trim().toLowerCase()

const validateDistinct = (options: Option[]) => {
  const titles = options.map((option) => normalizeTitle(option.title))
  return new Set(titles).size === titles.length
}

export async function composeOptions(
  evidence: EvidenceCard[],
  decision: DecisionInput
): Promise<Option[]> {
  const topEvidence = [...evidence]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 30)

  const attempt = async () => {
    const { data } = await completeJSON(
      buildPrompt(decision, topEvidence),
      optionSchema,
      { model: 'gpt-4o' }
    )

    const options: Option[] = data.map((option) => ({
      id: randomUUID(),
      ...option,
    }))

    if (!validateDistinct(options)) {
      throw new Error('Options are not distinct')
    }

    return options
  }

  try {
    return await attempt()
  } catch (error) {
    return await attempt()
  }
}
