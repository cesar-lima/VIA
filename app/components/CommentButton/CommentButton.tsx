'use client'
import './CommentButton.css'

import { MessageCircleMore, X, Star, Search } from "lucide-react";
import { useAuth } from '@/app/providers/AuthProvider'
import { useEffect, useState } from 'react';
import { getItensAccessibility } from '@/app/utils/supabase/store/item_accessibility';
import Link from 'next/link'

export default function CommentButton() {
    const { user, signOut } = useAuth()

    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [accessibilityItems, setAccessibilityItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar o formulário
        console.log('Formulário enviado!');
        console.log('Nota:', rating);
        setIsOpen(false);
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
                                        <label>Ferramentas de Acessibilidade</label>
                                        <div className="search-container">
                                            <Search size={20} className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Buscar ferramenta..."
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
                                                            name="acessibility" 
                                                            value={item.id_cr} 
                                                        />
                                                        <span>{item.item_review}</span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="no-results">Nenhuma ferramenta encontrada</p>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="submit-button">
                                        Enviar Avaliação
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Link href="/auth/login">
                    <button className="comment-button" onClick={() => setIsOpen(true)}>
                        <MessageCircleMore />
                        <span className="tooltip">Avaliar</span>
                    </button>
                </Link>
            )}
        </>
    )
}