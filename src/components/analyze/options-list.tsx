'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface OptionListItem {
  id: string
  title: string
  summary: string | null
  score: number | null
}

interface OptionsListProps {
  options: OptionListItem[]
  decisionId: string
}

export function OptionsList({ options, decisionId }: OptionsListProps) {
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
      {options.map((option) => (
        <Card key={option.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">{option.title}</h4>
              <p className="text-sm text-foreground-muted">{option.summary}</p>
            </div>
            <Badge variant="subtle">
              Score {option.score ?? '—'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}
