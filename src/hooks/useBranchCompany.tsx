import { getBranchForCompany } from "@/services/branches/branchService";
import { useState, useEffect } from "react";
import { Branch } from "@/types/branch";

export const useBranches = (companyId: string, refreshKey?: number) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) return;
        setIsLoading(true);
        getBranchForCompany(companyId)
            .then((data) => {
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
                    setBranches(mappedBranches);
                    setError(null);
                } else {
                    console.log("No se encontraron sucursales en la respuesta");
                    setError("No se encontraron sucursales.");
                }
            })
            .catch((err) => {
                console.error("Error en fetchBranches:", err);
                setError(err.message || "Error al obtener las sucursales.");
            })
            .finally(() => setIsLoading(false));
    }, [companyId, refreshKey]);
    


    return { branches, isLoading, error };
};
