import FilterPanelContent from './FilterPanelContent';

export default function FilterSidebar({ filtersApi }) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto rounded-2xl border border-border bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-heading text-lg text-brown">Filters</p>
          {filtersApi.activeChips.length > 0 && (
            <button
              onClick={filtersApi.clearAll}
              className="text-xs font-medium text-gold hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        <FilterPanelContent filtersApi={filtersApi} />
      </div>
    </aside>
  );
}
