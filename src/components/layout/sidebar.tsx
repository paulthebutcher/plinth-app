'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()
  const [decisionTitle, setDecisionTitle] = useState<string | null>(null)
  const [decisionError, setDecisionError] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  const decisionId = useMemo(() => {
    if (!pathname?.startsWith('/analyze/')) return null
    const parts = pathname.split('/').filter(Boolean)
    return parts.length >= 2 ? parts[1] : null
  }, [pathname])

  useEffect(() => {
    if (!decisionId) {
      setDecisionTitle(null)
      setDecisionError(false)
      return
    }

    let cancelled = false

    const loadDecision = async () => {
      try {
        const response = await fetch(`/api/decisions/${decisionId}`)
        if (!response.ok) {
          throw new Error('Failed to load decision')
        }
        const { data } = await response.json()
        if (!cancelled) {
          setDecisionTitle(data?.title ?? 'Decision')
          setDecisionError(false)
        }
      } catch (error) {
        if (!cancelled) {
          setDecisionTitle('Decision')
          setDecisionError(true)
        }
      }
    }

    loadDecision()

    return () => {
      cancelled = true
    }
  }, [decisionId])

  return (
    <div className="w-64 border-r bg-background-subtle/40">
      <div className="flex h-16 items-center border-b px-4">
        <span className="text-lg font-semibold text-foreground">Plinth</span>
      </div>
      {decisionId ? (
        <div className="border-b px-4 py-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            ← Back to Decisions
          </Link>
          <div className="mt-2 text-sm font-medium text-foreground">
            {decisionTitle ?? (decisionError ? 'Decision' : 'Loading...')}
          </div>
        </div>
      ) : null}
      <nav className="space-y-1 p-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive('/dashboard')
              ? 'bg-primary/10 text-primary'
              : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span>Decisions</span>
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-primary/10 text-primary'
              : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  )
}
