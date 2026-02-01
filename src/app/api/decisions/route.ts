import { NextResponse } from 'next/server'
import { type CreateDecisionBody } from '@/types/decision'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function GET() {
  try {
    const ctx = await requireOrgContext()
    if (!ctx.ok) {
      return ctx.errorResponse
    }
    const { supabase, orgId } = ctx

    // Get decisions for user's org
    const { data: decisions, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('org_id', orgId)
      .order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(decisions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('[POST /api/decisions] Starting...')

    const ctx = await requireOrgContext()
    if (!ctx.ok) {
      console.log('[POST /api/decisions] Auth failed')
      return ctx.errorResponse
    }
    const { supabase, orgId, user } = ctx
    console.log('[POST /api/decisions] User:', user.id, 'Org:', orgId)

    const body: CreateDecisionBody = await request.json()
    console.log('[POST /api/decisions] Body:', body)

    // Create new decision - only include fields that are provided
    const insertData: Record<string, unknown> = {
      title: body.title,
      status: 'draft',
      analysis_status: 'draft',
      org_id: orgId,
      owner_id: user.id,
    }

    // Only add optional fields if provided
    if (body.decision_type) insertData.decision_type = body.decision_type
    if (body.time_horizon) insertData.time_horizon = body.time_horizon

    console.log('[POST /api/decisions] Inserting:', insertData)
    const { data: decision, error } = await supabase
      .from('decisions')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('[POST /api/decisions] DB error:', error)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    console.log('[POST /api/decisions] Created:', decision.id)
    return NextResponse.json(decision)
  } catch (error) {
    console.error('[POST /api/decisions] Unexpected error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
