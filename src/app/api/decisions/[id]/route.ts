import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
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

  return NextResponse.json({ data: decision })
}

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
  const allowedFields = [
    'title',
    'decision_frame',
    'context',
    'status',
    'deadline',
    'urgency',
  ] as const

  const updateData: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field]
    }
  }

  if (!Object.keys(updateData).length) {
    return NextResponse.json({ data: decision })
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

export async function DELETE(
  _request: NextRequest,
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

  const { error } = await supabase
    .from('decisions')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: { code: 'server_error', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: { success: true } })
}
