import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

type OrgContextSuccess = {
  ok: true
  supabase: Awaited<ReturnType<typeof createClient>>
  user: User
  orgId: string
}

type OrgContextFailure = {
  ok: false
  errorResponse: NextResponse
}

export type OrgContextResult = OrgContextSuccess | OrgContextFailure

export async function requireOrgContext(): Promise<OrgContextResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      ),
    }
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'User not found' } },
        { status: 401 }
      ),
    }
  }

  if (!userData.org_id) {
    return {
      ok: false,
      errorResponse: NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'User has no organization' } },
        { status: 401 }
      ),
    }
  }

  return { ok: true, supabase, user, orgId: userData.org_id }
}
