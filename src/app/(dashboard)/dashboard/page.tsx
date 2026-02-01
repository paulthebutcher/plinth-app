'use client'

import { useEffect, useState } from 'react'
import { DecisionList } from '@/components/decisions/decision-list'
import { NewDecisionButton } from '@/components/decisions/new-decision-button'
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold">Decisions</h1>
          <p className="text-sm text-foreground-muted">
            Track and analyze your most important strategic choices.
          </p>
        </div>
        <NewDecisionButton onCreated={(decision) => setDecisions((prev) => [decision, ...prev])} />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <DecisionList decisions={decisions} isLoading={isLoading} />
    </div>
  )
}
