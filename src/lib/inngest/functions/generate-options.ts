import { inngest } from '../client'
import { createServiceClient } from '@/lib/supabase/service'
import { composeOptions, type Option } from '@/lib/analysis/option-composer'
import { dedupeOptions } from '@/lib/analysis/option-deduper'
import { type EvidenceCard } from '@/lib/analysis/evidence-generator'
import { type DecisionInput } from '@/lib/analysis/query-planner'

export const generateOptions = inngest.createFunction(
  { id: 'generate-options', name: 'Generate Options' },
  { event: 'decision/options.requested' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    const { decision, evidence } = await step.run('fetch-evidence', async () => {
      const started = Date.now()
      const result = await fetchEvidence(decisionId)
      console.info('Inngest step fetch-evidence', { ms: Date.now() - started })
      return result
    })

    const composed = await step.run('compose-options', async () => {
      const started = Date.now()
      const result = await composeOptions(evidence, decision)
      console.info('Inngest step compose-options', { ms: Date.now() - started })
      return result
    })

    const deduped = await step.run('dedupe-options', async () => {
      const started = Date.now()
      const result = await dedupeOptions(composed)
      console.info('Inngest step dedupe-options', { ms: Date.now() - started })
      return result
    })

    await step.run('save-options', async () => {
      const started = Date.now()
      await saveOptions(decisionId, deduped)
      console.info('Inngest step save-options', { ms: Date.now() - started })
    })

    await step.run('update-decision-status', async () => {
      await updateDecisionStatus(decisionId)
    })

    await step.run('update-progress-80', async () => {
      await updateJobProgress(decisionId, 80, 'Options generated')
    })

    return { optionCount: deduped.length }
  }
)

const getServiceClient = () => createServiceClient()

const fetchEvidence = async (decisionId: string) => {
  const supabase = getServiceClient()

  const { data: decisionRow } = await supabase
    .from('decisions')
    .select('decision_frame, decision_type, company_context')
    .eq('id', decisionId)
    .single()

  const { data: constraints } = await supabase
    .from('constraints')
    .select('category, description')
    .eq('decision_id', decisionId)

  const decision: DecisionInput = {
    decisionFrame: decisionRow?.decision_frame ?? '',
    decisionType: decisionRow?.decision_type ?? '',
    companyContext: decisionRow?.company_context ?? undefined,
    constraints: constraints ?? [],
  }

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

  return { decision, evidence }
}

const saveOptions = async (decisionId: string, options: Option[]) => {
  const supabase = getServiceClient()

  const rows = options.map((option) => ({
    decision_id: decisionId,
    title: option.title,
    summary: option.summary,
    commits_to: option.commitsTo.join('; '),
    deprioritizes: option.deprioritizes.join('; '),
    primary_upside: option.primaryUpside,
    primary_risk: option.primaryRisk,
    reversibility_explanation: option.reversibilityExplanation,
    reversibility_level: String(option.reversibility),
    grounded_in_evidence: option.groundedInEvidence,
  }))

  if (!rows.length) return

  await supabase.from('options').insert(rows)
}

const updateDecisionStatus = async (decisionId: string) => {
  const supabase = getServiceClient()
  await supabase
    .from('decisions')
    .update({ analysis_status: 'options' })
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
