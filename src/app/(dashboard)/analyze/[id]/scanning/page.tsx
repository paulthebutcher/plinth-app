'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useJobPolling } from '@/hooks/use-job-polling'
import { ScanningProgress } from '@/components/analyze/scanning-progress'

export default function ScanningPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [jobId, setJobId] = useState<string | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const { job } = useJobPolling(jobId)

  const [simulatedProgress, setSimulatedProgress] = useState(5) // Start at 5% so progress is visible immediately

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const res = await fetch(`/api/decisions/${id}/analyze`, {
          method: 'POST',
        })

        if (!res.ok) {
          const { error } = await res.json()
          if (error?.code === 'conflict') {
            setSimulatedProgress(10)
          } else {
            setStartError(error?.message || 'Failed to start analysis')
          }
          return
        }

        const { data } = await res.json()
        setJobId(data.jobId)
      } catch (err) {
        setStartError('Failed to start analysis')
      }
    }

    startAnalysis()
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(100, prev + Math.random() * 15)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (simulatedProgress >= 100 || job?.status === 'completed') {
      setTimeout(() => {
        router.push(`/analyze/${id}/results`)
      }, 500)
    }
  }, [simulatedProgress, job?.status, id, router])

  if (startError) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-sm text-destructive">{startError}</p>
        <Button variant="outline" onClick={() => router.push(`/analyze/${id}/frame`)}>
          Return to frame
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Analyzing Decision</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          This typically takes 30-90 seconds
        </p>
      </div>

      <ScanningProgress
        progress={job?.progress ?? simulatedProgress}
        status={job?.status ?? 'running'}
      />

      {job?.status === 'failed' ? (
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-destructive">
            {job.error || 'Analysis failed'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  )
}
