import FilterSection from './FilterSection';
import FilterCheckbox from './FilterCheckbox';
import PriceRangeSlider from './PriceRangeSlider';
import { useCategories } from '@/context/CategoriesContext';

export default function FilterPanelContent({ filtersApi }) {
  const { filters, toggleFilter, setPriceRange } = filtersApi;

  const { visibleCategories } = useCategories();

  return (
    <div>
      <FilterSection title="Price">
        <PriceRangeSlider value={filters.priceRange} onChange={setPriceRange} />
      </FilterSection>

      <FilterSection title="Category">
        {visibleCategories.map((c) => (
          <FilterCheckbox
            key={c.value}
            label={c.label}
            checked={filters.categories.includes(c.value)}
            onChange={() => toggleFilter('categories', c.value)}
          />
        ))}
      </FilterSection>

    </div>
  );
}
