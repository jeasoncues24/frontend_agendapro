import { getCategoryServices } from "@/services/categoryservices.service";
import { useState, useEffect } from "react";

export const useCategoryService = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number
) => {
    const [categoryServices, setCategoryServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getCategoryServices(establishmentId)
            .then(res => setCategoryServices(res.data))
            .catch(( err ) => setError(err.message || "Error al cargar las categorias de servicios"))
            .finally(() => setIsLoading(false));

    }, [companyId, establishmentId, refreshKey]);

    return { categoryServices, isLoading, error };
};