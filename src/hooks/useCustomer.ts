import { getCustomers, createCustomerApi, getActiveCustomersApi } from "@/services/customer.service";
import { useState, useEffect } from "react";

export const useCustomers = (
    companyId: string,
    establishmentId?: string,
    refreshKey?: number 
) => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ( !companyId ) return;
        setIsLoading(true);
        getCustomers(establishmentId)
            .then( res => setCustomers(res.data) )
            .catch(( err ) => setError(err.message || "Error al cargar los clientes"))
            .finally(() => setIsLoading(false));
    }, [companyId, establishmentId, refreshKey]);

    return { customers, isLoading, error };
};

export const useCreateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: { name: string; phone: string; email: string; establishment_id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createCustomerApi(data);
      setLoading(false);
      return res;
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error };
};

export const useActiveCustomers = (establishmentId: string) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;
    setLoading(true);
    setError(null);
    getActiveCustomersApi(establishmentId)
      .then(res => setCustomers(Array.isArray(res) ? res : res.data || []))
      .catch(err => setError(err.message || 'Error al cargar clientes activos'))
      .finally(() => setLoading(false));
  }, [establishmentId]);

  return { customers, loading, error };
};