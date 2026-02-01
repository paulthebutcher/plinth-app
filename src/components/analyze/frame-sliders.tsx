'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'

interface FrameSliderValues {
  reversibility: number
  stakes: number
  scope: number
  time_horizon: string | null
}

interface FrameSlidersProps {
  values: FrameSliderValues
  onChange: (field: keyof FrameSliderValues, value: number | string) => void
}

const timeHorizonOptions = [
  { value: '3-6_months', label: '3-6 months' },
  { value: '6-12_months', label: '6-12 months' },
  { value: '1-2_years', label: '1-2 years' },
  { value: '2+_years', label: '2+ years' },
]

export function FrameSliders({ values, onChange }: FrameSlidersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Time Horizon</Label>
        <RadioGroup
          value={values.time_horizon ?? ''}
          onValueChange={(value) => onChange('time_horizon', value)}
          className="grid gap-3 sm:grid-cols-2"
        >
          {timeHorizonOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:border-foreground-muted"
            >
              <RadioGroupItem value={option.value} />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Reversibility</Label>
          <span className="text-xs text-foreground-muted">{values.reversibility}</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[values.reversibility]}
          onValueChange={(value) => onChange('reversibility', value[0])}
        />
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>Easily reversible</span>
          <span>Irreversible</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Stakes</Label>
          <span className="text-xs text-foreground-muted">{values.stakes}</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[values.stakes]}
          onValueChange={(value) => onChange('stakes', value[0])}
        />
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>Low (&lt;$1M)</span>
          <span>High ($10M+)</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Scope</Label>
          <span className="text-xs text-foreground-muted">{values.scope}</span>
        </div>
        <Slider
          min={1}
          max={5}
          step={1}
          value={[values.scope]}
          onValueChange={(value) => onChange('scope', value[0])}
        />
        <div className="flex items-center justify-between text-xs text-foreground-muted">
          <span>Team-level</span>
          <span>Exec-level</span>
        </div>
      </div>
    </div>
  )
}
