"use client";

import cookies from "js-cookie";

export const getBranchForCompany = async (companyId: string) => {
    console.log("Iniciando getBranchForCompany con companyId:", companyId);
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

        console.log("Enviando petición a:", `${endpoint}/branches/company`);
        console.log("Parámetros:", params);

        const response = await fetch(`${endpoint}/branches/company`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })

        console.log("Respuesta recibida:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta:", errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json()
        console.log("Datos recibidos:", data);

        if (!data.data) {
            console.error("No hay datos en la respuesta");
            throw new Error('No se recibieron datos de la API');
        }

        return {
            branchCompany: data.data
        }

    } catch (err: any) {
        console.error("Error en getBranchForCompany:", err);
        throw err; // Propagar el error para que useBranches pueda manejarlo
    }
}

export const updateBranch = async (branchId: string, branchData: FormData | {
  name: string;
  ubication: string;
  banner_path: string | null;
}) => {
    console.log("Iniciando updateBranch con:", { branchId, branchData });
    try {
        const endpoint = process.env.NODE_ENV === 'production'
                    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
                    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

        const token = cookies.get('authtoken');
        if (!token) {
            throw new Error('Token de autenticación no disponible.');
        }

        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`,
        };

        // Si no es FormData, convertimos a JSON
        if (!(branchData instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${endpoint}/branches/${branchId}`, {
            method: 'PUT',
            headers,
            body: branchData instanceof FormData ? branchData : JSON.stringify(branchData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta:", errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Respuesta de actualización:", data);
        return data;

    } catch (err: any) {
        console.error("Error en updateBranch:", err);
        throw err;
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