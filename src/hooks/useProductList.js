import { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/productsApi';

// Module-level (survives across component instances/unmounts, not just a
// single hook call) so repeat requests for the same filters within the TTL
// skip the network entirely. Concretely fixes: FeaturedCategories renders up
// to 6 CategoryTile instances, each calling this once just for a "N Designs"
// count, plus Home's own Best-Sellers/New-Arrivals calls — without this,
// every single Home visit re-fires all of them from scratch.
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map(); // key -> { data: { products, meta }, expiresAt }

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// Called after any admin product mutation (create/update/delete/bulk) so a
// storefront view in the same tab (e.g. clicking "View Site" right after
// editing a product) never serves a stale cached list — see
// admin/hooks/useAdminProducts.js and admin/pages/products/ProductForm.jsx.
export function clearProductListCache() {
  cache.clear();
}

// filters is any plain object accepted by GET /products (page, pageSize,
// search, category, collection, material[], stone[], color[], occasion[],
// minPrice, maxPrice, minRating, sort). Serialized to a stable key so
// callers can pass a fresh object literal every render without triggering
// an extra fetch.
export function useProductList(filters = {}) {
  const key = JSON.stringify(filters);
  const [state, setState] = useState(() => {
    const cached = getCached(key);
    return cached
      ? { products: cached.products, meta: cached.meta, loading: false, error: null }
      : { products: [], meta: { page: 1, pageSize: 12, total: 0 }, loading: true, error: null };
  });

  useEffect(() => {
    const cached = getCached(key);
    if (cached) {
      setState({ products: cached.products, meta: cached.meta, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProducts(JSON.parse(key))
      .then(({ products, meta }) => {
        setCached(key, { products, meta });
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
