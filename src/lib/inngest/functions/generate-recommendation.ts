import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { inngest } from '../client'
import { generateRecommendation } from '@/lib/analysis/recommender'
import type { Option } from '@/lib/analysis/option-composer'
import type { EvidenceMapping } from '@/lib/analysis/evidence-mapper'
import type { OptionScore } from '@/lib/analysis/option-scorer'
import type { Recommendation } from '@/lib/analysis/recommender'

export const generateRecommendationFunction = inngest.createFunction(
  { id: 'generate-recommendation', name: 'Generate Recommendation' },
  { event: 'decision/recommendation.requested' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    const { options, scores, mappings } = await step.run('fetch-data', async () => {
      const started = Date.now()
      const result = await fetchData(decisionId)
      console.info('Inngest step fetch-data', { ms: Date.now() - started })
      return result
    })

    const recommendation = await step.run('generate-recommendation', async () => {
      const started = Date.now()
      const result = await generateRecommendation(options, scores, mappings)
      console.info('Inngest step generate-recommendation', { ms: Date.now() - started })
      return result
    })

    await step.run('save-recommendation', async () => {
      const started = Date.now()
      await saveRecommendation(decisionId, recommendation)
      console.info('Inngest step save-recommendation', { ms: Date.now() - started })
    })

    await step.run('update-decision', async () => {
      await updateDecision(decisionId, recommendation)
    })

    await step.run('update-progress-95', async () => {
      await updateJobProgress(decisionId, 95, 'Recommendation generated')
    })

    return { recommendationId: recommendation.primaryOptionId }
  }
)

const getServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service role configuration')
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      get() {
        return undefined
      },
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    },
  })
}

const fetchData = async (decisionId: string) => {
  const supabase = getServiceClient()

  const { data: optionRows } = await supabase
    .from('options')
    .select('id, title, summary, commits_to, deprioritizes, primary_upside, primary_risk, reversibility_level, reversibility_explanation, grounded_in_evidence')
    .eq('decision_id', decisionId)

  const options: Option[] = (optionRows ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    summary: row.summary ?? '',
    commitsTo: row.commits_to ? row.commits_to.split(';').map((item: string) => item.trim()).filter(Boolean) : [],
    deprioritizes: row.deprioritizes ? row.deprioritizes.split(';').map((item: string) => item.trim()).filter(Boolean) : [],
    primaryUpside: row.primary_upside ?? '',
    primaryRisk: row.primary_risk ?? '',
    reversibility: Number(row.reversibility_level ?? 3),
    reversibilityExplanation: row.reversibility_explanation ?? '',
    groundedInEvidence: row.grounded_in_evidence ?? [],
  }))

  const { data: scoreRows } = await supabase
    .from('option_scores')
    .select('option_id, overall_score, score_breakdown, rationale')
    .eq('decision_id', decisionId)

  const scores: OptionScore[] = (scoreRows ?? []).map((row: any) => ({
    optionId: row.option_id,
    factors: row.score_breakdown,
    totalScore: row.overall_score ?? 0,
    scoreRationale: row.rationale ?? '',
  }))

  const { data: mappingRows } = await supabase
    .from('evidence_mappings')
    .select('option_id, evidence_id, relationship, relevance_explanation, impact_level')
    .eq('decision_id', decisionId)

  const mappings: EvidenceMapping[] = (mappingRows ?? []).map((row: any) => ({
    optionId: row.option_id,
    evidenceId: row.evidence_id,
    relationship: row.relationship,
    relevanceExplanation: row.relevance_explanation,
    impactLevel: row.impact_level,
  }))

  return { options, scores, mappings }
}

const saveRecommendation = async (decisionId: string, recommendation: Recommendation) => {
  const supabase = getServiceClient()

  const { data } = await supabase
    .from('recommendations')
    .insert({
      decision_id: decisionId,
      primary_option_id: recommendation.primaryOptionId,
      hedge_option_id: recommendation.hedgeOptionId ?? null,
      hedge_condition: recommendation.hedgeCondition ?? null,
      confidence: recommendation.primaryConfidence,
      rationale: recommendation.primaryRationale,
      monitor_triggers: recommendation.monitorTriggers,
    })
    .select('id')
    .single()

  return data?.id
}

const updateDecision = async (decisionId: string, recommendation: Recommendation) => {
  const supabase = getServiceClient()
  const { data } = await supabase
    .from('recommendations')
    .select('id')
    .eq('decision_id', decisionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  await supabase
    .from('decisions')
    .update({
      recommendation_id: data?.id ?? null,
      confidence_score: recommendation.primaryConfidence,
      recommendation_rationale: recommendation.primaryRationale,
      analysis_status: 'recommending',
    })
    .eq('id', decisionId)
}

async function updateJobProgress(decisionId: string, progress: number, message: string) {
  const supabase = getServiceClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('id, output')
    .eq('decision_id', decisionId)
    .eq('type', 'decision_analysis')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!job?.id) return

  const output = {
    ...(job.output ?? {}),
    message,
    updated_at: new Date().toISOString(),
  }

  await supabase
    .from('jobs')
    .update({
      progress,
      status: 'running',
      output,
    })
    .eq('id', job.id)
}
