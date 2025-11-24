import { createClient } from "../client";

export async function getReviewsByRestaurantId(restaurantId: string) {
    const supabase = createClient();

    // Cols: id_review, fk_id_user, fk_id_restaurant, rating_review, comment, created_at
    const { data, error } = await supabase
        .from('review')
        .select(`
            *,
            user:fk_id_user (
                nome_user,
                nickname
            )
        `)
        .eq('fk_id_restaurant', restaurantId);

    if (error) {
        console.error('Erro ao buscar avaliações:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}