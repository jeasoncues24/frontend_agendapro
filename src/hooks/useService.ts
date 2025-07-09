import { getServices, getActiveServices } from "@/services/service.service";
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

// Nuevo hook para obtener servicios activos de una sucursal
export const useActiveServices = (establishmentId: string) => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;
    setIsLoading(true);
    getActiveServices(establishmentId)
      .then((data) => {
        // Asegura que siempre sea un array
        if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      })
      .catch((err) => setError(err.message || "Error al cargar los servicios activos"))
      .finally(() => setIsLoading(false));
  }, [establishmentId]);

  return { services, isLoading, error };
};