'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface BriefEditorProps {
  decisionId: string
  markdown: string
  isEdited: boolean
  isEditing: boolean
  onToggle: (value: boolean) => void
  onSaved: () => void
}

export function BriefEditor({
  decisionId,
  markdown,
  isEdited,
  isEditing,
  onToggle,
  onSaved,
}: BriefEditorProps) {
  const [preview, setPreview] = useState(false)
  const [content, setContent] = useState(markdown)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setContent(markdown)
  }, [markdown])

  const canSave = useMemo(() => content.trim().length > 0 && content !== markdown, [content, markdown])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      const res = await fetch(`/api/decisions/${decisionId}/brief`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown: content }),
      })

      if (!res.ok) {
        throw new Error('Failed to save brief')
      }

      onToggle(false)
      onSaved()
    } catch (err) {
      setError('Unable to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Brief narrative</h3>
          {isEdited ? <Badge variant="subtle">Edited</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setPreview((prev) => !prev)}>
            {preview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-3">
          {preview ? (
            <div className="whitespace-pre-wrap text-sm text-foreground-muted">{content}</div>
          ) : (
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[240px] text-sm"
            />
          )}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} disabled={!canSave || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setContent(markdown)
                onToggle(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-foreground-muted">
          Editing is available for the brief narrative only.
        </p>
      )}
    </Card>
  )
}
