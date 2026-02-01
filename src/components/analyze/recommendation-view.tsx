'use client'

import Link from 'next/link'
import { Sparkles, TrendingUp, Shield, Swords, Cpu, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface RecommendationViewProps {
  optionTitle: string | null
  rationale: string | null
  confidence: number | null
  hedgeOptionTitle?: string | null
  hedgeCondition?: string | null
  decisionChangers: { condition: string; wouldFavor: string; likelihood: string }[]
  monitorTriggers: { signal: string; frequency: string; source?: string; threshold?: string }[]
  decisionId: string
}

const getConfidenceLabel = (value: number) => {
  if (value < 50) return 'Low'
  if (value <= 75) return 'Medium'
  return 'High'
}

const getChangeType = (condition: string) => {
  const lower = condition.toLowerCase()
  if (lower.includes('market') || lower.includes('demand')) return { label: 'Market', icon: TrendingUp }
  if (lower.includes('regulat') || lower.includes('compliance')) return { label: 'Regulatory', icon: Shield }
  if (lower.includes('competitor') || lower.includes('rival')) return { label: 'Competitive', icon: Swords }
  if (lower.includes('tech') || lower.includes('platform') || lower.includes('infrastructure')) {
    return { label: 'Tech', icon: Cpu }
  }
  return { label: 'Internal', icon: Users }
}

export function RecommendationView({
  optionTitle,
  rationale,
  confidence,
  hedgeOptionTitle,
  hedgeCondition,
  decisionChangers,
  monitorTriggers,
  decisionId,
}: RecommendationViewProps) {
  if (!optionTitle || !rationale) {
    return (
      <Card className="p-6 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-medium text-foreground">No recommendation yet</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          A recommendation will appear once scoring completes.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/analyze/${decisionId}/scanning`}>Run analysis</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Recommended option
            </p>
            <h3 className="text-2xl font-semibold text-foreground">{optionTitle}</h3>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span>Confidence</span>
              <span>{confidence ?? 0}% • {getConfidenceLabel(confidence ?? 0)}</span>
            </div>
            <Progress value={confidence ?? 0} />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-primary/60 bg-background p-6">
        <p className="text-sm text-foreground-muted italic">{rationale}</p>
      </Card>

      {hedgeOptionTitle ? (
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            Consider instead if...
          </p>
          <h4 className="mt-2 text-lg font-medium text-foreground">{hedgeOptionTitle}</h4>
          {hedgeCondition ? (
            <p className="mt-2 text-sm text-foreground-muted">{hedgeCondition}</p>
          ) : null}
        </Card>
      ) : null}

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-foreground">What would change this recommendation</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {decisionChangers.map((changer, index) => {
            const { label, icon: Icon } = getChangeType(changer.condition)
            return (
              <Card key={`${changer.condition}-${index}`} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground-muted">{label}</p>
                    <p className="text-sm text-foreground">{changer.condition}</p>
                    <p className="text-xs text-foreground-muted">
                      Would favor {changer.wouldFavor} • {changer.likelihood}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-foreground">Signals to watch</h4>
        <ul className="space-y-2 text-sm text-foreground-muted">
          {monitorTriggers.map((trigger, index) => (
            <li key={`${trigger.signal}-${index}`} className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{trigger.signal}</span>
              <span>({trigger.frequency})</span>
              {trigger.threshold ? <span>• {trigger.threshold}</span> : null}
              {trigger.source ? <span className="text-foreground-muted">• {trigger.source}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
