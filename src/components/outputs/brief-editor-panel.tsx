'use client'

import { useCallback, useState } from 'react'
import { BriefHeader } from '@/components/outputs/brief-header'
import { BriefEditor } from '@/components/outputs/brief-editor'
import { ExportPdfButton } from '@/components/outputs/export-pdf-button'
import { RerunAnalysisButton } from '@/components/outputs/rerun-analysis-button'

interface BriefEditorPanelProps {
  decisionId: string
  title: string
  generatedAt: string
  isEdited: boolean
  markdown: string
}

export function BriefEditorPanel({
  decisionId,
  title,
  generatedAt,
  isEdited,
  markdown,
}: BriefEditorPanelProps) {
  const [editing, setEditing] = useState(false)
  const [edited, setEdited] = useState(isEdited)
  const [content, setContent] = useState(markdown)

  const refreshBrief = useCallback(async () => {
    const res = await fetch(`/api/decisions/${decisionId}/brief`)
    if (!res.ok) return
    const { data } = await res.json()
    if (!data) return
    setContent(data.markdown ?? '')
    setEdited(Boolean(data.is_edited))
  }, [decisionId])

  return (
    <div className="space-y-4">
      <BriefHeader
        title={title}
        generatedAt={generatedAt}
        isEdited={edited}
        onEdit={() => setEditing(true)}
        actions={
          <>
            <RerunAnalysisButton decisionId={decisionId} />
            <ExportPdfButton decisionId={decisionId} />
          </>
        }
      />

      <BriefEditor
        decisionId={decisionId}
        markdown={content}
        isEdited={edited}
        isEditing={editing}
        onToggle={setEditing}
        onSaved={async () => {
          await refreshBrief()
          setEditing(false)
        }}
      />
    </div>
  )
}
