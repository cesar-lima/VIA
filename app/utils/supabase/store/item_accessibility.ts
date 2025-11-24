import { createClient } from "../client";

//cols: id_cr, item_classify, item_review
export async function getItensAccessibility() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('checklist_review')
        .select('*');
        
    if (error) {
        console.error('Erro ao buscar itens de acessibilidade:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}

//cols: id_review, id_cr
export async function getItemAccessibilityByReviewId(reviewId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('review_checklist_item')
        .select(`
            *,
            checklist_review (
                id_cr,
                item_classify,
                item_review
            )
        `)
        .eq('fk_id_review', reviewId);
        
    if (error) {
        console.error('Erro ao buscar itens de acessibilidade por avaliação:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}