'use client'

import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  user: {
    email?: string | undefined
  } | null
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-end gap-4 px-6">
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground-muted transition hover:bg-background-muted hover:text-foreground"
            onClick={() => router.push('/settings/profile')}
          >
            <User className="h-4 w-4" />
            <span className="hidden max-w-[180px] truncate sm:inline">
              {user?.email}
            </span>
          </button>
        </div>
        <Link
          href="/settings/profile"
          className="rounded-md p-2 text-foreground-muted transition hover:bg-background-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-md p-2 text-foreground-muted transition hover:bg-background-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
