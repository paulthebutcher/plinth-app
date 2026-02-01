'use client'

import { FileQuestion } from 'lucide-react'

import { DecisionCard } from './decision-card'
import { NewDecisionButton } from './new-decision-button'
import { Card } from '@/components/ui/card'
import { type Decision } from '@/types/decision'

interface DecisionListProps {
  decisions: Decision[]
  isLoading?: boolean
  onCreated?: (decision: Decision) => void
}

export function DecisionList({
  decisions,
  isLoading = false,
  onCreated,
}: DecisionListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={`decision-skeleton-${index}`}
            className="h-36 animate-pulse border border-border bg-background-subtle"
          />
        ))}
      </div>
    )
  }

  if (!decisions.length) {
    return (
      <Card className="flex flex-col items-center gap-4 border-dashed p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-muted text-foreground-muted">
          <FileQuestion className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">No decisions yet</h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Start by analyzing your first strategic decision. We’ll help you
            structure the evidence and recommendation.
          </p>
        </div>
        <NewDecisionButton onCreated={onCreated} />
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} />
      ))}
    </div>
  )
}
