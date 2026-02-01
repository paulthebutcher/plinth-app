'use client'

import { Card } from '@/components/ui/card'
import { Layers } from 'lucide-react'

export function OptionsPlaceholder() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Layers className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">
            Generated options with scores will appear here.
          </h3>
          <p className="text-sm text-foreground-muted">Coming in next phase.</p>
          <div className="space-y-2">
            <div className="h-16 rounded-xl border border-border bg-background-subtle" />
            <div className="h-16 rounded-xl border border-border bg-background-subtle" />
            <div className="h-16 rounded-xl border border-border bg-background-subtle" />
          </div>
        </div>
      </div>
    </Card>
  )
}
