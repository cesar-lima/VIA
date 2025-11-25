import { createClient } from "../client";

export async function getReviewsByRestaurantId(restaurantId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('review')
        .select(`
            *,
            user:fk_id_user (
                nome_user,
                nickname
            )
        `)
        .eq('fk_id_restaurant', restaurantId)
        .order('likes', { ascending: false });

    if (error) {
        console.error('Erro ao buscar avaliações:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}

export async function getUserVotesForReviews(userId: number, reviewIds: number[]) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('review_votes')
        .select('fk_id_review, vote_type')
        .eq('fk_id_user', userId)
        .in('fk_id_review', reviewIds);

    if (error) {
        console.error('Erro ao buscar votos do usuário:', error);
        return { success: false, error: error.message };
    }

    // Transforma em objeto { reviewId: voteType }
    const votesMap = data?.reduce((acc, vote) => {
        acc[vote.fk_id_review] = vote.vote_type;
        return acc;
    }, {} as Record<number, string>) || {};

    return { success: true, data: votesMap };
}

export async function updateReviewVote(userId: number, reviewId: number, voteType: 'up' | 'down') {
    const supabase = createClient();

    const { data, error } = await supabase
        .rpc('manage_review_vote', { 
            p_user_id: userId, 
            p_review_id: reviewId,
            p_vote_type: voteType
        });

    if (error) {
        console.error('Erro ao atualizar voto:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function createReview(review: {
    fk_id_user: string;
    fk_id_restaurant: string;
    rating_review: number;
    comment: string;
    checklist_items?: number[];
}) {
    const supabase = createClient();

    // Primeiro, cria a review
    const { data: reviewData, error: reviewError } = await supabase
        .from('review')
        .insert([{
            fk_id_user: review.fk_id_user,
            fk_id_restaurant: review.fk_id_restaurant,
            rating_review: review.rating_review,
            comment: review.comment
        }])
        .select()
        .single();

    if (reviewError) {
        console.error('Erro ao criar avaliação:', reviewError);
        return {
            success: false,
            error: reviewError.message
        }
    }

    // Se houver itens de checklist, insere na tabela review_checklist_item
    if (review.checklist_items && review.checklist_items.length > 0) {
        const checklistData = review.checklist_items.map(itemId => ({
            fk_id_review: reviewData.id_review,
            fk_id_cr: itemId
        }));

        const { error: checklistError } = await supabase
            .from('review_checklist_item')
            .insert(checklistData);

        if (checklistError) {
            console.error('Erro ao criar itens do checklist:', checklistError);
            return {
                success: false,
                error: checklistError.message
            }
        }
    }

    return { success: true, data: reviewData };
}

export async function deleteReview(reviewId: number) {
    const supabase = createClient();

    try {
        // 1. Deleta os votos relacionados (se existirem)
        const { error: votesError } = await supabase
            .from('review_votes')
            .delete()
            .eq('fk_id_review', reviewId);

        if (votesError) {
            console.error('Erro ao deletar votos:', votesError);
            // Continua mesmo se não houver votos
        }

        // 2. Deleta os itens do checklist (se existirem)
        const { error: checklistError } = await supabase
            .from('review_checklist_item')
            .delete()
            .eq('fk_id_review', reviewId);

        if (checklistError) {
            console.error('Erro ao deletar itens do checklist:', checklistError);
            // Continua mesmo se não houver itens
        }

        // 3. Deleta a review
        const { data, error } = await supabase
            .from('review')
            .delete()
            .eq('id_review', reviewId);

        if (error) {
            console.error('Erro ao deletar avaliação:', error);
            return {
                success: false,
                error: error.message
            }
        }

        return { success: true, data };

    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        return {
            success: false,
            error: 'Erro ao deletar avaliação'
        }
    }
}