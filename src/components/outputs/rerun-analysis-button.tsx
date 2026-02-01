'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface RerunAnalysisButtonProps {
  decisionId: string
}

export function RerunAnalysisButton({ decisionId }: RerunAnalysisButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch(`/api/decisions/${decisionId}/rerun`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error?.message || 'Failed to re-run analysis')
      }
      setIsOpen(false)
      router.push(`/analyze/${decisionId}/scanning`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-run analysis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger asChild>
        <Button variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Re-run Analysis
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
          <Card className="p-6">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">
              Re-run Analysis?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-foreground-muted">
              This will run a fresh analysis and replace current results. Your edited brief content will be lost.
            </AlertDialog.Description>
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button onClick={handleConfirm} disabled={isLoading}>
                  {isLoading ? 'Re-running...' : 'Re-run Analysis'}
                </Button>
              </AlertDialog.Action>
            </div>
          </Card>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
