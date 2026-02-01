import { inngest } from '../client'
import { createServiceClient } from '@/lib/supabase/service'
import { scoreOptions, type OptionScore } from '@/lib/analysis/option-scorer'
import type { Option } from '@/lib/analysis/option-composer'
import type { EvidenceMapping } from '@/lib/analysis/evidence-mapper'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'

export const scoreOptionsFunction = inngest.createFunction(
  { id: 'score-options', name: 'Score Options' },
  { event: 'decision/scoring.requested' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    const { options, mappings, evidence } = await step.run('fetch-data', async () => {
      const started = Date.now()
      const result = await fetchOptionData(decisionId)
      console.info('Inngest step fetch-data', { ms: Date.now() - started })
      return result
    })

    const scores = await step.run('score-options', async () => {
      const started = Date.now()
      const result = await scoreOptions(options, mappings, evidence)
      console.info('Inngest step score-options', { ms: Date.now() - started })
      return result
    })

    await step.run('save-scores', async () => {
      const started = Date.now()
      await saveScores(decisionId, scores)
      console.info('Inngest step save-scores', { ms: Date.now() - started })
    })

    await step.run('update-decision-status', async () => {
      await updateDecisionStatus(decisionId)
    })

    await step.run('update-progress-90', async () => {
      await updateJobProgress(decisionId, 90, 'Option scoring complete')
    })

    return { scoreCount: scores.length }
  }
)

const getServiceClient = () => createServiceClient()

const fetchOptionData = async (decisionId: string) => {
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

  const { data: evidenceRows } = await supabase
    .from('evidence')
    .select('id, claim, snippet, source_url, source_title, accessed_at, created_at, confidence')
    .eq('decision_id', decisionId)

  const evidence: EvidenceCard[] = (evidenceRows ?? []).map((row: any) => {
    const confidence = row.confidence ?? {}
    const credibilityScore =
      typeof confidence.credibilityScore === 'number' ? confidence.credibilityScore : 50
    const relevanceScore =
      typeof confidence.relevanceScore === 'number' ? confidence.relevanceScore : 50
    const freshness =
      confidence.freshness === 'current' || confidence.freshness === 'dated'
        ? confidence.freshness
        : 'recent'

    return {
      id: row.id,
      claim: row.claim,
      sourceUrl: row.source_url ?? '',
      sourceTitle: row.source_title ?? '',
      sourceSnippet: row.snippet ?? '',
      credibilityScore,
      relevanceScore,
      freshness,
      extractedAt: row.accessed_at ?? row.created_at ?? new Date().toISOString(),
    }
  })

  return { options, mappings, evidence }
}

const saveScores = async (decisionId: string, scores: OptionScore[]) => {
  if (!scores.length) return
  const supabase = getServiceClient()

  const rows = scores.map((score) => ({
    decision_id: decisionId,
    option_id: score.optionId,
    overall_score: score.totalScore,
    score_breakdown: score.factors,
    rationale: score.scoreRationale,
  }))

  await supabase.from('option_scores').insert(rows)
}

const updateDecisionStatus = async (decisionId: string) => {
  const supabase = getServiceClient()
  await supabase
    .from('decisions')
    .update({ analysis_status: 'scoring' })
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
