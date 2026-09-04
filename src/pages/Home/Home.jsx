import Hero from '@/components/sections/Hero';
import TrendingCollections from '@/components/sections/TrendingCollections';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import ProductGridSection from '@/components/sections/ProductGridSection';
import ShopByOccasion from '@/components/sections/ShopByOccasion';
import InstagramGallery from '@/components/sections/InstagramGallery';
import Newsletter from '@/components/sections/Newsletter';
import { useProductList } from '@/hooks/useProductList';

const BEST_SELLERS_FILTER = { isBestSeller: true, pageSize: 8 };
const NEW_ARRIVALS_FILTER = { isNewArrival: true, pageSize: 8 };

export default function Home() {
  const bestSellers = useProductList(BEST_SELLERS_FILTER);
  const newArrivals = useProductList(NEW_ARRIVALS_FILTER);

  return (
    <>
      <Hero />
      <TrendingCollections />
      <FeaturedCategories />
      <ProductGridSection
        eyebrow="Most Loved"
        title="Best Sellers"
        products={bestSellers.products}
        loading={bestSellers.loading}
        viewAllTo="/shop?filter=bestsellers"
      />
      <ShopByOccasion />
      <ProductGridSection
        eyebrow="Just Landed"
        title="New Arrivals"
        products={newArrivals.products}
        loading={newArrivals.loading}
        viewAllTo="/shop?filter=new"
        tint
      />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
