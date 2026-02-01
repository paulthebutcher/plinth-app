import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; constraintId: string }> }
) {
  const { id, constraintId } = await context.params
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

  const { data: constraint } = await supabase
    .from('constraints')
    .select('id, decision_id')
    .eq('id', constraintId)
    .single()

  if (!constraint || constraint.decision_id !== id) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Constraint not found' } },
      { status: 404 }
    )
  }

  const { error } = await supabase
    .from('constraints')
    .delete()
    .eq('id', constraintId)

  if (error) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { success: true } })
}
