'use client'

import './navbar.css'
import Image from 'next/image'
import logo from '../../assets/logo.svg'
import { CircleUserRound, LogOut, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserByEmail } from '@/app/utils/supabase/store/user'
import { countIndicatedRestaurants } from '@/app/utils/supabase/store/indicate_restaurant'

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [indicatedCount, setIndicatedCount] = useState(0);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const userData = await getUserByEmail();
        if (userData && userData.admin) {
          setIsAdmin(true);
          // Buscar contagem de restaurantes indicados
          const result = await countIndicatedRestaurants();
          if (result.success) {
            setIndicatedCount(result.count ?? 0);
          }
        }
      }
    }
    checkAdmin();
  }, [user]);

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

            {isAdmin && (
              <div className="admin-area">
                <Link href="/pages/admin" className="user-info">
                  <span className="admin-icon-container">
                    <ShieldCheck />
                    {indicatedCount > 0 && (
                      <span className="admin-badge">{indicatedCount}</span>
                    )}
                  </span>
                </Link>
              </div>
            )}
            
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