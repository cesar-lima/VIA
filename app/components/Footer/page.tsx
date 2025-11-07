'use client'

import './style.css'
import Link from 'next/link'

import { useAuth } from '@/app/providers/AuthProvider'

export default function Footer() {
    const { user } = useAuth()

    return (
        <footer>
            Não encontrou o que procurava? {user ? (<Link href="/pages/indicate">Indique seu restaurante favorito!</Link>) : <Link href="../../auth/login">Indique seu restaurante favorito!</Link>}
        </footer>
    )
}
