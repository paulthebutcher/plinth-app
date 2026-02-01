'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { BriefHeader } from '@/components/outputs/brief-header'
import { BriefEditor } from '@/components/outputs/brief-editor'
import { ExportPdfButton } from '@/components/outputs/export-pdf-button'
import { RerunAnalysisButton } from '@/components/outputs/rerun-analysis-button'
import { ShareToggle } from '@/components/outputs/share-toggle'
import { CopyLinkButton } from '@/components/outputs/copy-link-button'

interface BriefEditorPanelProps {
  decisionId: string
  title: string
  generatedAt: string
  isEdited: boolean
  markdown: string
  isShared: boolean
  shareKey: string | null
}

export function BriefEditorPanel({
  decisionId,
  title,
  generatedAt,
  isEdited,
  markdown,
  isShared,
  shareKey,
}: BriefEditorPanelProps) {
  const [editing, setEditing] = useState(false)
  const [edited, setEdited] = useState(isEdited)
  const [content, setContent] = useState(markdown)
  const [shared, setShared] = useState(isShared)
  const [shareUrl, setShareUrl] = useState(shareKey ? `/share/${shareKey}` : '')

  const refreshBrief = useCallback(async () => {
    const res = await fetch(`/api/decisions/${decisionId}/brief`)
    if (!res.ok) return
    const { data } = await res.json()
    if (!data) return
    setContent(data.markdown ?? '')
    setEdited(Boolean(data.is_edited))
  }, [decisionId])

  useEffect(() => {
    setEdited(isEdited)
    setContent(markdown)
  }, [isEdited, markdown])

  useEffect(() => {
    setShared(isShared)
    setShareUrl(shareKey ? `/share/${shareKey}` : '')
  }, [isShared, shareKey])

  const resolvedShareUrl = useMemo(() => {
    if (!shareUrl) return ''
    if (shareUrl.startsWith('http')) return shareUrl
    const base = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    return `${base}${shareUrl}`
  }, [shareUrl])

  return (
    <div className="space-y-4">
      <BriefHeader
        title={title}
        generatedAt={generatedAt}
        isEdited={edited}
        onEdit={() => setEditing(true)}
        actions={
          <>
            <ShareToggle
              decisionId={decisionId}
              isShared={shared}
              onChange={(nextShared, url) => {
                setShared(nextShared)
                setShareUrl(url ?? '')
              }}
            />
            <CopyLinkButton url={resolvedShareUrl} isVisible={shared && Boolean(resolvedShareUrl)} />
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
