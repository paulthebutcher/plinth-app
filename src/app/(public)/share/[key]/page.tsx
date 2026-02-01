import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BriefSection } from '@/components/outputs/brief-section'
import { Card } from '@/components/ui/card'

const sectionOrder = [
  { key: 'recommendation', title: 'Recommendation' },
  { key: 'framing', title: 'Framing' },
  { key: 'optionsConsidered', title: 'Options Considered' },
  { key: 'evidenceSummary', title: 'Evidence Summary' },
  { key: 'assumptionsLedger', title: 'Assumptions Ledger' },
  { key: 'openQuestions', title: 'Open Questions' },
  { key: 'metadata', title: 'Metadata' },
] as const

export default async function SharedBriefPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key } = await params
  const supabase = await createClient()

  const { data: brief } = await supabase
    .from('briefs')
    .select('id, sections, generated_at, is_shared, share_key')
    .eq('share_key', key)
    .maybeSingle()

  if (!brief || !brief.is_shared) {
    notFound()
  }

  const sections = brief.sections as Record<string, string>

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Decision Brief</h1>
        <p className="text-sm text-foreground-muted">
          Shared from Plinth • Generated on {new Date(brief.generated_at).toLocaleDateString()}
        </p>
      </div>

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

      <Card className="p-4 text-center text-xs text-foreground-muted">
        Shared from Plinth
      </Card>
    </div>
  )
}
