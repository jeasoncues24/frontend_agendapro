import { useState, useEffect } from "react";
import { searchCustomers } from "@/services/customer.service";

export const useCustomerSearch = (query: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchCustomers(query)
      .then(data => setResults(Array.isArray(data) ? data : data.data || []))
      .finally(() => setLoading(false));
  }, [query]);

  return { results, loading };
}; 