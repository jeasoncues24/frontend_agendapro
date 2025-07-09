import { useState, useEffect } from "react";
import { getAvailableProfessionals } from "@/services/availability.service";

export const useAvailableProfessionals = (
  establishmentId: string,
  serviceId: string,
  date: string, // formato YYYY-MM-DD
  time: string  // formato HH:mm
) => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId || !serviceId || !date || !time) {
      setProfessionals([]);
      return;
    }
    setIsLoading(true);
    getAvailableProfessionals(establishmentId, serviceId, date, time)
      .then(setProfessionals)
      .catch(err => setError(err.message || "Error al cargar profesionales"))
      .finally(() => setIsLoading(false));
  }, [establishmentId, serviceId, date, time]);

  return { professionals, isLoading, error };
}; 