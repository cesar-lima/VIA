'use client'
import './CommentButton.css'

import { MessageCircleMore, X, Star, Search } from "lucide-react";
import { useAuth } from '@/app/providers/AuthProvider'
import { useEffect, useState } from 'react';
import { getItensAccessibility } from '@/app/utils/supabase/store/item_accessibility';
import { createReview } from '@/app/utils/supabase/store/review';
import Link from 'next/link'
import { useParams } from 'next/navigation';

export default function CommentButton() {
    const { user } = useAuth()
    const params = useParams();
    const restaurantId = params?.id as string;

    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [accessibilityItems, setAccessibilityItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadAccessibilityItems() {
            const result = await getItensAccessibility();
            if (result.success && result.data) {
                setAccessibilityItems(result.data);
            }
        }
        loadAccessibilityItems();
    }, []);

    const filteredItems = accessibilityItems.filter((item) =>
        item.item_review.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckboxChange = (itemId: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user || !restaurantId) {
            console.error('Usuário não autenticado ou restaurante não identificado');
            return;
        }

        if (rating === 0) {
            alert('Por favor, selecione uma nota');
            return;
        }

        setIsSubmitting(true);

        // Buscar o id_user (inteiro) usando o email do usuário autenticado
        const { getUserByEmail } = await import('@/app/utils/supabase/store/user');
        const userData = await getUserByEmail();
        
        if (!userData || !userData.id_user) {
            alert('Erro ao identificar usuário');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const comment = formData.get('comment') as string;

        const result = await createReview({
            fk_id_user: String(userData.id_user),
            fk_id_restaurant: restaurantId,
            rating_review: rating,
            comment: comment,
            checklist_items: selectedItems.length > 0 ? selectedItems : undefined
        });

        setIsSubmitting(false);

        if (result.success) {
            alert('Avaliação enviada com sucesso!');
            setIsOpen(false);
            setRating(0);
            setSelectedItems([]);
            setSearchTerm('');
            window.location.reload();
        } else {
            alert('Erro ao enviar avaliação: ' + result.error);
        }
    };

    return (
        <>
            {user ? (
                <>
                    {/* widget */}
                    <button className="comment-button" onClick={() => setIsOpen(true)}>
                        <MessageCircleMore />
                        <span className="tooltip">Avaliar</span>
                    </button>

                    {/* formulário */}
                    {isOpen && (
                        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Avaliar Restaurante</h2>
                                    <button className="close-button" onClick={() => setIsOpen(false)}>
                                        <X color="#f0e7d5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Nota</label>
                                        <div className="star-rating">
                                            <div className="star-icons">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className="star-button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                    >
                                                        <Star
                                                            fill={(hoverRating || rating) >= star ? "#212842" : "none"}
                                                            color={(hoverRating || rating) >= star ? "#212842" : "#212842"}
                                                            size={32}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <span className="rating-text">
                                                {rating > 0 ? `${rating}/5` : 'Selecione uma nota'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="comment">Comentário</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            rows={4}
                                            required
                                            placeholder="Conte sobre sua experiência..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Recursos de Acessibilidade</label>
                                        <div className="search-container">
                                            <Search size={20} className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Buscar Recurso..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="search-input"
                                            />
                                        </div>
                                        <div className="checkbox-group">
                                            {filteredItems.length > 0 ? (
                                                filteredItems.map((item) => (
                                                    <label key={item.id_cr} className="checkbox-item">
                                                        <input 
                                                            type="checkbox" 
                                                            value={item.id_cr}
                                                            checked={selectedItems.includes(item.id_cr)}
                                                            onChange={(e) => handleCheckboxChange(item.id_cr, e.target.checked)}
                                                        />
                                                        <span>{item.item_review}</span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="no-results">Nenhum Recurso encontrado</p>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                                        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Link href="/auth/login">
                    <button className="comment-button">
                        <MessageCircleMore />
                        <span className="tooltip">Avaliar</span>
                    </button>
                </Link>
            )}
        </>
    )
}