import { NextRequest, NextResponse } from 'next/server'
import { requireOrgContext } from '@/lib/auth/require-org-context'
import { generateBriefPdf } from '@/lib/pdf/generate-brief-pdf'

const safeFilename = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'decision'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const ctx = await requireOrgContext()
  if (!ctx.ok) {
    return ctx.errorResponse
  }
  const { supabase, orgId } = ctx

  const { data: decision } = await supabase
    .from('decisions')
    .select('id, title')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!decision) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Decision not found' } },
      { status: 404 }
    )
  }

  const { data: brief } = await supabase
    .from('briefs')
    .select('sections, citations, generated_at')
    .eq('decision_id', id)
    .maybeSingle()

  if (!brief) {
    return NextResponse.json(
      { error: { code: 'not_found', message: 'Brief not found' } },
      { status: 404 }
    )
  }

  const { data: changers } = await supabase
    .from('decision_changers')
    .select('condition, would_favor, likelihood')
    .eq('decision_id', id)

  const pdfBuffer = await generateBriefPdf({
    title: decision.title,
    generatedAt: brief.generated_at,
    sections: brief.sections as Record<string, string>,
    citations: (brief.citations as Array<{ id: string; title: string; url: string }>) ?? [],
    decisionChangers: (changers ?? []).map((changer: any) => ({
      condition: changer.condition,
      wouldFavor: changer.would_favor,
      likelihood: changer.likelihood ?? 'medium',
    })),
  })

  const filename = `${safeFilename(decision.title)}-brief.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
