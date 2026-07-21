import { useEffect, useRef, useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineSquares2X2, HiOutlineBars3, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { SORT_OPTIONS } from '@/hooks/useProductFilters';

export default function ShopToolbar({ filtersApi, total, onOpenMobileFilters }) {
  const { filters, setSearch, sort, setSort, view, setView } = filtersApi;
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef(null);

  useEffect(() => setSearchInput(filters.search), [filters.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(value), 300);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text/40 focus:border-gold focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-xs text-text/60 sm:mr-2">
          <span className="font-medium text-brown">{total}</span> Products
        </p>

        <button
          onClick={onOpenMobileFilters}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-brown lg:hidden"
        >
          <HiOutlineAdjustmentsHorizontal /> Filters
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-brown focus:border-gold focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="hidden items-center gap-1 rounded-full border border-border p-1 sm:flex">
          <button
            onClick={() => setView('grid')}
            aria-label="Grid view"
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              view === 'grid' ? 'bg-brown text-white' : 'text-brown/50'
            }`}
          >
            <HiOutlineSquares2X2 className="text-sm" />
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="List view"
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              view === 'list' ? 'bg-brown text-white' : 'text-brown/50'
            }`}
          >
            <HiOutlineBars3 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
