'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface DecisionTypeSelectorProps {
  value: string | null
  onChange: (value: string) => void
}

const options = [
  {
    value: 'product_bet',
    label: 'Product Bet',
    description: 'New features, product direction, roadmap choices',
  },
  {
    value: 'market_entry',
    label: 'Market Entry',
    description: 'New markets, segments, geographies',
  },
  {
    value: 'investment',
    label: 'Investment / Prioritization',
    description: 'Resource allocation, budget decisions',
  },
  {
    value: 'platform',
    label: 'Platform / Architecture',
    description: 'Technical infrastructure, build vs buy',
  },
  {
    value: 'org_model',
    label: 'Org / Operating Model',
    description: 'Team structure, processes, partnerships',
  },
]

export function DecisionTypeSelector({ value, onChange }: DecisionTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>
        Decision Type
        <span className="text-destructive">*</span>
      </Label>
      <RadioGroup
        value={value ?? ''}
        onValueChange={onChange}
        className="gap-3"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:border-foreground-muted"
          >
            <RadioGroupItem value={option.value} />
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">{option.label}</div>
              <div className="text-xs text-foreground-muted">{option.description}</div>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
