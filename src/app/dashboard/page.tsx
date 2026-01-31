import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's org_id
  const { data: userData } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user!.id)
    .single()

  // Get decisions for user's org
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('org_id', userData?.org_id!)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-semibold">Decisions</h1>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          <Sparkles className="h-4 w-4" />
          Analyze a Decision
        </Link>
      </div>

      {decisions?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="rounded-lg border bg-background p-5 hover:border-foreground-muted"
            >
              <h3 className="text-lg font-medium">{decision.title}</h3>
              <div className="mt-4 flex items-center gap-2 text-sm text-foreground-muted">
                <span>Status: {decision.analysis_status}</span>
                <span>•</span>
                <span>Updated {new Date(decision.updated_at!).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-background-subtle p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-lg font-medium">No decisions yet</h3>
          <p className="mt-2 text-sm text-foreground-muted">
            Create your first decision analysis to get started.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            <Sparkles className="h-4 w-4" />
            Start Analysis
          </Link>
        </div>
      )}
    </div>
  )
}
