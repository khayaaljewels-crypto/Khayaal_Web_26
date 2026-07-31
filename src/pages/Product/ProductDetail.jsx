import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi2';
import { useProduct } from '@/hooks/useProduct';
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
  const { product, related, completeTheLook, loading, error, notFound } = useProduct(slug);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();

  const [activeVariantId, setActiveVariantId] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  // Pre-filled by the "Order Again" button in Order History (?qty=N)
  const [qty, setQty] = useState(() => {
    const fromQuery = Number(searchParams.get('qty'));
    return Number.isFinite(fromQuery) && fromQuery > 0 ? fromQuery : 1;
  });

  useEffect(() => {
    if (product) setActiveVariantId(product.variants[0]?.id);
  }, [product]);

  useEffect(() => {
    if (product) recordRecentlyViewed(product.id);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const prevTitle = document.title;
    document.title = product.seoTitle || `${product.name} | Khayaal Jewels`;
    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content');
    if (metaDescription && product.seoDescription) {
      metaDescription.setAttribute('content', product.seoDescription);
    }
    return () => {
      document.title = prevTitle;
      if (metaDescription && prevDescription) metaDescription.setAttribute('content', prevDescription);
    };
  }, [product]);

  const recentlyViewed = useRecentlyViewed(product?.id);

  if (notFound) return <Navigate to="/shop" replace />;

  if (loading) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center pt-28">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 pt-28 text-center">
        <p className="text-sm text-red-600">{error || 'Something went wrong loading this product.'}</p>
        <Link to="/shop" className="text-sm text-gold underline">Back to Shop</Link>
      </div>
    );
  }

  const activeVariant = product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const effectivePrice = product.price + (activeVariant?.priceDelta ?? 0);
  const effectiveOldPrice = product.oldPrice ? product.oldPrice + (activeVariant?.priceDelta ?? 0) : null;

  const displayImages = activeVariant?.image
    ? [activeVariant.image, ...product.images.filter((img) => img !== activeVariant.image)]
    : product.images;

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
          {product.category && (
            <>
              <HiChevronRight className="text-[10px]" />
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-gold">{product.category.name}</Link>
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
              activeVariantId={activeVariant?.id}
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
