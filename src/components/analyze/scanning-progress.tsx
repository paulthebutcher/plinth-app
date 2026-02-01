'use client'

import { Check, Loader2, Circle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ScanningProgressProps {
  progress: number
  status: string
}

const STEPS = [
  { key: 'planning', label: 'Planning research queries', threshold: 5 },
  { key: 'searching', label: 'Searching for evidence', threshold: 20 },
  { key: 'extracting', label: 'Extracting insights', threshold: 40 },
  { key: 'options', label: 'Generating options', threshold: 55 },
  { key: 'mapping', label: 'Mapping evidence to options', threshold: 70 },
  { key: 'scoring', label: 'Scoring options', threshold: 85 },
  { key: 'recommending', label: 'Generating recommendation', threshold: 95 },
] as const

export function ScanningProgress({ progress, status }: ScanningProgressProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const nextThreshold = STEPS[index + 1]?.threshold ?? 100
          const isCompleted = normalizedProgress >= nextThreshold
          const isCurrent =
            normalizedProgress >= step.threshold && normalizedProgress < nextThreshold

          let icon = <Circle className="h-4 w-4 text-foreground-muted" />
          if (isCompleted) {
            icon = <Check className="h-4 w-4 text-primary" />
          } else if (isCurrent) {
            icon = <Loader2 className="h-4 w-4 animate-spin text-primary" />
          }

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                {icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{step.label}</div>
                {isCurrent ? (
                  <div className="text-xs text-foreground-muted">
                    {status === 'failed' ? 'Paused' : 'In progress'}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
        <div className="h-2 w-full overflow-hidden rounded-full bg-background-subtle">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${normalizedProgress}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
