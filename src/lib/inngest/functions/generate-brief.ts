import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { inngest } from '../client'
import { writeBrief, type FullDecision } from '@/lib/analysis/brief-writer'
import type { Option } from '@/lib/analysis/option-composer'
import type { OptionScore } from '@/lib/analysis/option-scorer'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'
import type { Recommendation } from '@/lib/analysis/recommender'

export const generateBriefFunction = inngest.createFunction(
  { id: 'generate-brief', name: 'Generate Brief' },
  { event: 'decision/brief.requested' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    const decision = await step.run('fetch-decision', async () => {
      const started = Date.now()
      const result = await fetchFullDecision(decisionId)
      console.info('Inngest step fetch-decision', { ms: Date.now() - started })
      return result
    })

    const brief = await step.run('write-brief', async () => {
      const started = Date.now()
      const result = await writeBrief(decision)
      console.info('Inngest step write-brief', { ms: Date.now() - started })
      return result
    })

    await step.run('save-brief', async () => {
      const started = Date.now()
      await saveBrief(brief)
      console.info('Inngest step save-brief', { ms: Date.now() - started })
    })

    await step.run('update-decision-status', async () => {
      await updateDecisionStatus(decisionId)
    })

    await step.run('finalize-job', async () => {
      await updateJobComplete(decisionId)
    })

    return { briefId: brief.id }
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

const fetchFullDecision = async (decisionId: string): Promise<FullDecision> => {
  const supabase = getServiceClient()

  const { data: decisionRow } = await supabase
    .from('decisions')
    .select('id, title, decision_frame, decision_type, company_context, owner_id')
    .eq('id', decisionId)
    .single()

  const { data: ownerRow } = decisionRow?.owner_id
    ? await supabase.from('users').select('full_name, email').eq('id', decisionRow.owner_id).single()
    : { data: null }

  const { data: constraintRows } = await supabase
    .from('constraints')
    .select('category, description')
    .eq('decision_id', decisionId)

  const { data: assumptionRows } = await supabase
    .from('assumptions_ledger')
    .select('statement, status')
    .eq('decision_id', decisionId)

  const { data: stakeholderRows } = await supabase
    .from('stakeholders')
    .select('name, role')
    .eq('decision_id', decisionId)

  const { data: evidenceRows } = await supabase
    .from('evidence')
    .select('id, claim, snippet, source_url, source_title, accessed_at, created_at')
    .eq('decision_id', decisionId)

  const { data: optionRows } = await supabase
    .from('options')
    .select('id, title, summary, commits_to, deprioritizes, primary_upside, primary_risk, reversibility_level, reversibility_explanation, grounded_in_evidence')
    .eq('decision_id', decisionId)

  const { data: scoreRows } = await supabase
    .from('option_scores')
    .select('option_id, overall_score, score_breakdown, rationale')
    .eq('decision_id', decisionId)

  const { data: recommendationRow } = await supabase
    .from('recommendations')
    .select('primary_option_id, hedge_option_id, hedge_condition, confidence, rationale, monitor_triggers')
    .eq('decision_id', decisionId)
    .maybeSingle()

  const { data: decisionChangerRows } = await supabase
    .from('decision_changers')
    .select('condition, would_favor, likelihood')
    .eq('decision_id', decisionId)

  const evidence: EvidenceCard[] = (evidenceRows ?? []).map((row: any) => ({
    id: row.id,
    claim: row.claim,
    sourceUrl: row.source_url ?? '',
    sourceTitle: row.source_title ?? '',
    sourceSnippet: row.snippet ?? '',
    credibilityScore: 50,
    relevanceScore: 50,
    freshness: 'recent',
    extractedAt: row.accessed_at ?? row.created_at ?? new Date().toISOString(),
  }))

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

  const scores: OptionScore[] = (scoreRows ?? []).map((row: any) => ({
    optionId: row.option_id,
    factors: row.score_breakdown,
    totalScore: row.overall_score ?? 0,
    scoreRationale: row.rationale ?? '',
  }))

  const recommendation: Recommendation = {
    primaryOptionId: recommendationRow?.primary_option_id ?? '',
    primaryConfidence: recommendationRow?.confidence ?? 0,
    primaryRationale: recommendationRow?.rationale ?? '',
    hedgeOptionId: recommendationRow?.hedge_option_id ?? undefined,
    hedgeCondition: recommendationRow?.hedge_condition ?? undefined,
    decisionChangers: (decisionChangerRows ?? []).map((row: any) => ({
      condition: row.condition,
      wouldFavor: row.would_favor,
      likelihood: row.likelihood ?? 'medium',
    })),
    monitorTriggers: Array.isArray(recommendationRow?.monitor_triggers)
      ? recommendationRow?.monitor_triggers
      : [],
  }

  return {
    id: decisionRow?.id ?? decisionId,
    title: decisionRow?.title ?? 'Decision',
    decisionFrame: decisionRow?.decision_frame ?? '',
    decisionType: decisionRow?.decision_type ?? '',
    companyContext: decisionRow?.company_context ?? undefined,
    constraints: constraintRows ?? [],
    assumptions: (assumptionRows ?? []).map((row: any) => ({
      type: row.status ?? 'assumption',
      statement: row.statement,
    })),
    stakeholders: stakeholderRows ?? [],
    owner: ownerRow
      ? { name: ownerRow.full_name ?? undefined, email: ownerRow.email ?? undefined }
      : undefined,
    evidence,
    options,
    scores,
    recommendation,
  }
}

const saveBrief = async (brief: Awaited<ReturnType<typeof writeBrief>>) => {
  const supabase = getServiceClient()
  await supabase.from('briefs').insert({
    id: brief.id,
    decision_id: brief.decisionId,
    sections: brief.sections,
    citations: brief.citations,
    markdown: brief.markdown,
    generated_at: brief.generatedAt,
  })
}

const updateDecisionStatus = async (decisionId: string) => {
  const supabase = getServiceClient()
  await supabase
    .from('decisions')
    .update({ analysis_status: 'complete' })
    .eq('id', decisionId)
}

const updateJobComplete = async (decisionId: string) => {
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
    message: 'Decision brief generated',
    updated_at: new Date().toISOString(),
  }

  await supabase
    .from('jobs')
    .update({
      progress: 100,
      status: 'completed',
      output,
    })
    .eq('id', job.id)
}
