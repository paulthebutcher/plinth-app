'use client'

import { useState, useEffect, useCallback } from 'react'

interface Job {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  error: string | null
  output: unknown
}

export function useJobPolling(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJob = useCallback(async () => {
    if (!jobId) return

    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) throw new Error('Failed to fetch job')
      const { data } = await res.json()
      setJob(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    if (!jobId) return

    fetchJob()

    const interval = setInterval(() => {
      if (job?.status === 'completed' || job?.status === 'failed') {
        clearInterval(interval)
        return
      }
      fetchJob()
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, job?.status, fetchJob])

  return { job, isLoading, error, refetch: fetchJob }
}
