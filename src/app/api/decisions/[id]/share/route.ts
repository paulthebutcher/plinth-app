import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

const getShareUrl = (key: string) => {
  const base = process.env.NEXT_PUBLIC_APP_URL || ''
  return `${base}/share/${key}`
}

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

  const shareKey = nanoid(12)
  const { data: brief, error } = await supabase
    .from('briefs')
    .update({
      is_shared: true,
      share_key: shareKey,
    })
    .eq('decision_id', id)
    .select('share_key')
    .single()

  if (error || !brief?.share_key) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error?.message ?? 'Share failed' } },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data: {
      shareUrl: getShareUrl(brief.share_key),
    },
  })
}

export async function DELETE(
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

  const { error } = await supabase
    .from('briefs')
    .update({
      is_shared: false,
      share_key: null,
    })
    .eq('decision_id', id)

  if (error) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { shareUrl: null } })
}
