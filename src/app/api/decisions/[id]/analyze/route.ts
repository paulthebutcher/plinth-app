import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const ctx = await requireOrgContext()
  if (!ctx.ok) {
    return ctx.errorResponse
  }
  const { supabase, orgId } = ctx

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, decision_frame, decision_type, analysis_status, org_id')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  if (!decision.decision_frame?.trim() || !decision.decision_type) {
    return NextResponse.json(
      { error: { code: 'validation_error', message: 'Decision frame and type required' } },
      { status: 400 }
    )
  }

  const currentStatus = decision.analysis_status ?? 'draft'
  const allowedStatuses = ['draft', 'framing', 'context', 'complete']
  if (!allowedStatuses.includes(currentStatus)) {
    return NextResponse.json(
      { error: { code: 'conflict', message: 'Analysis already in progress' } },
      { status: 400 }
    )
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      org_id: decision.org_id,
      decision_id: decision.id,
      type: 'decision_analysis',
      status: 'pending',
      progress: 0,
      input: {
        decision_id: decision.id,
        decision_type: decision.decision_type,
      },
    })
    .select()
    .single()

  if (jobError || !job) {
    return NextResponse.json(
      { error: { code: 'server_error', message: jobError?.message ?? 'Job create failed' } },
      { status: 500 }
    )
  }

  const { error: updateError } = await supabase
    .from('decisions')
    .update({
      analysis_status: 'scanning',
      analysis_started_at: new Date().toISOString(),
    })
    .eq('id', decision.id)

  if (updateError) {
    return NextResponse.json(
      { error: { code: 'server_error', message: updateError.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { jobId: job.id, status: 'started' } })
}
