import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/animations/Reveal';
import ProductCard from '@/components/cards/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';
import ProductGridSkeleton from '@/components/shop/ProductGridSkeleton';

export default function ProductGridSection({
  eyebrow,
  title,
  products,
  viewAllTo,
  tint = false,
  loading = false,
  compact = false,
}) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!loading && !products.length) return null;

  return (
    <section className={`${compact ? 'py-7 sm:py-9 lg:py-10' : 'py-12 lg:py-16'} ${tint ? 'bg-beige/50' : ''}`}>
      <div className="container-luxury">
        {compact ? (
          <Reveal className="mb-5 flex items-end justify-between border-b border-border pb-4 sm:mb-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">Curated for you</p>
              <h2 className="mt-1 font-heading text-2xl text-brown sm:text-3xl">{title}</h2>
            </div>
            <Link to="/shop" className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-brown transition-colors hover:text-gold">Shop all</Link>
          </Reveal>
        ) : (
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">{title}</h2>
            </div>
            {viewAllTo && (
              <Link to={viewAllTo} className="text-sm font-medium text-gold underline-offset-4 hover:underline">
                View All
              </Link>
            )}
          </Reveal>
        )}

        {loading ? (
          <div className={compact ? '' : 'mt-12'}>
            <ProductGridSkeleton count={8} />
          </div>
        ) : (
          <div className={`${compact ? '' : 'mt-8'} grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-4`}>
            {products.slice(0, compact ? 12 : 8).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
