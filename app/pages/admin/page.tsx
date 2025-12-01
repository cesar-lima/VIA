'use client'

import './style.css'
import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import ApprovalRequest from '../../components/ApprovalRequest/ApprovalRequest'
import { listIndicatedRestaurants, deleteIndicatedRestaurant, approveIndicatedRestaurant } from '@/app/utils/supabase/store/indicate_restaurant'

interface DraftRestaurant {
    id_rascunho: string
    nome_restaurant: string
    adress_restaurant: string
    cep: string
}

export default function Admin() {
    const [restaurants, setRestaurants] = useState<DraftRestaurant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadRestaurants()
    }, [])

    async function loadRestaurants() {
        setLoading(true)
        const result = await listIndicatedRestaurants()
        if (result.success && result.data) {
            setRestaurants(result.data)
        }
        setLoading(false)
    }

    const handleApprove = async (id: string, name: string, address: string, cep: string) => {
        try {
            // Inserir na tabela restaurant
            const approveResult = await approveIndicatedRestaurant(name, address, cep);
            
            if (!approveResult.success) {
                alert(`Erro ao aprovar restaurante: ${approveResult.error}`);
                return;
            }

            // Deletar da tabela draft_restaurant
            const deleteResult = await deleteIndicatedRestaurant(Number(id));
            
            if (!deleteResult.success) {
                alert(`Restaurante aprovado, mas houve erro ao remover o rascunho: ${deleteResult.error}`);
                return;
            }

            // Remover da lista após aprovação bem-sucedida
            setRestaurants(prev => prev.filter(r => r.id_rascunho !== id));
            alert('Restaurante aprovado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao aprovar restaurante:', error);
            alert('Erro ao aprovar restaurante. Tente novamente.');
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm('Tem certeza que deseja rejeitar este restaurante?')) {
            return;
        }

        try {
            const result = await deleteIndicatedRestaurant(Number(id));
            
            if (result.success) {
                // Remover da lista após rejeição
                setRestaurants(prev => prev.filter(r => r.id_rascunho !== id))
                alert('Restaurante rejeitado com sucesso!');
            } else {
                alert(`Erro ao rejeitar restaurante: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao rejeitar restaurante:', error);
            alert('Erro ao rejeitar restaurante. Tente novamente.');
        }
    }

    return(
        <div id="admin-page">
            <Navbar />

            <div className="approval-requests">
                <h3>Aprovações Pendentes</h3>

                {loading ? (
                    <p>Carregando...</p>
                ) : restaurants.length === 0 ? (
                    <p>Nenhuma aprovação pendente</p>
                ) : (
                    restaurants.map((restaurant) => (
                        <ApprovalRequest
                            key={restaurant.id_rascunho}
                            id={restaurant.id_rascunho}
                            name={restaurant.nome_restaurant}
                            address={restaurant.adress_restaurant}
                            cep={restaurant.cep}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))
                )}
            </div>
        </div>
    )
}