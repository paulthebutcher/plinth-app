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
    <Card className="border border-border p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Analysis Progress</span>
        <span className="text-sm font-semibold text-primary">{Math.round(normalizedProgress)}%</span>
      </div>
      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const nextThreshold = STEPS[index + 1]?.threshold ?? 100
          const isCompleted = normalizedProgress >= nextThreshold
          const isCurrent =
            normalizedProgress >= step.threshold && normalizedProgress < nextThreshold

          let icon = <Circle className="h-4 w-4 text-gray-300" />
          if (isCompleted) {
            icon = <Check className="h-4 w-4 text-green-500" />
          } else if (isCurrent) {
            icon = <Loader2 className="h-4 w-4 animate-spin text-primary" />
          }

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                isCompleted ? 'border-green-500 bg-green-50' :
                isCurrent ? 'border-primary bg-primary/10' :
                'border-gray-200 bg-gray-50'
              }`}>
                {icon}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${
                  isCompleted ? 'font-medium text-green-700' :
                  isCurrent ? 'font-medium text-foreground' :
                  'text-gray-400'
                }`}>{step.label}</div>
                {isCurrent ? (
                  <div className="text-xs text-primary">
                    {status === 'failed' ? 'Paused' : 'Processing...'}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
