import { useState, useEffect } from "react";
import { getQuotesByEstablishment, createQuoteApi } from "@/services/quotes.service";

export const useQuotes = (establishmentId?: string, refreshKey?: number) => {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!establishmentId) return;
        setIsLoading(true);
        getQuotesByEstablishment(establishmentId)
            .then((res) => setQuotes(res.data || res))
            .catch((err) => setError(err.message || "Error al cargar las citas"))
            .finally(() => setIsLoading(false));
    }, [establishmentId, refreshKey]);

    return { quotes, isLoading, error };
};

export const useCreateQuote = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await createQuoteApi(data);
            setLoading(false);
            return res;
        } catch (err: any) {
            setError(err.message || 'Error al crear la cita');
            setLoading(false);
            throw err;
        }
    };

    return { create, loading, error };
}; 