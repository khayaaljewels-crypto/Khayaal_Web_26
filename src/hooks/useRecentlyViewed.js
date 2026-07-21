import { useEffect, useState } from 'react';
import { useProducts } from '@/context/ProductsContext';

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
  const { products } = useProducts();

  useEffect(() => {
    const onStorage = () => setIds(readStored());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
}
