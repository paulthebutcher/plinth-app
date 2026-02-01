'use client'
import Link from 'next/link'
import { Layers, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

type ScoreBreakdown = {
  evidenceStrength?: number
  evidenceRecency?: number
  sourceReliability?: number
  corroboration?: number
  constraintFit?: number
  assumptionRisk?: number
}

export interface OptionListItem {
  id: string
  title: string
  summary: string | null
  score: number | null
  scoreBreakdown?: ScoreBreakdown
  commitsTo?: string[]
  deprioritizes?: string[]
}

interface OptionsListProps {
  options: OptionListItem[]
  evidence: { id: string; claim: string; sourceUrl: string | null }[]
  mappings: { optionId: string; evidenceId: string; relationship: 'supporting' | 'contradicting' | 'unknown' }[]
  decisionId: string
}

const factorLabels = [
  { key: 'evidenceStrength', label: 'Evidence strength' },
  { key: 'constraintFit', label: 'Execution feasibility' },
  { key: 'assumptionRisk', label: 'Risk profile' },
  { key: 'evidenceRecency', label: 'Time to value' },
  { key: 'sourceReliability', label: 'Resource efficiency' },
  { key: 'corroboration', label: 'Strategic alignment' },
] as const

export function OptionsList({ options, evidence, mappings, decisionId }: OptionsListProps) {
  const topScore = Math.max(...options.map((o) => o.score ?? 0), 0)

  if (!options.length) {
    return (
      <Card className="p-6 text-center">
        <Layers className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-medium text-foreground">No options yet</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Options will show up once the analysis pipeline completes.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/analyze/${decisionId}/scanning`}>Run analysis</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const optionMappings = mappings.filter((m) => m.optionId === option.id)
        const supporting = optionMappings.filter((m) => m.relationship === 'supporting').length
        const contradicting = optionMappings.filter((m) => m.relationship === 'contradicting').length
        const linkedEvidence = optionMappings.map((m) => ({
          ...m,
          evidence: evidence.find((e) => e.id === m.evidenceId),
        }))
        const isRecommended = option.score !== null && option.score === topScore
        const breakdown = option.scoreBreakdown ?? {}

        return (
          <Card key={option.id} className={isRecommended ? 'border-primary/40 bg-primary/5 p-4' : 'p-4'}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-foreground">{option.title}</h4>
                  {isRecommended ? <Badge>Recommended</Badge> : null}
                </div>
                <p className="text-sm text-foreground-muted line-clamp-3">{option.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-foreground">
                  {option.score ?? '—'}
                  <span className="text-sm text-foreground-muted">/100</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {factorLabels.map((factor) => (
                <div key={factor.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>{factor.label}</span>
                    <span>{Math.round((breakdown[factor.key] ?? 0) as number)}</span>
                  </div>
                  <Progress value={breakdown[factor.key] ?? 0} />
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-foreground">Commits to</p>
                <ul className="mt-2 space-y-1 text-xs text-foreground-muted">
                  {(option.commitsTo ?? []).slice(0, 3).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Deprioritizes</p>
                <ul className="mt-2 space-y-1 text-xs text-foreground-muted">
                  {(option.deprioritizes ?? []).slice(0, 3).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Collapsible className="mt-4">
              <CollapsibleTrigger className="flex items-center gap-2 text-xs text-foreground-muted">
                <span>{supporting} supporting, {contradicting} contradicting</span>
                <ChevronDown className="h-3 w-3" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2 text-xs text-foreground-muted">
                {linkedEvidence.slice(0, 6).map((item) => (
                  <div key={`${item.evidenceId}-${item.relationship}`} className="flex items-start justify-between gap-3">
                    <span className="flex-1">{item.evidence?.claim ?? 'Evidence unavailable'}</span>
                    {item.evidence?.sourceUrl ? (
                      <Link href={item.evidence.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        Source
                      </Link>
                    ) : null}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
