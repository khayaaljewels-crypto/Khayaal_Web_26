import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Reveal from '@/components/animations/Reveal';
import ProductCard from '@/components/cards/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';
import 'swiper/css';

export default function ProductRail({ eyebrow, title, products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!products.length) return null;

  return (
    <section>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-heading text-2xl text-brown sm:text-3xl">{title}</h2>
      </Reveal>

      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="mt-8 !overflow-visible"
      >
        {products.map((product, i) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} index={i} onQuickView={setQuickViewProduct} />
          </SwiperSlide>
        ))}
      </Swiper>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
