'use client'

import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface BriefSectionProps {
  title: string
  content: string
  defaultOpen?: boolean
}

export function BriefSection({ title, content, defaultOpen = false }: BriefSectionProps) {
  return (
    <Card className="p-4">
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
          <h2 className="text-lg font-medium text-foreground">{title}</h2>
          <ChevronDown className="h-4 w-4 text-foreground-muted" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 text-sm text-foreground-muted">
          <div className="whitespace-pre-wrap">{content}</div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
