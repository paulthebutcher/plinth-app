import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { AnalysisProgress } from '@/components/analyze/analysis-progress'

const steps = [
  'frame',
  'context',
  'scanning',
  'options',
  'mapping',
  'scoring',
  'recommendation',
  'results',
] as const

type AnalysisStep = (typeof steps)[number]

const getCurrentStep = (pathname: string | null): AnalysisStep => {
  if (!pathname) return 'frame'
  const segment = pathname.split('?')[0].split('/').filter(Boolean).pop()
  return steps.includes(segment as AnalysisStep) ? (segment as AnalysisStep) : 'frame'
}

export default async function AnalyzeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single()

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, title, analysis_status')
    .eq('id', id)
    .eq('org_id', userData?.org_id)
    .single()

  if (!decision) notFound()

  const requestHeaders = await headers()
  const pathname =
    requestHeaders.get('x-nextjs-pathname') ??
    requestHeaders.get('x-pathname') ??
    requestHeaders.get('x-url') ??
    ''
  const currentStep = getCurrentStep(pathname)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-medium text-foreground">{decision.title}</h1>
        <AnalysisProgress
          currentStep={currentStep}
          analysisStatus={decision.analysis_status || 'draft'}
        />
      </div>
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  )
}
