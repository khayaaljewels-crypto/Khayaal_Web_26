import { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/productsApi';

// filters is any plain object accepted by GET /products (page, pageSize,
// search, category, collection, material[], stone[], color[], occasion[],
// minPrice, maxPrice, minRating, sort). Serialized to a stable key so
// callers can pass a fresh object literal every render without triggering
// an extra fetch.
export function useProductList(filters = {}) {
  const key = JSON.stringify(filters);
  const [state, setState] = useState({
    products: [],
    meta: { page: 1, pageSize: 12, total: 0 },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProducts(JSON.parse(key))
      .then(({ products, meta }) => {
        if (!cancelled) setState({ products, meta, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}
