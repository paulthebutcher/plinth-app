'use client'

import { useEffect, useState } from 'react'
import { DecisionList } from '@/components/decisions/decision-list'
import { NewDecisionButton } from '@/components/decisions/new-decision-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type Decision } from '@/types/decision'

export default function DashboardPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadDecisions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/decisions', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load decisions.')
        }

        const data = (await response.json()) as Decision[]
        setDecisions(data)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Unable to load decisions. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDecisions()
    return () => controller.abort()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Decisions</h1>
          <p className="text-sm text-foreground-muted">
            Track and analyze your most important strategic choices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NewDecisionButton
            onCreated={(decision) => setDecisions((prev) => [decision, ...prev])}
          />
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <DecisionList
        decisions={decisions}
        isLoading={isLoading}
        onCreated={(decision) => setDecisions((prev) => [decision, ...prev])}
      />
    </div>
  )
}
