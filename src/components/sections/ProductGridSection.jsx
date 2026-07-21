import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/animations/Reveal';
import ProductCard from '@/components/cards/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';

export default function ProductGridSection({ eyebrow, title, products, viewAllTo, tint = false }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className={`py-20 lg:py-28 ${tint ? 'bg-beige/50' : ''}`}>
      <div className="container-luxury">
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

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
