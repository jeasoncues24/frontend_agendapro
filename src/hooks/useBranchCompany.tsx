import { getBranchForCompany } from "@/services/branches/branchService";
import { useState, useEffect } from "react";
import { Branch } from "@/types/branch";

export const useBranches = (companyId: string) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            console.log("Iniciando fetchBranches con companyId:", companyId);
            try {
                setIsLoading(true);
                const data = await getBranchForCompany(companyId);
                console.log("Respuesta de getBranchForCompany:", data);

                if (data && data.branchCompany && Array.isArray(data.branchCompany)) {
                    const mappedBranches = data.branchCompany.map((branch: any) => ({
                        id: branch.id,
                        name: branch.name,
                        address: branch.ubication,
                        phone: branch.phone || '',
                        email: branch.email || '',
                        company_id: branch.company_id || '',
                        created_at: branch.created_at || '',
                        updated_at: branch.updated_at || '',
                    }));
                    console.log("Branches mapeados:", mappedBranches);
                    setBranches(mappedBranches);
                } else {
                    console.log("No se encontraron sucursales en la respuesta");
                    setError("No se encontraron sucursales.");
                }
            } catch (err: any) {
                console.error("Error en fetchBranches:", err);
                setError(err.message || "Error al obtener las sucursales.");
            } finally {
                console.log("Finalizando fetchBranches, estableciendo isLoading a false");
                setIsLoading(false);
            }
        };

        if (companyId) {
            console.log("companyId existe, llamando a fetchBranches");
            fetchBranches();
        } else {
            console.log("companyId no existe");
            setIsLoading(false);
        }
    }, [companyId]);
    


    return { branches, isLoading, error };
};
