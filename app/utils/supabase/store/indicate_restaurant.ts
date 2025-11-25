import { createClient } from "../client";

export async function indicateRestaurant(name: string, address: string, cep: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('draft_restaurant')
        .insert([
            {
                nome_restaurant: name,
                adress_restaurant: address,
                cep: cep
            }
        ]);

    if (error) {
        console.error('Erro ao indicar restaurante:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}

export async function countIndicatedRestaurants() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('draft_restaurant')
        .select('id_rascunho', { count: 'exact' });

    if (error) {
        console.error('Erro ao contar restaurantes indicados:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, count: data?.length || 0 };
}

export async function listIndicatedRestaurants() {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('draft_restaurant')
        .select('*');
    if (error) {
        console.error('Erro ao listar restaurantes indicados:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}

export async function deleteIndicatedRestaurant(id: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('draft_restaurant')
        .delete()
        .eq('id_rascunho', id);

    if (error) {
        console.error('Erro ao deletar restaurante indicado:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}

export async function approveIndicatedRestaurant(name: string, address: string, cep: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('restaurant')
        .insert([
            {
                name_restaurant: name,
                adress_restaurant: address,
                cep: cep
            }
        ]);

    if (error) {
        console.error('Erro ao aprovar restaurante indicado:', error);
        return {
            success: false,
            error: error.message
        }
    }

    return { success: true, data };
}