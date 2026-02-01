'use client'

import { useCallback } from 'react'
import { Badge } from '@/components/ui/badge'

interface EvidenceCitationProps {
  id: string
  index: number
  url: string
}

export function EvidenceCitation({ id, index, url }: EvidenceCitationProps) {
  const handleClick = useCallback(() => {
    const target = document.getElementById(`citation-${id}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target.classList.add('ring-2', 'ring-primary/40')
    setTimeout(() => {
      target.classList.remove('ring-2', 'ring-primary/40')
    }, 2000)
  }, [id])

  return (
    <button type="button" onClick={handleClick} title={url} className="text-left">
      <Badge variant="outline">[{index}]</Badge>
    </button>
  )
}
