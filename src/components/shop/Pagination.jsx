import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

function getPageList(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;
  const pages = getPageList(page, pageCount);

  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold disabled:opacity-30"
      >
        <HiChevronLeft />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-text/30">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
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
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold disabled:opacity-30"
      >
        <HiChevronRight />
      </button>
    </nav>
  );
}
