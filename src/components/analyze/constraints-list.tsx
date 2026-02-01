'use client'

import { Trash2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface Constraint {
  id: string
  category: string | null
  description: string
  severity: string | null
}

interface ConstraintsListProps {
  constraints: Constraint[]
  onDelete: (id: string) => void
  onAdd: () => void
}

const categoryStyles: Record<string, string> = {
  technical: 'border-primary/20 bg-primary/10 text-primary',
  budget: 'border-foreground/10 bg-foreground/5 text-foreground',
  timeline: 'border-border bg-muted text-foreground',
  legal: 'border-destructive/20 bg-destructive/10 text-destructive',
  brand: 'border-primary/20 bg-primary/10 text-primary',
  org: 'border-border bg-muted text-foreground',
  other: 'border-foreground/10 bg-foreground/5 text-foreground',
}

const categoryLabels: Record<string, string> = {
  technical: 'Technical',
  budget: 'Budget',
  timeline: 'Timeline',
  legal: 'Legal',
  brand: 'Brand',
  org: 'Org',
  other: 'Other',
}

export function ConstraintsList({ constraints, onDelete, onAdd }: ConstraintsListProps) {
  if (!constraints.length) {
    return (
      <Card className="p-6 text-center">
        <List className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-medium text-foreground">No constraints added</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Capture the guardrails that this decision has to respect.
        </p>
        <Button className="mt-4" onClick={onAdd}>
          Add Constraint
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {constraints.map((constraint) => {
        const categoryKey = constraint.category ?? 'other'
        const categoryClass = categoryStyles[categoryKey] ?? categoryStyles.other
        const categoryLabel = categoryLabels[categoryKey] ?? 'Other'
        const severityLabel = constraint.severity === 'hard' ? 'Must have' : 'Nice to have'

        return (
          <Card key={constraint.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${categoryClass}`}
                  >
                    {categoryLabel}
                  </span>
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                    {severityLabel}
                  </span>
                </div>
                <p className="text-sm text-foreground">{constraint.description}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDelete(constraint.id)}
                aria-label="Delete constraint"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )
      })}

      <Button variant="outline" onClick={onAdd}>
        Add Constraint
      </Button>
    </div>
  )
}
