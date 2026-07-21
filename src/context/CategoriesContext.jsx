import { createContext, useContext, useEffect, useState } from 'react';
import { CATEGORY_SEED } from '@/data/categorySeed';

const CategoriesContext = createContext(null);
const STORAGE_KEY = 'khayaal_categories_v2';

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

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => readStored() ?? CATEGORY_SEED);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const visibleCategories = categories.filter((c) => c.hidden !== true);

  const addCategory = (data) => {
    const id = `cat-${Date.now().toString(36)}`;
    const slug = data.slug?.trim() || slugify(data.name);
    setCategories((prev) => [...prev, { id, slug, image: '', description: '', hidden: false, ...data }]);
    return id;
  };

  const updateCategory = (id, patch) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, slug: patch.slug?.trim() || (patch.name ? slugify(patch.name) : c.slug) } : c))
    );

  const deleteCategory = (id) => setCategories((prev) => prev.filter((c) => c.id !== id));
  const toggleHidden = (id) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)));

  const getBySlug = (slug) => categories.find((c) => c.slug === slug);

  const value = { categories, visibleCategories, addCategory, updateCategory, deleteCategory, toggleHidden, getBySlug };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
  return ctx;
}
