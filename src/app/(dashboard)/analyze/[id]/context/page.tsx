import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ContextForm } from '@/components/analyze/context-form'

export default async function ContextPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, company_context, falsification_criteria')
    .eq('id', params.id)
    .single()

  if (!decision) notFound()

  const { data: constraints } = await supabase
    .from('constraints')
    .select('*')
    .eq('decision_id', params.id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Add Context</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Optional: Provide context to reduce bias and improve analysis.
        </p>
      </div>

      <ContextForm
        decisionId={decision.id}
        initialContext={{
          company_context: decision.company_context || '',
          falsification_criteria: decision.falsification_criteria || '',
        }}
        initialConstraints={constraints || []}
      />
    </div>
  )
}
