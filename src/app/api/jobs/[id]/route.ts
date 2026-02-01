import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const ctx = await requireOrgContext()
  if (!ctx.ok) {
    return ctx.errorResponse
  }
  const { supabase, orgId } = ctx

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .eq('type', 'decision_analysis')
    .single()

  if (!job) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Job not found' } },
      { status: 404 }
    )
  }

  if (error) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: job })
}
