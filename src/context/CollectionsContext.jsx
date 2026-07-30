import { createContext, useContext, useEffect, useState } from 'react';
import { COLLECTION_SEED } from '@/data/productSeed';

const CollectionsContext = createContext(null);
const STORAGE_KEY = 'khayaal_collections_v4';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// COLLECTION_SEED is just a list of names (legacy shape) — normalized into
// the full object shape every collection now carries.
const DEFAULT_COLLECTIONS = COLLECTION_SEED.map((name, i) => ({
  id: `col-${i}`,
  name,
  slug: slugify(name),
  description: '',
  image: '',
  hidden: false,
  displayOrder: 0,
}));

export function CollectionsProvider({ children }) {
  const [rawCollections, setCollections] = useState(() => readStored() ?? DEFAULT_COLLECTIONS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawCollections));
  }, [rawCollections]);

  const byDisplayOrder = (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  const collections = [...rawCollections].sort(byDisplayOrder);
  const visibleCollections = collections.filter((c) => c.hidden !== true);

  const addCollection = (data) => {
    const id = `col-${Date.now().toString(36)}`;
    const name = (typeof data === 'string' ? data : data.name)?.trim() ?? '';
    const rest = typeof data === 'string' ? {} : data;
    const slug = rest.slug?.trim() || slugify(name);
    setCollections((prev) => [
      ...prev,
      { id, name, slug, description: '', image: '', hidden: false, displayOrder: 0, ...rest },
    ]);
    return id;
  };

  const updateCollection = (id, patch) =>
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, slug: patch.slug?.trim() || (patch.name ? slugify(patch.name) : c.slug) } : c))
    );

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
