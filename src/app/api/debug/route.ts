// TEMPORARY DEBUG ENDPOINT - DELETE AFTER FIXING
// Hit this at /api/debug to see what's wrong

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    recommendations: [],
  }

  try {
    const supabase = await createClient()

    // 1. Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    diagnostics.checks = {
      ...diagnostics.checks as object,
      auth: {
        authenticated: !!user,
        userId: user?.id || null,
        email: user?.email || null,
        error: authError?.message || null,
      },
    }

    if (!user) {
      (diagnostics.errors as string[]).push('Not authenticated - no user session')
      ;(diagnostics.recommendations as string[]).push('Log in first, then hit this endpoint')
      return NextResponse.json(diagnostics)
    }

    // 2. Check if users table exists and has org_id column
    const { data: columns, error: columnsError } = await supabase
      .from('users')
      .select('*')
      .limit(0)

    if (columnsError) {
      (diagnostics.errors as string[]).push(`Users table error: ${columnsError.message}`)
      if (columnsError.message.includes('does not exist')) {
        ;(diagnostics.recommendations as string[]).push('Run the database migrations - users table is missing')
      }
    }

    // 3. Check if user exists in users table
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    diagnostics.checks = {
      ...diagnostics.checks as object,
      userRecord: {
        exists: !!userRow,
        data: userRow,
        error: userError?.message || null,
      },
    }

    if (userError) {
      (diagnostics.errors as string[]).push(`User lookup error: ${userError.message}`)
    }

    if (!userRow) {
      (diagnostics.errors as string[]).push('User authenticated but NO ROW in users table')
      ;(diagnostics.recommendations as string[]).push(
        `Run this SQL: INSERT INTO users (id, email, role) VALUES ('${user.id}', '${user.email}', 'admin');`
      )
    } else if (!userRow.org_id) {
      (diagnostics.errors as string[]).push('User exists but org_id is NULL')
      ;(diagnostics.recommendations as string[]).push(
        'User needs to be linked to an organization'
      )
    }

    // 4. Check if organizations table exists and has data
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('*')

    diagnostics.checks = {
      ...diagnostics.checks as object,
      organizations: {
        count: orgs?.length || 0,
        data: orgs,
        error: orgsError?.message || null,
      },
    }

    if (orgsError) {
      (diagnostics.errors as string[]).push(`Organizations error: ${orgsError.message}`)
      if (orgsError.message.includes('does not exist')) {
        ;(diagnostics.recommendations as string[]).push('Run the database migrations - organizations table is missing')
      }
    }

    if (!orgs || orgs.length === 0) {
      (diagnostics.errors as string[]).push('No organizations exist')
      ;(diagnostics.recommendations as string[]).push(
        "Run this SQL: INSERT INTO organizations (name, slug, plan) VALUES ('My Organization', 'my-org', 'trial');"
      )
    }

    // 5. If user exists but no org, and orgs exist, recommend linking
    if (userRow && !userRow.org_id && orgs && orgs.length > 0) {
      ;(diagnostics.recommendations as string[]).push(
        `Run this SQL: UPDATE users SET org_id = '${orgs[0].id}' WHERE id = '${user.id}';`
      )
    }

    // 6. Check decisions table
    const { error: decisionsError } = await supabase
      .from('decisions')
      .select('id')
      .limit(1)

    diagnostics.checks = {
      ...diagnostics.checks as object,
      decisionsTable: {
        accessible: !decisionsError,
        error: decisionsError?.message || null,
      },
    }

    if (decisionsError) {
      (diagnostics.errors as string[]).push(`Decisions table error: ${decisionsError.message}`)
    }

    // Summary
    const errorCount = (diagnostics.errors as string[]).length
    diagnostics.summary = errorCount === 0
      ? '✅ All checks passed! Auth should work.'
      : `❌ Found ${errorCount} issue(s) - see recommendations`

  } catch (error) {
    diagnostics.unexpectedError = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
