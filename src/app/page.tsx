import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Show marketing landing for unauthenticated users
  return (
    <div className="min-h-screen hero-bg">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Make Better Strategic Decisions
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          AI-powered decision analysis for executives. Frame decisions, gather evidence,
          and get data-driven recommendations.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/login"
            className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
  // Redirect unauthenticated users to login
  redirect('/login')
}
