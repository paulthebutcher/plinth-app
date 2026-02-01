import { z } from 'zod'
import { completeJSON } from '@/lib/services/openai'

export interface DecisionInput {
  decisionFrame: string
  decisionType: string
  companyContext?: string
  constraints?: { category: string; description: string }[]
}

export interface QueryPlan {
  query: string
  intent: string
  freshness: 'any' | 'recent' | 'realtime'
  domainHints?: string[]
}

const queryPlanSchema = z.array(
  z.object({
    query: z.string().min(1),
    intent: z.string().min(1),
    freshness: z.enum(['any', 'recent', 'realtime']),
    domainHints: z.array(z.string()).optional(),
  })
).min(8).max(20)

const buildPrompt = (decision: DecisionInput) => {
  const constraintsText = decision.constraints?.length
    ? decision.constraints.map((constraint) => `${constraint.category}: ${constraint.description}`).join('; ')
    : 'None'

  return [
    'You are a research assistant planning web searches for a strategic decision.',
    '',
    `Decision: ${decision.decisionFrame}`,
    `Type: ${decision.decisionType}`,
    `Context: ${decision.companyContext || 'None'}`,
    `Constraints: ${constraintsText}`,
    '',
    'Generate 8-20 targeted search queries that will find:',
    '- Market data and trends',
    '- Competitor information',
    '- Expert opinions and analysis',
    '- Case studies and examples',
    '- Risks and challenges',
    '- Success factors',
    '',
    'For each query, specify:',
    '- query: The exact search string',
    "- intent: What information you're looking for",
    "- freshness: 'recent' for time-sensitive, 'any' for evergreen",
    '- domainHints: Preferred sources (optional)',
    '',
    'Output as JSON array.',
  ].join('\n')
}

export async function planQueries(decision: DecisionInput): Promise<QueryPlan[]> {
  const prompt = buildPrompt(decision)

  const attempt = async () => {
    const { data, usage } = await completeJSON(prompt, queryPlanSchema, {
      model: 'gpt-4o-mini',
    })

    console.info('Query planner usage', usage)
    console.info('Query planner count', { count: data.length })
    return data
  }

  try {
    return await attempt()
  } catch (error) {
    return await attempt()
  }
}
