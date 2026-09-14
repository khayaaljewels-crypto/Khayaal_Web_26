import FilterSection from './FilterSection';
import FilterCheckbox from './FilterCheckbox';
import PriceRangeSlider from './PriceRangeSlider';
import { useCategories } from '@/context/CategoriesContext';
import { useOccasions } from '@/context/OccasionsContext';
import { ALL_OCCASIONS_NAME, ALL_OCCASIONS_SLUG } from '@/utils/occasions';

export default function FilterPanelContent({ filtersApi }) {
  const { filters, toggleFilter, setPriceRange } = filtersApi;

  const { visibleCategories } = useCategories();
  const { visibleOccasions } = useOccasions();

  return (
    <div>
      <FilterSection title="Price">
        <PriceRangeSlider value={filters.priceRange} onChange={setPriceRange} />
      </FilterSection>

      <FilterSection title="Category">
        {visibleCategories.map((c) => (
          <FilterCheckbox
            key={c.id ?? c.slug}
            label={c.name}
            checked={filters.categories.includes(c.slug)}
            onChange={() => toggleFilter('categories', c.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Occasion">
        <FilterCheckbox
          label={ALL_OCCASIONS_NAME}
          checked={filters.occasions.includes(ALL_OCCASIONS_SLUG)}
          onChange={() => toggleFilter('occasions', ALL_OCCASIONS_SLUG)}
        />
        {visibleOccasions.filter((occasion) => occasion.slug !== ALL_OCCASIONS_SLUG).map((occasion) => (
          <FilterCheckbox
            key={occasion.id ?? occasion.slug}
            label={occasion.name}
            checked={filters.occasions.includes(occasion.slug)}
            onChange={() => toggleFilter('occasions', occasion.slug)}
          />
        ))}
      </FilterSection>

    </div>
  );
}
