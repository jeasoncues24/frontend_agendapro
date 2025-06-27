import { Company } from "@/types/company.types";
import Cookies from 'js-cookie';

// Use the production API URL if in production, otherwise use the development URL
const API_URL = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
    : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
    const token = Cookies.get('authtoken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

export const companyService = {
    getCompanyById: async (companyId: string): Promise<Company> => {
        try {
            console.log('Fetching company data from:', `${API_URL}/company/${companyId}`);
            
            const response = await fetch(`${API_URL}/company/${companyId}`, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error fetching company data: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in getCompanyById:', error);
            
            // Handle specific error cases
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en ejecución.');
            }
            
            if (error instanceof Error) {
                throw new Error(`Error al obtener datos de la empresa: ${error.message}`);
            }
            
            throw new Error('Error desconocido al obtener datos de la empresa');
        }
    },

    updateCompany: async (companyId: string, companyData: Partial<Company> | FormData): Promise<Company> => {
        try {
            console.log('Updating company data at:', `${API_URL}/company/${companyId}`);
            
            let headers: HeadersInit = {
                'Authorization': `Bearer ${Cookies.get('authtoken')}`,
            };

            if (!(companyData instanceof FormData)) {
                headers = {
                    ...headers,
                    'Content-Type': 'application/json'
                };
            }
            
            const response = await fetch(`${API_URL}/company/${companyId}`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: companyData instanceof FormData ? companyData : JSON.stringify(companyData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error updating company data: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in updateCompany:', error);
            
            // Handle specific error cases
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el servidor esté en ejecución.');
            }
            
            if (error instanceof Error) {
                throw new Error(`Error al actualizar datos de la empresa: ${error.message}`);
            }
            
            throw new Error('Error desconocido al actualizar datos de la empresa');
        }
    }
}; 