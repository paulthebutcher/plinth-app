'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface DecisionStatementInputProps {
  value: string
  onChange: (value: string) => void
}

export function DecisionStatementInput({ value, onChange }: DecisionStatementInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="decision-statement">
          Decision Statement
          <span className="text-destructive">*</span>
        </Label>
        <span className="text-xs text-foreground-muted">
          {value.length} / 500 characters
        </span>
      </div>
      <Textarea
        id="decision-statement"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What decision are you trying to make?"
        maxLength={500}
        className="min-h-[100px] text-sm"
      />
    </div>
  )
}
