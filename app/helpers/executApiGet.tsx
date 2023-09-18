interface ApiResponse {
    message: string;
}

export const executeApiGet = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const apiError: ApiResponse = await response.json();
            throw new Error(apiError.message || 'Error desconocido');
        }

        return await response.json();
    } catch (error) {
        throw error;  // Propaga l'error per gestionar-lo on cridis la funció
    }
};