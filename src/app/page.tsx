import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard')
  }

  // Redirect unauthenticated users to login
  redirect('/login')
}
