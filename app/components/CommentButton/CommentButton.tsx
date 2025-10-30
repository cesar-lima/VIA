'use client'
import './CommentButton.css'

import { MessageCircleMore, X, Star } from "lucide-react";
import { useAuth } from '@/app/providers/AuthProvider'
import { useState } from 'react';
import Link from 'next/link'

export default function CommentButton() {
    const { user, signOut } = useAuth()

    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

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
                                        <div className="checkbox-group">
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="rampa" />
                                                <span>Rampa de Acesso</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="banheiro-adaptado" />
                                                <span>Banheiro Adaptado</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="elevador" />
                                                <span>Elevador</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="estacionamento" />
                                                <span>Estacionamento Acessível</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="cardapio-braille" />
                                                <span>Cardápio em Braille</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="sinalizacao-tatil" />
                                                <span>Sinalização Tátil</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="audio-descricao" />
                                                <span>Áudio Descrição</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="cadeira-rodas" />
                                                <span>Espaço para Cadeira de Rodas</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="interprete-libras" />
                                                <span>Intérprete de Libras</span>
                                            </label>
                                            <label className="checkbox-item">
                                                <input type="checkbox" name="acessibility" value="piso-tatil" />
                                                <span>Piso Tátil</span>
                                            </label>
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