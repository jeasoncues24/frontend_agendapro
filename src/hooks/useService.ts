
import { getServices } from "@/services/service.service";
import { useState, useEffect } from "react";

export const useService = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number
) => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getServices(establishmentId)
            .then(res => setServices(res.data))
            .catch(( err ) => setError(err.message || "Error al cargar los servicios"))
            .finally(() => setIsLoading(false));

    }, [companyId, establishmentId, refreshKey]);

    return { services, isLoading, error };
};