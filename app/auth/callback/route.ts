import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`http://localhost:3000${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`https://viarestaurantes.vercel.app${next}`)
      }
    }
  }

  // Se deu erro ou não tem código, redireciona pro login
  return NextResponse.redirect(
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/auth/login'
      : 'https://viarestaurantes.vercel.app/auth/login'
  )
}