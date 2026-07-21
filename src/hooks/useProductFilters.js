import { useMemo, useState, useCallback } from 'react';
import { useProducts } from '@/context/ProductsContext';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Best Discount' },
];

export { SORT_OPTIONS };

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function useProductFilters(products, initial = {}) {
  const { priceBounds } = useProducts();

  const defaultFilters = useMemo(
    () => ({
      search: '',
      categories: [],
      collections: [],
      materials: [],
      stones: [],
      colors: [],
      occasions: [],
      availability: 'all', // all | in-stock | out-of-stock
      minRating: 0,
      minDiscount: 0,
      priceRange: [priceBounds.min, priceBounds.max],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filters, setFilters] = useState({ ...defaultFilters, ...initial });
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('grid');

  const setSearch = useCallback((search) => setFilters((f) => ({ ...f, search })), []);

  const toggleFilter = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: toggleInArray(f[key], value) }));
  }, []);

  const setAvailability = useCallback((availability) => setFilters((f) => ({ ...f, availability })), []);
  const setMinRating = useCallback((minRating) => setFilters((f) => ({ ...f, minRating })), []);
  const setMinDiscount = useCallback((minDiscount) => setFilters((f) => ({ ...f, minDiscount })), []);
  const setPriceRange = useCallback((priceRange) => setFilters((f) => ({ ...f, priceRange })), []);

  const clearAll = useCallback(() => setFilters({ ...defaultFilters }), [defaultFilters]);

  const patchFilters = useCallback((partial) => setFilters((f) => ({ ...f, ...partial })), []);

  const removeChip = useCallback(
    (key, value) => {
      setFilters((f) => {
        if (key === 'availability') return { ...f, availability: 'all' };
        if (key === 'minRating') return { ...f, minRating: 0 };
        if (key === 'minDiscount') return { ...f, minDiscount: 0 };
        if (key === 'priceRange') return { ...f, priceRange: [priceBounds.min, priceBounds.max] };
        if (key === 'search') return { ...f, search: '' };
        return { ...f, [key]: f[key].filter((v) => v !== value) };
      });
    },
    [priceBounds]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !p.material.toLowerCase().includes(q) &&
          !p.stone.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.collections.length && !filters.collections.includes(p.collection)) return false;
      if (filters.materials.length && !filters.materials.includes(p.material)) return false;
      if (filters.stones.length && !filters.stones.includes(p.stone)) return false;
      if (filters.colors.length && !filters.colors.includes(p.color)) return false;
      if (filters.occasions.length && !filters.occasions.includes(p.occasion)) return false;
      if (filters.availability === 'in-stock' && !p.inStock) return false;
      if (filters.availability === 'out-of-stock' && p.inStock) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.minDiscount > 0 && p.discount < filters.minDiscount) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      return true;
    });

    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        list = [...list].sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    return list;
  }, [products, filters, sort]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.search.trim()) chips.push({ key: 'search', label: `"${filters.search.trim()}"` });
    filters.categories.forEach((v) => chips.push({ key: 'categories', value: v, label: v.replace(/-/g, ' ') }));
    filters.collections.forEach((v) => chips.push({ key: 'collections', value: v, label: v }));
    filters.materials.forEach((v) => chips.push({ key: 'materials', value: v, label: v }));
    filters.stones.forEach((v) => chips.push({ key: 'stones', value: v, label: v }));
    filters.colors.forEach((v) => chips.push({ key: 'colors', value: v, label: v }));
    filters.occasions.forEach((v) => chips.push({ key: 'occasions', value: v, label: v.replace(/-/g, ' ') }));
    if (filters.availability !== 'all') {
      chips.push({ key: 'availability', label: filters.availability === 'in-stock' ? 'In Stock' : 'Out of Stock' });
    }
    if (filters.minRating > 0) chips.push({ key: 'minRating', label: `${filters.minRating}★ & up` });
    if (filters.minDiscount > 0) chips.push({ key: 'minDiscount', label: `${filters.minDiscount}% off & up` });
    if (filters.priceRange[0] !== priceBounds.min || filters.priceRange[1] !== priceBounds.max) {
      chips.push({ key: 'priceRange', label: `₹${filters.priceRange[0]} – ₹${filters.priceRange[1]}` });
    }
    return chips;
  }, [filters, priceBounds]);

  return {
    filters,
    setSearch,
    toggleFilter,
    setAvailability,
    setMinRating,
    setMinDiscount,
    setPriceRange,
    clearAll,
    patchFilters,
    removeChip,
    activeChips,
    sort,
    setSort,
    view,
    setView,
    filtered,
  };
}
