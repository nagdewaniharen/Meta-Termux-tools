import { NextRequest, NextResponse } from 'next/server'
import { createClient }             from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: request.nextUrl.origin + '/auth/callback/googel',
      scopes:     'openid email profile',
    },
  })

  if (error || !data.url) {
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Failed to initiate login' },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.url)
}
