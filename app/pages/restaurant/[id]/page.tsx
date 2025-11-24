'use client'
import './style.css'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import Comment from '../../../components/Comment/Comment'
import CommentButton from '../../../components/CommentButton/CommentButton'
import { getRestaurantById } from '../../../utils/supabase/store/restaurant'
import { getReviewsByRestaurantId } from '../../../utils/supabase/store/review'
import { getItemAccessibilityByReviewId } from '../../../utils/supabase/store/item_accessibility'
import Loading from '@/app/loading'

export default function Restaurant() {
    const params = useParams()
    const [restaurant, setRestaurant] = useState<any>(null)
    const [reviews, setReviews] = useState<any[]>([])
    const [accessibilityItems, setAccessibilityItems] = useState<any[]>([])
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
            <div className="restaurant-title">
                <div>
                    <div className="restaurant-name">
                        {restaurant.name_restaurant}
                    </div>

                    <div className="restaurant-address">
                        {restaurant.adress_restaurant}
                    </div>
                </div>

                <CommentButton />
            </div>

            <div className="acessibility-tags">
                {accessibilityItems.length > 0 &&(
                    <>
                        <h3>Recursos de Acessibilidade</h3>
                        <p>Clique para filtrar:</p>
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
                    <h2>Avaliações ({filteredReviews.length}{reviews.length !== filteredReviews.length && ` de ${reviews.length}`})</h2>
                    
                    <div className="search-bar">
                        <Search size={20} color='#f0e7d5' />
                        <input
                            type="text"
                            placeholder="Buscar nas avaliações..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <X size={16} />
                            Limpar filtros
                        </button>
                    )}
                </div>

                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <Comment
                            key={review.id_review}
                            authorName={review.user?.nome_user || review.user?.nickname || 'Usuário Anônimo'}
                            date={review.created_at}
                            content={review.comment}
                            rating={review.rating_review}
                            accessibilityItems={review.accessibilityItems}
                        />
                    ))
                ) : (
                    <p>
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
