import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '@/components/animations/Reveal';
import ProductCard from '@/components/cards/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';
import ActiveFilterChips from '@/components/shop/ActiveFilterChips';
import ShopToolbar from '@/components/shop/ShopToolbar';
import ProductGridSkeleton from '@/components/shop/ProductGridSkeleton';
import EmptyState from '@/components/shop/EmptyState';
import LoadMoreControl from '@/components/shop/LoadMoreControl';
import { useProductFilters } from '@/hooks/useProductFilters';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { useProducts } from '@/context/ProductsContext';

const HEADINGS = {
  new: { eyebrow: 'Just Landed', title: 'New Arrivals' },
  bestsellers: { eyebrow: 'Most Loved', title: 'Best Sellers' },
  default: { eyebrow: 'The Full Collection', title: 'Shop All Jewellery' },
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const { products, bestSellers, newArrivals } = useProducts();

  const filterParam = searchParams.get('filter');
  const categoryParam = searchParams.get('category');
  const occasionParam = searchParams.get('occasion');
  const searchParam = searchParams.get('search');

  const baseProducts = useMemo(() => {
    if (filterParam === 'new') return newArrivals;
    if (filterParam === 'bestsellers') return bestSellers;
    return products;
  }, [filterParam, products, bestSellers, newArrivals]);

  const filtersApi = useProductFilters(baseProducts);
  const { patchFilters } = filtersApi;

  useEffect(() => {
    const patch = {};
    if (categoryParam) patch.categories = [categoryParam];
    if (occasionParam) patch.occasions = [occasionParam];
    if (searchParam) patch.search = searchParam;
    if (Object.keys(patch).length) patchFilters(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam, occasionParam, searchParam]);

  const pagination = usePaginatedList(filtersApi.filtered, { pageSize: 12 });

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [filtersApi.filtered, filtersApi.view]);

  const heading = HEADINGS[filterParam] ?? HEADINGS.default;

  return (
    <div className="bg-bg pb-24 pt-28 lg:pt-32">
      <div className="container-luxury">
        <Reveal>
          <p className="eyebrow">{heading.eyebrow}</p>
          <h1 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">{heading.title}</h1>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <FilterSidebar filtersApi={filtersApi} />

          <div className="min-w-0 flex-1">
            <ShopToolbar
              filtersApi={filtersApi}
              total={filtersApi.filtered.length}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <ActiveFilterChips
              chips={filtersApi.activeChips}
              onRemove={filtersApi.removeChip}
              onClearAll={filtersApi.clearAll}
            />

            <div className="mt-6">
              {loading ? (
                <ProductGridSkeleton view={filtersApi.view} count={filtersApi.view === 'grid' ? 8 : 4} />
              ) : filtersApi.filtered.length === 0 ? (
                <EmptyState onClearAll={filtersApi.clearAll} />
              ) : (
                <>
                  <motion.div
                    layout
                    className={
                      filtersApi.view === 'grid'
                        ? 'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4'
                        : 'flex flex-col gap-5'
                    }
                  >
                    {pagination.visibleItems.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        view={filtersApi.view}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </motion.div>

                  <LoadMoreControl pagination={pagination} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filtersApi={filtersApi}
        resultCount={filtersApi.filtered.length}
      />

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
