import { useMemo } from 'react';
import { HiStar } from 'react-icons/hi2';
import FilterSection from './FilterSection';
import FilterCheckbox from './FilterCheckbox';
import PriceRangeSlider from './PriceRangeSlider';
import { useProductFacets } from '@/hooks/useProductFacets';
import { useCategories } from '@/context/CategoriesContext';
import { useCollections } from '@/context/CollectionsContext';

const RATING_OPTIONS = [4.5, 4, 3.5, 3];
const DISCOUNT_OPTIONS = [10, 20, 30, 40];

export default function FilterPanelContent({ filtersApi }) {
  const {
    filters,
    toggleFilter,
    setAvailability,
    setMinRating,
    setMinDiscount,
    setPriceRange,
  } = filtersApi;

  const { materials, stones, colors, occasions } = useProductFacets();
  const { visibleCategories } = useCategories();
  const { visibleCollections } = useCollections();

  const FILTER_OPTIONS = useMemo(
    () => ({
      categories: visibleCategories.map((c) => ({ value: c.slug, label: c.name })),
      collections: visibleCollections.map((c) => ({ value: c.slug, label: c.name })),
      materials,
      stones,
      colors,
      occasions,
    }),
    [visibleCategories, visibleCollections, materials, stones, colors, occasions]
  );

  return (
    <div>
      <FilterSection title="Price">
        <PriceRangeSlider value={filters.priceRange} onChange={setPriceRange} />
      </FilterSection>

      <FilterSection title="Category">
        {FILTER_OPTIONS.categories.map((c) => (
          <FilterCheckbox
            key={c.value}
            label={c.label}
            checked={filters.categories.includes(c.value)}
            onChange={() => toggleFilter('categories', c.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Collection" defaultOpen={false}>
        {FILTER_OPTIONS.collections.map((c) => (
          <FilterCheckbox
            key={c.value}
            label={c.label}
            checked={filters.collections.includes(c.value)}
            onChange={() => toggleFilter('collections', c.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Material" defaultOpen={false}>
        {FILTER_OPTIONS.materials.map((m) => (
          <FilterCheckbox
            key={m}
            label={m}
            checked={filters.materials.includes(m)}
            onChange={() => toggleFilter('materials', m)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Stone" defaultOpen={false}>
        {FILTER_OPTIONS.stones.map((s) => (
          <FilterCheckbox
            key={s}
            label={s}
            checked={filters.stones.includes(s)}
            onChange={() => toggleFilter('stones', s)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Color" defaultOpen={false}>
        {FILTER_OPTIONS.colors.map((c) => (
          <FilterCheckbox
            key={c}
            label={c}
            checked={filters.colors.includes(c)}
            onChange={() => toggleFilter('colors', c)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Occasion" defaultOpen={false}>
        {FILTER_OPTIONS.occasions.map((o) => (
          <FilterCheckbox
            key={o}
            label={o.replace(/-/g, ' ')}
            checked={filters.occasions.includes(o)}
            onChange={() => toggleFilter('occasions', o)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        {[
          { value: 'all', label: 'All' },
          { value: 'in-stock', label: 'In Stock' },
          { value: 'out-of-stock', label: 'Out of Stock' },
        ].map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-text/80 hover:text-brown"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                filters.availability === opt.value ? 'border-gold' : 'border-border'
              }`}
            >
              {filters.availability === opt.value && <span className="h-2 w-2 rounded-full bg-gold" />}
            </span>
            {opt.label}
            <input
              type="radio"
              className="sr-only"
              checked={filters.availability === opt.value}
              onChange={() => setAvailability(opt.value)}
            />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Rating" defaultOpen={false}>
        {RATING_OPTIONS.map((r) => (
          <label
            key={r}
            className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-text/80 hover:text-brown"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                filters.minRating === r ? 'border-gold' : 'border-border'
              }`}
            >
              {filters.minRating === r && <span className="h-2 w-2 rounded-full bg-gold" />}
            </span>
            <span className="flex items-center gap-1">
              {r}
              <HiStar className="text-gold" /> &amp; up
            </span>
            <input
              type="radio"
              className="sr-only"
              checked={filters.minRating === r}
              onChange={() => setMinRating(filters.minRating === r ? 0 : r)}
            />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Discount" defaultOpen={false}>
        {DISCOUNT_OPTIONS.map((d) => (
          <label
            key={d}
            className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-text/80 hover:text-brown"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                filters.minDiscount === d ? 'border-gold' : 'border-border'
              }`}
            >
              {filters.minDiscount === d && <span className="h-2 w-2 rounded-full bg-gold" />}
            </span>
            {d}% off & up
            <input
              type="radio"
              className="sr-only"
              checked={filters.minDiscount === d}
              onChange={() => setMinDiscount(filters.minDiscount === d ? 0 : d)}
            />
          </label>
        ))}
      </FilterSection>
    </div>
  );
}
