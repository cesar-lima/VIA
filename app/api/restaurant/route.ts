import { getRestaurants } from "@/app/utils/supabase/store/restaurant";

export async function GET() {
    try {
        const restaurantResponse = await getRestaurants();

        return Response.json({
            success: true,
            data: restaurantResponse
        });

    } catch (error) {
        console.log('Erro ao buscar restaurantes:', error);
        return Response.json({
            success: false,
            error: String(error)
        }, { status: 500 })
    }
}