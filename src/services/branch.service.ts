import { getApiUrl } from "@/lib/utils"
import { Branch } from "@/types/branch"

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