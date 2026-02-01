'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CompanyContextInputProps {
  value: string
  onChange: (value: string) => void
}

export function CompanyContextInput({ value, onChange }: CompanyContextInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="company-context">Company Context (Optional)</Label>
      <Textarea
        id="company-context"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Relevant company context: market position, recent changes, team situation..."
        className="min-h-[120px] text-sm"
      />
      <p className="text-xs text-foreground-muted">
        This helps the AI understand your specific situation.
      </p>
    </div>
  )
}