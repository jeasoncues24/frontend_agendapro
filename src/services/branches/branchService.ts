"use client";

import cookies from "js-cookie";

export const getBranchForCompany = async (companyId: string) => {
    try {
        const endpoint = process.env.NODE_ENV === 'production'
                    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
                    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

        const token = cookies.get('authtoken');
        if (!token) {
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
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json()
        const branches = data.data
        console.log(data)

        return {
            branchCompany: branches.map( ( branch: any ) => ({
                ... branch
            }))
        }


    } catch (err: any) {
        return {
            status: false,
            message: 'No se pudo obtener las sucursales de esta empresa'
        }
    }
}