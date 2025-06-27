import { useEffect, useState } from "react";
import { getProductsForSale } from "@/services/service.service";

export interface ProductForSale {
  id: string;
  name: string;
  duration: number;
  price: number;
  establishment_id: string;
  category_id: string;
  image: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export function useProductsForSale(sucursalId: string, categoryId: string) {
  const [products, setProducts] = useState<ProductForSale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sucursalId) return;
    setLoading(true);
    setError(null);
    getProductsForSale(sucursalId, categoryId)
      .then((res: any) => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setError("Error al cargar servicios");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [sucursalId, categoryId]);

  return { products, loading, error };
} 