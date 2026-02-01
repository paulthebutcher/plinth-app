'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface RecommendationViewProps {
  optionTitle: string | null
  rationale: string | null
  confidence: number | null
  decisionId: string
}

export function RecommendationView({
  optionTitle,
  rationale,
  confidence,
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
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">{optionTitle}</h3>
          <p className="text-sm text-foreground-muted">{rationale}</p>
        </div>
        <Badge variant="subtle">
          Confidence {confidence ?? 0}%
        </Badge>
      </div>
    </Card>
  )
}
