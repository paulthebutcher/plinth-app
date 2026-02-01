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

  const { data: decision } = await supabase
    .from('decisions')
    .select('id')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, markdown, is_edited, generated_at')
    .eq('decision_id', id)
    .maybeSingle()

  if (!brief) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Brief not found' } },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: brief })
}

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
    .select('id')
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
  const markdown = typeof body?.markdown === 'string' ? body.markdown : null
  if (!markdown) {
    return NextResponse.json(
      { error: { code: 'invalid_request', message: 'Markdown is required' } },
      { status: 400 }
    )
  }

  const { data: existing } = await supabase
    .from('briefs')
    .select('markdown')
    .eq('decision_id', id)
    .maybeSingle()

  const shouldMarkEdited = existing?.markdown !== markdown

  const { data: brief, error } = await supabase
    .from('briefs')
    .update({
      markdown,
      is_edited: shouldMarkEdited ? true : undefined,
    })
    .eq('decision_id', id)
    .select('id, markdown, is_edited, generated_at')
    .single()

  if (error || !brief) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error?.message ?? 'Update failed' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: brief })
}
