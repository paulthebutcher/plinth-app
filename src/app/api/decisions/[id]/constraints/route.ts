import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'

const categories = [
  'technical',
  'budget',
  'timeline',
  'legal',
  'brand',
  'org',
  'other',
] as const

const severities = ['hard', 'soft'] as const

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const auth = await requireOrgContext()
  if (!auth.ok) {
    return auth.errorResponse
  }
  const { supabase } = auth

  const { data: decision } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', id)
    .eq('org_id', auth.orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const { data: constraints, error } = await supabase
    .from('constraints')
    .select('*')
    .eq('decision_id', id)

  if (error) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: constraints ?? [] })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const auth = await requireOrgContext()
  if (!auth.ok) {
    return auth.errorResponse
  }
  const { supabase } = auth

  const { data: decision } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', id)
    .eq('org_id', auth.orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const body = await request.json()
  const { category, description, severity } = body ?? {}

  if (!category || !categories.includes(category)) {
    return NextResponse.json(
      { error: { code: 'invalid_request', message: 'Invalid category' } },
      { status: 400 }
    )
  }

  if (!description || typeof description !== 'string') {
    return NextResponse.json(
      { error: { code: 'invalid_request', message: 'Invalid description' } },
      { status: 400 }
    )
  }

  if (!severity || !severities.includes(severity)) {
    return NextResponse.json(
      { error: { code: 'invalid_request', message: 'Invalid severity' } },
      { status: 400 }
    )
  }

  const { data: constraint, error } = await supabase
    .from('constraints')
    .insert({
      decision_id: id,
      category,
      description,
      severity,
    })
    .select('*')
    .single()

  if (error || !constraint) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error?.message ?? 'Insert failed' } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: constraint })
}
