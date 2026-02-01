import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BriefHeaderProps {
  title: string
  generatedAt: string
  isEdited: boolean
  onEdit: () => void
}

export function BriefHeader({ title, generatedAt, isEdited, onEdit }: BriefHeaderProps) {
  const date = new Date(generatedAt).toLocaleDateString()

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <span>Generated on {date}</span>
          {isEdited ? <Badge variant="subtle">Edited</Badge> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onEdit}>Edit</Button>
        <Button variant="outline">Share</Button>
        <Button variant="outline">Export</Button>
      </div>
    </div>
  )
}
