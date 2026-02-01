import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResultsTabs } from '@/components/analyze/results-tabs'
import { Button } from '@/components/ui/button'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select(`
      id,
      title,
      analysis_status,
      confidence_score,
      recommendation_rationale
    `)
    .eq('id', id)
    .single()

  if (!decision) notFound()

  const { data: evidenceRows } = await supabase
    .from('evidence')
    .select('id, claim, snippet, source_url, source_title, accessed_at, confidence')
    .eq('decision_id', id)

  const evidence = (evidenceRows ?? []).map((row: any) => ({
    id: row.id,
    claim: row.claim,
    snippet: row.snippet ?? null,
    sourceUrl: row.source_url ?? null,
    sourceTitle: row.source_title ?? null,
    extractedAt: row.accessed_at ?? null,
    relevanceScore:
      typeof row.confidence?.relevanceScore === 'number'
        ? row.confidence.relevanceScore
        : null,
  }))

  const { data: optionRows } = await supabase
    .from('options')
    .select('id, title, summary, commits_to, deprioritizes')
    .eq('decision_id', id)

  const { data: scoreRows } = await supabase
    .from('option_scores')
    .select('option_id, overall_score, score_breakdown')
    .eq('decision_id', id)

  const scoresByOption = new Map(
    (scoreRows ?? []).map((row: any) => [row.option_id, row])
  )

  const options = (optionRows ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    summary: row.summary ?? '',
    score: typeof scoresByOption.get(row.id)?.overall_score === 'number'
      ? scoresByOption.get(row.id).overall_score
      : null,
    scoreBreakdown: scoresByOption.get(row.id)?.score_breakdown ?? {},
    commitsTo: row.commits_to ? row.commits_to.split(';').map((item: string) => item.trim()).filter(Boolean) : [],
    deprioritizes: row.deprioritizes ? row.deprioritizes.split(';').map((item: string) => item.trim()).filter(Boolean) : [],
  }))

  const { data: recommendationRow } = await supabase
    .from('recommendations')
    .select('primary_option_id, rationale, confidence, hedge_option_id, hedge_condition, monitor_triggers')
    .eq('decision_id', id)
    .maybeSingle()

  const recommendedOptionTitle =
    options.find((option) => option.id === recommendationRow?.primary_option_id)?.title ?? null
  const hedgeOptionTitle =
    options.find((option) => option.id === recommendationRow?.hedge_option_id)?.title ?? null

  const { data: mappingRows } = await supabase
    .from('evidence_mappings')
    .select('evidence_id, relationship, option_id')
    .eq('decision_id', id)

  const { data: decisionChangersRows } = await supabase
    .from('decision_changers')
    .select('condition, would_favor, likelihood')
    .eq('decision_id', id)

  await supabase
    .from('briefs')
    .select('id')
    .eq('decision_id', id)

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analysis Results</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Review evidence, options, and recommendation
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" className="text-sm text-foreground-muted">
            Re-run Analysis
          </Button>
          <Button variant="ghost" className="text-sm text-primary hover:underline">
            View Brief →
          </Button>
        </div>
      </div>

      <ResultsTabs
        decisionId={decision.id}
        evidence={evidence.map((card) => {
          const mapping = mappingRows?.find(
            (row: any) => row.evidence_id === card.id && row.option_id === recommendationRow?.primary_option_id
          )
          return {
            ...card,
            relevanceAssessment: mapping?.relationship ?? null,
          }
        })}
        options={options}
        optionEvidence={evidence.map((card) => ({
          id: card.id,
          claim: card.claim,
          sourceUrl: card.sourceUrl,
        }))}
        optionMappings={(mappingRows ?? []).map((row: any) => ({
          optionId: row.option_id,
          evidenceId: row.evidence_id,
          relationship: row.relationship,
        }))}
        recommendation={{
          optionTitle: recommendedOptionTitle,
          rationale: recommendationRow?.rationale ?? null,
          confidence: recommendationRow?.confidence ?? null,
          hedgeOptionTitle,
          hedgeCondition: recommendationRow?.hedge_condition ?? null,
          decisionChangers: (decisionChangersRows ?? []).map((row: any) => ({
            condition: row.condition,
            wouldFavor: row.would_favor,
            likelihood: row.likelihood ?? 'medium',
          })),
          monitorTriggers: Array.isArray(recommendationRow?.monitor_triggers)
            ? recommendationRow?.monitor_triggers
            : [],
        }}
      />
    </div>
  )
}
