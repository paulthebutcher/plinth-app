import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { inngest } from '../client'
import { mapEvidence, type EvidenceMapping } from '@/lib/analysis/evidence-mapper'
import type { EvidenceCard } from '@/lib/analysis/evidence-generator'
import type { Option } from '@/lib/analysis/option-composer'

export const mapEvidenceFunction = inngest.createFunction(
  { id: 'map-evidence', name: 'Map Evidence' },
  { event: 'decision/mapping.requested' },
  async ({ event, step }) => {
    const { decisionId } = event.data

    const { options, evidence } = await step.run('fetch-data', async () => {
      const started = Date.now()
      const result = await fetchOptionsAndEvidence(decisionId)
      console.info('Inngest step fetch-data', { ms: Date.now() - started })
      return result
    })

    const mappings = await step.run('map-evidence', async () => {
      const started = Date.now()
      const result = await mapEvidence(options, evidence)
      console.info('Inngest step map-evidence', { ms: Date.now() - started })
      return result
    })

    await step.run('save-mappings', async () => {
      const started = Date.now()
      await saveMappings(mappings)
      console.info('Inngest step save-mappings', { ms: Date.now() - started })
    })

    await step.run('update-decision-status', async () => {
      await updateDecisionStatus(decisionId)
    })

    await step.run('update-progress-85', async () => {
      await updateJobProgress(decisionId, 85, 'Evidence mapping complete')
    })

    return { mappingCount: mappings.length }
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

const fetchOptionsAndEvidence = async (decisionId: string) => {
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

  return { options, evidence }
}

const saveMappings = async (mappings: EvidenceMapping[]) => {
  const supabase = getServiceClient()
  if (!mappings.length) return

  const rows = mappings.map((mapping) => ({
    option_id: mapping.optionId,
    evidence_id: mapping.evidenceId,
    relationship: mapping.relationship,
    relevance_explanation: mapping.relevanceExplanation,
    impact_level: mapping.impactLevel,
  }))

  await supabase.from('evidence_mappings').insert(rows)
}

const updateDecisionStatus = async (decisionId: string) => {
  const supabase = getServiceClient()
  await supabase
    .from('decisions')
    .update({ analysis_status: 'mapping' })
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
