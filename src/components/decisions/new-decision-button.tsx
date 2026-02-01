'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Decision } from '@/types/decision'

interface NewDecisionButtonProps {
  onCreated?: (decision: Decision) => void
}

export function NewDecisionButton({ onCreated }: NewDecisionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = title.trim()

    if (!trimmed) {
      setError('Decision title is required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const response = await fetch('/api/decisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: trimmed }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData?.error?.message || errorData?.error || 'Failed to create decision'
        throw new Error(message)
      }

      const decision = (await response.json()) as Decision
      onCreated?.(decision)
      router.push(`/analyze/${decision.id}/frame`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create decision. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {!isOpen ? (
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setIsOpen(true)
            setError(null)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze a Decision
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-background p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <Label htmlFor="decision-title">Decision title</Label>
              <p className="text-xs text-foreground-muted">
                Summarize the strategic decision you want to analyze.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setTitle('')
                setError(null)
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            <Input
              id="decision-title"
              name="decisionTitle"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g., Enter a new market in 2026"
              autoFocus
            />
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Start analysis
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
