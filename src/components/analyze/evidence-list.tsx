'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ExternalLink, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export interface EvidenceListItem {
  id: string
  claim: string
  snippet: string | null
  sourceUrl: string | null
  sourceTitle: string | null
  extractedAt: string | null
  relevanceScore: number | null
  relevanceAssessment: 'supporting' | 'contradicting' | 'unknown' | null
}

interface EvidenceListProps {
  evidence: EvidenceListItem[]
  decisionId: string
}

const getDomain = (url?: string | null) => {
  if (!url) return 'Unknown'
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'Unknown'
  }
}

const getFreshness = (date?: string | null) => {
  if (!date) return 'Older'
  const ageDays = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  if (ageDays <= 30) return 'Fresh'
  if (ageDays <= 90) return 'Recent'
  return 'Older'
}

export function EvidenceList({ evidence, decisionId }: EvidenceListProps) {
  const [filter, setFilter] = useState<'all' | 'supporting' | 'contradicting'>('all')
  const filtered = useMemo(() => {
    if (filter === 'all') return evidence
    return evidence.filter((item) => item.relevanceAssessment === filter)
  }, [evidence, filter])

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
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList className="gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="supporting">Supporting</TabsTrigger>
          <TabsTrigger value="contradicting">Contradicting</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.map((card) => {
        const freshness = getFreshness(card.extractedAt)
        const domain = getDomain(card.sourceUrl)
        return (
          <Card key={card.id} className="p-4">
            <Collapsible>
              <CollapsibleTrigger>
                <div className="space-y-3">
                  <p className="line-clamp-2 text-sm text-foreground">{card.claim}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="subtle">{domain}</Badge>
                    <Badge variant="subtle">Relevance {card.relevanceScore ?? '—'}</Badge>
                    <Badge variant="outline">{freshness}</Badge>
                    {card.sourceUrl ? (
                      <Link
                        href={card.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-primary hover:underline"
                      >
                        Source
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3 text-sm text-foreground-muted">
                <p>{card.snippet ?? 'Snippet unavailable.'}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="subtle">
                    Assessment {card.relevanceAssessment ?? 'unknown'}
                  </Badge>
                  <Badge variant="subtle">
                    Relevance {card.relevanceScore ?? '—'}
                  </Badge>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
