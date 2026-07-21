import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi2';
import { useProducts } from '@/context/ProductsContext';
import { useCategories } from '@/context/CategoriesContext';
import { useCart } from '@/context/CartContext';
import { useRecentlyViewed, recordRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ImageGallery from '@/components/product/ImageGallery';
import PurchasePanel from '@/components/product/PurchasePanel';
import StickyMobileBar from '@/components/product/StickyMobileBar';
import InfoTabs from '@/components/product/InfoTabs';
import ReviewsSection from '@/components/product/ReviewsSection';
import ProductRail from '@/components/product/ProductRail';
import Reveal from '@/components/animations/Reveal';

export default function ProductDetail() {
  const { slug } = useParams();
  const { getBySlug, getRelatedProducts, getCompleteTheLook } = useProducts();
  const { categories } = useCategories();
  const product = getBySlug(slug);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();

  const [activeVariantId, setActiveVariantId] = useState(product?.variants[0]?.id);
  const [activeSize, setActiveSize] = useState(null);
  // Pre-filled by the "Order Again" button in Order History (?qty=N)
  const [qty, setQty] = useState(() => {
    const fromQuery = Number(searchParams.get('qty'));
    return Number.isFinite(fromQuery) && fromQuery > 0 ? fromQuery : 1;
  });

  useEffect(() => {
    if (product) recordRecentlyViewed(product.id);
  }, [product]);

  const recentlyViewed = useRecentlyViewed(product?.id);
  const related = useMemo(() => (product ? getRelatedProducts(product) : []), [product]);
  const completeTheLook = useMemo(() => (product ? getCompleteTheLook(product) : []), [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const activeVariant = product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const effectivePrice = product.price + activeVariant.priceDelta;
  const effectiveOldPrice = product.oldPrice ? product.oldPrice + activeVariant.priceDelta : null;

  const displayImages = [activeVariant.image, ...product.images.filter((img) => img !== activeVariant.image)];

  const category = categories.find((c) => c.slug === product.category);
  const sizeRequired = Boolean(product.ringSizes) && !activeSize;
  const purchaseDisabled = !product.inStock || sizeRequired;

  const handleAddToCart = () => {
    if (purchaseDisabled) return;
    addItem(product, { quantity: qty, variant: activeVariantId });
  };

  const handleBuyNow = () => {
    if (purchaseDisabled) return;
    addItem(product, { quantity: qty, variant: activeVariantId });
    navigate('/checkout');
  };

  return (
    <div className="bg-bg pb-40 pt-28 sm:pb-24 lg:pt-32">
      <div className="container-luxury">
        <Reveal className="flex flex-wrap items-center gap-1.5 text-xs text-text/50">
          <Link to="/" className="hover:text-gold">Home</Link>
          <HiChevronRight className="text-[10px]" />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          {category && (
            <>
              <HiChevronRight className="text-[10px]" />
              <Link to={`/shop?category=${category.slug}`} className="hover:text-gold">{category.name}</Link>
            </>
          )}
          <HiChevronRight className="text-[10px]" />
          <span className="text-brown">{product.name}</span>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal direction="left">
            <ImageGallery
              images={displayImages}
              productName={product.name}
              badge={product.isNewArrival ? 'NEW' : product.discount > 0 ? `-${product.discount}%` : null}
            />
          </Reveal>

          <Reveal direction="right" className="lg:sticky lg:top-28 lg:self-start">
            <PurchasePanel
              product={product}
              activeVariantId={activeVariant.id}
              onVariantChange={setActiveVariantId}
              activeSize={activeSize}
              onSizeChange={setActiveSize}
              qty={qty}
              onQtyChange={setQty}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              effectivePrice={effectivePrice}
              effectiveOldPrice={effectiveOldPrice}
            />
          </Reveal>
        </div>

        <div className="mt-16">
          <InfoTabs product={product} />
        </div>

        <div className="mt-16">
          <ReviewsSection product={product} />
        </div>

        <div className="mt-20 space-y-20">
          <ProductRail eyebrow="Pairs Well" title="Complete The Look" products={completeTheLook} />
          <ProductRail eyebrow="You May Also Like" title="Related Products" products={related} />
          <ProductRail eyebrow="Your History" title="Recently Viewed" products={recentlyViewed} />
        </div>
      </div>

      <StickyMobileBar
        product={product}
        effectivePrice={effectivePrice}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        disabled={purchaseDisabled}
      />
    </div>
  );
}
