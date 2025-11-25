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

export async function createUser(nome_user: string, data_nascimento: string, nickname: string, email: string) {
  const supabase = createClient();

  const admin = false;
  const { data, error } = await supabase
    .from('user')
    .insert([{ nome_user, data_nascimento, nickname, admin, email }]);

  if (error) {
    console.error('Erro ao criar usuário:', error);
    return {
      success: false,
      error: error.message
    }
  }

  return { success: true, data };
}

export async function getAllUsers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user')
    .select('nome_user, nickname')

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

export async function getUserById(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user')
    .select('nome_user, nickname')
    .eq('id_user', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }

  return data
}

export async function editUser(userId: string, nome_user: string, data_nascimento: string, nickname: string) {
  const supabase = createClient()
  
  // Atualiza a tabela user
  const { data: userData, error: userError } = await supabase
    .from('user')
    .update({ nome_user, data_nascimento, nickname })
    .eq('id_user', userId)

  if (userError) {
    console.error('Erro ao editar usuário:', userError)
    return {
      success: false,
      error: userError.message
    }
  }

  // Atualiza os metadados no Auth
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    data: {
      nome: nome_user.split(' ')[0], // Primeiro nome
      apelido: nickname
    }
  })

  if (authError) {
    console.error('Erro ao atualizar metadados do Auth:', authError)
    return {
      success: false,
      error: authError.message
    }
  }
  
  return { success: true, data: userData }
}