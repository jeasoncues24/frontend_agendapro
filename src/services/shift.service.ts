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

export const listShifts = async ( establishment_id: string ) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/shift/${establishment_id}`);

    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}

export const listShiftsQuotes = async (establishmentId: string) => {
    const endpoint = getEndpoint();
    const url = new URL(`${endpoint}/shift/${establishmentId}`);

    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log("entra aquiiiiii")
    const data = await response.json();
    if (Array.isArray(data)) return data;

    if (Array.isArray(data.data)) return data.data;
    return [];
};

export const getUserShifts = async (user_id: string) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/shift/user/${user_id}`);

    const response = await fetch(url.toString(), {
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
}

export const assignShiftsToUser = async (user_id: string, shift_ids: string[]) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/shift/assign`);

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, shift_ids })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
}