'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DecisionStatementInput } from '@/components/analyze/decision-statement-input'
import { DecisionTypeSelector } from '@/components/analyze/decision-type-selector'
import { FrameSliders } from '@/components/analyze/frame-sliders'

type FrameFormData = {
  title: string
  decision_frame: string
  decision_type: string | null
  time_horizon: string | null
  reversibility: number
  stakes: number
  scope: number
}

interface FrameFormProps {
  decisionId: string
  initialData: FrameFormData
}

export function FrameForm({ decisionId, initialData }: FrameFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<FrameFormData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  const canContinue = useMemo(() => {
    return formData.decision_frame.trim().length > 0 && !!formData.decision_type
  }, [formData.decision_frame, formData.decision_type])

  const saveFrame = async (data: FrameFormData) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      const response = await fetch(`/api/decisions/${decisionId}/frame`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save frame.')
      }

      setLastSaved(new Date())
    } catch (error) {
      setSaveError('Error saving')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      void saveFrame(formData)
    }, 800)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [formData])

  const updateField = <K extends keyof FrameFormData>(field: K, value: FrameFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    router.push(`/analyze/${decisionId}/context`)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="decision-title">
            Decision Title
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="decision-title"
            value={formData.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Give this decision a clear title"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <DecisionStatementInput
          value={formData.decision_frame}
          onChange={(value) => updateField('decision_frame', value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <DecisionTypeSelector
          value={formData.decision_type}
          onChange={(value) => updateField('decision_type', value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <FrameSliders
          values={{
            reversibility: formData.reversibility,
            stakes: formData.stakes,
            scope: formData.scope,
            time_horizon: formData.time_horizon,
          }}
          onChange={(field, value) =>
            updateField(field as keyof FrameFormData, value as FrameFormData[keyof FrameFormData])
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
        <div className="text-sm text-foreground-muted">
          {isSaving
            ? 'Saving...'
            : saveError
              ? saveError
              : lastSaved
                ? `Saved at ${lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : 'Changes auto-save as you type.'}
        </div>
        <Button onClick={handleNext} disabled={!canContinue}>
          Next: Add Context
        </Button>
      </div>
    </div>
  )
}
