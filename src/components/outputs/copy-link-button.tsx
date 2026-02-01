'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CopyLinkButtonProps {
  url: string
  isVisible: boolean
}

export function CopyLinkButton({ url, isVisible }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  if (!isVisible) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy link'}
    </Button>
  )
}
