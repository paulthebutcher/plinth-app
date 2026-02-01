'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

interface ConstraintFormProps {
  onSubmit: (constraint: { category: string; description: string; severity: string }) => void
  onCancel: () => void
}

const categories = [
  { value: 'technical', label: 'Technical' },
  { value: 'budget', label: 'Budget' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'legal', label: 'Legal / Compliance' },
  { value: 'brand', label: 'Brand / Reputation' },
  { value: 'org', label: 'Organizational' },
  { value: 'other', label: 'Other' },
]

export function ConstraintForm({ onSubmit, onCancel }: ConstraintFormProps) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<'hard' | 'soft'>('hard')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!category || !description.trim()) {
      return
    }
    onSubmit({ category, description: description.trim(), severity })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="constraint-category">Category</Label>
        <select
          id="constraint-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
        >
          <option value="">Select a category</option>
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="constraint-description">Description</Label>
        <Textarea
          id="constraint-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the constraint"
          className="min-h-[90px] text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label>Severity</Label>
        <RadioGroup
          value={severity}
          onValueChange={(value) => setSeverity(value as 'hard' | 'soft')}
          className="gap-3"
        >
          <label className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:border-foreground-muted">
            <RadioGroupItem value="hard" />
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">Hard constraint (must meet)</div>
              <div className="text-xs text-foreground-muted">
                This decision cannot proceed unless satisfied.
              </div>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:border-foreground-muted">
            <RadioGroupItem value="soft" />
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">Soft constraint (prefer to meet)</div>
              <div className="text-xs text-foreground-muted">
                We should try to meet this, but it is negotiable.
              </div>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Add</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
