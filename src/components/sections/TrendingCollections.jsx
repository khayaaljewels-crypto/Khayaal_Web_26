import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Reveal from '@/components/animations/Reveal';
import { useCategories } from '@/context/CategoriesContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import 'swiper/css';
import 'swiper/css/free-mode';

export default function TrendingCollections() {
  const { visibleCategories: categories } = useCategories();

  return (
    <section className="bg-beige/50 py-20 lg:py-28">
      <div className="container-luxury">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">What's Hot</p>
            <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Trending Collections</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-gold underline-offset-4 hover:underline">
            View All Collections
          </Link>
        </Reveal>
      </div>

      <div className="container-luxury mt-12">
        <Swiper
          modules={[FreeMode, Autoplay]}
          spaceBetween={20}
          freeMode
          autoplay={{ delay: 2600, disableOnInteraction: true }}
          breakpoints={{
            0: { slidesPerView: 1.4 },
            640: { slidesPerView: 2.4 },
            1024: { slidesPerView: 3.4 },
            1280: { slidesPerView: 4.2 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <Link to={`/shop?category=${cat.slug}`} className="group block" data-cursor-hover>
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-900 ease-luxury group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brown/80 via-brown/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-heading text-xl text-white">{cat.name}</p>
                    <p className="mt-1 text-xs tracking-wide text-white/70">Explore Collection</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
