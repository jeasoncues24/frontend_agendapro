import { useState, useEffect } from "react";
import { getQuotesStats } from "@/services/quotesStats.service";

export function useQuotesStats(establishmentId?: string, date?: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;
    setLoading(true);
    getQuotesStats(establishmentId, date)
      .then(setStats)
      .catch(err => setError(err.message || "Error al cargar estadísticas"))
      .finally(() => setLoading(false));
  }, [establishmentId, date]);

  return { stats, loading, error };
} 