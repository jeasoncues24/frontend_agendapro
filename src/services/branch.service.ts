import { getApiUrl } from "@/lib/utils"
import { Branch } from "@/types/branch"
import cookies from "js-cookie"

const getEndpoint = () =>
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
      : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

const getToken = () => {
    const token = cookies.get("authtoken");
    if (!token) throw new Error("Token de autenticación no disponible.");
    return token;
};

export const getBranch = async (id: string): Promise<Branch> => {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/branch/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Error al obtener la sucursal')
    }

    return response.json()
} 

export const addBranch = async(data: any) => {
    const endpoint = getEndpoint();
    const token = getToken();

    const response = await fetch(`${endpoint}/branches`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if ( !response.ok ) throw new Error(await response.text());
    return await response.json();
} 

export const getInformationBranch = async ( tradename: string, branch: string ) => {
    const endpoint = getEndpoint();

    const url = new URL(`${endpoint}/branches/information/${tradename}/${branch}`);
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



