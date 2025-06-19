import { useState, useEffect } from "react";
import { getUsers } from "@/services/user.service";

export const useUsers = (
  companyId: string,
  establishmentId?: string,
  refreshKey?: number 
) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;
    setIsLoading(true);
    getUsers(companyId, establishmentId)
      .then(setUsers)
      .catch((err) => setError(err.message || "Error al cargar usuarios"))
      .finally(() => setIsLoading(false));
  }, [companyId, establishmentId, refreshKey]); 

  return { users, isLoading, error };
};