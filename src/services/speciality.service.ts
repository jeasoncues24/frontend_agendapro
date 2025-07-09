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


export const getSpeciality = async ( establishment_id?: string ) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/speciality/${establishment_id}`);

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


export const getSpecialityCollaborator = async ( collaborator_id?: string ) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/speciality/collaborator/${collaborator_id}`);

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
