import './style.css'

import Image from 'next/image'
import logo from '../../assets/logo-white.svg'
import responsiveLogo from '../../assets/logo.svg'
import Link from 'next/link'

export default function Login() {
    return (
        <main id="login">
            <div className="login-left">
                <Image src={logo} alt="logo" />
            </div>

            <div className="login-right">
                <form action="">
                    <div className="responsive-logo">
                        <Image src={responsiveLogo} alt="logo" />
                    </div>

                    <p>Bem vindo ao <span>Via</span></p>

                    <div className="login-input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-mail-icon lucide-mail">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                        <input type="text" name="text" className="input" placeholder="Email" />
                    </div>

                    <div className="login-input">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-key-round-icon lucide-key-round">
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                        </svg>
                        <input type="password" name="password" className="input" placeholder="Senha" />
                    </div>

                    <button className="login-button" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon lucide lucide-log-in-icon lucide-log-in">
                            <path d="m10 17 5-5-5-5" />
                            <path d="M15 12H3" />
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        </svg>
                        <span className="text">Entrar</span>
                    </button>

                    <div className="signup-link">
                        <p>Não possui uma conta? <Link href="../../auth/register">Cadastre-se</Link></p>
                    </div>
                </form>
            </div>
        </main>
    )
}