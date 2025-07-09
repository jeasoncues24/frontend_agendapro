import { useState, useEffect } from "react";
import { listShifts, listShiftsQuotes } from "@/services/shift.service";

export const useShift = (
    establishmentId: string,
    refreshKey?: number
) => {
    const [shift, setShift] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !establishmentId ) return;
        setIsLoading(true);
        listShifts(establishmentId)
            .then(res => setShift(Array.isArray(res) ? res : res.data || []))
            .catch(( err ) => setError(err.message || "Error al cargar los turnos de la sucursal"))
            .finally(() => setIsLoading(false));

    }, [establishmentId, refreshKey]);

    return { shift, isLoading, error };
};



export const useShiftsQuotes = (establishmentId: string) => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;
    setIsLoading(true);
    listShiftsQuotes(establishmentId)
      .then(setShifts)
      .catch((err) => setError(err.message || "Error al cargar los turnos"))
      .finally(() => setIsLoading(false));
  }, [establishmentId]);

  return { shifts, isLoading, error };
};
