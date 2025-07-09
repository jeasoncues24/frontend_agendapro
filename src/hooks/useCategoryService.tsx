import { getCategoryServices } from "@/services/categoryservices.service";
import { getCategoryServicesByCollaborator } from "@/services/categoryservices.service";
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

export const useCategoryServicesCollaborator = (
  collaboratorId?: string,
  refreshKey?: number
) => {
  const [categoriesCollaborator, setCategoriesCollaborator] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collaboratorId) return;
    setIsLoading(true);
    getCategoryServicesByCollaborator(collaboratorId)
      .then(res => setCategoriesCollaborator(res.data))
      .catch((err) => setError(err.message || "Error al cargar las categorías del colaborador"))
      .finally(() => setIsLoading(false));
  }, [collaboratorId, refreshKey]);

  return { categoriesCollaborator, isLoading, error };
};