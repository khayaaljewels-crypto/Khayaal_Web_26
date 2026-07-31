import { useEffect, useState } from 'react';
import { useProductsByIds } from '@/hooks/useProductsByIds';

const STORAGE_KEY = 'khayaal_recently_viewed';
const MAX_ITEMS = 12;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(productId) {
  const ids = readStored().filter((id) => id !== productId);
  ids.unshift(productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
}

export function useRecentlyViewed(excludeId) {
  const [ids, setIds] = useState(readStored);

  useEffect(() => {
    const onStorage = () => setIds(readStored());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lookupIds = ids.filter((id) => id !== excludeId);
  const { products } = useProductsByIds(lookupIds);

  // Batch-fetched, so re-sort into the original most-recent-first order and
  // drop any id that no longer resolves (deleted/unpublished product) —
  // same behavior as the old products.find(...).filter(Boolean) re-lookup.
  return lookupIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
}
