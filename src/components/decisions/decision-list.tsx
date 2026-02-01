'use client'

import { DecisionCard } from './decision-card'
import { type Decision } from '@/types/decision'

interface DecisionListProps {
  decisions: Decision[]
  isLoading?: boolean
}

export function DecisionList({ decisions, isLoading = false }: DecisionListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`decision-skeleton-${index}`}
            className="h-36 animate-pulse rounded-lg border bg-background-subtle"
          />
        ))}
      </div>
    )
  }

  if (!decisions.length) {
    return (
      <div className="rounded-lg border bg-background-subtle p-12 text-center">
        <p className="text-sm text-foreground-muted">
          No decisions yet. Start by analyzing your first strategic decision.
        </p>
      </div>
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
