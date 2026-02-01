import { randomUUID } from 'crypto'
import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { ExtractedContent } from '@/lib/analysis/content-extractor'
import type { DecisionInput } from '@/lib/analysis/query-planner'

export interface EvidenceCard {
  id: string
  claim: string
  sourceUrl: string
  sourceTitle: string
  sourceSnippet: string
  credibilityScore: number
  relevanceScore: number
  freshness: 'current' | 'recent' | 'dated'
  extractedAt: string
}

const MAX_CONCURRENCY = 5
const MAX_OUTPUT = 40

const evidenceSchema = z.array(
  z.object({
    claim: z.string().min(1),
    sourceSnippet: z.string().min(1),
    credibilityScore: z.number().min(0).max(100),
    relevanceScore: z.number().min(0).max(100),
    freshness: z.enum(['current', 'recent', 'dated']),
  })
).min(3).max(8)

const dedupeSchema = z.array(z.array(z.number().int().min(0)))

const buildPrompt = (decision: DecisionInput, content: ExtractedContent) => [
  'You are extracting factual claims from a web page for decision analysis.',
  `Decision: ${decision.decisionFrame}`,
  `Source URL: ${content.url}`,
  `Source Title: ${content.title}`,
  `Content: ${content.text}`,
  'Extract 3-8 factual claims that are relevant to this decision.',
  'For each claim:',
  '',
  'claim: A specific, factual statement (not opinion)',
  'sourceSnippet: The exact quote from the text supporting this claim',
  'credibilityScore: 0-100 based on source quality and specificity',
  'relevanceScore: 0-100 based on how relevant to the decision',
  "freshness: 'current' (<3 months), 'recent' (3-12 months), 'dated' (>1 year)",
  '',
  'Only include claims that are:',
  '',
  'Factual and verifiable',
  'Relevant to the decision',
  'Supported by the source text',
  '',
  'Output as JSON array.',
].join('\n')

const buildDedupePrompt = (claims: EvidenceCard[]) => [
  'You are deduplicating similar factual claims.',
  'Group claims that are semantically equivalent or near-duplicates.',
  'Return JSON array of groups, each group is an array of indices.',
  'Only include groups with 2 or more indices.',
  '',
  ...claims.map((claim, index) => `${index}: ${claim.claim}`),
].join('\n')

const runWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
) => {
  const results: R[] = []
  let index = 0

  const runners = Array.from({ length: Math.min(concurrency, items.length) }).map(async () => {
    while (index < items.length) {
      const currentIndex = index
      index += 1
      results[currentIndex] = await worker(items[currentIndex])
    }
  })

  await Promise.all(runners)
  return results
}

const scoreCard = (card: EvidenceCard) =>
  Math.round(card.relevanceScore * 0.6 + card.credibilityScore * 0.4)

export async function generateEvidence(
  content: ExtractedContent[],
  decision: DecisionInput
): Promise<EvidenceCard[]> {
  const extracted = await runWithConcurrency(content, MAX_CONCURRENCY, async (page) => {
    try {
      const { data } = await completeJSON(
        buildPrompt(decision, page),
        evidenceSchema,
        { model: 'gpt-4o-mini' }
      )

      return data.map((item) => ({
        id: randomUUID(),
        claim: item.claim,
        sourceUrl: page.url,
        sourceTitle: page.title,
        sourceSnippet: item.sourceSnippet,
        credibilityScore: item.credibilityScore,
        relevanceScore: item.relevanceScore,
        freshness: item.freshness,
        extractedAt: page.extractedAt,
      }))
    } catch (error) {
      return []
    }
  })

  const flat = extracted.flat()

  console.info('Evidence extraction', { pages: content.length, claims: flat.length })

  let deduped = flat
  if (flat.length > 1) {
    try {
      const { data: groups } = await completeJSON(
        buildDedupePrompt(flat),
        dedupeSchema,
        { model: 'gpt-4o-mini' }
      )

      const duplicates = new Set<number>()
      groups.forEach((group) => {
        if (group.length < 2) return
        const bestIndex = group
          .map((index) => ({ index, score: scoreCard(flat[index]) }))
          .sort((a, b) => b.score - a.score)[0]?.index

        group.forEach((index) => {
          if (index !== bestIndex) {
            duplicates.add(index)
          }
        })
      })

      deduped = flat.filter((_, index) => !duplicates.has(index))
    } catch (error) {
      deduped = flat
    }
  }

  const sorted = deduped.sort((a, b) => scoreCard(b) - scoreCard(a))
  const result = sorted.slice(0, MAX_OUTPUT)

  console.info('Evidence deduped', {
    raw: flat.length,
    deduped: deduped.length,
    returned: result.length,
  })

  return result
}
