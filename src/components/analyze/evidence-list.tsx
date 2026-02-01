'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface EvidenceListItem {
  id: string
  claim: string
  sourceUrl: string | null
  sourceTitle: string | null
  relevanceScore: number | null
}

interface EvidenceListProps {
  evidence: EvidenceListItem[]
  decisionId: string
}

export function EvidenceList({ evidence, decisionId }: EvidenceListProps) {
  if (!evidence.length) {
    return (
      <Card className="p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-medium text-foreground">No evidence yet</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Evidence cards will appear here once analysis completes.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/analyze/${decisionId}/scanning`}>Run analysis</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {evidence.map((card) => (
        <Card key={card.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">{card.claim}</p>
              {card.sourceUrl ? (
                <Link
                  href={card.sourceUrl}
                  className="text-xs text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {card.sourceTitle ?? card.sourceUrl}
                </Link>
              ) : null}
            </div>
            <Badge variant="subtle">
              Relevance {card.relevanceScore ?? '—'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}
