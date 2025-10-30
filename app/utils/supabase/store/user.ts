import { createClient } from "../client";

async function checkLogin() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true, email: data.user?.email }
  } catch (error) {
    return {
      success: false,
      error: String(error)
    }
  }
}


export async function getAllUsers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user')
    .select('nome')
    .select('nickname')

  if (error) {
    console.error('Erro ao buscar usuários:', error)
    return null
  }

  return data
}

export async function getUserByEmail() {
  const loginCheck = await checkLogin()
  
  if (!loginCheck.success) {
    console.error('Usuário não está logado:', loginCheck.error)
    return null
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', loginCheck.email)
    .single()

  if (error) {
    console.error('Erro ao buscar usuário:', error)
    return {
      success: false,
      error: error.message
    }
  }

  return data
}