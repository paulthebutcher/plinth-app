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
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold text-foreground">Plinth</span>
      </div>
      <nav className="space-y-1 p-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive('/dashboard')
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Decisions</span>
        </Link>
        <Link
          href="/settings/profile"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            isActive('/settings')
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-muted hover:bg-background-muted hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  )
}
