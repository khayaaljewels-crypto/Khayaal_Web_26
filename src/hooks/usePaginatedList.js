import { useEffect, useMemo, useState } from 'react';

export function usePaginatedList(items, { pageSize = 12 } = {}) {
  const [mode, setMode] = useState('infinite'); // 'infinite' | 'pages'
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage(1);
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(() => {
    if (mode === 'pages') {
      const start = (page - 1) * pageSize;
      return items.slice(start, start + pageSize);
    }
    return items.slice(0, visibleCount);
  }, [items, mode, page, pageSize, visibleCount]);

  const hasMore = mode === 'infinite' && visibleCount < items.length;

  const loadMore = () => setVisibleCount((c) => Math.min(items.length, c + pageSize));

  const goToPage = (p) => {
    setPage(Math.min(Math.max(1, p), pageCount));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    mode,
    setMode,
    page,
    pageCount,
    goToPage,
    visibleItems,
    hasMore,
    loadMore,
    total: items.length,
    shown: visibleItems.length,
  };
}
