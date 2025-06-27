"use client";

import cookies from "js-cookie";

export const getBranchForCompany = async (companyId: string) => {
    try {
        const endpoint = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
            : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

        console.log("Endpoint:", endpoint);

        const token = cookies.get('authtoken');
        if (!token) {
            console.error("No hay token de autenticación");
            throw new Error('Token de autenticación no disponible.');
        }

        const params = {
            companyId
        }


        const response = await fetch(`${endpoint}/branches/company`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })


        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json()

        if (!data.data) {
            throw new Error('No se recibieron datos de la API');
        }

        return {
            branchCompany: data.data
        }

    } catch (err: any) {
        throw err;
    }
}

export const updateBranch = async (
    branchId: string,
    branchData:
        | FormData
        | {
            name: string
            ubication: string
            banner_path: string | null
        },
) => {

    try {
        const endpoint =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
                : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV


        const token = cookies.get("authtoken")
        if (!token) {
            throw new Error("Token de autenticación no disponible.")
        }

        const headers: HeadersInit = {
            Authorization: `Bearer ${token}`,
        }

        let body: FormData | string

        if (branchData instanceof FormData) {
            body = branchData
            for (const [key, value] of branchData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
                } else {
                    console.log(`${key}: ${value}`)
                }
            }
        } else {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(branchData)
        }


        const response = await fetch(`${endpoint}/branches/${branchId}`, {
            method: "PUT",
            headers,
            body,
        })


        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()
        return data
    } catch (err: any) {
        throw err
    }
}

export const getBranchDetails = async (branchId: string) => {
    try {
        const endpoint = process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
            : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

        const token = cookies.get('authtoken');
        if (!token) {
            throw new Error('Token de autenticación no disponible.');
        }

        const response = await fetch(`${endpoint}/branches/${branchId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });


        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta:", errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (!responseData.status || !responseData.data) {
            throw new Error("Formato de respuesta inválido");
        }

        return responseData.data;

    } catch (err: any) {
        throw err;
    }
}

export const deleteBranch = async (branchId: string) => {
    const endpoint = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
        : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

    const token = cookies.get('authtoken');
    if (!token) {
        throw new Error('Token de autenticación no disponible.');
    }

    const response = await fetch(`${endpoint}/branches/${branchId}`, {
        method: 'DELETE',
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