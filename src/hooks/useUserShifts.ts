import { useState, useEffect } from "react";
import { getUserShifts } from "@/services/shift.service";

export const useUserShifts = (userId?: string) => {
  const [userShifts, setUserShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    getUserShifts(userId)
      .then(res => setUserShifts(Array.isArray(res) ? res : res.data || []))
      .catch(err => setError(err.message || "Error al cargar los turnos del usuario"))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { userShifts, isLoading, error };
}; 