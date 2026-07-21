import { createContext, useContext, useMemo, useState } from 'react';

const CompareContext = createContext(null);
const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);

  const isComparing = (id) => items.some((item) => item.id === id);

  const toggleCompare = (product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  };

  const removeCompare = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clearCompare = () => setItems([]);

  const count = useMemo(() => items.length, [items]);

  const value = { items, isComparing, toggleCompare, removeCompare, clearCompare, count, max: MAX_COMPARE };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
}
