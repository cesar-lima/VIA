'use client'
import './style.css'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Search, X, ArrowLeft, Star, MapPinned } from 'lucide-react'
import Comment from '../../../components/Comment/Comment'
import CommentButton from '../../../components/CommentButton/CommentButton'
import { getRestaurantById } from '../../../utils/supabase/store/restaurant'
import { getReviewsByRestaurantId, getUserVotesForReviews } from '../../../utils/supabase/store/review'
import { getItemAccessibilityByReviewId } from '../../../utils/supabase/store/item_accessibility'
import { getUserByEmail } from '../../../utils/supabase/store/user'
import Loading from '@/app/loading'
import Link from 'next/link'

export default function Restaurant() {
    const params = useParams()
    const router = useRouter()
    const [restaurant, setRestaurant] = useState<any>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [accessibilityItems, setAccessibilityItems] = useState<any[]>([])
    const [userVotes, setUserVotes] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    useEffect(() => {
        async function loadRestaurant() {
            if (params.id) {
                const [restaurantResult, reviewsResult] = await Promise.all([
                    getRestaurantById(params.id as string),
                    getReviewsByRestaurantId(params.id as string)
                ])

                if (restaurantResult.success && restaurantResult.data) {
                    setRestaurant(restaurantResult.data)
                }

                if (reviewsResult.success && reviewsResult.data) {
                    // Buscar itens de acessibilidade para cada review
                    const reviewsWithAccessibility = await Promise.all(
                        reviewsResult.data.map(async (review) => {
                            const itemsResult = await getItemAccessibilityByReviewId(review.id_review)
                            return {
                                ...review,
                                accessibilityItems: itemsResult.success ? itemsResult.data : []
                            }
                        })
                    )

                    setReviews(reviewsWithAccessibility)

                    // Buscar votos do usuário se estiver logado
                    try {
                        const userData = await getUserByEmail();
                        if (userData && userData.id_user) {
                            const reviewIds = reviewsWithAccessibility.map((r: any) => r.id_review);
                            const votesResult = await getUserVotesForReviews(userData.id_user, reviewIds);

                            if (votesResult.success && votesResult.data) {
                                console.log('Votos do usuário carregados:', votesResult.data);
                                setUserVotes(votesResult.data);
                            } else {
                                setUserVotes({});
                            }
                        }
                    } catch (error) {
                        // Usuário não está logado, ignora
                        console.log('Usuário não autenticado');
                        setUserVotes({});
                    }

                    // Coletar todos os itens únicos para as tags gerais
                    const allAccessibilityItems: any[] = []
                    reviewsWithAccessibility.forEach(review => {
                        if (review.accessibilityItems) {
                            allAccessibilityItems.push(...review.accessibilityItems)
                        }
                    })

                    // Remover duplicatas baseado no id_cr
                    const uniqueItems = allAccessibilityItems.filter((item, index, self) =>
                        index === self.findIndex((t) => t.checklist_review.id_cr === item.checklist_review.id_cr)
                    )

                    setAccessibilityItems(uniqueItems)
                }

                setLoading(false)
            }
        }
        loadRestaurant()
    }, [params.id])

    const calculateAverageRating = (restaurantId: number) => {
        const restaurantReviews = reviews.filter(r => r.fk_id_restaurant === restaurantId);
        if (restaurantReviews.length === 0) return undefined;

        const sum = restaurantReviews.reduce((acc, review) => acc + review.rating_review, 0);
        return Number((sum / restaurantReviews.length).toFixed(1));
    };

    const handleTagClick = (tagId: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId)
            } else {
                return [...prev, tagId]
            }
        })
    }

    const clearFilters = () => {
        setSelectedTags([])
        setSearchTerm('')
    }

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            // Filtro por busca de texto
            const matchesSearch = searchTerm === '' ||
                review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.user?.nome_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.user?.nickname?.toLowerCase().includes(searchTerm.toLowerCase())

            // Filtro por tags selecionadas
            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(selectedTag =>
                    review.accessibilityItems?.some((item: any) =>
                        item.checklist_review.id_cr === selectedTag
                    )
                )

            return matchesSearch && matchesTags
        })
    }, [reviews, searchTerm, selectedTags])

    if (loading) {
        return <Loading />
    }

    if (!restaurant) {
        return <div>Restaurante não encontrado</div>
    }

    const hasActiveFilters = selectedTags.length > 0 || searchTerm !== ''

    return (
        <section id="restaurant-page">
            <div className="restaurant-header">
                <div className="restaurant-header-left">
                    <button
                        className="back-button"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <CommentButton />
            </div>

            <div className="restaurant-title">
                <div>
                    <div className="restaurant-name">
                        {restaurant.name_restaurant}
                    </div>

                    <div className="restaurant-address">
                        {restaurant.adress_restaurant}
                    </div>
                </div>

                <div className="restaurant-map-address">
                    <Link href={`https://maps.google.com/?q=${restaurant.name_restaurant}, ${restaurant.adress_restaurant}`} target="_blank" rel="noopener noreferrer">
                        <MapPinned />
                    </Link>
                </div>
            </div>

            <div className="acessibility-tags">
                {accessibilityItems.length > 0 && (
                    <>
                        <div className="acessibility-tags-header">
                            <div>
                                <h3>Recursos de Acessibilidade</h3>
                                <p>Clique para filtrar:</p>
                            </div>

                            {hasActiveFilters && (
                                <button className="clear-filters-btn" onClick={clearFilters}>
                                    <X size={16} />
                                    <span>Limpar filtros</span>
                                </button>
                            )}
                        </div>
                    </>
                )}

                <div className="tags-container">
                    {accessibilityItems.length > 0 ? (
                        accessibilityItems.map((item) => (
                            <div
                                key={item.checklist_review.id_cr}
                                className={`tag ${selectedTags.includes(item.checklist_review.id_cr) ? 'tag-selected' : ''}`}
                                onClick={() => handleTagClick(item.checklist_review.id_cr)}
                            >
                                {item.checklist_review.item_review}
                            </div>
                        ))
                    ) : (
                        <p className="tag">Nenhum recurso de acessibilidade cadastrado ainda.</p>
                    )}
                </div>

                {selectedTags.length > 0 && (
                    <div className="selected-filters">
                        <span>Filtros ativos: {selectedTags.length}</span>
                    </div>
                )}
            </div>

            <div className="comments-section">
                <div className="comments-header">
                    <div className="comments-title-rating">
                        <h2>Avaliações ({filteredReviews.length}{reviews.length !== filteredReviews.length && ` de ${reviews.length}`})</h2>

                        <div className="restaurant-rating">
                            <Star size={20} fill="#212842" />
                            {calculateAverageRating(restaurant.id_restaurant) ?? 'Sem nota'}
                        </div>
                    </div>

                    <div className="search-bar">
                        <Search size={20} color='#212842' />
                        <input
                            type="text"
                            placeholder="Buscar nas avaliações..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => {
                        console.log('Review data:', review); // Debug
                        return (
                            <Comment
                                key={review.id_review}
                                reviewId={review.id_review}
                                authorId={review.fk_id_user}
                                authorName={review.user?.nome_user || review.user?.nickname || 'Usuário Anônimo'}
                                date={review.created_at}
                                content={review.comment}
                                rating={review.rating_review}
                                initialLikes={review.likes || 0}
                                initialUserVote={userVotes[review.id_review] as 'up' | 'down' | null}
                                accessibilityItems={review.accessibilityItems}
                                onDelete={() => {
                                    // Recarrega os reviews após deletar
                                    window.location.reload()
                                }}
                            />
                        )
                    })
                ) : (
                    <p className="no-comments-message">
                        {hasActiveFilters
                            ? 'Nenhuma avaliação encontrada com os filtros aplicados.'
                            : 'Nenhuma avaliação ainda. Seja o primeiro a avaliar!'
                        }
                    </p>
                )}
            </div>
        </section>
    )
}
