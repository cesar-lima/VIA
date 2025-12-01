'use client';

import './style.css';
import { useState } from 'react';
import Navbar from "@/app/components/Navbar/Navbar";
import { indicateRestaurant } from '@/app/utils/supabase/store/indicate_restaurant';

export default function Indicate() {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        
        setCep(value);

        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            fetchAddress(cleanCep);
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove tudo que não for número
        const value = e.target.value.replace(/\D/g, '');
        setNumber(value);
    };

    const fetchAddress = async (cep: string) => {
        setLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                setAddress(data.logradouro || '');
                setNeighborhood(data.bairro || '');
            } else {
                alert('CEP não encontrado!');
                setAddress('');
                setNeighborhood('');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!restaurantName || !address || !neighborhood || !number || !cep) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        setSubmitting(true);
        
        // Formatando o endereço completo
        const fullAddress = `${address}, ${number} - ${neighborhood}`;
        
        try {
            const result = await indicateRestaurant(restaurantName, fullAddress, cep);
            
            if (result.success) {
                alert('Restaurante indicado com sucesso!');
                // Limpar formulário
                setRestaurantName('');
                setCep('');
                setAddress('');
                setNeighborhood('');
                setNumber('');
            } else {
                alert(`Erro ao indicar restaurante: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao enviar indicação:', error);
            alert('Erro ao enviar indicação. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="indicate-page">
            <Navbar />

            <h2>Indique seu restaurante favorito</h2>

            <form className="indicate-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="restaurant-name">Nome do Restaurante</label>
                    <input
                        id="restaurant-name"
                        name="restaurant-name"
                        required
                        placeholder="Digite o nome do restaurante..."
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cep">CEP</label>
                    <input
                        id="cep"
                        name="cep"
                        required
                        placeholder="99999-999"
                        value={cep}
                        onChange={handleCepChange}
                        maxLength={9}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="restaurant-address">Endereço do Restaurante</label>
                    <input
                        id="restaurant-address"
                        name="restaurant-address"
                        disabled
                        placeholder="Av. Exemplo, 123"
                        value={address}
                        style={{
                            color: "black",
                            cursor: "not-allowed"
                        }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="neighborhood">Bairro</label>
                    <input
                        id="neighborhood"
                        name="neighborhood"
                        disabled
                        placeholder="Digite o bairro..."
                        value={neighborhood}
                        style={{
                            color: "black",
                            cursor: "not-allowed"
                        }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="number">Número</label>
                    <input
                        id="number"
                        name="number"
                        placeholder="Digite o número..."
                        value={number}
                        onChange={handleNumberChange}
                        inputMode="numeric"
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading || submitting}>
                    {submitting ? 'Enviando...' : loading ? 'Buscando...' : 'Enviar Indicação'}
                </button>
            </form>
        </section>
    )
}
