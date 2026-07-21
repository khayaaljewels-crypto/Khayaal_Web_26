import Hero from '@/components/sections/Hero';
import TrendingCollections from '@/components/sections/TrendingCollections';
import FeaturedCategories from '@/components/sections/FeaturedCategories';
import ProductGridSection from '@/components/sections/ProductGridSection';
import ShopByOccasion from '@/components/sections/ShopByOccasion';
import Testimonials from '@/components/sections/Testimonials';
import InstagramGallery from '@/components/sections/InstagramGallery';
import Newsletter from '@/components/sections/Newsletter';
import { useProducts } from '@/context/ProductsContext';

export default function Home() {
  const { bestSellers, newArrivals } = useProducts();

  return (
    <>
      <Hero />
      <TrendingCollections />
      <FeaturedCategories />
      <ProductGridSection
        eyebrow="Most Loved"
        title="Best Sellers"
        products={bestSellers}
        viewAllTo="/shop?filter=bestsellers"
      />
      <ShopByOccasion />
      <ProductGridSection
        eyebrow="Just Landed"
        title="New Arrivals"
        products={newArrivals}
        viewAllTo="/shop?filter=new"
        tint
      />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
