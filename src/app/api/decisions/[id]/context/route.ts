import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function PATCH(
  request: NextRequest,
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
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const body = await request.json()
  const updateData: Record<string, unknown> = {}

  if ('company_context' in body) {
    updateData.company_context = body.company_context
  }

  if ('falsification_criteria' in body) {
    updateData.falsification_criteria = body.falsification_criteria
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ data: decision })
  }

  if (!decision.analysis_status || ['draft', 'framing'].includes(decision.analysis_status)) {
    updateData.analysis_status = 'context'
  }

  const { data: updatedDecision, error } = await supabase
    .from('decisions')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !updatedDecision) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error?.message ?? 'Update failed' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: updatedDecision })
}
