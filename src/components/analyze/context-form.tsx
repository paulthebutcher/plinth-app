'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CompanyContextInput } from '@/components/analyze/company-context-input'
import { ConstraintForm } from '@/components/analyze/constraint-form'
import { ConstraintsList, type Constraint } from '@/components/analyze/constraints-list'

interface ContextFormProps {
  decisionId: string
  initialContext: {
    company_context: string
    falsification_criteria: string
  }
  initialConstraints: Constraint[]
}

export function ContextForm({
  decisionId,
  initialContext,
  initialConstraints,
}: ContextFormProps) {
  const router = useRouter()
  const [context, setContext] = useState(initialContext)
  const [constraints, setConstraints] = useState<Constraint[]>(initialConstraints)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [showConstraintForm, setShowConstraintForm] = useState(false)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialLoadRef = useRef(true)

  const saveContext = async (data: ContextFormProps['initialContext']) => {
    setIsSaving(true)
    setSaveError(null)
    try {
      const response = await fetch(`/api/decisions/${decisionId}/context`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save context')
      }

      setLastSaved(new Date())
      setActionMessage('Context saved')
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
      void saveContext(context)
    }, 800)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [context])

  const handleAddConstraint = async (data: { category: string; description: string; severity: string }) => {
    setActionMessage(null)
    try {
      const response = await fetch(`/api/decisions/${decisionId}/constraints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to add constraint')
      }

      const payload = await response.json()
      if (payload?.data) {
        setConstraints((prev) => [...prev, payload.data])
        setShowConstraintForm(false)
        setActionMessage('Constraint added')
      }
    } catch (error) {
      setActionMessage('Unable to add constraint')
    }
  }

  const handleDeleteConstraint = async (constraintId: string) => {
    setActionMessage(null)
    try {
      const response = await fetch(
        `/api/decisions/${decisionId}/constraints/${constraintId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to delete constraint')
      }

      setConstraints((prev) => prev.filter((constraint) => constraint.id !== constraintId))
      setActionMessage('Constraint removed')
    } catch (error) {
      setActionMessage('Unable to delete constraint')
    }
  }

  const navigateToScanning = () => {
    router.push(`/analyze/${decisionId}/scanning`)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CompanyContextInput
          value={context.company_context}
          onChange={(value) => setContext((prev) => ({ ...prev, company_context: value }))}
        />
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <Label htmlFor="falsification-criteria">Falsification Criteria (Optional)</Label>
          <Textarea
            id="falsification-criteria"
            value={context.falsification_criteria}
            onChange={(event) =>
              setContext((prev) => ({ ...prev, falsification_criteria: event.target.value }))
            }
            placeholder="What would make this decision obviously wrong?"
            className="min-h-[100px] text-sm"
          />
          <p className="text-xs text-foreground-muted">
            Identify what evidence would disprove this decision.
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Constraints</h3>
          <p className="text-sm text-foreground-muted">
            Add guardrails that must be respected during analysis.
          </p>
        </div>

        <ConstraintsList
          constraints={constraints}
          onDelete={handleDeleteConstraint}
          onAdd={() => setShowConstraintForm(true)}
        />

        {showConstraintForm ? (
          <Card className="p-6">
            <ConstraintForm
              onSubmit={handleAddConstraint}
              onCancel={() => setShowConstraintForm(false)}
            />
          </Card>
        ) : null}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-foreground-muted">
            {isSaving
              ? 'Saving...'
              : saveError
                ? saveError
                : lastSaved
                  ? `Saved at ${lastSaved.toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}`
                  : 'Changes auto-save as you type.'}
            {actionMessage ? ` • ${actionMessage}` : ''}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={navigateToScanning}>
              Skip for now
            </Button>
            <Button onClick={navigateToScanning}>Continue to Analysis</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
