import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Pagination from './Pagination';

export default function LoadMoreControl({ pagination }) {
  const { mode, setMode, hasMore, loadMore, page, pageCount, goToPage, total, shown } = pagination;
  const [sentinelRef, sentinelInView] = useInView({ rootMargin: '400px' });

  useEffect(() => {
    if (mode === 'infinite' && sentinelInView && hasMore) loadMore();
  }, [sentinelInView, hasMore, mode, loadMore]);

  if (total === 0) return null;

  return (
    <div className="mt-4">
      {mode === 'infinite' ? (
        <>
          {hasMore && (
            <div ref={sentinelRef} className="flex flex-col items-center gap-4 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <button
                onClick={loadMore}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-brown transition-colors hover:border-gold hover:text-gold"
              >
                Load More
              </button>
            </div>
          )}
          <p className="pb-2 text-center text-xs text-text/50">
            Showing {shown} of {total} products
          </p>
        </>
      ) : (
        <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setMode(mode === 'infinite' ? 'pages' : 'infinite')}
          className="text-xs font-medium text-text/50 underline-offset-2 hover:text-gold hover:underline"
        >
          Switch to {mode === 'infinite' ? 'page numbers' : 'infinite scroll'}
        </button>
      </div>
    </div>
  );
}
