"use client"

import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { getUserByEmail, editUser } from '@/app/utils/supabase/store/user'
import './style.css'

export default function Profile() {
    const [userId, setUserId] = useState('')
    const [nome, setNome] = useState('')
    const [apelido, setApelido] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Remove tudo que não é número

        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2)
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9)
        }

        setDataNascimento(value)
    }

    // Converte data de YYYY-MM-DD para DD/MM/YYYY
    const formatDateToBR = (date: string) => {
        if (!date) return ''
        if (date.includes('/')) return date
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
    }

    // Carrega dados do usuário ao montar o componente
    useEffect(() => {
        async function loadUserData() {
            const userData = await getUserByEmail()

            if (userData) {
                setUserId(userData.id_user || '')
                setEmail(userData.email || '')
                setNome(userData.nome_user || '')
                setApelido(userData.nickname || '')
                setDataNascimento(formatDateToBR(userData.data_nascimento || ''))
            }
            setLoadingData(false)
        }
        loadUserData()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            // Converte a data de DD/MM/YYYY para YYYY-MM-DD para salvar no banco
            const dateParts = dataNascimento.split('/');
            const formattedDate = dateParts.length === 3
                ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
                : '';

            const result = await editUser(userId, nome, formattedDate, apelido);

            if (!result.success) {
                alert('Erro ao salvar dados!')
                return;
            }

            alert('Dados salvos com sucesso!')
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar dados!')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div id="profile">
                <Navbar />
                <div className="loading-container">
                    <div className="loader">
                        <div className="loader-small"></div>
                        <div className="loader-large"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div id="profile">
            <Navbar />

            <h2>Dados da Conta</h2>

            <form className="profile-form" onSubmit={handleSave}>
                {/* email */}
                <div className="profile-input">
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
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                </div>

                {/* nome */}
                <div className="profile-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-user-round-icon lucide-user-round">
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                    <input
                        type="text"
                        name="nome"
                        className="input"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                {/* apelido */}
                <div className="profile-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-tag-icon lucide-tag">
                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                    </svg>
                    <input
                        type="text"
                        name="apelido"
                        className="input"
                        placeholder="Apelido"
                        value={apelido}
                        onChange={(e) => setApelido(e.target.value)}
                        required
                    />
                </div>

                {/* data de nascimento */}
                <div className="profile-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon lucide lucide-calendar-icon lucide-calendar">
                        <path d="M8 2v4M16 2v4M3 10h18" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                    </svg>
                    <input
                        type="text"
                        name="dataNascimento"
                        className="input"
                        placeholder="DD/MM/AAAA"
                        value={dataNascimento}
                        onChange={handleDateChange}
                        maxLength={10}
                        required
                    />
                </div>

                <button className="register-button" type="submit" disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sparkle lucide lucide-sparkles-icon lucide-sparkles">
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                        <path d="M20 2v4" />
                        <path d="M22 4h-4" />
                        <circle cx="4" cy="20" r="2" />
                    </svg>
                    <span className="text">{loading ? 'Salvando...' : 'Salvar'}</span>
                </button>
            </form>
        </div>
    )
}