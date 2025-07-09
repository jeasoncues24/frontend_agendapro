import cookies from "js-cookie";

const getEndpoint = () =>
    process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
        : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

const getToken = () => {
    const token = cookies.get('authtoken');
    if (!token) throw new Error("Token de autenticación no disponible.");
    return token;
};

export const getQuotesByEstablishment = async (establishmentId?: string) => {
    if (!establishmentId) throw new Error("EstablishmentId es requerido");
    const endpoint = getEndpoint();
    const token = getToken();
    const url = `${endpoint}/quotes/${establishmentId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }
    return await response.json();
};

export const createQuoteApi = async (data: any) => {
    const endpoint = getEndpoint();
    const response = await fetch(`${endpoint}/quotes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}; 