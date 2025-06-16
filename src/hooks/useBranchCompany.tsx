import { getBranchForCompany } from "@/services/branches/branchService";
import { useState, useEffect } from "react";

interface Branch {
    value: string;
    label: string;
    name?: string;
    ubication?: string;
}

export const useBranches = (companyId: string) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setIsLoading(true);
                const data = await getBranchForCompany(companyId);
                if (data && data.branchCompany && Array.isArray(data.branchCompany)) {
                    setBranches(
                        data.branchCompany.map((branch: any) => ({
                            value: branch.id,
                            label: branch.name,
                            name: branch.name,
                            ubication: branch.ubication
                        }))
                    );
                } else {
                    setError("No se encontraron sucursales.");
                }
            } catch (err: any) {
                setError(err.message || "Error al obtener las sucursales.");
            } finally {
                setIsLoading(false);
            }
        };

        if (companyId) fetchBranches();
    }, [companyId]);
    


    return { branches, isLoading, error };
};
