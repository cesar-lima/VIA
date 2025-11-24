'use client'

import './navbar.css'
import Image from 'next/image'
import logo from '../../assets/logo.svg'
import { CircleUserRound, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav>
      <Link href="/">
        <div className="logo">
          <Image src={logo} alt="logo via" width={50} />
          <div>Via</div>
        </div>
      </Link>

      {user ? (
        <>
          <div className="logged-in">
            <div className="user-area">
              <Link href="/pages/profile" className="user-info">
                <CircleUserRound />
                <div>{user.user_metadata.nome}</div>
              </Link>
            </div>
            <button onClick={handleSignOut} className="logout-btn">
              <LogOut size={20} color="#f0e7d5" />
            </button>
          </div>
        </>
      ) : (
        <Link href="/auth/login" className="user-area">
          <CircleUserRound color="#f0e7d5" />
          <div>Entrar</div>
        </Link>
      )}
    </nav>
  )
}