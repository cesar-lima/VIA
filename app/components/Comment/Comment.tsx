'use client'
import './style.css'

import { CircleUserRound, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { updateReviewVote, deleteReview } from '@/app/utils/supabase/store/review'
import { getUserByEmail } from '@/app/utils/supabase/store/user'

interface CommentProps {
    reviewId: number
    authorId: number | string // Aceita ambos
    authorName: string
    date: string
    content: string
    rating?: number
    initialLikes?: number
    initialUserVote?: 'up' | 'down' | null
    accessibilityItems?: Array<{
        checklist_review: {
            id_cr: string
            item_review: string
            item_classify: string
        }
    }>
    onDelete?: () => void
}

export default function Comment({
    reviewId,
    authorId,
    authorName,
    date,
    content,
    rating,
    initialLikes = 0,
    initialUserVote = null,
    accessibilityItems,
    onDelete
}: CommentProps) {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR')
    const [likes, setLikes] = useState(initialLikes)
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote)
    const [isOwner, setIsOwner] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [canDelete, setCanDelete] = useState(false)
    const isUpdatingRef = useRef(false)

    // Verifica se o usuário é o dono do comentário ou admin
    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const userData = await getUserByEmail()
                
                if (userData && userData.id_user) {
                    // Converte ambos para número para comparação
                    const userIdNum = Number(userData.id_user)
                    const authorIdNum = Number(authorId)
                    const isOwnerResult = userIdNum === authorIdNum
                    const isAdminResult = userData.admin || false
                    
                    setIsOwner(isOwnerResult)
                    setIsAdmin(isAdminResult)
                    setCanDelete(isOwnerResult || isAdminResult)
                }
            } catch (error) {
                console.error('Erro ao verificar propriedade:', error)
            }
        }
        checkOwnership()
    }, [authorId])

    useEffect(() => {
        setUserVote(initialUserVote)
    }, [initialUserVote])

    useEffect(() => {
        setLikes(initialLikes)
    }, [initialLikes])

    const handleVote = async (voteType: 'up' | 'down') => {
        if (isUpdatingRef.current) {
            return;
        }

        isUpdatingRef.current = true;

        try {
            const userData = await getUserByEmail();
            
            if (!userData || !userData.id_user) {
                alert('Você precisa estar logado para votar');
                throw new Error('Usuário não autenticado');
            }

            const result = await updateReviewVote(userData.id_user, reviewId, voteType);

            if (!result.success) {
                throw new Error(result.error);
            }

            const voteData = result.data;

            if (voteData) {
                setLikes(voteData.current_likes);
                setUserVote(voteData.new_vote);
            }

        } catch (error) {
            console.error('Erro ao votar:', error);
            alert('Erro ao registrar voto. Tente novamente.');
        } finally {
            setTimeout(() => {
                isUpdatingRef.current = false;
            }, 300);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
            return
        }

        try {
            const result = await deleteReview(reviewId)

            if (!result.success) {
                throw new Error(result.error)
            }

            alert('Avaliação deletada com sucesso!')
            
            if (onDelete) {
                onDelete()
            }

        } catch (error) {
            console.error('Erro ao deletar avaliação:', error)
            alert('Erro ao deletar avaliação. Tente novamente.')
        }
    }

    return (
        <div className="comment-container">
            <div className="comment-infos">
                <div className="comment-author">
                    <CircleUserRound />

                    <div className="author-name">
                        {authorName}
                    </div>
                </div>

                <div className="comment-date">
                    {formattedDate}
                </div>
            </div>

            <div className="comment-content">
                {content}
                <div className="comment-ratings">
                    {rating && (
                        <div className="comment-rating">
                            ⭐ {rating}/5
                            {canDelete && (
                                <Trash2 
                                    onClick={handleDelete}
                                    style={{ cursor: 'pointer', marginLeft: '8px', color: '#e74c3c' }}
                                    size={18}
                                />
                            )}
                        </div>
                    )}

                    <div className="vote-buttons">
                        <button
                            className={`vote-button vote-up ${userVote === 'up' ? 'active' : ''}`}
                            onClick={() => handleVote('up')}
                            title={userVote === 'up' ? 'Remover voto positivo' : 'Gostei'}
                        >
                            <ThumbsUp size={18} color={userVote === 'up' ? '#f0e7d5' : '#212842'} fill={userVote === 'up' ? '#f0e7d5' : 'none'} />
                        </button>
                        <span className="vote-count">{likes}</span>
                        <button
                            className={`vote-button vote-down ${userVote === 'down' ? 'active' : ''}`}
                            onClick={() => handleVote('down')}
                            title={userVote === 'down' ? 'Remover voto negativo' : 'Não gostei'}
                        >
                            <ThumbsDown size={18} color={userVote === 'down' ? '#f0e7d5' : '#212842'} fill={userVote === 'down' ? '#f0e7d5' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>

            {accessibilityItems && accessibilityItems.length > 0 && (
                <div className="comment-accessibility-tags">
                    <div className="tags-container">
                        {accessibilityItems.map((item) => (
                            <div key={item.checklist_review.id_cr} className="tag">
                                {item.checklist_review.item_review}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}