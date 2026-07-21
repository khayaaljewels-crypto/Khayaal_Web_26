import { createContext, useContext, useEffect, useState } from 'react';
import { COLLECTION_SEED } from '@/data/productSeed';

const CollectionsContext = createContext(null);
const STORAGE_KEY = 'khayaal_collections_v1';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const DEFAULT_COLLECTIONS = COLLECTION_SEED.map((name, i) => ({ id: `col-${i}`, name, hidden: false }));

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState(() => readStored() ?? DEFAULT_COLLECTIONS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const visibleCollections = collections.filter((c) => c.hidden !== true);

  const addCollection = (name) => {
    const id = `col-${Date.now().toString(36)}`;
    setCollections((prev) => [...prev, { id, name, hidden: false }]);
    return id;
  };

  const updateCollection = (id, patch) => setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const deleteCollection = (id) => setCollections((prev) => prev.filter((c) => c.id !== id));
  const toggleHidden = (id) => setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)));

  const value = { collections, visibleCollections, addCollection, updateCollection, deleteCollection, toggleHidden };

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error('useCollections must be used within a CollectionsProvider');
  return ctx;
}
