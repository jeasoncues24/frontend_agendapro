import { getInformationBranch } from "@/services/branch.service";
import { useEffect, useState } from "react";


export interface CompanyData {
    id: string;
    trade_name: string;
    bussines_name: string;
    phone: string;
    address: string;
    logo_path: string;
}

export interface BranchData {
    id: string;
    name: string;
    ubication: string;
    banner_path: string;
    opening_establishment: number;
}

export interface BranchApiResponse {
    company: CompanyData;
    branch: BranchData;
}


export function useBranchData(tradename: string, branch: string) {
    const [data, setData] = useState<BranchApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tradename || !branch) return;
        setLoading(true);
        getInformationBranch(tradename, branch)
            .then(res => setData(res.data))
            .catch((err) => setError(err.message || "Error al obtener la información de la sucursal"))
            .finally(() => setLoading(false));
    }, [tradename, branch]);

    return { data, loading, error };
}