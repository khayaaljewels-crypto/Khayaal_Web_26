import { useCallback, useEffect, useState } from 'react';
import * as productsApi from '@/services/productsApi';
import { clearProductListCache } from '@/hooks/useProductList';

// Backs the admin ProductList page — filtering/sorting/pagination happen
// server-side (query params), never by loading the full catalogue into the
// browser, so this keeps working the same way whether there are 20 products
// or 20,000.
export function useAdminProducts(filters = {}) {
  const key = JSON.stringify(filters);
  const [state, setState] = useState({
    products: [],
    meta: { page: 1, pageSize: 10, total: 0 },
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { products, meta } = await productsApi.fetchAdminProducts(JSON.parse(key));
      setState({ products, meta, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, [key]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteProduct = async (id) => {
    await productsApi.deleteProduct(id);
    clearProductListCache();
    await refetch();
  };

  const deleteProducts = async (ids) => {
    await productsApi.bulkDeleteProducts(ids);
    clearProductListCache();
    await refetch();
  };

  const bulkUpdate = async (ids, patch) => {
    await productsApi.bulkUpdateProducts(ids, patch);
    clearProductListCache();
    await refetch();
  };

  const duplicateProduct = async (id) => {
    const duplicate = await productsApi.duplicateProduct(id);
    clearProductListCache();
    await refetch();
    return duplicate.id;
  };

  return { ...state, refetch, deleteProduct, deleteProducts, bulkUpdate, duplicateProduct };
}
