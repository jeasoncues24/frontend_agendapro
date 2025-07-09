import { useState } from "react";
import { assignShiftsToUser } from "@/services/shift.service";

export const useAssignShifts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assign = async (userId: string, shiftIds: string[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await assignShiftsToUser(userId, shiftIds);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al asignar turnos");
    } finally {
      setLoading(false);
    }
  };

  return { assign, loading, error, success };
}; 