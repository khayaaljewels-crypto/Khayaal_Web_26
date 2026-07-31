import { useEffect, useState } from 'react';
import { fetchProductsByIds } from '@/services/productsApi';

// Batch lookup by id — used wherever only ids were persisted (recently
// viewed, "order again"), replacing the old products.find(id) re-lookup
// against an in-memory catalogue.
export function useProductsByIds(ids) {
  const key = (ids ?? []).join(',');
  const [state, setState] = useState({ products: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    if (!key) {
      setState({ products: [], loading: false, error: null });
      return undefined;
    }

    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProductsByIds(key.split(','))
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ products: [], loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return state;
}
