'use client'

import Link from 'next/link'
import { type Decision } from '@/types/decision'

const analyzingSteps = [
  'framing',
  'context',
  'scanning',
  'options',
  'mapping',
  'scoring',
  'recommending',
] as const

type DecisionState = 'draft' | 'analyzing' | 'analyzed'

const statusStyles: Record<DecisionState, string> = {
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
  analyzing: 'border-blue-200 bg-blue-50 text-blue-700',
  analyzed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const statusLabels: Record<DecisionState, string> = {
  draft: 'draft',
  analyzing: 'analyzing',
  analyzed: 'analyzed',
}

const getDecisionState = (analysisStatus?: Decision['analysis_status']): DecisionState => {
  if (analysisStatus === 'complete') {
    return 'analyzed'
  }
  if (analysisStatus && analysisStatus !== 'draft') {
    return 'analyzing'
  }
  return 'draft'
}

const getDecisionHref = (decision: Decision, state: DecisionState) => {
  if (state === 'draft') {
    return `/analyze/${decision.id}/frame`
  }
  if (state === 'analyzed') {
    return `/decisions/${decision.id}`
  }
  return `/analyze/${decision.id}/progress`
}

const getProgress = (analysisStatus?: Decision['analysis_status']) => {
  if (!analysisStatus) {
    return null
  }
  const stepIndex = analyzingSteps.indexOf(analysisStatus as (typeof analyzingSteps)[number])
  if (stepIndex === -1) {
    return null
  }
  const total = analyzingSteps.length
  const current = stepIndex + 1
  const percent = Math.round((current / total) * 100)
  return { current, total, percent }
}

export function DecisionCard({ decision }: { decision: Decision }) {
  const state = getDecisionState(decision.analysis_status ?? undefined)
  const href = getDecisionHref(decision, state)
  const progress = state === 'analyzing' ? getProgress(decision.analysis_status ?? undefined) : null
  const updatedAt = decision.updated_at ?? decision.created_at

  return (
    <Link
      href={href}
      className="block rounded-xl border border-border bg-background p-5 shadow-sm transition hover:border-foreground-muted hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium">{decision.title || 'Untitled decision'}</h3>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[state]}`}
        >
          {statusLabels[state]}
        </span>
      </div>

      {progress ? (
        <div className="mt-4 space-y-2 text-sm text-foreground-muted">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-foreground-muted">
            <span>Analysis progress</span>
            <span>
              Step {progress.current} of {progress.total}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-background-subtle">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 text-sm text-foreground-muted">
        Updated {updatedAt ? new Date(updatedAt).toLocaleDateString() : 'recently'}
      </div>
    </Link>
  )
}
