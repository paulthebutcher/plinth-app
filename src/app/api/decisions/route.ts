import { NextResponse } from 'next/server'
import { type CreateDecisionBody } from '@/types/decision'
import { requireOrgContext } from '@/lib/auth/require-org-context'

export async function GET() {
  try {
    const auth = await requireOrgContext()
    if (!auth.ok) {
      return auth.errorResponse
    }
    const { supabase } = auth

    // Get decisions for user's org
    const { data: decisions, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('org_id', auth.orgId)
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
    const auth = await requireOrgContext()
    if (!auth.ok) {
      return auth.errorResponse
    }
    const { supabase, user } = auth

    const body: CreateDecisionBody = await request.json()

    // Create new decision
    const { data: decision, error } = await supabase
      .from('decisions')
      .insert({
        title: body.title,
        decision_type: body.decision_type,
        time_horizon: body.time_horizon,
        status: 'draft',
        analysis_status: 'draft',
        org_id: auth.orgId,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(decision)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
