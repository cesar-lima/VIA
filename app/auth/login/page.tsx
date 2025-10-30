'use client'

import './style.css'
import Image from 'next/image'
import logo from '../../assets/logo-white.svg'
import responsiveLogo from '../../assets/logo.svg'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'

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
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (error) {
            alert(`Erro: ${error.message}`)
            return
        }

        router.push('/')
        router.refresh()
    }

    return (
        <main id="login">
            <div className="login-left">
                <Image src={logo} alt="logo" />
            </div>
            <div className="login-right">
                <form onSubmit={handleLogin}>
                    <div className="responsive-logo">
                        <Image src={responsiveLogo} alt="logo" />
                    </div>
                    <p>Bem vindo ao <span>Via</span></p>
                    <div className="login-input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-mail-icon lucide-mail">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                        <input 
                            type="email" 
                            name="email" 
                            className="input" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-key-round-icon lucide-key-round">
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                        </svg>
                        <input 
                            type="password" 
                            name="password" 
                            className="input" 
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-button" type="submit" disabled={loading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon lucide lucide-log-in-icon lucide-log-in">
                            <path d="m10 17 5-5-5-5" />
                            <path d="M15 12H3" />
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        </svg>
                        <span className="text">{loading ? 'Entrando...' : 'Entrar'}</span>
                    </button>
                    <div className="signup-link">
                        <p>Não possui uma conta? <Link href="../../auth/register">Cadastre-se</Link></p>
                    </div>
                </form>
            </div>
        </main>
    )
}