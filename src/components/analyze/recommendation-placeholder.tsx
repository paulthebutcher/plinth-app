'use client'

import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function RecommendationPlaceholder() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            The AI recommendation will appear here with confidence score and conditions.
          </h3>
          <p className="text-sm text-foreground-muted">Coming in next phase.</p>
          <div className="rounded-xl border border-border bg-background-subtle p-4">
            <div className="h-4 w-1/2 rounded-full bg-background-muted" />
            <div className="mt-3 h-3 w-3/4 rounded-full bg-background-muted" />
            <div className="mt-2 h-3 w-2/3 rounded-full bg-background-muted" />
          </div>
        </div>
      </div>
    </Card>
  )
}
