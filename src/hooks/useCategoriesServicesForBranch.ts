import { listCategoriesActives } from "@/services/categoryservices.service";
import { useEffect, useState } from "react";


export function useCategoriesServicesForBranch( establishment_id: string ) {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("[useCategoriesServicesForBranch] establishment_id:", establishment_id);
        if ( !establishment_id ) return;
        setLoading(true);
        listCategoriesActives(establishment_id)
            .then(res => {
                console.log("[useCategoriesServicesForBranch] Respuesta de categorías:", res);
                if (res && res.data) {
                    setData(res.data);
                } else {
                    setData([]);
                }
            })
            .catch((err) => {
                setError(err.message || "Error al obtener las categorias de servicios de la sucursal");
                setData([]);
            })
            .finally(() => setLoading(false));
    }, [establishment_id])

    return { data, loading, error };
}