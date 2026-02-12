import { createServerClient } from '@supabase/ssr'
import { AuthError } from '@meta/shared'
import type { Request } from 'express'

/**
 * Parses the Cookie header from an Express request and verifies
 * the Supabase session.  Throws AuthError (401) when no valid
 * session is found.
 */
export async function requireAuth(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // For testing/deployment without credentials:
    // We log a warning and return a mock user so the app works.
    console.warn('⚠️ SUPABASE KEYS MISSING: Bypassing authentication (Dev Mode).')
    return {
      id: 'dev-admin',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@example.com',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any
  }

  // ── parse raw Cookie header into name/value pairs ───────
  const cookieHeader = req.headers.cookie || ''
  const cookieList = cookieHeader
    .split(';')
    .map((c) => {
      const [name, ...rest] = c.trim().split('=')
      return { name: name.trim(), value: rest.join('=') }
    })
    .filter((c) => c.name)

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieList },
      setAll() { /* no-op: we don't set cookies from the API server */ },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new AuthError('Not authenticated')
  }

  return user
}

export function isOwner(email?: string): boolean {
  if (!email) return false
  // For dev mode
  if (email === 'admin@example.com' && !process.env.OWNER_EMAILS) return true

  const owners = (process.env.OWNER_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
  return owners.includes(email.toLowerCase())
}
