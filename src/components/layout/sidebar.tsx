'use client'

import { LayoutGrid, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  return (
    <div className="w-64 border-r bg-background-subtle/40">
      <div className="flex h-16 items-center border-b px-4">
        <span className="text-lg font-semibold text-foreground">Plinth</span>
      </div>
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
          href="/settings/profile"
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
