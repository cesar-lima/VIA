'use client'

import './navbar.css'
import Image from 'next/image'
import logo from '../../assets/logo.svg'
import { CircleUserRound, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav>
      <div className="logo">
        <Image src={logo} alt="logo via" width={50}/>
        <div>Via</div>
      </div>

      {user ? (
        <div className="user-area logged-in">
          <Link href="/dashboard" className="user-info">
            <CircleUserRound />
            <div>{user.email}</div>
          </Link>
          <button onClick={handleSignOut} className="logout-btn">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      ) : (
        <Link href="/auth/login" className="user-area">
          <CircleUserRound />
          <div>Entrar</div>
        </Link>
      )}
    </nav>
  )
}