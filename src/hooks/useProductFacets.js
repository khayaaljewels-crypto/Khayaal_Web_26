import { useEffect, useState } from 'react';
import { fetchProductFacets } from '@/services/productsApi';

const EMPTY_FACETS = { priceBounds: { min: 0, max: 0 }, occasions: [] };
const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedFacets = null;
let cachedAt = 0;
let inFlight = null;

function getFacets() {
  if (cachedFacets && Date.now() - cachedAt < CACHE_TTL_MS) return Promise.resolve(cachedFacets);
  if (!inFlight) {
    inFlight = fetchProductFacets()
      .then((facets) => {
        cachedFacets = facets;
        cachedAt = Date.now();
        return facets;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

// Price bounds + filter option lists for the Shop page's filter sidebar —
// Provides the Shop page's price bounds and occasion filter options.
export function useProductFacets() {
  const [state, setState] = useState(() =>
    cachedFacets && Date.now() - cachedAt < CACHE_TTL_MS
      ? { ...cachedFacets, loading: false, error: null }
      : { ...EMPTY_FACETS, loading: true, error: null }
  );

  useEffect(() => {
    let cancelled = false;
    getFacets()
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
