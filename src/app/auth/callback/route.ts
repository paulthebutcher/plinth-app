import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function redirectTo(origin: string, path: string, params?: Record<string, string>) {
  const url = new URL(origin)
  url.pathname = path
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  }
  return NextResponse.redirect(url)
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  const supabase = await createClient()

  if (!code) {
    return redirectTo(requestUrl.origin, '/login', { error: 'No code provided' })
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return redirectTo(requestUrl.origin, '/login', { error: error.message })
  }

  // If this is a signup, create organization + user rows
  if (type === 'signup') {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    if (userErr || !user) {
      return redirectTo(requestUrl.origin, '/login', { error: 'Failed to load user after signup' })
    }

    const slugBase = user.email?.split('@')[0] || 'my-org'

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'My Organization',
        slug: slugBase,
        plan: 'trial',
      })
      .select()
      .single()

    if (orgError || !org) {
      console.error('Error creating organization:', orgError)
      return redirectTo(requestUrl.origin, '/login', { error: 'Failed to create organization' })
    }

    const { error: userRowError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      org_id: org.id,
      role: 'admin',
    })

    if (userRowError) {
      console.error('Error creating user:', userRowError)
      return redirectTo(requestUrl.origin, '/login', { error: 'Failed to create user' })
    }

    return redirectTo(requestUrl.origin, '/onboarding')
  }

  if (type === 'recovery') {
    return redirectTo(requestUrl.origin, '/reset-password')
  }

  return redirectTo(requestUrl.origin, '/')
}