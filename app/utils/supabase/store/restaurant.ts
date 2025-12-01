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

export async function getRestaurantById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('restaurant')
        .select('*')
        .eq('id_restaurant', id)
        .single();

    if (error) {
        return {
            success: false,
            error: error.message,
            data: null
        };
    }

    return {
        success: true,
        error: null,
        data
    };
}