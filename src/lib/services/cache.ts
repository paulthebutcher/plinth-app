import { createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

const getServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service role configuration')
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      get() {
        return undefined
      },
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    },
  })
}

const cleanupExpired = async (supabase: ReturnType<typeof getServiceClient>) => {
  const now = new Date().toISOString()
  await supabase.from('cache').delete().lt('expires_at', now)
}

export async function getCached<T>(key: string): Promise<T | null> {
  const supabase = getServiceClient()

  try {
    const { data, error } = await supabase
      .from('cache')
      .select('value, expires_at')
      .eq('key', key)
      .maybeSingle()

    if (error || !data) {
      console.info('Cache miss', { key })
      await cleanupExpired(supabase)
      return null
    }

    if (new Date(data.expires_at).getTime() <= Date.now()) {
      await supabase.from('cache').delete().eq('key', key)
      console.info('Cache expired', { key })
      await cleanupExpired(supabase)
      return null
    }

    console.info('Cache hit', { key })
    return data.value as T
  } catch (error) {
    console.info('Cache miss', { key })
    return null
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const supabase = getServiceClient()
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()

  const { error } = await supabase.from('cache').upsert({
    key,
    value,
    expires_at: expiresAt,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function invalidateCache(keyPattern: string): Promise<void> {
  const supabase = getServiceClient()
  const pattern = keyPattern.replace(/\*/g, '%')

  const { error } = await supabase.from('cache').delete().like('key', pattern)

  if (error) {
    throw new Error(error.message)
  }
}
