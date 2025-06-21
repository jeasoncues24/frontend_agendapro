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


export const getServices = async ( establishment_id?: string ) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const url = new URL(`${endpoint}/services/${establishment_id}`);

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


export const createServiceS = async (formData: FormData) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const response = await fetch(`${endpoint}/services`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const deleteServiceS = async (id: string) => {
    const endpoint = getEndpoint();
    const token = getToken();
    const response = await fetch(`${endpoint}/services/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "applicaation/json"
        }
    });
    
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const updateServiceS = async (id: string, formData: FormData) => {
    const endpoint = getEndpoint();
    const token = getToken();
    
    // Check if there's a file in the FormData
    const hasFile = formData.has('image') && formData.get('image') instanceof File;
    
    let response;
    
    if (hasFile) {
        // If there's a file, send as FormData
        response = await fetch(`${endpoint}/services/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
    } else {
        // If no file, send as JSON to preserve number types
        const jsonData = {
            name: formData.get('name'),
            duration: Number(formData.get('duration')),
            price: Number(formData.get('price')),
            category_id: formData.get('category_id'),
            status: Number(formData.get('status')),
            establishment_id: formData.get('establishment_id'),
            image: formData.get('image')
        };
        
        response = await fetch(`${endpoint}/services/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        });
    }
    
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}