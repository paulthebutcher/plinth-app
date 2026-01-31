import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type CreateDecisionBody } from '@/types/decision'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user and verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!userData?.org_id) {
      return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
    }

    // Get decisions for user's org
    const { data: decisions, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('org_id', userData.org_id)
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
    const supabase = await createClient()
    
    // Get current user and verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!userData?.org_id) {
      return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
    }

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
        org_id: userData.org_id,
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
