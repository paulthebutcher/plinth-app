import { createHash } from 'crypto'
import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'
import type { Option } from '@/lib/analysis/option-composer'
import type { OptionScore } from '@/lib/analysis/option-scorer'
import type { Recommendation } from '@/lib/analysis/recommender'

export interface Citation {
  id: string
  url: string
  title: string
  accessedAt: string
  snippetHash: string
}

export interface Brief {
  id: string
  decisionId: string
  sections: {
    framing: string
    optionsConsidered: string
    evidenceSummary: string
    assumptionsLedger: string
    recommendation: string
    openQuestions: string
    metadata: string
  }
  citations: Citation[]
  generatedAt: string
  markdown: string
}

export interface FullDecision {
  id: string
  title: string
  decisionFrame: string
  decisionType: string
  companyContext?: string
  constraints?: { category: string; description: string }[]
  assumptions?: { type?: string; statement: string }[]
  stakeholders?: { name: string; role?: string }[]
  owner?: { name?: string; email?: string }
  evidence: {
    id: string
    claim: string
    sourceUrl: string
    sourceTitle: string
    sourceSnippet: string
    extractedAt: string
  }[]
  options: Option[]
  scores: OptionScore[]
  recommendation: Recommendation
}

const briefSchema = z.object({
  sections: z.object({
    framing: z.string().min(1),
    optionsConsidered: z.string().min(1),
    evidenceSummary: z.string().min(1),
    assumptionsLedger: z.string().min(1),
    recommendation: z.string().min(1),
    openQuestions: z.string().min(1),
    metadata: z.string().min(1),
  }),
})

const hashSnippet = (snippet: string) =>
  createHash('sha256').update(snippet).digest('hex')

const buildPrompt = (decision: FullDecision, evidenceRefs: string[]) => {
  const constraints = decision.constraints?.length
    ? decision.constraints.map((c) => `${c.category}: ${c.description}`).join('; ')
    : 'None'
  const assumptions = decision.assumptions?.length
    ? decision.assumptions.map((a) => `${a.type ?? 'assumption'}: ${a.statement}`).join('; ')
    : 'None'
  const stakeholders = decision.stakeholders?.length
    ? decision.stakeholders.map((s) => `${s.name}${s.role ? ` (${s.role})` : ''}`).join('; ')
    : 'None'

  const scoreByOption = new Map(decision.scores.map((s) => [s.optionId, s]))
  const options = decision.options.map((option) => {
    const score = scoreByOption.get(option.id)
    return [
      `- ${option.title} (${option.id})`,
      `  Summary: ${option.summary}`,
      `  Score: ${score?.totalScore ?? 'n/a'} (${score?.scoreRationale ?? 'n/a'})`,
    ].join('\n')
  })

  return [
    'You are writing an executive decision brief with citations.',
    'All factual claims must cite sources using the provided citation IDs like [E1].',
    'Keep the brief concise (aim for a 2-page total).',
    '',
    `Decision: ${decision.decisionFrame}`,
    `Type: ${decision.decisionType}`,
    `Context: ${decision.companyContext ?? 'None'}`,
    `Constraints: ${constraints}`,
    `Assumptions: ${assumptions}`,
    `Stakeholders: ${stakeholders}`,
    '',
    'Options with scores:',
    options.join('\n'),
    '',
    'Recommendation:',
    `Primary option: ${decision.recommendation.primaryOptionId}`,
    `Confidence: ${decision.recommendation.primaryConfidence}`,
    `Rationale: ${decision.recommendation.primaryRationale}`,
    decision.recommendation.hedgeOptionId
      ? `Hedge option: ${decision.recommendation.hedgeOptionId} (${decision.recommendation.hedgeCondition ?? ''})`
      : 'Hedge option: None',
    '',
    'Evidence citations (use IDs in brackets):',
    evidenceRefs.join('\n'),
    '',
    'Write these sections:',
    '- framing: Decision question, constraints, stakes',
    '- optionsConsidered: All options including rejected',
    '- evidenceSummary: Key evidence with citations',
    '- assumptionsLedger: Declared and implicit assumptions',
    '- recommendation: Primary + hedge + confidence',
    '- openQuestions: Unresolved unknowns',
    '- metadata: Owner, stakeholders, date',
    '',
    'Output as JSON with a sections object.',
  ].join('\n')
}

const extractCitationIds = (sections: Brief['sections']) => {
  const text = Object.values(sections).join('\n')
  const matches = text.match(/\[E\d+\]/g) ?? []
  return Array.from(new Set(matches.map((match) => match.replace(/\[|\]/g, ''))))
}

const buildMarkdown = (sections: Brief['sections'], citations: Citation[]) => [
  '# Decision Brief',
  '',
  '## Framing',
  sections.framing,
  '',
  '## Options Considered',
  sections.optionsConsidered,
  '',
  '## Evidence Summary',
  sections.evidenceSummary,
  '',
  '## Assumptions Ledger',
  sections.assumptionsLedger,
  '',
  '## Recommendation',
  sections.recommendation,
  '',
  '## Open Questions',
  sections.openQuestions,
  '',
  '## Metadata',
  sections.metadata,
  '',
  '## Citations',
  ...citations.map((citation) => `- [${citation.id}] ${citation.title} — ${citation.url}`),
].join('\n')

export async function writeBrief(decision: FullDecision): Promise<Brief> {
  const evidenceRefs = decision.evidence.map((card, index) => {
    const code = `E${index + 1}`
    return `[${code}] ${card.sourceTitle} — ${card.sourceUrl} — "${card.sourceSnippet}"`
  })

  const { data } = await completeJSON(
    buildPrompt(decision, evidenceRefs),
    briefSchema,
    { model: 'gpt-4o' }
  )

  const generatedAt = new Date().toISOString()
  const sections = data.sections
  const citationIds = extractCitationIds(sections)

  const citations: Citation[] = decision.evidence.map((card, index) => {
    const id = `E${index + 1}`
    return {
      id,
      url: card.sourceUrl,
      title: card.sourceTitle,
      accessedAt: card.extractedAt,
      snippetHash: hashSnippet(card.sourceSnippet),
    }
  }).filter((citation) => citationIds.includes(citation.id) || !citationIds.length)

  return {
    id: `brief_${decision.id}`,
    decisionId: decision.id,
    sections,
    citations,
    generatedAt,
    markdown: buildMarkdown(sections, citations),
  }
}
