import { createContext, useContext, useEffect, useState } from 'react'

interface User {
    id: number
    nome: string
    email: string
    data_nascimento: string
    apelido?: string
    cep: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    

    // const supabase = ...


    const signIn = async (email: string, password: string) => {
        try {
            
        } catch (error) {
            console.log("Erro: ", error);
            return { error: 'Erro interno do servidor' }
        }
    }
}