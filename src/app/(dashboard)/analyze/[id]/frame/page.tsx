import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { FrameForm } from '@/components/analyze/frame-form'

export default async function FramePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select(`
      id,
      title,
      decision_frame,
      decision_type,
      time_horizon,
      reversibility,
      stakes,
      scope
    `)
    .eq('id', params.id)
    .single()

  if (!decision) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Frame Your Decision</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Define the decision clearly before exploring options.
        </p>
      </div>

      <FrameForm
        decisionId={decision.id}
        initialData={{
          title: decision.title,
          decision_frame: decision.decision_frame || '',
          decision_type: decision.decision_type || null,
          time_horizon: decision.time_horizon || null,
          reversibility: decision.reversibility || 3,
          stakes: decision.stakes || 3,
          scope: decision.scope || 3,
        }}
      />
    </div>
  )
}
