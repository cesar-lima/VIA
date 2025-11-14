// Função para calcular distância aproximada entre CEPs
// Considera apenas os primeiros 5 dígitos (região)
export function calculateCepDistance(cep1: string, cep2: string): number {
    const cleanCep1 = cep1.replace(/\D/g, '');
    const cleanCep2 = cep2.replace(/\D/g, '');
    
    if (cleanCep1.length < 5 || cleanCep2.length < 5) {
        return 999999; // Distância máxima para CEPs inválidos
    }
    
    // Pega os 5 primeiros dígitos (região)
    const region1 = parseInt(cleanCep1.substring(0, 5));
    const region2 = parseInt(cleanCep2.substring(0, 5));
    
    // Diferença absoluta como aproximação de distância
    return Math.abs(region1 - region2);
}

export function sortRestaurantsByProximity(
    restaurants: any[], 
    userCep: string
): any[] {
    if (!userCep) return restaurants;
    
    return [...restaurants].sort((a, b) => {
        const distA = calculateCepDistance(userCep, a.cep);
        const distB = calculateCepDistance(userCep, b.cep);
        return distA - distB;
    });
}