import { createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { inngest } from '../client'
import { planQueries } from '@/lib/analysis/query-planner'
import { discoverUrls } from '@/lib/analysis/url-discovery'
import { extractContent } from '@/lib/analysis/content-extractor'
import { generateEvidence, type EvidenceCard } from '@/lib/analysis/evidence-generator'

export const evidenceScan = inngest.createFunction(
  { id: 'evidence-scan', name: 'Evidence Scan' },
  { event: 'decision/scan.requested' },
  async ({ event, step }) => {
    const { decisionId, decision } = event.data

    const queries = await step.run('plan-queries', async () => {
      const started = Date.now()
      const result = await planQueries(decision)
      console.info('Inngest step plan-queries', { ms: Date.now() - started })
      return result
    })

    await step.run('update-progress-20', async () => {
      await updateJobProgress(decisionId, 20, 'Searching for evidence...')
    })

    const urls = await step.run('discover-urls', async () => {
      const started = Date.now()
      const result = await discoverUrls(queries)
      console.info('Inngest step discover-urls', { ms: Date.now() - started })
      return result
    })

    await step.run('update-progress-40', async () => {
      await updateJobProgress(decisionId, 40, 'Extracting content...')
    })

    const content = await step.run('extract-content', async () => {
      const started = Date.now()
      const result = await extractContent(urls.candidates.slice(0, 35))
      console.info('Inngest step extract-content', { ms: Date.now() - started })
      return result
    })

    await step.run('update-progress-60', async () => {
      await updateJobProgress(decisionId, 60, 'Generating evidence cards...')
    })

    const evidence = await step.run('generate-evidence', async () => {
      const started = Date.now()
      const result = await generateEvidence(content, decision)
      console.info('Inngest step generate-evidence', { ms: Date.now() - started })
      return result
    })

    await step.run('save-evidence', async () => {
      const started = Date.now()
      await saveEvidenceCards(decisionId, evidence)
      console.info('Inngest step save-evidence', { ms: Date.now() - started })
    })

    await step.run('update-progress-70', async () => {
      await updateJobProgress(decisionId, 70, 'Evidence scan complete')
    })

    return { evidenceCount: evidence.length }
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

async function saveEvidenceCards(decisionId: string, evidence: EvidenceCard[]) {
  if (!evidence.length) return
  const supabase = getServiceClient()

  const rows = evidence.map((card) => ({
    id: card.id,
    decision_id: decisionId,
    claim: card.claim,
    snippet: card.sourceSnippet,
    source_url: card.sourceUrl,
    source_title: card.sourceTitle,
    accessed_at: card.extractedAt,
    confidence: {
      credibilityScore: card.credibilityScore,
      relevanceScore: card.relevanceScore,
      freshness: card.freshness,
    },
  }))

  await supabase.from('evidence').insert(rows)
}
