import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        \`\${requestUrl.origin}/login?error=\${error.message}\`
      )
    }

    // If this is a signup, create organization
    if (type === 'signup') {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Create organization
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: 'My Organization',
            slug: user.email?.split('@')[0] || 'my-org',
            plan: 'trial',
          })
          .select()
          .single()

        if (orgError) {
          console.error('Error creating organization:', orgError)
          return NextResponse.redirect(
            \`\${requestUrl.origin}/login?error=Failed to create organization\`
          )
        }

        // Link user to organization
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            org_id: org.id,
            role: 'admin',
          })

        if (userError) {
          console.error('Error creating user:', userError)
          return NextResponse.redirect(
            \`\${requestUrl.origin}/login?error=Failed to create user\`
          )
        }

        return NextResponse.redirect(\`\${requestUrl.origin}/onboarding\`)
      }
    }

    // For password reset, redirect to reset page
    if (type === 'recovery') {
      return NextResponse.redirect(\`\${requestUrl.origin}/reset-password\`)
    }

    // Default redirect to home
    return NextResponse.redirect(requestUrl.origin)
  }

  // No code or error, redirect to login
  return NextResponse.redirect(\`\${requestUrl.origin}/login?error=No code provided\`)
}
