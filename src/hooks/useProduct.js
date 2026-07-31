import { useEffect, useState } from 'react';
import { fetchProduct } from '@/services/productsApi';

// Single round trip for the Product Details page — the API returns the
// product plus related/completeTheLook computed server-side, so this is
// the only fetch that page needs for its main content.
export function useProduct(slug) {
  const [state, setState] = useState({
    product: null,
    related: [],
    completeTheLook: [],
    loading: true,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null, notFound: false }));

    fetchProduct(slug)
      .then(({ product, related, completeTheLook }) => {
        if (!cancelled) setState({ product, related, completeTheLook, loading: false, error: null, notFound: false });
      })
      .catch((err) => {
        if (cancelled) return;
        const notFound = /not found/i.test(err.message);
        setState((s) => ({ ...s, loading: false, error: notFound ? null : err.message, notFound }));
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}
