import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProductFacets } from '@/hooks/useProductFacets';
import { fetchProducts } from '@/services/productsApi';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Best Discount' },
];

export { SORT_OPTIONS };

const SORT_TO_API = {
  featured: 'newest',
  newest: 'newest',
  'price-asc': 'price-asc',
  'price-desc': 'price-desc',
  rating: 'rating',
  discount: 'discount',
};

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const BASE_FILTERS = {
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
  priceRange: null, // adopts the real bounds once facets load — see below
};

// baseParams: extra fixed filters merged into every request (e.g. Shop.jsx
// passes { isBestSeller: true } for the "?filter=bestsellers" view).
// Filtering/sorting/pagination all happen server-side now — this hook never
// holds more than one page of products in memory, so it keeps working the
// same way at 20 products or 20,000.
export function useProductFilters(baseParams = {}, { pageSize = 12 } = {}) {
  const facets = useProductFacets();
  const [filters, setFilters] = useState(BASE_FILTERS);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('grid');

  const [mode, setMode] = useState('infinite'); // 'infinite' | 'pages'
  const [page, setPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState(1);
  const [accumulated, setAccumulated] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Adopts the real price bounds once facets load, unless the user already
  // moved the slider (priceRange stays non-null after their first change).
  useEffect(() => {
    if (!facets.loading && filters.priceRange === null) {
      setFilters((f) => ({ ...f, priceRange: [facets.priceBounds.min, facets.priceBounds.max] }));
    }
  }, [facets.loading, facets.priceBounds, filters.priceRange]);

  const setSearch = useCallback((search) => setFilters((f) => ({ ...f, search })), []);
  const toggleFilter = useCallback((key, value) => setFilters((f) => ({ ...f, [key]: toggleInArray(f[key], value) })), []);
  const setAvailability = useCallback((availability) => setFilters((f) => ({ ...f, availability })), []);
  const setMinRating = useCallback((minRating) => setFilters((f) => ({ ...f, minRating })), []);
  const setMinDiscount = useCallback((minDiscount) => setFilters((f) => ({ ...f, minDiscount })), []);
  const setPriceRange = useCallback((priceRange) => setFilters((f) => ({ ...f, priceRange })), []);

  const clearAll = useCallback(
    () => setFilters({ ...BASE_FILTERS, priceRange: [facets.priceBounds.min, facets.priceBounds.max] }),
    [facets.priceBounds]
  );

  const patchFilters = useCallback((partial) => setFilters((f) => ({ ...f, ...partial })), []);

  const removeChip = useCallback(
    (key, value) => {
      setFilters((f) => {
        if (key === 'availability') return { ...f, availability: 'all' };
        if (key === 'minRating') return { ...f, minRating: 0 };
        if (key === 'minDiscount') return { ...f, minDiscount: 0 };
        if (key === 'priceRange') return { ...f, priceRange: [facets.priceBounds.min, facets.priceBounds.max] };
        if (key === 'search') return { ...f, search: '' };
        return { ...f, [key]: f[key].filter((v) => v !== value) };
      });
    },
    [facets.priceBounds]
  );

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        baseParams,
        search: filters.search,
        categories: filters.categories,
        collections: filters.collections,
        materials: filters.materials,
        stones: filters.stones,
        colors: filters.colors,
        occasions: filters.occasions,
        availability: filters.availability,
        minRating: filters.minRating,
        minDiscount: filters.minDiscount,
        priceRange: filters.priceRange,
        sort,
      }),
    [baseParams, filters, sort]
  );

  const buildParams = useCallback(
    (targetPage, targetPageSize) => {
      const f = JSON.parse(requestKey);
      return {
        ...f.baseParams,
        page: targetPage,
        pageSize: targetPageSize,
        search: f.search || undefined,
        category: f.categories,
        collection: f.collections,
        material: f.materials,
        stone: f.stones,
        color: f.colors,
        occasion: f.occasions,
        availability: f.availability !== 'all' ? f.availability : undefined,
        minRating: f.minRating || undefined,
        minDiscount: f.minDiscount || undefined,
        minPrice: f.priceRange?.[0],
        maxPrice: f.priceRange?.[1],
        sort: SORT_TO_API[f.sort] ?? 'newest',
      };
    },
    [requestKey]
  );

  // Any filter/sort change resets pagination and refetches from page 1.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPage(1);
    setLoadedPages(1);

    fetchProducts(buildParams(1, pageSize))
      .then(({ products, meta }) => {
        if (cancelled) return;
        setAccumulated(products);
        setTotal(meta.total);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, pageSize]);

  const goToPage = useCallback(
    (targetPage) => {
      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const clamped = Math.min(Math.max(1, targetPage), pageCount);
      setPage(clamped);
      setLoading(true);
      fetchProducts(buildParams(clamped, pageSize))
        .then(({ products, meta }) => {
          setAccumulated(products);
          setTotal(meta.total);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [buildParams, pageSize, total]
  );

  const loadMore = useCallback(() => {
    const nextPage = loadedPages + 1;
    setLoading(true);
    fetchProducts(buildParams(nextPage, pageSize))
      .then(({ products, meta }) => {
        setAccumulated((prev) => [...prev, ...products]);
        setTotal(meta.total);
        setLoadedPages(nextPage);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [buildParams, loadedPages, pageSize]);

  const setModeAndReset = useCallback((nextMode) => {
    setMode(nextMode);
    setPage(1);
    setLoadedPages(1);
  }, []);

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
    if (
      filters.priceRange &&
      (filters.priceRange[0] !== facets.priceBounds.min || filters.priceRange[1] !== facets.priceBounds.max)
    ) {
      chips.push({ key: 'priceRange', label: `₹${filters.priceRange[0]} – ₹${filters.priceRange[1]}` });
    }
    return chips;
  }, [filters, facets.priceBounds]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

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
    loading,
    error,
    // Pagination — folds in what usePaginatedList used to provide, now
    // backed by real server pages instead of slicing an in-memory array.
    filtered: accumulated,
    mode,
    setMode: setModeAndReset,
    page,
    pageCount,
    goToPage,
    visibleItems: accumulated,
    hasMore: mode === 'infinite' && accumulated.length < total,
    loadMore,
    total,
    shown: accumulated.length,
  };
}
