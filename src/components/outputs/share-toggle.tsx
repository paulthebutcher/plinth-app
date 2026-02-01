'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ShareToggleProps {
  decisionId: string
  isShared: boolean
  onChange: (shared: boolean, url?: string) => void
}

export function ShareToggle({ decisionId, isShared, onChange }: ShareToggleProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/decisions/${decisionId}/share`, {
        method: checked ? 'POST' : 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to update sharing')
      }
      const data = await res.json()
      onChange(checked, data?.data?.shareUrl)
    } catch (err) {
      onChange(isShared)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="space-y-1">
        <Label>Share this brief</Label>
        <p className="text-xs text-foreground-muted">
          Generate a public link to share a read-only version.
        </p>
      </div>
      <Switch checked={isShared} onCheckedChange={handleToggle} disabled={isLoading} />
    </div>
  )
}
