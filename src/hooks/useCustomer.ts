import { getCustomers } from "@/services/customer.service";
import { useState, useEffect } from "react";

export const useCustomers = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number 
) => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getCustomers(establishmentId)
            .then( res => setCustomers(res.data) )
            .catch(( err ) => setError(err.message || "Error al cargar los clientes"))
            .finally(() => setIsLoading(false));
    }, [companyId, establishmentId, refreshKey]);

    return { customers, isLoading, error };
};