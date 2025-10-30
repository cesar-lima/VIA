import { getAllUsers, getUserByEmail } from '@/app/utils/supabase/store/user'

export async function GET() {
    // try {
    //     const users = await getAllUsers()
    //     return Response.json({ success: true, data: users })
    // } catch (error) {
    //     return Response.json({ 
    //         success: false, 
    //         error: String(error) 
    //     }, { status: 500 })
    // }
    try {
        const user = await getUserByEmail();

        console.log('Usuário buscado:', user);

        return Response.json({ success: user.success, data: user || user.error })
    } catch (error) {
        console.log('Erro ao buscar usuário:', error);
        return Response.json({ 
            success: false, 
            error: String(error) 
        }, { status: 500 })
    }
}