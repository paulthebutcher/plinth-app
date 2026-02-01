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

      <ResultsTabs decisionId={decision.id} />
    </div>
  )
}
