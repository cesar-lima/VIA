import { createClient } from "../client";

export async function getRestaurants() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('restaurant')
        .select('*');

    if (error) {
        console.error('Erro ao buscar restaurantes:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}