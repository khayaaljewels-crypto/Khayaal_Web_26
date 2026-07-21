import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

function getPageList(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;
  const pages = getPageList(page, pageCount);

  return (
    <nav className="mt-14 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold disabled:opacity-30 sm:h-9 sm:w-9"
      >
        <HiChevronLeft />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex shrink-0 items-center gap-1 sm:gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-text/30">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors sm:h-9 sm:w-9 ${
              p === page ? 'bg-brown text-white' : 'text-brown/70 hover:bg-beige'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold disabled:opacity-30 sm:h-9 sm:w-9"
      >
        <HiChevronRight />
      </button>
    </nav>
  );
}
