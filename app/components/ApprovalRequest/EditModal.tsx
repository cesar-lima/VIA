'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import './modal.css';
import { deleteIndicatedRestaurant } from '@/app/utils/supabase/store/indicate_restaurant';

interface EditModalProps {
    id: string;
    name: string;
    address: string;
    cep: string;
    onApprove: (id: string, name: string, address: string, cep: string) => void;
    onReject: (id: string) => void;
    onClose: () => void;
}

export default function EditModal({ 
    id, 
    name, 
    address, 
    cep, 
    onApprove, 
    onReject, 
    onClose 
}: EditModalProps) {
    const [editedName, setEditedName] = useState(name);
    const [editedCep, setEditedCep] = useState(cep);
    const [streetAddress, setStreetAddress] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Extrair informações do endereço completo ao abrir o modal
    useEffect(() => {
        // Formato esperado: "Rua Exemplo, 123 - Bairro"
        const addressMatch = address.match(/^(.+),\s*(\d+)\s*-\s*(.+)$/);
        if (addressMatch) {
            setStreetAddress(addressMatch[1].trim());
            setNumber(addressMatch[2].trim());
            setNeighborhood(addressMatch[3].trim());
        } else {
            setStreetAddress(address);
        }
    }, [address]);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        
        setEditedCep(value);

        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            fetchAddress(cleanCep);
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setNumber(value);
    };

    const fetchAddress = async (cep: string) => {
        setLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                setStreetAddress(data.logradouro || '');
                setNeighborhood(data.bairro || '');
            } else {
                alert('CEP não encontrado!');
                setStreetAddress('');
                setNeighborhood('');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!editedName || !streetAddress || !neighborhood || !number || !editedCep) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        setSubmitting(true);
        try {
            // Formatando o endereço completo
            const fullAddress = `${streetAddress}, ${number} - ${neighborhood}`;
            
            await onApprove(id, editedName, fullAddress, editedCep);
            onClose();
        } catch (error) {
            console.error('Erro ao aprovar restaurante:', error);
            alert('Erro ao aprovar restaurante. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Tem certeza que deseja rejeitar este restaurante?')) {
            return;
        }

        setSubmitting(true);
        try {
            const result = await deleteIndicatedRestaurant(Number(id));
            
            if (result.success) {
                alert('Restaurante rejeitado com sucesso!');
                onReject(id);
                onClose();
            } else {
                alert(`Erro ao rejeitar restaurante: ${result.error}`);
            }
        } catch (error) {
            console.error('Erro ao rejeitar restaurante:', error);
            alert('Erro ao rejeitar restaurante. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Restaurante</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} color="#f0e7d5" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-form-group">
                        <label htmlFor="edit-name">Nome do Restaurante</label>
                        <input
                            id="edit-name"
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Digite o nome do restaurante..."
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="edit-cep">CEP</label>
                        <input
                            id="edit-cep"
                            type="text"
                            value={editedCep}
                            onChange={handleCepChange}
                            placeholder="99999-999"
                            maxLength={9}
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="edit-street-address">Endereço do Restaurante</label>
                        <input
                            id="edit-street-address"
                            type="text"
                            value={streetAddress}
                            disabled
                            placeholder="Av. Exemplo, 123"
                            style={{
                                color: "#f0e7d5",
                                cursor: "not-allowed"
                            }}
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="edit-neighborhood">Bairro</label>
                        <input
                            id="edit-neighborhood"
                            type="text"
                            value={neighborhood}
                            disabled
                            placeholder="Digite o bairro..."
                            style={{
                                color: "#f0e7d5",
                                cursor: "not-allowed"
                            }}
                        />
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="edit-number">Número</label>
                        <input
                            id="edit-number"
                            type="text"
                            value={number}
                            onChange={handleNumberChange}
                            placeholder="Digite o número..."
                            inputMode="numeric"
                            required
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button 
                        className="modal-btn modal-btn-approve" 
                        onClick={handleApprove}
                        disabled={loading || submitting}
                    >
                        <Check size={20} />
                        {submitting ? 'Aprovando...' : loading ? 'Buscando...' : 'Aprovar'}
                    </button>
                    <button 
                        className="modal-btn modal-btn-reject" 
                        onClick={handleReject}
                        disabled={loading || submitting}
                    >
                        <X size={20} />
                        {submitting ? 'Rejeitando...' : 'Rejeitar'}
                    </button>
                </div>
            </div>
        </div>
    );
}