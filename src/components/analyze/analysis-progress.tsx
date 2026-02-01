'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

type AnalysisStep =
  | 'frame'
  | 'context'
  | 'scanning'
  | 'options'
  | 'mapping'
  | 'scoring'
  | 'recommendation'
  | 'results'

interface AnalysisProgressProps {
  currentStep: AnalysisStep
  analysisStatus: string
}

const steps = [
  { key: 'frame', label: 'Frame', statusKey: 'framing', isAi: false },
  { key: 'context', label: 'Context', statusKey: 'context', isAi: false },
  { key: 'scanning', label: 'Scan', statusKey: 'scanning', isAi: true },
  { key: 'options', label: 'Options', statusKey: 'options', isAi: true },
  { key: 'mapping', label: 'Map', statusKey: 'mapping', isAi: true },
  { key: 'scoring', label: 'Score', statusKey: 'scoring', isAi: true },
  { key: 'recommendation', label: 'Recommend', statusKey: 'recommending', isAi: true },
] as const

const statusOrder = [
  'draft',
  'framing',
  'context',
  'scanning',
  'options',
  'mapping',
  'scoring',
  'recommending',
  'complete',
]

const getStepFromPath = (pathname: string | null): AnalysisStep | null => {
  if (!pathname) return null
  const segment = pathname.split('?')[0].split('/').filter(Boolean).pop()
  if (
    segment === 'frame' ||
    segment === 'context' ||
    segment === 'scanning' ||
    segment === 'options' ||
    segment === 'mapping' ||
    segment === 'scoring' ||
    segment === 'recommendation' ||
    segment === 'results'
  ) {
    return segment
  }
  return null
}

export function AnalysisProgress({ currentStep, analysisStatus }: AnalysisProgressProps) {
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const derivedStep = getStepFromPath(pathname)
  const rawStep = derivedStep ?? currentStep
  const activeStep = rawStep === 'results' ? 'recommendation' : rawStep

  const statusRank = Math.max(statusOrder.indexOf(analysisStatus), 0)

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-6">
        {steps.map((step, index) => {
          const stepRank = statusOrder.indexOf(step.statusKey)
          const isCompleted = statusRank > stepRank
          const isCurrent = activeStep === step.key
          const isContextClickable = step.key === 'context' && statusRank >= statusOrder.indexOf('context')
          const isAiClickable = step.isAi && statusRank > stepRank
          const isClickable = step.key === 'frame' || isContextClickable || isAiClickable
          const isDisabled = step.isAi && statusRank < stepRank

          const baseCircle = 'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold'
          const circleClasses = isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : isCurrent
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background text-foreground-muted'

          const labelClasses = isDisabled
            ? 'text-xs font-medium text-foreground-muted'
            : 'text-xs font-medium text-foreground'

          const content = (
            <div className="flex flex-col items-center gap-2">
              <div className={`${baseCircle} ${circleClasses}`}>
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={labelClasses}>{step.label}</span>
            </div>
          )

          if (isClickable && params?.id) {
            return (
              <Link
                key={step.key}
                href={`/analyze/${params.id}/${step.key}`}
                className={isDisabled ? 'pointer-events-none opacity-50' : 'transition hover:opacity-90'}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {content}
              </Link>
            )
          }

          return (
            <div
              key={step.key}
              className={isDisabled ? 'opacity-50' : undefined}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
