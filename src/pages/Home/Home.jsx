import Hero from '@/components/sections/Hero';
import ProductGridSection from '@/components/sections/ProductGridSection';
import InstagramGallery from '@/components/sections/InstagramGallery';
import { useProductList } from '@/hooks/useProductList';

const HOME_PRODUCTS_FILTER = { pageSize: 12 };

export default function Home() {
  const productList = useProductList(HOME_PRODUCTS_FILTER);

  return (
    <>
      <Hero />
      <ProductGridSection
        title="Featured Jewellery"
        products={productList.products}
        loading={productList.loading}
        compact
        showRatings={false}
      />
      <InstagramGallery />
    </>
  );
}
