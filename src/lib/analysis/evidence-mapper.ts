import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { Option } from '@/lib/analysis/option-composer'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'

export interface EvidenceMapping {
  optionId: string
  evidenceId: string
  relationship: 'supporting' | 'contradicting' | 'unknown'
  relevanceExplanation: string
  impactLevel: 'high' | 'medium' | 'low'
}

const mappingSchema = z.array(
  z.object({
    evidenceId: z.string().min(1),
    relationship: z.enum(['supporting', 'contradicting', 'unknown']),
    relevanceExplanation: z.string().min(1),
    impactLevel: z.enum(['high', 'medium', 'low']),
  })
)

const buildPrompt = (option: Option, evidence: EvidenceCard[]) => [
  'For this strategic option:',
  `Title: ${option.title}`,
  `Summary: ${option.summary}`,
  'Classify each piece of evidence:',
  ...evidence.map((card, index) => `Evidence ${index + 1}: [${card.id}] ${card.claim}`),
  'For each evidence, provide:',
  '',
  'evidenceId: The ID of the evidence',
  "relationship: 'supporting', 'contradicting', or 'unknown'",
  "relevanceExplanation: Why this evidence relates (or doesn't) to this option",
  "impactLevel: 'high', 'medium', or 'low' based on how much this evidence matters",
  '',
  'Output as JSON array.',
].join('\n')

export async function mapEvidence(
  options: Option[],
  evidence: EvidenceCard[]
): Promise<EvidenceMapping[]> {
  const mappings = await Promise.all(
    options.map(async (option) => {
      const { data } = await completeJSON(
        buildPrompt(option, evidence),
        mappingSchema,
        { model: 'gpt-4o' }
      )

      const optionMappings = data.map((item) => ({
        optionId: option.id,
        evidenceId: item.evidenceId,
        relationship: item.relationship,
        relevanceExplanation: item.relevanceExplanation,
        impactLevel: item.impactLevel,
      }))

      console.info('Evidence mapping', {
        optionId: option.id,
        mappings: optionMappings.length,
      })

      return optionMappings
    })
  )

  return mappings.flat()
}
