import { useEffect, useState } from 'react';
import { fetchProductFacets } from '@/services/productsApi';

const EMPTY_FACETS = { priceBounds: { min: 0, max: 0 }, occasions: [] };

// Price bounds + filter option lists for the Shop page's filter sidebar —
// Provides the Shop page's price bounds and occasion filter options.
export function useProductFacets() {
  const [state, setState] = useState({ ...EMPTY_FACETS, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchProductFacets()
      .then((facets) => {
        if (!cancelled) setState({ ...facets, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
