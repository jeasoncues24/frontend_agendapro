import { useState, useEffect } from 'react';
import { Company } from '@/types/company.types';
import { companyService } from '@/services/company.service';
import { customToast } from '@/components/ui/custom-toast';

export const useCompany = (companyId: string) => {
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanyData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await companyService.getCompanyById(companyId);
            setCompanyData(data);
        } catch (err) {
            setError('Error al cargar los datos de la empresa');
            customToast.error({
                title: "Error",
                description: "No se pudieron cargar los datos de la empresa",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateCompany = async (updatedData: Partial<Company> | FormData) => { 
        try {
            setIsLoading(true);
            setError(null);
            const data = await companyService.updateCompany(companyId, updatedData);
            setCompanyData(data);
            customToast.success({
                title: "Éxito",
                description: "Los datos de la empresa se actualizaron correctamente",
            });
            return data;
        } catch (err) {
            setError('Error al actualizar los datos de la empresa');
            customToast.error({
                title: "Error",
                description: "No se pudieron actualizar los datos de la empresa",
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [companyId]);

    return {
        companyData,
        isLoading,
        error,
        updateCompany,
        refreshData: fetchCompanyData,
    };
}; 