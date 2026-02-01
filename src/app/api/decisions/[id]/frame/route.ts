import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const decisionTypes = [
  'product_bet',
  'market_entry',
  'investment',
  'platform',
  'org_model',
] as const

const timeHorizons = [
  '3-6_months',
  '6-12_months',
  '1-2_years',
  '2+_years',
] as const

const isValidScore = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  if (!userData.org_id) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Not authenticated' } },
      { status: 401 }
    )
  }

  const { data: decision } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', id)
    .eq('org_id', userData.org_id)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const body = await request.json()
  const updateData: Record<string, unknown> = {}

  if ('title' in body) {
    updateData.title = body.title
  }

  if ('decision_frame' in body) {
    updateData.decision_frame = body.decision_frame
  }

  if ('decision_type' in body) {
    if (!decisionTypes.includes(body.decision_type)) {
      return NextResponse.json(
        { error: { code: 'invalid_request', message: 'Invalid decision_type' } },
        { status: 400 }
      )
    }
    updateData.decision_type = body.decision_type
  }

  if ('time_horizon' in body) {
    if (!timeHorizons.includes(body.time_horizon)) {
      return NextResponse.json(
        { error: { code: 'invalid_request', message: 'Invalid time_horizon' } },
        { status: 400 }
      )
    }
    updateData.time_horizon = body.time_horizon
  }

  if ('reversibility' in body) {
    if (!isValidScore(body.reversibility)) {
      return NextResponse.json(
        { error: { code: 'invalid_request', message: 'Invalid reversibility' } },
        { status: 400 }
      )
    }
    updateData.reversibility = body.reversibility
  }

  if ('stakes' in body) {
    if (!isValidScore(body.stakes)) {
      return NextResponse.json(
        { error: { code: 'invalid_request', message: 'Invalid stakes' } },
        { status: 400 }
      )
    }
    updateData.stakes = body.stakes
  }

  if ('scope' in body) {
    if (!isValidScore(body.scope)) {
      return NextResponse.json(
        { error: { code: 'invalid_request', message: 'Invalid scope' } },
        { status: 400 }
      )
    }
    updateData.scope = body.scope
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ data: decision })
  }

  if (!decision.analysis_status || decision.analysis_status === 'draft') {
    updateData.analysis_status = 'framing'
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
