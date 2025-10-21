import { createClient } from '@/app/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Testa a conexão fazendo uma query simples
    const { data, error } = await supabase.auth.getUser()

    if (error && error.message !== 'Auth session missing!') {
      return Response.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Se chegou aqui, a conexão está OK
    return Response.json({ 
      success: true, 
      message: '✅ Conexão com Supabase funcionando!',
      authenticated: !!data.user,
      user: data.user?.email || 'Nenhum usuário logado'
    })

  } catch (error) {
    return Response.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}