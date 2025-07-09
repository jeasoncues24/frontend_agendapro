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

export const getCategoryServices = async (establishment_id?: string) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/category-service/${establishment_id}`);

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


export const createCategoryService = async (data: any) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const response = await fetch(`${endpoint}/category-service`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
};


export const updateCategoryService = async (id: string, data: any) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const response = await fetch(`${endpoint}/category-service/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}


export const deleteCategoryService = async (id: string) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const response = await fetch(`${endpoint}/category-service/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const listCategoriesActives = async (establishment_id: string) => {
    const endpoint = getEndpoint();
    const response = await fetch(`${endpoint}/category-service/actives/${establishment_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const getCategoryServicesByCollaborator = async (collaborator_id: string) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const url = new URL(`${endpoint}/category-service/collaborator/list/${collaborator_id}`);
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
