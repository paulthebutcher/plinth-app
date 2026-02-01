import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BriefSection } from '@/components/outputs/brief-section'
import { EvidenceCitation } from '@/components/outputs/evidence-citation'
import { DecisionChangersList } from '@/components/outputs/decision-changers-list'
import { BriefEditorPanel } from '@/components/outputs/brief-editor-panel'
import { SharePanel } from '@/components/outputs/share-panel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const sectionOrder = [
  { key: 'recommendation', title: 'Recommendation' },
  { key: 'framing', title: 'Framing' },
  { key: 'optionsConsidered', title: 'Options Considered' },
  { key: 'evidenceSummary', title: 'Evidence Summary' },
  { key: 'assumptionsLedger', title: 'Assumptions Ledger' },
  { key: 'openQuestions', title: 'Open Questions' },
  { key: 'metadata', title: 'Metadata' },
] as const

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, title')
    .eq('id', id)
    .single()

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, sections, citations, generated_at, is_edited, markdown, is_shared, share_key')
    .eq('decision_id', id)
    .maybeSingle()

  if (!brief || !decision) {
    return (
      <Card className="max-w-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground">Analysis not complete</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          The decision brief is not available yet. Return to results to continue analysis.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/analyze/${id}/results`}>Back to results</Link>
        </Button>
      </Card>
    )
  }

  const sections = brief.sections as Record<string, string>
  const citations = (brief.citations as Array<{
    id: string
    url: string
    title: string
    accessedAt: string
    snippetHash: string
  }>) ?? []

  return (
    <div className="space-y-6">
      <BriefEditorPanel
        decisionId={id}
        title={decision.title}
        generatedAt={brief.generated_at}
        isEdited={brief.is_edited ?? false}
        markdown={brief.markdown ?? ''}
      />

      <SharePanel
        decisionId={id}
        isShared={brief.is_shared ?? false}
        shareUrl={brief.share_key ? `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/share/${brief.share_key}` : ''}
      />

      <div className="space-y-4">
        {sectionOrder.map((section, index) => {
          const content = sections?.[section.key]
          if (!content) return null
          return (
            <BriefSection
              key={section.key}
              title={section.title}
              content={content}
              defaultOpen={index === 0}
            />
          )
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Decision Changers</h3>
        <DecisionChangersList decisionId={id} />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium text-foreground">Citations</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {citations.map((citation, index) => (
            <EvidenceCitation
              key={citation.id}
              id={citation.id}
              index={index + 1}
              url={citation.url}
            />
          ))}
        </div>
        <div className="mt-4 space-y-2 text-xs text-foreground-muted">
          {citations.map((citation) => (
            <div key={citation.id} id={`citation-${citation.id}`} className="rounded-md border border-border bg-background p-3">
              <div className="text-xs font-medium text-foreground">[{citation.id}] {citation.title}</div>
              <div className="mt-1">{citation.url}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
