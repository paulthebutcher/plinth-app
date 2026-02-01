'use client'

import { useMemo, useState } from 'react'
import { ShareToggle } from '@/components/outputs/share-toggle'
import { CopyLinkButton } from '@/components/outputs/copy-link-button'

interface SharePanelProps {
  decisionId: string
  isShared: boolean
  shareUrl: string
}

export function SharePanel({ decisionId, isShared, shareUrl }: SharePanelProps) {
  const [shared, setShared] = useState(isShared)
  const [url, setUrl] = useState(shareUrl)

  const fallbackUrl = useMemo(() => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${window.location.origin}${url}`
  }, [url])

  return (
    <div className="space-y-3">
      <ShareToggle
        decisionId={decisionId}
        isShared={shared}
        onChange={(nextShared, nextUrl) => {
          setShared(nextShared)
          if (nextShared) {
            setUrl(nextUrl ?? url)
          } else {
            setUrl('')
          }
        }}
      />
      <CopyLinkButton url={fallbackUrl} isVisible={shared && Boolean(fallbackUrl)} />
    </div>
  )
}
